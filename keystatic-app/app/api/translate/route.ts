import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const REPO = 'makowskimarek/kancelaria'
const GH_API = 'https://api.github.com'
const DEEPL_API = process.env.DEEPL_API_URL ?? 'https://api-free.deepl.com/v2/translate'

type GHFile = { name: string; sha: string; content: string }

function getGhToken(): string {
  const fromCookie = cookies().get('keystatic-gh-access-token')?.value
  const token = fromCookie ?? process.env.GITHUB_TOKEN
  if (!token) throw new Error('Brak tokenu GitHub — zaloguj się przez Keystatic lub ustaw GITHUB_TOKEN')
  return token
}

async function ghGet(path: string) {
  const res = await fetch(`${GH_API}/repos/${REPO}/contents/${path}`, {
    headers: {
      Authorization: `Bearer ${getGhToken()}`,
      Accept: 'application/vnd.github+json',
    },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`GitHub GET ${path}: ${res.status}`)
  return res.json()
}

async function ghPut(path: string, content: string, message: string, sha?: string) {
  const body: Record<string, string> = {
    message,
    content: Buffer.from(content, 'utf-8').toString('base64'),
  }
  if (sha) body.sha = sha

  const res = await fetch(`${GH_API}/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getGhToken()}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`GitHub PUT ${path}: ${res.status} ${await res.text()}`)
  return res.json()
}

async function deepl(texts: string[]): Promise<string[]> {
  const nonEmpty = texts.map(t => t || ' ')
  const res = await fetch(DEEPL_API, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: nonEmpty,
      source_lang: 'PL',
      target_lang: 'EN-GB',
      preserve_formatting: true,
      tag_handling: 'off',
    }),
  })
  if (!res.ok) throw new Error(`DeepL ${res.status}: ${await res.text()}`)
  const data = await res.json()
  return data.translations.map((t: { text: string }) => t.text.trim())
}

// Parsuje frontmatter w formacie YAML (obsługuje >- multiline)
function parseFm(raw: string): { fm: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { fm: {}, body: raw }

  const fm: Record<string, string> = {}
  const lines = match[1].split(/\r?\n/)
  let i = 0

  while (i < lines.length) {
    const kv = lines[i].match(/^(\w+):\s*(.*)$/)
    if (!kv) { i++; continue }

    const key = kv[1]
    const val = kv[2].trim()

    if (val === '>-' || val === '>') {
      const parts: string[] = []
      i++
      while (i < lines.length && /^\s/.test(lines[i])) {
        parts.push(lines[i].trim())
        i++
      }
      fm[key] = parts.join(' ')
    } else {
      fm[key] = val.replace(/^["']|["']$/g, '')
      i++
    }
  }

  return { fm, body: match[2] }
}

function buildFm(fm: Record<string, string>): string {
  return Object.entries(fm).map(([key, value]) => {
    if (!value) return `${key}: `
    // Długie wartości lub zawierające spacje → folded scalar
    if (value.length > 60) {
      const words = value.split(' ')
      const rows: string[] = []
      let line = ''
      for (const w of words) {
        if (line.length + w.length + 1 > 76) { rows.push('  ' + line.trimEnd()); line = '' }
        line += w + ' '
      }
      if (line.trim()) rows.push('  ' + line.trimEnd())
      return `${key}: >-\n${rows.join('\n')}`
    }
    // Wartości wymagające cudzysłowu
    if (/[:#{}[\]|>&*!,]/.test(value)) return `${key}: "${value.replace(/"/g, '\\"')}"`
    return `${key}: ${value}`
  }).join('\n')
}

// GET /api/translate — lista wpisów PL ze statusem EN
export async function GET() {
  try {
    const plFiles: GHFile[] = await ghGet('content/blog/pl')
    const enFiles: GHFile[] = await ghGet('content/blog/en').catch(() => [])

    const enSlugs = new Set(
      enFiles
        .filter(f => f.name?.endsWith('.md'))
        .map(f => f.name.replace(/\.md$/, ''))
    )

    const posts = await Promise.all(
      plFiles
        .filter(f => f.name.endsWith('.md'))
        .map(async f => {
          const slug = f.name.replace(/\.md$/, '')
          const file: GHFile = await ghGet(`content/blog/pl/${f.name}`)
          const raw = Buffer.from(file.content, 'base64').toString('utf-8')
          const { fm } = parseFm(raw)
          return { slug, title: fm.title || slug, date: fm.date || '', hasEn: enSlugs.has(slug) }
        })
    )

    posts.sort((a, b) => b.date.localeCompare(a.date))
    return NextResponse.json(posts)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

// POST /api/translate — tłumaczy jeden wpis PL → EN
export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json() as { slug?: string }
    if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

    const plFile: GHFile = await ghGet(`content/blog/pl/${slug}.md`)
    const raw = Buffer.from(plFile.content, 'base64').toString('utf-8')
    const { fm, body } = parseFm(raw)

    // Tłumaczymy: title, category, excerpt, ctaTitle, ctaText, treść MD
    const [title, category, excerpt, ctaTitle, ctaText, enBody] = await deepl([
      fm.title ?? '',
      fm.category ?? '',
      fm.excerpt ?? '',
      fm.ctaTitle ?? '',
      fm.ctaText ?? '',
      body,
    ])

    const enFm = { ...fm, title, category, excerpt, ctaTitle, ctaText }
    const enContent = `---\n${buildFm(enFm)}\n---\n${enBody}`

    const existing: GHFile | null = await ghGet(`content/blog/en/${slug}.md`).catch(() => null)

    await ghPut(
      `content/blog/en/${slug}.md`,
      enContent,
      `translate(deepl): ${slug} PL→EN`,
      existing?.sha,
    )

    return NextResponse.json({ ok: true, slug })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

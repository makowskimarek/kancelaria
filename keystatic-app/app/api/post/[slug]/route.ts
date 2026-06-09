import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const REPO = 'makowskimarek/kancelaria'
const GH_API = 'https://api.github.com'

function getGhToken(): string {
  const fromCookie = cookies().get('keystatic-gh-access-token')?.value
  const token = fromCookie ?? process.env.GITHUB_TOKEN
  if (!token) throw new Error('Brak tokenu GitHub — zaloguj się przez Keystatic lub ustaw GITHUB_TOKEN')
  return token
}

async function ghGet(path: string) {
  const res = await fetch(`${GH_API}/repos/${REPO}/contents/${path}`, {
    headers: { Authorization: `Bearer ${getGhToken()}`, Accept: 'application/vnd.github+json' },
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
      while (i < lines.length && /^\s/.test(lines[i])) { parts.push(lines[i].trim()); i++ }
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
    if (/[:#{}[\]|>&*!,]/.test(value)) return `${key}: "${value.replace(/"/g, '\\"')}"`
    return `${key}: ${value}`
  }).join('\n')
}

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const [plFile, enFile] = await Promise.all([
      ghGet(`content/blog/pl/${slug}.md`),
      ghGet(`content/blog/en/${slug}.md`).catch(() => null),
    ])
    const plRaw = Buffer.from(plFile.content, 'base64').toString('utf-8')
    const pl = parseFm(plRaw)
    let en = null
    let enSha = null
    if (enFile) {
      const enRaw = Buffer.from(enFile.content, 'base64').toString('utf-8')
      en = parseFm(enRaw)
      enSha = enFile.sha
    }
    return NextResponse.json({ pl, en, plSha: plFile.sha, enSha })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

type LangPayload = { fm: Record<string, string>; body: string; sha?: string }

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const { pl, en } = await req.json() as { pl?: LangPayload; en?: LangPayload }

    const saves = await Promise.all([
      pl ? ghPut(`content/blog/pl/${slug}.md`, `---\n${buildFm(pl.fm)}\n---\n${pl.body}`, `edit(manual): ${slug} PL`, pl.sha)
         : Promise.resolve(null),
      en ? ghPut(`content/blog/en/${slug}.md`, `---\n${buildFm(en.fm)}\n---\n${en.body}`, `edit(manual): ${slug} EN`, en.sha)
         : Promise.resolve(null),
    ])

    return NextResponse.json({
      ok: true,
      plSha: saves[0]?.content?.sha,
      enSha: saves[1]?.content?.sha,
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

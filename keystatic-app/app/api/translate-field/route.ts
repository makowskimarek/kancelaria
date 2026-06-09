import { NextRequest, NextResponse } from 'next/server'

const DEEPL_API = process.env.DEEPL_API_URL ?? 'https://api-free.deepl.com/v2/translate'

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json() as { text: string }
    if (!text?.trim()) return NextResponse.json({ translated: '' })

    const res = await fetch(DEEPL_API, {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        source_lang: 'PL',
        target_lang: 'EN-GB',
        preserve_formatting: true,
        tag_handling: 'off',
      }),
    })
    if (!res.ok) throw new Error(`DeepL ${res.status}: ${await res.text()}`)
    const data = await res.json()
    return NextResponse.json({ translated: data.translations[0].text.trim() })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

'use client'
import { useEffect, useState } from 'react'
import Nav from '../../components/Nav'

type Fm = Record<string, string>
type PostData = { fm: Fm; body: string }
type FieldStatus = 'idle' | 'translating' | 'ok' | 'error'

const TEXT_FIELDS: { key: string; label: string; multiline?: boolean }[] = [
  { key: 'title',    label: 'Tytuł' },
  { key: 'category', label: 'Kategoria' },
  { key: 'excerpt',  label: 'Fragment', multiline: true },
  { key: 'ctaTitle', label: 'CTA — tytuł' },
  { key: 'ctaText',  label: 'CTA — treść', multiline: true },
]

const BTN_LABEL: Record<FieldStatus, string> = {
  idle: 'Tłumacz',
  translating: '…',
  ok: '✓',
  error: '!',
}

const BTN_COLOR: Record<FieldStatus, string> = {
  idle: '#6b7280',
  translating: '#9ca3af',
  ok: '#059669',
  error: '#dc2626',
}

export default function EditPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const [pl, setPl] = useState<PostData | null>(null)
  const [en, setEn] = useState<PostData | null>(null)
  const [plSha, setPlSha] = useState<string | null>(null)
  const [enSha, setEnSha] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [fieldStatus, setFieldStatus] = useState<Record<string, FieldStatus>>({})
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    fetch(`/api/post/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); return }
        setPl(data.pl)
        const emptyEn: PostData = {
          fm: { ...data.pl.fm, title: '', category: '', excerpt: '', ctaTitle: '', ctaText: '' },
          body: '',
        }
        setEn(data.en ?? emptyEn)
        setPlSha(data.plSha)
        setEnSha(data.enSha)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [slug])

  function setField(lang: 'pl' | 'en', field: string, value: string) {
    const setter = lang === 'pl' ? setPl : setEn
    setter(prev => prev
      ? field === 'body'
        ? { ...prev, body: value }
        : { ...prev, fm: { ...prev.fm, [field]: value } }
      : prev
    )
  }

  async function translateField(field: string) {
    if (!pl || !en) return
    const text = field === 'body' ? pl.body : (pl.fm[field] ?? '')
    if (!text.trim()) return
    setFieldStatus(s => ({ ...s, [field]: 'translating' }))
    try {
      const res = await fetch('/api/translate-field', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setField('en', field, data.translated)
      setFieldStatus(s => ({ ...s, [field]: 'ok' }))
    } catch {
      setFieldStatus(s => ({ ...s, [field]: 'error' }))
    }
  }

  async function translateAll() {
    for (const { key } of TEXT_FIELDS) {
      await translateField(key)
    }
    await translateField('body')
  }

  async function save() {
    if (!pl || !en) return
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await fetch(`/api/post/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pl: { fm: pl.fm, body: pl.body, sha: plSha ?? undefined },
          en: { fm: en.fm, body: en.body, sha: enSha ?? undefined },
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      if (data.plSha) setPlSha(data.plSha)
      if (data.enSha) setEnSha(data.enSha)
      setSaveMsg('Zapisano!')
    } catch (e) {
      setSaveMsg(`Błąd: ${String(e)}`)
    } finally {
      setSaving(false)
    }
  }

  const s = { fontFamily: 'system-ui, sans-serif', maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }

  if (loading) return <><Nav /><main style={s}><p style={{ color: '#6b7280' }}>Ładowanie…</p></main></>
  if (error) return (
    <><Nav /><main style={s}>
      <div style={errBox}><strong>Błąd:</strong> {error}</div>
    </main></>
  )
  if (!pl || !en) return null

  return (
    <>
    <Nav />
    <main style={s}>
      {/* Nagłówek */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 700, fontSize: 17 }}>{pl.fm.title || slug}</span>
        <code style={{ fontSize: 12, color: '#9ca3af', background: '#f3f4f6', padding: '2px 8px', borderRadius: 4 }}>{slug}</code>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={translateAll} style={{ ...btnStyle, background: '#1d4ed8' }}>
            Przetłumacz wszystko
          </button>
          <button onClick={save} disabled={saving} style={{ ...btnStyle, background: saving ? '#9ca3af' : '#059669' }}>
            {saving ? 'Zapisuję…' : 'Zapisz EN'}
          </button>
          {saveMsg && (
            <span style={{ fontSize: 13, color: saveMsg.startsWith('Błąd') ? '#dc2626' : '#059669', fontWeight: 500 }}>
              {saveMsg}
            </span>
          )}
        </div>
      </div>

      {/* Nagłówki kolumn */}
      <div style={grid}>
        <div style={colHeader}>PL</div>
        <div />
        <div style={colHeader}>EN</div>
      </div>

      {/* Pola tekstowe */}
      {TEXT_FIELDS.map(({ key, label, multiline }) => {
        const status: FieldStatus = fieldStatus[key] ?? 'idle'
        const plVal = pl.fm[key] ?? ''
        const enVal = en.fm[key] ?? ''
        return (
          <div key={key} style={{ ...grid, marginBottom: 16 }}>
            <label style={labelStyle}>{label}</label>
            <div />
            <label style={labelStyle}>{label}</label>

            {multiline
              ? <textarea value={plVal} onChange={e => setField('pl', key, e.target.value)} style={{ ...inputStyle, ...textareaStyle }} />
              : <input value={plVal} onChange={e => setField('pl', key, e.target.value)} style={inputStyle} />
            }

            <button
              onClick={() => translateField(key)}
              disabled={status === 'translating' || !plVal.trim()}
              title={BTN_LABEL[status]}
              style={{
                ...translateBtn,
                background: BTN_COLOR[status],
                cursor: status === 'translating' ? 'wait' : 'pointer',
                opacity: !plVal.trim() ? 0.3 : 1,
              }}
            >
              {BTN_LABEL[status]}
            </button>

            {multiline
              ? <textarea value={enVal} onChange={e => setField('en', key, e.target.value)} style={{ ...inputStyle, ...textareaStyle }} />
              : <input value={enVal} onChange={e => setField('en', key, e.target.value)} style={inputStyle} />
            }
          </div>
        )
      })}

      {/* Treść MD */}
      <div style={{ ...grid, marginTop: 8 }}>
        <label style={labelStyle}>Treść (Markdown)</label>
        <div />
        <label style={labelStyle}>Treść (Markdown)</label>

        <textarea value={pl.body} onChange={e => setField('pl', 'body', e.target.value)} style={{ ...inputStyle, ...bodyStyle }} />

        <button
          onClick={() => translateField('body')}
          disabled={(fieldStatus['body'] ?? 'idle') === 'translating' || !pl.body.trim()}
          title={BTN_LABEL[fieldStatus['body'] ?? 'idle']}
          style={{
            ...translateBtn,
            background: BTN_COLOR[fieldStatus['body'] ?? 'idle'],
            cursor: (fieldStatus['body'] ?? 'idle') === 'translating' ? 'wait' : 'pointer',
            alignSelf: 'flex-start',
            marginTop: 4,
            opacity: !pl.body.trim() ? 0.3 : 1,
          }}
        >
          {BTN_LABEL[fieldStatus['body'] ?? 'idle']}
        </button>

        <textarea value={en.body} onChange={e => setField('en', 'body', e.target.value)} style={{ ...inputStyle, ...bodyStyle }} />
      </div>
    </main>
    </>
  )
}

const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 36px 1fr',
  gap: '0 8px',
  alignItems: 'center',
}

const colHeader: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: '#374151',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 8,
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: '#6b7280',
  display: 'block',
  marginBottom: 4,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #e5e7eb',
  borderRadius: 6,
  fontSize: 14,
  fontFamily: 'system-ui, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
}

const textareaStyle: React.CSSProperties = {
  resize: 'vertical',
  minHeight: 72,
}

const bodyStyle: React.CSSProperties = {
  minHeight: 320,
  fontFamily: 'monospace',
  fontSize: 13,
  resize: 'vertical',
}

const translateBtn: React.CSSProperties = {
  width: 36,
  height: 36,
  border: 'none',
  borderRadius: 6,
  color: '#fff',
  fontWeight: 700,
  fontSize: 13,
  transition: 'background 0.15s',
  padding: 0,
}

const btnStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 7,
  border: 'none',
  color: '#fff',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
}

const errBox: React.CSSProperties = {
  background: '#fef2f2',
  border: '1px solid #fca5a5',
  borderRadius: 8,
  padding: 16,
  color: '#991b1b',
  fontSize: 13,
  marginTop: 16,
}

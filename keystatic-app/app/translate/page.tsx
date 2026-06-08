'use client'
import { useEffect, useState } from 'react'

type Post = { slug: string; title: string; date: string; hasEn: boolean }
type Status = 'idle' | 'translating' | 'ok' | 'error'

export default function TranslatePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statuses, setStatuses] = useState<Record<string, Status>>({})

  useEffect(() => {
    fetch('/api/translate')
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); return }
        setPosts(data)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  async function translate(slug: string) {
    setStatuses(s => ({ ...s, [slug]: 'translating' }))
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      const data = await res.json()
      if (data.ok) {
        setStatuses(s => ({ ...s, [slug]: 'ok' }))
        setPosts(p => p.map(post => post.slug === slug ? { ...post, hasEn: true } : post))
      } else {
        console.error(data.error)
        setStatuses(s => ({ ...s, [slug]: 'error' }))
      }
    } catch (e) {
      console.error(e)
      setStatuses(s => ({ ...s, [slug]: 'error' }))
    }
  }

  const btnLabel: Record<Status, string> = {
    idle: 'Przetłumacz',
    translating: 'Tłumaczę…',
    ok: 'Gotowe!',
    error: 'Błąd — spróbuj ponownie',
  }

  const btnColor: Record<Status, string> = {
    idle: '#1d4ed8',
    translating: '#6b7280',
    ok: '#059669',
    error: '#dc2626',
  }

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 720, margin: '48px auto', padding: '0 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <a href="/keystatic" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>← Keystatic</a>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: '12px 0 4px' }}>Tłumaczenie wpisów PL → EN</h1>
        <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>
          DeepL tłumaczy frontmatter i treść. Wynik trafia do <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: 4 }}>content/blog/en/</code> jako commit na GitHubie.
        </p>
      </div>

      {loading && <p style={{ color: '#6b7280' }}>Ładowanie wpisów…</p>}
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: 16, color: '#991b1b', fontSize: 13 }}>
          <strong>Błąd:</strong> {error}
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <p style={{ color: '#6b7280' }}>Brak wpisów w <code>content/blog/pl/</code></p>
      )}

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {posts.map(post => {
          const status: Status = statuses[post.slug] ?? 'idle'
          return (
            <li
              key={post.slug}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 0', borderBottom: '1px solid #f0f0f0',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {post.title}
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                  {post.date} · <code style={{ fontSize: 11 }}>{post.slug}</code>
                </div>
              </div>

              <span style={{
                flexShrink: 0, fontSize: 12, padding: '3px 10px', borderRadius: 99,
                background: post.hasEn ? '#d1fae5' : '#f3f4f6',
                color: post.hasEn ? '#065f46' : '#9ca3af',
                fontWeight: 500,
              }}>
                {post.hasEn ? 'EN ✓' : 'brak EN'}
              </span>

              <button
                onClick={() => translate(post.slug)}
                disabled={status === 'translating'}
                style={{
                  flexShrink: 0, padding: '7px 16px', borderRadius: 7, border: 'none',
                  background: btnColor[status], color: '#fff',
                  cursor: status === 'translating' ? 'wait' : 'pointer',
                  fontSize: 13, fontWeight: 500, transition: 'background 0.2s',
                  opacity: status === 'translating' ? 0.7 : 1,
                }}
              >
                {btnLabel[status]}
              </button>
            </li>
          )
        })}
      </ul>
    </main>
  )
}

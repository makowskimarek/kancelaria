'use client'
import { makePage } from '@keystatic/next/ui/app'
import keystaticConfig from '../../../keystatic.config'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const KeystaticApp = makePage(keystaticConfig)

type Status = 'idle' | 'loading' | 'ok' | 'error'

function TranslateOverlay() {
  const pathname = usePathname()
  const router = useRouter()
  const [status, setStatus] = useState<Status>('idle')

  const match = pathname?.match(/\/keystatic\/.*\/collection\/blog\/item\/([^/]+)$/)
  const slug = match?.[1]

  if (!slug) return null

  async function translate() {
    if (!window.confirm('Tłumaczenie nadpisze wersję EN.\nUpewnij się, że zapisałeś zmiany w tym wpisie — niezapisane zostaną utracone.')) return
    setStatus('loading')
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      const data = await res.json()
      if (data.ok) {
        setStatus('ok')
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const enUrl = `/keystatic/branch/master/collection/blogEn/item/${slug}`

  const base: React.CSSProperties = {
    position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
    padding: '10px 18px', borderRadius: 8, border: 'none',
    fontSize: 13, fontWeight: 600,
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    transition: 'background 0.2s',
    textDecoration: 'none', display: 'inline-block',
  }

  if (status === 'ok') {
    return (
      <a href={enUrl} style={{ ...base, background: '#059669', color: '#fff', cursor: 'pointer' }}>
        Otwórz EN →
      </a>
    )
  }

  const bg: Record<Exclude<Status, 'ok'>, string> = {
    idle: '#1d4ed8',
    loading: '#6b7280',
    error: '#dc2626',
  }

  const label: Record<Exclude<Status, 'ok'>, string> = {
    idle: 'Przetłumacz PL→EN',
    loading: 'Tłumaczę…',
    error: 'Błąd — spróbuj ponownie',
  }

  return (
    <button
      onClick={translate}
      disabled={status === 'loading'}
      style={{
        ...base,
        background: bg[status as Exclude<Status, 'ok'>], color: '#fff',
        cursor: status === 'loading' ? 'wait' : 'pointer',
        opacity: status === 'loading' ? 0.75 : 1,
      }}
    >
      {label[status as Exclude<Status, 'ok'>]}
    </button>
  )
}

export default function Page() {
  return (
    <>
      <KeystaticApp />
      <TranslateOverlay />
    </>
  )
}

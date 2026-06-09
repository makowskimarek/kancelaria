'use client'
import { makePage } from '@keystatic/next/ui/app'
import keystaticConfig from '../../../keystatic.config'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const KeystaticApp = makePage(keystaticConfig)

type Status = 'idle' | 'loading' | 'ok' | 'error'

function TranslateOverlay() {
  const pathname = usePathname()
  const [status, setStatus] = useState<Status>('idle')

  const match = pathname?.match(/\/keystatic\/.*\/collection\/blog\/item\/([^/]+)$/)
  const slug = match?.[1]

  if (!slug) return null

  async function translate() {
    setStatus('loading')
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      const data = await res.json()
      setStatus(data.ok ? 'ok' : 'error')
    } catch {
      setStatus('error')
    }
    setTimeout(() => setStatus('idle'), 3000)
  }

  const label: Record<Status, string> = {
    idle: 'Przetłumacz PL→EN',
    loading: 'Tłumaczę…',
    ok: 'Gotowe ✓',
    error: 'Błąd — spróbuj ponownie',
  }

  const bg: Record<Status, string> = {
    idle: '#1d4ed8',
    loading: '#6b7280',
    ok: '#059669',
    error: '#dc2626',
  }

  return (
    <button
      onClick={translate}
      disabled={status === 'loading'}
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        padding: '10px 18px', borderRadius: 8, border: 'none',
        background: bg[status], color: '#fff',
        fontSize: 13, fontWeight: 600,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        cursor: status === 'loading' ? 'wait' : 'pointer',
        transition: 'background 0.2s',
        opacity: status === 'loading' ? 0.75 : 1,
      }}
    >
      {label[status]}
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

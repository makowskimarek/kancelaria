'use client'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/keystatic', label: 'Keystatic' },
  { href: '/translate', label: 'Tłumaczenia' },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '0 24px', height: 48, borderBottom: '1px solid #e5e7eb',
      background: '#fff', position: 'sticky', top: 0, zIndex: 50,
    }}>
      <span style={{ fontWeight: 700, fontSize: 14, color: '#111827', marginRight: 8 }}>KNS</span>
      {LINKS.map(({ href, label }) => {
        const active = pathname === href || (href !== '/keystatic' && pathname.startsWith(href))
        return (
          <a
            key={href}
            href={href}
            style={{
              padding: '5px 12px', borderRadius: 6, fontSize: 13, fontWeight: 500,
              textDecoration: 'none',
              background: active ? '#eff6ff' : 'transparent',
              color: active ? '#1d4ed8' : '#6b7280',
            }}
          >
            {label}
          </a>
        )
      })}
    </nav>
  )
}

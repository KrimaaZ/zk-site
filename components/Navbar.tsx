'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useLang } from '@/lib/lang'
import { Suspense } from 'react'

const links = [
  { href: '/feed',     label: 'Feed',          emoji: '🏡', match: (p: string, _q: string) => p.startsWith('/feed') },
  { href: '/personal', label: 'Personal Life', emoji: '👤', match: (p: string, _q: string) =>
      p.startsWith('/personal') || p.startsWith('/goals') || p.startsWith('/routines') ||
      p.startsWith('/pomodoro')  || p.startsWith('/workout') || p.startsWith('/diet') },
  { href: '/raja',     label: 'Raja',          emoji: '🦅', match: (p: string, _q: string) => p.startsWith('/raja') },
]

function NavInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const view = searchParams.get('view') ?? ''
  const { lang, toggle } = useLang()

  if (pathname === '/') return null

  return (
    <>
      {/* ── Top bar ── */}
      <nav style={{ backgroundColor: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }} className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-widest" style={{ color: '#D4AF37' }}>
            MAK
          </Link>

          <div className="flex items-center gap-2">
            {/* Desktop nav */}
            <div className="hidden sm:flex gap-1 items-center">
              {links.map(link => {
                const active = link.match(pathname, view)
                return (
                  <Link key={link.href} href={link.href}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5"
                    style={{
                      backgroundColor: active ? 'rgba(212,175,55,0.15)' : 'transparent',
                      color: active ? '#D4AF37' : '#888888',
                      border: active ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent',
                    }}
                    onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = '#C0C0C0' } }}
                    onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#888888' } }}>
                    <span>{link.emoji}</span>
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Language toggle */}
            <button
              onClick={toggle}
              className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border"
              style={{ borderColor: 'rgba(212,175,55,0.3)', color: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.08)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(212,175,55,0.18)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(212,175,55,0.08)' }}>
              {lang === 'en' ? 'FR' : 'EN'}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Bottom nav (mobile only) ── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t"
        style={{ backgroundColor: '#0a0a0a', borderColor: '#1a1a1a' }}>
        {links.map(link => {
          const active = link.match(pathname, view)
          return (
            <Link key={link.href} href={link.href}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors text-xs"
              style={{ color: active ? '#D4AF37' : '#555555', backgroundColor: active ? 'rgba(212,175,55,0.08)' : 'transparent' }}>
              <span className="text-xl leading-none">{link.emoji}</span>
              <span className="font-medium" style={{ fontSize: '10px' }}>{link.label}</span>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default function Navbar() {
  return (
    <Suspense>
      <NavInner />
    </Suspense>
  )
}

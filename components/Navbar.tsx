'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/lib/lang'

const links = [
  { href: '/feed',     label: 'Feed',     emoji: '🏡' },
  { href: '/food',     label: 'Food',     emoji: '🥗' },
  { href: '/workout',  label: 'Workout',  emoji: '💪' },
  { href: '/valorant', label: 'Valorant', emoji: '🎮' },
  { href: '/trading',  label: 'Trading',  emoji: '📈' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { lang, toggle } = useLang()

  if (pathname === '/') return null

  return (
    <>
      {/* ── Top bar ── */}
      <nav style={{ backgroundColor: '#1a3a1a' }} className="shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-widest" style={{ color: '#74c69d' }}>
            ZK
          </Link>

          <div className="flex items-center gap-2">
            {/* Desktop nav */}
            <div className="hidden sm:flex gap-1 items-center">
              {links.map(link => {
                const active = pathname.startsWith(link.href)
                return (
                  <Link key={link.href} href={link.href}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                    style={{ backgroundColor: active ? '#40916c' : 'transparent', color: active ? '#fff' : '#95d5b2' }}
                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = '#2d6a4f' }}
                    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}>
                    <span>{link.emoji}</span>
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Language toggle */}
            <button
              onClick={toggle}
              className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
              style={{ backgroundColor: '#40916c', color: '#fff' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#2d6a4f' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#40916c' }}>
              {lang === 'en' ? 'FR' : 'EN'}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Bottom nav (mobile only) ── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t"
        style={{ backgroundColor: '#1a3a1a', borderColor: '#2d6a4f' }}>
        {links.map(link => {
          const active = pathname.startsWith(link.href)
          return (
            <Link key={link.href} href={link.href}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors text-xs"
              style={{ color: active ? '#74c69d' : '#52b788', backgroundColor: active ? '#0d2010' : 'transparent' }}>
              <span className="text-xl leading-none">{link.emoji}</span>
              <span className="font-medium" style={{ fontSize: '10px' }}>{link.label}</span>
            </Link>
          )
        })}
      </div>
    </>
  )
}

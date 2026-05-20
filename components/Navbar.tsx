'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react'

const LINKS = [
  {
    href:  '/feed',
    emoji: '🏠',
    label: 'Feed',
    color: '#60A5FA',
    glow:  'rgba(96,165,250,0.35)',
    bg:    'rgba(59,130,246,0.15)',
    match: (p: string) => p.startsWith('/feed'),
  },
  {
    href:  '/personal',
    emoji: '💀',
    label: 'Personal',
    color: '#A78BFA',
    glow:  'rgba(167,139,250,0.35)',
    bg:    'rgba(139,92,246,0.15)',
    match: (p: string) =>
      p.startsWith('/personal') || p.startsWith('/goals')      ||
      p.startsWith('/routines') || p.startsWith('/pomodoro')   ||
      p.startsWith('/workout')  || p.startsWith('/diet')       ||
      p.startsWith('/aesthetic')|| p.startsWith('/bucketlist') ||
      p.startsWith('/progression') || p.startsWith('/calculator') ||
      p.startsWith('/music')    || p.startsWith('/summer') || p.startsWith('/italiano'),
  },
  {
    href:  '/raja',
    emoji: '🦅',
    label: 'Raja',
    color: '#F472B6',
    glow:  'rgba(244,114,182,0.35)',
    bg:    'rgba(236,72,153,0.15)',
    match: (p: string) => p.startsWith('/raja'),
  },
]

function NavInner() {
  const pathname = usePathname()
  if (pathname === '/') return null

  return (
    <nav
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(5, 5, 18, 0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(139, 92, 246, 0.1)',
        boxShadow: '0 -8px 40px rgba(0, 0, 0, 0.6)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'stretch', maxWidth: 480, margin: '0 auto' }}>
        {LINKS.map(link => {
          const active = link.match(pathname)
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 4, padding: '10px 8px 12px',
                textDecoration: 'none', position: 'relative',
                transition: 'all 0.2s',
              }}
            >
              {/* Active indicator bar on top */}
              {active && (
                <div style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: 32, height: 2, borderRadius: 99,
                  background: link.color,
                  boxShadow: `0 0 8px ${link.glow}`,
                }} />
              )}

              {/* Icon container */}
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
                background: active ? link.bg : 'transparent',
                border: active ? `1px solid ${link.color}30` : '1px solid transparent',
                boxShadow: active ? `0 4px 16px ${link.glow}` : 'none',
                transition: 'all 0.25s',
              }}>
                {link.emoji}
              </div>

              {/* Label */}
              <span style={{
                fontSize: 10, fontWeight: 700,
                letterSpacing: '.07em', textTransform: 'uppercase' as const,
                color: active ? link.color : '#3d3d5c',
                transition: 'color 0.2s',
              }}>
                {link.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default function Navbar() {
  return (
    <Suspense>
      <NavInner />
    </Suspense>
  )
}

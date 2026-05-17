'use client'

import Link from 'next/link'
import { useLang } from '@/lib/lang'

export default function WelcomePage() {
  const { lang, t, toggle } = useLang()

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 60% 30%, #1a1400 0%, #0a0a0a 55%, #050505 100%)' }}
    >
      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full opacity-15"
          style={{ background: '#D4AF37', filter: 'blur(100px)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full opacity-10"
          style={{ background: '#C0C0C0', filter: 'blur(90px)' }} />
        <div className="absolute top-2/3 left-1/5 w-48 h-48 rounded-full opacity-08"
          style={{ background: '#1D9E75', filter: 'blur(80px)' }} />
      </div>

      {/* Language toggle */}
      <button
        onClick={toggle}
        className="absolute top-4 right-4 z-20 text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-colors"
        style={{ borderColor: '#3a3a3a', color: '#C0C0C0', backgroundColor: 'rgba(26,26,26,0.8)' }}>
        {lang === 'en' ? 'FR' : 'EN'}
      </button>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Logo */}
        <div
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl flex items-center justify-center mb-8 btn-glass"
          style={{
            background: 'rgba(212,175,55,0.1)',
            borderColor: 'rgba(212,175,55,0.3)',
            boxShadow: '0 8px 40px rgba(212,175,55,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}>
          <span className="font-bold text-4xl sm:text-5xl tracking-tighter" style={{ color: '#D4AF37' }}>MAK</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-3" style={{ color: '#F0F0F0' }}>
          {t.tagline}
        </h1>
        <p className="text-base sm:text-lg mb-10" style={{ color: '#888888' }}>
          Food &nbsp;·&nbsp; Fitness
        </p>

        <Link
          href="/feed"
          className="btn-glass btn-glass-gold px-10 py-4 rounded-2xl text-base sm:text-lg font-semibold mb-10"
        >
          {t.enter}
        </Link>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {[
            { href: '/food',                  label: '🥗 Food',     cls: 'btn-glass-green' },
            { href: '/diet',                  label: '🥩 Diet',     cls: 'btn-glass-gold'  },
            { href: '/workout',               label: '💪 Workout',  cls: 'btn-glass-silver'},
            { href: '/workout?view=progress', label: '📈 Tracking', cls: 'btn-glass-silver'},
          ].map(item => (
            <Link key={item.href} href={item.href}
              className={`btn-glass ${item.cls} px-4 py-2.5 rounded-xl text-sm font-medium`}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 flex border-t"
        style={{ backgroundColor: 'rgba(5,5,5,0.9)', borderColor: 'rgba(212,175,55,0.15)', backdropFilter: 'blur(12px)' }}>
        <Link href="/"
          className="flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors"
          style={{ color: '#D4AF37' }}>
          <span className="text-xl">🏠</span>
          <span className="font-medium" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Accueil</span>
        </Link>
        <Link href="/feed"
          className="flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors"
          style={{ color: '#C0C0C0' }}>
          <span className="text-xl">📋</span>
          <span className="font-medium" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Dashboard</span>
        </Link>
        <button disabled
          className="flex-1 flex flex-col items-center justify-center py-3 gap-1 opacity-25 cursor-not-allowed">
          <span className="text-xl">🔒</span>
          <span className="font-medium" style={{ fontSize: '10px', letterSpacing: '0.05em', color: '#555' }}>Bientôt</span>
        </button>
        <button disabled
          className="flex-1 flex flex-col items-center justify-center py-3 gap-1 opacity-25 cursor-not-allowed">
          <span className="text-xl">🔒</span>
          <span className="font-medium" style={{ fontSize: '10px', letterSpacing: '0.05em', color: '#555' }}>Bientôt</span>
        </button>
      </div>
    </div>
  )
}

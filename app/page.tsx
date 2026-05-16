'use client'

import Link from 'next/link'
import { useLang } from '@/lib/lang'

export default function WelcomePage() {
  const { lang, t, toggle } = useLang()

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 60% 40%, #1a3a1a 0%, #0d1f0d 55%, #050f05 100%)',
      }}
    >
      {/* Ambient blur orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full opacity-20"
          style={{ background: '#40916c', filter: 'blur(80px)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full opacity-15"
          style={{ background: '#b8860b', filter: 'blur(90px)' }} />
        <div className="absolute top-2/3 left-1/4 w-48 h-48 rounded-full opacity-10"
          style={{ background: '#74c69d', filter: 'blur(70px)' }} />
      </div>

      {/* Language toggle */}
      <button
        onClick={toggle}
        className="absolute top-4 right-4 z-20 text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-colors"
        style={{ borderColor: '#40916c', color: '#74c69d', backgroundColor: 'rgba(45,106,79,0.2)' }}>
        {lang === 'en' ? 'FR' : 'EN'}
      </button>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Logo mark */}
        <div
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl flex items-center justify-center mb-8 btn-glass"
          style={{
            background: 'rgba(45,106,79,0.35)',
            borderColor: 'rgba(116,198,157,0.3)',
            boxShadow: '0 8px 40px rgba(26,58,26,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
          }}
        >
          <span className="font-bold text-4xl sm:text-5xl tracking-tighter" style={{ color: '#74c69d' }}>MAK</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-3" style={{ color: '#d8f3dc' }}>
          {t.tagline}
        </h1>
        <p className="text-base sm:text-lg mb-10" style={{ color: '#74c69d' }}>
          Food &nbsp;·&nbsp; Fitness
        </p>

        <Link
          href="/feed"
          className="btn-glass btn-glass-green px-10 py-4 rounded-2xl text-base sm:text-lg font-semibold"
        >
          {t.enter}
        </Link>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-10">
          {[
            { href: '/food',    label: '🥗 Food',    cls: 'btn-glass-green' },
            { href: '/workout', label: '💪 Workout', cls: 'btn-glass-brown' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className={`btn-glass ${item.cls} px-4 py-2.5 rounded-xl text-sm font-medium`}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useLang } from '@/lib/lang'
import BottomBar from '@/components/BottomBar'

export default function WelcomePage() {
  const { lang, t, toggle } = useLang()

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #0f0720 0%, #07070f 55%, #03030a 100%)' }}
    >
      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full"
          style={{ background: '#8B5CF6', filter: 'blur(120px)', opacity: 0.18 }} />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full"
          style={{ background: '#EC4899', filter: 'blur(100px)', opacity: 0.12 }} />
        <div className="absolute top-2/3 left-1/5 w-48 h-48 rounded-full"
          style={{ background: '#3B82F6', filter: 'blur(90px)', opacity: 0.1 }} />
      </div>

      {/* Language toggle */}
      <button
        onClick={toggle}
        className="absolute top-4 right-4 z-20 text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-colors"
        style={{ borderColor: 'rgba(139,92,246,0.3)', color: '#A78BFA', backgroundColor: 'rgba(139,92,246,0.08)' }}>
        {lang === 'en' ? 'FR' : 'EN'}
      </button>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Logo */}
        <div
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl flex items-center justify-center mb-8 btn-glass"
          style={{
            background: 'rgba(139,92,246,0.1)',
            borderColor: 'rgba(139,92,246,0.3)',
            boxShadow: '0 8px 40px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}>
          <span className="font-bold text-4xl sm:text-5xl tracking-tighter" style={{ color: '#8B5CF6' }}>MAK</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-3" style={{ color: '#E2E8F0' }}>
          {t.tagline}
        </h1>
        <Link
          href="/feed"
          className="btn-glass btn-glass-gold px-10 py-4 rounded-2xl text-base sm:text-lg font-semibold"
        >
          {t.enter}
        </Link>
      </div>

      <BottomBar />
    </div>
  )
}

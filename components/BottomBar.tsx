'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomBar() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 flex border-t"
      style={{ backgroundColor: 'rgba(5,5,5,0.9)', borderColor: 'rgba(212,175,55,0.15)', backdropFilter: 'blur(12px)' }}>

      <Link href="/"
        className="flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors"
        style={{ color: pathname === '/' ? '#D4AF37' : '#C0C0C0' }}>
        <span className="text-xl">🏠</span>
        <span className="font-medium" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Accueil</span>
      </Link>

      <Link href="/feed"
        className="flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors"
        style={{ color: pathname.startsWith('/feed') ? '#D4AF37' : '#C0C0C0' }}>
        <span className="text-xl">📋</span>
        <span className="font-medium" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Dashboard</span>
      </Link>

      <Link href="/music"
        className="flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors"
        style={{ color: pathname.startsWith('/music') ? '#1D9E75' : '#C0C0C0' }}>
        <span className="text-xl">🎵</span>
        <span className="font-medium" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Music</span>
      </Link>

      <Link href="/summer"
        className="flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors"
        style={{ color: pathname.startsWith('/summer') ? '#FF6B35' : '#C0C0C0' }}>
        <span className="text-xl">☀️</span>
        <span className="font-medium" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Summer</span>
      </Link>

    </div>
  )
}

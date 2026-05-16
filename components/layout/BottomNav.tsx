'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/components/Providers'

export default function BottomNav() {
  const pathname = usePathname()
  const { toggle } = useSidebar()

  const navCls = (href: string) =>
    `flex flex-col items-center gap-1 p-3 transition-colors ${
      pathname === href ? 'text-[#1e3829]' : 'text-gray-400 hover:text-[#1e3829]'
    }`

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-gray-200 flex items-center justify-around px-8 z-50">
      {/* Feed */}
      <Link href="/" className={navCls('/')}>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span className="text-[11px] font-medium">Feed</span>
      </Link>

      {/* Centre menu button */}
      <button
        onClick={toggle}
        className="w-14 h-14 rounded-full bg-[#1e3829] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(30,56,41,0.35)] hover:scale-105 transition-transform"
        aria-label="Menu"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
      </button>

      {/* Raja */}
      <button className="flex flex-col items-center gap-1 p-3 text-gray-400 hover:text-[#1e3829] transition-colors">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <span className="text-[11px] font-medium">Raja</span>
      </button>
    </nav>
  )
}

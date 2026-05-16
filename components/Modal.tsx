'use client'

import { useEffect } from 'react'

export default function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
  wide?: boolean
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}>
      <div
        className={`rounded-t-2xl sm:rounded-2xl w-full ${wide ? 'sm:max-w-2xl' : 'sm:max-w-xl'} max-h-[92vh] sm:max-h-[88vh] flex flex-col`}
        style={{ backgroundColor: '#fff' }}
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
          style={{ borderColor: '#f0e8d8' }}>
          {/* Drag handle on mobile */}
          <div className="absolute left-1/2 -translate-x-1/2 top-2 w-10 h-1 rounded-full sm:hidden"
            style={{ backgroundColor: '#d4c5a9' }} />
          <h2 className="text-lg font-bold" style={{ color: '#1a3a1a' }}>{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-lg"
            style={{ backgroundColor: '#f0e8d8', color: '#8b5e3c' }}>×</button>
        </div>
        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}

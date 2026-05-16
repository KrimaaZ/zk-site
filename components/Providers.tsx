'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

interface SidebarCtx {
  isOpen: boolean
  toggle: () => void
  close:  () => void
}

const Ctx = createContext<SidebarCtx>({ isOpen: false, toggle: () => {}, close: () => {} })

export function Providers({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Ctx.Provider value={{ isOpen, toggle: () => setIsOpen(p => !p), close: () => setIsOpen(false) }}>
      {children}
    </Ctx.Provider>
  )
}

export const useSidebar = () => useContext(Ctx)

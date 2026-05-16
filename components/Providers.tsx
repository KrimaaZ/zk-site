'use client'

import { LangProvider } from '@/lib/lang'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <LangProvider>{children}</LangProvider>
}

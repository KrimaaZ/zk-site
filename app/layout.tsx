import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })
import BottomNav from '@/components/layout/BottomNav'
import Sidebar from '@/components/layout/Sidebar'
import scheduleData from '@/data/schedule.json'

export const metadata: Metadata = {
  title: 'ZK — time to change ur life is now',
  description: 'Personal fitness and nutrition tracker',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#eef8ee] min-h-screen`}>
        <Providers>
          <main className="pb-[72px]">{children}</main>
          <BottomNav />
          <Sidebar schedule={scheduleData} />
        </Providers>
      </body>
    </html>
  )
}

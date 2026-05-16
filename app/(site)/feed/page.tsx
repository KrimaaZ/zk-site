'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/lang'

type FeedItem = {
  id: number
  category: string
  title: string
  excerpt: string
  date: string
  href: string
}

const CAT_STYLE: Record<string, { badge: string; border: string }> = {
  food:     { badge: '#2d6a4f', border: '#b7e4c7' },
  workout:  { badge: '#6b4226', border: '#d4c5a9' },
  valorant: { badge: '#c0303e', border: '#fde8ec' },
  trading:  { badge: '#b8860b', border: '#fef9e7' },
  backtest: { badge: '#40916c', border: '#d8f3dc' },
}

export default function FeedPage() {
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useLang()

  useEffect(() => {
    fetch('/api/feed')
      .then(r => r.json())
      .then(d => { setFeed(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <div className="text-center py-8 sm:py-14 mb-6 sm:mb-10">
        <div className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-3"
          style={{ backgroundColor: '#d8f3dc', color: '#2d6a4f' }}>
          {t.tagline}
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold mb-3" style={{ color: '#1a3a1a' }}>
          {t.welcomeBack}
        </h1>
        <p className="text-base sm:text-lg" style={{ color: '#8b5e3c' }}>
          Food &middot; Fitness &middot; Valorant &middot; Trading
        </p>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
          {[
            { href: '/food',     label: t.foodPlan, emoji: '🥗', color: '#2d6a4f' },
            { href: '/workout',  label: t.workout,  emoji: '💪', color: '#6b4226' },
            { href: '/valorant', label: 'Valorant',  emoji: '🎮', color: '#c0303e' },
            { href: '/trading',  label: 'Trading',   emoji: '📈', color: '#b8860b' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white text-sm shadow-sm transition-transform hover:scale-105"
              style={{ backgroundColor: item.color }}>
              <span>{item.emoji}</span> {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-semibold" style={{ color: '#1a3a1a' }}>{t.latestActivity}</h2>
        <div className="flex-1 h-px" style={{ backgroundColor: '#e8dcc8' }} />
      </div>

      {loading ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="break-inside-avoid mb-4 rounded-2xl h-40 animate-pulse"
              style={{ backgroundColor: '#e8dcc8' }} />
          ))}
        </div>
      ) : feed.length === 0 ? (
        <div className="text-center py-24 rounded-2xl" style={{ backgroundColor: '#f9f5ef', color: '#a07850' }}>
          <p className="text-5xl mb-4">🌱</p>
          <p className="text-xl font-medium mb-1">{t.nothingYet}</p>
          <p className="text-sm">{t.nothingYetSub}</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {feed.map(item => {
            const s = CAT_STYLE[item.category] || CAT_STYLE.food
            return (
              <Link key={`${item.category}-${item.id}`} href={item.href}
                className="block break-inside-avoid mb-4 rounded-2xl p-5 border-2 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                style={{ backgroundColor: '#ffffff', borderColor: s.border }}>
                <span className="inline-block text-xs font-bold px-3 py-1 rounded-full text-white uppercase tracking-wide mb-3"
                  style={{ backgroundColor: s.badge }}>
                  {item.category}
                </span>
                <h3 className="font-semibold text-lg leading-snug mb-2" style={{ color: '#1a3a1a' }}>
                  {item.title}
                </h3>
                <p className="text-sm line-clamp-3" style={{ color: '#8b5e3c' }}>{item.excerpt}</p>
                <p className="text-xs mt-3" style={{ color: '#c4a882' }}>{item.date}</p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

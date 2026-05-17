'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/lang'
import BottomBar from '@/components/BottomBar'

type FeedItem = {
  id: number
  category: string
  title: string
  excerpt: string
  date: string
  href: string
}

const CAT_STYLE: Record<string, { badge: string; border: string }> = {
  food:    { badge: '#1D9E75', border: '#0d2e1f' },
  workout: { badge: '#B8960C', border: '#2a2000' },
}

const QUOTES = [
  { text: "La discipline, c'est choisir entre ce que tu veux maintenant et ce que tu veux le plus.", author: "Abraham Lincoln" },
  { text: "Un homme se construit dans le silence, pas dans le bruit.", author: "" },
  { text: "La douleur que tu ressens aujourd'hui sera la force que tu ressentiras demain.", author: "" },
  { text: "Le corps atteint ce que l'esprit croit.", author: "Napoleon Hill" },
  { text: "Sois le même homme à 3h du matin qu'à midi.", author: "" },
  { text: "Les champions ne naissent pas, ils se fabriquent dans les moments où ils ne veulent plus continuer.", author: "" },
  { text: "Personne ne se souvient de l'homme qui a abandonné.", author: "" },
  { text: "Ce que tu manges en privé se voit en public.", author: "" },
  { text: "Le succès n'est pas donné à ceux qui rêvent, mais à ceux qui se lèvent.", author: "" },
  { text: "Un lion ne se soucie pas de l'opinion des moutons.", author: "" },
  { text: "Si tu ne sacrifies pas ce que tu es, tu ne deviendras jamais ce que tu veux être.", author: "" },
  { text: "La vraie force, c'est de continuer quand tout en toi veut s'arrêter.", author: "" },
  { text: "Ton corps peut supporter presque n'importe quoi. C'est ton esprit que tu dois convaincre.", author: "" },
  { text: "Travaille en silence. Laisse ton succès faire du bruit.", author: "" },
  { text: "La médiocrité est confortable. L'excellence est douloureuse. Choisis.", author: "" },
  { text: "Un homme sans discipline est un homme sans destin.", author: "" },
  { text: "Chaque rep compte. Chaque repas compte. Chaque nuit de sommeil compte.", author: "" },
  { text: "Ne t'explique pas. Tes résultats parleront.", author: "" },
  { text: "La vie récompense ceux qui agissent, pas ceux qui planifient indéfiniment.", author: "" },
  { text: "Ce que tu fais quand personne ne regarde définit qui tu es vraiment.", author: "" },
]

export default function FeedPage() {
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [fadeIn, setFadeIn] = useState(true)
  const { t } = useLang()

  useEffect(() => {
    fetch('/api/feed')
      .then(r => r.json())
      .then(d => { setFeed(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false)
      setTimeout(() => {
        setQuoteIndex(i => (i + 1) % QUOTES.length)
        setFadeIn(true)
      }, 400)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const quote = QUOTES[quoteIndex]

  return (
    <div>
      {/* Hero */}
      <div className="text-center py-8 sm:py-14 mb-6 sm:mb-10">
        <div className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-3 uppercase tracking-widest"
          style={{ backgroundColor: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
          {t.tagline}
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold mb-3" style={{ color: '#F0F0F0' }}>
          {t.welcomeBack}
        </h1>
        <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/personal"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 border"
            style={{ backgroundColor: 'rgba(212,175,55,0.12)', borderColor: 'rgba(212,175,55,0.4)', color: '#D4AF37' }}>
            <span>👤</span> Personal Life
          </Link>
          <Link href="/raja"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 border"
            style={{ backgroundColor: 'rgba(29,158,117,0.12)', borderColor: 'rgba(29,158,117,0.4)', color: '#1D9E75' }}>
            <span>🦅</span> Raja
          </Link>
        </div>
      </div>

      {/* Quote */}
      <div className="mb-10 mx-auto max-w-2xl">
        <div className="rounded-2xl px-6 py-7 relative overflow-hidden border"
          style={{ backgroundColor: '#111111', borderColor: 'rgba(212,175,55,0.15)' }}>
          <span className="absolute top-3 left-5 text-5xl font-serif leading-none select-none"
            style={{ color: '#D4AF37', opacity: 0.3 }}>"</span>
          <div style={{
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? 'translateY(0)' : 'translateY(6px)',
          }}>
            <p className="text-base sm:text-lg font-medium leading-relaxed text-center pt-3"
              style={{ color: '#E8E8E8' }}>
              {quote.text}
            </p>
            {quote.author && (
              <p className="text-xs text-center mt-3 font-semibold uppercase tracking-widest"
                style={{ color: '#D4AF37' }}>
                — {quote.author}
              </p>
            )}
          </div>
          <span className="absolute bottom-3 right-5 text-5xl font-serif leading-none select-none"
            style={{ color: '#D4AF37', opacity: 0.3 }}>"</span>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mt-5">
            {QUOTES.map((_, i) => (
              <button key={i}
                onClick={() => { setFadeIn(false); setTimeout(() => { setQuoteIndex(i); setFadeIn(true) }, 400) }}
                className="rounded-full transition-all"
                style={{
                  width: i === quoteIndex ? '20px' : '6px',
                  height: '6px',
                  backgroundColor: i === quoteIndex ? '#D4AF37' : '#2a2a2a',
                }} />
            ))}
          </div>
        </div>
      </div>

      {/* Feed */}
      {loading ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="break-inside-avoid mb-4 rounded-2xl h-40 animate-pulse"
              style={{ backgroundColor: '#1a1a1a' }} />
          ))}
        </div>
      ) : feed.length === 0 ? (
        <div className="text-center py-24 rounded-2xl border" style={{ backgroundColor: '#111111', borderColor: '#1a1a1a', color: '#555555' }}>
          <p className="text-5xl mb-4">🌱</p>
          <p className="text-xl font-medium mb-1" style={{ color: '#888888' }}>{t.nothingYet}</p>
          <p className="text-sm">{t.nothingYetSub}</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {feed.map(item => {
            const s = CAT_STYLE[item.category] || CAT_STYLE.food
            return (
              <Link key={`${item.category}-${item.id}`} href={item.href}
                className="block break-inside-avoid mb-4 rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-0.5"
                style={{ backgroundColor: '#111111', borderColor: '#2a2a2a' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.3)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a' }}>
                <span className="inline-block text-xs font-bold px-3 py-1 rounded-full text-white uppercase tracking-wide mb-3"
                  style={{ backgroundColor: s.badge }}>
                  {item.category}
                </span>
                <h3 className="font-semibold text-lg leading-snug mb-2" style={{ color: '#F0F0F0' }}>
                  {item.title}
                </h3>
                <p className="text-sm line-clamp-3" style={{ color: '#888888' }}>{item.excerpt}</p>
                <p className="text-xs mt-3" style={{ color: '#3a3a3a' }}>{item.date}</p>
              </Link>
            )
          })}
        </div>
      )}
      <BottomBar />
    </div>
  )
}

'use client'

import Link from 'next/link'

const SECTIONS = [
  {
    href:   '/workout',
    emoji:  '💪',
    title:  'Workout',
    desc:   'Programme Push / Pull / Legs avec tracking sets & reps.',
    color:  '#A78BFA',
    bg:     'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.2)',
  },
  {
    href:   '/diet',
    emoji:  '🥩',
    title:  'Diet',
    desc:   'Plan alimentaire hypertrophie — 4 repas détaillés avec macros.',
    color:  '#34D399',
    bg:     'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.2)',
  },
  {
    href:   '/goals',
    emoji:  '🎯',
    title:  'Objectifs',
    desc:   'Tes objectifs quotidiens, mensuels et annuels — sauvegardés.',
    color:  '#818CF8',
    bg:     'rgba(99,102,241,0.08)',
    border: 'rgba(99,102,241,0.2)',
  },
  {
    href:   '/routines',
    emoji:  '⚡',
    title:  'Routines',
    desc:   'Morning & Night routine — checkboxes auto-reset à 5h du matin.',
    color:  '#38BDF8',
    bg:     'rgba(14,165,233,0.08)',
    border: 'rgba(14,165,233,0.2)',
  },
  {
    href:   '/pomodoro',
    emoji:  '🍅',
    title:  'Pomodoro',
    desc:   '25 min de travail / 5 min de repos — timer avec notifications.',
    color:  '#F87171',
    bg:     'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.2)',
  },
  {
    href:   '/workout?view=progress',
    emoji:  '📈',
    title:  'Tracking',
    desc:   'Suivi quotidien de tes habitudes — Diet, Training, Study, Water…',
    color:  '#60A5FA',
    bg:     'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.2)',
  },
  {
    href:   '/aesthetic',
    emoji:  '🖤',
    title:  'Aesthetic',
    desc:   'Outfits, photos, proches & physique — espace visuel personnel.',
    color:  '#F472B6',
    bg:     'rgba(236,72,153,0.08)',
    border: 'rgba(236,72,153,0.2)',
  },
  {
    href:   '/bucketlist',
    emoji:  '🪣',
    title:  'Bucket List',
    desc:   'Tes rêves et objectifs de vie — suivi, priorités et accomplissements.',
    color:  '#FBBF24',
    bg:     'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.2)',
  },
  {
    href:   '/progression',
    emoji:  '📊',
    title:  'Progression',
    desc:   '10 habitudes quotidiennes + calendrier mensuel — sauvegardé en DB.',
    color:  '#34D399',
    bg:     'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.2)',
  },
  {
    href:   '/calculator',
    emoji:  '🧮',
    title:  'Calculateur',
    desc:   'Calcule tes macros (calories, protéines, glucides, lipides) via AI.',
    color:  '#C084FC',
    bg:     'rgba(192,132,252,0.08)',
    border: 'rgba(192,132,252,0.2)',
  },
  {
    href:   '/music',
    emoji:  '🎵',
    title:  'Music',
    desc:   'Tes paroles, instrumentales et covers — ton espace créatif.',
    color:  '#F472B6',
    bg:     'rgba(244,114,182,0.08)',
    border: 'rgba(244,114,182,0.2)',
  },
  {
    href:   '/summer',
    emoji:  '☀️',
    title:  'Summer',
    desc:   'Playlist, souvenirs, moodboard — ton été en un seul endroit.',
    color:  '#FB923C',
    bg:     'rgba(251,146,60,0.08)',
    border: 'rgba(251,146,60,0.2)',
  },
]

export default function PersonalPage() {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', paddingTop: 8, paddingBottom: 24 }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 3, height: 18, background: 'linear-gradient(180deg,#A78BFA,#EC4899)', borderRadius: 2 }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' as const, color: '#475569' }}>
            Personal Life
          </span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#E2E8F0', margin: 0, lineHeight: 1.2 }}>
          Ton espace personnel
        </h1>
        <p style={{ fontSize: 13, color: '#334155', marginTop: 7 }}>
          Objectifs, routines, progression et créativité — tout au même endroit.
        </p>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 14 }}>
        {SECTIONS.map(s => (
          <Link key={s.href} href={s.href} style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: '#0d0d1a',
                borderRadius: 18,
                border: `1px solid ${s.border}`,
                padding: '20px 18px',
                cursor: 'pointer',
                transition: 'all .22s',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 11,
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.background  = s.bg
                el.style.borderColor = s.color
                el.style.transform   = 'translateY(-3px)'
                el.style.boxShadow   = `0 12px 40px ${s.color}18`
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.background  = '#0d0d1a'
                el.style.borderColor = s.border
                el.style.transform   = 'translateY(0)'
                el.style.boxShadow   = 'none'
              }}
            >
              {/* Subtle glow corner */}
              <div style={{
                position: 'absolute', top: -24, right: -24,
                width: 80, height: 80, borderRadius: '50%',
                background: s.color, opacity: 0.04, filter: 'blur(20px)',
                pointerEvents: 'none',
              }} />

              {/* Icon */}
              <div style={{
                width: 44, height: 44, borderRadius: 13,
                background: s.bg,
                border: `1px solid ${s.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>
                {s.emoji}
              </div>

              {/* Text */}
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: s.color, marginBottom: 4 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.55 }}>
                  {s.desc}
                </div>
              </div>

              {/* Arrow */}
              <div style={{ marginTop: 'auto', paddingTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: s.color, opacity: 0.7 }}>Accéder</span>
                <span style={{ fontSize: 13, color: s.color, opacity: 0.7 }}>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

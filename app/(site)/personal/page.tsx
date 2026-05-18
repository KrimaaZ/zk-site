'use client'

import Link from 'next/link'

const SECTIONS = [
  {
    href:    '/workout',
    emoji:   '💪',
    title:   'Workout',
    desc:    'Programme d\'entraînement Push / Pull / Legs avec tracking sets & reps.',
    color:   '#D4AF37',
    bg:      'rgba(212,175,55,0.08)',
    border:  'rgba(212,175,55,0.25)',
  },
  {
    href:    '/diet',
    emoji:   '🥩',
    title:   'Diet',
    desc:    'Plan alimentaire hypertrophie — 4 repas détaillés avec macros.',
    color:   '#1D9E75',
    bg:      'rgba(29,158,117,0.08)',
    border:  'rgba(29,158,117,0.25)',
  },
  {
    href:    '/goals',
    emoji:   '🎯',
    title:   'Objectifs',
    desc:    'Tes objectifs quotidiens, mensuels et annuels — sauvegardés et synchronisés.',
    color:   '#9B6FE0',
    bg:      'rgba(155,111,224,0.08)',
    border:  'rgba(155,111,224,0.25)',
  },
  {
    href:    '/routines',
    emoji:   '⚡',
    title:   'Routines',
    desc:    'Morning & Night routine — checkboxes qui se remettent à zéro à 5h du matin.',
    color:   '#C0C0C0',
    bg:      'rgba(192,192,192,0.06)',
    border:  'rgba(192,192,192,0.2)',
  },
  {
    href:    '/pomodoro',
    emoji:   '🍅',
    title:   'Pomodoro',
    desc:    '25 min de travail / 5 min de repos — timer avec notifications sonores.',
    color:   '#E05252',
    bg:      'rgba(224,82,82,0.08)',
    border:  'rgba(224,82,82,0.25)',
  },
  {
    href:    '/workout?view=progress',
    emoji:   '📈',
    title:   'Tracking',
    desc:    'Suivi quotidien de tes habitudes — Diet, Training, Study, Water…',
    color:   '#52b788',
    bg:      'rgba(82,183,136,0.08)',
    border:  'rgba(82,183,136,0.25)',
  },
  {
    href:    '/aesthetic',
    emoji:   '🖤',
    title:   'Aesthetic',
    desc:    'Outfits, photos, proches & physique — espace visuel personnel.',
    color:   '#C0C0C0',
    bg:      'rgba(192,192,192,0.06)',
    border:  'rgba(192,192,192,0.2)',
  },
  {
    href:    '/bucketlist',
    emoji:   '🪣',
    title:   'Bucket List',
    desc:    'Tes rêves et objectifs de vie — suivi, priorités et accomplissements.',
    color:   '#F5C518',
    bg:      'rgba(245,197,24,0.08)',
    border:  'rgba(245,197,24,0.25)',
  },
  {
    href:    '/progression',
    emoji:   '📊',
    title:   'Progression',
    desc:    '10 habitudes quotidiennes + calendrier mensuel vert/rouge — sauvegardé en DB.',
    color:   '#1D9E75',
    bg:      'rgba(29,158,117,0.08)',
    border:  'rgba(29,158,117,0.25)',
  },
]

export default function PersonalPage() {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', paddingTop: 36, paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
          <div style={{ width:3, height:20, background:'#D4AF37', borderRadius:2 }} />
          <span style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase' as const, color:'#888888' }}>
            Personal Life
          </span>
        </div>
        <h1 style={{ fontSize:28, fontWeight:800, color:'#F0F0F0', margin:0, lineHeight:1.2 }}>
          Ton espace personnel
        </h1>
        <p style={{ fontSize:13, color:'#555555', marginTop:8 }}>
          Objectifs, routines, focus et suivi — tout au même endroit.
        </p>
      </div>

      {/* Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:16 }}>
        {SECTIONS.map(s => (
          <Link key={s.href} href={s.href}
            style={{ textDecoration:'none' }}
          >
            <div style={{
              background: '#111111',
              borderRadius: 18,
              border: `1px solid ${s.border}`,
              padding: '24px 22px',
              cursor: 'pointer',
              transition: 'all .2s',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.background    = s.bg
                el.style.borderColor   = s.color
                el.style.transform     = 'translateY(-3px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.background    = '#111111'
                el.style.borderColor   = s.border
                el.style.transform     = 'translateY(0)'
              }}
            >
              {/* Icon */}
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: s.bg,
                border: `1px solid ${s.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24,
              }}>
                {s.emoji}
              </div>

              {/* Text */}
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: s.color, marginBottom: 5 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 13, color: '#666666', lineHeight: 1.5 }}>
                  {s.desc}
                </div>
              </div>

              {/* Arrow */}
              <div style={{ marginTop:'auto', paddingTop: 8, display:'flex', alignItems:'center', gap:4 }}>
                <span style={{ fontSize:12, fontWeight:700, color: s.color }}>Accéder</span>
                <span style={{ fontSize:14, color: s.color }}>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

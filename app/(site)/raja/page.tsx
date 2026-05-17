'use client'

import { useState } from 'react'

const EagleSVG = ({ size = 400, opacity = 1, color = '#1D9E75' }: { size?: number; opacity?: number; color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity }}
  >
    {/* Body */}
    <ellipse cx="100" cy="115" rx="18" ry="28" fill={color} />

    {/* Neck */}
    <ellipse cx="100" cy="87" rx="10" ry="14" fill={color} />

    {/* Head */}
    <ellipse cx="100" cy="72" rx="13" ry="12" fill={color} />

    {/* Beak */}
    <path d="M108 70 L122 75 L108 80 Z" fill={color} />

    {/* Eye */}
    <circle cx="106" cy="70" r="2.5" fill="#000" />
    <circle cx="106" cy="70" r="1" fill="#fff" />

    {/* Left wing upper */}
    <path d="M90 100 Q60 80 20 55 Q35 70 45 88 Q55 92 70 98 Z" fill={color} />
    {/* Left wing feathers */}
    <path d="M90 100 Q55 75 10 45 Q22 60 35 72 Z" fill={color} opacity="0.85" />
    <path d="M88 105 Q50 85 5 65 Q18 78 32 88 Z" fill={color} opacity="0.7" />
    <path d="M87 110 Q48 96 8 82 Q20 92 36 100 Z" fill={color} opacity="0.55" />
    <path d="M88 115 Q52 108 15 100 Q26 108 42 114 Z" fill={color} opacity="0.4" />

    {/* Right wing upper */}
    <path d="M110 100 Q140 80 180 55 Q165 70 155 88 Q145 92 130 98 Z" fill={color} />
    {/* Right wing feathers */}
    <path d="M110 100 Q145 75 190 45 Q178 60 165 72 Z" fill={color} opacity="0.85" />
    <path d="M112 105 Q150 85 195 65 Q182 78 168 88 Z" fill={color} opacity="0.7" />
    <path d="M113 110 Q152 96 192 82 Q180 92 164 100 Z" fill={color} opacity="0.55" />
    <path d="M112 115 Q148 108 185 100 Q174 108 158 114 Z" fill={color} opacity="0.4" />

    {/* Tail feathers */}
    <path d="M88 140 Q80 155 72 170 Q85 158 100 152 Q115 158 128 170 Q120 155 112 140 Z" fill={color} />
    <path d="M85 143 Q72 160 60 178 Q75 163 100 155 Z" fill={color} opacity="0.7" />
    <path d="M115 143 Q128 160 140 178 Q125 163 100 155 Z" fill={color} opacity="0.7" />

    {/* Talons */}
    <path d="M92 143 Q86 150 82 158 Q87 153 92 150 Z" fill={color} />
    <path d="M108 143 Q114 150 118 158 Q113 153 108 150 Z" fill={color} />
    <path d="M88 148 Q80 155 76 164 Q82 158 90 154 Z" fill={color} opacity="0.8" />
    <path d="M112 148 Q120 155 124 164 Q118 158 110 154 Z" fill={color} opacity="0.8" />

    {/* Chest detail */}
    <path d="M92 105 Q100 110 108 105 Q106 120 100 128 Q94 120 92 105 Z" fill={color} opacity="0.6" />

    {/* Wing tips extra feathers */}
    <path d="M20 55 Q8 48 0 38 Q12 44 22 52 Z" fill={color} opacity="0.6" />
    <path d="M10 45 Q0 36 -5 25 Q8 33 12 42 Z" fill={color} opacity="0.45" />
    <path d="M180 55 Q192 48 200 38 Q188 44 178 52 Z" fill={color} opacity="0.6" />
    <path d="M190 45 Q200 36 205 25 Q192 33 188 42 Z" fill={color} opacity="0.45" />
  </svg>
)

const GALLERY = [
  {
    title: 'Championnat du Maroc 2023-24',
    sub: 'Titre de Champion · Botola Pro',
    gradient: 'linear-gradient(135deg, #0a1a12 0%, #000 60%)',
    story: {
      badge: '🏆 13ème Titre · Botola Pro',
      headline: 'La Saison de l\'Invincibilité',
      body: `La Botola 2023-2024 du Raja Club Athletic restera comme l'une des saisons les plus mythiques de l'histoire du club. Sous la direction de l'entraîneur allemand Josef Zinnbauer, le Raja a réalisé un exploit exceptionnel en remportant le championnat sans la moindre défaite, avec une équipe disciplinée, solide mentalement et portée par une incroyable ferveur populaire.\n\nArrivé dans un contexte compliqué en 2023, Zinnbauer a transformé le groupe en une machine collective capable de renverser la pression jusqu'à la dernière journée. Les Aigles Verts ont terminé champions avec 21 victoires et 9 matchs nuls, décrochant ainsi la 13e Botola du club dans une ambiance historique à Casablanca et dans tout le Maroc.\n\nCette saison était spéciale parce qu'elle a réuni le beau jeu, le caractère, l'invincibilité et une connexion unique entre l'équipe et les supporters, faisant de ce Raja l'un des plus marquants du football marocain moderne.`,
      stats: [
        { value: '21', label: 'Victoires' },
        { value: '9',  label: 'Nuls' },
        { value: '0',  label: 'Défaites' },
        { value: '13ème', label: 'Titre Botola' },
      ],
    },
  },
  {
    title: 'Raja vs Wydad — Le Derby',
    sub: 'Derby de Casablanca · Stade Mohammed V',
    gradient: 'linear-gradient(135deg, #0d1a0d 0%, #000 60%)',
    story: {
      badge: '⚽ 23 Novembre 2019 · Coupe Mohammed VI',
      headline: 'La Remontada Légendaire — 4-4',
      body: `Le derby 4-4 entre le Raja et le Wydad, disputé le 23 novembre 2019 en Coupe Mohammed VI, est considéré comme l'un des matchs les plus légendaires de l'histoire du football marocain et africain. Ce soir-là, le Raja semblait condamné après avoir été mené 4-1 par son éternel rival dans un Complexe Mohammed V en fusion, au milieu de tifos gigantesques, de fumigènes et d'une ambiance irréelle.\n\nMais les Verts ont réalisé une remontada historique portée par l'orgueil, le mental et la magie du derby casaoui. Avec des buts de Hamid Ahaddad, Mohsine Moutouali puis Ben Malango à la 94e minute, le Raja est revenu à 4-4 et s'est qualifié dans une explosion d'émotions devenue mythique.\n\nCe match reste spécial parce qu'il symbolise l'âme du Raja : ne jamais abandonner, même dans les moments impossibles. Pour beaucoup de supporters, cette nuit-là représentait plus qu'un simple derby : c'était une démonstration de passion, de folie et de grandeur du football marocain.`,
      stats: [
        { value: '4-1',  label: 'Score à la mi-temps' },
        { value: '4-4',  label: 'Score final' },
        { value: '94\'', label: 'But de Ben Malango' },
        { value: '🔥',   label: 'Remontada' },
      ],
    },
  },
  {
    title: 'CAF Champions League',
    sub: 'Campagne Africaine · Phase de Groupes',
    gradient: 'linear-gradient(135deg, #0a1a15 0%, #000 60%)',
    story: null,
  },
  {
    title: 'Les Ultras Eagles',
    sub: 'Virage Nord · Ambiance Légendaire',
    gradient: 'linear-gradient(135deg, #0a1a0e 0%, #000 60%)',
    story: null,
  },
  {
    title: 'Triplé Historique',
    sub: 'Saison Mémorable · Raja Forever',
    gradient: 'linear-gradient(135deg, #0d1a10 0%, #000 60%)',
    story: null,
  },
  {
    title: 'Nuit Verte à Casa',
    sub: 'Célébration du Titre · Casablanca',
    gradient: 'linear-gradient(135deg, #0a1a12 0%, #000 60%)',
    story: null,
  },
]

const PALMARES = [
  {
    category: '🇲🇦 Maroc',
    icon: '🏆',
    items: [
      { title: 'Championnat du Maroc (Botola)', count: '13 titres', years: '1988, 1996, 1997, 1998, 1999, 2000, 2001, 2004, 2009, 2011, 2013, 2020, 2024' },
      { title: 'Coupe du Trône', count: '9 titres', years: '1974, 1977, 1982, 1996, 2002, 2005, 2012, 2017, 2023' },
    ],
  },
  {
    category: '🌍 Afrique',
    icon: '🌍',
    items: [
      { title: 'Ligue des Champions CAF', count: '3 titres', years: '1989, 1997, 1999' },
      { title: 'Coupe de la Confédération CAF', count: '3 titres', years: '2003, 2018, 2021' },
      { title: 'Supercoupe de la CAF', count: '2 titres', years: '2000, 2019' },
      { title: 'Coupe Afro-Asiatique', count: '1 titre', years: '1998' },
    ],
  },
  {
    category: '🌐 Monde Arabe',
    icon: '🌙',
    items: [
      { title: 'Ligue des Champions Arabes', count: '2 titres', years: '2006, 2020' },
    ],
  },
  {
    category: '🌎 Monde',
    icon: '🌎',
    items: [
      { title: 'Coupe du Monde des Clubs FIFA', count: 'Finaliste 2013', years: 'Performance historique' },
    ],
  },
]

type Story = NonNullable<typeof GALLERY[0]['story']>

export default function RajaPage() {
  const [modal, setModal] = useState<Story | null>(null)

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: '#fff', fontFamily: 'inherit' }}>

      {/* ── MODAL ────────────────────────────────────────────── */}
      {modal && (
        <div
          onClick={() => setModal(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            backgroundColor: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
            animation: 'fadeUp 0.2s ease forwards',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#0a0a0a',
              border: '1px solid rgba(29,158,117,0.4)',
              borderTop: '3px solid #1D9E75',
              borderRadius: 20,
              maxWidth: 640,
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: 'clamp(24px, 5vw, 44px)',
              position: 'relative',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setModal(null)}
              style={{
                position: 'absolute', top: 16, right: 16,
                background: 'rgba(29,158,117,0.1)',
                border: '1px solid rgba(29,158,117,0.3)',
                borderRadius: 8, color: '#1D9E75',
                fontSize: 18, width: 36, height: 36,
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                lineHeight: 1,
              }}
            >✕</button>

            {/* Badge */}
            <div style={{
              display: 'inline-block',
              backgroundColor: 'rgba(29,158,117,0.12)',
              border: '1px solid rgba(29,158,117,0.3)',
              borderRadius: 100, padding: '4px 14px',
              fontSize: 11, fontWeight: 700, color: '#1D9E75',
              letterSpacing: '0.08em', textTransform: 'uppercase' as const,
              marginBottom: 16,
            }}>
              {modal.badge}
            </div>

            {/* Headline */}
            <h2 style={{
              fontSize: 'clamp(20px, 4vw, 28px)',
              fontWeight: 900, color: '#fff',
              margin: '0 0 20px', lineHeight: 1.2,
            }}>
              {modal.headline}
            </h2>

            {/* Mini stats */}
            <div style={{
              display: 'flex', gap: 12, flexWrap: 'wrap' as const,
              marginBottom: 24,
            }}>
              {modal.stats.map((s, i) => (
                <div key={i} style={{
                  flex: '1 1 60px', textAlign: 'center',
                  backgroundColor: 'rgba(29,158,117,0.06)',
                  border: '1px solid rgba(29,158,117,0.2)',
                  borderRadius: 10, padding: '10px 8px',
                }}>
                  <div style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 900, color: '#1D9E75', lineHeight: 1 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 10, color: '#666', marginTop: 4, letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(29,158,117,0.15)', marginBottom: 24 }} />

            {/* Body text */}
            {modal.body.split('\n\n').map((para, i) => (
              <p key={i} style={{
                fontSize: 15, color: '#C8C8C8',
                lineHeight: 1.85, margin: i === 0 ? 0 : '16px 0 0',
              }}>
                {para}
              </p>
            ))}

            {/* Eagle watermark bottom right */}
            <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end', opacity: 0.15 }}>
              <EagleSVG size={60} opacity={1} />
            </div>
          </div>
        </div>
      )}


      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.12; }
          50%       { transform: scale(1.04); opacity: 0.16; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .gallery-card {
          background: #0a0a0a;
          border: 1px solid rgba(29,158,117,0.3);
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
          cursor: pointer;
        }
        .gallery-card:hover {
          transform: scale(1.03);
          border-color: #1D9E75;
          box-shadow: 0 0 24px rgba(29,158,117,0.35);
        }
        @media (max-width: 768px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .gallery-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        paddingTop: 80,
        paddingBottom: 60,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>

        {/* Background watermark eagle */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'breathe 5s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 0,
        }}>
          <EagleSVG size={520} opacity={0.12} />
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, animation: 'fadeUp 0.8s ease forwards' }}>

          {/* Small logo eagle */}
          <div style={{ marginBottom: 20 }}>
            <EagleSVG size={110} opacity={1} />
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(32px, 6vw, 58px)',
            fontWeight: 900,
            color: '#ffffff',
            margin: 0,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}>
            Raja Club Atlético
          </h1>

          {/* Subtitle */}
          <p style={{
            marginTop: 14,
            fontSize: 'clamp(15px, 2.5vw, 20px)',
            color: '#1D9E75',
            fontStyle: 'italic',
            letterSpacing: '0.06em',
          }}>
            RASSI MERFOU3 DAKHEL LEL 7OUMA
          </p>

          {/* Divider */}
          <div style={{
            width: 120,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #1D9E75, transparent)',
            margin: '20px auto 0',
            borderRadius: 2,
          }} />
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────────── */}
      <section style={{ padding: '0 clamp(16px, 5vw, 60px) 60px' }}>

        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          <div className="gallery-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}>
            {GALLERY.map((card, i) => (
              <div
                key={i}
                className="gallery-card"
                onClick={() => card.story && setModal(card.story)}
                style={{ cursor: card.story ? 'pointer' : 'default' }}
              >
                {/* Image placeholder */}
                <div style={{
                  position: 'relative',
                  aspectRatio: '16/9',
                  background: card.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  {/* Watermark eagle */}
                  <div style={{ opacity: 0.18 }}>
                    <EagleSVG size={80} opacity={1} />
                  </div>

                  {/* "Lire" badge for cards with story */}
                  {card.story && (
                    <div style={{
                      position: 'absolute', top: 10, right: 10,
                      backgroundColor: '#1D9E75',
                      borderRadius: 6, padding: '3px 10px',
                      fontSize: 10, fontWeight: 800, color: '#000',
                      letterSpacing: '0.06em', textTransform: 'uppercase' as const,
                    }}>
                      Lire →
                    </div>
                  )}

                  {/* Scan lines effect */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(29,158,117,0.03) 3px, rgba(29,158,117,0.03) 4px)',
                    pointerEvents: 'none',
                  }} />

                  {/* Caption overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 100%)',
                    padding: '20px 12px 12px',
                  }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
                      {card.title}
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: 11, color: '#1D9E75', letterSpacing: '0.04em' }}>
                      {card.sub}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PALMARES ─────────────────────────────────────────── */}
      <section style={{
        padding: '0 clamp(16px, 5vw, 60px) 60px',
        maxWidth: 1100,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
        boxSizing: 'border-box',
      }}>

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10,
            backgroundColor: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.25)',
            borderRadius: 100, padding: '6px 20px', marginBottom: 14 }}>
            <span style={{ fontSize: 16 }}>🏆</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#1D9E75', letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>
              Palmarès Complet
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: 900, color: '#fff', margin: 0 }}>
            Une Histoire de Gloire
          </h2>
          <div style={{ width: 60, height: 2, background: 'linear-gradient(90deg, transparent, #1D9E75, transparent)', margin: '14px auto 0' }} />
        </div>

        {/* Palmares grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {PALMARES.map((group, gi) => (
            <div key={gi} style={{
              backgroundColor: '#0a0a0a',
              border: '1px solid rgba(29,158,117,0.25)',
              borderRadius: 16,
              overflow: 'hidden',
            }}>
              {/* Group header */}
              <div style={{
                padding: '14px 18px',
                background: 'linear-gradient(135deg, rgba(29,158,117,0.12) 0%, transparent 100%)',
                borderBottom: '1px solid rgba(29,158,117,0.15)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 18 }}>{group.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#1D9E75', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>
                  {group.category}
                </span>
              </div>

              {/* Items */}
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {group.items.map((item, ii) => (
                  <div key={ii} style={{
                    padding: '12px 14px',
                    backgroundColor: 'rgba(29,158,117,0.04)',
                    border: '1px solid rgba(29,158,117,0.12)',
                    borderRadius: 10,
                  }}>
                    {/* Title + count */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#F0F0F0', lineHeight: 1.3, flex: 1 }}>
                        {item.title}
                      </span>
                      <span style={{
                        fontSize: 11, fontWeight: 800, color: '#000',
                        backgroundColor: '#1D9E75', borderRadius: 6, padding: '2px 8px',
                        whiteSpace: 'nowrap' as const, flexShrink: 0,
                      }}>
                        {item.count}
                      </span>
                    </div>
                    {/* Years */}
                    <p style={{ margin: 0, fontSize: 11, color: '#555', lineHeight: 1.5 }}>
                      {item.years}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Total counter */}
        <div style={{
          marginTop: 24,
          display: 'flex', justifyContent: 'center', gap: 32,
          flexWrap: 'wrap' as const,
        }}>
          {[
            { n: '22', label: 'Titres Nationaux' },
            { n: '9',  label: 'Titres Africains' },
            { n: '2',  label: 'Titres Arabes' },
            { n: '33+', label: 'Total Trophées' },
          ].map((t, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 900, color: '#1D9E75', lineHeight: 1 }}>
                {t.n}
              </div>
              <div style={{ fontSize: 11, color: '#666', marginTop: 4, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
                {t.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUOTE ────────────────────────────────────────────── */}
      <section style={{
        margin: '0 clamp(16px, 5vw, 60px) 80px',
        maxWidth: 1100,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 80,
      }}>
        <div style={{
          backgroundColor: '#0a1a0a',
          borderRadius: 20,
          padding: 'clamp(32px, 6vw, 56px) clamp(24px, 6vw, 64px)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(29,158,117,0.15)',
          textAlign: 'center',
        }}>
          {/* Decorative quote mark */}
          <span style={{
            position: 'absolute',
            top: -10,
            left: 24,
            fontSize: 140,
            color: '#1D9E75',
            opacity: 0.18,
            fontFamily: 'Georgia, serif',
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
          }}>"</span>

          <p style={{
            fontSize: 'clamp(16px, 2.8vw, 22px)',
            fontStyle: 'italic',
            color: '#fff',
            lineHeight: 1.7,
            margin: 0,
            position: 'relative',
            zIndex: 1,
          }}>
            Raja n'est pas qu'un club, c'est une religion.
            <br />Vert dans le sang, aigle dans l'âme.
          </p>

          <p style={{
            marginTop: 20,
            fontSize: 14,
            color: '#1D9E75',
            letterSpacing: '0.08em',
            fontWeight: 600,
            position: 'relative',
            zIndex: 1,
          }}>
            — Rajaoui Pour Toujours
          </p>

          {/* Bottom eagle watermark */}
          <div style={{
            position: 'absolute',
            bottom: -20,
            right: -20,
            opacity: 0.06,
            pointerEvents: 'none',
          }}>
            <EagleSVG size={180} opacity={1} />
          </div>
        </div>
      </section>

    </div>
  )
}

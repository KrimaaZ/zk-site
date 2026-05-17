'use client'

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
  },
  {
    title: 'Raja vs Wydad — Le Derby',
    sub: 'Derby de Casablanca · Stade Mohammed V',
    gradient: 'linear-gradient(135deg, #0d1a0d 0%, #000 60%)',
  },
  {
    title: 'CAF Champions League',
    sub: 'Campagne Africaine · Phase de Groupes',
    gradient: 'linear-gradient(135deg, #0a1a15 0%, #000 60%)',
  },
  {
    title: 'Les Ultras Eagles',
    sub: 'Virage Nord · Ambiance Légendaire',
    gradient: 'linear-gradient(135deg, #0a1a0e 0%, #000 60%)',
  },
  {
    title: 'Triplé Historique',
    sub: 'Saison Mémorable · Raja Forever',
    gradient: 'linear-gradient(135deg, #0d1a10 0%, #000 60%)',
  },
  {
    title: 'Nuit Verte à Casa',
    sub: 'Célébration du Titre · Casablanca',
    gradient: 'linear-gradient(135deg, #0a1a12 0%, #000 60%)',
  },
]

const STATS = [
  { icon: '🏆', value: '12 Titres',    label: 'Championnat Maroc' },
  { icon: '⚽', value: '1949',         label: 'Année de Fondation' },
  { icon: '🦅', value: 'Raja Forever', label: 'Notre Devise' },
  { icon: '🟢', value: 'Vert & Blanc', label: 'Nos Couleurs' },
]

export default function RajaPage() {
  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: '#fff', fontFamily: 'inherit' }}>

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
        .stat-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 12px;
          text-align: center;
          border-right: 1px solid rgba(29,158,117,0.2);
        }
        .stat-item:last-child { border-right: none; }
        @media (max-width: 640px) {
          .stat-item { border-right: none; border-bottom: 1px solid rgba(29,158,117,0.2); }
          .stat-item:last-child { border-bottom: none; }
        }
        @media (max-width: 768px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .gallery-grid { grid-template-columns: 1fr !important; }
          .stats-row { flex-direction: column !important; }
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
              <div key={i} className="gallery-card">

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

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <section style={{
        margin: '0 clamp(16px, 5vw, 60px)',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(29,158,117,0.2)',
        borderTop: '2px solid #1D9E75',
        backgroundColor: '#050505',
        marginBottom: 60,
        maxWidth: 1100,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        <div className="stats-row" style={{ display: 'flex' }}>
          {STATS.map((s, i) => (
            <div key={i} className="stat-item">
              <span style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</span>
              <span style={{ fontSize: 'clamp(18px, 3vw, 28px)', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                {s.value}
              </span>
              <span style={{ fontSize: 12, color: '#1D9E75', marginTop: 5, letterSpacing: '0.05em' }}>
                {s.label}
              </span>
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

'use client'

import Image from 'next/image'

export default function RajaPage() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes breathe {
          0%   { transform: translate(-50%, -50%) scale(1); }
          50%  { transform: translate(-50%, -50%) scale(1.04); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>

      <img
        src="/raja-eagle.png"
        alt=""
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 'clamp(220px, 40vw, 500px)',
          height: 'auto',
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 30px rgba(29, 158, 117, 0.6)) drop-shadow(0 0 60px rgba(29, 158, 117, 0.3))',
          animation: 'breathe 4s ease-in-out infinite',
        }}
      />
    </div>
  )
}

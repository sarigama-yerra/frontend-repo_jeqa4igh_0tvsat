import React, { useEffect, useRef, useState } from 'react'

const colors = {
  bg: '#0A0F1A',
  primary: '#0E5FFF',
  teal: '#00D1B2',
  paper: '#F6F8FB',
  gray900: '#111827',
}

export default function Layout({ children }) {
  const [theme, setTheme] = useState('dark')
  const rootRef = useRef(null)
  const motionOK = usePrefersMotion()

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      el.style.setProperty('--mx', String(x))
      el.style.setProperty('--my', String(y))
    }

    if (motionOK) {
      window.addEventListener('pointermove', handleMove, { passive: true })
    }
    return () => window.removeEventListener('pointermove', handleMove)
  }, [motionOK])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div ref={rootRef} className="relative min-h-screen bg-[#0A0F1A] text-white overflow-hidden">
      {/* Blueprint grid backdrop with parallax layers */}
      <ParallaxGrid />

      {/* Top bar with theme toggle and sticky CTA on mobile */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-black/30 bg-black/40">
        <div className="mx-auto max-w-[1200px] px-4 py-3 flex items-center justify-between">
          <a href="#top" className="text-sm font-semibold tracking-wide text-white/80">Industrial Automation & Robotics</a>
          <div className="flex items-center gap-3">
            <button aria-label="Toggle theme" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors text-xs">
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <a href="#apply" className="hidden sm:inline-flex px-3 py-1.5 rounded bg-[#0E5FFF] hover:bg-[#0b53e6] transition-colors text-xs font-semibold">
              Apply Now
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {children}
      </main>

      <a href="#apply" className="fixed sm:hidden bottom-4 right-4 z-40 px-4 py-2 rounded-full bg-[#0E5FFF] shadow-lg shadow-blue-500/30 text-sm font-semibold">
        Apply
      </a>

      <footer className="relative z-10 border-t border-white/10 mt-20">
        <div className="mx-auto max-w-[1200px] px-4 py-10 text-white/70 text-sm">
          © {new Date().getFullYear()} Industrial Automation & Robotics Program
        </div>
      </footer>
    </div>
  )
}

function usePrefersMotion() {
  const [ok, setOk] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setOk(!mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return ok
}

function ParallaxGrid() {
  // 3 depth tiers responding to --mx/--my
  return (
    <div aria-hidden="true" className="absolute inset-0" style={{ perspective: '800px' }}>
      {/* base tint */}
      <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_20%_-10%,rgba(14,95,255,0.25),transparent),radial-gradient(800px_500px_at_80%_10%,rgba(0,209,178,0.18),transparent)]" />
      {/* grid layers */}
      <GridLayer depth={8} opacity={0.18} size={32} />
      <GridLayer depth={16} opacity={0.10} size={24} />
      <GridLayer depth={32} opacity={0.06} size={16} />
      {/* vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(1200px_600px_at_50%_20%,transparent,rgba(0,0,0,0.6))]" />
    </div>
  )
}

function GridLayer({ depth = 8, opacity = 0.1, size = 24 }) {
  const style = {
    transform: `translate3d(calc(var(--mx,0) * ${depth}px), calc(var(--my,0) * ${depth}px), 0)`,
    backgroundImage: `linear-gradient(to right, rgba(255,255,255,${opacity}) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,${opacity}) 1px, transparent 1px)`,
    backgroundSize: `${size}px ${size}px`,
  }
  return <div className="absolute inset-0 will-change-transform" style={style} />
}

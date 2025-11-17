import React, { useEffect, useRef } from 'react'
import Spline from '@splinetool/react-spline'

export default function Hero() {
  const countersRef = useRef([])
  const observerRef = useRef(null)
  const playingRef = useRef(true)

  useEffect(() => {
    // KPI counters animate when in view
    const counters = countersRef.current
    const animate = (el) => {
      const end = Number(el.dataset.end || 100)
      const dur = 1200
      const start = performance.now()
      const step = (t) => {
        const p = Math.min(1, (t - start) / dur)
        el.textContent = Math.round(end * easeOutCubic(p))
        if (p < 1 && playingRef.current) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }
    observerRef.current = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) animate(e.target)
    }, { threshold: 0.5 })
    counters.forEach(el => el && observerRef.current.observe(el))

    const onBlur = () => { playingRef.current = false }
    const onFocus = () => { playingRef.current = true }
    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
      observerRef.current?.disconnect()
    }
  }, [])

  return (
    <section id="top" className="relative min-h-[80vh] flex items-center">
      {/* Spline 3D cover background */}
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/xVcGsBa0crFDHR-t/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 mx-auto max-w-[1200px] px-4 py-24 grid grid-cols-12 gap-6 text-white">
        <div className="col-span-12 md:col-span-7">
          <h1 className="text-3xl sm:text-5xl font-semibold leading-tight">
            Industrial Automation & Robotics Program
          </h1>
          <p className="mt-4 text-white/80 max-w-prose">
            Learn PLCs, robotics, vision systems and integration by building real cells. Motion-first website with interactive demos throughout.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#apply" className="px-5 py-3 rounded-lg bg-[#0E5FFF] hover:bg-[#0b53e6] transition-colors font-medium">
              Apply Now
            </a>
            <a href="#curriculum" className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium">
              Explore Curriculum
            </a>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-6 text-center">
            {[
              { label: 'Hours of Labs', value: 240 },
              { label: 'Industry Projects', value: 8 },
              { label: 'Placement Rate %', value: 96 },
            ].map((kpi, i) => (
              <div key={kpi.label} className="bg-black/30 rounded-lg p-4 backdrop-blur">
                <div ref={el => (countersRef.current[i] = el)} data-end={kpi.value} className="text-3xl font-semibold">0</div>
                <div className="text-xs mt-1 text-white/70">{kpi.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function easeOutCubic(x){return 1 - Math.pow(1 - x, 3)}

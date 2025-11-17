import React, { useState } from 'react'
import { Cpu, Bot, Cog, Info } from 'lucide-react'

const cards = [
  { title: 'Sensors', icon: Cpu, body: 'Proximity, photoelectric, vision, encoders.' },
  { title: 'Actuators', icon: Cog, body: 'Servos, pneumatics, conveyors, grippers.' },
  { title: 'PLCs', icon: Bot, body: 'Ladder, function blocks, motion control.' },
]

export default function Snapshot(){
  const [open, setOpen] = useState(null)
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1200px] px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white">Program Snapshot</h2>
        <div className="mt-8 grid grid-cols-12 gap-4">
          {cards.map((c, idx) => (
            <Card key={c.title} {...c} idx={idx} open={open} setOpen={setOpen} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Card({ title, icon: Icon, body, idx, open, setOpen }){
  const active = open === idx
  return (
    <button
      onClick={() => setOpen(active ? null : idx)}
      className="col-span-12 md:col-span-4 text-left p-5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#00D1B2]"
      aria-expanded={active}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-[#00D1B2]" />
        <div className="font-medium">{title}</div>
      </div>
      <div className={`mt-3 text-white/80 text-sm ${active ? 'block' : 'hidden'}`}>{body}</div>
    </button>
  )
}

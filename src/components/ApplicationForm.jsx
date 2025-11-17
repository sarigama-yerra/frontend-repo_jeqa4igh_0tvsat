import React, { useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function ApplicationForm(){
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')

  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    experience_years: 0, interests: [], message: '', consent: false,
  })

  const steps = ['Basic', 'Experience', 'Confirm']
  const next = () => setStep(s => Math.min(steps.length-1, s+1))
  const prev = () => setStep(s => Math.max(0, s-1))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setErr('')
    try {
      const res = await fetch(`${API}/api/apply`, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(form) })
      if(!res.ok) throw new Error(await res.text())
      next(); setDone(true)
    } catch (e) {
      setErr(String(e))
    } finally { setLoading(false) }
  }

  return (
    <section id="apply" className="py-20">
      <div className="mx-auto max-w-[1200px] px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white">Application</h2>

        <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-2 text-xs text-white/70">
            {steps.map((s, i) => (
              <div key={s} className={`flex-1 h-1 rounded ${i <= step ? 'bg-[#0E5FFF]' : 'bg-white/10'}`} />
            ))}
          </div>

          {!done && (
            <form className="mt-6 space-y-4" onSubmit={submit}>
              {step === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="First name" value={form.first_name} onChange={v=>setForm({ ...form, first_name:v })} required />
                  <Input label="Last name" value={form.last_name} onChange={v=>setForm({ ...form, last_name:v })} required />
                  <Input type="email" label="Email" value={form.email} onChange={v=>setForm({ ...form, email:v })} required />
                  <Input label="Phone" value={form.phone} onChange={v=>setForm({ ...form, phone:v })} />
                </div>
              )}
              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input type="number" label="Years of experience" value={form.experience_years} onChange={v=>setForm({ ...form, experience_years:Number(v) })} />
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm text-white/80">Interests</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {['PLC', 'Robotics', 'Vision', 'Networking'].map(opt => (
                        <button type="button" key={opt} onClick={() => toggle(opt, form, setForm)} className={`px-3 py-1.5 rounded-full text-xs border ${form.interests.includes(opt) ? 'bg-[#00D1B2] text-black border-transparent' : 'border-white/20 text-white/80'}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm text-white/80">Message</label>
                    <textarea value={form.message} onChange={e=>setForm({ ...form, message:e.target.value })} className="mt-2 w-full rounded bg-black/40 border border-white/10 p-3 min-h-[120px]" />
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="text-white/80 text-sm">
                  Review your details, then submit. By submitting you agree to our terms.
                </div>
              )}

              {err && <div className="text-red-400 text-sm">{err}</div>}

              <div className="flex items-center gap-3 pt-2">
                {step > 0 && <button type="button" onClick={prev} className="px-4 py-2 rounded bg-white/10">Back</button>}
                {step < steps.length-1 && <button type="button" onClick={next} className="px-4 py-2 rounded bg-[#0E5FFF]">Next</button>}
                {step === steps.length-1 && <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-[#00D1B2] text-black">{loading ? 'Submitting...' : 'Submit'}</button>}
              </div>
            </form>
          )}

          {done && (
            <div className="mt-6 p-6 rounded-lg bg-black/40 border border-white/10 text-white/80">
              <div className="text-lg font-semibold text-white">Application received!</div>
              We will get back to you shortly.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Input({ label, value, onChange, type='text', required=false }){
  return (
    <label className="block text-sm">
      <span className="text-white/80">{label}</span>
      <input type={type} required={required} value={value} onChange={e=>onChange(e.target.value)} className="mt-2 w-full rounded bg-black/40 border border-white/10 p-2.5" />
    </label>
  )
}

function toggle(opt, form, setForm){
  const has = form.interests.includes(opt)
  setForm({ ...form, interests: has ? form.interests.filter(o=>o!==opt) : [...form.interests, opt] })
}

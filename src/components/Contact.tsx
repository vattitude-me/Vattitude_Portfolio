import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Step = 'info' | 'message' | 'success'

export default function Contact() {
  const [step, setStep] = useState<Step>('info')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [sending, setSending] = useState(false)

  const validateInfo = () => {
    const errs: Record<string, boolean> = {}
    if (!form.name.trim()) errs.name = true
    if (!form.email.trim() || !form.email.includes('@')) errs.email = true
    setErrors(errs)
    if (Object.keys(errs).length === 0) setStep('message')
  }

  const validateMessage = () => {
    const errs: Record<string, boolean> = {}
    if (!form.subject.trim()) errs.subject = true
    if (!form.message.trim()) errs.message = true
    setErrors(errs)
    if (Object.keys(errs).length === 0) submitForm()
  }

  const submitForm = async () => {
    setSending(true)
    // Firebase integration placeholder - wire up Firestore here
    await new Promise((r) => setTimeout(r, 1500))
    setSending(false)
    setStep('success')
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl bg-white/5 border ${
      errors[field] ? 'border-red-500 animate-[shake_0.3s_ease-in-out]' : 'border-white/10'
    } text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors`

  return (
    <section id="contact" className="relative py-32 z-10">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The <span className="text-cyan-400">Nexus</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Ready to start your project? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  📍
                </div>
                <div>
                  <h4 className="text-white font-medium">Location</h4>
                  <p className="text-slate-400 text-sm">Toronto, Canada</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  ✉️
                </div>
                <div>
                  <h4 className="text-white font-medium">Email</h4>
                  <p className="text-slate-400 text-sm">vatsakrish@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  📱
                </div>
                <div>
                  <h4 className="text-white font-medium">Phone</h4>
                  <p className="text-slate-400 text-sm">+1 437 990 8118</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
              <h4 className="text-white font-medium mb-3">Follow Us</h4>
              <div className="flex gap-3">
                {[
                  { label: 'FB', href: 'https://m.me/vatsakrish' },
                  { label: 'IG', href: 'https://www.instagram.com/Vattitude.me/' },
                  { label: 'LI', href: 'https://www.linkedin.com/in/srivatsan-sridhar-a04102126/' },
                  { label: 'WA', href: 'https://wa.me/14379908118' },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-sm text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              {['info', 'message', 'success'].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    step === s ? 'bg-cyan-400' : i < ['info', 'message', 'success'].indexOf(step) ? 'bg-cyan-600' : 'bg-slate-700'
                  }`} />
                  {i < 2 && <div className="w-8 h-[2px] bg-slate-700" />}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 'info' && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-white">Your Info</h3>
                  <input
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({}) }}
                    className={inputClass('name')}
                  />
                  <input
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({}) }}
                    className={inputClass('email')}
                  />
                  <motion.button
                    onClick={validateInfo}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold"
                  >
                    Next
                  </motion.button>
                </motion.div>
              )}

              {step === 'message' && (
                <motion.div
                  key="message"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-white">Your Message</h3>
                  <input
                    placeholder="Subject"
                    value={form.subject}
                    onChange={(e) => { setForm({ ...form, subject: e.target.value }); setErrors({}) }}
                    className={inputClass('subject')}
                  />
                  <textarea
                    placeholder="Tell us about your project..."
                    rows={4}
                    value={form.message}
                    onChange={(e) => { setForm({ ...form, message: e.target.value }); setErrors({}) }}
                    className={inputClass('message') + ' resize-none'}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('info')}
                      className="px-5 py-3 rounded-xl border border-slate-600 text-slate-300 hover:border-cyan-500/50 transition-all"
                    >
                      Back
                    </button>
                    <motion.button
                      onClick={validateMessage}
                      disabled={sending}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold disabled:opacity-50"
                    >
                      {sending ? 'Transmitting...' : 'Send Message'}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6"
                  >
                    <span className="text-4xl">✓</span>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">Transmission Successful</h3>
                  <p className="text-slate-400">We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => { setStep('info'); setForm({ name: '', email: '', subject: '', message: '' }) }}
                    className="mt-6 px-6 py-2 rounded-full border border-slate-600 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
                  >
                    Send Another
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </section>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    message: '',
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      await fetch('https://getform.io/f/brollqya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSent(true)
      setForm({ name: '', email: '', company: '', phone: '', service: '', message: '' })
    } catch {
      alert('Something went wrong. Please try again.')
    }
    setSending(false)
  }

  const inputClass =
    'w-full px-5 py-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors'

  const contactCards = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      color: 'cyan',
      title: "Let's Talk",
      desc: '+1 (437) 990-8118',
      sub: 'Mon - Fri, 9AM - 6PM EST',
      action: 'Call Now',
      href: 'tel:+14379908118',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'purple',
      title: 'Email Us',
      desc: 'info.vattitude@gmail.com',
      sub: 'We reply within 24 hours.',
      href: 'mailto:info.vattitude@gmail.com',
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.61.609l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.359 0-4.542-.803-6.272-2.152l-.438-.362-3.052 1.023 1.023-3.052-.362-.438A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
      ),
      color: 'green',
      title: 'WhatsApp Us',
      desc: '+1 (437) 990-8118',
      sub: 'Quick replies, anytime.',
      href: 'https://wa.me/14379908118',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'pink',
      title: "Let's Meet in Person",
      desc: 'Toronto, Ontario, Canada',
      sub: 'Fill the form to connect.',
      href: '#contact',
    },
  ]

  function getIconStyle(color: string) {
    switch (color) {
      case 'cyan': return 'bg-cyan-950/80 text-cyan-400 border-cyan-500/40'
      case 'purple': return 'bg-purple-950/80 text-purple-400 border-purple-500/40'
      case 'green': return 'bg-green-950/80 text-green-400 border-green-500/40'
      case 'pink': return 'bg-pink-950/80 text-pink-400 border-pink-500/40'
      default: return 'bg-cyan-950/80 text-cyan-400 border-cyan-500/40'
    }
  }

  return (
    <section id="contact" className="relative py-32 z-10">
      <div className="w-full px-8 md:px-16 lg:px-20 xl:px-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left column — heading + contact cards */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-slate-300">We're Here to Help</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white leading-[1.08] mb-6">
              Let's Build Something{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Amazing Together.
              </span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Have a project in mind or just want to explore ideas? We'd love to hear from you.
            </p>

            {/* Contact cards — 2×2 grid */}
            <div className="grid grid-cols-2 gap-4">
              {contactCards.map((card, i) => (
                <motion.a
                  key={card.title}
                  href={card.href}
                  target={card.href.startsWith('http') ? '_blank' : undefined}
                  rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -3 }}
                  className="group relative p-5 rounded-2xl transition-all"
                >
                  {/* Gradient glow border */}
                  <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-b ${
                    card.color === 'cyan' ? 'from-cyan-500 to-cyan-400' :
                    card.color === 'purple' ? 'from-purple-500 to-purple-400' :
                    card.color === 'green' ? 'from-green-500 to-green-400' :
                    'from-pink-500 to-pink-400'
                  } opacity-15 group-hover:opacity-40 transition-opacity duration-300 blur-[0.5px]`} />

                  <div className="relative bg-[#0a0f1a] border border-white/[0.08] group-hover:border-transparent rounded-2xl p-5 h-full transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getIconStyle(card.color)}`}>
                        {card.icon}
                      </div>
                      <svg className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-1">{card.title}</h4>
                    <p className="text-slate-400 text-sm leading-snug">{card.desc}</p>
                    {card.sub && <p className="text-slate-500 text-xs mt-0.5">{card.sub}</p>}
                    {card.action && (
                      <span className={`inline-flex items-center gap-1 text-xs font-medium mt-3 group-hover:translate-x-1 transition-transform ${
                        card.color === 'cyan' ? 'text-cyan-400' :
                        card.color === 'purple' ? 'text-purple-400' :
                        card.color === 'green' ? 'text-green-400' :
                        'text-pink-400'
                      }`}>
                        {card.action}
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    )}
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right column — form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-cyan-500/20 to-purple-500/20 opacity-30 blur-[0.5px]" />
            <div className="relative p-8 md:p-10 rounded-2xl bg-[#0a0f1a] border border-white/[0.08]">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-slate-400 mb-6">We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => setSent(false)}
                    className="px-6 py-2 rounded-full border border-slate-600 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
                  >
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-white mb-2">Send Us a Message</h3>
                  <p className="text-slate-400 text-sm mb-8">Fill out the form and we'll get back to you soon.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Your Name"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputClass}
                      />
                      <input
                        type="email"
                        placeholder="Your Email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        className={inputClass}
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className={`${inputClass} appearance-none`}
                    >
                      <option value="" className="bg-[#0a0f1a]">What are you looking for?</option>
                      <option value="web" className="bg-[#0a0f1a]">Web Development</option>
                      <option value="ecommerce" className="bg-[#0a0f1a]">Online Business Setup</option>
                      <option value="design" className="bg-[#0a0f1a]">UI/UX Design</option>
                      <option value="brand" className="bg-[#0a0f1a]">Brand Identity</option>
                      <option value="growth" className="bg-[#0a0f1a]">Digital Growth</option>
                      <option value="automation" className="bg-[#0a0f1a]">Automation & Integrations</option>
                    </select>
                    <textarea
                      placeholder="Tell us about your project..."
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={`${inputClass} resize-none`}
                    />
                    <motion.button
                      type="submit"
                      disabled={sending}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold text-lg shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {sending ? 'Sending...' : 'Send Message'}
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </motion.button>
                  </form>

                  <p className="flex items-center gap-2 text-slate-500 text-xs mt-4">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Your information is safe with us. We never share your data.
                  </p>
                </>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

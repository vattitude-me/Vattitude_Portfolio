import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.a
            href="#home"
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <img src="/logo.png" alt="Vattitude" className="h-8 w-8" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Vattitude
            </span>
          </motion.a>

          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Vattitude.ca — Built with passion in Toronto.
          </p>

          <div className="flex gap-4">
            {[
              { label: 'FB', href: 'https://m.me/vatsakrish' },
              { label: 'IG', href: 'https://www.instagram.com/Vattitude.me/' },
              { label: 'LI', href: 'https://www.linkedin.com/in/srivatsan-sridhar-a04102126/' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-xs text-slate-500 hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

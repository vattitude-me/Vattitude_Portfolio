import { motion } from 'framer-motion'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#050810] text-slate-300">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <a href="/" className="inline-flex items-center gap-2 text-cyan-400 text-sm mb-8 hover:underline">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-500 mb-12">Last updated: June 2025</p>

          <div className="space-y-8 text-slate-400 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
              <p>When you contact us through our website, we may collect the following information:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Name and email address</li>
                <li>Company name and phone number</li>
                <li>Project details you share with us</li>
                <li>Usage data (pages visited, time on site) via analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Respond to your inquiries and provide requested services</li>
                <li>Send project proposals and follow-up communications</li>
                <li>Improve our website and services</li>
                <li>Send occasional updates about our services (with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Data Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties.
                We may share data with trusted service providers who assist in operating our website
                (e.g., hosting, analytics), bound by confidentiality agreements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information.
                However, no method of transmission over the internet is 100% secure, and we cannot
                guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Cookies</h2>
              <p>
                Our website may use cookies to enhance your browsing experience and collect analytics data.
                You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Access, correct, or delete your personal data</li>
                <li>Withdraw consent for marketing communications</li>
                <li>Request a copy of data we hold about you</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, contact us at{' '}
                <a href="mailto:info.vattitude@gmail.com" className="text-cyan-400 hover:underline">
                  info.vattitude@gmail.com
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

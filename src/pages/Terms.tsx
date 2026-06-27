import { motion } from 'framer-motion'

export default function Terms() {
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

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms & Conditions</h1>
          <p className="text-slate-500 mb-12">Last updated: June 2025</p>

          <div className="space-y-8 text-slate-400 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Agreement to Terms</h2>
              <p>
                By accessing or using Vattitude's website and services, you agree to be bound by these
                Terms & Conditions. If you disagree with any part of the terms, you may not access our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Services</h2>
              <p>
                Vattitude provides web development, design, branding, and digital growth services.
                Specific deliverables, timelines, and pricing are outlined in individual project proposals
                and contracts.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Intellectual Property</h2>
              <p>
                All content on this website — including design, text, graphics, logos, and code — is the
                property of Vattitude and is protected by intellectual property laws. Client deliverables
                are transferred upon full payment as outlined in individual agreements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Client Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide timely feedback and required materials</li>
                <li>Ensure accuracy of information provided to us</li>
                <li>Make payments according to agreed-upon schedules</li>
                <li>Obtain necessary rights for any content you provide</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Payment Terms</h2>
              <p>
                Payment schedules are defined in individual project contracts. Unless otherwise agreed,
                a deposit is required before work begins. Outstanding invoices are subject to late fees
                as outlined in the project agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Limitation of Liability</h2>
              <p>
                Vattitude shall not be liable for any indirect, incidental, or consequential damages
                arising from the use of our services. Our total liability is limited to the amount paid
                for the specific service in question.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Revisions & Scope Changes</h2>
              <p>
                Projects include a defined number of revision rounds. Additional revisions or scope
                changes beyond the original agreement may incur additional charges, communicated in advance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Termination</h2>
              <p>
                Either party may terminate a project with written notice. Upon termination, client is
                responsible for payment of all work completed to date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">9. Governing Law</h2>
              <p>
                These terms are governed by the laws of the Province of Ontario, Canada.
                Any disputes shall be resolved in the courts of Ontario.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">10. Contact</h2>
              <p>
                For questions about these terms, reach out at{' '}
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

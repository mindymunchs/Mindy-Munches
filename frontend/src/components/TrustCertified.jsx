import { motion } from "framer-motion";

const certs = [
  {
    src: "/fssai_logo.png",
    alt: "FSSAI Certified",
    label: "FSSAI Certified",
    sub: "Lic. 12725052000543",
  },
  {
    src: "/startup_logo.png",
    alt: "Startup India Recognised",
    label: "Startup India Recognised",
    sub: "Cert. DIPP207481",
  },
  {
    src: "/apeda_logo.png",
    alt: "APEDA Registered",
    label: "APEDA Registered",
    sub: "Reg. RCMC/APEDA/24864/2025-26",
  },
];

const chips = [
  "Protein 25.1g/100g",
  "Omega-3 0.37g/100g",
  "Dietary Fibre 16g/100g",
  "Zero Added Sugar",
];

const TrustCertified = () => (
  <section className="bg-white py-20 md:py-28">
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Heading — full width */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
      >
        <h2
          className="font-brand font-bold text-neutral-900 leading-tight"
          style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
        >
          India's Answer to Sugar-Free Energy.
        </h2>
      </motion.div>

      {/* Content left + Image right */}
      <div className="flex flex-col md:flex-row items-start gap-10 md:gap-16">

        {/* Left — certs + lab card */}
        <div className="flex-1 min-w-0 flex flex-col gap-8">

          {/* Cert logos */}
          <div className="flex flex-wrap gap-8">
            {certs.map((cert, i) => (
              <motion.div
                key={cert.label}
                className="flex flex-col items-center gap-2 group"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="h-12 w-28 flex items-center justify-center">
                  <img
                    src={cert.src}
                    alt={cert.alt}
                    className="max-h-full max-w-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                  />
                </div>
                <p className="font-sans text-xs text-neutral-500 text-center leading-relaxed">
                  {cert.label}
                  <br />
                  <span className="text-neutral-400">{cert.sub}</span>
                </p>
              </motion.div>
            ))}
          </div>

          {/* Lab report card */}
          <motion.div
            className="border border-neutral-200 rounded-2xl p-6 bg-neutral-50 flex flex-col sm:flex-row items-start sm:items-center gap-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Icon */}
            <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-7 h-7 text-primary-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 3h6m-6 0v6l-4 9a1 1 0 00.9 1.45h12.2A1 1 0 0019 18l-4-9V3M9 3h6"
                />
              </svg>
            </div>

            {/* Text */}
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-base text-neutral-900 mb-1">
                Independently Lab Tested
              </h3>
              <p className="font-sans text-xs text-neutral-500 leading-relaxed mb-3">
                Tested by Equinox Labs — NABL Accredited. Report No:
                EQNX:001:FT:26:03:12157. April 2026.
              </p>
              <div className="flex gap-2 flex-wrap">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="bg-primary-50 text-primary-700 rounded-full px-3 py-1 text-xs font-sans font-medium"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <a
              href="/game-up-test-report.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 border border-neutral-300 rounded-lg px-4 py-2.5 font-heading text-xs uppercase tracking-wide text-neutral-700 hover:border-primary-400 hover:text-primary-700 hover:bg-primary-50 transition-all duration-200 flex items-center gap-2"
            >
              View Report
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </motion.div>

        </div>

        {/* Right — 1:1 banner image */}
        <motion.div
          className="flex-shrink-0 w-full max-w-sm md:max-w-none md:w-[420px]"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="aspect-square rounded-2xl overflow-hidden shadow-md">
            <img
              src="/sugar_free.png"
              alt="India's Answer to Sugar-Free Energy"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

      </div>

    </div>
  </section>
);

export default TrustCertified;

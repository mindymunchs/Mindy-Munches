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

const fuelPoints = [
  { icon: "⚡", text: "Low Glycaemic Index — Diabetic Friendly" },
  { icon: "🌾", text: "Complex Carbs — Keeps You Full for Long" },
  { icon: "🚫", text: "No Refined Sugar" },
  { icon: "🧪", text: "No Chemicals or Artificial Stimulants" },
  { icon: "🌱", text: "100% Natural Ingredients" },
  { icon: "💪", text: "Sustained Energy — Zero Crash" },
];

const TrustCertified = () => (
  <section className="bg-white py-20 md:py-28">
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Two-column layout — content left, banner image right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">

        {/* LEFT — all content */}
        <div className="lg:col-span-7 flex flex-col gap-8">

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="font-brand font-bold text-neutral-900 leading-tight"
              style={{ fontSize: "clamp(1.85rem, 3.4vw, 3rem)" }}
            >
              India's Answer to Sugar-Free Energy.
            </h2>
          </motion.div>

          {/* Cert logos */}
          <div className="flex flex-wrap gap-x-8 gap-y-4">
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
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6m-6 0v6l-4 9a1 1 0 00.9 1.45h12.2A1 1 0 0019 18l-4-9V3M9 3h6" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
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

            <a
              href="/game-up-test-report.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 border border-neutral-300 rounded-lg px-4 py-2.5 font-heading text-xs uppercase tracking-wide text-neutral-700 hover:border-primary-400 hover:text-primary-700 hover:bg-primary-50 transition-all duration-200 flex items-center gap-2"
            >
              View Report
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </motion.div>

          {/* Why It Works — Daily Performance Fuel ingredient block */}
          <motion.div
            className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 md:p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="font-heading font-semibold text-xs uppercase tracking-[0.18em] text-[#4ade80] mb-5">
              Daily Performance Fuel Powered
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {fuelPoints.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-lg leading-none">{item.icon}</span>
                  <span className="font-sans text-sm text-neutral-700">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-neutral-200">
              <a
                href="#whatsapp-cta"
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-heading font-semibold text-sm uppercase tracking-wide px-6 py-3 rounded-lg transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
              <a
                href="#whatsapp-cta"
                className="flex-1 flex items-center justify-center bg-accent-500 hover:bg-accent-600 text-neutral-900 font-heading font-semibold text-sm uppercase tracking-wide px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Order Trial Kit
              </a>
            </div>
          </motion.div>

        </div>

        {/* RIGHT — full-height banner image */}
        <motion.div
          className="lg:col-span-5 w-full"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="relative h-full min-h-[420px] lg:min-h-full rounded-2xl overflow-hidden shadow-lg">
            {/*
              ASSET TODO: Replace this image once client provides
              the new product pack / sachet image.
              Place new file in frontend/public/ and update src here.
              Requested by client on 24-Apr-2026.
            */}
            <img
              src="/sugar_free.png"
              alt="India's Answer to Sugar-Free Energy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </motion.div>

      </div>

    </div>
  </section>
);

export default TrustCertified;

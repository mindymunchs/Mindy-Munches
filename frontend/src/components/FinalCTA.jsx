import { motion } from "framer-motion";

const FinalCTA = () => (
  <section className="bg-white min-h-[420px] py-24 md:py-32 border-t border-neutral-200">
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="w-10 h-0.5 bg-[#4ade80] mx-auto mb-4" />

        <motion.p
          className="text-xs uppercase tracking-[0.2em] font-semibold text-[#4ade80] mb-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0 }}
        >
          The Game Up Promise
        </motion.p>

        <motion.h2
          className="font-heading font-bold text-neutral-900 mb-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.15 }}
        >
          Fuel That Works as Hard as You Do.
        </motion.h2>

        <motion.p
          className="font-sans text-lg text-neutral-600 max-w-xl mx-auto leading-relaxed mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.25 }}
        >
          Sustained energy. Deep hydration. Mental clarity. Everything you need
          to perform at your peak — in one clean formula.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.4 }}
        >
          {/* TODO: Replace with live Interakt/WhatsApp number before launch */}
          <a
            href="https://wa.me/919999999999?text=Hi%2C%20I%20want%20to%20order%20Game%20Up!"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-block bg-accent-500 text-neutral-900 font-heading font-semibold uppercase tracking-wide py-4 px-8 rounded-lg transition-transform duration-200 hover:scale-[1.02] text-center"
          >
            Beat the Crash Now
          </a>

          <a
            href="/products"
            className="w-full sm:w-auto inline-block border-2 border-primary-600 text-primary-700 bg-transparent font-heading font-semibold uppercase tracking-wide py-4 px-8 rounded-lg transition-colors duration-200 hover:bg-primary-50 text-center"
          >
            Try Starter Pack @ ₹299
          </a>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default FinalCTA;

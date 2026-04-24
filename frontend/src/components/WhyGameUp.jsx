import { motion } from "framer-motion";

const cards = [
  {
    title: "Sustained Energy",
    body: "No crash. No jitters. Sattu-powered slow-release fuel that keeps you going from 3PM to 8PM.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Deep Hydration",
    body: "Acts as a natural body coolant, regulates body temperature and restores essential electrolytes lost through sweat. Stay sharp, stay hydrated.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.5 7 5 11.5 5 15a7 7 0 0014 0c0-3.5-3.5-8-7-13z" />
      </svg>
    ),
  },
  {
    title: "Mental Clarity",
    body: "Omega-3 + adaptogens for laser focus during crunch meetings and tight deadlines.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M2 12h2m16 0h2m-3.636-6.364-1.414 1.414M5.05 18.95l1.414-1.414M18.95 18.95l-1.414-1.414M5.05 5.05l1.414 1.414" />
      </svg>
    ),
  },
  {
    title: "Workout Ready",
    body: "From Boardroom to Gym to Sports — seamlessly. Trusted by Star Strikers athletes.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z M5.5 17.5l3-6M15 7.5l3 3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a2 2 0 100-4 2 2 0 000 4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 17l4-7 3 3 3-5 4 9" />
      </svg>
    ),
  },
];

const WhyGameUp = () => (
  <section className="bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 py-20 md:py-28">
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Section header */}
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#4ade80] mb-3">
          The Game Up Difference
        </p>
        <h2 className="font-heading font-bold text-neutral-900 mb-4">
          Why Game Up?
        </h2>
        <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          India's Original Daily Performance Fuel — built for Professionals
          and Athletes who refuse to compromise.
        </p>
      </motion.div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            className="card p-8 transition-all duration-300 cursor-default"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
            whileHover={{ y: -4, boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}
          >
            {/* Icon container */}
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 mb-5">
              {card.icon}
            </div>

            <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-3">
              {card.title}
            </h3>
            <p className="font-sans text-sm text-neutral-600 leading-relaxed">
              {card.body}
            </p>
          </motion.div>
        ))}
      </div>

    </div>
  </section>
);

export default WhyGameUp;

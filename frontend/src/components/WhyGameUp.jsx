import { motion } from "framer-motion";

const cards = [
  {
    title: "Sustained Energy",
    points: [
      "No crash. No jitters.",
      "Sattu-powered slow-release fuel",
      "Keeps you going from 3PM to 8PM",
    ],
    icon: (
      /* Lightning bolt — instant energy */
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    title: "Keeps You Hydrated",
    points: [
      "Natural body coolant",
      "Regulates body temperature",
      "Restores electrolytes lost through sweat",
      "Stay sharp, stay hydrated",
    ],
    icon: (
      /* Water drop */
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.6.3l6.186 8.25c.897 1.196 1.464 2.664 1.464 4.2a8.25 8.25 0 01-16.5 0c0-1.536.567-3.004 1.464-4.2L11.4 2.55a.75.75 0 01.6-.3zm0 4.5L7.11 13.424A5.999 5.999 0 006 15c0 3.314 2.686 6 6 6s6-2.686 6-6a5.999 5.999 0 00-1.11-3.576L12 6.75z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    title: "Micro Nutrient Dense",
    points: [
      "Rich in Iron",
      "Rich in Potassium & Magnesium",
      "Omega-3 for sharper thinking",
      "Essential for overall wellbeing",
    ],
    icon: (
      /* Sparkles — nutrient richness */
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036a2.25 2.25 0 001.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258a2.25 2.25 0 00-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.25 2.25 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.25 2.25 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183a1.5 1.5 0 00.95.95l1.183.394a.75.75 0 010 1.422l-1.183.395a1.5 1.5 0 00-.95.95l-.394 1.182a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.95-.95l-1.182-.394a.75.75 0 010-1.422l1.183-.394a1.5 1.5 0 00.95-.95l.394-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    title: "Workout Ready",
    points: [
      "From Boardroom to Gym to Sports",
      "Seamless pre & post workout fuel",
      "Trusted by Professional Players",
    ],
    icon: (
      /* Fire — intensity & performance */
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1.001a3.75 3.75 0 011.18-3.827 3.75 3.75 0 013.75 3.998z" clipRule="evenodd" />
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
          Why Game-Up?
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
            <ul className="space-y-1.5">
              {card.points.map((pt) => (
                <li key={pt} className="flex items-start gap-2 font-sans text-sm text-neutral-600 leading-relaxed">
                  <span className="text-[#4ade80] font-bold mt-0.5 flex-shrink-0">✓</span>
                  {pt}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

    </div>
  </section>
);

export default WhyGameUp;

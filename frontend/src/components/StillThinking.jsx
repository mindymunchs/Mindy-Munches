import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "When is the best time to drink Game Up for maximum benefits?",
    a: "Game Up is best consumed in the morning on an empty stomach to kickstart metabolism, provide steady energy, and keep you full for longer. It can also be taken mid-morning or as a midday drink to stay hydrated and avoid energy dips.",
  },
  {
    q: "Can Game Up help with weight management and energy levels?",
    a: "Yes. Game Up is rich in plant protein and complex carbohydrates, which help control hunger through high satiety and provide sustained energy. This makes it a smart choice for managing weight and avoiding sudden fatigue during the day.",
  },
  {
    q: "How should I consume Game Up, and who should avoid it?",
    content: {
      intro: "For best results, mix Game Up with water for better hydration and taste. Avoid consuming it late at night as it may feel heavy.",
      cautionTitle: "Who should be cautious or avoid it:",
      cautions: [
        "People with sensitive digestion or frequent bloating (start with small quantities)",
        "Those with Irritable Bowel Syndrome or weak gut tolerance",
        "Individuals with roasted gram (chana) allergies",
        "Anyone advised a low-fibre diet by their doctor",
        "Anyone advised a low-potassium diet by their doctor",
      ],
      disclaimer: "This is a general wellness recommendation and not medical advice. Individual responses may vary — please consult a healthcare professional if you have any underlying health conditions or dietary restrictions.",
    },
  },
  {
    q: "How is Game Up different from other energy drinks?",
    a: "Zero crash. Zero stimulants. Game Up gives you slow-release energy from plant sources — not a 45-minute spike followed by a 2-hour crash.",
  },
  {
    q: "Can I drink it every day?",
    content: {
      intro: "Yes, it can be enjoyed daily when consumed in the recommended quantity. For best results, we suggest having it 4–5 days a week — consistency helps your body adapt and supports more noticeable benefits over time.",
      note: "Moderation is key — more is not necessarily better. Stick to the suggested serving size.",
      disclaimer: "If you have any ongoing kidney concerns, digestive sensitivity (such as frequent gas, bloating, or IBS), or are on a medically restricted diet, please consult your healthcare practitioner before regular consumption.",
    },
  },
  {
    q: "How do I order?",
    a: "You can order via WhatsApp or directly from our website, www.mindymunchs.com.",
  },
  {
    q: "What does it taste like?",
    a: "Game Up currently has 2 popular flavours — Jaljira: a chatpata tangy flavour for those who like a kick; and Masala: very mild for those who want a healthy drink without a strong flavour.",
  },
];

const Chevron = ({ open }) => (
  <motion.svg
    className="w-5 h-5 text-neutral-500 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    animate={{ rotate: open ? 180 : 0 }}
    transition={{ duration: 0.25, ease: "easeInOut" }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </motion.svg>
);

const StillThinking = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 py-20 md:py-24">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#4ade80] mb-3">
            Common Questions
          </p>
          <h2 className="font-heading font-bold text-neutral-900 mb-4">
            Still Thinking?
          </h2>
          <p className="font-sans text-base text-neutral-600 max-w-xl mx-auto">
            We get it. Here are the questions everyone asks before their first
            order.
          </p>
        </motion.div>

        {/* FAQ accordion */}
        <div>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className={`${i < faqs.length - 1 ? "border-b border-neutral-200" : ""}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.08 }}
            >
              <button
                className="w-full flex justify-between items-center py-5 text-left cursor-pointer"
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
              >
                <span className="font-heading font-semibold text-base text-neutral-900 pr-4">
                  {faq.q}
                </span>
                <Chevron open={openIndex === i} />
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    {faq.a ? (
                      <p className="font-sans text-sm text-neutral-600 leading-relaxed pb-5">
                        {faq.a}
                      </p>
                    ) : faq.content ? (
                      <div className="font-sans text-sm text-neutral-600 leading-relaxed pb-5 space-y-3">
                        <p>{faq.content.intro}</p>
                        {faq.content.cautionTitle && (
                          <>
                            <p className="font-semibold text-neutral-700">{faq.content.cautionTitle}</p>
                            <ul className="space-y-1.5 pl-1">
                              {faq.content.cautions.map((c) => (
                                <li key={c} className="flex items-start gap-2">
                                  <span className="text-[#4ade80] font-bold mt-0.5 flex-shrink-0">✓</span>
                                  {c}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                        {faq.content.note && (
                          <p>{faq.content.note}</p>
                        )}
                        {faq.content.disclaimer && (
                          <p className="text-xs text-neutral-400 italic border-t border-neutral-200 pt-3">
                            {faq.content.disclaimer}
                          </p>
                        )}
                      </div>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default StillThinking;

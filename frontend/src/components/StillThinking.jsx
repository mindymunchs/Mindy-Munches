import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "Is it actually safe?",
    a: "100%. Game Up is FSSAI certified, lab-tested, and made with ingredients your grandmother would approve of. No artificial stimulants. No mystery compounds. Just clean fuel.",
  },
  {
    q: "Does it really work or is it just hype?",
    a: "Chana Sattu is generally safe and actually quite well suited for sustained energy with no crash. It's a whole food rich in protein, fibre which supports digestion and gut health, and essential minerals. Game Up isn't just Sattu — it's fixed Sattu's limitations and amplified its benefits. A heavy traditional drink turned into a functional, office-friendly energy solution.",
  },
  {
    q: "How is it different from Red Bull or energy drinks?",
    a: "Zero sugar. Zero crash. Zero artificial stimulants. Game Up gives you slow-release energy from whole food sources — not a 45-minute spike followed by a 2-hour crash.",
  },
  {
    q: "Can I drink it every day?",
    a: "Yes — that's the point. Game Up is designed as your daily performance fuel, not an occasional boost. Clean ingredients make it safe for everyday use.",
  },
  {
    q: "How do I order? Is it available on Swiggy/Zomato?",
    a: "Currently available via WhatsApp order only — fastest delivery, direct from us to you. Hit the button below and we'll sort it in minutes.",
  },
  {
    q: "What does it taste like?",
    a: "Two flavours: Jaljira — refreshing and tangy, great served cold. Masala — bold and warming, great any time. More flavours like Coffee are coming soon.",
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
                    <p className="font-sans text-sm text-neutral-600 leading-relaxed pb-5">
                      {faq.a}
                    </p>
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

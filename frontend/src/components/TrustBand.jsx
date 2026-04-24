import { motion } from "framer-motion";

const stats = [
  { value: "10,000+", label: "Orders Delivered" },
  { value: "4.8★",    label: "Average Rating" },
  { value: "FSSAI",   label: "Certified & Lab Tested" },
  { value: "⚡",       label: "Star Strikers Official Partner" },
];

const TrustBand = () => (
  <section className="bg-primary-800 py-4 md:py-5">
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-y-6 gap-x-4 md:flex md:items-center md:justify-center md:divide-x md:divide-white/20">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="flex flex-col items-center text-center px-4 md:px-8 md:flex-1"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <span className="font-heading font-bold text-white text-xl md:text-2xl leading-none">
              {stat.value}
            </span>
            <span className="font-sans text-white/60 text-xs uppercase tracking-wide mt-1">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustBand;

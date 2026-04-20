import { motion } from "framer-motion";

const StarIcon = ({ filled }) => (
  <svg
    className={`w-4 h-4 ${filled ? "text-amber-400" : "text-neutral-200"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const TestimonialCard = ({ testimonial, index }) => {
  const rating = testimonial.rating || 5;

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 flex flex-col h-full hover:shadow-md transition-shadow duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -3 }}
    >
      {/* Top row — stars + quote mark */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} filled={i < rating} />
          ))}
        </div>
        <span
          className="font-brand text-neutral-200 leading-none select-none"
          style={{ fontSize: "3rem", lineHeight: 1 }}
          aria-hidden="true"
        >
          &rdquo;
        </span>
      </div>

      {/* Message */}
      <p className="font-sans text-sm text-neutral-600 leading-relaxed flex-1 mb-5">
        {testimonial.message}
      </p>

      {/* Divider */}
      <div className="w-full h-px bg-neutral-100 mb-4" />

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0">
          <span className="font-heading font-bold text-primary-700 text-sm">
            {testimonial.name?.charAt(0)?.toUpperCase()}
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-heading font-semibold text-sm text-neutral-900 truncate">
            {testimonial.name}
          </p>
          {testimonial.location && (
            <p className="font-sans text-xs text-neutral-400 truncate">
              {testimonial.location}
            </p>
          )}
        </div>
        {testimonial.verified && (
          <div className="ml-auto flex items-center gap-1 flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-green-600 font-medium font-sans">Verified</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TestimonialCard;

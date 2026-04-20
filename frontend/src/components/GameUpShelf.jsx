import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

const SkeletonCard = () => (
  <div className="bg-neutral-200 animate-pulse rounded-xl overflow-hidden">
    <div className="aspect-square bg-neutral-300 rounded-t-xl" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-neutral-300 rounded w-3/4" />
      <div className="h-4 bg-neutral-300 rounded w-1/2" />
      <div className="h-3 bg-neutral-300 rounded w-1/3" />
      <div className="h-10 bg-neutral-300 rounded-lg mt-2" />
    </div>
  </div>
);

const GameUpShelf = ({ products, loading }) => (
  <section className="bg-neutral-50 py-20 md:py-24">
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Section header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#4ade80] mb-3">
          Clean Performance Fuel
        </p>
        <h2 className="font-heading font-bold text-neutral-900 mb-3"
          style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>
          Shop Game Up
        </h2>
        <p className="font-sans text-base text-neutral-600">
          Real ingredients. Real results. No shortcuts.
        </p>
      </motion.div>

      {/* Product grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="font-sans text-sm text-neutral-500 text-center py-12">
          Products loading soon — check back shortly.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product._id || product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
            >
              <ProductCard product={product} index={i} />
            </motion.div>
          ))}
        </div>
      )}

      {/* View All link */}
      <motion.div
        className="text-center mt-10"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
      >
        <Link
          to="/products"
          className="font-heading text-sm uppercase tracking-wide text-neutral-700 underline-offset-4 hover:underline"
        >
          View All Products &rarr;
        </Link>
      </motion.div>

    </div>
  </section>
);

export default GameUpShelf;

import { motion } from "framer-motion";

const fade = (delay) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: "easeOut", delay },
});

const trustChips = [
  "✓ FSSAI Certified",
  "✓ Startup India Recognised",
  "⚡ Star Strikers Partner",
];

const HeroSection = () => (
  <section className="relative overflow-hidden min-h-[85vh] md:min-h-screen">

    {/* ── Background ──────────────────────────────────────────────────── */}
    <div className="absolute inset-0">
      {/*
        VIDEO SLOT — uncomment and replace poster with BANNER_1.png
        when video asset is ready:

        <video
          autoPlay muted loop playsInline
          poster="/BANNER_1.png"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-game-up.mp4" type="video/mp4" />
        </video>
      */}
      {/*
        ASSET TODO: Replace BANNER_1.png with a Game Up
        specific product/lifestyle shot once available.
        The current banner has Makhana branding baked into
        the image. Ideal asset: dark background, Game Up
        product pack, athlete or professional in frame.
        Recommended size: 1920x1080px minimum.
      */}
      <picture>
        <source media="(max-width: 767px)" srcSet="/MOBILE_BANNER_1_lovable.png" />
        <img
          src="/banner_1_lovable.png"
          alt="Mindy Munchs Game Up — Clean Performance Fuel"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />
      </picture>
      {/* Dark left-to-transparent gradient keeps text readable without hiding the product image */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/30" />
    </div>

    {/* ── Content ─────────────────────────────────────────────────────── */}
    <div className="relative z-10 min-h-[85vh] md:min-h-screen flex items-center">
      <div className="w-full max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-7">

            {/* Eyebrow */}
            <motion.p
              {...fade(0.1)}
              className="text-xs uppercase tracking-[0.2em] font-semibold text-[#4ade80] mb-5"
            >
              For India's High-Performers
            </motion.p>

            {/* Headline — uses h1 base styles (Playfair Display, clamp scale) */}
            <motion.h1
              {...fade(0.25)}
              className="font-brand font-bold text-white leading-tight mb-6 text-[clamp(2.5rem,5vw,4.5rem)]"
            >
              No More<br />4PM Energy Crash.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              {...fade(0.4)}
              className="text-lg md:text-xl text-white/75 mb-5 max-w-lg leading-relaxed"
            >
              Clean performance fuel for your workday, your workout, and
              everything that needs your focus.
            </motion.p>

            {/* Proof line */}
            <motion.p
              {...fade(0.5)}
              className="text-sm tracking-wide uppercase text-white/55 mb-10"
            >
              Powered by Sattu · Electrolytes · Omega&nbsp;3
            </motion.p>

            {/* CTA row */}
            <motion.div
              {...fade(0.6)}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              {/* TODO: Replace href with Interakt WhatsApp link
                  once account is set up.
                  Format: https://wa.me/<number>?text=<message>
                  or Interakt widget trigger */}
              {/* TODO: Replace with live Interakt/WhatsApp number before launch */}
              <a
                href="https://wa.me/919999999999?text=Hi%2C%20I%20want%20to%20order%20Game%20Up!"
                target="_blank"
                rel="noopener noreferrer"
                className="font-heading text-base font-semibold uppercase tracking-wide py-4 px-8 rounded-lg bg-accent-500 hover:bg-accent-400 text-neutral-900 transition-transform duration-200 hover:scale-[1.02] text-center"
              >
                Beat the Crash Now
              </a>

              <a
                href="/products"
                className="font-heading text-base font-semibold uppercase tracking-wide py-4 px-8 rounded-lg border border-white/60 text-white bg-transparent hover:bg-white/10 transition-colors duration-200 text-center"
              >
                Try Starter Pack @ ₹299
              </a>
            </motion.div>

            {/* Trust chips */}
            <motion.div {...fade(0.75)} className="flex flex-wrap gap-2">
              {trustChips.map((chip) => (
                <span
                  key={chip}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs px-3 py-1.5 rounded-full"
                >
                  {chip}
                </span>
              ))}
            </motion.div>

          </div>
          {/* col-span-5 intentionally empty — background image visible through gradient */}
        </div>
      </div>
    </div>

  </section>
);

export default HeroSection;

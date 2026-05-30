import { motion } from "framer-motion";

const fade = (delay) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: "easeOut", delay },
});


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
        <source media="(max-width: 767px)" srcSet="/MOBILE_BANNER_1_lovable_ver_3.png" />
        <img
          src="/banner_1_lovable_ver_3.png"
          alt="Mindy Munchs Game Up — Clean Performance Fuel"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />
      </picture>
      {/* Dark left-to-transparent gradient keeps text readable without hiding the product image */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-black/10" />
    </div>

    {/* ── Content ─────────────────────────────────────────────────────── */}
    <div className="relative z-10 min-h-[85vh] md:min-h-screen flex items-center">
      <div className="w-full pl-4 pr-6 md:pl-10 lg:pl-16 xl:pl-24 py-20 md:py-28">
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
              No Crash Energy<br />for Work and Sports.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              {...fade(0.4)}
              className="text-lg md:text-xl text-white/75 mb-5 max-w-lg leading-relaxed"
            >
              Daily Performance Fuel.
            </motion.p>

            {/* Proof line */}
            <motion.p
              {...fade(0.5)}
              className="text-sm tracking-wide uppercase text-white/55 mb-10"
            >
              Powered by India's Original Superfuel · Chana Sattu
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
                href="https://wa.me/919355926060?text=Hi%2C%20I%20want%20to%20order%20Game%20Up!"
                target="_blank"
                rel="noopener noreferrer"
                className="font-heading text-base font-semibold uppercase tracking-wide py-4 px-8 rounded-lg bg-accent-500 hover:bg-accent-400 text-neutral-900 transition-transform duration-200 hover:scale-[1.02] text-center"
              >
                Chat on WhatsApp
              </a>

              <a
                href="/products"
                className="font-heading text-base font-semibold uppercase tracking-wide py-4 px-8 rounded-lg border border-white/60 text-white bg-transparent hover:bg-white/10 transition-colors duration-200 text-center"
              >
                Order Trial Kit Now
              </a>
            </motion.div>

            {/* Partner logos */}
            <motion.div {...fade(0.75)} className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-2.5 shadow-lg">
                <img
                  src="/starstriker.png"
                  alt="Star Strikers"
                  className="h-11 w-11 object-contain"
                />
                <div>
                  <p className="text-neutral-400 text-[10px] uppercase tracking-wider leading-none mb-0.5">Official Drinks Partner</p>
                  <p className="text-neutral-800 text-xs font-bold leading-snug">Star Strikers FA</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-2.5 shadow-lg">
                <img
                  src="/Nutritionalist_logo.png"
                  alt="Neeta Shukla Nutritionist"
                  className="h-11 w-11 object-contain"
                />
                <div>
                  <p className="text-neutral-400 text-[10px] uppercase tracking-wider leading-none mb-0.5">Endorsed by</p>
                  <p className="text-neutral-800 text-xs font-bold leading-snug">Neeta Shukla</p>
                </div>
              </div>
            </motion.div>

          </div>
          {/* col-span-5 intentionally empty — background image visible through gradient */}
          {/*
            ASSET TODO: "Ready under 15 sec" label to be added
            when sachet product image is placed in right column.
            Client has requested a product pack image to replace
            the current background composite.
          */}
        </div>
      </div>
    </div>

  </section>
);

export default HeroSection;

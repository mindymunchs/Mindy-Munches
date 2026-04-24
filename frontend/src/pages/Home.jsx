/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import ProductCard from "../components/ProductCard";
import TestimonialCard from "../components/TestimonialCard";
import { useVideoTestimonials } from "../components/VideoTestimonials";
import Loader from "../components/Loader";
import { setSEO } from "../utils/seo";
import HeroSection from "../components/HeroSection";
import TrustBand from "../components/TrustBand";
import WhyGameUp from "../components/WhyGameUp";
import TrustCertified from "../components/TrustCertified";
import StillThinking from "../components/StillThinking";
import FinalCTA from "../components/FinalCTA";

const Home = () => {
  useEffect(() => {
    setSEO({
      title: "Game Up — Clean Performance Fuel",
      description: "Mindy Munchs Game Up: India's clean performance fuel for high-performers. Powered by Sattu, Electrolytes & Omega 3. Low GI. Zero crash. Official partner of Star Strikers.",
    });
  }, []);

  const [products, setProducts] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  const { testimonials: videoTestimonials, loading: videoLoading } = useVideoTestimonials();

  // Lock body scroll + close on Escape while the video modal is open
  useEffect(() => {
    if (!activeVideo) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [activeVideo]);

  const isEmbeddedVideo = (src = "") =>
    /youtube\.com|youtu\.be|vimeo\.com|player\./i.test(src);

  const activeVideoIndex = activeVideo
    ? videoTestimonials.findIndex((t) => (t.id ?? t) === (activeVideo.id ?? activeVideo))
    : -1;

  const goToVideo = (offset) => {
    if (!videoTestimonials.length) return;
    const nextIdx =
      (activeVideoIndex + offset + videoTestimonials.length) % videoTestimonials.length;
    setActiveVideo(videoTestimonials[nextIdx]);
  };

  useEffect(() => {
    if (!activeVideo) return;
    const onArrow = (e) => {
      if (e.key === "ArrowRight") goToVideo(1);
      else if (e.key === "ArrowLeft") goToVideo(-1);
    };
    window.addEventListener("keydown", onArrow);
    return () => window.removeEventListener("keydown", onArrow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVideo, videoTestimonials]);

  // scrollRef for testimonial sections
  const scrollRef = useRef(null);
  const bestsellerScrollRef = useRef(null);
  const videoScrollRef = useRef(null);

  // USP Data - 3 E's
  const uspData = [
    {
      icon: (
        <img
          src="/usp1.png"
          alt="Ease - Traditional to Modern"
          className="w-10 h-10 object-contain"
        />
      ),
      title: "Ease",
      description:
        "Bringing traditional food to modern convenience. Experience authentic Indian heritage foods with simple, accessible packaging.",
    },
    {
      icon: (
        <img
          src="/usp2.png"
          alt="Empower - Customize Your Way"
          className="w-10 h-10 object-contain"
        />
      ),
      title: "Empower",
      description:
        "Empowering you to make it your way. Customize your wellness journey with versatile traditional superfoods that adapt to your lifestyle.",
    },
    {
      icon: (
        <img
          src="/usp3.png"
          alt="Enrich - Overall Wellness"
          className="w-10 h-10 object-contain"
        />
      ),
      title: "Enrich",
      description:
        "Enriching your overall wellness. Nourish your body with nutrient-dense traditional foods that have sustained healthy living for generations.",
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        if (!import.meta.env.VITE_API_URL) {
          throw new Error("API URL is not defined");
        }

        const [
          apiProductsResponse,
          apiTestimonialsResponse,
          apiBestsellersResponse,
        ] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/products`),
          fetch(`${import.meta.env.VITE_API_URL}/testimonials`),
          fetch(`${import.meta.env.VITE_API_URL}/products/bestsellers`),
        ]);

        if (
          !apiProductsResponse.ok ||
          !apiTestimonialsResponse.ok ||
          !apiBestsellersResponse.ok
        ) {
          throw new Error("API responses not ok");
        }

        const productsData = await apiProductsResponse.json();
        const testimonialsData = await apiTestimonialsResponse.json();
        const bestsellersData = await apiBestsellersResponse.json();

        // Process products data for GameUpShelf
        let allProducts = [];
        if (productsData && productsData.success && productsData.data && Array.isArray(productsData.data.products)) {
          allProducts = productsData.data.products;
        } else if (productsData && Array.isArray(productsData.products)) {
          allProducts = productsData.products;
        } else if (Array.isArray(productsData)) {
          allProducts = productsData;
        }

        // Process testimonials data
        let allTestimonials = [];
        if (
          testimonialsData &&
          testimonialsData.success &&
          testimonialsData.data &&
          Array.isArray(testimonialsData.data.testimonials)
        ) {
          allTestimonials = testimonialsData.data.testimonials;
        } else if (
          testimonialsData &&
          Array.isArray(testimonialsData.testimonials)
        ) {
          allTestimonials = testimonialsData.testimonials;
        } else if (Array.isArray(testimonialsData)) {
          allTestimonials = testimonialsData;
        }

        // Process bestsellers data for "Our Bestsellers" section
        let allBestsellers = [];
        if (
          bestsellersData &&
          bestsellersData.success &&
          bestsellersData.data &&
          Array.isArray(bestsellersData.data.products)
        ) {
          allBestsellers = bestsellersData.data.products;
        } else if (bestsellersData && Array.isArray(bestsellersData.products)) {
          allBestsellers = bestsellersData.products;
        } else if (Array.isArray(bestsellersData)) {
          allBestsellers = bestsellersData;
        }

        setProducts(allProducts.slice(0, 4));
        setBestsellers(allBestsellers);
        setTestimonials(allTestimonials);
      } catch (error) {
        console.error("Error loading data from API:", error);
        setProducts([]);
        setBestsellers([]);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden max-w-full">
      <HeroSection />
      <TrustBand />
      <WhyGameUp />
      <TrustCertified />

      {/* Our Bestsellers Section with Horizontal Scroll */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#4ade80] mb-3">
              Daily Performance Fuel
            </p>
            <h2 className="font-heading font-bold text-neutral-900 mb-4">
              Daily Performance Fuel Shop
            </h2>
            <p className="font-sans text-base text-neutral-600 max-w-xl mx-auto">
              Real ingredients. Real results. No shortcuts.
            </p>
          </motion.div>

          {loading ? (
            <Loader text="Loading bestsellers..." />
          ) : (
            <div className="relative">
              {/* Fade edges */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-20" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-20" />
              {/* Horizontal Scrollable Container - 4 Cards Fully Visible */}
              <div
                ref={bestsellerScrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
                style={{
                  WebkitOverflowScrolling: "touch",
                  scrollPaddingLeft: "1.5rem",
                  scrollPaddingRight: "1.5rem",
                }}
              >
                {bestsellers.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 snap-start"
                    style={{
                      width: "calc(25% - 18px)", // 25% width minus gap (24px total gap / 4 * 3)
                      minWidth: "280px", // Minimum width for mobile
                    }}
                  >
                    <ProductCard
                      product={product}
                      index={index}
                      showBestsellerBadge={true}
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                className="absolute top-1/2 -left-4 z-30 -translate-y-1/2 bg-white rounded-full shadow-lg p-3 hover:bg-gray-50 hover:scale-105 hover:shadow-xl transition-all duration-200"
                aria-label="Scroll Left"
                onClick={() => {
                  const container = bestsellerScrollRef.current;
                  if (!container) return;
                  const cardWidth = container.scrollWidth / bestsellers.length;
                  container.scrollBy({
                    left: -cardWidth,
                    behavior: "smooth",
                  });
                }}
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                className="absolute top-1/2 -right-4 z-30 -translate-y-1/2 bg-white rounded-full shadow-lg p-3 hover:bg-gray-50 hover:scale-105 hover:shadow-xl transition-all duration-200"
                aria-label="Scroll Right"
                onClick={() => {
                  const container = bestsellerScrollRef.current;
                  if (!container) return;
                  const cardWidth = container.scrollWidth / bestsellers.length;
                  container.scrollBy({
                    left: cardWidth,
                    behavior: "smooth",
                  });
                }}
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link to="/products" className="btn-primary">
              View All Products
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Our Customers Experience / Testimonials Section */}
      <section className="py-20 md:py-24 bg-white overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#4ade80] mb-3">
              Real Results
            </p>
            <h2 className="font-heading font-bold text-neutral-900 mb-4">
              Our Customers <span className="text-primary-500">Experience</span>
            </h2>
            <p className="font-sans text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
              10,000+ orders delivered. Here's what people are saying.
            </p>
          </motion.div>


          {/* Text Reviews Badge */}
          {/* Text Testimonials - Responsive with Hidden Mobile Arrows */}
          <div className="relative min-h-[300px] sm:min-h-[400px] md:min-h-[500px] mb-5">
            {/* Left Arrow - Hidden on Mobile, Visible on Tablet+ */}
            <button
              onClick={() =>
                scrollRef.current?.scrollBy({
                  left: -200,
                  behavior: "smooth",
                })
              }
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 rounded-full shadow-lg p-3 transition-all duration-200 hover:scale-105 items-center justify-center"
              aria-label="Scroll testimonials left"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Text Testimonials Container - Optimized for Touch Scrolling */}
            <div
              ref={scrollRef}
              className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-6 md:px-12 py-2"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                scrollBehavior: "smooth",
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch", // Enhanced touch scrolling for mobile
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="flex-shrink-0 w-[85vw] h-auto min-h-[280px] sm:w-[70vw] sm:min-h-[320px] md:w-80 md:h-96 lg:w-96 lg:h-96 max-w-sm"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <div className="w-full h-full bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 flex flex-col justify-between transition-transform duration-300 hover:scale-105">
                    <TestimonialCard
                      testimonial={testimonial}
                      index={index}
                      className="flex-1"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow - Hidden on Mobile, Visible on Tablet+ */}
            <button
              onClick={() =>
                scrollRef.current?.scrollBy({
                  left: 200,
                  behavior: "smooth",
                })
              }
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 rounded-full shadow-lg p-3 transition-all duration-200 hover:scale-105 items-center justify-center"
              aria-label="Scroll testimonials right"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Mobile Touch Indicator - Optional visual cue for swipe */}
            <div className="md:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-gray-500 text-xs">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16l4-4-4-4m6 8l4-4-4-4"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Video Testimonials — Watch Their Stories */}
      {(videoLoading || videoTestimonials.length > 0) && (
        <section className="relative bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 py-20 md:py-24 overflow-hidden">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#4ade80] mb-3">
                Hear It From Them
              </p>
              <h2 className="font-heading font-bold text-neutral-900 mb-4">
                Watch Their Stories
              </h2>
              <p className="font-sans text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
                Real people, real results. Swipe through their Game Up moments.
              </p>
            </motion.div>

            {videoLoading ? (
              <div className="flex justify-center py-8">
                <Loader text="Loading stories…" />
              </div>
            ) : (
              <div className="relative">
                {/* Fade edges for scroll discoverability */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-12 z-10 bg-gradient-to-r from-orange-50 to-transparent hidden md:block" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-12 z-10 bg-gradient-to-l from-orange-100 to-transparent hidden md:block" />

                <button
                  onClick={() => videoScrollRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex bg-white hover:bg-neutral-50 rounded-full shadow-lg p-3 transition-all duration-200 hover:scale-105 items-center justify-center"
                  aria-label="Scroll left"
                >
                  <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div
                  ref={videoScrollRef}
                  className="flex gap-4 overflow-x-auto scrollbar-hide md:px-14 py-4"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
                >
                  {videoTestimonials.map((testimonial, idx) => (
                    <motion.button
                      type="button"
                      key={testimonial.id ?? idx}
                      className="flex-shrink-0 w-44 sm:w-52 md:w-56 aspect-[9/16] rounded-2xl overflow-hidden shadow-lg cursor-pointer group relative bg-neutral-200 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      style={{ scrollSnapAlign: "start" }}
                      onClick={() => setActiveVideo(testimonial)}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      aria-label={`Play ${testimonial.name} testimonial`}
                    >
                      {testimonial.thumbnail ? (
                        <img
                          src={testimonial.thumbnail}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      ) : testimonial.videoSrc && !isEmbeddedVideo(testimonial.videoSrc) ? (
                        <video
                          src={testimonial.videoSrc}
                          className="w-full h-full object-cover"
                          preload="metadata"
                          muted
                          playsInline
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center text-white font-heading text-4xl">
                          {testimonial.name?.charAt(0) ?? "•"}
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <svg className="w-5 h-5 text-primary-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>

                      {testimonial.duration && (
                        <span className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-sans px-2 py-0.5 rounded-full backdrop-blur-sm">
                          {testimonial.duration}
                        </span>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <p className="font-heading font-semibold text-sm truncate">{testimonial.name}</p>
                        {testimonial.location && (
                          <p className="font-sans text-xs text-white/75 truncate">{testimonial.location}</p>
                        )}
                        {testimonial.rating > 0 && (
                          <div className="flex items-center gap-0.5 mt-1" aria-label={`${testimonial.rating} star rating`}>
                            {[...Array(Math.min(5, Math.round(testimonial.rating)))].map((_, i) => (
                              <span key={i} className="text-yellow-400 text-xs leading-none">★</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                <button
                  onClick={() => videoScrollRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex bg-white hover:bg-neutral-50 rounded-full shadow-lg p-3 transition-all duration-200 hover:scale-105 items-center justify-center"
                  aria-label="Scroll right"
                >
                  <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* In-section video overlay */}
          <AnimatePresence>
            {activeVideo && (
              <motion.div
                className="absolute inset-0 z-30 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setActiveVideo(null)}
              >
                {videoTestimonials.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); goToVideo(-1); }}
                    className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-neutral-700 transition-all hover:scale-105"
                    aria-label="Previous video"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {videoTestimonials.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); goToVideo(1); }}
                    className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-neutral-700 transition-all hover:scale-105"
                    aria-label="Next video"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}

                <motion.div
                  key={activeVideo.id ?? activeVideoIndex}
                  className="relative w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl"
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.92, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setActiveVideo(null)}
                    className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 hover:bg-white rounded-full shadow flex items-center justify-center text-neutral-700 transition-colors"
                    aria-label="Close video"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="aspect-video bg-black">
                    {isEmbeddedVideo(activeVideo.videoSrc) ? (
                      <iframe
                        src={activeVideo.videoSrc}
                        title={`${activeVideo.name} testimonial`}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={activeVideo.videoSrc}
                        className="w-full h-full object-contain bg-black"
                        controls
                        autoPlay
                        playsInline
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>

                  <div className="px-5 py-4 border-t border-neutral-200">
                    <p className="font-heading font-semibold text-sm text-neutral-900">{activeVideo.name}</p>
                    {activeVideo.location && (
                      <p className="font-sans text-xs text-neutral-500">{activeVideo.location}</p>
                    )}
                    {activeVideo.fullQuote && (
                      <p className="font-sans text-sm text-neutral-600 italic leading-relaxed mt-2">
                        &ldquo;{activeVideo.fullQuote}&rdquo;
                      </p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* Our Brand USP — 3 E's */}
      <section className="bg-white py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#4ade80] mb-3">
              What We Stand For
            </p>
            <h2 className="font-heading font-bold text-neutral-900 mb-4">
              Our Brand<span className="text-primary-600"> USP</span>
            </h2>
            <p className="font-sans text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              The 3 E's that define our commitment to bringing you the best of
              traditional Indian wellness.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {uspData.map((usp, index) => (
              <motion.div
                key={index}
                className="card text-center p-8 transition-all duration-300 cursor-default group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-primary-200 bg-primary-50 flex items-center justify-center group-hover:border-primary-400 group-hover:bg-primary-100 transition-all duration-200">
                  <div className="flex items-center justify-center w-full h-full">
                    {usp.icon}
                  </div>
                </div>

                <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">
                  {usp.title}
                </h3>
                <p className="font-sans text-sm text-neutral-600 leading-relaxed">
                  {usp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <StillThinking />
      <FinalCTA />

    </div>
  );
};

export default Home;

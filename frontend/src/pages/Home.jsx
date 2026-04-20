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

  // scrollRef for testimonial sections
  const scrollRef = useRef(null);
  const videoScrollRef = useRef(null);
  const videoTestimonialsRef = useRef(null);

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
              Clean Performance Fuel
            </p>
            <h2 className="font-heading font-bold text-neutral-900 mb-4">
              Shop Game Up
            </h2>
            <p className="font-sans text-base text-neutral-600 max-w-xl mx-auto">
              Real ingredients. Real results. No shortcuts.
            </p>
          </motion.div>

          {loading ? (
            <Loader text="Loading bestsellers..." />
          ) : (
            <div className="relative">
              {/* Horizontal Scrollable Container - 4 Cards Fully Visible */}
              <div
                id="bestseller-scroll"
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
                className="absolute top-1/2 -left-4 z-30 -translate-y-1/2 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100 transition-colors duration-200"
                aria-label="Scroll Left"
                onClick={() => {
                  const container =
                    document.getElementById("bestseller-scroll");
                  const cardWidth = container.scrollWidth / bestsellers.length;
                  const scrollAmount = cardWidth * 1; // Scroll by exactly 1 card width
                  container.scrollBy({
                    left: -scrollAmount,
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
                className="absolute top-1/2 -right-4 z-30 -translate-y-1/2 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100 transition-colors duration-200"
                aria-label="Scroll Right"
                onClick={() => {
                  const container =
                    document.getElementById("bestseller-scroll");
                  const cardWidth = container.scrollWidth / bestsellers.length;
                  const scrollAmount = cardWidth * 1; // Scroll by exactly 1 card width
                  container.scrollBy({
                    left: scrollAmount,
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

      {/*
        SECTION HIDDEN — Brand Story (Mindy Munchs generic)
        Uncomment to restore. Currently off-brand for Game Up
        focused landing. Client may want this on About page instead.
        Note: The Our Brand USP / 3 E's block (previously nested inside
        this section) has been extracted as a standalone section below.

        <section className="py-12 md:py-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 overflow-x-hidden overflow-y-hidden">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-neutral-800 leading-tight whitespace-nowrap mb-10">
                  Revive{" "}
                  <span className="text-primary-500">Wholesome Snacks</span> for
                  Modern Convenience
                </h1>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-stretch content-stretch">
              <div className="h-full">
                <p className="text-base md:text-lg lg:text-xl text-neutral-600 mb-6 leading-relaxed max-w-3xl">
                  Snacking shouldn't come with guilt. That's why at Mindy Munchs,
                  we craft bites that are as quick to reach for as your go-to
                  packet — only smarter, tastier, and way better for you. Health
                  should feel personal, playful and rooted in our everyday lives.
                </p>
                <br></br>
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-start gap-2 sm:gap-3 md:gap-3 mb-8 px-2 sm:px-0 overflow-x-visible sm:overflow-x-clip">
                  {["Snack Boldly", "Snack Mindfully", "Snack your way"].map(
                    (cert, index) => (
                      <motion.div
                        key={cert}
                        className="bg-white/80 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 md:px-5 md:py-2.5 rounded-lg shadow-sm flex items-center gap-1 sm:gap-2 flex-none whitespace-nowrap"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <span className="text-green-500 text-base sm:text-lg leading-none">
                          ✓
                        </span>
                        <span className="text-xs sm:text-sm md:text-base font-medium text-neutral-700 leading-none">
                          {cert}
                        </span>
                      </motion.div>
                    )
                  )}
                </div>
                <br></br>

                <motion.div
                  className="relative w-full h-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-white/20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                      <div className="text-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                          <span className="text-2xl md:text-3xl">🌱</span>
                        </div>
                        <h3 className="font-semibold text-neutral-800 mb-2 text-sm md:text-base">
                          Rooted in Tradition
                        </h3>
                        <p className="text-xs md:text-sm text-neutral-600">
                          Ancient superfoods, modern formats
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                          <span className="text-2xl md:text-3xl">💪</span>
                        </div>
                        <h3 className="font-semibold text-neutral-800 mb-2 text-sm md:text-base">
                          Nutrition First
                        </h3>
                        <p className="text-xs md:text-sm text-neutral-600">
                          High protein, clean ingredients
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                          <span className="text-2xl md:text-3xl">❤️</span>
                        </div>
                        <h3 className="font-semibold text-neutral-800 mb-2 text-sm md:text-base">
                          Family-Crafted
                        </h3>
                        <p className="text-xs md:text-sm text-neutral-600">
                          Born from real kitchen experiments
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="relative h-full">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 }}
                  viewport={{ once: true }}
                  className="w-full h-full"
                >
                  <img
                    src="/Home2.png"
                    alt="Creative brand mock"
                    className="w-full h-9/10 object-cover md:object-contain rounded-2xl md:rounded-3xl"
                    loading="lazy"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      */}

      {/*
        SECTION HIDDEN — YouTube Heritage Video
        Uncomment to restore. Breaks Game Up narrative flow.
        Good candidate for About Us or Our Story page.

        <section
          id="our-story"
          className="py-8 md:py-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 overflow-x-hidden"
        >
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.div
                className="text-center "
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-neutral-800 mb-6 leading-tight whitespace-nowrap">
                  We Are Preserving a Heritage of{" "}
                  <span className="text-primary-500">
                    Traditional Indian SuperFoods
                  </span>
                </h1>
              </motion.div>

              <div className="flex justify-center items-center max-h-screen px-4">
                <motion.div
                  className="w-full max-w-[70vw] md:max-w-[75vw] lg:max-w-[80vw]"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="relative w-full h-[78vh] bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/tIxV269IutY"
                      title="From The Soil Of India"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    ></iframe>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      */}

      {/*
        SECTION HIDDEN — Traditional Superfoods grid
        Uncomment to restore. Duplicate product grid —
        redundant alongside Bestsellers on Game Up landing.

        <section className="py-16 px-2 md:py-20 bg-neutral-50 overflow-hidden">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-500 mb-4">
                Traditional Superfoods
              </h2>
            </motion.div>

            {loading ? (
              <Loader text="Loading products..." />
            ) : (
              <div className="relative">
                <div
                  id="product-scroll"
                  className="flex gap-6 pc-2 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
                  style={{
                    WebkitOverflowScrolling: "touch",
                    scrollPaddingLeft: "1.5rem",
                    scrollPaddingRight: "1.5rem",
                  }}
                >
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      className="flex-shrink-0 snap-start"
                      style={{
                        width: "calc(25% - 18px)",
                        minWidth: "280px",
                      }}
                    >
                      <ProductCard product={product} index={index} />
                    </div>
                  ))}
                </div>

                <button
                  className="absolute top-1/2 -left-4 z-30 -translate-y-1/2 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Scroll Left"
                  onClick={() => {
                    const container = document.getElementById("product-scroll");
                    const cardWidth = container.scrollWidth / products.length;
                    const scrollAmount = cardWidth * 1;
                    container.scrollBy({
                      left: -scrollAmount,
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
                  className="absolute top-1/2 -right-4 z-30 -translate-y-1/2 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Scroll Right"
                  onClick={() => {
                    const container = document.getElementById("product-scroll");
                    const cardWidth = container.scrollWidth / products.length;
                    const scrollAmount = cardWidth * 1;
                    container.scrollBy({
                      left: scrollAmount,
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
                Shop All Products
              </Link>
            </motion.div>
          </div>
        </section>
      */}

      {/* Our Customers Experience / Testimonials Section */}
      <section
        ref={videoTestimonialsRef}
        className="py-20 md:py-24 bg-white overflow-x-hidden"
      >
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


          {/* Trust Indicators */}
          {/* <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          > */}
            {/* Marketing copy — update manually when stats change */}
            {/* <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-neutral-600">
              <div className="flex items-center bg-white rounded-lg px-4 md:px-6 py-3 shadow-sm">
                <span className="text-xl md:text-2xl mr-2 md:mr-3">⭐</span>
                <div>
                  <span className="font-semibold text-base md:text-lg">
                    4.9/5
                  </span>
                  <span className="ml-2 text-xs md:text-sm">
                    Average Rating
                  </span>
                </div>
              </div>
              <div className="flex items-center bg-white rounded-lg px-4 md:px-6 py-3 shadow-sm">
                <span className="text-xl md:text-2xl mr-2 md:mr-3">📦</span>
                <div>
                  <span className="font-semibold text-base md:text-lg">
                    500+
                  </span>
                  <span className="ml-2 text-xs md:text-sm">
                    Happy Customers
                  </span>
                </div>
              </div>
              <div className="flex items-center bg-white rounded-lg px-4 md:px-6 py-3 shadow-sm">
                <span className="text-xl md:text-2xl mr-2 md:mr-3">✅</span>
                <div>
                  <span className="font-semibold text-base md:text-lg">
                    98%
                  </span>
                  <span className="ml-2 text-xs md:text-sm">
                    Would Recommend
                  </span>
                </div>
              </div>
            </div> */}
          {/* </motion.div> */}
        </div>
      </section>

      {/* Video Testimonials */}
      {!videoLoading && videoTestimonials.length > 0 && (
        <section className="bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 py-20 md:py-24 overflow-hidden">
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

            <div className="relative">
              <button
                onClick={() => videoScrollRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex bg-white hover:bg-neutral-50 rounded-full shadow-lg p-3 transition-all duration-200 hover:scale-105 items-center justify-center"
                aria-label="Scroll left"
              >
                <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div
                ref={videoScrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide md:px-10 py-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
              >
                {videoTestimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="flex-shrink-0 w-44 sm:w-52 md:w-56 aspect-[9/16] rounded-2xl overflow-hidden shadow-lg cursor-pointer group relative"
                    style={{ scrollSnapAlign: "start" }}
                    onClick={() => setActiveVideo(testimonial)}
                  >
                    {testimonial.thumbnail ? (
                      <img
                        src={testimonial.thumbnail}
                        alt={`${testimonial.name} testimonial`}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    ) : (
                      <video src={testimonial.videoSrc} className="w-full h-full object-cover" preload="metadata" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <svg className="w-5 h-5 text-primary-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <p className="font-heading font-semibold text-sm truncate">{testimonial.name}</p>
                      <p className="font-sans text-xs text-white/70 truncate">{testimonial.location}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => videoScrollRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex bg-white hover:bg-neutral-50 rounded-full shadow-lg p-3 transition-all duration-200 hover:scale-105 items-center justify-center"
                aria-label="Scroll right"
              >
                <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
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
                whileHover={{ y: -3 }}
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

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="font-heading font-bold text-primary-700 text-sm">
                      {activeVideo.name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-sm text-neutral-900">{activeVideo.name}</p>
                    <p className="font-sans text-xs text-neutral-500">{activeVideo.location}</p>
                  </div>
                </div>
                <button onClick={() => setActiveVideo(null)} className="text-neutral-400 hover:text-neutral-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="aspect-video">
                <iframe
                  src={activeVideo.videoSrc}
                  title={`${activeVideo.name} testimonial`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {activeVideo.fullQuote && (
                <div className="px-6 py-5">
                  <p className="font-sans text-sm text-neutral-600 italic leading-relaxed">
                    &ldquo;{activeVideo.fullQuote}&rdquo;
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;

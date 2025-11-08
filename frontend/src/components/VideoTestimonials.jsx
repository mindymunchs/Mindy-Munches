/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

// Custom hook to fetch video testimonials
export const useVideoTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/video-testimonials`
        );
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON");
        }

        if (response.ok) {
          const data = await response.json();
          setTestimonials(data);
        } else {
          setTestimonials(videoTestimonialsData);
        }
      } catch (err) {
        console.warn(
          "Failed to fetch video testimonials, using static data:",
          err
        );
        setTestimonials(videoTestimonialsData);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return { testimonials, loading, error };
};

const VideoTestimonials = () => {
  const [activeVideo, setActiveVideo] = useState(null);
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);
  const { testimonials: videoTestimonials, loading } = useVideoTestimonials();

  // ✅ Close handler
  const closeVideo = () => {
    setActiveVideo(null);
    document.body.style.overflow = "unset";
  };

  // ✅ Open video handler - SCROLL FIRST, then show modal
  const openVideo = (video) => {
    // Step 1: Scroll to section
    if (sectionRef.current) {
      const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: sectionTop - 100, // Add 100px offset so section is clearly visible
        behavior: 'smooth'
      });
    }

    // Step 2: Wait for scroll, then show modal
    setTimeout(() => {
      setActiveVideo(video);
      document.body.style.overflow = "hidden";
    }, 800); // Wait 800ms for smooth scroll to complete
  };

  // Cleanup
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">Loading video testimonials...</div>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 relative overflow-hidden"
    >
      <style jsx>{`
        .hide-scrollbar {
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="inline-block bg-orange-200 text-orange-800 text-sm font-medium px-4 py-2 rounded-full mb-4">
            🎥 Real Customer Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-800 mb-4">
            What Our Customers Are Saying
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Authentic testimonials from real customers who love our traditional
            superfoods.
          </p>
        </motion.div>

        {/* Horizontal Scroll Container with Navigation Arrows */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() =>
              scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" })
            }
            className="absolute left-0 top-1/2 z-20 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Scroll video testimonials left"
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

          {/* Video Testimonials Carousel - 9:16 Reel Style */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto hide-scrollbar px-12 py-6"
            style={{ scrollSnapType: "x mandatory", scrollBehavior: "smooth" }}
          >
            {videoTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="flex-shrink-0 w-48 md:w-56 lg:w-60 aspect-[9/16] rounded-2xl overflow-hidden shadow-lg cursor-pointer group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => openVideo(testimonial)}
                style={{ scrollSnapAlign: "center" }}
              >
                <img
                  src={testimonial.thumbnail}
                  alt={`${testimonial.name} testimonial`}
                  className="w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg
                      className="w-6 h-6 text-primary-600 ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h4 className="text-sm font-semibold truncate">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-white/80 truncate">
                    {testimonial.location}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xs">
                        ⭐
                      </span>
                    ))}
                    <span className="text-xs text-white/60 ml-2">
                      {testimonial.duration}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() =>
              scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" })
            }
            className="absolute right-0 top-1/2 z-20 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Scroll video testimonials right"
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
        </div>
      </div>

      {/* ✅ Video Modal with FIXED positioning - appears after scroll completes */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeVideo}
          >
            {/* Close button */}
            <button
              onClick={closeVideo}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Close video"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Video container */}
            <motion.div
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 40 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video Player */}
              <div className="relative aspect-video">
                <video
                  src={activeVideo.videoSrc}
                  controls
                  autoPlay
                  className="w-full h-full"
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Video Info */}
              <div className="bg-gradient-to-t from-black/90 to-transparent absolute bottom-0 left-0 right-0 p-6">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-1">
                    {activeVideo.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-2">
                    {activeVideo.title}
                  </p>
                  <p className="text-gray-400 text-sm flex items-center gap-2">
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {activeVideo.location}
                  </p>
                  <p className="text-gray-200 italic mt-3">
                    "{activeVideo.fullQuote}"
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VideoTestimonials;

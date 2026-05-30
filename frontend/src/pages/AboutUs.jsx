import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { setSEO } from "../utils/seo";

const AboutUs = () => {
  useEffect(() => {
    setSEO({
      title: "About Us",
      description: "The Mindy Munchs story — bringing India's traditional superfoods to the modern high-performer.",
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="w-full min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 flex flex-col justify-center pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* Title row */}
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-primary-500 mb-3">Our Story</p>
            <h1 className="font-brand text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-4">
              About Us
            </h1>
            <p className="text-lg sm:text-xl font-semibold text-neutral-600 max-w-2xl mx-auto leading-snug">
              Helping India perform better — mentally, physically, and emotionally — every single day.
            </p>
          </div>

          {/* Founder + Nutritionist cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-100 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">👤</span>
                </div>
                <p className="font-heading font-bold text-xs uppercase tracking-widest text-primary-600">From the Founder</p>
              </div>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                My son plays professional cricket. I watched him reach for sugar-loaded drinks after every training session. So I went back to what India has always known — Channa Sattu, Amla, Makhana, Ragi etc. I built the drink I always wished existed for him.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-100 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🥗</span>
                </div>
                <p className="font-heading font-bold text-xs uppercase tracking-widest text-primary-600">Consultant Nutritionist — Neeta Shukla</p>
              </div>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                Over 22 years, she has guided clients focussing on practical nutrition rooted in everyday Indian foods rather than short-term approaches. In today's times when many packaged foods are loaded with preservatives, additives and artificial ingredients, Mindy Munchs stands out as a simple, wholesome and naturally nourishing option.
              </p>
            </div>

          </div>

          <div className="flex justify-center">
            <Link
              to="/products"
              className="btn-accent text-sm sm:text-base px-8 py-3 rounded-lg font-bold hover:scale-105 transform transition-all duration-300 shadow-lg"
            >
              Explore Our Products
            </Link>
          </div>

        </div>
      </div>

      {/* Nutritionist Profile Section */}
      <div className="py-14 sm:py-20 bg-neutral-50">
        <div className="container mx-auto px-4 max-w-6xl">

          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-primary-500 mb-3">Expert Endorsement</p>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-800">
              Nutritionist's Perspective
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

            {/* Left — Photo + credentials */}
            <div className="lg:col-span-4 flex flex-col items-center text-center gap-5">
              <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden shadow-lg border-4 border-orange-100">
                <img
                  src="/Nutritionist.jpeg"
                  alt="Dietitian Neeta Shukla"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-neutral-900 mb-1">Neeta Shukla</h3>
                <p className="font-sans text-sm text-primary-600 font-semibold mb-3">Consultant Dietitian & Nutritionist</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="bg-orange-50 border border-orange-200 text-neutral-700 text-xs px-3 py-1 rounded-full">B.A. (Hons.)</span>
                  <span className="bg-orange-50 border border-orange-200 text-neutral-700 text-xs px-3 py-1 rounded-full">22+ Years Experience</span>
                  <span className="bg-orange-50 border border-orange-200 text-neutral-700 text-xs px-3 py-1 rounded-full">9+ Countries</span>
                  <span className="bg-orange-50 border border-orange-200 text-neutral-700 text-xs px-3 py-1 rounded-full">Weight & Disease Management</span>
                </div>
              </div>
            </div>

            {/* Right — Bio + endorsement */}
            <div className="lg:col-span-8 flex flex-col gap-5">
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                Dietitian Neeta Shukla holds a B.A. (Hons.) degree and has completed professional training in Dietetics, Food, Nutrition, Weight Management, and Disease Management from Personal Point — one of India's earliest slimming and wellness clinics. With over 22 years of experience, she has worked closely with individuals across different age groups and lifestyles to help them build healthier, more sustainable eating habits. Over the years, she has guided clients from 9+ countries, focusing on practical nutrition rooted in everyday Indian foods rather than restrictive or short-term approaches.
              </p>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                Mindy Munchs is working towards bringing traditional, nutrient-dense Indian foods back into modern lifestyles in a convenient and accessible way. In today's time, when many packaged foods are loaded with preservatives, additives, and artificial ingredients, Mindy Munchs' products stand out as a simple, wholesome, and naturally nourishing option. Naturally rich in protein, iron, and fibre — it's a smart addition to everyday diets for people looking for sustained energy, better digestion, and healthier snacking choices.
              </p>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                Its convenient 30 gm packaging makes it easy to carry during work, travel, or busy schedules — helping people avoid unhealthy snacking during long gaps between meals. Many individuals experience low energy levels in the second half of the day and often reach for processed snacks or sugary beverages.
              </p>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                The clean ingredient philosophy — no preservatives — combined with its refreshing taste and filling nature, makes it an easy and practical addition to modern lifestyles. The larger purpose behind this association is to encourage people to reconnect with traditional Indian superfoods that are simple, effective, minimally processed, and naturally beneficial for long-term health.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* The Reality We're Addressing Section */}
      <div className="py-12 sm:py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
              The Reality We're Addressing
            </h2>
            <p className="text-base sm:text-lg font-semibold text-primary-600 max-w-2xl mx-auto leading-relaxed">
              4 PM Energy Crash is for Real — 60% of the times it results in reduced productivity for up to 90 mins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-orange-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⚖️</span>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-neutral-800 mb-2">
                    India Is Simultaneously Undernourished and Overfed
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Millions are consuming enough calories but still lack protein, iron, magnesium & micro nutrients — resulting in frequent energy crashes, poor recovery and rising lifestyle disorders.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-orange-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-neutral-800 mb-2">
                    Energy Crisis Is Real
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Protein deficiency, anemia, mental fatigue, stress overload, poor sleep and ultra-processed diets — yet most energy solutions only provide sugar, caffeine and temporary stimulation.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-orange-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🌿</span>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-neutral-800 mb-2">
                    Modern Food Is Disconnecting People From Functional Nutrition
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Modern eating habits are all about convenience calories, ultra-processed foods and nutrient-poor snacking.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-orange-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🛡️</span>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-neutral-800 mb-2">
                    Preventive Wellness Must Become Daily and Accessible
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    We are here to celebrate the power of choice, the richness of tradition and the joy of eating right — one mindful munch at a time.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="py-12 sm:py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
                Our Philosophy 🌱
              </h2>
              <p className="text-base sm:text-lg text-neutral-800 max-w-2xl mx-auto leading-relaxed">
                In a time when convenience often comes at the cost of health,
                we're choosing a different path.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg border border-orange-200 transition-all duration-300 hover:scale-105">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🏛️</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-accent-600 mb-3">
                    Reconnecting with Tradition
                  </h3>
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed text-center">
                  Bring back foods that heal, nourish, and belong to us—just
                  served in a way that fits modern lifestyles.
                </p>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg border border-orange-200 transition-all duration-300 hover:scale-105">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🔄</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-accent-600 mb-3">
                    Not Reinventing, Reconnecting
                  </h3>
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed text-center">
                  We're not reinventing food. We're reconnecting with it.
                </p>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg border border-orange-200 transition-all duration-300 hover:scale-105">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-accent-600 mb-3">
                    Health Begins at Home
                  </h3>
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed text-center">
                  A healthier, stronger India doesn't begin with
                  prescriptions—it begins with what's on our plates, in our
                  tiffins, and on our snack shelves.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What We Believe Section */}
      <div className="py-12 sm:py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
                What We Believe 💚
              </h2>
              <p className="text-base sm:text-lg text-neutral-800 max-w-xl mx-auto leading-relaxed">
                At Mindy Munchs, this isn't just a business model—it's a belief.
              </p>
            </div>

            <div className="space-y-4">
              <div className="group cursor-pointer bg-white rounded-xl p-6 shadow-md hover:shadow-lg hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">⚡</span>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-accent-600 group-hover:text-orange-400 transition mb-2">
                      The Right Snack at the Right Time
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      Can fuel not just your day, but your life.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer bg-white rounded-xl p-6 shadow-md hover:shadow-lg hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🌿</span>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-accent-600 group-hover:text-orange-400 transition mb-2">
                      Traditional Foods Deserve Revival
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      Wholesome foods, once rooted in tradition, deserve a
                      revival in modern homes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer bg-white rounded-xl p-6 shadow-md hover:shadow-lg hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">💪</span>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-accent-600 group-hover:text-orange-400 transition mb-2">
                      Every Bite Should Nourish
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      Every bite should nourish, energize, and empower.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-12 sm:py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
                Reviving Wholesome Foods for Modern Lifestyles 🚀
              </h2>
              <p className="text-base sm:text-lg text-neutral-700 max-w-4xl mx-auto leading-relaxed">
                We are reintroducing the power of India's authentic superfoods crafted thoughtfully for today's busy, health-conscious world.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Sattu Card */}
              <Link to="/sattu" className="block group">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg border border-orange-200 hover:border-accent-300 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full flex items-center justify-center text-2xl mr-4">
                      🌾
                    </div>
                    <h3 className="font-heading text-xl font-bold text-accent-600 group-hover:text-accent-700 transition">
                      Game-Up
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-3">
                    Daily performance fuel powered by India's original superfuel — Chana Sattu. Crafted to provide steady energy, natural electrolytes, and keep you light and active all day long.
                  </p>
                  <div className="flex items-center text-xs text-accent-500">
                    <span className="inline-block w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                    Heritage Superfood
                  </div>
                </div>
              </Link>

              {/* Makhana Card */}
              <Link to="/makhana" className="block group">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg border border-orange-200 hover:border-accent-300 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full flex items-center justify-center text-2xl mr-4">
                      🌰
                    </div>
                    <h3 className="font-heading text-xl font-bold text-accent-600 group-hover:text-accent-700 transition">
                      Makhana
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-3">
                    Light, protein-rich fox nuts that are perfect for healthy
                    snacking. Low in calories, high in nutrition, and incredibly
                    versatile.
                  </p>
                  <div className="flex items-center text-xs text-accent-500">
                    <span className="inline-block w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                    Protein Powerhouse
                  </div>
                </div>
              </Link>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-accent-50 to-orange-50 rounded-xl p-6 sm:p-8 max-w-3xl mx-auto border-2 border-accent-200">
                <p className="text-base sm:text-lg font-medium text-accent-800 mb-4 leading-relaxed">
                  Because eating right shouldn't feel like a sacrifice—it should
                  feel like coming home to better health.
                </p>
                <div className="space-y-1">
                  <p className="text-lg sm:text-xl font-bold text-accent-700">
                    👉 That's who we are. That's what we stand for.
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-accent-800">
                    Mindy Munchs: Reviving Wholesome Trafitional foods for
                    Modern Convenience
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { setSEO } from "../utils/seo";

const Makhana = () => {
  useEffect(() => {
    setSEO({
      title: "Makhana — Premium Fox Nuts",
      description: "Shop Mindy Munchs premium flavoured Makhana. Healthy roasted fox nuts in multiple flavours. FSSAI certified, no preservatives.",
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="w-full min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 flex flex-col lg:flex-row">
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 order-1 lg:order-1">
          <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg flex items-center justify-center">
            <div className="bg-gradient-to-br from-orange-200 to-yellow-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl w-full">
              <div className="aspect-[4/5] overflow-hidden rounded-lg">
                <img
                  src="/Makhana1.jpg"
                  alt="Makhana Product"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 order-2 lg:order-2">
          <div className="space-y-4 sm:space-y-6 max-w-lg text-center lg:text-left">
            <h1 className="font-brand text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-neutral-800 leading-tight">
              Jumbo Makhana
              <br />
              <span className="text-accent-700 text-2xl sm:text-4xl lg:text-4xl">
                Pesticide Free. Hand Graded.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-neutral-700 leading-relaxed">
              Hand graded Makhana in a beautiful square transparent pack. This ascertains our complete transparency and commitment to give you the best.
            </p>
            <Link to="/products">
              <button className="btn-accent text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:scale-105 transform transition-all duration-300 shadow-lg">
                Shop Now
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-12 sm:py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-800 text-center">
              The Many Benefits of Makhana
            </h2>
            <p className="text-base sm:text-lg text-neutral-700 mb-4 sm:mb-6 text-center">
              Makhana isn't just crunchy and delicious — it's a powerhouse of wellness. Regular consumption may help:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-neutral-700">
              {[
                "Boost antioxidants",
                "Maintain healthy sugar levels",
                "Support weight management",
                "Balance hormones naturally",
                "Prevent inflammation",
                "Improve digestion",
                "Detoxify the liver",
                "Slow down ageing",
                "Strengthen kidneys",
                "Keep bones strong",
              ].map((b) => (
                <div key={b} className="flex items-start gap-3">
                  <span className="text-accent-600 text-lg sm:text-xl flex-shrink-0">✅</span>
                  <p className="text-sm sm:text-base">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Three Varieties Section */}
      <div className="py-12 sm:py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-800 mb-3 sm:mb-4">
            <span className="text-accent-800">Premium Quality Makhana</span>
          </h2>
          <p className="text-base sm:text-lg text-neutral-800 mb-8 sm:mb-12">
            High-Grade, Hand-Picked Fox Nuts
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <Link to="/products/peri-peri-makhana" className="block group">
              <div className="relative overflow-hidden rounded-lg sm:rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="relative h-56 sm:h-64 lg:h-72">
                  <img src="/PERI-PERI-makhana.png" alt="Peri-Peri Makhana" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-end p-4 sm:p-6">
                    <div className="text-white">
                      <h3 className="font-heading text-lg sm:text-xl lg:text-2xl font-bold mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Peri-Peri Makhana</h3>
                      <p className="text-xs sm:text-sm text-gray-200 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">Fiery & Bold Spice Blend</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                </div>
              </div>
            </Link>

            <Link to="/products/tomato-makhana" className="block group">
              <div className="relative overflow-hidden rounded-lg sm:rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="relative h-56 sm:h-64 lg:h-72">
                  <img src="/tomato-main.png" alt="Tomato Makhana" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-end p-4 sm:p-6">
                    <div className="text-white">
                      <h3 className="font-heading text-lg sm:text-xl lg:text-2xl font-bold mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Tomato Makhana</h3>
                      <p className="text-xs sm:text-sm text-gray-200 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">Tangy & Zesty Flavor</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                </div>
              </div>
            </Link>

            <Link to="/products/minty-masala-makhana" className="block group">
              <div className="relative overflow-hidden rounded-lg sm:rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer sm:col-span-2 lg:col-span-1">
                <div className="relative h-56 sm:h-64 lg:h-72">
                  <img src="/minty-masala.png" alt="Minty Masala Makhana" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-end p-4 sm:p-6">
                    <div className="text-white">
                      <h3 className="font-heading text-lg sm:text-xl lg:text-2xl font-bold mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Minty Masala Makhana</h3>
                      <p className="text-xs sm:text-sm text-gray-200 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">Cool & Refreshingly Spiced</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Nutritional Powerhouse Section */}
      <div className="py-12 sm:py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-neutral-800 text-center">
              Nutrition Powerhouse Revisit
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {[
                { title: "High Protein Content", desc: "9.7g protein per 100g, perfect for muscle building" },
                { title: "Rich in Antioxidants", desc: "Contains gallic acid and epicatechin for anti-aging" },
                { title: "Low Calorie Snack", desc: "Only 347 calories per 100g, guilt-free munching" },
                { title: "High Fiber", desc: "14.5g fiber per 100g for better digestion" },
                { title: "Essential Minerals", desc: "Rich in calcium, magnesium, potassium, and phosphorus" },
                { title: "Heart Healthy", desc: "Low in saturated fats and cholesterol-free" },
              ].map((item) => (
                <div key={item.title} className="group cursor-pointer bg-white/90 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-accent-600 group-hover:text-orange-400 transition mb-1">
                    {item.title} —{" "}
                    <span className="text-neutral-500 text-xs sm:text-sm font-normal">{item.desc}</span>
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Make It Your Way Section */}
      <div className="py-12 sm:py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-800 mb-4 sm:mb-6 text-center">
              Make It Your Way
            </h2>
            <p className="text-base sm:text-lg text-neutral-800 mb-6 text-center">
              DIY Makhana isn't limited to just snacking — it's versatile enough for your kitchen experiments:
            </p>
            <div className="space-y-3 sm:space-y-4">
              {[
                { title: "Creamy Makhana Kheer", desc: "Rich & indulgent dessert perfect for your sweet tooth" },
                { title: "Nutritious Makhana Poha", desc: "Healthy breakfast option with added crunch and protein" },
                { title: "Crunchy Makhana Bhel", desc: "Street-food style chaat with a healthy twist" },
                { title: "Flavor Varieties", desc: "Minty Masala, Spicy Peri Peri, Tangy Sweet Tomato" },
              ].map((item) => (
                <div key={item.title} className="group cursor-pointer bg-white/90 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md hover:scale-[1.02] border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-accent-600 group-hover:text-orange-400 transition mb-1">
                    {item.title} —{" "}
                    <span className="text-neutral-500 text-xs sm:text-sm font-normal">{item.desc}</span>
                  </h3>
                </div>
              ))}
            </div>
            <div className="bg-accent-50 rounded-lg p-4 sm:p-6 mt-6 border border-accent-200">
              <p className="text-sm sm:text-base text-accent-800 font-medium">
                👉 Perfect for health-conscious snackers, kids, or anyone who loves a fun twist on everyday munching!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="py-12 sm:py-16 bg-neutral-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 sm:mb-12 text-neutral-800">
            Why Choose Makhana?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl p-6 sm:p-8 shadow-lg">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center text-3xl sm:text-4xl mb-4 sm:mb-6">🍿</div>
              <h3 className="font-heading text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-neutral-800">Regular Snacks</h3>
              <p className="text-sm sm:text-base text-neutral-600">High calories, processed ingredients, artificial preservatives</p>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl p-6 sm:p-8 shadow-lg border-2 border-accent-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-accent-200 flex items-center justify-center text-3xl sm:text-4xl mb-4 sm:mb-6">🌰</div>
              <h3 className="font-heading text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-accent-800">Makhana</h3>
              <p className="text-sm sm:text-base text-accent-700">Natural, protein-rich, antioxidant-packed, heart-healthy</p>
            </div>
            <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl p-6 sm:p-8 shadow-lg">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-3xl sm:text-4xl mb-4 sm:mb-6">🥜</div>
              <h3 className="font-heading text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-neutral-800">Other Nuts</h3>
              <p className="text-sm sm:text-base text-neutral-600">High fat content, may cause allergies, heavy on stomach</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ways to Enjoy Section */}
      <div className="py-12 sm:py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-accent-800 mb-3 sm:mb-4">
              Ways to Enjoy Makhana
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
              Discover delicious and nutritious ways to incorporate Makhana into your daily routine
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {[
              { icon: "🌰", title: "Roasted Makhana", desc: "Simply roasted with a pinch of salt — the classic way to enjoy these crunchy lotus seeds", tag: "Classic & Crunchy" },
              { icon: "🥛", title: "Makhana Kheer", desc: "Rich & indulgent dessert perfect for your sweet tooth", tag: "Sweet & Festive" },
              { icon: "🌶️", title: "Spiced Varieties", desc: "Minty masala, peri peri, and tangy tomato flavors for exciting snack experiences", tag: "Bold & Flavorful" },
              { icon: "🍚", title: "Makhana Poha", desc: "Nutritious breakfast option combining the goodness of poha with crunchy makhana", tag: "Healthy Breakfast" },
              { icon: "🥗", title: "Makhana Bhel", desc: "Street-food style chaat with a healthy twist — perfect evening snack for the family", tag: "Street Food Style" },
              { icon: "🥜", title: "Makhana Trail Mix", desc: "Mix with nuts and dried fruits for a perfect on-the-go healthy snacking option", tag: "On-the-Go Energy" },
            ].map((item) => (
              <div key={item.title} className="group cursor-pointer bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl border border-orange-200 hover:border-accent-300 transition-all duration-300 hover:scale-105">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full flex items-center justify-center text-xl sm:text-2xl mr-3 sm:mr-4">
                    {item.icon}
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-accent-600 group-hover:text-accent-700 transition">{item.title}</h3>
                </div>
                <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                <div className="mt-3 sm:mt-4 flex items-center text-xs text-accent-500">
                  <span className="inline-block w-2 h-2 bg-accent-400 rounded-full mr-2"></span>
                  {item.tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Makhana;

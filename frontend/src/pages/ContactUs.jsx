import React from "react";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-primary-50 to-neutral-50 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="brand-heading text-4xl md:text-5xl text-primary-700 mb-4">
            Contact Us
          </h1>
          <p className="text-neutral-600 text-lg md:text-xl max-w-2xl mx-auto">
            We're here to help with your orders, refunds, and any questions
            about Mindy Munchs products.
          </p>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Email Contact Cards */}
            <div className="space-y-8">
              <div className="card p-8 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-secondary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-heading text-2xl text-neutral-800 mb-3">
                  Refunds & Customer Care
                </h3>
                <p className="text-neutral-600 mb-6">
                  Need help with returns, refunds, or general support? We're
                  here for you.
                </p>
                <a
                  href="mailto:wecare@mindymunchs.com"
                  className="inline-flex items-center btn-secondary text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary-600 transition-colors duration-200"
                >
                  wecare@mindymunchs.com
                </a>
              </div>

              <div className="card p-8 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-accent-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h3 className="font-heading text-2xl text-neutral-800 mb-3">
                  Order Support
                </h3>
                <p className="text-neutral-600 mb-6">
                  Questions about your order, shipping, or product availability?
                  Contact us here.
                </p>
                <a
                  href="mailto:order@mindymunchs.com"
                  className="inline-flex items-center btn-accent text-neutral-900 px-6 py-3 rounded-lg font-bold hover:bg-accent-600 transition-colors duration-200"
                >
                  order@mindymunchs.com
                </a>
              </div>
            </div>

            {/* Phone Contact Card */}
            <div className="space-y-8">
              <div className="card p-8 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <h3 className="font-heading text-2xl text-neutral-800 mb-3">
                  Customer Care Phone
                </h3>
                <p className="text-neutral-600 mb-6">
                  Speak directly with our customer care team for immediate
                  assistance.
                </p>
                <a
                  href="tel:+919355926060"
                  className="inline-flex items-center btn-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors duration-200 text-xl"
                >
                  📞 9355926060
                </a>
              </div>

              {/* Additional Info Card */}
              <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 p-8 rounded-xl border border-neutral-200">
                <h4 className="font-heading text-xl text-neutral-800 mb-4">
                  Quick Response Times
                </h4>
                <div className="space-y-3 text-neutral-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                    <span>Email responses within 24 hours</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-secondary-500 rounded-full mr-3"></div>
                    <span>Phone support during business hours</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    <span>Order updates via email & SMS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-gradient-to-r from-primary-50 via-white to-accent-50 py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="font-brand text-3xl text-neutral-800 mb-6">
            Love Our Healthy Snacks?
          </h2>
          <p className="text-neutral-600 text-lg mb-8">
            Follow us on social media for recipes, health tips, and updates on
            new products.
          </p>
          <div className="flex justify-center space-x-6">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
              <span className="text-primary-600 text-xl">📧</span>
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
              <span className="text-secondary-600 text-xl">📱</span>
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
              <span className="text-accent-600 text-xl">🌟</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

import React from "react";
import { FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";

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
                  href="mailto:wecare@mindymunchs.com"
                  className="inline-flex items-center btn-accent text-neutral-900 px-6 py-3 rounded-lg font-bold hover:bg-accent-600 transition-colors duration-200"
                >
                  wecare@mindymunchs.com
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
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

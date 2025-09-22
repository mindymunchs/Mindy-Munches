import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  TruckIcon, 
  ClockIcon, 
  ShieldCheckIcon, 
  MapPinIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  XCircleIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";

const ShippingPolicy = () => {
  const shippingInfo = [
    {
      icon: MapPinIcon,
      title: "Pan-India Coverage",
      description: "We currently ship across India to deliver fresh, quality products directly to your doorstep.",
      details: ["All major cities and towns", "Remote areas subject to courier availability"]
    },
    {
      icon: ClockIcon,
      title: "Quick Processing",
      description: "Orders are processed within 1–2 business days for prompt delivery.",
      details: ["Processing excludes Sundays & holidays", "Order confirmation via email/SMS"]
    },
    {
      icon: ShieldCheckIcon,
      title: "Safe Packaging",
      description: "All items are packed in sealed, food-grade containers to maintain freshness.",
      details: ["Food-grade sealed containers", "Cold packs for perishables", "Insulation when required"]
    },
    {
      icon: TruckIcon,
      title: "Order Tracking",
      description: "You'll receive an email/SMS with a tracking link once your order is shipped.",
      details: ["Real-time tracking updates", "Delivery notifications", "SMS & email alerts"]
    }
  ];

  const policies = [
    {
      icon: ArrowPathIcon,
      title: "Missed Deliveries",
      description: "One free redelivery attempt is provided. Additional attempts may incur charges.",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      icon: ExclamationTriangleIcon,
      title: "Returns & Refunds",
      description: "Only accepted for damaged, spoiled, or incorrect items reported within 24 hours with proof.",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200"
    },
    {
      icon: XCircleIcon,
      title: "Order Cancellations",
      description: "Cancellations allowed within 1 hour of placing order, provided the order hasn't been dispatched.",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      borderColor: "border-red-200"
    },
    {
      icon: InformationCircleIcon,
      title: "Potential Delays",
      description: "Shipping may be affected by holidays, weather conditions, or unforeseen courier issues.",
      bgColor: "bg-gray-50",
      iconColor: "text-gray-600",
      borderColor: "border-gray-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <TruckIcon className="w-16 h-16 mx-auto mb-6 text-orange-100" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Shipping Policy
            </h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Fast, safe, and reliable delivery of your favorite healthy snacks across India
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Shipping Information Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How We Ship Your Order
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From processing to delivery, here's everything you need to know about our shipping process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {shippingInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (index * 0.1), duration: 0.6 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <info.icon className="w-7 h-7 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {info.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {info.description}
                  </p>
                  <ul className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <li key={idx} className="text-sm text-gray-500 flex items-center">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Policies Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Important Policies
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Please review these important shipping policies to ensure a smooth delivery experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {policies.map((policy, index) => (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + (index * 0.1), duration: 0.6 }}
                className={`${policy.bgColor} ${policy.borderColor} border-2 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${policy.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <policy.icon className={`w-6 h-6 ${policy.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {policy.title}
                    </h3>
                    <p className="text-gray-700">
                      {policy.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">
            Questions About Shipping?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Our support team is here to help with any shipping-related queries or concerns
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-orange-50 transition-colors duration-200"
            >
              Contact Support
            </Link>
            <Link
              to="/"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-600 transition-all duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-orange-600 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ShippingPolicy;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import CheckoutSuccess from "../components/CheckoutSuccess";
import { formatPrice, formatPriceForRazorpay } from "../utils/priceUtils";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotal, getItemCount, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();

  const [orderData, setOrderData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
    },
    paymentMethod: "razorpay",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [errors, setErrors] = useState({});
  const [completedOrderTotal, setCompletedOrderTotal] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth", {
        state: {
          from: "/checkout",
          message: "Please login to proceed with checkout",
        },
      });
    }
  }, [isAuthenticated, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !showSuccess) {
      navigate("/cart");
    }
  }, [items.length, navigate, showSuccess]);

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          //console.log("✅ Razorpay script already loaded");
          resolve(true);
          return;
        }

        //console.log("📦 Loading Razorpay script...");
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          //console.log("✅ Razorpay script loaded successfully");
          resolve(true);
        };
        script.onerror = () => {
          //console.error("❌ Failed to load Razorpay script");
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  // Calculate totals consistently
  const subtotal = getTotal();
  const shipping = subtotal >= 500 ? 0 : 50;
  const finalTotal = subtotal + shipping;

  // console.log("🧮 Checkout calculations:", { 
  //   subtotal, 
  //   shipping, 
  //   finalTotal,
  //   items: items.length 
  // });

  // Indian states and union territories
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setOrderData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setOrderData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!orderData.name.trim()) newErrors.name = "Name is required";
    if (!orderData.email.trim()) newErrors.email = "Email is required";
    if (!orderData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!orderData.address.street.trim()) newErrors["address.street"] = "Street address is required";
    if (!orderData.address.city.trim()) newErrors["address.city"] = "City is required";
    if (!orderData.address.state.trim()) newErrors["address.state"] = "State is required";
    if (!orderData.address.pincode.trim()) newErrors["address.pincode"] = "Pincode is required";

    if (orderData.phone && !/^\d{10}$/.test(orderData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (orderData.email && !/\S+@\S+\.\S+/.test(orderData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (orderData.address.pincode && !/^\d{6}$/.test(orderData.address.pincode)) {
      newErrors["address.pincode"] = "Please enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRazorpayPayment = (razorpayOrderId) => {
    return new Promise((resolve, reject) => {
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_RIgXHSN9Xwq7U9";
      // console.log("🔑 Razorpay Key Check:", {
      //   keyExists: !!razorpayKey,
      //   keyFormat: razorpayKey?.startsWith('rzp_'),
      //   keyLength: razorpayKey?.length
      // });

      if (!razorpayKey) {
        reject(new Error("Razorpay key not configured"));
        return;
      }

      const options = {
        key: razorpayKey,
        amount: formatPriceForRazorpay(finalTotal),
        currency: "INR",
        name: "Mindy Munchs",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: function (response) {
          //console.log("✅ Razorpay payment successful:", response);
          resolve(response);
        },
        prefill: {
          name: orderData.name,
          email: orderData.email,
          contact: orderData.phone,
        },
        theme: {
          color: "#F37254",
        },
        modal: {
          ondismiss: function () {
            //console.log("❌ Payment cancelled by user");
            reject(new Error("Payment cancelled by user"));
          },
        },
      };

      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        reject(new Error("Razorpay SDK not loaded"));
      }
    });
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      //console.log("🚀 Starting order process with total:", finalTotal);

      // Step 1: Create Razorpay order
      const orderResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/payments/create-razorpay-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(isAuthenticated && {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }),
          },
          body: JSON.stringify({
            amount: formatPriceForRazorpay(finalTotal),
            currency: "INR",
            orderData: {
              name: orderData.name,
              email: orderData.email,
              phone: orderData.phone,
            },
          }),
        }
      );

      if (!orderResponse.ok) throw new Error("Failed to create order");

      const { id: razorpayOrderId } = await orderResponse.json();
      //console.log("✅ Razorpay order created:", razorpayOrderId);

      // Step 2: Handle Razorpay payment
      const paymentResponse = await handleRazorpayPayment(razorpayOrderId);

      // Step 3: Verify payment and create order
      const verifyResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/payments/verify-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(isAuthenticated && {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }),
          },
          body: JSON.stringify({
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
            orderDetails: {
              name: orderData.name,
              email: orderData.email,
              phone: orderData.phone,
              address: orderData.address,
              items: items,
              subtotal: subtotal,
              shipping: shipping,
              totalAmount: finalTotal,
            },
          }),
        }
      );

      const result = await verifyResponse.json();

      if (result.success) {
        // console.log("✅ Order completed successfully:", {
        //   orderNumber: result.orderNumber,
        //   totalAmount: result.totalAmount,
        //   frontendCalculatedTotal: finalTotal
        // });
        
        // CRITICAL: Store total BEFORE clearing cart
        const correctTotal = result.totalAmount || finalTotal;
        setCompletedOrderTotal(correctTotal);
        
        clearCart(); // This makes finalTotal become 50
        setOrderId(result.orderNumber);
        setShowSuccess(true);
      } else {
        throw new Error(result.message || "Order verification failed");
      }
    } catch (error) {
      //console.error("❌ Order placement failed:", error);
      alert(`Order failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Show success page with correct total
  if (showSuccess) {
    return (
      <CheckoutSuccess
        orderId={orderId}
        orderData={orderData}
        total={completedOrderTotal || finalTotal}
      />
    );
  }

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-neutral-800">Checkout</h1>
          <p className="text-neutral-600 mt-1">Complete your order</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
            >
              {/* Contact Information */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={orderData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.name ? "border-red-500" : "border-neutral-300"
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={orderData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.phone ? "border-red-500" : "border-neutral-300"
                      }`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={orderData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.email ? "border-red-500" : "border-neutral-300"
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Street Address *</label>
                    <input
                      type="text"
                      name="address.street"
                      value={orderData.address.street}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors["address.street"] ? "border-red-500" : "border-neutral-300"
                      }`}
                      placeholder="Enter your street address"
                    />
                    {errors["address.street"] && <p className="text-red-500 text-xs mt-1">{errors["address.street"]}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Landmark (Optional)</label>
                    <input
                      type="text"
                      name="address.landmark"
                      value={orderData.address.landmark}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Nearby landmark"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="address.city"
                        value={orderData.address.city}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors["address.city"] ? "border-red-500" : "border-neutral-300"
                        }`}
                        placeholder="City"
                      />
                      {errors["address.city"] && <p className="text-red-500 text-xs mt-1">{errors["address.city"]}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">State *</label>
                      <div className="relative">
                        <select
                          name="address.state"
                          value={orderData.address.state}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white ${
                            errors["address.state"] ? "border-red-500" : "border-neutral-300"
                          }`}
                          required
                        >
                          <option value="">Select State</option>
                          {indianStates.map((state) => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {errors["address.state"] && <p className="text-red-500 text-xs mt-1">{errors["address.state"]}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Pincode *</label>
                      <input
                        type="text"
                        name="address.pincode"
                        value={orderData.address.pincode}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors["address.pincode"] ? "border-red-500" : "border-neutral-300"
                        }`}
                        placeholder="Pincode"
                      />
                      {errors["address.pincode"] && <p className="text-red-500 text-xs mt-1">{errors["address.pincode"]}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">Payment Method</h2>
                <div className="border border-neutral-200 rounded-lg p-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={orderData.paymentMethod === "razorpay"}
                      onChange={handleInputChange}
                      className="text-primary-600"
                    />
                    <span className="ml-3 font-medium">Pay with Razorpay</span>
                  </label>
                  <p className="text-sm text-neutral-600 mt-2 ml-6">
                    Secure payment via UPI, Cards, NetBanking & Wallets
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 sticky top-8"
            >
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">Order Summary</h2>

              {/* Order Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded border"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-neutral-800 truncate">{item.name}</h4>
                      <p className="text-xs text-neutral-500">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-neutral-800">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 border-t border-neutral-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Subtotal ({getItemCount(items)} items)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="border-t border-neutral-200 pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-neutral-800">Total</span>
                    <span className="text-lg font-bold text-primary-600">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className={`w-full mt-6 py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                  isProcessing ? "bg-neutral-400 cursor-not-allowed" : "bg-primary-600 hover:bg-primary-700"
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  `Place Order - ${formatPrice(finalTotal)}`
                )}
              </button>

              {/* Security Notice */}
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure checkout</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

const axios = require('axios');

const BASE_URL = 'https://apiv2.shiprocket.in/v1/external';
let _token = null;
let _tokenExpiry = 0;

// ── Helpers ────────────────────────────────────────────────────────────────

const isConfigured = () =>
  !!(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD);

// Returns a valid JWT, refreshing if expired or missing
const getToken = async () => {
  if (_token && Date.now() < _tokenExpiry) return _token;

  const res = await axios.post(`${BASE_URL}/auth/login`, {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  });

  _token = res.data.token;
  // Shiprocket tokens are valid for 24 h — refresh 1 h early
  _tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
  return _token;
};

const client = async () => {
  const token = await getToken();
  return axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
};

// ── State-code map (Shiprocket requires 2-letter state codes) ──────────────

const STATE_CODES = {
  'Andhra Pradesh': 'AP', 'Arunachal Pradesh': 'AR', 'Assam': 'AS',
  'Bihar': 'BR', 'Chhattisgarh': 'CG', 'Goa': 'GA', 'Gujarat': 'GJ',
  'Haryana': 'HR', 'Himachal Pradesh': 'HP', 'Jharkhand': 'JH',
  'Karnataka': 'KA', 'Kerala': 'KL', 'Madhya Pradesh': 'MP',
  'Maharashtra': 'MH', 'Manipur': 'MN', 'Meghalaya': 'ML',
  'Mizoram': 'MZ', 'Nagaland': 'NL', 'Odisha': 'OR', 'Punjab': 'PB',
  'Rajasthan': 'RJ', 'Sikkim': 'SK', 'Tamil Nadu': 'TN', 'Telangana': 'TG',
  'Tripura': 'TR', 'Uttar Pradesh': 'UP', 'Uttarakhand': 'UK',
  'West Bengal': 'WB', 'Delhi': 'DL', 'Jammu and Kashmir': 'JK',
  'Ladakh': 'LA', 'Chandigarh': 'CH', 'Puducherry': 'PY',
  'Andaman and Nicobar Islands': 'AN', 'Dadra and Nagar Haveli': 'DN',
  'Daman and Diu': 'DD', 'Lakshadweep': 'LD',
};

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Create a Shiprocket order + auto-assign courier.
 * Returns { shiprocketOrderId, shipmentId, awb, courierName, trackingUrl }
 */
exports.createShipment = async (order) => {
  if (!isConfigured()) {
    console.log('[Shiprocket] Skipped — credentials not configured');
    return null;
  }

  const http = await client();
  const addr = order.shippingAddress;

  // Total weight in kg (sum of item weights; fallback 500g per item)
  const totalWeightKg = order.items.reduce((sum, item) => {
    const grams = item.weight || 500;
    return sum + (grams / 1000) * item.quantity;
  }, 0);

  const payload = {
    order_id: order.orderNumber,
    order_date: new Date(order.createdAt).toISOString().split('T')[0],
    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary',
    comment: order.notes || '',
    billing_customer_name: addr.name,
    billing_last_name: '',
    billing_address: addr.street,
    billing_address_2: addr.landmark || '',
    billing_city: addr.city,
    billing_pincode: addr.zipCode,
    billing_state: STATE_CODES[addr.state] || addr.state,
    billing_country: 'India',
    billing_email: order.customerEmail || '',
    billing_phone: (addr.phone || '').replace(/\D/g, '').slice(-10),
    shipping_is_billing: true,
    order_items: order.items.map(item => ({
      name: item.name,
      sku: item.product?.toString() || item.name,
      units: item.quantity,
      selling_price: item.price,
      discount: 0,
      tax: 0,
      hsn: '',
    })),
    payment_method: order.paymentMethod === 'razorpay' ? 'Prepaid' : 'COD',
    shipping_charges: order.shippingCost || 0,
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: order.discount || 0,
    sub_total: order.subtotal,
    length: parseFloat(process.env.SHIPROCKET_PKG_LENGTH) || 20,
    breadth: parseFloat(process.env.SHIPROCKET_PKG_BREADTH) || 15,
    height: parseFloat(process.env.SHIPROCKET_PKG_HEIGHT) || 10,
    weight: parseFloat(totalWeightKg.toFixed(2)),
  };

  const res = await http.post('/orders/create/adhoc', payload);
  const data = res.data;

  return {
    shiprocketOrderId: data.order_id?.toString() || null,
    shipmentId: data.shipment_id?.toString() || null,
    awb: data.awb_code || null,
    courierName: data.courier_name || null,
    trackingUrl: data.awb_code
      ? `https://shiprocket.co/tracking/${data.awb_code}`
      : null,
  };
};

/**
 * Fetch live tracking for an AWB number.
 * Returns the tracking array from Shiprocket.
 */
exports.getTracking = async (awb) => {
  if (!isConfigured() || !awb) return null;

  const http = await client();
  const res = await http.get(`/courier/track/awb/${awb}`);
  return res.data?.tracking_data || null;
};

/**
 * Cancel a Shiprocket order by shiprocketOrderId.
 */
exports.cancelShipment = async (shiprocketOrderId) => {
  if (!isConfigured() || !shiprocketOrderId) return null;

  const http = await client();
  const res = await http.post('/orders/cancel', { ids: [shiprocketOrderId] });
  return res.data;
};

/**
 * Check if a pincode is serviceable.
 * Returns { cod: bool, prepaid: bool } or null if unconfigured.
 */
exports.checkServiceability = async (pincode, weight = 0.5) => {
  if (!isConfigured() || !process.env.SHIPROCKET_PICKUP_PINCODE) return null;

  const http = await client();
  const res = await http.get('/courier/serviceability/', {
    params: {
      pickup_postcode: process.env.SHIPROCKET_PICKUP_PINCODE || '',
      delivery_postcode: pincode,
      weight,
      cod: 1,
    },
  });

  const couriers = res.data?.data?.available_courier_companies || [];
  return {
    serviceable: couriers.length > 0,
    cod: couriers.some(c => c.cod === 1),
    prepaid: couriers.length > 0,
    couriers: couriers.length,
  };
};

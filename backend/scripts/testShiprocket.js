/**
 * Shiprocket integration test script
 * Run from backend/: node scripts/testShiprocket.js
 */

require('dotenv').config();
const axios = require('axios');

const BASE = 'http://localhost:5000/api';
const TEST_EMAIL = 'shiprocket.test@mindymunchs.com';
const TEST_PASSWORD = 'TestPass@123';

async function run() {
  console.log('\n========== Shiprocket Integration Test ==========\n');

  // ── 1. Register or login test user ────────────────────────────────────────
  let token;
  console.log('1. Authenticating test user...');
  try {
    const res = await axios.post(`${BASE}/auth/register`, {
      name: 'Test User',
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    token = res.data.data?.token || res.data.token;
    console.log('   ✅ Registered new test user');
  } catch {
    try {
      const res = await axios.post(`${BASE}/auth/login`, {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });
      token = res.data.data?.token || res.data.token;
      console.log('   ✅ Logged in as existing test user');
    } catch (e) {
      console.error('   ❌ Auth failed:', e.response?.data?.message || e.message);
      process.exit(1);
    }
  }

  const headers = { Authorization: `Bearer ${token}` };

  // ── 2. Get a product ───────────────────────────────────────────────────────
  console.log('\n2. Fetching a product...');
  let product;
  try {
    const res = await axios.get(`${BASE}/products?limit=20`);
    const all = res.data.data?.products || res.data.products || res.data.data || [];
    product = all.find(p => p.isActive !== false && p.stock > 0) || all[0];
    if (!product) throw new Error('No products found in DB');
    console.log(`   ✅ Found product: "${product.name}" (₹${product.price})`);
  } catch (e) {
    console.error('   ❌ Product fetch failed:', e.response?.data?.message || e.message);
    process.exit(1);
  }

  // ── 3. Add product to cart ─────────────────────────────────────────────────
  console.log('\n3. Adding product to cart...');
  try {
    await axios.post(`${BASE}/cart/add`, {
      productId: product._id,
      quantity: 1,
    }, { headers });
    console.log('   ✅ Product added to cart');
  } catch (e) {
    console.error('   ❌ Add to cart failed:', e.response?.data?.message || e.message);
    process.exit(1);
  }

  // ── 4. Place COD order ─────────────────────────────────────────────────────
  console.log('\n4. Placing COD order...');
  let order;
  try {
    const res = await axios.post(`${BASE}/orders`, {
      paymentMethod: 'cod',
      shippingAddress: {
        name: 'Test Customer',
        phone: '9876543210',
        street: '303 Floor 3, Plot No 123, Gloomy Healthcare',
        city: 'Gurgaon',
        state: 'Haryana',
        zipCode: '122017',
        country: 'India',
      },
    }, { headers });
    order = res.data.data?.order;
    console.log(`   ✅ Order placed: ${order.orderNumber}`);
  } catch (e) {
    console.error('   ❌ Order creation failed:', e.response?.data?.message || e.message);
    process.exit(1);
  }

  // ── 5. Wait for Shiprocket (non-blocking — give it 8 seconds) ──────────────
  console.log('\n5. Waiting 8 seconds for Shiprocket to respond...');
  await new Promise(r => setTimeout(r, 8000));

  // ── 6. Check order in DB for Shiprocket fields ─────────────────────────────
  console.log('\n6. Checking order for Shiprocket data...');
  try {
    const res = await axios.get(`${BASE}/orders/${order._id}`, { headers });
    const updated = res.data.data?.order;

    console.log('\n   Order fields:');
    console.log(`   orderNumber:         ${updated.orderNumber}`);
    console.log(`   shiprocketOrderId:   ${updated.shiprocketOrderId || '❌ not set'}`);
    console.log(`   shiprocketShipmentId:${updated.shiprocketShipmentId || '❌ not set'}`);
    console.log(`   trackingNumber (AWB):${updated.trackingNumber || '❌ not set'}`);
    console.log(`   courierName:         ${updated.courierName || '❌ not set'}`);
    console.log(`   trackingUrl:         ${updated.trackingUrl || '❌ not set'}`);

    if (updated.shiprocketOrderId) {
      console.log('\n   ✅ SHIPROCKET INTEGRATION WORKING CORRECTLY');
    } else {
      console.log('\n   ⚠️  Shiprocket fields not populated — check backend terminal for [Shiprocket] error logs');
    }
  } catch (e) {
    console.error('   ❌ Order fetch failed:', e.response?.data?.message || e.message);
  }

  // ── 7. Test pincode serviceability ────────────────────────────────────────
  console.log('\n7. Testing pincode serviceability (110001 — Delhi)...');
  try {
    const res = await axios.get(`${BASE}/shiprocket/serviceability?pincode=110001&weight=0.5`);
    const d = res.data;
    console.log(`   serviceable: ${d.serviceable}`);
    console.log(`   COD available: ${d.cod}`);
    console.log(`   Couriers available: ${d.couriers}`);
    if (d.serviceable !== undefined) {
      console.log('   ✅ Serviceability check working');
    }
  } catch (e) {
    console.error('   ❌ Serviceability check failed:', e.response?.data?.message || e.message);
  }

  console.log('\n========== Test Complete ==========\n');
}

run();

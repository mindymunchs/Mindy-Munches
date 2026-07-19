/**
 * Zoho integration test script
 * Run from backend/: node scripts/testZoho.js
 */
require('dotenv').config();
const axios = require('axios');

const BASE = 'http://localhost:5000/api';
const TEST_EMAIL = 'shiprocket.test@mindymunchs.com';
const TEST_PASSWORD = 'TestPass@123';

async function run() {
  console.log('\n========== Zoho Integration Test ==========\n');

  // ── 1. Login ───────────────────────────────────────────────────────────────
  console.log('1. Logging in as test user...');
  let token, userId;
  try {
    const res = await axios.post(`${BASE}/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    token = res.data.data?.token || res.data.token;
    userId = res.data.data?.user?.id;
    console.log('   ✅ Logged in');
  } catch (e) {
    console.error('   ❌ Login failed:', e.response?.data?.message || e.message);
    process.exit(1);
  }

  const headers = { Authorization: `Bearer ${token}` };

  // ── 2. Test Zoho auth directly ─────────────────────────────────────────────
  console.log('\n2. Testing Zoho OAuth token...');
  try {
    const res = await axios.post('https://accounts.zoho.in/oauth/v2/token', null, {
      params: {
        grant_type:    'refresh_token',
        client_id:     process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
      },
    });
    if (res.data.access_token) {
      console.log('   ✅ Zoho OAuth working — access token received');
    } else {
      console.error('   ❌ No access token:', res.data);
    }
  } catch (e) {
    console.error('   ❌ Zoho auth failed:', e.response?.data || e.message);
    process.exit(1);
  }

  // ── 3. Place a test order ──────────────────────────────────────────────────
  console.log('\n3. Adding product to cart and placing order...');
  let order;
  try {
    const products = await axios.get(`${BASE}/products?limit=20`);
    const all = products.data.data?.products || products.data.products || products.data.data || [];
    const product = all.find(p => p.isActive !== false && p.stock > 0) || all[0];
    if (!product) throw new Error('No products found');

    await axios.post(`${BASE}/cart/add`, { productId: product._id, quantity: 1 }, { headers });

    const orderRes = await axios.post(`${BASE}/orders`, {
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

    order = orderRes.data.data?.order;
    console.log(`   ✅ Order placed: ${order.orderNumber}`);
  } catch (e) {
    console.error('   ❌ Order failed:', e.response?.data?.message || e.message);
    process.exit(1);
  }

  // ── 4. Wait for Zoho (non-blocking) ───────────────────────────────────────
  console.log('\n4. Waiting 8 seconds for Zoho to respond...');
  await new Promise(r => setTimeout(r, 8000));

  // ── 5. Check order for Zoho invoice ───────────────────────────────────────
  console.log('\n5. Checking order for Zoho invoice...');
  try {
    const res = await axios.get(`${BASE}/orders/${order._id}`, { headers });
    const updated = res.data.data?.order;
    console.log(`   zohoInvoiceId: ${updated.zohoInvoiceId || '❌ not set'}`);
    if (updated.zohoInvoiceId) {
      console.log('   ✅ ZOHO BOOKS — Invoice created successfully');
    } else {
      console.log('   ⚠️  Invoice not created — check backend terminal for [Zoho Books] error');
    }
  } catch (e) {
    console.error('   ❌ Order fetch failed:', e.response?.data?.message || e.message);
  }

  // ── 6. Check user for Zoho CRM contact ────────────────────────────────────
  console.log('\n6. Checking Zoho CRM contact sync...');
  try {
    const adminLogin = await axios.post(`${BASE}/auth/login`, {
      email: process.env.SUPER_ADMIN_EMAILS?.split(',')[0] || 'sunnyjainpvt1401@gmail.com',
      password: 'admin-password', // will fail if wrong — just checking
    }).catch(() => null);

    if (adminLogin) {
      const adminHeaders = { Authorization: `Bearer ${adminLogin.data.data?.token}` };
      const syncRes = await axios.post(`${BASE}/zoho/users/${userId}/sync-contact`, {}, { headers: adminHeaders });
      console.log(`   zohoContactId: ${syncRes.data.contactId || '❌ not returned'}`);
      if (syncRes.data.contactId) {
        console.log('   ✅ ZOHO CRM — Contact sync working');
      }
    } else {
      console.log('   ⚠️  Skipping CRM check (admin login needed) — check Zoho CRM dashboard manually for the contact');
    }
  } catch (e) {
    console.error('   ❌ CRM sync failed:', e.response?.data?.message || e.message);
  }

  console.log('\n========== Zoho Test Complete ==========\n');
  console.log('Check your Zoho Books dashboard for the invoice.');
  console.log('Check your Zoho CRM dashboard for the contact + deal.\n');
}

run();

/**
 * Direct Zoho Books + CRM diagnostic
 * Run: node scripts/testZohoDirect.js
 */
require('dotenv').config();
const axios = require('axios');

const CRM_BASE   = process.env.ZOHO_CRM_BASE_URL   || 'https://www.zohoapis.in/crm/v2';
const BOOKS_BASE = process.env.ZOHO_BOOKS_BASE_URL  || 'https://www.zohoapis.in/books/v3';

async function getToken() {
  const res = await axios.post('https://accounts.zoho.in/oauth/v2/token', null, {
    params: {
      grant_type:    'refresh_token',
      client_id:     process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      refresh_token: process.env.ZOHO_REFRESH_TOKEN,
    },
  });
  return res.data.access_token;
}

async function run() {
  console.log('\n===== Zoho Direct Diagnostic =====\n');
  console.log('Env check:');
  console.log('  ZOHO_CLIENT_ID:     ', process.env.ZOHO_CLIENT_ID ? '✅' : '❌ missing');
  console.log('  ZOHO_CLIENT_SECRET: ', process.env.ZOHO_CLIENT_SECRET ? '✅' : '❌ missing');
  console.log('  ZOHO_REFRESH_TOKEN: ', process.env.ZOHO_REFRESH_TOKEN ? '✅' : '❌ missing');
  console.log('  ZOHO_ORG_ID:        ', process.env.ZOHO_ORG_ID || '❌ missing');

  // ── Get token ──────────────────────────────────────────────────────────────
  console.log('\n1. Getting access token...');
  let token;
  try {
    token = await getToken();
    console.log('   ✅ Token received');
  } catch (e) {
    console.error('   ❌ Failed:', e.response?.data || e.message);
    return;
  }

  const headers = {
    Authorization: `Zoho-oauthtoken ${token}`,
    'Content-Type': 'application/json',
  };

  // ── Test Zoho Books ────────────────────────────────────────────────────────
  console.log('\n2. Testing Zoho Books — creating customer + invoice...');
  try {
    const orgId = process.env.ZOHO_ORG_ID;

    // Step 2a: Create customer
    console.log('   Creating customer in Zoho Books...');
    const customerRes = await axios.post(
      `${BOOKS_BASE}/contacts?organization_id=${orgId}`,
      {
        contact_name: 'Test Customer',
        contact_type: 'customer',
        email: 'test@mindymunchs.com',
        phone: '9876543210',
        billing_address: {
          address: '303 Floor 3, Plot No 123',
          city: 'Gurgaon',
          state: 'Haryana',
          zip: '122017',
          country: 'India',
        },
      },
      { headers }
    );
    const customerId = customerRes.data?.contact?.contact_id;
    if (!customerId) throw new Error('Customer creation failed: ' + JSON.stringify(customerRes.data));
    console.log(`   ✅ Customer created: ${customerId}`);

    // Step 2b: Create invoice
    console.log('   Creating invoice...');
    const invoiceRes = await axios.post(
      `${BOOKS_BASE}/invoices?organization_id=${orgId}`,
      {
        customer_id: customerId,
        line_items: [{ name: 'Jumbo Makhana', quantity: 1, rate: 450, unit: 'pcs' }],
        reference_number: 'TEST-003',
        date: new Date().toISOString().split('T')[0],
        payment_terms: 0,
        notes: 'Test invoice — Mindy Munchs',
      },
      { headers }
    );

    const invoiceId = invoiceRes.data?.invoice?.invoice_id;
    if (invoiceId) {
      console.log(`   ✅ Invoice created! Invoice ID: ${invoiceId}`);
    } else {
      console.log('   ⚠️  Response:', JSON.stringify(invoiceRes.data, null, 2));
    }
  } catch (e) {
    console.error('   ❌ Zoho Books failed!');
    console.error('   Status:', e.response?.status);
    console.error('   Error:', JSON.stringify(e.response?.data, null, 2) || e.message);
  }

  // ── Test Zoho CRM ──────────────────────────────────────────────────────────
  console.log('\n3. Testing Zoho CRM — creating test contact...');
  try {
    const payload = {
      data: [{
        First_Name: 'Test',
        Last_Name: 'Customer',
        Email: 'test@mindymunchs.com',
        Phone: '9876543210',
        Lead_Source: 'Website',
        Description: 'Test contact — Mindy Munchs',
      }],
      trigger: [],
    };

    const res = await axios.post(`${CRM_BASE}/Contacts`, payload, { headers });
    const contactId = res.data?.data?.[0]?.details?.id;
    if (contactId) {
      console.log(`   ✅ CRM Contact created! Contact ID: ${contactId}`);
    } else {
      console.log('   ⚠️  Response:', JSON.stringify(res.data, null, 2));
    }
  } catch (e) {
    console.error('   ❌ Zoho CRM failed!');
    console.error('   Status:', e.response?.status);
    console.error('   Error:', JSON.stringify(e.response?.data, null, 2) || e.message);
  }

  console.log('\n===== Diagnostic Complete =====\n');
}

run();

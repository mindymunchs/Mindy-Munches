/**
 * Quick Shiprocket auth diagnostic
 * Run: node scripts/testShiprocketAuth.js
 */
require('dotenv').config();
const axios = require('axios');

async function run() {
  console.log('\n===== Shiprocket Auth Diagnostic =====\n');
  console.log('Email:   ', process.env.SHIPROCKET_EMAIL || '❌ NOT SET');
  console.log('Password:', process.env.SHIPROCKET_PASSWORD ? '✅ SET' : '❌ NOT SET');
  console.log('Pickup Location:', process.env.SHIPROCKET_PICKUP_LOCATION || '❌ NOT SET');
  console.log('Pickup Pincode: ', process.env.SHIPROCKET_PICKUP_PINCODE || '❌ NOT SET');

  if (!process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD) {
    console.log('\n❌ Credentials missing in .env — stopping here.');
    return;
  }

  console.log('\nAttempting Shiprocket login...');
  try {
    const res = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    });
    console.log('✅ Login successful!');
    console.log('Token (first 40 chars):', res.data.token?.substring(0, 40) + '...');
    console.log('Company:', res.data.company_name || 'N/A');
  } catch (e) {
    console.error('❌ Login failed!');
    console.error('Status:', e.response?.status);
    console.error('Message:', e.response?.data?.message || e.message);
    if (e.response?.status === 403) {
      console.log('\nPossible causes:');
      console.log('  1. Wrong email or password in .env');
      console.log('  2. Account not activated — check your Shiprocket email for a verification link');
      console.log('  3. Account suspended or restricted');
    }
  }
}

run();

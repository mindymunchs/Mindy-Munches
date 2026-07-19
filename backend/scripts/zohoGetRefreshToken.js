/**
 * Exchange Zoho grant code for a refresh token
 *
 * Before running:
 *   1. Set ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET in backend/.env
 *   2. Set ZOHO_REFRESH_TOKEN to the grant code you just generated (temporarily)
 *
 * Run: node scripts/zohoGetRefreshToken.js
 */
require('dotenv').config();
const axios = require('axios');

async function run() {
  console.log('\n===== Zoho Refresh Token Exchange =====\n');

  const clientId     = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const grantCode    = process.env.ZOHO_REFRESH_TOKEN; // temporarily holds grant code

  if (!clientId || !clientSecret || !grantCode) {
    console.error('❌ Missing values in .env:');
    if (!clientId)     console.error('   ZOHO_CLIENT_ID not set');
    if (!clientSecret) console.error('   ZOHO_CLIENT_SECRET not set');
    if (!grantCode)    console.error('   ZOHO_REFRESH_TOKEN (grant code) not set');
    return;
  }

  console.log('Client ID:  ', clientId);
  console.log('Grant Code: ', grantCode.substring(0, 20) + '...');
  console.log('\nExchanging grant code for refresh token...');

  try {
    const res = await axios.post('https://accounts.zoho.in/oauth/v2/token', null, {
      params: {
        grant_type:    'authorization_code',
        client_id:     clientId,
        client_secret: clientSecret,
        code:          grantCode,
        redirect_uri:  'https://www.zoho.com',
      },
    });

    const { access_token, refresh_token, error } = res.data;

    if (error) {
      console.error('❌ Zoho returned an error:', error);
      if (error === 'invalid_code') {
        console.log('\nThe grant code has expired (valid only 10 minutes).');
        console.log('Go back to api-console.zoho.in → Self Client → Generate Code and get a new one.');
      }
      return;
    }

    console.log('\n✅ Success!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('REFRESH TOKEN (copy this into your .env):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(refresh_token);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nReplace the grant code in ZOHO_REFRESH_TOKEN with the value above.');
    console.log('Access token (expires in 1hr, you do NOT need to save this):');
    console.log(access_token?.substring(0, 40) + '...');
  } catch (e) {
    console.error('❌ Request failed:', e.response?.data || e.message);
  }
}

run();

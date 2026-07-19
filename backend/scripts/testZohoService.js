/**
 * Calls zohoService.createInvoice directly with a fake order object
 * Run: node scripts/testZohoService.js
 */
require('dotenv').config();
const zoho = require('../services/zohoService');

const fakeOrder = {
  orderNumber: 'MM-DIRECT-TEST-001',
  createdAt: new Date(),
  customerEmail: 'test@mindymunchs.com',
  shippingAddress: {
    name: 'Test Customer',
    phone: '9876543210',
    street: '303 Floor 3, Plot No 123',
    city: 'Gurgaon',
    state: 'Haryana',
    zipCode: '122017',
    country: 'India',
  },
  items: [
    { name: 'Jumbo Makhana', quantity: 1, price: 450 },
  ],
  subtotal: 450,
  shippingCost: 50,
  discount: 0,
  totalAmount: 500,
};

async function run() {
  console.log('\n===== Direct zohoService.createInvoice Test =====\n');

  console.log('Calling zoho.createInvoice...');
  const invoiceId = await zoho.createInvoice(fakeOrder);

  if (invoiceId) {
    console.log('\n✅ SUCCESS — Invoice ID:', invoiceId);
  } else {
    console.log('\n❌ FAILED — invoiceId is null (check errors above)');
  }

  console.log('\nCalling zoho.syncContact...');
  const contactId = await zoho.syncContact({
    name: 'Test Customer',
    email: 'test@mindymunchs.com',
    phone: '9876543210',
    authProvider: 'local',
  });

  if (contactId) {
    console.log('✅ SUCCESS — CRM Contact ID:', contactId);
  } else {
    console.log('❌ FAILED — contactId is null (check errors above)');
  }
}

run();

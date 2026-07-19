const axios = require('axios');

const CRM_BASE = process.env.ZOHO_CRM_BASE_URL || 'https://www.zohoapis.in/crm/v2';
const BOOKS_BASE = process.env.ZOHO_BOOKS_BASE_URL || 'https://www.zohoapis.in/books/v3';

let _accessToken = null;
let _tokenExpiry = 0;

// ── Helpers ────────────────────────────────────────────────────────────────

const isConfigured = () =>
  !!(process.env.ZOHO_CLIENT_ID &&
     process.env.ZOHO_CLIENT_SECRET &&
     process.env.ZOHO_REFRESH_TOKEN);

const getAccessToken = async () => {
  if (_accessToken && Date.now() < _tokenExpiry) return _accessToken;

  const res = await axios.post('https://accounts.zoho.in/oauth/v2/token', null, {
    params: {
      grant_type: 'refresh_token',
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      refresh_token: process.env.ZOHO_REFRESH_TOKEN,
    },
  });

  _accessToken = res.data.access_token;
  // Zoho tokens expire in 1 hour — refresh 5 min early
  _tokenExpiry = Date.now() + 55 * 60 * 1000;
  return _accessToken;
};

const crmHeaders = async () => ({
  Authorization: `Zoho-oauthtoken ${await getAccessToken()}`,
  'Content-Type': 'application/json',
});

const booksHeaders = async () => ({
  Authorization: `Zoho-oauthtoken ${await getAccessToken()}`,
  'Content-Type': 'application/json',
});

// ── CRM ───────────────────────────────────────────────────────────────────

/**
 * Sync a user as a CRM contact.
 * Returns zohoContactId (string) or null.
 */
exports.syncContact = async (user) => {
  if (!isConfigured()) {
    console.log('[Zoho CRM] Skipped — credentials not configured');
    return null;
  }

  try {
    const headers = await crmHeaders();

    // Search for existing contact by email to avoid duplicates
    if (user.email) {
      try {
        const search = await axios.get(
          `${CRM_BASE}/Contacts/search?email=${encodeURIComponent(user.email)}`,
          { headers }
        );
        const existing = search.data?.data?.[0];
        if (existing?.id) {
          console.log(`[Zoho CRM] Contact already exists: ${existing.id}`);
          return existing.id;
        }
      } catch (_) {}
    }

    const payload = {
      data: [{
        First_Name: user.name?.split(' ')[0] || user.name,
        Last_Name: user.name?.split(' ').slice(1).join(' ') || '-',
        Email: user.email,
        Phone: user.phone || '',
        Mailing_City: user.address?.city || '',
        Mailing_State: user.address?.state || '',
        Mailing_Zip: user.address?.zipCode || '',
        Mailing_Country: user.address?.country || 'India',
        Lead_Source: user.authProvider === 'google' ? 'Google OAuth' : 'Website',
        Description: `Registered on Mindy Munchs website`,
      }],
      trigger: [],
    };

    const res = await axios.post(`${CRM_BASE}/Contacts`, payload, { headers });
    const contactId = res.data?.data?.[0]?.details?.id || null;
    console.log(`[Zoho CRM] Contact synced: ${contactId}`);
    return contactId;
  } catch (err) {
    console.error('[Zoho CRM] syncContact failed:', err.response?.data || err.message);
    return null;
  }
};

/**
 * Add a newsletter subscriber as a CRM Lead.
 */
exports.addLead = async ({ email, name = '' }) => {
  if (!isConfigured()) return null;

  try {
    const headers = await crmHeaders();

    const payload = {
      data: [{
        First_Name: name?.split(' ')[0] || '',
        Last_Name: name?.split(' ').slice(1).join(' ') || name || 'Subscriber',
        Email: email,
        Lead_Source: 'Newsletter',
        Lead_Status: 'Not Contacted',
        Company: 'Individual',
        Description: 'Newsletter subscriber from Mindy Munchs website',
      }],
      trigger: [],
    };

    const res = await axios.post(`${CRM_BASE}/Leads`, payload, { headers });
    const leadId = res.data?.data?.[0]?.details?.id || null;
    console.log(`[Zoho CRM] Lead added: ${leadId}`);
    return leadId;
  } catch (err) {
    console.error('[Zoho CRM] addLead failed:', err.response?.data || err.message);
    return null;
  }
};

/**
 * Log an order as a CRM Deal against a contact.
 */
exports.logOrderDeal = async (order, zohoContactId) => {
  if (!isConfigured() || !zohoContactId) return null;

  try {
    const headers = await crmHeaders();

    const payload = {
      data: [{
        Deal_Name: `Order ${order.orderNumber}`,
        Amount: order.totalAmount,
        Stage: order.orderStatus === 'delivered' ? 'Closed Won' : 'Value Proposition',
        Contact_Name: { id: zohoContactId },
        Description: order.items.map(i => `${i.name} x${i.quantity}`).join(', '),
        Lead_Source: 'Website',
        Closing_Date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0],
      }],
      trigger: [],
    };

    const res = await axios.post(`${CRM_BASE}/Deals`, payload, { headers });
    const dealId = res.data?.data?.[0]?.details?.id || null;
    console.log(`[Zoho CRM] Deal logged: ${dealId}`);
    return dealId;
  } catch (err) {
    console.error('[Zoho CRM] logOrderDeal failed:', err.response?.data || err.message);
    return null;
  }
};

// ── Books ─────────────────────────────────────────────────────────────────

/**
 * Create a GST invoice in Zoho Books for an order.
 * Returns zohoInvoiceId (string) or null.
 */
// Create or find a Zoho Books customer, returns customer_id
const searchBooksCustomer = async (orgId, headers, { email, name }) => {
  // Search by email
  if (email) {
    try {
      const res = await axios.get(
        `${BOOKS_BASE}/contacts?organization_id=${orgId}&contact_type=customer&search_text=${encodeURIComponent(email)}`,
        { headers }
      );
      const match = res.data?.contacts?.find(c => c.email === email);
      if (match?.contact_id) return match.contact_id;
    } catch (_) {}
  }
  // Search by name
  try {
    const res = await axios.get(
      `${BOOKS_BASE}/contacts?organization_id=${orgId}&contact_type=customer&search_text=${encodeURIComponent(name)}`,
      { headers }
    );
    const match = res.data?.contacts?.find(c => c.contact_name === name);
    if (match?.contact_id) return match.contact_id;
  } catch (_) {}
  return null;
};

const getOrCreateBooksCustomer = async (order, headers) => {
  const orgId = process.env.ZOHO_ORG_ID;
  const email = order.customerEmail || '';
  const name  = order.shippingAddress.name;

  // Try to find existing customer first
  const existingId = await searchBooksCustomer(orgId, headers, { email, name });
  if (existingId) return existingId;

  // Create new customer
  try {
    const res = await axios.post(
      `${BOOKS_BASE}/contacts?organization_id=${orgId}`,
      {
        contact_name: name,
        contact_type: 'customer',
        email,
        phone: (order.shippingAddress.phone || '').replace(/\D/g, '').slice(-10),
        billing_address: {
          address: (order.shippingAddress.street || '').substring(0, 99),
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          zip: order.shippingAddress.zipCode,
          country: order.shippingAddress.country || 'India',
        },
      },
      { headers }
    );
    return res.data?.contact?.contact_id || null;
  } catch (err) {
    // If duplicate name error (code 3062), search and return existing
    if (err.response?.data?.code === 3062) {
      return await searchBooksCustomer(orgId, headers, { email, name });
    }
    throw err;
  }
};

exports.createInvoice = async (order) => {
  if (!isConfigured() || !process.env.ZOHO_ORG_ID) {
    console.log('[Zoho Books] Skipped — credentials not configured');
    return null;
  }

  try {
    const headers = await booksHeaders();

    // Ensure customer exists in Zoho Books
    const customerId = await getOrCreateBooksCustomer(order, headers);
    if (!customerId) {
      console.error('[Zoho Books] Could not create/find customer');
      return null;
    }

    const payload = {
      customer_id: customerId,
      line_items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        rate: item.price,
        unit: 'pcs',
      })),
      reference_number: order.orderNumber,
      date: new Date(order.createdAt || Date.now()).toISOString().split('T')[0],
      payment_terms: 0,
      notes: `Order ${order.orderNumber} — Mindy Munchs`,
      shipping_charge: order.shippingCost || 0,
      adjustment: -(order.discount || 0),
    };

    const res = await axios.post(
      `${BOOKS_BASE}/invoices?organization_id=${process.env.ZOHO_ORG_ID}`,
      payload,
      { headers }
    );

    const invoiceId = res.data?.invoice?.invoice_id || null;
    console.log(`[Zoho Books] Invoice created: ${invoiceId}`);
    return invoiceId;
  } catch (err) {
    console.error('[Zoho Books] createInvoice failed:', err.response?.data || err.message);
    return null;
  }
};

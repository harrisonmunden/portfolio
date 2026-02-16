// Uses test key if available, falls back to live key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY);

// Server-side price validation (mirrors CartContext.jsx pricing)
const PRINT_SIZES = {
  small: 43,
  medium: 50,
  large: 81,
  xlarge: 156,
};

const SIZE_LABELS = {
  small: '8x10"',
  medium: '11x14"',
  large: '16x20"',
  xlarge: '24x36"',
};

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': process.env.SITE_URL || '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { items, customerEmail, customerName, shippingAddress } = JSON.parse(event.body);

    if (!items || !items.length) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'No items provided' }) };
    }

    // Build line items with server-validated prices
    const line_items = items.map((item) => {
      const basePrice = PRINT_SIZES[item.sizeId];

      if (!basePrice) {
        throw new Error(`Invalid size "${item.sizeId}"`);
      }

      const unitPrice = basePrice * 100; // Stripe uses cents

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            description: `Fine Art Print - ${SIZE_LABELS[item.sizeId]}`,
          },
          unit_amount: unitPrice,
        },
        quantity: item.quantity,
      };
    });

    const siteUrl = process.env.SITE_URL || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      customer_email: customerEmail,
      metadata: {
        customer_name: customerName,
        shipping_address: JSON.stringify(shippingAddress),
      },
      success_url: `${siteUrl}/#/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/#/cart`,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

// Uses live key, falls back to test key for local development
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY_TEST);

// Server-side price validation (mirrors CartContext.jsx pricing per aspect ratio)
const PRINT_SIZES_BY_ASPECT = {
  square: { small: 38, medium: 48, large: 94, xlarge: 163 },
  portrait_4x5: { small: 43, medium: 50, large: 81, xlarge: 144 },
  landscape_16x9: { small: 35, medium: 45, large: 56, xlarge: 156 },
  landscape_4x3: { small: 48, medium: 50, large: 94, xlarge: 200 },
};

const SIZE_LABELS_BY_ASPECT = {
  square: { small: '8×8"', medium: '12×12"', large: '20×20"', xlarge: '30×30"' },
  portrait_4x5: { small: '8×10"', medium: '11×14"', large: '16×20"', xlarge: '24×30"' },
  landscape_16x9: { small: '9×6"', medium: '12×8"', large: '19×13"', xlarge: '40×20"' },
  landscape_4x3: { small: '12×9"', medium: '16×12"', large: '24×18"', xlarge: '40×30"' },
};

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  process.env.SITE_URL,
  'http://localhost:5173',
  'http://localhost:4173',
].filter(Boolean);

exports.handler = async (event) => {
  const origin = event.headers?.origin || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  const headers = {
    'Access-Control-Allow-Origin': allowedOrigin,
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
    const { items, promoCode, customerEmail, customerName, shippingAddress } = JSON.parse(event.body);

    // Validate promo code server-side
    const trimmedPromo = promoCode ? promoCode.trim().toLowerCase() : '';
    const isHalfOff = trimmedPromo === 'harrisonisawesome';
    const isDollar = trimmedPromo === 'freetesty6969';
    const validPromo = isHalfOff || isDollar;

    if (!items || !items.length) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'No items provided' }) };
    }

    // Build line items with server-validated prices
    let line_items;

    if (isDollar) {
      // $1 test promo: single line item for $1 total
      const itemNames = items.map(i => i.title).join(', ');
      line_items = [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Test Order',
            description: itemNames,
          },
          unit_amount: 100, // $1.00
        },
        quantity: 1,
      }];
    } else {
      line_items = items.map((item) => {
        const aspect = item.aspectRatio || 'square';
        const prices = PRINT_SIZES_BY_ASPECT[aspect];
        const labels = SIZE_LABELS_BY_ASPECT[aspect];

        if (!prices) {
          throw new Error(`Invalid aspect ratio "${aspect}"`);
        }

        const basePrice = prices[item.sizeId];

        if (!basePrice) {
          throw new Error(`Invalid size "${item.sizeId}" for aspect "${aspect}"`);
        }

        const sizeLabel = item.sizeLabel || labels[item.sizeId] || item.sizeId;
        const discountMultiplier = isHalfOff ? 0.5 : 1;
        const unitPrice = Math.round(basePrice * discountMultiplier * 100); // Stripe uses cents

        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.title,
              description: `Fine Art Print - ${sizeLabel}`,
            },
            unit_amount: unitPrice,
          },
          quantity: item.quantity,
        };
      });
    }

    const siteUrl = process.env.SITE_URL || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      customer_email: customerEmail,
      metadata: {
        customer_name: customerName,
        shipping_address: JSON.stringify(shippingAddress),
        promo_code: validPromo ? promoCode.trim() : 'none',
        discount_applied: isDollar ? '$1 test' : isHalfOff ? '50%' : 'none',
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

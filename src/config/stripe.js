// Stripe Configuration

export const stripeConfig = {
  // Stripe publishable key (safe to expose in frontend)
  publishableKey: 'pk_live_51T0dzQL2btL49LJQWFeGE9Vn3SmeUcAGIFEZLnAbKxM4G9Xf9ciSqEmKhrIIeekEitN0z8k4YlzwmR8sgmwZhKzV00RfdzZUoY',

  // Netlify function endpoint for creating checkout sessions
  checkoutEndpoint: 'https://beamish-buttercream-8c0cb5.netlify.app/.netlify/functions/create-checkout-session',
};

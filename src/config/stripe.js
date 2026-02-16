// Stripe Configuration

export const stripeConfig = {
  // Stripe publishable key (safe to expose in frontend)
  publishableKey: 'pk_test_51T0dzQL2btL49LJQxYYZAHjGq8TcQqu5kyr7V4Oblc7TIrDauVjlAEkpztr2QE11Gx6IouOhNFqU2ZjtwuJXhojV00IdVHpn1b',

  // Netlify function endpoint for creating checkout sessions
  checkoutEndpoint: 'https://beamish-buttercream-8c0cb5.netlify.app/.netlify/functions/create-checkout-session',
};

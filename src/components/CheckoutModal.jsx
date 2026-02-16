import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { stripeConfig } from '../config/stripe';
import './CheckoutModal.css';

const CheckoutModal = ({ isOpen, onClose, items, total }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoType, setPromoType] = useState(null); // 'half' or 'dollar'
  const [promoError, setPromoError] = useState('');
  const discountedTotal = promoType === 'dollar' ? 1 : promoType === 'half' ? total * 0.5 : total;
  const promoLabel = promoType === 'dollar' ? 'Total reduced to $1.00!' : '50% discount applied!';

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCode.trim().toLowerCase();
    if (code === 'harrisonisawesome') {
      setPromoApplied(true);
      setPromoType('half');
    } else if (code === 'freetesty6969') {
      setPromoApplied(true);
      setPromoType('dollar');
    } else {
      setPromoApplied(false);
      setPromoType(null);
      setPromoError('Invalid promo code');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    const requiredFields = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      address: 'Address',
      city: 'City',
      state: 'State',
      zipCode: 'ZIP Code',
      country: 'Country',
    };

    const errors = {};
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field] || !formData[field].trim()) {
        errors[field] = `${label} is required`;
      }
    }

    // Validate email format
    if (formData.email && formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fill in all required fields.');
      // Wait for React to re-render with has-error classes, then scroll to first error
      setTimeout(() => {
        const firstErrorField = document.querySelector('.form-group.has-error input, .form-group.has-error select');
        if (firstErrorField) {
          firstErrorField.focus();
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 0);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      // Save form data to localStorage so CheckoutSuccess can send emails
      // Using localStorage instead of sessionStorage because sessionStorage
      // can be lost during external redirects (e.g. to Stripe checkout)
      localStorage.setItem('checkoutFormData', JSON.stringify(formData));
      localStorage.setItem('checkoutItems', JSON.stringify(items));
      localStorage.setItem('checkoutTotal', discountedTotal.toFixed(2));

      // Call serverless function to create Stripe Checkout session
      const response = await fetch(stripeConfig.checkoutEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            title: item.artwork.title,
            sizeId: item.size.id,
            sizeLabel: item.size.name,
            aspectRatio: item.artwork.aspectRatio || 'square',
            quantity: item.quantity,
          })),
          promoCode: promoApplied ? promoCode.trim() : null,
          customerEmail: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`,
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
            phone: formData.phone,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
      setError('There was an error connecting to payment. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="checkout-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="checkout-modal"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose}>×</button>

          <div className="checkout-content">
            <h2>Checkout</h2>

            <form onSubmit={handleSubmit} className="checkout-form" autoComplete="on" noValidate>
              <div className="form-section">
                <h3>Contact Information</h3>
                <div className="form-row">
                  <div className={`form-group${fieldErrors.firstName ? ' has-error' : ''}`}>
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      autoComplete="given-name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={`form-group${fieldErrors.lastName ? ' has-error' : ''}`}>
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      autoComplete="family-name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className={`form-group${fieldErrors.email ? ' has-error' : ''}`}>
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Shipping Address</h3>
                <div className={`form-group${fieldErrors.address ? ' has-error' : ''}`}>
                  <label htmlFor="address">Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    autoComplete="street-address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className={`form-group${fieldErrors.city ? ' has-error' : ''}`}>
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      autoComplete="address-level2"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={`form-group${fieldErrors.state ? ' has-error' : ''}`}>
                    <label htmlFor="state">State *</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      autoComplete="address-level1"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={`form-group${fieldErrors.zipCode ? ' has-error' : ''}`}>
                    <label htmlFor="zipCode">ZIP Code *</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      autoComplete="postal-code"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className={`form-group${fieldErrors.country ? ' has-error' : ''}`}>
                  <label htmlFor="country">Country *</label>
                  <select
                    id="country"
                    name="country"
                    autoComplete="country-name"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-section">
                <h3>Promo Code</h3>
                <div className="promo-code-row">
                  <input
                    type="text"
                    id="promoCode"
                    name="promoCode"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      setPromoError('');
                      if (promoApplied) { setPromoApplied(false); setPromoType(null); }
                    }}
                    className={promoApplied ? 'promo-applied' : ''}
                  />
                  <button
                    type="button"
                    className="promo-apply-btn"
                    onClick={handleApplyPromo}
                    disabled={!promoCode.trim()}
                  >
                    {promoApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {promoError && <p className="promo-error">{promoError}</p>}
                {promoApplied && <p className="promo-success">{promoLabel}</p>}
              </div>

              <div className="order-summary">
                <h3>Order Summary</h3>
                {items && items.map((item) => (
                  <div key={item.id} className="summary-item">
                    <span>{item.artwork.title} ({item.size.name}) x{item.quantity}</span>
                    <span>${item.totalPrice}</span>
                  </div>
                ))}
                {promoApplied && (
                  <>
                    <div className="summary-item summary-subtotal">
                      <span>Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="summary-item summary-discount">
                      <span>{promoType === 'dollar' ? 'Promo (Test $1)' : 'Promo Discount (50%)'}</span>
                      <span>-${(total - discountedTotal).toFixed(2)}</span>
                    </div>
                  </>
                )}
                <div className="summary-total">
                  <span>Total: ${discountedTotal.toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <div className="checkout-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Connecting to Payment...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CheckoutModal;

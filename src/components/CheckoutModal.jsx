import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { emailjsConfig } from '../config/emailjs';
import { useCart } from '../contexts/CartContext';
import './CheckoutModal.css';

const CheckoutModal = ({ isOpen, onClose, items, total }) => {
  const { clearCart } = useCart();
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
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 3).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderId = generateOrderNumber();
      setOrderNumber(orderId);

      // Create order summary
      const orderSummary = items.map(item => 
        `${item.artwork.title} (${item.size.name}, ${item.quality.name}) x${item.quantity} - $${item.totalPrice}`
      ).join('\n');

      const customerName = `${formData.firstName} ${formData.lastName}`;
      const orderDate = new Date().toLocaleString();

      // Template parameters for both emails
      const templateParams = {
        customer_name: customerName,
        customer_email: formData.email,
        order_summary: orderSummary,
        total_amount: total.toFixed(2),
        order_date: orderDate,
        order_id: orderId
      };

      // Send notification email to you (harrison@mundenstudios.com)
      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId, // Your order notification template
        templateParams,
        emailjsConfig.publicKey
      );

      // Send confirmation email to customer
      // You'll need to create a second template in EmailJS for customer confirmations
      // For now, we'll use the same template but you should create a separate one
      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.customerTemplateId || emailjsConfig.templateId, // Customer confirmation template
        {
          ...templateParams,
          // Override the recipient for customer email
          to_email: formData.email
        },
        emailjsConfig.publicKey
      );

      // Clear cart and show success
      clearCart();
      setOrderComplete(true);
      
      // Close modal after 5 seconds
      setTimeout(() => {
        onClose();
        setOrderComplete(false);
        setFormData({
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
        setOrderNumber('');
      }, 5000);

    } catch (error) {
      console.error('Error sending email:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
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
          
          {orderComplete ? (
            <motion.div 
              className="order-success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="success-icon">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  ✓
                </motion.div>
              </div>
              <h2>Order Placed Successfully!</h2>
              <div className="order-details">
                <p><strong>Order Number:</strong> {orderNumber}</p>
                <p><strong>Total:</strong> ${total.toFixed(2)}</p>
              </div>
              <div className="success-message">
                <p>Thank you for your order! We've sent a confirmation email to <strong>{formData.email}</strong></p>
                <p>We'll contact you within 24 hours to arrange payment and shipping.</p>
              </div>
              <div className="next-steps">
                <h3>What's Next?</h3>
                <ul>
                  <li>Check your email for order confirmation</li>
                  <li>We'll contact you to arrange payment</li>
                  <li>Your artwork will be prepared and shipped</li>
                </ul>
              </div>
              <div className="success-footer">
                <p>This window will close automatically in a few seconds...</p>
              </div>
            </motion.div>
          ) : (
            <div className="checkout-content">
              <h2>Checkout</h2>
              
              <form onSubmit={handleSubmit} className="checkout-form">
                <div className="form-section">
                  <h3>Contact Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
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
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Shipping Address</h3>
                  <div className="form-group">
                    <label htmlFor="address">Address *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City *</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="state">State *</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="zipCode">ZIP Code *</label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="country">Country *</label>
                    <select
                      id="country"
                      name="country"
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

                <div className="order-summary">
                  <h3>Order Summary</h3>
                  {items && items.map((item) => (
                    <div key={item.id} className="summary-item">
                      <span>{item.artwork.title} ({item.size.name}, {item.quality.name}) x{item.quantity}</span>
                      <span>${item.totalPrice}</span>
                    </div>
                  ))}
                  <div className="summary-total">
                    <span>Total: ${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CheckoutModal;

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { emailjsConfig } from '../config/emailjs';
import { useCart } from '../contexts/CartContext';
import './CheckoutSuccess.css';

const CheckoutSuccess = ({ goTo }) => {
  const { clearCart } = useCart();
  const [status, setStatus] = useState('processing');
  const [orderNumber, setOrderNumber] = useState('');
  const emailSentRef = useRef(false);

  useEffect(() => {
    if (emailSentRef.current) return;
    emailSentRef.current = true;

    const processOrder = async () => {
      try {
        // Get saved checkout data from localStorage
        // (localStorage persists through external redirects unlike sessionStorage)
        const formDataStr = localStorage.getItem('checkoutFormData');
        const itemsStr = localStorage.getItem('checkoutItems');
        const totalStr = localStorage.getItem('checkoutTotal');

        if (!formDataStr || !itemsStr) {
          setStatus('error');
          return;
        }

        const formData = JSON.parse(formDataStr);
        const items = JSON.parse(itemsStr);
        const total = totalStr || '0.00';

        // Generate order number
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substr(2, 3).toUpperCase();
        const orderId = `ORD-${timestamp}-${random}`;
        setOrderNumber(orderId);

        // Create order summary
        const orderSummary = items.map(item =>
          `${item.artwork.title} (${item.size.name}) x${item.quantity} - $${item.totalPrice}`
        ).join('\n');

        const customerName = `${formData.firstName} ${formData.lastName}`;
        const orderDate = new Date().toLocaleString();

        const templateParams = {
          customer_name: customerName,
          customer_email: formData.email,
          order_summary: orderSummary,
          total_amount: total,
          order_date: orderDate,
          order_id: orderId
        };

        // Send notification email to harrison@mundenstudios.com
        await emailjs.send(
          emailjsConfig.serviceId,
          emailjsConfig.templateId,
          templateParams,
          emailjsConfig.publicKey
        );

        // Send confirmation email to customer
        await emailjs.send(
          emailjsConfig.serviceId,
          emailjsConfig.customerTemplateId || emailjsConfig.templateId,
          {
            ...templateParams,
            to_email: formData.email
          },
          emailjsConfig.publicKey
        );

        // Clear cart and session data
        clearCart();
        localStorage.removeItem('checkoutFormData');
        localStorage.removeItem('checkoutItems');
        localStorage.removeItem('checkoutTotal');

        setStatus('success');
      } catch (error) {
        console.error('Error processing order:', error);
        // Payment was still successful even if email fails
        clearCart();
        localStorage.removeItem('checkoutFormData');
        localStorage.removeItem('checkoutItems');
        localStorage.removeItem('checkoutTotal');
        setStatus('success');
      }
    };

    processOrder();
  }, [clearCart]);

  if (status === 'processing') {
    return (
      <div className="checkout-success-page">
        <div className="success-container">
          <div className="processing-spinner"></div>
          <h2>Processing your order...</h2>
          <p>Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="checkout-success-page">
        <div className="success-container">
          <h2>Something went wrong</h2>
          <p>We couldn't find your order details. If you completed payment, please contact us and we'll sort it out.</p>
          <button
            className="success-browse-btn"
            onClick={() => goTo && goTo('prints-for-sale')}
          >
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-success-page">
      <motion.div
        className="success-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="success-checkmark"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          ✓
        </motion.div>

        <h2>Payment Successful!</h2>

        {orderNumber && (
          <div className="success-order-info">
            <p><strong>Order Number:</strong> {orderNumber}</p>
          </div>
        )}

        <div className="success-details">
          <p>Thank you for your purchase! We've sent a confirmation email with your order details.</p>
          <p>Your artwork will be prepared and shipped soon.</p>
        </div>

        <div className="success-next-steps">
          <h3>What's Next?</h3>
          <ul>
            <li>Check your email for order confirmation</li>
            <li>Your artwork will be printed and prepared</li>
            <li>We'll send tracking info once shipped</li>
          </ul>
        </div>

        <button
          className="success-browse-btn"
          onClick={() => goTo && goTo('prints-for-sale')}
        >
          Continue Browsing
        </button>
      </motion.div>
    </div>
  );
};

export default CheckoutSuccess;

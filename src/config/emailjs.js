// EmailJS Configuration for harrison@mundenstudios.com
// Setup Instructions:
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Add a new service (Gmail, Outlook, or custom SMTP)
// 3. Create TWO email templates:
//    - One for order notifications (sent to you)
//    - One for customer confirmations (sent to customers)
// 4. Get your credentials from the integration tab
// 5. Replace the placeholder values below

export const emailjsConfig = {
  serviceId: 'service_0nj5grn', // Replace with your EmailJS service ID
  templateId: 'template_y4fz9dj', // Replace with your order notification template ID
  customerTemplateId: 'template_9uey7zt', // Replace with your customer confirmation template ID
  publicKey: 'X-SwTqT-JaUdhwTy2', // Replace with your EmailJS public key
};

// Email Template Variables Available:
// {{customer_name}} - Customer's full name
// {{customer_email}} - Customer's email address
// {{order_summary}} - Complete order details
// {{total_amount}} - Total order amount
// {{order_date}} - Order date/time
// {{order_id}} - Unique order number

// Template 1: Order Notification (sent to harrison@mundenstudios.com)
/*
Subject: New Artwork Order from {{customer_name}}

Hello Harrison,

You have received a new artwork order from your portfolio store:

Customer Information:
- Name: {{customer_name}}
- Email: {{customer_email}}
- Order Date: {{order_date}}
- Order ID: {{order_id}}

Order Total: ${{total_amount}}

Order Details:
{{order_summary}}

Please contact the customer to arrange payment and shipping.

Best regards,
Your Portfolio Store
*/

// Template 2: Customer Confirmation (sent to {{customer_email}})
/*
Subject: Order Confirmed #{{order_id}}!

Hi {{customer_name}},

Thank you for your order! We've received your request and will contact you shortly to arrange payment and shipping.

Order Details:
- Order ID: {{order_id}}
- Order Date: {{order_date}}
- Total: ${{total_amount}}

Items Ordered:
{{order_summary}}

What's Next?
1. We'll review your order and contact you within 24 hours
2. We'll arrange payment and shipping details
3. Your artwork will be prepared and shipped to you

If you have any questions, feel free to reply to this email.

Thank you for choosing our artwork!
*/

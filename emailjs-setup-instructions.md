# EmailJS Setup Instructions for harrison@mundenstudios.com

## The Error
You're getting "The recipients address is empty" because the EmailJS template doesn't know where to send the email.

## Solution: Configure EmailJS Template

### Step 1: Go to EmailJS Dashboard
1. Go to https://www.emailjs.com/
2. Sign in to your account
3. Go to "Email Templates"

### Step 2: Edit Your Template
1. Find your order template
2. Click "Edit" on the template

### Step 3: Configure Recipient Address
In the template settings, you need to set the recipient address:

**Option A: Fixed Recipient (Recommended)**
- In the template editor, look for "To Email" field
- Set it to: `harrison@mundenstudios.com`
- This will send all orders to your email

**Option B: Dynamic Recipient (Advanced)**
- If you want to send confirmation emails to customers too
- Use: `{{customer_email}}` for customer emails
- Use: `harrison@mundenstudios.com` for your notifications

### Step 4: Template Content
Use this template content:

**Subject:** `New Artwork Order from {{customer_name}}`

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Artwork Order</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .order-info { background: #f8f8f8; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .total { background: #1a1a1a; color: white; padding: 15px; text-align: center; border-radius: 5px; }
        .footer { background: #f8f8f8; padding: 15px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>New Order</h1>
    </div>
    
    <div class="content">
        <div class="order-info">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> {{customer_name}}</p>
            <p><strong>Email:</strong> {{customer_email}}</p>
            <p><strong>Date:</strong> {{order_date}}</p>
        </div>
        
        <div class="total">
            <h3>Order Total: ${{total_amount}}</h3>
        </div>
        
        <div class="order-info">
            <h3>Order Details</h3>
            <pre>{{order_summary}}</pre>
        </div>
    </div>
    
    <div class="footer">
        <p>Portfolio Store Order Notification</p>
    </div>
</body>
</html>
```

### Step 5: Save and Test
1. Save the template
2. Test the checkout process
3. Check your email at harrison@mundenstudios.com

## Alternative: Quick Fix
If you want a quick fix, you can also:
1. Go to your EmailJS service settings
2. Make sure the service is connected to harrison@mundenstudios.com
3. The template should automatically use the service's default recipient

## Troubleshooting
- Make sure your EmailJS service is properly connected to your email
- Verify the template ID matches what's in your config file
- Check that all required template variables are being sent

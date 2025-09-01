# EXACT STEPS TO FIX "The recipients address is empty" ERROR

## Step 1: Go to EmailJS Dashboard
1. Open your browser
2. Go to: https://www.emailjs.com/
3. Click "Sign In" (top right)
4. Enter your EmailJS account credentials

## Step 2: Navigate to Templates
1. Once logged in, you'll see the EmailJS dashboard
2. In the left sidebar, click "Email Templates"
3. You should see your template listed (probably named something like "Order Template" or "Portfolio Order")

## Step 3: Edit the Template
1. Find your order template in the list
2. Click the "Edit" button (pencil icon) next to your template
3. This opens the template editor

## Step 4: Set the Recipient Address
In the template editor, look for these fields:

**FIND THIS SECTION:**
- Look for "To Email" or "Recipient Email" field
- It might be labeled as "To:", "Recipient:", or "Send to:"

**ENTER THIS:**
```
harrison@mundenstudios.com
```

**IMPORTANT:** Make sure there are no spaces before or after the email address.

## Step 5: Alternative Method (if no "To Email" field)
If you don't see a "To Email" field:

1. Go back to the main dashboard
2. Click "Email Services" in the left sidebar
3. Click on your email service (Gmail, Outlook, etc.)
4. Make sure it shows: "Connected to: harrison@mundenstudios.com"
5. If it's not connected to the right email, disconnect and reconnect it

## Step 6: Save and Test
1. Click "Save" in the template editor
2. Go back to your website
3. Try the checkout process again
4. Check your email at harrison@mundenstudios.com

## Step 7: If Still Not Working
If you're still getting the error:

1. Go to "Email Services" in EmailJS
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Connect it specifically to harrison@mundenstudios.com
5. Go back to your template and make sure it's using the correct service

## Visual Guide:
- Template Editor should look like this:
  ```
  Template Name: [Your Template Name]
  Subject: New Artwork Order from {{customer_name}}
  To Email: harrison@mundenstudios.com  ← THIS IS THE KEY FIELD
  From Name: [Your Name]
  Reply To: {{customer_email}}
  ```

## Common Mistakes:
- ❌ Leaving "To Email" field empty
- ❌ Using a variable like {{customer_email}} in "To Email" field
- ❌ Having spaces in the email address
- ❌ Using the wrong email service

## What Should Happen:
- ✅ "To Email" field contains: harrison@mundenstudios.com
- ✅ Template is saved successfully
- ✅ Checkout process sends email to your address
- ✅ You receive order notifications at harrison@mundenstudios.com

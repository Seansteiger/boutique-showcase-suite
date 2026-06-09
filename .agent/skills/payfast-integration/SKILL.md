---
name: payfast-integration
description: Comprehensive guide and utilities for integrating PayFast payment gateway in South African web applications.
---

# PayFast Integration Skill

This skill provides the necessary guidance and code snippets to integrate PayFast into your application, focusing on security, South African tax compliance (VAT), and robust transaction handling.

## Core Concepts

1. **Merchant IDs**: You need a `Merchant ID` and `Merchant Key` from the PayFast dashboard.
2. **Security Passphrase**: ALWAYS set a Salt/Passphrase in your PayFast settings and include it in your signature generation.
3. **ITN (Instant Transaction Notification)**: PayFast sends a POST request to your server to confirm payment status even if the user closes their browser.

## Step-by-Step Integration

### 1. Payment Initiation (Frontend)
Prepare a form or a fetch request with the following required fields:
- `merchant_id`
- `merchant_key`
- `amount`
- `item_name`
- `return_url`: Where user goes after success.
- `cancel_url`: Where user goes after cancel.
- `notify_url`: Your backend ITN endpoint.

### 2. Signature Generation
All requests to PayFast should be signed using an MD5 hash of the parameters plus your passphrase.

```typescript
// Example Logic (Node.js/Typescript)
import crypto from 'crypto';

function generateSignature(data: any, passphrase?: string): string {
  let queryString = "";
  Object.keys(data).forEach((key) => {
    if (data[key] !== "" && key !== 'signature') {
      queryString += `${key}=${encodeURIComponent(data[key].toString().trim()).replace(/%20/g, "+")}&`;
    }
  });

  if (passphrase) {
    queryString += `passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, "+")}`;
  } else {
    queryString = queryString.substring(0, queryString.length - 1);
  }

  return crypto.createHash('md5').update(queryString).digest('hex');
}
```

### 3. ITN Handler (Backend)
Your `notify_url` must:
1. Verify the signature of the incoming POST data.
2. Verify the `data_amount` matches your record.
3. Check `payment_status` (look for `COMPLETE`).
4. IP Check (Optional but recommended): Ensure request came from PayFast IPs.

## Testing with Sandbox
Use the PayFast Sandbox environment for testing:
- Use `https://sandbox.payfast.co.za/eng/process`
- Use the sandbox credentials provided in your PayFast developer account.

## Best Practices
- **Atomic Transactions**: Update your database (e.g., Supabase) inside a transaction or via a secure RPC call when ITN is received.
- **Audit Logs**: Store the raw ITN data for debugging and audit purposes.
- **VAT Handling**: Ensure `amount` includes VAT if applicable in your business model.

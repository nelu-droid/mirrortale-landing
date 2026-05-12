# MirrorTale Backend Contract

The landing page stays static on Firebase Hosting. It only calls public Cloud Run HTTPS endpoints and never receives AI, Stripe, Firebase Admin, or service-account secrets.

## Runtime Configuration

Set the API base URL in `index.html` once the Cloud Run API is deployed:

```html
<meta name="mirrortale-api-base-url" content="https://api.mirrortale.com" />
```

For local experiments, the same value can be supplied before `script.js`:

```html
<script>
  window.MirrorTaleConfig = { apiBaseUrl: "http://localhost:8080" };
</script>
```

If no API base URL is configured, both forms keep the current mock behavior.

## `POST /orders`

Creates a digital-only order, stores the child photo securely, creates a Stripe Checkout session, and returns the checkout URL.

Request:

- Content type: `multipart/form-data`
- Fields: `parent-name`, `email`, `child-name`, `gender`, `age`, `theme`, `interests`, `dedication`, `package=digital`, `photo-consent=accepted`
- File: `child-photo`

Successful response:

```json
{
  "orderId": "ord_123",
  "status": "checkout_started",
  "checkoutUrl": "https://checkout.stripe.com/..."
}
```

Errors should use:

```json
{
  "error": {
    "message": "Please upload a JPG or PNG under 10 MB."
  }
}
```

## `POST /contact`

Stores a pre-order question and sends an owner notification through Resend when configured.

Request:

```json
{
  "name": "Parent name",
  "email": "parent@example.com",
  "message": "Question text",
  "source": {
    "page": "https://mirrortale.com/",
    "referrer": null
  }
}
```

Successful response:

```json
{
  "status": "received"
}
```

## `POST /stripe/webhook`

Accepts Stripe webhook events only. The backend verifies the `Stripe-Signature` header against `STRIPE_WEBHOOK_SECRET`, marks completed checkout sessions as `paid`, and records email delivery state after sending confirmation/owner notifications.

Successful response:

```json
{
  "received": true
}
```

## CORS

Allow these origins in Cloud Run:

- `https://mirrortale.com`
- `https://www.mirrortale.com`
- Firebase preview channels as needed
- `http://localhost:8000` for local landing-page tests

Do not allow wildcard origins on payment or upload endpoints once production traffic starts.

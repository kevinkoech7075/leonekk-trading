# Leonekk Deriv OAuth starter

Netlify-ready Next.js starter for Deriv OAuth 2.0 + PKCE.

## Environment
Set:
- DERIV_CLIENT_ID
- DERIV_REDIRECT_URI=https://leonekk.netlify.app/callback
- SESSION_SECRET (reserved for the production session layer)

## Important
The callback stores the short-lived OAuth access token in an HttpOnly cookie for this starter. For production, replace this with encrypted server-side session storage/database before enabling any real-money trading.

The application requests only the `trade` OAuth scope.

# Frontend wiring (corrected)

There's no `SsoLogin.js` page anymore — with RajSSO, the "Login with SSO" button doesn't
point at a URL your code builds. It points at whatever **Sign-In URL SSO Team gives you**
(this doc excerpt doesn't include that URL). Once you have it from sir, just hardcode/env it:

```js
// frontend/src/pages/LandingPage.js
function startForm() {
  window.location.href = process.env.REACT_APP_SSO_SIGNIN_URL;
}
```

## Update `frontend/src/App.js`
Add imports:
```js
import SsoSuccess from "./pages/SsoSuccess";
import SsoFailed from "./pages/SsoFailed";
```

Add routes inside `<Routes>`:
```jsx
<Route path="/sso/success" element={<SsoSuccess />} />
<Route path="/sso/failed" element={<SsoFailed />} />
```

## Add to `frontend/.env` (once sir gives you the sign-in URL)
```
REACT_APP_SSO_SIGNIN_URL=<sir wala sign-in URL>
```

## What to send "sir" today
Your **landing page URL** (this is where RajSSO POSTs the token back to):
```
http://localhost:5000/api/auth/sso/landing
```
Plus your app icon if you have one (max 100×100px), per doc section 1.4.2.

Ask him for:
1. `WSUSERNAME` / `WSPASSWORD`
2. The Sign-In URL to send users to

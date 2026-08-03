# Testing the G2G/SSO branching locally (no real RajSSO needed)

You don't have `WSUSERNAME`/`WSPASSWORD` yet, so you can't hit
`ssotest.rajasthan.gov.in` for real. Use the mock server instead — it fakes
just enough of RajSSO's API for `ssoLanding()` to run through its full logic.

## 1. Start the mock SSO server
```
cd backend
node mockSso.js
```
Leave this running in its own terminal (default port 4000).

## 2. Point your real backend at the mock
In `backend/.env`, temporarily change:
```
SSO_BASE_URL=http://localhost:4000
```
(Leave `WSUSERNAME`/`WSPASSWORD` blank — the mock doesn't check the
Authorization header at all.)

Then start the real server as usual:
```
node server.js
```

## 3. Seed the database for each scenario
Run these against your `bsdc_hosting` DB (adjust table/column names if yours
differ). Each block sets up one branch of the flowchart.

```sql
-- Scenario A: approved + active  -> should land on /sso/success
INSERT INTO users (sso_id, designation, email, status, is_approved)
VALUES ('SSO-ACTIVE-01', 'PROGRAMMER', 'active01@example.gov.in', 'active', true);

-- Scenario B: approved but inactive, NO pending request -> /sso/mapping
INSERT INTO users (sso_id, designation, email, status, is_approved)
VALUES ('SSO-INACTIVE-NOPEND', 'PROGRAMMER', 'inact01@example.gov.in', 'inactive', true);

-- Scenario C: approved but inactive, WITH a pending request -> /sso/pending
INSERT INTO users (sso_id, designation, email, status, is_approved)
VALUES ('SSO-INACTIVE-PEND', 'PROGRAMMER', 'inact02@example.gov.in', 'inactive', true);
-- grab the user_id you just inserted, then:
INSERT INTO org (user_id, name) VALUES (<that_user_id>, 'Test Dept');
INSERT INTO apps (org_id, user_id, name) VALUES (<that_org_id>, <that_user_id>, 'Test App');

-- Scenario D: not approved, WITH a pending request -> /sso/pending
INSERT INTO users (sso_id, designation, email, status, is_approved)
VALUES ('SSO-NOTAPPROVED-PEND', 'PROGRAMMER', 'napp01@example.gov.in', 'active', false);
-- then insert org + apps rows for that user_id, same as Scenario C

-- Scenario E: not approved, no pending request -> /sso/mapping
INSERT INTO users (sso_id, designation, email, status, is_approved)
VALUES ('SSO-NOTAPPROVED-NOPEND', 'PROGRAMMER', 'napp02@example.gov.in', 'active', false);

-- Scenario F: brand new SSOID (don't insert anything!) -> /sso/mapping
--   just use a fresh ssoId like SSO-BRANDNEW-01 that has no row at all

-- Scenario G: DOITC/OIC role -> /sso/success, bypasses everything
--   no DB seeding needed, the role check happens before the DB lookup
```

## 4. Generate a token and hit the landing endpoint
```
cd backend
node make-token.js SSO-ACTIVE-01
# copy the printed token, then:
curl -i -X POST http://localhost:5000/api/auth/sso/landing \
  --data-urlencode "userdetails=<paste token here>"
```
Watch the `Location` header in the response — that's which page it decided
to redirect to. Repeat for each `sso_id` above:

| Command | Expected `Location` |
|---|---|
| `node make-token.js SSO-ACTIVE-01` | `/sso/success?ssoId=SSO-ACTIVE-01` |
| `node make-token.js SSO-INACTIVE-NOPEND` | `/sso/mapping?ssoId=SSO-INACTIVE-NOPEND` |
| `node make-token.js SSO-INACTIVE-PEND` | `/sso/pending?ssoId=SSO-INACTIVE-PEND` |
| `node make-token.js SSO-NOTAPPROVED-PEND` | `/sso/pending?ssoId=SSO-NOTAPPROVED-PEND` |
| `node make-token.js SSO-NOTAPPROVED-NOPEND` | `/sso/mapping?ssoId=SSO-NOTAPPROVED-NOPEND` |
| `node make-token.js SSO-BRANDNEW-01` | `/sso/mapping?ssoId=SSO-BRANDNEW-01` |
| `node make-token.js SSO-DOITC-01 DOITC` | `/sso/success?ssoId=SSO-DOITC-01` (only if `DOITC_OIC_ROLES` in `.env` includes `DOITC`) |

For the DOITC one, the 3rd arg to `make-token.js` is the role — it becomes
`designation` in the mock's `Profile` response (API-2), which is what
`isDoitcOrOic()` now checks against `DOITC_OIC_ROLES` (the role check moved
off API-1's `Roles`/`UserType` onto API-2's `designation`/`department`).

## 5. Curl one-liners (copy/paste, no manual token step)
```
TOKEN=$(node make-token.js SSO-ACTIVE-01)
curl -i -X POST http://localhost:5000/api/auth/sso/landing --data-urlencode "userdetails=$TOKEN"
```

## 6. When you're done testing
Switch `SSO_BASE_URL` back to the real one in `.env`:
```
SSO_BASE_URL=https://ssotest.rajasthan.gov.in:4443
```
`mockSso.js` and `make-token.js` are dev-only — don't deploy them, and don't
commit real SSO credentials into either file (there aren't any needed here,
but keep the habit).

## Caveat
This mock server proves the **branching logic in your code** is correct. It
does NOT prove real RajSSO will send data in the exact shape you expect —
once you have `WSUSERNAME`/`WSPASSWORD`, do at least one real end-to-end
login against `ssotest.rajasthan.gov.in` and compare the actual
`TokenDetail`/`Profile` response shape to what `mockSso.js` fakes (field
names like `sAMAccountName`, `Roles`, `mailOfficial` are from the doc excerpt
you shared — worth double-checking against a live response before you trust
this in production).

# NoorStream — Security & Access

**Version:** 1.0
**Last updated:** 2026-06-20
**Owner:** Engineering / Security

---

## 1. Purpose

Define authentication, authorization, content entitlement, parental controls, and
data-protection requirements for NoorStream. Because a core promise is **family
safety**, access control (especially Kids Mode + parental PIN) is treated as a
first-class security concern, not just a UX feature.

---

## 2. Authentication

### 2.1 Methods
- **Email + password** with strong hashing (Argon2id / bcrypt, per-user salt).
- **OAuth / social login** (Google, Apple) as alternative sign-in.
- Optional **email verification** on signup; **password reset** via signed,
  expiring, single-use token.

### 2.2 Sessions
- Stateless **JWT access tokens** (short-lived, ~15 min) + **refresh tokens**
  (rotating, longer-lived, stored httpOnly + Secure + SameSite cookie).
- Refresh-token rotation with reuse detection (revoke family on replay).
- Logout invalidates the refresh token server-side.

### 2.3 Password & Account Policy
- Minimum length + breached-password check (reject known-compromised passwords).
- Rate limiting + exponential backoff + lockout on repeated failed logins.
- Optional 2FA (TOTP) for account owners (post-MVP).

---

## 3. Authorization & Roles

| Role | Capabilities |
|---|---|
| **Guest** | Browse limited free catalog, marketing pages, sign up. |
| **Free user** | Limited catalog, SD, ad-supported, profiles. |
| **Premium user** | Full catalog, HD, no ads, all features. |
| **Profile (Kids)** | Restricted to Kids-tier catalog only; locked UI. |
| **Admin / Curator** | Internal: manage catalog, suitability metadata, ratings. |
| **Scholar reviewer** | Internal: approve/flag content review status. |

Authorization is enforced **server-side** on every protected endpoint.
Client-side checks are UX-only and never trusted for entitlement.

---

## 4. Content Entitlement (anti-piracy)

- Playback URLs are **signed, short-lived** and issued only after server verifies:
  (a) valid session, (b) subscription tier covers the title, (c) audience tier is
  allowed for the active profile (e.g., Kids profile cannot fetch General titles).
- HLS segments served from CDN with token/signature validation.
- Premium/licensed content can be gated behind **DRM** (post-MVP).
- No direct, permanent, or guessable media URLs are ever exposed to the client.

---

## 5. Parental Controls & Kids Mode (safety-critical)

- **Kids Mode** loads a separate, restricted catalog view (Kids audience tier only)
  with search of the general catalog disabled.
- **Exit / switch out of Kids profile requires a 4-digit parental PIN.** The PIN is
  set by the account owner, stored **hashed** (never plaintext), and verified
  server-side.
- Maturity ceiling per profile (Kids / Family / Teens / General) enforced in both
  catalog responses and playback entitlement.
- PIN attempts are rate-limited; repeated failures temporarily lock PIN entry.

> **Defense in depth:** the kids restriction is enforced at three layers — UI
> (hide), catalog API (filter by allowed tier), and playback entitlement (deny
> signed URL for disallowed tiers). The UI layer alone is never sufficient.

---

## 6. Web Application Security

- **Transport:** HTTPS/TLS everywhere; HSTS enabled.
- **Headers:** Content-Security-Policy (restrict script/style/media origins),
  X-Content-Type-Options, X-Frame-Options/`frame-ancestors`, Referrer-Policy.
- **XSS:** React escapes by default; never use `dangerouslySetInnerHTML` with
  untrusted data; sanitize any rich text. CSP as backstop.
- **CSRF:** SameSite cookies + anti-CSRF token for cookie-authenticated mutations.
- **Injection:** parameterized queries / ORM; validate & whitelist all inputs.
- **Rate limiting** on auth, search, AI, and playback endpoints.
- **Secrets:** never in the client bundle or repo; all LLM/payment keys server-side
  only, loaded from a secrets manager / environment.
- **Dependencies:** automated vulnerability scanning (e.g., npm audit / Dependabot)
  in CI; lockfile committed.

---

## 7. AI-Specific Safety

- **Catalog scoping:** "Ask NoorStream" / recommendations may only return IDs that
  exist in the curated catalog. The model cannot surface external or non-curated
  content — this preserves the halal-trust guarantee.
- **Prompt-injection resistance:** user queries are treated as untrusted data, not
  instructions; system prompts and tool scopes are fixed server-side.
- **No PII to model beyond what is needed**; LLM calls happen server-side only.

---

## 8. Data Protection & Privacy

- **Minimization:** collect only what's needed; kids' profiles collect minimal data
  (COPPA-aware handling; no behavioral ad targeting for kids).
- **Encryption:** TLS in transit; encryption at rest for databases & object storage.
- **PII handling:** passwords/PINs hashed; payment data handled by a PCI-compliant
  provider (we store only tokens/customer IDs, never raw card data).
- **User rights:** account export & deletion ("right to be forgotten"); clear
  privacy policy; cookie/consent management.
- **Logging:** never log secrets, tokens, passwords, or PINs; scrub PII from logs.
- **Retention:** defined retention windows for watch history & logs.

---

## 9. Threat Model (summary)

| Threat | Mitigation |
|---|---|
| Credential stuffing | Rate limiting, lockout, breached-password checks, 2FA option. |
| Token theft | Short-lived JWT, httpOnly refresh cookie, rotation + reuse detection. |
| Content piracy / hotlinking | Signed short-lived URLs, entitlement checks, DRM (later). |
| Kids bypass to adult content | 3-layer enforcement (UI/catalog/playback) + hashed PIN. |
| XSS / CSRF | React escaping, CSP, SameSite + CSRF tokens. |
| Prompt injection | Untrusted-input handling, fixed system scope, catalog-only output. |
| Secret leakage | Server-only secrets, no keys in client, scanning in CI. |

---

## 10. Compliance & Governance
- Privacy regulations (GDPR-style data rights; COPPA-aware for kids).
- PCI DSS via payment provider (no raw card data on our systems).
- WCAG 2.1 AA accessibility (also an inclusion/access requirement).
- Documented content-governance process for suitability ratings & scholar review.

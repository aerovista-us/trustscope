# TrustScope — Build Status

Updated: 2026-08-22

## Status

**ACTIVE BUILD · MVP SLICE 1 IN SOURCE**

## Working now

- Next.js 16 / React 19 / TypeScript foundation
- AeroVista Local branding
- Dedicated TrustScope logo + favicon/app icon
- 1200×630 dynamic OpenGraph/social preview image
- Message / URL / email input modes
- Browser-local deterministic analysis
- No pasted content sent to Umami
- Explainable risk signals with severity
- `HIGH RISK`, `CAUTION`, `LOW OBVIOUS RISK`, `NEEDS MORE CONTEXT`
- Urgency / threat / secrecy detection
- Credential and verification-code detection
- Payment-pressure detection
- Remote-access request detection
- Impersonation-language detection
- Prize/refund/overpayment signal detection
- URL structure checks
- Conservative low-risk wording: no “safe” guarantee
- Share-result flow that does not include submitted content
- Separate Umami-ready environment contract

## Privacy rule

Never include raw user submissions, full URLs, email addresses, phone numbers, message text, credentials, or extracted sensitive strings in analytics payloads.

## Next slice

**Live verification layer**

1. URL redirect-chain and final-host inspection.
2. Domain registration/age signals from a durable source.
3. Reputation / blocklist adapters with source timestamps.
4. Known-brand look-alike domain comparison.
5. Sender-domain / mail-authentication inputs where available.
6. Official-contact lookup so users can verify independently.
7. Source-aware degraded states: unavailable checks remain unknown, never safe.

## Launch blockers

- Vercel project / production deployment
- Custom domain `trustscope.aerovista.us`
- Dedicated Umami website ID
- Mobile QA
- Meta Sharing Debugger verification
- Production compile/build pass

## Product rule

TrustScope can identify suspicious signals and help a user verify independently. It must never certify legitimacy based only on an absence of detected red flags.

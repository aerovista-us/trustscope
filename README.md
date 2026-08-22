# TrustScope

**Does this look legit?**

TrustScope is an AeroVista Local utility that checks suspicious messages, links, and emails for visible scam and phishing signals before a user clicks, pays, signs in, or replies.

## MVP principles

- Privacy-first: pasted content stays in the browser in v1.
- Explainable: every warning is tied to a concrete visible signal.
- Conservative: absence of red flags is never presented as proof of legitimacy.
- Source-ready: live reputation and verification layers can be added later without changing the core result contract.

## Current checks

- Artificial urgency and threat pressure
- Sensitive credential / verification-code requests
- Gift-card, crypto, wire, and other payment-pressure language
- Remote-access / screen-sharing requests
- Authority and brand impersonation language
- Secrecy / isolation pressure
- Prize, refund, and overpayment setups
- Structural URL checks: raw IPs, punycode, shorteners, deep subdomains, malformed URLs, and caution TLDs

## Stack

- Next.js 16.3.2
- React 19.2.8
- TypeScript
- No database required for MVP

## Environment

Copy `.env.example` and set a dedicated Umami website ID before launch.

Proposed public domain: `trustscope.aerovista.us`

## Safety boundary

TrustScope is a triage and verification aid. It does not certify that a sender, offer, file, account, or website is safe. Live reputation, malware inspection, sender authentication, WHOIS/registration data, and official-contact verification are future layers.

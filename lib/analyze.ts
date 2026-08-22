export type InputKind = "message" | "url" | "email";
export type RiskBand = "HIGH RISK" | "CAUTION" | "LOW OBVIOUS RISK" | "NEEDS MORE CONTEXT";
export type Severity = "high" | "medium" | "low";

export type TrustSignal = {
  id: string;
  title: string;
  detail: string;
  severity: Severity;
  weight: number;
};

export type TrustResult = {
  band: RiskBand;
  score: number;
  signals: TrustSignal[];
  summary: string;
  nextSteps: string[];
  urlHosts: string[];
};

const signal = (id: string, title: string, detail: string, severity: Severity, weight: number): TrustSignal => ({ id, title, detail, severity, weight });

const patterns = {
  urgency: /\b(urgent|immediately|act now|right away|final notice|within \d+ hours?|today only|account (?:will be |is )?(?:closed|locked|suspended)|package (?:is )?held|avoid arrest|warrant)\b/i,
  credentials: /\b(password|passcode|verification code|security code|one[- ]time code|otp|2fa|seed phrase|recovery phrase|social security number|ssn|bank account|routing number)\b/i,
  payment: /\b(gift cards?|bitcoin|crypto(?:currency)?|wire transfer|western union|moneygram|zelle|cash ?app|venmo|payment outside|friends and family)\b/i,
  remoteAccess: /\b(anydesk|teamviewer|remote desktop|screen share|remote access|quick assist)\b/i,
  impersonation: /\b(irs|internal revenue service|fbi|police department|sheriff|social security administration|microsoft support|apple support|amazon support|fraud department|bank security|usps|ups|fedex)\b/i,
  secrecy: /\b(do not tell|keep this confidential|don't tell|secret transaction|stay on the line|do not hang up)\b/i,
  prize: /\b(you(?:'ve| have) won|winner|prize|lottery|sweepstakes|claim your reward)\b/i,
  refund: /\b(refund|overpayment|accidental payment|sent you too much|reimburse)\b/i,
  threat: /\b(arrest|lawsuit|legal action|deported|utilities? shut off|service terminated)\b/i
};

const shorteners = new Set(["bit.ly", "tinyurl.com", "t.co", "is.gd", "rebrand.ly", "cutt.ly", "tiny.cc"]);
const cautionTlds = new Set(["zip", "mov", "top", "xyz", "click", "quest", "country", "gq", "tk"]);

function extractUrls(text: string) {
  const matches = text.match(/https?:\/\/[^\s<>"']+/gi) || [];
  return matches.map((raw) => raw.replace(/[),.;!?]+$/, ""));
}

function hostSignals(rawUrl: string): TrustSignal[] {
  const found: TrustSignal[] = [];
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.toLowerCase();
    if (host.startsWith("xn--")) found.push(signal("punycode", "Encoded hostname", "The link uses an internationalized/punycode hostname. That can be legitimate, but it is also used for look-alike domains.", "high", 30));
    if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) found.push(signal("ip-host", "Raw IP address link", "The link uses a numeric IP address instead of a recognizable domain name.", "high", 28));
    if (shorteners.has(host)) found.push(signal("shortener", "Destination is hidden", "This is a shortened link, so the final destination is not visible from the message alone.", "medium", 16));
    const labels = host.split(".");
    if (labels.length >= 5) found.push(signal("deep-subdomain", "Unusually deep hostname", "The link has many subdomain levels, which can make a misleading brand name look more convincing.", "medium", 14));
    const tld = labels.at(-1) || "";
    if (cautionTlds.has(tld)) found.push(signal("caution-tld", "Higher-caution top-level domain", `The .${tld} domain ending deserves extra scrutiny. The ending alone does not prove fraud.`, "low", 9));
    if (url.username || url.password) found.push(signal("url-credentials", "Credentials embedded in URL", "The link contains a username/password section before the hostname, a pattern that can obscure the real destination.", "high", 30));
  } catch {
    found.push(signal("invalid-url", "Malformed URL", "The supplied link could not be parsed as a normal web address.", "medium", 15));
  }
  return found;
}

export function analyzeTrust(raw: string, kind: InputKind): TrustResult {
  const text = raw.trim();
  if (!text) {
    return {
      band: "NEEDS MORE CONTEXT",
      score: 0,
      signals: [],
      summary: "Paste a message, URL, or email content to inspect the visible signals.",
      nextSteps: ["Add the content you want to review."],
      urlHosts: []
    };
  }

  const signals: TrustSignal[] = [];
  if (patterns.urgency.test(text)) signals.push(signal("urgency", "Artificial urgency", "The wording pressures you to act quickly instead of giving you time to verify independently.", "medium", 16));
  if (patterns.credentials.test(text)) signals.push(signal("credentials", "Sensitive information request", "The content asks for credentials, verification codes, recovery secrets, or financial identifiers.", "high", 32));
  if (patterns.payment.test(text)) signals.push(signal("payment", "High-friction payment method", "The content mentions payment methods that are frequently difficult to reverse or commonly abused in scams.", "high", 28));
  if (patterns.remoteAccess.test(text)) signals.push(signal("remote-access", "Remote access request", "The content asks you to install or use remote-control/screen-sharing software.", "high", 34));
  if (patterns.impersonation.test(text)) signals.push(signal("authority", "Authority or brand impersonation language", "The sender invokes a government agency, carrier, financial institution, or major support brand. Verify through a separately obtained official channel.", "medium", 14));
  if (patterns.secrecy.test(text)) signals.push(signal("secrecy", "Secrecy or isolation pressure", "The message discourages you from checking with another person or ending the conversation.", "high", 30));
  if (patterns.prize.test(text)) signals.push(signal("prize", "Unexpected prize or reward", "Unexpected winnings or rewards are a common pretext for collecting money or personal information.", "medium", 16));
  if (patterns.refund.test(text)) signals.push(signal("refund", "Refund or overpayment setup", "Refund and accidental-payment stories are common in account takeover and payment reversal scams.", "medium", 15));
  if (patterns.threat.test(text)) signals.push(signal("threat", "Threat or consequence pressure", "The content threatens legal, financial, utility, or immigration consequences to force fast action.", "high", 28));

  const urls = kind === "url" && !/^https?:\/\//i.test(text) ? [`https://${text}`] : extractUrls(text);
  const urlHosts: string[] = [];
  for (const rawUrl of urls) {
    try { urlHosts.push(new URL(rawUrl).hostname); } catch { /* malformed is reported below */ }
    signals.push(...hostSignals(rawUrl));
  }

  if (kind === "email") {
    const emailMatches = text.match(/[A-Z0-9._%+-]+@([A-Z0-9.-]+\.[A-Z]{2,})/gi) || [];
    if (emailMatches.length === 0) signals.push(signal("email-context", "No sender address detected", "No obvious sender email address was found in the pasted content, so domain-level inspection is limited.", "low", 4));
  }

  const uniqueSignals = Array.from(new Map(signals.map((item) => [item.id, item])).values());
  let score = uniqueSignals.reduce((total, item) => total + item.weight, 0);
  const highCount = uniqueSignals.filter((item) => item.severity === "high").length;
  const mediumCount = uniqueSignals.filter((item) => item.severity === "medium").length;
  if (highCount >= 2) score += 12;
  if (highCount >= 1 && mediumCount >= 2) score += 8;
  score = Math.min(100, score);

  let band: RiskBand = "LOW OBVIOUS RISK";
  if (score >= 65) band = "HIGH RISK";
  else if (score >= 28) band = "CAUTION";

  const summary = band === "HIGH RISK"
    ? "Multiple strong scam indicators are present. Do not use contact information, links, or payment instructions from the message until you verify independently."
    : band === "CAUTION"
      ? "There are warning signals worth verifying before you click, pay, sign in, or reply."
      : "No strong red flags were detected in the visible text. That does not prove the sender, link, or offer is legitimate.";

  const nextSteps = band === "HIGH RISK"
    ? ["Stop the interaction before sending money, codes, passwords, or personal information.", "Verify the organization using a phone number, app, or website you locate independently.", "Do not install remote-access software or follow payment instructions from the message."]
    : band === "CAUTION"
      ? ["Verify the sender through an independently located official channel.", "Inspect the real domain before signing in or paying.", "Slow down if the message is creating urgency or threatening consequences."]
      : ["Confirm the sender and destination independently before sensitive actions.", "Use the official app/site instead of a message link when possible.", "Treat any later request for codes, credentials, remote access, or irreversible payment as a new warning signal."];

  return { band, score, signals: uniqueSignals.sort((a, b) => b.weight - a.weight), summary, nextSteps, urlHosts };
}

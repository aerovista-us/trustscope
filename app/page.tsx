"use client";

import { useEffect, useState } from "react";
import { analyzeTrust, InputKind, TrustResult } from "@/lib/analyze";
import { trackEvent } from "@/lib/analytics";

const examples = {
  message: "URGENT: Your account will be suspended today. Send the verification code we just texted you to confirm your identity.",
  url: "http://198.51.100.14/login",
  email: "Security Team <alerts@example.com>\nFinal notice: verify your account immediately or access will be suspended."
};

export default function Home() {
  const [kind, setKind] = useState<InputKind>("message");
  const [text, setText] = useState("");
  const [result, setResult] = useState<TrustResult | null>(null);

  useEffect(() => { trackEvent("journey_start", { surface: "checker" }); }, []);

  const run = () => {
    const next = analyzeTrust(text, kind);
    setResult(next);
    trackEvent("analysis_run", { input_type: kind, risk_band: next.band, signal_count: next.signals.length, score_band: next.score >= 65 ? "65_plus" : next.score >= 28 ? "28_64" : "under_28" });
    requestAnimationFrame(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const loadExample = () => {
    setText(examples[kind]);
    setResult(null);
    trackEvent("example_load", { input_type: kind });
  };

  const share = async () => {
    if (!result) return;
    const shareText = `TrustScope result: ${result.band} with ${result.signals.length} visible warning signal${result.signals.length === 1 ? "" : "s"}. TrustScope does not guarantee legitimacy.`;
    trackEvent("share_result", { risk_band: result.band, signal_count: result.signals.length });
    if (navigator.share) {
      try { await navigator.share({ title: "TrustScope", text: shareText, url: window.location.origin }); return; } catch { return; }
    }
    await navigator.clipboard.writeText(`${shareText} ${window.location.origin}`);
    alert("TrustScope result copied.");
  };

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand-lockup">
          <img src="/trustscope-logo.svg" alt="" className="brand-logo" />
          <div><strong>TrustScope</strong><span>Does this look legit?</span></div>
        </div>
        <a className="ghost-button" href="#how-it-works">How it works</a>
      </header>

      <section className="hero">
        <p className="eyebrow">AEROVISTA LOCAL · TRUST SIGNAL CHECK</p>
        <h1>Check the signals before you click, pay, or reply.</h1>
        <p className="lede">Paste a suspicious message, link, or email. TrustScope looks for concrete scam and phishing signals and explains what deserves verification.</p>
        <div className="privacy-note"><strong>Private by design.</strong> Your pasted content is analyzed in your browser. It is not sent to TrustScope analytics.</div>
      </section>

      <section className="checker-card">
        <div className="kind-tabs" role="tablist" aria-label="Content type">
          {(["message", "url", "email"] as InputKind[]).map((item) => (
            <button key={item} className={kind === item ? "active" : ""} onClick={() => { setKind(item); setText(""); setResult(null); trackEvent("input_type_select", { input_type: item }); }}>
              {item === "message" ? "Message / Text" : item === "url" ? "Link / URL" : "Email"}
            </button>
          ))}
        </div>

        <label className="input-label" htmlFor="trust-input">Paste what you want to check</label>
        <textarea
          id="trust-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={kind === "url" ? "https://example.com/..." : kind === "email" ? "Paste the sender + email body..." : "Paste the suspicious text, marketplace message, payment request, account alert..."}
          spellCheck={false}
        />
        <div className="input-meta"><span>Nothing you paste is included in analytics events.</span><span>{text.length.toLocaleString()} chars</span></div>
        <div className="actions"><button className="primary-button" onClick={run} disabled={!text.trim()}>Check this</button><button className="secondary-button" onClick={loadExample}>Load example</button></div>
      </section>

      {result && (
        <section id="result" className={`result-card band-${result.band.toLowerCase().replaceAll(" ", "-")}`}>
          <div className="result-top">
            <div><p className="eyebrow">TRUSTSCOPE RESULT</p><h2>{result.band}</h2><p className="summary">{result.summary}</p></div>
            <div className="score-ring"><strong>{result.score}</strong><span>/100</span></div>
          </div>
          <div className="signal-heading"><h3>{result.signals.length} visible signal{result.signals.length === 1 ? "" : "s"}</h3><span>Higher score = more visible risk indicators</span></div>
          <div className="signal-list">
            {result.signals.length ? result.signals.map((item) => (
              <article key={item.id} className={`signal severity-${item.severity}`}>
                <div><span className="severity">{item.severity}</span><h3>{item.title}</h3></div><p>{item.detail}</p>
              </article>
            )) : <article className="signal"><h3>No strong visible red flags detected.</h3><p>This is not a safety verdict. Sender reputation, domain ownership, account history, malware, and live threat intelligence are not checked in this first version.</p></article>}
          </div>
          <div className="next-steps"><p className="mini-label">WHAT TO DO NEXT</p><ol>{result.nextSteps.map((step) => <li key={step}>{step}</li>)}</ol></div>
          <div className="actions"><button className="primary-button" onClick={share}>Share result</button><button className="secondary-button" onClick={() => { setText(""); setResult(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Check another</button></div>
        </section>
      )}

      <section className="section" id="how-it-works">
        <p className="eyebrow">WHAT V1 CHECKS</p><h2>Explainable signals, not a magic “safe” badge.</h2>
        <div className="feature-grid">
          <article><span>01</span><h3>Pressure</h3><p>Urgency, threats, secrecy, prize/refund setups and attempts to stop you from verifying independently.</p></article>
          <article><span>02</span><h3>Sensitive asks</h3><p>Passwords, one-time codes, recovery phrases, financial identifiers, remote access, and hard-to-reverse payment methods.</p></article>
          <article><span>03</span><h3>Link structure</h3><p>Raw IP links, encoded hostnames, shorteners, deep subdomains, malformed URLs and higher-caution domain endings.</p></article>
          <article><span>04</span><h3>Context limits</h3><p>TrustScope clearly says what it cannot know yet instead of turning missing evidence into false confidence.</p></article>
        </div>
      </section>

      <section className="section roadmap-card">
        <p className="eyebrow">NEXT CAPABILITY LAYER</p><h2>Live verification comes next.</h2>
        <p>Planned additions include domain age/registration signals, redirect-chain inspection, reputation/blocklist checks, known-brand domain comparison, sender/domain verification, and safer official-contact lookup. Those checks will stay source-backed and will never silently convert “unknown” into “safe.”</p>
      </section>

      <footer>TrustScope · An AeroVista Local utility · Check the signals, then verify independently.</footer>
    </main>
  );
}

// src/App.jsx
console.log("App.jsx rendered - error-catcher edition");
import React, { Suspense, useEffect, useRef, useState } from "react";
import Tiger3DPanel from "./components/Tiger3DPanel"; // your 3D panel

function PersistentPlaceholder() {
  const ref = useRef();
  useEffect(() => {
    let raf;
    const animate = (t) => {
      if (ref.current) ref.current.style.transform = `rotateY(${t / 60}deg)`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div style={{ width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div ref={ref} style={{ width: 140, height: 100, background: "#FF9E2C", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }} />
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    this.setState({ error, info });
    console.error("Captured in ErrorBoundary:", error, info);
  }
  render() {
    if (this.state.error) {
      const e = this.state.error;
      const info = this.state.info;
      return (
        <div style={{ padding: 18, fontFamily: "system-ui, sans-serif", color: "#fff", background: "#111", minHeight: "100vh" }}>
          <h2 style={{ color: "#f87171" }}>App error — copy & paste this</h2>
          <div style={{ marginBottom: 12, color: "#fff" }}>
            <strong style={{ color: "#FFD27A" }}>Error:</strong> {String(e && e.message)}
          </div>
          <details style={{ whiteSpace: "pre-wrap", color: "#ddd" }}>
            <summary style={{ cursor: "pointer", color: "#9CA3AF" }}>Stack / info</summary>
            <pre style={{ maxHeight: 450, overflow: "auto", background: "#0b1220", padding: 12, color: "#ddd" }}>
{(e && e.stack) || "no stack"}
{'

'}
{(info && info.componentStack) || ""}
            </pre>
          </details>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => { this.setState({ error: null, info: null }); window.location.reload(); }} style={{ padding: "8px 12px", marginRight: 8 }}>Reload</button>
            <button onClick={() => { navigator.clipboard && navigator.clipboard.writeText(`Error: ${e?.message}\n\nStack:\n${e?.stack}\n\nCompStack:${info?.componentStack}`); }} style={{ padding: "8px 12px" }}>Copy error to clipboard</button>
          </div>
          <div style={{ marginTop: 16, color: "#9CA3AF" }}>
            If you see this, copy the whole stack and paste it in our chat. I will fix it instantly.
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [showFallback, setShowFallback] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowFallback(false), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#000", padding: 16, color: "#fff", fontFamily: "system-ui, sans-serif" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>Genoid — Debug Mode</h1>
        <div style={{ fontSize: 12, color: "#9CA3AF" }}>If an error occurs it will appear here (no DevTools needed)</div>
      </header>
      <ErrorBoundary>
        <main style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 }}>
          <section style={{ width: 320 }}>
            { showFallback ? <PersistentPlaceholder /> : <PersistentPlaceholder /> }
            <div style={{ marginTop: 12 }}>
              <div style={{ marginBottom: 8, color: "#9CA3AF" }}>Quick actions</div>
              <button onClick={() => window.location.reload()} style={{ padding: "8px 12px" }}>Reload</button>
            </div>
          </section>
          <section style={{ flex: 1 }}>
            <div style={{ height: 520, borderRadius: 12, overflow: "hidden", background: "#000" }}>
              <Suspense fallback={<div style={{ color: "#999", padding: 20 }}>Loading 3D panel...</div>}>
                <Tiger3DPanel />
              </Suspense>
            </div>
          </section>
        </main>
      </ErrorBoundary>
    </div>
  );
}

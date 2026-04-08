import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─── keyframes & utility styles injected once ─── */
const STYLE_ID = "connect-v4-styles";
if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  ["connect-v3-styles", "connect-layout-v3", "connect-layout-kf"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700&display=swap');
    @keyframes spin    { to { transform: rotate(360deg); } }
    @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
    @keyframes slideUp { from { transform:translateY(18px);opacity:0 } to { transform:translateY(0);opacity:1 } }
    @keyframes scaleIn { from { transform:scale(0.95);opacity:0 } to { transform:scale(1);opacity:1 } }

    .cnct-input:focus {
      border-color: #5f8aa4 !important;
      box-shadow: 0 0 0 3px rgba(95,138,164,0.15) !important;
      background: #fff !important;
      outline: none !important;
    }
    .cnct-sub:not(:disabled):hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 12px 32px rgba(28,25,23,0.28) !important;
    }
    .cnct-sub:not(:disabled):active { transform: translateY(0) !important; }

    .t-yes, .t-no { transition: all 0.18s ease !important; }
    .t-yes.on {
      background: linear-gradient(135deg,#5f8aa4,#0369a1) !important;
      border-color: transparent !important;
      color: #fff !important;
      box-shadow: 0 4px 14px rgba(95,138,164,0.4) !important;
    }
    .t-no.on {
      background: linear-gradient(135deg,#78716c,#292524) !important;
      border-color: transparent !important;
      color: #fff !important;
      box-shadow: 0 4px 14px rgba(28,25,23,0.3) !important;
    }
    .t-yes:not(.on):hover { border-color:#5f8aa4!important; color:#0369a1!important; background:#f0f9ff!important; }
    .t-no:not(.on):hover  { border-color:#78716c!important; color:#292524!important; background:#f5f4f3!important; }

    .qscroll::-webkit-scrollbar       { width: 4px; }
    .qscroll::-webkit-scrollbar-track { background: transparent; }
    .qscroll::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 4px; }
    .qscroll::-webkit-scrollbar-thumb:hover { background: #a8a29e; }

    .m-pri:hover { opacity:0.88!important; transform:translateY(-1px)!important; transition:all .18s ease!important; }
    .m-sec:hover { background: #f4f4f3 !important; transition: background .18s ease !important; }
  `;
  document.head.appendChild(s);
}

/* ─── helpers ─── */
const Lbl = ({ children, style = {} }) => (
  <label style={{ display:"block", fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", color:"#57534e", marginBottom:"0.38rem", ...style }}>
    {children}
  </label>
);

/* ═══════════════════════════════════════════════════════ */
export default function Connect() {
  const navigate = useNavigate();

  const [config, setConfig]             = useState(null);
  const [loading, setLoading]           = useState(true);
  const [formData, setFormData]         = useState({ name:"", phone:"", answers:{}, additionalNotes:"" });
  const [submitting, setSubmitting]     = useState(false);
  const [msg, setMsg]                   = useState("");
  const [msgType, setMsgType]           = useState("");
  const [showModal, setShowModal]       = useState(false);
  const [focused, setFocused]           = useState("");

  /* window width for responsive switching */
  const [wide, setWide] = useState(() => typeof window !== "undefined" ? window.innerWidth >= 1024 : true);
  useEffect(() => {
    const onResize = () => setWide(window.innerWidth >= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* fetch config */
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${import.meta.env.VITE_API_URL}/feedback/config`);
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || "Failed to load.");
        const cfg = data.data || {};
        setConfig(cfg);
        const init = (cfg.questions || []).reduce((a, q) => { a[q.questionId] = ""; return a; }, {});
        setFormData(p => ({ ...p, answers: init }));
      } catch (err) {
        setMsgType("error");
        setMsg(err.message || "Could not load feedback form.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const questions    = useMemo(() => config?.questions || [], [config]);
  const answeredCount = useMemo(
    () => questions.filter(q => ["yes","no"].includes(formData.answers[q.questionId])).length,
    [questions, formData.answers]
  );

  const handleAnswer = (qId, val) =>
    setFormData(p => ({ ...p, answers: { ...p.answers, [qId]: p.answers[qId] === val ? "" : val } }));

  const handleField = e => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true); setMsg(""); setMsgType("");

    const payloadAnswers = questions.map(q => ({
      questionId: q.questionId,
      selectedValue: formData.answers[q.questionId],
    }));
    const norm  = formData.phone.replace(/\D/g, "");
    const phone = norm.startsWith("91") && norm.length === 12 ? norm.slice(2) : norm;

    if (payloadAnswers.some(a => !["yes","no"].includes(a.selectedValue))) {
      setMsgType("error"); setMsg("Please answer every question with Yes or No.");
      setSubmitting(false); return;
    }
    if (phone && !/^[6-9]\d{9}$/.test(phone)) {
      setMsgType("error"); setMsg("Please enter a valid 10-digit Indian phone number.");
      setSubmitting(false); return;
    }

    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL}/feedback`, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ name:formData.name, phone, answers:payloadAnswers, additionalNotes:formData.additionalNotes }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Submission failed.");
      const reset = questions.reduce((a, q) => { a[q.questionId] = ""; return a; }, {});
      setMsgType("success"); setMsg(data.message || "Thank you for your feedback!");
      setFormData({ name:"", phone:"", answers:reset, additionalNotes:"" });
      setShowModal(true);
    } catch (err) {
      setMsgType("error"); setMsg(err.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── style helpers ── */
  const BASE = { fontFamily:"'Inter',system-ui,sans-serif", boxSizing:"border-box" };
  const inp  = id => ({
    width:"100%", padding:"0.72rem 0.95rem",
    border:`1.5px solid ${focused===id ? "#5f8aa4" : "#ddd9d6"}`,
    borderRadius:11, fontSize:"0.92rem", color:"#1c1917",
    background: focused===id ? "#fff" : "#fafaf9",
    outline:"none", boxSizing:"border-box", fontFamily:"inherit",
    transition:"border-color 0.2s, background 0.2s, box-shadow 0.2s",
  });

  /* ── Loading ── */
  if (loading) return (
    <div style={{ ...BASE, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"1rem", background:"linear-gradient(160deg,#fafaf9,#f0f9ff 50%,#fefce8)" }}>
      <div style={{ width:44, height:44, borderRadius:"50%", border:"3px solid #e9e9e7", borderTopColor:"#5f8aa4", animation:"spin 0.8s linear infinite" }} />
      <span style={{ color:"#78716c", fontSize:"0.875rem", fontWeight:500 }}>Loading…</span>
    </div>
  );

  /* ─────────────────────── LAYOUT ─────────────────────── */
  /*
      DESKTOP (≥1024px):
      ┌──────────────────┬─────────────────────────────┐
      │  Product Card    │                             │
      │                  │     Feedback Form           │
      │  Contact Info    │     (questions, notes,      │
      │  (name + phone)  │      submit)                │
      └──────────────────┴─────────────────────────────┘

      MOBILE: all stacked vertically
  */

  const CARD = {
    background:"#fff", border:"1px solid #e9e9e7",
    borderRadius:20, boxShadow:"0 4px 24px rgba(0,0,0,0.05)",
    padding:"1.6rem",
  };

  return (
    <>
      {/* ════ PAGE SHELL ════ */}
      <section style={{
        ...BASE,
        minHeight:"100vh",
        background:"linear-gradient(160deg,#fafaf9 0%,#f0f9ff 45%,#fefce8 100%)",
        padding: wide ? "2rem 2rem" : "1.25rem 1rem 4rem",
      }}>
        {/* ════ OUTER GRID ════ */}
        <div style={{
          maxWidth:1080,
          margin:"0 auto",
          display: wide ? "grid" : "flex",
          gridTemplateColumns: wide ? "minmax(300px,400px) 1fr" : undefined,
          flexDirection: wide ? undefined : "column",
          gap:"1.25rem",
          alignItems: wide ? "start" : undefined,
          /* on desktop, try to fit the viewport */
          height: wide ? "calc(100vh - 4rem)" : "auto",
        }}>

          {/* ════ LEFT COLUMN ════ */}
          <div style={{
            display:"flex", flexDirection:"column", gap:"1.25rem",
            height: wide ? "100%" : "auto",
          }}>

            {/* ── Product Card ── */}
            <div style={{ ...CARD, animation:"slideUp 0.4s ease-out both", flex: wide ? "0 0 auto" : undefined }}>
              <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(95,138,164,0.1)", color:"#0369a1", fontSize:"0.64rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", padding:"3px 11px", borderRadius:999, marginBottom:"0.85rem" }}>
                ✦ Product Spotlight
              </span>
              <h2 style={{ fontFamily:"'Oswald',sans-serif", fontSize:"clamp(1.2rem,2.5vw,1.6rem)", fontWeight:700, color:"#1c1917", marginBottom:"0.45rem", lineHeight:1.2 }}>
                {config?.productTitle || "Daily Performance Fuel"}
              </h2>
              <p style={{ color:"#57534e", fontSize:"0.9rem", lineHeight:1.65, marginBottom:0 }}>
                {config?.productDescription || "A light daily drink designed to help maintain steady energy through the day."}
              </p>

              {Array.isArray(config?.productHighlights) && config.productHighlights.length > 0 && (
                <ul style={{ display:"flex", flexDirection:"column", gap:"0.55rem", marginTop:"1.1rem", paddingTop:"1rem", borderTop:"1px solid #f0efee" }}>
                  {config.productHighlights.map((item, i) => (
                    <li key={i} style={{ display:"flex", alignItems:"center", gap:9, fontSize:"0.87rem", color:"#44403c" }}>
                      <span style={{ width:7, height:7, minWidth:7, borderRadius:"50%", background:"linear-gradient(135deg,#5f8aa4,#d6dd28)", flexShrink:0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ── Contact Info Card ── */}
            <div style={{ ...CARD, animation:"slideUp 0.45s 0.1s ease-out both", flex: wide ? "1 1 auto" : undefined }}>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.3rem,2.5vw,1.6rem)", fontWeight:700, color:"#1c1917", marginBottom:"0.2rem" }}>
                Connect With Us
              </h1>
              <p style={{ color:"#78716c", fontSize:"0.85rem", marginBottom:"1.3rem" }}>
                Let us know who you are.
              </p>

              <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                <div>
                  <Lbl>Name <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0, color:"#a8a29e", fontSize:"0.68rem" }}>(optional)</span></Lbl>
                  <input
                    className="cnct-input" type="text" name="name"
                    value={formData.name} onChange={handleField}
                    placeholder="Your name" style={inp("name")}
                    onFocus={() => setFocused("name")} onBlur={() => setFocused("")}
                  />
                </div>
                <div>
                  <Lbl>Phone <span style={{ color:"#dc2626", fontWeight:700 }}>*</span></Lbl>
                  <input
                    className="cnct-input" type="tel" name="phone"
                    value={formData.phone} onChange={handleField}
                    placeholder="e.g. 9876543210" inputMode="numeric" maxLength={13} required
                    style={inp("phone")}
                    onFocus={() => setFocused("phone")} onBlur={() => setFocused("")}
                  />
                  <p style={{ marginTop:"0.3rem", fontSize:"0.68rem", color:"#b0a9a3" }}>10-digit Indian number (or +91…)</p>
                </div>
              </div>

              <div style={{ marginTop:"1.2rem", padding:"0.7rem 0.9rem", background:"#f8fafc", border:"1px solid #eef0f4", borderRadius:10, display:"flex", alignItems:"center", gap:8 }}>
                <span>🔒</span>
                <span style={{ fontSize:"0.73rem", color:"#64748b", fontWeight:500 }}>Your info is 100% private &amp; safe</span>
              </div>
            </div>
          </div>

          {/* ════ RIGHT COLUMN — Feedback Form ════ */}
          <form
            onSubmit={handleSubmit}
            style={{
              ...CARD,
              display:"flex",
              flexDirection:"column",
              height: wide ? "100%" : "auto",
              overflow:"hidden",
              animation:"slideUp 0.5s 0.05s ease-out both",
            }}
          >
            {/* ── Form Header (fixed) ── */}
            <div style={{ flexShrink:0, marginBottom:"1rem" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"0.75rem" }}>
                <div>
                  <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.2rem,2vw,1.5rem)", fontWeight:700, color:"#1c1917", marginBottom:"0.15rem" }}>
                    Your Experience
                  </h2>
                  <p style={{ color:"#78716c", fontSize:"0.82rem" }}>Tap to select — tap again to undo.</p>
                </div>
                {/* Progress pill */}
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:72, height:5, borderRadius:99, background:"#efeeed", overflow:"hidden" }}>
                    <div style={{
                      height:"100%", borderRadius:99,
                      width:`${questions.length ? Math.round((answeredCount/questions.length)*100) : 0}%`,
                      background: answeredCount===questions.length ? "#16a34a" : "#5f8aa4",
                      transition:"width 0.4s cubic-bezier(0.22,1,0.36,1)",
                    }} />
                  </div>
                  <span style={{ fontSize:"0.72rem", fontWeight:700, color: answeredCount===questions.length ? "#166534" : "#5f8aa4" }}>
                    {answeredCount}/{questions.length}
                  </span>
                </div>
              </div>
              <div style={{ marginTop:"0.85rem", height:1, background:"#f0efee" }} />
            </div>

            {/* ── Scrollable Middle: Questions + Notes ── */}
            <div
              className="qscroll"
              style={{
                flex:"1 1 auto",
                overflowY: wide ? "auto" : "visible",
                minHeight:0,
                paddingRight: wide ? 6 : 0,
                display:"flex", flexDirection:"column", gap:"0.75rem",
              }}
            >
              {questions.map((q, i) => {
                const val = formData.answers[q.questionId] || "";
                return (
                  <div key={q.questionId} style={{ background:"#fafaf9", border:"1.5px solid #ece9e6", borderRadius:14, padding:"0.9rem 1rem" }}>
                    <p style={{ fontSize:"0.88rem", fontWeight:600, color:"#1c1917", marginBottom:"0.7rem", lineHeight:1.5, display:"flex", alignItems:"flex-start", gap:6 }}>
                      <span style={{ color:"#5f8aa4", minWidth:"1.3rem", flexShrink:0, fontWeight:700 }}>{i+1}.</span>
                      {q.questionText}
                    </p>
                    <div style={{ display:"flex", gap:"0.55rem" }}>
                      <button type="button" className={`t-yes${val==="yes" ? " on" : ""}`}
                        onClick={() => handleAnswer(q.questionId, "yes")}
                        style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5, padding:"0.6rem", borderRadius:9, fontSize:"0.84rem", fontWeight:600, cursor:"pointer", border:"1.5px solid #ddd9d6", background:"#fff", color:"#57534e", outline:"none" }}>
                        {val==="yes" ? "✓" : "👍"}&nbsp;{q.yesLabel || "Yes"}
                      </button>
                      <button type="button" className={`t-no${val==="no" ? " on" : ""}`}
                        onClick={() => handleAnswer(q.questionId, "no")}
                        style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5, padding:"0.6rem", borderRadius:9, fontSize:"0.84rem", fontWeight:600, cursor:"pointer", border:"1.5px solid #ddd9d6", background:"#fff", color:"#57534e", outline:"none" }}>
                        {val==="no" ? "✓" : "👎"}&nbsp;{q.noLabel || "No"}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Notes */}
              <div style={{ marginTop:"0.25rem" }}>
                <Lbl>Additional Feedback <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0, color:"#a8a29e", fontSize:"0.68rem" }}>(optional)</span></Lbl>
                <textarea
                  className="cnct-input" name="additionalNotes"
                  value={formData.additionalNotes} onChange={handleField}
                  placeholder="Tell us anything else that can help us improve…"
                  style={{ ...inp("notes"), resize:"vertical", minHeight:78, lineHeight:1.6 }}
                  onFocus={() => setFocused("notes")} onBlur={() => setFocused("")}
                />
              </div>
            </div>

            {/* ── Submit (fixed at bottom) ── */}
            <div style={{ flexShrink:0, paddingTop:"1rem", marginTop:"0.5rem", borderTop:"1px solid #f0efee" }}>
              <button
                className="cnct-sub" type="submit" disabled={submitting}
                style={{
                  width:"100%", padding:"0.95rem",
                  background: submitting ? "#a8a29e" : "linear-gradient(135deg,#57534e 0%,#1c1917 100%)",
                  color:"#fff", fontFamily:"'Oswald',sans-serif", fontSize:"1rem", fontWeight:600,
                  letterSpacing:"0.06em", borderRadius:13, border:"none",
                  cursor: submitting ? "not-allowed" : "pointer",
                  boxShadow: submitting ? "none" : "0 5px 22px rgba(28,25,23,0.22)",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  transition:"all 0.22s ease",
                }}
              >
                {submitting ? (
                  <>
                    <span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" }} />
                    Submitting…
                  </>
                ) : "Submit Feedback →"}
              </button>

              {msg && (
                <div style={{
                  marginTop:"0.75rem", padding:"0.7rem 0.9rem", borderRadius:11,
                  fontSize:"0.85rem", fontWeight:500, display:"flex", alignItems:"flex-start", gap:7,
                  background: msgType==="success" ? "#dcfce7" : "#fee2e2",
                  color: msgType==="success" ? "#166534" : "#991b1b",
                  border:`1px solid ${msgType==="success" ? "#bbf7d0" : "#fecaca"}`,
                  animation:"scaleIn 0.22s ease-out",
                }}>
                  <span>{msgType==="success" ? "✓" : "⚠"}</span> {msg}
                </div>
              )}
            </div>
          </form>

        </div>
      </section>

      {/* ════ Thank You Modal ════ */}
      {showModal && (
        <div
          style={{ position:"fixed", inset:0, zIndex:60, display:"flex", alignItems:"flex-end", justifyContent:"center", background:"rgba(0,0,0,0.48)", backdropFilter:"blur(6px)", padding:"0 1rem", animation:"fadeIn 0.22s ease" }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{ width:"100%", maxWidth:420, background:"#fff", borderRadius:"24px 24px 14px 14px", padding:"2rem 1.6rem 2.25rem", boxShadow:"0 -12px 60px rgba(0,0,0,0.15)", animation:"slideUp 0.32s ease-out", marginBottom:"env(safe-area-inset-bottom,0px)" }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width:60, height:60, borderRadius:"50%", background:"linear-gradient(135deg,#5f8aa4,#d6dd28)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.6rem", margin:"0 auto 1.2rem", boxShadow:"0 6px 20px rgba(95,138,164,0.28)" }}>
              🍯
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.55rem", fontWeight:700, color:"#1c1917", textAlign:"center", marginBottom:"0.4rem" }}>Thank You!</h2>
            <p style={{ color:"#78716c", fontSize:"0.9rem", textAlign:"center", lineHeight:1.65, marginBottom:"1.75rem" }}>
              Your feedback has been submitted.<br />
              Helping us make <strong style={{ color:"#292524" }}>Mindy Munchs</strong> even better.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.65rem" }}>
              <button className="m-pri" type="button" onClick={() => navigate("/")}
                style={{ width:"100%", padding:"0.95rem", background:"linear-gradient(135deg,#57534e,#1c1917)", color:"#fff", fontFamily:"'Oswald',sans-serif", fontWeight:600, fontSize:"0.97rem", borderRadius:13, border:"none", cursor:"pointer", letterSpacing:"0.05em" }}>
                Back to Homepage
              </button>
              <button className="m-sec" type="button" onClick={() => setShowModal(false)}
                style={{ width:"100%", padding:"0.88rem", background:"transparent", color:"#78716c", fontFamily:"inherit", fontWeight:600, fontSize:"0.875rem", borderRadius:13, border:"1.5px solid #e2e0de", cursor:"pointer" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { useState, useEffect, useCallback, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Package, Plus, Search, Trash2, Edit3, X, Check, ArrowLeft, Users, FileText, RotateCcw, LogOut, Eye, EyeOff, ChevronRight, ChevronDown, Layers, Clock, CheckCircle, XCircle, Printer, Archive, Home, BarChart2, Copy, GripVertical, AlertTriangle, DollarSign, Settings, Download, Camera, ArrowUp, ArrowDown, Image } from "lucide-react";

// Storage imported from ./storage.js
import { ld, sv, ldL, svL } from "./storage.js"
const CATS = ["Shingles","Underlayment","Flashing","Ridge/Hip","Drip Edge","Starter Strip","Ice & Water Shield","Pipe Boots","Vents","Step Flashing","Lumber","Plywood","Gutters","Downspouts","Fasteners","Adhesives/Sealants","Metal/Trim","Other"];
const UNITS = ["bundle","roll","sheet","piece","box","tube","lb","ft","sq ft","each","gallon","bag","square","case"];
const LOGO = "data:image/png;base64,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";

// Colors — clean white with Roof USA red/blue
const RED = "#B22234";
const NAVY = "#1B2A4A";
const C = { bg: "#F5F6F8", card: "#FFFFFF", sf: "#EEF1F5", brd: "#D5DAE0", brdL: "#C0C8D2", ac: RED, acH: "#CC3344", txt: "#1A1D23", t2: "#6B7280", red: "#B22234", grn: "#1E8449", blu: "#1B2A4A", wrn: "#D4870E", w: "#fff" };

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Barlow:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}body{background:${C.bg};color:${C.txt};font-family:'Barlow',sans-serif}
input,select,textarea,button{font-family:'Barlow',sans-serif}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${C.brd};border-radius:3px}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fadeUp .3s ease-out}
button:active{transform:scale(.97)}
select option{background:${C.w};color:${C.txt}}`;

const MN = `'IBM Plex Mono',monospace`;
const BC = `'Barlow Condensed',sans-serif`;

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

// Compress and resize photo from file input → base64 string
function compressPhoto(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 800;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else { w = Math.round(w * MAX / h); h = MAX; }
        }
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.5));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
const fmt$ = (n) => "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fD = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const hP = (p) => { let h = 0; for (let i = 0; i < p.length; i++) { h = ((h << 5) - h) + p.charCodeAt(i); h |= 0; } return "h" + Math.abs(h).toString(36); };

const inp = { background: C.sf, border: `1px solid ${C.brd}`, color: C.txt, borderRadius: 6, padding: "10px 14px", fontSize: 14, width: "100%", outline: "none" };
const bP = { background: C.ac, color: C.w, border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, transition: "all .15s" };
const bS = { ...bP, background: "transparent", border: `1px solid ${C.brd}`, color: C.txt };
const bD = { ...bP, background: C.red };
const crd = { background: C.card, borderRadius: 10, border: `1px solid ${C.brd}`, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" };
const lbl = { fontSize: 11, fontWeight: 700, color: C.t2, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6, display: "block" };

// ─── SHARED UI ───
function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.8)", padding: 16, overflow: "auto" }} onClick={onClose}>
      <div className="fu" style={{ ...crd, maxWidth: wide ? 820 : 520, width: "100%", maxHeight: "90vh", overflow: "auto", margin: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.t2, cursor: "pointer" }}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Fld({ label, children }) { return <div style={{ marginBottom: 14 }}><label style={lbl}>{label}</label>{children}</div>; }
function Rw({ children, g }) { return <div style={{ display: "flex", gap: g || 12, flexWrap: "wrap" }}>{children}</div>; }
function Cl({ children, f }) { return <div style={{ flex: f || 1, minWidth: 130 }}>{children}</div>; }
function Stat({ label, value, sub, color }) {
  return (
    <div style={{ ...crd, flex: "1 1 190px", minWidth: 170 }}>
      <div style={lbl}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, fontFamily: MN, color: color || C.txt, marginTop: 6 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.t2, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}
function Badge({ status }) {
  const m = { pending: { bg: "#E6A81722", c: C.wrn }, approved: { bg: "#27AE6022", c: C.grn }, rejected: { bg: "#C0392B22", c: C.red } };
  const s = m[status] || m.pending;
  return <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 4, textTransform: "uppercase", background: s.bg, color: s.c, letterSpacing: ".06em" }}>{status}</span>;
}
function Empty({ msg }) { return <div style={{ ...crd, textAlign: "center", color: C.t2, padding: 50, fontSize: 14 }}>{msg}</div>; }
function NavBtn({ icon: Ic, label, active, onClick, badge }) {
  return (
    <button onClick={onClick} style={{ background: active ? C.sf : "transparent", border: "none", color: active ? C.ac : C.t2, padding: "7px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, transition: "all .15s", position: "relative" }}>
      <Ic size={14} /><span>{label}</span>
      {badge > 0 && <span style={{ position: "absolute", top: -2, right: -2, background: C.red, color: "#fff", fontSize: 9, fontWeight: 800, borderRadius: 10, padding: "1px 5px", minWidth: 16, textAlign: "center" }}>{badge}</span>}
    </button>
  );
}

// ─── PDF: HTML blob download ───
function downloadPDF(order, items) {
  const iMap = Object.fromEntries(items.map((i) => [i.id, i]));
  const ls = order.lines || [];
  const tCost = ls.reduce((s, l) => s + l.qty * (l.unitCost || 0), 0);
  const tSell = ls.reduce((s, l) => s + l.qty * (l.markupCost || 0), 0);
  const tSupplier = ls.reduce((s, l) => s + l.qty * (l.supplierCost || 0), 0);
  const marginPct = tSell > 0 ? ((1 - tCost / tSell) * 100).toFixed(1) : "0";
  const savingsVsMarkup = tSell - tCost;
  const savingsVsSupplier = tSupplier - tCost;
  const rows = ls.map((l) => {
    const it = iMap[l.itemId] || { name: "?", unit: "" };
    const opt = l.option && l.option !== "_default" ? l.option : "—";
    return `<tr><td style="font-weight:700">${it.name}</td><td>${opt}</td><td class="r">${l.qty} ${it.unit||""}</td><td class="r">${fmt$(l.unitCost)}</td><td class="r">${fmt$(l.markupCost)}</td><td class="r">${fmt$(l.supplierCost||0)}</td><td class="r">${fmt$(l.qty*l.unitCost)}</td><td class="r" style="font-weight:700">${fmt$(l.qty*l.markupCost)}</td></tr>`;
  }).join("");
  const html = `<!DOCTYPE html><html><head><title>${(order.poNumber||"Order")} Material Order</title>
<style>*{box-sizing:border-box;margin:0;padding:0;font-family:Helvetica,Arial,sans-serif}body{padding:36px;color:#1a1a1a;font-size:12px;max-width:800px;margin:0 auto}table{width:100%;border-collapse:collapse;margin:14px 0}th{text-align:left;padding:7px 6px;border-bottom:2px solid #1B2A4A;font-size:9px;text-transform:uppercase;letter-spacing:.06em;color:#666}td{padding:6px;border-bottom:1px solid #ddd;font-size:11px}.r{text-align:right}.hd{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;padding-bottom:14px;border-bottom:3px solid #B22234}.tot{margin-top:14px;padding:12px;background:#f0f2f5;border-radius:5px;border-left:4px solid #B22234}.tr{display:flex;justify-content:space-between;padding:2px 0;font-size:12px}.trb{font-size:14px;font-weight:800;border-top:2px solid #1B2A4A;padding-top:7px;margin-top:5px}.sav{margin-top:10px;padding:10px;background:#d4edda;border-radius:4px;font-size:11px}@media print{body{padding:20px}@page{margin:0.5in}}</style></head><body>
<div class="hd"><div><div style="font-size:24px;font-weight:900;letter-spacing:-0.02em">ROOFUS<span style="color:#B22234">.</span></div><div style="font-size:10px;color:#666;margin-top:2px">Construction, LLC · Columbia, MO</div></div>
<div style="text-align:right;font-size:11px;color:#666"><div style="font-weight:800;font-size:13px;color:#1B2A4A">${order.type==="return"?"RETURN":"MATERIAL ORDER"}</div><div style="margin-top:3px">PO: <strong style="color:#1a1a1a">${order.poNumber||"—"}</strong></div><div>Date: ${fD(order.date)}</div><div>By: ${order.userName||"—"}</div>
<div style="margin-top:4px"><span style="display:inline-block;padding:2px 8px;border-radius:3px;font-size:9px;font-weight:700;text-transform:uppercase;background:${order.status==="approved"?"#d4edda":"#fff3cd"};color:${order.status==="approved"?"#155724":"#856404"}">${(order.status||"pending").toUpperCase()}</span></div></div></div>
${order.jobName?`<div style="margin-bottom:12px;font-size:12px"><strong>Job:</strong> ${order.jobName}${order.jobAddress?" — "+order.jobAddress:""}</div>`:""}
<table><thead><tr><th>Item</th><th>Color/Style</th><th class="r">Qty</th><th class="r">Our Cost</th><th class="r">Markup Price</th><th class="r">Supplier $</th><th class="r">Cost Ext</th><th class="r">Sell Ext</th></tr></thead><tbody>${rows}</tbody></table>
<div class="tot"><div class="tr"><span>Total (Our Cost):</span><span>${fmt$(tCost)}</span></div>
<div class="tr trb"><span>Total (Markup Price):</span><span>${fmt$(tSell)}</span></div>
<div class="tr"><span>Markup Margin:</span><span style="color:#1E8449">${fmt$(savingsVsMarkup)} (${marginPct}%)</span></div>
${tSupplier > 0 ? `<div class="tr" style="border-top:1px solid #ccc;padding-top:4px;margin-top:4px"><span>Total (Supplier Would Charge):</span><span>${fmt$(tSupplier)}</span></div>
<div class="tr"><span>Savings vs Supplier:</span><span style="color:${savingsVsSupplier >= 0 ? '#1E8449' : '#B22234'}">${savingsVsSupplier >= 0 ? '+' : ''}${fmt$(savingsVsSupplier)}</span></div>` : ''}
</div>
${order.notes?`<div style="margin-top:14px;padding:8px;background:#f5f5f5;border-radius:4px;font-size:11px"><strong>Notes:</strong> ${order.notes}</div>`:""}
<div style="margin-top:30px;text-align:center;font-size:8px;color:#bbb">Roofus Construction, LLC · Columbia, MO</div></body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(order.poNumber || "Order").replace(/[^a-zA-Z0-9-_ ]/g, "")} Material Order.html`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
}

// ─── PDF VIEWER MODAL ───
function OrderPDF({ order, items, onClose, onDelete, onEdit }) {
  const iMap = Object.fromEntries(items.map((i) => [i.id, i]));
  const ls = order.lines || [];
  const tCost = ls.reduce((s, l) => s + l.qty * (l.unitCost || 0), 0);
  const tSell = ls.reduce((s, l) => s + l.qty * (l.markupCost || 0), 0);
  const tSupplier = ls.reduce((s, l) => s + l.qty * (l.supplierCost || 0), 0);
  const savingsVsMarkup = tSell - tCost;
  const savingsVsSupplier = tSupplier - tCost;
  const marginPct = tSell > 0 ? ((1 - tCost / tSell) * 100).toFixed(1) : "0";
  const [showDeleteWarn, setShowDeleteWarn] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editLines, setEditLines] = useState([]);

  if (showDeleteWarn) {
    return (
      <Modal open={true} onClose={() => setShowDeleteWarn(false)} title="">
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <div style={{ background: C.red + "15", borderRadius: 16, padding: 20, display: "inline-flex", marginBottom: 16 }}>
            <AlertTriangle size={48} color={C.red} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: C.red, marginBottom: 8 }}>DELETE THIS ORDER?</h2>
          <p style={{ color: C.t2, fontSize: 14, marginBottom: 6 }}>PO: <strong>{order.poNumber || "N/A"}</strong> — {order.userName}</p>
          <p style={{ color: C.red, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>This action CANNOT be undone. The order will be permanently removed.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={() => setShowDeleteWarn(false)} style={{ ...bS, padding: "14px 32px", fontSize: 15 }}>Cancel</button>
            <button onClick={() => { if (onDelete) onDelete(order.id); onClose(); }} style={{ ...bD, padding: "14px 32px", fontSize: 15 }}><Trash2 size={16} /> Yes, Delete Forever</button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={true} onClose={onClose} title={`${order.type === "return" ? "Return" : "Order"} — PO: ${order.poNumber || "N/A"}`} wide>
      <div style={{ marginBottom: 14, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <Badge status={order.status} />
        <span style={{ fontSize: 13, color: C.t2 }}>By {order.userName} · {fD(order.date)}</span>
        {order.jobName && <span style={{ fontSize: 13, color: C.t2 }}>· Job: {order.jobName}</span>}
      </div>
      <div style={{ overflowX: "auto", marginBottom: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr style={{ borderBottom: `1px solid ${C.brdL}` }}>
            {["Item", "Color/Style", "Qty", "Our Cost", "Markup", "Supplier $", "Cost Ext", "Sell Ext"].map((h) => (
              <th key={h} style={{ padding: "8px", textAlign: ["Item", "Color/Style"].includes(h) ? "left" : "right", fontWeight: 700, color: C.t2, fontSize: 10, textTransform: "uppercase" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{ls.map((l, i) => {
            const it = iMap[l.itemId] || { name: "?", unit: "" };
            return (
              <tr key={i} style={{ borderBottom: `1px solid ${C.brd}` }}>
                <td style={{ padding: "7px 8px", fontWeight: 600 }}>{it.name}</td>
                <td style={{ padding: "7px 8px", color: C.t2 }}>{l.option && l.option !== "_default" ? l.option : "—"}</td>
                <td style={{ padding: "7px 8px", textAlign: "right", fontFamily: MN }}>{l.qty} {it.unit}</td>
                <td style={{ padding: "7px 8px", textAlign: "right", fontFamily: MN }}>{fmt$(l.unitCost)}</td>
                <td style={{ padding: "7px 8px", textAlign: "right", fontFamily: MN }}>{fmt$(l.markupCost)}</td>
                <td style={{ padding: "7px 8px", textAlign: "right", fontFamily: MN, color: C.blu }}>{fmt$(l.supplierCost || 0)}</td>
                <td style={{ padding: "7px 8px", textAlign: "right", fontFamily: MN }}>{fmt$(l.qty * l.unitCost)}</td>
                <td style={{ padding: "7px 8px", textAlign: "right", fontFamily: MN, fontWeight: 700, color: C.ac }}>{fmt$(l.qty * l.markupCost)}</td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
      {/* TOTALS & SAVINGS */}
      <div style={{ background: C.sf, borderRadius: 8, padding: 14, marginBottom: 14, borderLeft: `4px solid ${C.ac}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}><span>Our Cost</span><span style={{ fontFamily: MN }}>{fmt$(tCost)}</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, borderTop: `2px solid ${C.brdL}`, paddingTop: 8, marginTop: 6 }}><span>Markup Price</span><span style={{ fontFamily: MN, color: C.ac }}>{fmt$(tSell)}</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.grn, marginTop: 4 }}><span>Markup Margin</span><span style={{ fontFamily: MN }}>{fmt$(savingsVsMarkup)} ({marginPct}%)</span></div>
        {tSupplier > 0 && (
          <>
            <div style={{ borderTop: `1px solid ${C.brd}`, marginTop: 8, paddingTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}><span>Supplier Would Charge</span><span style={{ fontFamily: MN }}>{fmt$(tSupplier)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: savingsVsSupplier >= 0 ? C.grn : C.red, marginTop: 2 }}>
                <span>Savings vs Supplier</span>
                <span style={{ fontFamily: MN, fontWeight: 700 }}>{savingsVsSupplier >= 0 ? "+" : ""}{fmt$(savingsVsSupplier)}</span>
              </div>
            </div>
          </>
        )}
      </div>
      {order.notes && <div style={{ fontSize: 12, color: C.t2, marginBottom: 14, padding: 10, background: C.sf, borderRadius: 6 }}><strong>Notes:</strong> {order.notes}</div>}

      {/* EDIT MODE */}
      {editing && (
        <div style={{ background: C.sf, borderRadius: 8, padding: 16, marginBottom: 14, border: `2px solid ${C.blu}` }}>
          <div style={{ ...lbl, marginBottom: 10, color: C.blu }}>Editing Line Items — adjust quantities or remove items</div>
          {editLines.map((l, i) => {
            const it = iMap[l.itemId] || { name: "?", unit: "" };
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: `1px solid ${C.brd}` }}>
                <div style={{ flex: 2, fontWeight: 600, fontSize: 13 }}>{it.name}{l.option && l.option !== "_default" ? ` — ${l.option}` : ""}</div>
                <div style={{ flex: 1 }}>
                  <input type="number" min="1" value={l.qty} onChange={(e) => { const n = [...editLines]; n[i] = { ...n[i], qty: Math.max(1, +e.target.value) }; setEditLines(n); }}
                    style={{ ...inp, padding: "6px 10px", textAlign: "center", fontSize: 14, width: 80 }} />
                </div>
                <div style={{ fontSize: 12, fontFamily: MN, color: C.t2, flex: 1 }}>{fmt$(l.qty * l.markupCost)}</div>
                <button onClick={() => setEditLines(editLines.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: C.red, cursor: "pointer" }}><Trash2 size={14} /></button>
              </div>
            );
          })}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
            <button onClick={() => setEditing(false)} style={bS}>Cancel</button>
            <button onClick={() => { if (onEdit) onEdit(order.id, editLines); setEditing(false); }} style={{ ...bP, background: C.grn }}><Check size={14} /> Save Changes</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, justifyContent: "space-between", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {onDelete && <button onClick={() => setShowDeleteWarn(true)} style={{ ...bS, color: C.red, borderColor: C.red + "55" }}><Trash2 size={14} /> Delete</button>}
          {onEdit && !editing && <button onClick={() => { setEditLines(ls.map((l) => ({ ...l }))); setEditing(true); }} style={{ ...bS, color: C.blu, borderColor: C.blu + "55" }}><Edit3 size={14} /> Edit</button>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onClose} style={bS}>Close</button>
          <button onClick={() => downloadPDF(order, items)} style={{ ...bP, background: NAVY }}><Printer size={14} /> Save PDF</button>
        </div>
      </div>
    </Modal>
  );
}

// ═══ MAIN APP ═══
export default function App() {
  const [rdy, setRdy] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [shrinkLog, setShrinkLog] = useState([]);
  const [pg, setPg] = useState("home");
  const [vOrd, setVOrd] = useState(null);

  useEffect(() => {
    (async () => {
      const [u, it, o, t, sh] = await Promise.all([ld("users", []), ld("items", []), ld("orders", []), ld("templates", []), ld("shrinkage", [])]);
      if (!u.length) {
        const a = { id: uid(), name: "Logan", email: "logan@usaroof.com", pw: hP("admin"), role: "admin", created: new Date().toISOString() };
        u.push(a);
        await sv("users", u);
      }
      setUsers(u); setItems(it); setOrders(o); setTemplates(t); setShrinkLog(sh);
      try { const s = await ldL("sess", null); if (s) { const f = u.find((x) => x.id === s.uid); if (f) setUser(f); } } catch {}
      setRdy(true);
    })();
  }, []);

  const sU = useCallback((u) => { setUsers(u); sv("users", u); }, []);
  const sI = useCallback((i) => { setItems(i); sv("items", i); }, []);
  const sO = useCallback((o) => { setOrders(o); sv("orders", o); }, []);
  const sT = useCallback((t) => { setTemplates(t); sv("templates", t); }, []);
  const sSh = useCallback((s) => { setShrinkLog(s); sv("shrinkage", s); }, []);
  const login = useCallback(async (u) => { setUser(u); setPg("home"); await svL("sess", { uid: u.id }); }, []);
  const logout = useCallback(async () => { setUser(null); setPg("home"); try { localStorage.removeItem("roofus_sess"); } catch {} }, []);
  const isA = user?.role === "admin";
  const isM = user?.role === "manager";
  const canApprove = isA || isM;
  const canEditOrders = isA || isM;
  const [matDrop, setMatDrop] = useState(false);
  const [settDrop, setSettDrop] = useState(false);

  // Close dropdowns on page change
  useEffect(() => { setMatDrop(false); setSettDrop(false); }, [pg]);

  if (!rdy) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: C.bg }}><style>{CSS}</style><img src={LOGO} alt="" style={{ height: 60 }} /></div>;
  if (!user) return <><style>{CSS}</style><Auth users={users} sU={sU} login={login} /></>;

  const pendCt = orders.filter((o) => o.status === "pending").length;

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <style>{CSS}</style>
      {/* HEADER */}
      <div style={{ background: "#FFFFFF", borderBottom: `3px solid ${RED}`, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, flexWrap: "wrap", gap: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setPg("home")}>
          <img src={LOGO} alt="Roof USA" style={{ height: 40 }} />
          <div style={{ fontSize: 9, color: NAVY, fontWeight: 700, letterSpacing: ".1em" }}>MATERIALS PORTAL</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
          <NavBtn icon={Home} label="Home" active={pg === "home"} onClick={() => setPg("home")} />
          {canApprove && <NavBtn icon={Clock} label="Approvals" active={pg === "approvals"} onClick={() => setPg("approvals")} badge={pendCt} />}
          <NavBtn icon={Camera} label="Report Damage" active={pg === "damage"} onClick={() => setPg("damage")} />

          {/* Materials Dropdown - admin only */}
          {isA && <div style={{ position: "relative" }}>
            <button onClick={() => { setMatDrop(!matDrop); setSettDrop(false); }}
              style={{ background: ["items","inventory","shrinkage","supplier","templates","gallery"].includes(pg) ? C.sf : "transparent", border: "none",
                color: ["items","inventory","shrinkage","supplier","templates","gallery"].includes(pg) ? C.ac : C.t2,
                padding: "7px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, transition: "all .15s" }}>
              <Package size={14} /> Materials <ChevronDown size={12} style={{ transform: matDrop ? "rotate(180deg)" : "rotate(0)", transition: "transform .2s" }} />
            </button>
            {matDrop && <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 4, background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: 180, zIndex: 200, overflow: "hidden" }}>
              {[{ pg: "items", icon: Layers, l: "Items" }, { pg: "inventory", icon: Archive, l: "Receive Inventory" }, { pg: "shrinkage", icon: AlertTriangle, l: "Physical Count" }, { pg: "gallery", icon: Image, l: "Reported Damage" }, { pg: "supplier", icon: DollarSign, l: "Supplier Cost" }, { pg: "templates", icon: Copy, l: "Templates" }].map((m) => (
                <button key={m.pg} onClick={() => setPg(m.pg)}
                  style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 14px", border: "none", background: pg === m.pg ? C.sf : "transparent",
                    color: pg === m.pg ? C.ac : C.txt, fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left" }}>
                  <m.icon size={14} /> {m.l}
                </button>
              ))}
            </div>}
          </div>}

          <NavBtn icon={FileText} label="History" active={pg === "history"} onClick={() => setPg("history")} />
          {isA && <NavBtn icon={BarChart2} label="Reports" active={pg === "reports"} onClick={() => setPg("reports")} />}

          {/* Settings Dropdown */}
          <div style={{ position: "relative" }}>
            <button onClick={() => { setSettDrop(!settDrop); setMatDrop(false); }}
              style={{ background: pg === "settings" ? C.sf : "transparent", border: "none",
                color: pg === "settings" ? C.ac : C.t2,
                padding: "7px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, transition: "all .15s" }}>
              <Settings size={14} /> <ChevronDown size={12} style={{ transform: settDrop ? "rotate(180deg)" : "rotate(0)", transition: "transform .2s" }} />
            </button>
            {settDrop && <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 4, background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: 180, zIndex: 200, overflow: "hidden" }}>
              <div style={{ padding: "8px 14px", borderBottom: `1px solid ${C.brd}`, fontSize: 11, color: C.t2, fontWeight: 700 }}>{user.name} · {user.role}</div>
              {isA && <button onClick={() => setPg("settings")}
                style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 14px", border: "none", background: pg === "settings" ? C.sf : "transparent",
                  color: C.txt, fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left" }}>
                <Users size={14} /> Manage Users
              </button>}
              <button onClick={logout}
                style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 14px", border: "none", background: "transparent",
                  color: C.red, fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", borderTop: `1px solid ${C.brd}` }}>
                <LogOut size={14} /> Log Out
              </button>
            </div>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
        {pg === "home" && <HomePage isA={isA} isM={isM} go={setPg} pendCt={pendCt} templates={templates} />}
        {(pg === "order" || pg === "return") && <OrderBuilder type={pg} items={items} user={user} orders={orders} sO={sO} sI={sI} templates={templates} go={() => setPg("home")} />}
        {pg === "approvals" && canApprove && <Approvals orders={orders} sO={sO} items={items} sI={sI} view={setVOrd} />}
        {pg === "items" && isA && <ItemMgr items={items} sI={sI} />}
        {pg === "inventory" && isA && <InvMgr items={items} sI={sI} />}
        {pg === "shrinkage" && isA && <ShrinkageMgr items={items} sI={sI} shrinkLog={shrinkLog} sSh={sSh} />}
        {pg === "damage" && <DamageReport items={items} sI={sI} shrinkLog={shrinkLog} sSh={sSh} user={user} />}
        {pg === "gallery" && isA && <DamageGallery shrinkLog={shrinkLog} sSh={sSh} items={items} sI={sI} />}
        {pg === "supplier" && isA && <SupplierCost items={items} sI={sI} />}
        {pg === "templates" && isA && <TplMgr templates={templates} sT={sT} items={items} />}
        {pg === "history" && <History orders={orders} items={items} user={user} isA={isA} isM={isM} view={setVOrd} sO={sO} />}
        {pg === "reports" && isA && <Reports orders={orders} items={items} shrinkLog={shrinkLog} />}
        {pg === "settings" && isA && <SettingsPage users={users} sU={sU} me={user} items={items} orders={orders} templates={templates} shrinkLog={shrinkLog} />}
      </div>
      {vOrd && <OrderPDF order={vOrd} items={items} onClose={() => setVOrd(null)}
        onDelete={canEditOrders ? (id) => {
          const ord = orders.find((o) => o.id === id);
          if (ord) {
            const updatedItems = items.map((it) => {
              const ls = (ord.lines || []).filter((l) => l.itemId === it.id);
              if (!ls.length) return it;
              const v = { ...(it.variants || getVariants(it)) };
              ls.forEach((l) => {
                const optKey = l.option || "_default";
                if (v[optKey]) {
                  if (ord.type === "order") v[optKey] = { ...v[optKey], qty: (v[optKey].qty || 0) + l.qty };
                  else v[optKey] = { ...v[optKey], qty: Math.max(0, (v[optKey].qty || 0) - l.qty) };
                }
              });
              const totalQ = Object.values(v).reduce((s2, x) => s2 + (x.qty || 0), 0);
              return { ...it, variants: v, qtyOnHand: totalQ };
            });
            sI(updatedItems);
          }
          sO(orders.filter((o) => o.id !== id)); setVOrd(null);
        } : null}
        onEdit={canEditOrders ? (id, newLines) => {
          const ord = orders.find((o) => o.id === id);
          if (!ord) return;
          let updatedItems = items.map((it) => {
            const ls = (ord.lines || []).filter((l) => l.itemId === it.id);
            if (!ls.length) return it;
            const v = { ...(it.variants || getVariants(it)) };
            ls.forEach((l) => {
              const optKey = l.option || "_default";
              if (v[optKey]) {
                if (ord.type === "order") v[optKey] = { ...v[optKey], qty: (v[optKey].qty || 0) + l.qty };
                else v[optKey] = { ...v[optKey], qty: Math.max(0, (v[optKey].qty || 0) - l.qty) };
              }
            });
            const totalQ = Object.values(v).reduce((s2, x) => s2 + (x.qty || 0), 0);
            return { ...it, variants: v, qtyOnHand: totalQ };
          });
          updatedItems = updatedItems.map((it) => {
            const ls = newLines.filter((l) => l.itemId === it.id);
            if (!ls.length) return it;
            const v = { ...(it.variants || getVariants(it)) };
            ls.forEach((l) => {
              const optKey = l.option || "_default";
              if (v[optKey]) {
                if (ord.type === "order") v[optKey] = { ...v[optKey], qty: Math.max(0, (v[optKey].qty || 0) - l.qty) };
                else v[optKey] = { ...v[optKey], qty: (v[optKey].qty || 0) + l.qty };
              }
            });
            const totalQ = Object.values(v).reduce((s2, x) => s2 + (x.qty || 0), 0);
            return { ...it, variants: v, qtyOnHand: totalQ };
          });
          sI(updatedItems);
          sO(orders.map((o) => o.id === id ? { ...o, lines: newLines } : o));
          setVOrd({ ...ord, lines: newLines });
        } : null}
      />}
    </div>
  );
}

// ═══ AUTH ═══
function Auth({ users, sU, login }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [show, setShow] = useState(false); const [err, setErr] = useState("");
  const [pending, setPending] = useState(false);
  const go = () => {
    setErr("");
    if (mode === "login") {
      const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase().trim());
      if (!u) { setErr("No account found."); return; }
      if (u.pw !== hP(pw)) { setErr("Wrong password."); return; }
      if (u.role === "pending") { setErr("Your account is waiting for admin approval."); return; }
      login(u);
    } else {
      if (!name.trim() || !email.trim() || !pw.trim()) { setErr("All fields required."); return; }
      if (users.find((x) => x.email.toLowerCase() === email.toLowerCase().trim())) { setErr("Email taken."); return; }
      if (pw.length < 4) { setErr("4+ characters."); return; }
      const u = { id: uid(), name: name.trim(), email: email.trim().toLowerCase(), pw: hP(pw), role: "pending", created: new Date().toISOString() };
      sU([...users, u]);
      setPending(true);
    }
  };

  if (pending) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, padding: 20 }}>
        <div className="fu" style={{ ...crd, maxWidth: 400, width: "100%", textAlign: "center" }}>
          <img src={LOGO} alt="Roof USA" style={{ height: 80, marginBottom: 12 }} />
          <div style={{ display: "inline-flex", background: C.wrn + "20", borderRadius: 16, padding: 20, marginBottom: 16 }}><Clock size={48} color={C.wrn} /></div>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>Account Created</h2>
          <p style={{ color: C.t2, fontSize: 14, marginBottom: 20 }}>Your account is waiting for admin approval. You'll be able to log in once an administrator approves your access.</p>
          <button onClick={() => { setPending(false); setMode("login"); setErr(""); }} style={bP}>Back to Login</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, padding: 20 }}>
      <div className="fu" style={{ ...crd, maxWidth: 400, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <img src={LOGO} alt="Roof USA" style={{ height: 80, marginBottom: 12 }} />
          <div style={{ fontSize: 10, color: C.t2, fontWeight: 700, letterSpacing: ".12em", marginTop: 2 }}>MATERIALS PORTAL</div>
        </div>
        {mode === "register" && <Fld label="Name"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={inp} /></Fld>}
        <Fld label="Email"><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" style={inp} type="email" /></Fld>
        <Fld label="Password">
          <div style={{ position: "relative" }}>
            <input value={pw} onChange={(e) => setPw(e.target.value)} type={show ? "text" : "password"} placeholder="••••" style={inp} onKeyDown={(e) => e.key === "Enter" && go()} />
            <button onClick={() => setShow(!show)} style={{ position: "absolute", right: 10, top: 10, background: "none", border: "none", color: C.t2, cursor: "pointer" }}>{show ? <EyeOff size={15} /> : <Eye size={15} />}</button>
          </div>
        </Fld>
        {err && <div style={{ color: C.red, fontSize: 12, marginBottom: 10, fontWeight: 600 }}>{err}</div>}
        <button onClick={go} style={{ ...bP, width: "100%", justifyContent: "center", padding: "14px", fontSize: 16, marginTop: 4 }}>{mode === "login" ? "Sign In" : "Create Account"}</button>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: C.t2 }}>
          {mode === "login" ? <>No account? <span onClick={() => { setMode("register"); setErr(""); }} style={{ color: C.ac, cursor: "pointer", fontWeight: 600 }}>Sign up</span></> : <>Have an account? <span onClick={() => { setMode("login"); setErr(""); }} style={{ color: C.ac, cursor: "pointer", fontWeight: 600 }}>Sign in</span></>}
        </div>
      </div>
    </div>
  );
}

// ═══ HOME ═══
function HomePage({ isA, isM, go, pendCt, templates }) {
  return (
    <div className="fu">
      <div style={{ textAlign: "center", paddingTop: 40, paddingBottom: 30 }}>
        <img src={LOGO} alt="" style={{ height: 70, marginBottom: 16 }} />
        <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-.02em", fontFamily: BC }}>WHAT DO YOU NEED?</h1>
      </div>
      <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", maxWidth: 900, margin: "0 auto" }}>
        <BigBtn icon={<FileText size={40} />} label="Start Order" sub="Build a new material order" color={RED} onClick={() => go("order")} />
        <BigBtn icon={<RotateCcw size={40} />} label="Start Return" sub="Return materials to inventory" color={C.blu} onClick={() => go("return")} />
      </div>
      {(isA || isM) && pendCt > 0 && (
        <div style={{ ...crd, maxWidth: 700, margin: "30px auto 0", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => go("approvals")}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: "#E6A81722", borderRadius: 8, padding: 10, display: "flex" }}><Clock size={20} color={C.wrn} /></div>
            <div><div style={{ fontWeight: 700 }}>{pendCt} order{pendCt > 1 ? "s" : ""} pending approval</div><div style={{ fontSize: 12, color: C.t2 }}>Review and approve submitted orders</div></div>
          </div>
          <ChevronRight size={18} color={C.t2} />
        </div>
      )}
      {/* Templates — visible to everyone */}
      {templates.length > 0 && (
        <div style={{ maxWidth: 700, margin: "20px auto 0" }}>
          <div style={{ ...lbl, marginBottom: 8 }}>Quick Start from Template</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {templates.map((t) => (
              <button key={t.id} onClick={() => go("order")} style={{ ...crd, cursor: "pointer", padding: "14px 18px", border: `2px solid ${C.brd}`, flex: "1 1 200px", textAlign: "left", transition: "all .15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = RED; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.brd; }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: C.t2, marginTop: 4 }}>{(t.items || []).length} items</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
function BigBtn({ icon, label, sub, color, onClick }) {
  return (
    <button onClick={onClick} style={{ ...crd, width: 280, padding: "44px 28px", textAlign: "center", cursor: "pointer", border: `2px solid ${C.brd}`, transition: "all .2s", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.brd; e.currentTarget.style.transform = "translateY(0)"; }}>
      <div style={{ color }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 800, fontFamily: BC }}>{label}</div>
      <div style={{ fontSize: 13, color: C.t2 }}>{sub}</div>
    </button>
  );
}

// ═══ ORDER BUILDER ═══
function OrderBuilder({ type, items, user, orders, sO, sI, templates, go }) {
  const [po, setPo] = useState(""); const [job, setJob] = useState(""); const [addr, setAddr] = useState(""); const [notes, setNotes] = useState("");
  const [lines, setLines] = useState([]); const [search, setSearch] = useState(""); const [cat, setCat] = useState("All"); const [done, setDone] = useState(false);
  const [step, setStep] = useState("choose"); // choose, build

  const active = items.filter((i) => i.active !== false);
  const cats = ["All", ...new Set(active.map((i) => i.category))];
  const filt = active.filter((i) => {
    if (cat !== "All" && i.category !== cat) return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase()) && !(i.options || []).join(" ").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const iMap = Object.fromEntries(items.map((i) => [i.id, i]));
  const tCost = lines.reduce((s, l) => s + l.qty * (l.unitCost || 0), 0);
  const tSell = lines.reduce((s, l) => s + l.qty * (l.markupCost || 0), 0);

  const addLn = (it, opt) => {
    const key = it.id + ":" + (opt || "");
    if (lines.find((l) => l.key === key)) return;
    const v = getVariants(it);
    const vData = v[opt || "_default"] || { wac: it.wacCost || 0 };
    const variantWac = vData.wac || it.wacCost || 0;
    setLines([...lines, { key, itemId: it.id, qty: 1, option: opt || "", unitCost: variantWac, markupCost: variantWac * (1 + (it.markup || 0) / 100), supplierCost: it.supplierCost || 0 }]);
  };

  const loadTemplate = (tpl) => {
    const newLines = (tpl.items || []).map((ti) => {
      const it = iMap[ti.itemId];
      if (!it) return null;
      return { key: ti.itemId + ":" + (ti.option || ""), itemId: ti.itemId, qty: ti.qty || 1, option: ti.option || "", unitCost: it.wacCost || 0, markupCost: (it.wacCost || 0) * (1 + (it.markup || 0) / 100), supplierCost: it.supplierCost || 0 };
    }).filter(Boolean);
    setLines(newLines);
    setStep("build");
  };

  const updLn = (i, f, v) => { const n = [...lines]; n[i] = { ...n[i], [f]: v }; setLines(n); };
  const rmLn = (i) => setLines(lines.filter((_, j) => j !== i));

  const submit = () => {
    if (!lines.length) return;
    const ord = { id: uid(), type, userId: user.id, userName: user.name, poNumber: po.trim(), jobName: job.trim(), jobAddress: addr.trim(), notes: notes.trim(), date: new Date().toISOString(), status: "pending", lines: lines.map((l) => ({ itemId: l.itemId, qty: l.qty, option: l.option, unitCost: l.unitCost, markupCost: l.markupCost, supplierCost: l.supplierCost || 0 })) };
    if (type === "order") {
      sI(items.map((it) => {
        const ls2 = lines.filter((l) => l.itemId === it.id);
        if (!ls2.length) return it;
        const v = { ...(getVariants(it)) };
        ls2.forEach((l) => {
          const optKey = l.option || "_default";
          if (v[optKey]) v[optKey] = { ...v[optKey], qty: Math.max(0, (v[optKey].qty || 0) - l.qty) };
        });
        const totalQ = Object.values(v).reduce((s, x) => s + (x.qty || 0), 0);
        return { ...it, variants: v, qtyOnHand: totalQ };
      }));
    } else {
      sI(items.map((it) => {
        const ls2 = lines.filter((l) => l.itemId === it.id);
        if (!ls2.length) return it;
        const v = { ...(getVariants(it)) };
        ls2.forEach((l) => {
          const optKey = l.option || "_default";
          if (v[optKey]) v[optKey] = { ...v[optKey], qty: (v[optKey].qty || 0) + l.qty };
          else v[optKey] = { qty: l.qty, wac: l.unitCost || 0 };
        });
        const totalQ = Object.values(v).reduce((s, x) => s + (x.qty || 0), 0);
        return { ...it, variants: v, qtyOnHand: totalQ };
      }));
    }
    sO([...orders, ord]); setDone(true);
  };

  if (done) return (
    <div className="fu" style={{ textAlign: "center", paddingTop: 60 }}>
      <div style={{ display: "inline-flex", background: C.grn + "22", borderRadius: 16, padding: 20, marginBottom: 20 }}><CheckCircle size={48} color={C.grn} /></div>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>{type === "return" ? "Return" : "Order"} Submitted</h2>
      <p style={{ color: C.t2, marginBottom: 24 }}>PO #{po || "N/A"} submitted for approval.</p>
      <button onClick={go} style={bP}><Home size={14} /> Back Home</button>
    </div>
  );

  if (step === "choose" && type === "order" && templates.length > 0) return (
    <div className="fu">
      <button onClick={go} style={{ ...bS, marginBottom: 16, padding: "8px 14px", fontSize: 13 }}><ArrowLeft size={14} /> Back</button>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 20, fontFamily: BC }}>HOW DO YOU WANT TO START?</h1>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <BigBtn icon={<Plus size={36} />} label="From Scratch" sub="Pick items manually" color={C.blu} onClick={() => setStep("build")} />
        {templates.map((t) => (
          <BigBtn key={t.id} icon={<Copy size={36} />} label={t.name} sub={`${(t.items || []).length} items`} color={RED} onClick={() => loadTemplate(t)} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="fu">
      <button onClick={step === "build" && templates.length > 0 && type === "order" ? () => setStep("choose") : go} style={{ ...bS, marginBottom: 16, padding: "8px 14px", fontSize: 13 }}><ArrowLeft size={14} /> Back</button>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4, fontFamily: BC }}>NEW {type === "return" ? "RETURN" : "ORDER"}</h1>
      <p style={{ color: C.t2, fontSize: 13, marginBottom: 20 }}>Select items, choose options, enter quantities, and submit for approval.</p>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 420px", minWidth: 300 }}>
          <div style={{ ...crd, marginBottom: 14 }}>
            <Rw><Cl f={1}><Fld label="PO #"><input value={po} onChange={(e) => setPo(e.target.value)} placeholder="PO-001" style={inp} /></Fld></Cl>
            <Cl f={2}><Fld label="Job Name"><input value={job} onChange={(e) => setJob(e.target.value)} placeholder="Customer / Job" style={inp} /></Fld></Cl></Rw>
            <Fld label="Job Address"><input value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="Optional" style={inp} /></Fld>
            <Fld label="Notes"><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" rows={2} style={{ ...inp, resize: "vertical" }} /></Fld>
          </div>
          <div style={crd}>
            <div style={{ ...lbl, marginBottom: 10 }}>Add Items</div>
            <Rw g={8}>
              <Cl f={2}><div style={{ position: "relative" }}><Search size={13} style={{ position: "absolute", left: 10, top: 11, color: C.t2 }} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." style={{ ...inp, paddingLeft: 30 }} /></div></Cl>
              <Cl f={1}><select value={cat} onChange={(e) => setCat(e.target.value)} style={{ ...inp, cursor: "pointer" }}>{cats.map((c) => <option key={c}>{c}</option>)}</select></Cl>
            </Rw>
            <div style={{ maxHeight: 350, overflow: "auto", marginTop: 10 }}>
              {filt.length === 0 && <div style={{ padding: 20, textAlign: "center", color: C.t2, fontSize: 13 }}>No items found.</div>}
              {filt.map((it) => {
                const opts = it.options && it.options.length > 0 ? it.options : [""];
                return (
                  <div key={it.id} style={{ padding: "8px 4px", borderBottom: `1px solid ${C.brd}` }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{it.name} <span style={{ fontWeight: 400, color: C.t2, fontSize: 11 }}>· {it.category} · {totalStock(it)} {it.unit} total</span></div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                      {opts.map((opt) => {
                        const added = lines.find((l) => l.key === it.id + ":" + opt);
                        const vData = (getVariants(it))[opt] || { qty: 0 };
                        return (
                          <button key={opt || "__none"} onClick={() => addLn(it, opt)} disabled={!!added}
                            style={{ ...bS, padding: "3px 10px", fontSize: 11, borderRadius: 4, opacity: added ? 0.3 : 1, flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
                            <span><Plus size={10} /> {opt || "Add"}</span>
                            <span style={{ fontSize: 9, color: C.t2 }}>{vData.qty} avail</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* SUMMARY */}
        <div style={{ flex: "1 1 310px", minWidth: 280 }}>
          <div style={{ ...crd, position: "sticky", top: 70 }}>
            <div style={{ ...lbl, marginBottom: 10 }}>Summary · {lines.length} line{lines.length !== 1 ? "s" : ""}</div>
            {!lines.length && <div style={{ padding: 24, textAlign: "center", color: C.t2, fontSize: 13 }}>Add items from the left</div>}
            {lines.map((l, i) => {
              const it = iMap[l.itemId] || { name: "?", unit: "" };
              return (
                <div key={l.key} style={{ padding: "10px 0", borderBottom: `1px solid ${C.brd}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{it.name}{l.option ? <span style={{ fontWeight: 400, color: C.t2 }}> · {l.option}</span> : null}</div>
                    <button onClick={() => rmLn(i)} style={{ background: "none", border: "none", color: C.t2, cursor: "pointer" }}><Trash2 size={13} /></button>
                  </div>
                  <Rw g={8}>
                    <Cl f={1}><div style={{ fontSize: 10, color: C.t2, marginBottom: 2 }}>QTY</div><input type="number" min="1" value={l.qty} onChange={(e) => updLn(i, "qty", Math.max(1, +e.target.value))} style={{ ...inp, padding: "6px 8px", fontSize: 13, textAlign: "center" }} /></Cl>
                  </Rw>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11 }}>
                    <span style={{ color: C.t2 }}>Cost: {fmt$(l.unitCost)} · Sell: {fmt$(l.markupCost)}</span>
                    <span style={{ fontFamily: MN, fontWeight: 600, color: C.ac }}>{fmt$(l.qty * l.markupCost)}</span>
                  </div>
                </div>
              );
            })}
            {lines.length > 0 && <>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `2px solid ${C.brdL}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}><span style={{ color: C.t2 }}>Our Cost</span><span style={{ fontFamily: MN }}>{fmt$(tCost)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 800 }}><span>Sell Total</span><span style={{ fontFamily: MN, color: C.ac }}>{fmt$(tSell)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.grn, marginTop: 4 }}><span>Margin</span><span style={{ fontFamily: MN }}>{fmt$(tSell - tCost)}</span></div>
              </div>
              <button onClick={submit} style={{ ...bP, width: "100%", justifyContent: "center", marginTop: 12, padding: 14, fontSize: 15 }}><Check size={16} /> Submit {type === "return" ? "Return" : "Order"}</button>
            </>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══ APPROVALS ═══
function Approvals({ orders, sO, items, sI, view }) {
  const pend = orders.filter((o) => o.status === "pending").sort((a, b) => new Date(b.date) - new Date(a.date));
  const [jnConfirm, setJnConfirm] = useState(null);
  const [deleteWarn, setDeleteWarn] = useState(null);

  const approve = (id) => {
    const order = orders.find((o) => o.id === id);
    sO(orders.map((o) => o.id === id ? { ...o, status: "approved", approvedDate: new Date().toISOString() } : o));
    // Download the file, then show JN confirmation
    if (order) downloadPDF({ ...order, status: "approved" }, items);
    setJnConfirm(order);
  };
  const reject = (id) => { if (confirm("Reject this order?")) sO(orders.map((o) => o.id === id ? { ...o, status: "rejected", approvedDate: new Date().toISOString() } : o)); };
  const deleteOrder = (id) => {
    const ord = orders.find((o) => o.id === id);
    if (ord && sI) {
      sI(items.map((it) => {
        const ls = (ord.lines || []).filter((l) => l.itemId === it.id);
        if (!ls.length) return it;
        const v = { ...(it.variants || getVariants(it)) };
        ls.forEach((l) => { const k = l.option || "_default"; if (v[k]) { v[k] = { ...v[k], qty: ord.type === "order" ? (v[k].qty || 0) + l.qty : Math.max(0, (v[k].qty || 0) - l.qty) }; } });
        return { ...it, variants: v, qtyOnHand: Object.values(v).reduce((s2, x) => s2 + (x.qty || 0), 0) };
      }));
    }
    sO(orders.filter((o) => o.id !== id));
    setDeleteWarn(null);
  };

  return (
    <div className="fu">
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4, fontFamily: BC }}>PENDING APPROVALS</h1>
      <p style={{ color: C.t2, fontSize: 13, marginBottom: 20 }}>{pend.length} order{pend.length !== 1 ? "s" : ""} to review</p>
      {!pend.length && <Empty msg="All caught up — nothing pending." />}
      {pend.map((o) => {
        const tot = o.lines.reduce((s, l) => s + l.qty * (l.markupCost || 0), 0);
        const cost = o.lines.reduce((s, l) => s + l.qty * (l.unitCost || 0), 0);
        return (
          <div key={o.id} style={{ ...crd, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, fontFamily: BC }}>{o.type === "return" ? "RETURN" : "ORDER"}</span>
                  <Badge status={o.status} />
                  {o.poNumber && <span style={{ fontSize: 12, fontFamily: MN, color: C.t2 }}>PO: {o.poNumber}</span>}
                </div>
                <div style={{ fontSize: 12, color: C.t2 }}>By {o.userName} · {fD(o.date)}{o.jobName ? ` · ${o.jobName}` : ""}</div>
                <div style={{ fontSize: 12, color: C.t2, marginTop: 2 }}>{o.lines.length} items · Cost: {fmt$(cost)} · Sell: <strong style={{ color: C.ac }}>{fmt$(tot)}</strong></div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button onClick={() => view(o)} style={{ ...bS, padding: "8px 12px", fontSize: 12 }}><Eye size={13} /> View</button>
                <button onClick={() => setDeleteWarn(o)} style={{ ...bS, padding: "8px 12px", fontSize: 12, color: C.red, borderColor: C.red + "44" }}><Trash2 size={13} /> Delete</button>
                <button onClick={() => reject(o.id)} style={{ ...bD, padding: "8px 12px", fontSize: 12 }}><XCircle size={13} /> Reject</button>
                <button onClick={() => approve(o.id)} style={{ ...bP, padding: "8px 12px", fontSize: 12, background: C.grn }}><CheckCircle size={13} /> Approve</button>
              </div>
            </div>
          </div>
        );
      })}

      {/* DELETE WARNING MODAL */}
      <Modal open={!!deleteWarn} onClose={() => setDeleteWarn(null)} title="">
        {deleteWarn && (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ background: C.red + "15", borderRadius: 16, padding: 20, display: "inline-flex", marginBottom: 16 }}>
              <AlertTriangle size={48} color={C.red} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: C.red, marginBottom: 8 }}>DELETE THIS ORDER?</h2>
            <p style={{ color: C.t2, fontSize: 14, marginBottom: 6 }}>PO: <strong>{deleteWarn.poNumber || "N/A"}</strong> — {deleteWarn.userName}</p>
            <p style={{ color: C.red, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>This action CANNOT be undone. The order will be permanently removed.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setDeleteWarn(null)} style={{ ...bS, padding: "14px 32px", fontSize: 15 }}>Cancel</button>
              <button onClick={() => deleteOrder(deleteWarn.id)} style={{ ...bD, padding: "14px 32px", fontSize: 15 }}><Trash2 size={16} /> Yes, Delete Forever</button>
            </div>
          </div>
        )}
      </Modal>

      {/* JOBNIMBUS CONFIRMATION MODAL */}
      <Modal open={!!jnConfirm} onClose={() => {}} title="">
        {jnConfirm && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <img src={LOGO} alt="Roofus" style={{ height: 50, marginBottom: 16 }} />
            <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8, fontFamily: BC }}>ORDER APPROVED & PDF SAVED</h2>
            <p style={{ color: C.t2, fontSize: 14, marginBottom: 24 }}>PO: <strong>{jnConfirm.poNumber || "N/A"}</strong> has been approved and the PDF is downloading.</p>
            <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: NAVY }}>Have you uploaded this PDF to JobNimbus?</p>
            <button onClick={() => setJnConfirm(null)}
              style={{ background: C.grn, color: C.w, border: "none", borderRadius: 12, padding: "20px 50px", fontSize: 18, fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 12, transition: "all .2s", boxShadow: "0 4px 12px rgba(30,132,73,0.3)" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>
              <CheckCircle size={32} /> Yes, Uploaded to JobNimbus
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ═══ ITEM MANAGER (multi-option subcategories) ═══
function ItemMgr({ items, sI }) {
  const [modal, setModal] = useState(null); const [search, setSearch] = useState(""); const [cat, setCat] = useState("All");
  const cats = ["All", ...new Set(items.map((i) => i.category))];
  const filt = items.filter((i) => {
    if (cat !== "All" && i.category !== cat) return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="fu">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 900, fontFamily: BC }}>ITEMS</h1><p style={{ color: C.t2, fontSize: 13, marginTop: 4 }}>{items.length} in catalog</p></div>
        <button onClick={() => setModal("new")} style={bP}><Plus size={14} /> Add Item</button>
      </div>
      <Rw g={10}>
        <Cl f={2}><div style={{ position: "relative" }}><Search size={13} style={{ position: "absolute", left: 10, top: 11, color: C.t2 }} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." style={{ ...inp, paddingLeft: 30, marginBottom: 14 }} /></div></Cl>
        <Cl><select value={cat} onChange={(e) => setCat(e.target.value)} style={{ ...inp, cursor: "pointer", marginBottom: 14 }}>{cats.map((c) => <option key={c}>{c}</option>)}</select></Cl>
      </Rw>
      <div style={{ ...crd, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead><tr style={{ borderBottom: `1px solid ${C.brdL}` }}>
              {["Item", "Category", "Color/Style", "On Hand", "WAC", "Markup", "Sell", ""].map((h) => (
                <th key={h} style={{ padding: "10px 10px", textAlign: "left", fontWeight: 700, color: C.t2, fontSize: 10, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {!filt.length && <tr><td colSpan={8} style={{ padding: 30, textAlign: "center", color: C.t2 }}>No items yet.</td></tr>}
              {filt.map((it) => {
                const v = getVariants(it);
                const entries = Object.entries(v);
                const totalQ = totalStock(it);
                return entries.map(([optName, vData], vi) => (
                  <tr key={it.id + optName} style={{ borderBottom: `1px solid ${C.brd}` }}>
                    <td style={{ padding: "9px 10px", fontWeight: vi === 0 ? 700 : 400 }}>
                      {vi === 0 ? it.name : ""}
                      {vi === 0 && entries.length > 1 && <span style={{ fontSize: 10, color: C.t2, marginLeft: 6 }}>({totalQ} total)</span>}
                    </td>
                    <td style={{ padding: "9px 10px", color: C.t2 }}>{vi === 0 ? it.category : ""}</td>
                    <td style={{ padding: "9px 10px", fontWeight: 600, fontSize: 12, color: optName === "_default" ? C.t2 : C.txt }}>{optName === "_default" ? "—" : optName}</td>
                    <td style={{ padding: "9px 10px", fontFamily: MN, fontWeight: 600, color: (vData.qty || 0) <= 0 ? C.red : C.txt }}>{vData.qty || 0} {it.unit}</td>
                    <td style={{ padding: "9px 10px", fontFamily: MN }}>{fmt$(vData.wac)}</td>
                    <td style={{ padding: "9px 10px", fontFamily: MN }}>{vi === 0 ? `${it.markup || 0}%` : ""}</td>
                    <td style={{ padding: "9px 10px", fontFamily: MN, fontWeight: 600, color: C.ac }}>{fmt$((vData.wac || 0) * (1 + (it.markup || 0) / 100))}</td>
                    <td style={{ padding: "9px 10px" }}>
                      {vi === 0 && <div style={{ display: "flex", gap: 5 }}>
                        <button onClick={() => setModal(it)} style={{ background: "none", border: "none", color: C.t2, cursor: "pointer" }}><Edit3 size={13} /></button>
                        <button onClick={() => { if (confirm(`Delete "${it.name}"?`)) sI(items.filter((x) => x.id !== it.id)); }} style={{ background: "none", border: "none", color: C.t2, cursor: "pointer" }}><Trash2 size={13} /></button>
                      </div>}
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      </div>
      <ItemModal open={modal} onClose={() => setModal(null)} items={items} sI={sI} ed={modal && modal !== "new" ? modal : null} />
    </div>
  );
}

function ItemModal({ open, onClose, items, sI, ed }) {
  const [name, setName] = useState(""); const [cat, setCat] = useState(CATS[0]); const [unit, setUnit] = useState(UNITS[0]);
  const [cost, setCost] = useState(""); const [mk, setMk] = useState("30");
  const [optStr, setOptStr] = useState("");
  const [variantMinStocks, setVariantMinStocks] = useState({}); // { optionName: minStockValue }

  useEffect(() => {
    if (ed) {
      setName(ed.name); setCat(ed.category); setUnit(ed.unit); setCost(ed.wacCost || ""); setMk(ed.markup ?? "30");
      setOptStr((ed.options || []).join(", "));
      // Load per-variant minStocks from existing variants
      const vms = {};
      const v = ed.variants || {};
      Object.entries(v).forEach(([opt, vd]) => { if (vd.minStock) vms[opt] = vd.minStock; });
      // Also check legacy item-level minStock
      if (ed.minStock && Object.keys(vms).length === 0) {
        const opts = ed.options && ed.options.length > 0 ? ed.options : ["_default"];
        opts.forEach((o) => { vms[o] = ed.minStock; });
      }
      setVariantMinStocks(vms);
    } else {
      setName(""); setCat(CATS[0]); setUnit(UNITS[0]); setCost(""); setMk("30"); setOptStr(""); setVariantMinStocks({});
    }
  }, [ed, open]);

  if (!open) return null;
  const sell = (+cost || 0) * (1 + (+mk || 0) / 100);
  const parsedOpts = optStr.split(",").map((s) => s.trim()).filter(Boolean);
  const effectiveOpts = parsedOpts.length > 0 ? parsedOpts : ["_default"];

  const setVarMin = (opt, val) => {
    setVariantMinStocks((prev) => ({ ...prev, [opt]: val }));
  };

  const save = () => {
    if (!name.trim() || !cost) return;
    const opts = parsedOpts;
    if (ed) {
      const existingVariants = ed.variants || {};
      const newOpts = opts.length > 0 ? opts : ["_default"];
      const updatedVariants = {};
      newOpts.forEach((o) => {
        const existing = existingVariants[o] || { qty: 0, wac: +cost };
        updatedVariants[o] = { ...existing, minStock: +(variantMinStocks[o] || 0) || 0 };
      });
      const totalQ = Object.values(updatedVariants).reduce((s, x) => s + (x.qty || 0), 0);
      sI(items.map((i) => i.id === ed.id ? { ...i, name: name.trim(), category: cat, unit, wacCost: +cost, markup: +mk, options: opts, variants: updatedVariants, qtyOnHand: totalQ } : i));
    } else {
      const initVariants = {};
      effectiveOpts.forEach((o) => { initVariants[o] = { qty: 0, wac: +cost, minStock: +(variantMinStocks[o] || 0) || 0 }; });
      sI([...items, { id: uid(), name: name.trim(), category: cat, unit, wacCost: +cost, markup: +mk, qtyOnHand: 0, active: true, options: opts, variants: initVariants }]);
    }
    onClose();
  };

  return (
    <Modal open title={ed ? "Edit Item" : "Add Item"} onClose={onClose} wide={parsedOpts.length > 3}>
      <Fld label="Item Name"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. OC Duration" style={inp} /></Fld>
      <Rw>
        <Cl><Fld label="Category"><select value={cat} onChange={(e) => setCat(e.target.value)} style={{ ...inp, cursor: "pointer" }}>{CATS.map((c) => <option key={c}>{c}</option>)}</select></Fld></Cl>
        <Cl><Fld label="Unit"><select value={unit} onChange={(e) => setUnit(e.target.value)} style={{ ...inp, cursor: "pointer" }}>{UNITS.map((u) => <option key={u}>{u}</option>)}</select></Fld></Cl>
      </Rw>
      <Fld label="Options (colors, styles — comma separated)">
        <input value={optStr} onChange={(e) => setOptStr(e.target.value)} placeholder="e.g. Onyx Black, Estate Gray, Brownwood" style={inp} />
        {parsedOpts.length > 0 && <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>{parsedOpts.map((o) => <span key={o} style={{ background: C.sf, padding: "2px 8px", borderRadius: 4, fontSize: 11, color: C.txt }}>{o}</span>)}</div>}
      </Fld>
      <Rw>
        <Cl><Fld label="Our Cost ($)"><input type="number" step=".01" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="0.00" style={inp} /></Fld></Cl>
        <Cl><Fld label="Markup %"><input type="number" value={mk} onChange={(e) => setMk(e.target.value)} placeholder="30" style={inp} /></Fld></Cl>
        <Cl><Fld label="Sell Price"><div style={{ ...inp, background: C.brd, fontFamily: MN, fontWeight: 700, color: C.ac }}>{fmt$(sell)}</div></Fld></Cl>
      </Rw>

      {/* Per-variant low stock thresholds */}
      <Fld label={parsedOpts.length > 0 ? "Low Stock Alert — per color/style" : "Low Stock Alert"}>
        {parsedOpts.length === 0 ? (
          <input type="number" value={variantMinStocks["_default"] || ""} onChange={(e) => setVarMin("_default", e.target.value)} placeholder="Min qty before warning" style={inp} />
        ) : (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {parsedOpts.map((opt) => (
              <div key={opt} style={{ flex: "1 1 120px", minWidth: 100 }}>
                <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: C.txt }}>{opt}</div>
                <input type="number" value={variantMinStocks[opt] || ""} onChange={(e) => setVarMin(opt, e.target.value)}
                  placeholder="Min" style={{ ...inp, padding: "7px 10px", fontSize: 12, textAlign: "center" }} />
              </div>
            ))}
          </div>
        )}
      </Fld>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
        <button onClick={onClose} style={bS}>Cancel</button>
        <button onClick={save} style={bP}><Check size={14} /> {ed ? "Save" : "Add Item"}</button>
      </div>
    </Modal>
  );
}

// ═══ HELPERS: variant-level stock ═══
function getVariants(it) {
  if (it.variants && Object.keys(it.variants).length > 0) return it.variants;
  const opts = (it.options && it.options.length > 0) ? it.options : ["_default"];
  const v = {};
  opts.forEach((o) => { v[o] = { qty: 0, wac: it.wacCost || 0, minStock: 0 }; });
  if ((it.qtyOnHand || 0) > 0 && opts.length > 0) {
    v[opts[0]] = { ...v[opts[0]], qty: it.qtyOnHand || 0, wac: it.wacCost || 0 };
  }
  return v;
}
function totalStock(it) {
  const v = getVariants(it);
  return Object.values(v).reduce((s, x) => s + (x.qty || 0), 0);
}
function overallWAC(it) {
  const v = getVariants(it);
  const entries = Object.values(v).filter((x) => x.qty > 0);
  if (!entries.length) return it.wacCost || 0;
  const totalCost = entries.reduce((s, x) => s + x.qty * x.wac, 0);
  const totalQty = entries.reduce((s, x) => s + x.qty, 0);
  return totalQty > 0 ? Math.round(totalCost / totalQty * 100) / 100 : 0;
}
// Returns array of {itemId, itemName, optName, qty, minStock, unit, category} for variants below threshold
function getLowStockVariants(items) {
  const low = [];
  items.forEach((it) => {
    const v = getVariants(it);
    Object.entries(v).forEach(([optName, vd]) => {
      const ms = vd.minStock || 0;
      if (ms > 0 && (vd.qty || 0) <= ms) {
        low.push({ itemId: it.id, itemName: it.name, optName, qty: vd.qty || 0, minStock: ms, unit: it.unit, category: it.category, wac: vd.wac || 0 });
      }
    });
  });
  return low;
}

// ═══ INVENTORY (WAC) — bulk receive ═══
function InvMgr({ items, sI }) {
  const [lines, setLines] = useState([]); // [{itemId, option, qty, cost}]
  const [note, setNote] = useState("");
  const [log, setLog] = useState([]);
  const [done, setDone] = useState(false);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");

  useEffect(() => { (async () => { setLog(await ld("inv_log", [])); })(); }, []);
  const svLog = useCallback((l) => { setLog(l); sv("inv_log", l); }, []);

  const cats = ["All", ...new Set(items.map((i) => i.category))];
  const filtered = items.filter((i) => {
    if (catFilter !== "All" && i.category !== catFilter) return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

  const addLine = (item, opt) => {
    const key = item.id + ":" + (opt || "_default");
    if (lines.find((l) => l.key === key)) return;
    const v = getVariants(item);
    const vd = v[opt || "_default"] || { qty: 0, wac: item.wacCost || 0 };
    setLines([...lines, { key, itemId: item.id, itemName: item.name, option: opt || "_default", qty: "", cost: "", currentQty: vd.qty, currentWac: vd.wac, unit: item.unit }]);
  };
  const updLine = (i, f, val) => { const n = [...lines]; n[i] = { ...n[i], [f]: val }; setLines(n); };
  const rmLine = (i) => setLines(lines.filter((_, j) => j !== i));

  const validLines = lines.filter((l) => +l.qty > 0 && +l.cost > 0);
  const totalUnits = validLines.reduce((s, l) => s + (+l.qty), 0);
  const totalCostVal = validLines.reduce((s, l) => s + (+l.qty) * (+l.cost), 0);

  const receiveAll = () => {
    if (!validLines.length) return;
    const newLogEntries = [];
    let updatedItems = [...items];

    validLines.forEach((l) => {
      const idx = updatedItems.findIndex((i) => i.id === l.itemId);
      if (idx < 0) return;
      const it = updatedItems[idx];
      const v = { ...(it.variants || getVariants(it)) };
      const curV = v[l.option] || { qty: 0, wac: it.wacCost || 0, minStock: 0 };
      const oQ = curV.qty || 0, oC = curV.wac || 0, nQ = +l.qty, nC = +l.cost;
      const tQ = oQ + nQ;
      const wac = tQ > 0 ? Math.round((oQ * oC + nQ * nC) / tQ * 100) / 100 : nC;
      v[l.option] = { ...curV, qty: tQ, wac };
      const totalQ = Object.values(v).reduce((s, x) => s + (x.qty || 0), 0);
      const totalC = Object.values(v).filter((x) => x.qty > 0).reduce((s, x) => s + x.qty * x.wac, 0);
      const itemWac = totalQ > 0 ? Math.round(totalC / totalQ * 100) / 100 : wac;
      updatedItems[idx] = { ...it, variants: v, qtyOnHand: totalQ, wacCost: itemWac };
      const displayName = l.itemName + (l.option !== "_default" ? ` (${l.option})` : "");
      newLogEntries.push({ id: uid(), itemId: l.itemId, itemName: displayName, option: l.option, qty: nQ, unitCost: nC, prevWAC: oC, newWAC: wac, prevQty: oQ, newQty: tQ, date: new Date().toISOString(), note: note.trim() });
    });

    sI(updatedItems);
    svLog([...newLogEntries, ...log]);
    setDone(true);
    setTimeout(() => { setDone(false); setLines([]); setNote(""); }, 2000);
  };

  return (
    <div className="fu">
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4, fontFamily: BC }}>RECEIVE INVENTORY</h1>
      <p style={{ color: C.t2, fontSize: 13, marginBottom: 20 }}>Add multiple items at once. Prices blend using weighted average costing.</p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* LEFT: Item picker */}
        <div style={{ flex: "1 1 360px", minWidth: 280 }}>
          <div style={crd}>
            <div style={{ ...lbl, marginBottom: 10 }}>Add Items to Receive</div>
            <Rw g={8}>
              <Cl f={2}><div style={{ position: "relative" }}><Search size={13} style={{ position: "absolute", left: 10, top: 11, color: C.t2 }} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." style={{ ...inp, paddingLeft: 30 }} /></div></Cl>
              <Cl f={1}><select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={{ ...inp, cursor: "pointer" }}>{cats.map((c) => <option key={c}>{c}</option>)}</select></Cl>
            </Rw>
            <div style={{ maxHeight: 400, overflow: "auto", marginTop: 10 }}>
              {filtered.map((it) => {
                const opts = it.options && it.options.length > 0 ? it.options : ["_default"];
                return (
                  <div key={it.id} style={{ padding: "8px 4px", borderBottom: `1px solid ${C.brd}` }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{it.name} <span style={{ fontWeight: 400, color: C.t2, fontSize: 11 }}>· {it.category} · {totalStock(it)} {it.unit}</span></div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                      {opts.map((opt) => {
                        const added = lines.find((l) => l.key === it.id + ":" + opt);
                        const vData = getVariants(it)[opt] || { qty: 0 };
                        return (
                          <button key={opt} onClick={() => addLine(it, opt === "_default" ? "_default" : opt)} disabled={!!added}
                            style={{ ...bS, padding: "3px 10px", fontSize: 11, borderRadius: 4, opacity: added ? 0.3 : 1, flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
                            <span><Plus size={10} /> {opt === "_default" ? "Add" : opt}</span>
                            <span style={{ fontSize: 9, color: C.t2 }}>{vData.qty} on hand</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: Receive lines */}
        <div style={{ flex: "1 1 380px", minWidth: 300 }}>
          <div style={{ ...crd, position: "sticky", top: 70 }}>
            <div style={{ ...lbl, marginBottom: 10 }}>Receiving — {lines.length} item{lines.length !== 1 ? "s" : ""}</div>
            {!lines.length && <div style={{ padding: 24, textAlign: "center", color: C.t2, fontSize: 13 }}>Pick items from the left to receive</div>}
            {lines.map((l, i) => {
              const previewQty = (+l.qty || 0) + l.currentQty;
              const previewWac = (+l.qty > 0 && +l.cost > 0) ? ((l.currentQty * l.currentWac + (+l.qty) * (+l.cost)) / previewQty) : l.currentWac;
              return (
                <div key={l.key} style={{ padding: "10px 0", borderBottom: `1px solid ${C.brd}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{l.itemName}{l.option !== "_default" ? <span style={{ fontWeight: 400, color: C.t2 }}> · {l.option}</span> : null}</div>
                    <button onClick={() => rmLine(i)} style={{ background: "none", border: "none", color: C.t2, cursor: "pointer" }}><Trash2 size={13} /></button>
                  </div>
                  <div style={{ fontSize: 11, color: C.t2, marginBottom: 4 }}>Currently: {l.currentQty} {l.unit} @ {fmt$(l.currentWac)}</div>
                  <Rw g={8}>
                    <Cl f={1}><div style={{ fontSize: 10, color: C.t2, marginBottom: 2 }}>QTY</div><input type="number" min="1" value={l.qty} onChange={(e) => updLine(i, "qty", e.target.value)} placeholder="0" style={{ ...inp, padding: "6px 8px", fontSize: 14, textAlign: "center", fontFamily: MN }} /></Cl>
                    <Cl f={1}><div style={{ fontSize: 10, color: C.t2, marginBottom: 2 }}>COST / UNIT</div><input type="number" step=".01" value={l.cost} onChange={(e) => updLine(i, "cost", e.target.value)} placeholder="$0.00" style={{ ...inp, padding: "6px 8px", fontSize: 14, textAlign: "center", fontFamily: MN }} /></Cl>
                  </Rw>
                  {+l.qty > 0 && +l.cost > 0 && (
                    <div style={{ fontSize: 10, color: C.grn, marginTop: 4 }}>
                      → {previewQty} {l.unit} @ new WAC {fmt$(previewWac)} · Line total: {fmt$(+l.qty * +l.cost)}
                    </div>
                  )}
                </div>
              );
            })}
            {lines.length > 0 && (
              <>
                <Fld label="Notes (vendor, invoice #, etc.)"><input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional" style={inp} /></Fld>
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: `2px solid ${C.brdL}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}><span style={{ color: C.t2 }}>Total Units</span><span style={{ fontFamily: MN, fontWeight: 700 }}>{totalUnits}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800 }}><span>Total Cost</span><span style={{ fontFamily: MN, color: C.ac }}>{fmt$(totalCostVal)}</span></div>
                </div>
                {done && <div style={{ textAlign: "center", padding: 12, color: C.grn, fontWeight: 700, fontSize: 14 }}><CheckCircle size={16} style={{ verticalAlign: "middle" }} /> All received!</div>}
                <button onClick={receiveAll} disabled={!validLines.length}
                  style={{ ...bP, width: "100%", justifyContent: "center", marginTop: 12, padding: 14, fontSize: 15, background: validLines.length ? C.grn : C.brd, opacity: validLines.length ? 1 : 0.5 }}>
                  <Package size={16} /> Receive {validLines.length} Item{validLines.length !== 1 ? "s" : ""}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Current Stock by Item + Variant */}
      <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10, marginTop: 24 }}>Current Stock by Item & Variant</h2>
      <div style={{ ...crd, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead><tr style={{ borderBottom: `1px solid ${C.brdL}` }}>
              {["Item", "Category", "Color / Style", "On Hand", "WAC", "Sell Price", "Value"].map((h) => (
                <th key={h} style={{ padding: "9px 8px", textAlign: "left", fontWeight: 700, color: C.t2, fontSize: 10, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {items.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)).map((item) => {
                const v = getVariants(item);
                const entries = Object.entries(v);
                return entries.map(([optName, vData], vi) => (
                  <tr key={item.id + optName} style={{ borderBottom: `1px solid ${C.brd}`, background: vi % 2 === 0 ? "transparent" : C.sf + "33" }}>
                    <td style={{ padding: "7px 8px", fontWeight: vi === 0 ? 700 : 400, color: vi === 0 ? C.txt : C.t2 }}>{vi === 0 ? item.name : ""}</td>
                    <td style={{ padding: "7px 8px", color: C.t2 }}>{vi === 0 ? item.category : ""}</td>
                    <td style={{ padding: "7px 8px", fontWeight: 600, color: optName === "_default" ? C.t2 : C.txt }}>{optName === "_default" ? "—" : optName}</td>
                    <td style={{ padding: "7px 8px", fontFamily: MN, fontWeight: 600, color: (vData.qty || 0) <= 0 ? C.red : C.txt }}>{vData.qty || 0} {item.unit}</td>
                    <td style={{ padding: "7px 8px", fontFamily: MN }}>{fmt$(vData.wac)}</td>
                    <td style={{ padding: "7px 8px", fontFamily: MN, color: C.ac }}>{fmt$((vData.wac || 0) * (1 + (item.markup || 0) / 100))}</td>
                    <td style={{ padding: "7px 8px", fontFamily: MN }}>{fmt$((vData.qty || 0) * (vData.wac || 0))}</td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Log */}
      <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10, marginTop: 20 }}>Recent Receipts</h2>
      <div style={{ ...crd, padding: 0, overflow: "hidden" }}><div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr style={{ borderBottom: `1px solid ${C.brdL}` }}>{["Date", "Item", "Option", "Qty", "Cost", "Prev WAC", "New WAC", "Total Qty", "Notes"].map((h) => <th key={h} style={{ padding: "9px 8px", textAlign: "left", fontWeight: 700, color: C.t2, fontSize: 10, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>
            {!log.length && <tr><td colSpan={9} style={{ padding: 24, textAlign: "center", color: C.t2 }}>No receipts yet.</td></tr>}
            {log.slice(0, 50).map((r) => (
              <tr key={r.id} style={{ borderBottom: `1px solid ${C.brd}` }}>
                <td style={{ padding: "7px 8px", color: C.t2 }}>{fD(r.date)}</td>
                <td style={{ padding: "7px 8px", fontWeight: 600 }}>{r.itemName}</td>
                <td style={{ padding: "7px 8px", color: C.t2 }}>{r.option && r.option !== "_default" ? r.option : "—"}</td>
                <td style={{ padding: "7px 8px", fontFamily: MN }}>{r.qty}</td>
                <td style={{ padding: "7px 8px", fontFamily: MN }}>{fmt$(r.unitCost)}</td>
                <td style={{ padding: "7px 8px", fontFamily: MN, color: C.t2 }}>{fmt$(r.prevWAC)}</td>
                <td style={{ padding: "7px 8px", fontFamily: MN, fontWeight: 600, color: C.ac }}>{fmt$(r.newWAC)}</td>
                <td style={{ padding: "7px 8px", fontFamily: MN }}>{r.newQty}</td>
                <td style={{ padding: "7px 8px", color: C.t2 }}>{r.note || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>
    </div>
  );
}

// ═══ ADJUSTMENTS (Shrinkage, Damage, Loss) ═══
function AdjustMgr({ items, sI }) {
  const [sel, setSel] = useState("");
  const [selOpt, setSelOpt] = useState("");
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState("Damaged");
  const [note, setNote] = useState("");
  const [log, setLog] = useState([]);
  const [ok, setOk] = useState(false);

  useEffect(() => { (async () => { setLog(await ld("adj_log", [])); })(); }, []);
  const svLog = useCallback((l) => { setLog(l); sv("adj_log", l); }, []);

  const it = items.find((i) => i.id === sel);
  const opts = it ? ((it.options && it.options.length > 0) ? it.options : ["_default"]) : [];
  const variants = it ? getVariants(it) : {};
  const selVariant = selOpt ? (variants[selOpt] || { qty: 0, wac: it?.wacCost || 0 }) : null;

  const reasons = ["Damaged", "Broken", "Lost", "Stolen", "Expired", "Miscounted", "Sample/Giveaway", "Other"];

  const adjustOut = () => {
    if (!sel || !selOpt || !qty || +qty <= 0) return;
    if (!it) return;
    const curV = variants[selOpt] || { qty: 0, wac: it.wacCost || 0 };
    const removeQty = Math.min(+qty, curV.qty || 0);
    const lostValue = removeQty * (curV.wac || 0);

    const newVariants = { ...variants, [selOpt]: { ...curV, qty: Math.max(0, (curV.qty || 0) - removeQty) } };
    const totalQ = Object.values(newVariants).reduce((s, x) => s + (x.qty || 0), 0);

    sI(items.map((i) => i.id === sel ? { ...i, variants: newVariants, qtyOnHand: totalQ } : i));

    const displayName = it.name + (selOpt !== "_default" ? ` (${selOpt})` : "");
    svLog([{ id: uid(), itemId: sel, itemName: displayName, option: selOpt, qty: removeQty, wacAtTime: curV.wac, lostValue, reason, note: note.trim(), date: new Date().toISOString() }, ...log]);
    setOk(true);
    setTimeout(() => { setOk(false); setSel(""); setSelOpt(""); setQty(""); setNote(""); }, 1800);
  };

  const totalLost = log.reduce((s, r) => s + (r.lostValue || 0), 0);
  const last30 = log.filter((r) => new Date(r.date) >= new Date(Date.now() - 30 * 86400000));
  const lost30 = last30.reduce((s, r) => s + (r.lostValue || 0), 0);

  return (
    <div className="fu">
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4, fontFamily: BC }}>INVENTORY ADJUSTMENTS</h1>
      <p style={{ color: C.t2, fontSize: 13, marginBottom: 20 }}>Log shrinkage, damage, breakage, or loss. This deducts from stock and tracks lost value.</p>

      <Rw g={14}>
        <Stat label="Total Lost (All Time)" value={fmt$(totalLost)} sub={`${log.length} adjustments`} color={C.red} />
        <Stat label="Lost (Last 30 Days)" value={fmt$(lost30)} sub={`${last30.length} adjustments`} color={C.wrn} />
      </Rw>

      <div style={{ ...crd, marginTop: 16, marginBottom: 20 }}>
        <div style={{ ...lbl, marginBottom: 10 }}>Log Adjustment</div>
        <Rw>
          <Cl f={2}><Fld label="Item">
            <select value={sel} onChange={(e) => { setSel(e.target.value); setSelOpt(""); }} style={{ ...inp, cursor: "pointer" }}>
              <option value="">Choose item...</option>
              {items.sort((a, b) => a.name.localeCompare(b.name)).map((i) => (
                <option key={i.id} value={i.id}>{i.name} — {totalStock(i)} {i.unit} total</option>
              ))}
            </select>
          </Fld></Cl>
          <Cl><Fld label="Reason">
            <select value={reason} onChange={(e) => setReason(e.target.value)} style={{ ...inp, cursor: "pointer" }}>
              {reasons.map((r) => <option key={r}>{r}</option>)}
            </select>
          </Fld></Cl>
        </Rw>

        {it && opts.length > 0 && (
          <Fld label={opts[0] === "_default" ? "Variant" : "Select Color / Style"}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {opts.map((opt) => {
                const v = variants[opt] || { qty: 0, wac: it.wacCost || 0 };
                const active = selOpt === opt;
                return (
                  <button key={opt} onClick={() => setSelOpt(opt)}
                    style={{ ...bS, padding: "8px 14px", fontSize: 12, borderColor: active ? C.red : C.brd, color: active ? C.red : C.txt, background: active ? C.red + "10" : "transparent" }}>
                    <span style={{ fontWeight: 700 }}>{opt === "_default" ? it.name : opt}</span>
                    <span style={{ fontSize: 10, color: C.t2, marginLeft: 6 }}>{v.qty} on hand</span>
                  </button>
                );
              })}
            </div>
          </Fld>
        )}

        {selOpt && (
          <Rw>
            <Cl><Fld label="Qty to Write Off"><input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="0" style={inp} /></Fld></Cl>
            <Cl f={2}><Fld label="Notes"><input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Details about what happened..." style={inp} /></Fld></Cl>
          </Rw>
        )}

        {selOpt && qty && +qty > 0 && selVariant && (
          <div style={{ background: C.red + "10", border: `1px solid ${C.red}33`, borderRadius: 6, padding: 10, marginBottom: 12, fontSize: 12 }}>
            <strong>This will remove</strong> {Math.min(+qty, selVariant.qty || 0)} {it.unit} @ {fmt$(selVariant.wac)} = <strong style={{ color: C.red }}>{fmt$(Math.min(+qty, selVariant.qty || 0) * (selVariant.wac || 0))} lost value</strong>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
          {ok && <span style={{ color: C.grn, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}><CheckCircle size={14} /> Logged!</span>}
          <button onClick={adjustOut} style={{ ...bD, opacity: (!sel || !selOpt || !qty || +qty <= 0) ? 0.5 : 1 }}><AlertTriangle size={14} /> Write Off Stock</button>
        </div>
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>Adjustment History</h2>
      <div style={{ ...crd, padding: 0, overflow: "hidden" }}><div style={{ overflowX: "auto", maxHeight: 400 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr>{["Date", "Item", "Option", "Qty", "Reason", "Lost Value", "Notes"].map((h) => <th key={h} style={{ padding: "9px 8px", textAlign: "left", fontWeight: 700, color: C.t2, fontSize: 10, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>
            {!log.length && <tr><td colSpan={7} style={{ padding: 24, textAlign: "center", color: C.t2 }}>No adjustments logged yet.</td></tr>}
            {log.slice(0, 100).map((r) => (
              <tr key={r.id} style={{ borderBottom: `1px solid ${C.brd}` }}>
                <td style={{ padding: "7px 8px", color: C.t2 }}>{fD(r.date)}</td>
                <td style={{ padding: "7px 8px", fontWeight: 600 }}>{r.itemName}</td>
                <td style={{ padding: "7px 8px", color: C.t2 }}>{r.option && r.option !== "_default" ? r.option : "—"}</td>
                <td style={{ padding: "7px 8px", fontFamily: MN, color: C.red }}>{r.qty}</td>
                <td style={{ padding: "7px 8px" }}><span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 3, background: C.red + "12", color: C.red }}>{r.reason}</span></td>
                <td style={{ padding: "7px 8px", fontFamily: MN, fontWeight: 700, color: C.red }}>{fmt$(r.lostValue || 0)}</td>
                <td style={{ padding: "7px 8px", color: C.t2 }}>{r.note || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>
    </div>
  );
}

// ═══ TEMPLATE MANAGER ═══
function TplMgr({ templates, sT, items }) {
  const [modal, setModal] = useState(null);
  return (
    <div className="fu">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 900, fontFamily: BC }}>ORDER TEMPLATES</h1><p style={{ color: C.t2, fontSize: 13, marginTop: 4 }}>Pre-built item lists your crew can use to start orders faster</p></div>
        <button onClick={() => setModal("new")} style={bP}><Plus size={14} /> New Template</button>
      </div>
      {!templates.length && <Empty msg="No templates yet. Create one to speed up ordering." />}
      {templates.map((t) => {
        const iMap = Object.fromEntries(items.map((i) => [i.id, i]));
        return (
          <div key={t.id} style={{ ...crd, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: C.t2, marginTop: 2 }}>{(t.items || []).length} items: {(t.items || []).slice(0, 4).map((ti) => (iMap[ti.itemId]?.name || "?") + (ti.option ? ` (${ti.option})` : "")).join(", ")}{(t.items || []).length > 4 ? "..." : ""}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setModal(t)} style={{ ...bS, padding: "8px 12px", fontSize: 12 }}><Edit3 size={13} /> Edit</button>
                <button onClick={() => { if (confirm(`Delete "${t.name}"?`)) sT(templates.filter((x) => x.id !== t.id)); }} style={{ ...bD, padding: "8px 12px", fontSize: 12 }}><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        );
      })}
      <TplModal open={modal} onClose={() => setModal(null)} templates={templates} sT={sT} items={items} ed={modal && modal !== "new" ? modal : null} />
    </div>
  );
}

function TplModal({ open, onClose, templates, sT, items, ed }) {
  const [name, setName] = useState("");
  const [tplItems, setTplItems] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (ed) { setName(ed.name); setTplItems((ed.items || []).map((x) => ({ ...x }))); }
    else { setName(""); setTplItems([]); }
  }, [ed, open]);

  if (!open) return null;

  const addItem = (it, opt) => {
    const key = it.id + ":" + (opt || "");
    if (tplItems.find((x) => x.itemId === it.id && (x.option || "") === (opt || ""))) return;
    setTplItems([...tplItems, { itemId: it.id, option: opt || "", qty: 1 }]);
  };

  const filt = items.filter((i) => i.active !== false && (!search || i.name.toLowerCase().includes(search.toLowerCase())));
  const iMap = Object.fromEntries(items.map((i) => [i.id, i]));

  const save = () => {
    if (!name.trim()) return;
    if (ed) { sT(templates.map((t) => t.id === ed.id ? { ...t, name: name.trim(), items: tplItems } : t)); }
    else { sT([...templates, { id: uid(), name: name.trim(), items: tplItems }]); }
    onClose();
  };

  return (
    <Modal open title={ed ? "Edit Template" : "New Template"} onClose={onClose} wide>
      <Fld label="Template Name"><input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. "Standard Roof Package"' style={inp} /></Fld>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 280px" }}>
          <Fld label="Add Items">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items..." style={inp} />
          </Fld>
          <div style={{ maxHeight: 250, overflow: "auto", border: `1px solid ${C.brd}`, borderRadius: 6 }}>
            {filt.map((it) => {
              const opts = it.options && it.options.length ? it.options : [""];
              return (
                <div key={it.id} style={{ padding: "6px 8px", borderBottom: `1px solid ${C.brd}` }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{it.name}</div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 3 }}>
                    {opts.map((opt) => (
                      <button key={opt || "__"} onClick={() => addItem(it, opt)} style={{ ...bS, padding: "2px 8px", fontSize: 10, borderRadius: 3 }}><Plus size={9} /> {opt || "Add"}</button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ flex: "1 1 280px" }}>
          <div style={lbl}>Template Items ({tplItems.length})</div>
          {!tplItems.length && <div style={{ color: C.t2, fontSize: 12, padding: 16 }}>Add items from the left</div>}
          {tplItems.map((ti, i) => {
            const it = iMap[ti.itemId] || { name: "?", unit: "" };
            const moveUp = () => { if (i === 0) return; const n = [...tplItems]; [n[i-1], n[i]] = [n[i], n[i-1]]; setTplItems(n); };
            const moveDown = () => { if (i === tplItems.length - 1) return; const n = [...tplItems]; [n[i], n[i+1]] = [n[i+1], n[i]]; setTplItems(n); };
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 0", borderBottom: `1px solid ${C.brd}` }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <button onClick={moveUp} disabled={i === 0} style={{ background: "none", border: "none", color: i === 0 ? C.brd : C.t2, cursor: i === 0 ? "default" : "pointer", padding: 0, lineHeight: 1 }}><ArrowUp size={11} /></button>
                  <button onClick={moveDown} disabled={i === tplItems.length - 1} style={{ background: "none", border: "none", color: i === tplItems.length - 1 ? C.brd : C.t2, cursor: i === tplItems.length - 1 ? "default" : "pointer", padding: 0, lineHeight: 1 }}><ArrowDown size={11} /></button>
                </div>
                <div style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>{it.name}{ti.option ? <span style={{ color: C.t2, fontWeight: 400 }}> · {ti.option}</span> : null}</div>
                <input type="number" min="1" value={ti.qty} onChange={(e) => { const n = [...tplItems]; n[i] = { ...n[i], qty: Math.max(1, +e.target.value) }; setTplItems(n); }} style={{ ...inp, width: 60, padding: "4px 6px", textAlign: "center", fontSize: 12 }} />
                <button onClick={() => setTplItems(tplItems.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: C.t2, cursor: "pointer" }}><Trash2 size={12} /></button>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
        <button onClick={onClose} style={bS}>Cancel</button>
        <button onClick={save} style={bP}><Check size={14} /> {ed ? "Save" : "Create Template"}</button>
      </div>
    </Modal>
  );
}

// ═══ ORDER HISTORY ═══
function History({ orders, items, user, isA, isM, view, sO }) {
  const [search, setSearch] = useState(""); const [stF, setStF] = useState("All"); const [tyF, setTyF] = useState("All");
  const vis = (isA || isM) ? orders : orders.filter((o) => o.userId === user.id);
  const filt = vis.filter((o) => {
    if (stF !== "All" && o.status !== stF) return false;
    if (tyF !== "All" && o.type !== tyF) return false;
    if (search) { const s = search.toLowerCase(); if (!(o.poNumber || "").toLowerCase().includes(s) && !(o.userName || "").toLowerCase().includes(s) && !(o.jobName || "").toLowerCase().includes(s)) return false; }
    return true;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="fu">
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4, fontFamily: BC }}>ORDER HISTORY</h1>
      <p style={{ color: C.t2, fontSize: 13, marginBottom: 16 }}>Search all past orders and returns</p>
      <Rw g={10}>
        <Cl f={3}><div style={{ position: "relative" }}><Search size={13} style={{ position: "absolute", left: 10, top: 11, color: C.t2 }} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search PO, name, job..." style={{ ...inp, paddingLeft: 30, marginBottom: 14 }} /></div></Cl>
        <Cl><select value={tyF} onChange={(e) => setTyF(e.target.value)} style={{ ...inp, cursor: "pointer", marginBottom: 14 }}><option value="All">All Types</option><option value="order">Orders</option><option value="return">Returns</option></select></Cl>
        <Cl><select value={stF} onChange={(e) => setStF(e.target.value)} style={{ ...inp, cursor: "pointer", marginBottom: 14 }}><option value="All">All Status</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></Cl>
      </Rw>
      {!filt.length && <Empty msg="No orders match your filters." />}
      {filt.map((o) => {
        const tot = o.lines.reduce((s, l) => s + l.qty * (l.markupCost || 0), 0);
        return (
          <div key={o.id} style={{ ...crd, marginBottom: 10, cursor: "pointer", transition: "border-color .2s" }} onClick={() => view(o)}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.ac; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.brd; }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, fontFamily: BC }}>{o.type === "return" ? "RETURN" : "ORDER"}</span>
                  <Badge status={o.status} />
                  {o.poNumber && <span style={{ fontSize: 12, fontFamily: MN, color: C.t2 }}>PO: {o.poNumber}</span>}
                </div>
                <div style={{ fontSize: 12, color: C.t2 }}>{o.userName} · {fD(o.date)}{o.jobName ? ` · ${o.jobName}` : ""} · {o.lines.length} items</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16, fontWeight: 800, fontFamily: MN, color: C.ac }}>{fmt$(tot)}</span>
                <ChevronRight size={16} color={C.t2} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══ SHRINKAGE / LOSS MANAGER ═══
function ShrinkageMgr({ items, sI, shrinkLog, sSh }) {
  const [counting, setCounting] = useState(false);
  const [counts, setCounts] = useState({}); // { "itemId:option": actualQty }
  const [catF, setCatF] = useState("All");
  const [searchF, setSearchF] = useState("");
  const [saved, setSaved] = useState(false);

  const cats = ["All", ...new Set(items.map((i) => i.category))];
  const filtered = items.filter((i) => {
    if (catF !== "All" && i.category !== catF) return false;
    if (searchF && !i.name.toLowerCase().includes(searchF.toLowerCase())) return false;
    return true;
  }).sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

  // Build flat rows: one per item+variant
  const rows = [];
  filtered.forEach((it) => {
    const v = getVariants(it);
    Object.entries(v).forEach(([opt, vd]) => {
      rows.push({ itemId: it.id, itemName: it.name, category: it.category, unit: it.unit, option: opt, systemQty: vd.qty || 0, wac: vd.wac || 0 });
    });
  });

  const startCount = () => {
    const init = {};
    rows.forEach((r) => { init[r.itemId + ":" + r.option] = ""; }); // blank = not yet counted
    setCounts(init);
    setCounting(true);
    setSaved(false);
  };

  const setCount = (key, val) => {
    setCounts((prev) => ({ ...prev, [key]: val }));
  };

  // Calculate variances
  const getVariance = (r) => {
    const key = r.itemId + ":" + r.option;
    const actual = counts[key];
    if (actual === "" || actual === undefined) return null;
    return (+actual) - r.systemQty;
  };

  const countedRows = rows.filter((r) => {
    const key = r.itemId + ":" + r.option;
    return counts[key] !== "" && counts[key] !== undefined;
  });
  const variances = countedRows.map((r) => ({ ...r, variance: getVariance(r) })).filter((r) => r.variance !== 0);
  const totalShrinkage = variances.filter((v) => v.variance < 0).reduce((s, v) => s + Math.abs(v.variance) * v.wac, 0);
  const totalFound = variances.filter((v) => v.variance > 0).reduce((s, v) => s + v.variance * v.wac, 0);

  const saveCount = () => {
    if (!variances.length) return;

    // Adjust inventory for each variance
    const updatedItems = items.map((it) => {
      const v = { ...(it.variants || getVariants(it)) };
      let changed = false;
      Object.entries(v).forEach(([opt, vd]) => {
        const key = it.id + ":" + opt;
        const actual = counts[key];
        if (actual === "" || actual === undefined) return;
        const newQty = Math.max(0, +actual);
        if (newQty !== (vd.qty || 0)) {
          v[opt] = { ...vd, qty: newQty };
          changed = true;
        }
      });
      if (!changed) return it;
      const totalQ = Object.values(v).reduce((s, x) => s + (x.qty || 0), 0);
      return { ...it, variants: v, qtyOnHand: totalQ };
    });
    sI(updatedItems);

    // Log each variance
    const newEntries = variances.map((vr) => ({
      id: uid(),
      itemId: vr.itemId,
      itemName: vr.itemName + (vr.option !== "_default" ? ` (${vr.option})` : ""),
      option: vr.option,
      qty: Math.abs(vr.variance),
      unitCost: vr.wac,
      lostValue: Math.abs(vr.variance) * vr.wac,
      reason: vr.variance < 0 ? "Physical Count - Shrinkage" : "Physical Count - Found",
      note: `System: ${vr.systemQty}, Actual: ${vr.systemQty + vr.variance}`,
      date: new Date().toISOString(),
      type: vr.variance < 0 ? "shrinkage" : "found",
    }));
    sSh([...newEntries, ...shrinkLog]);
    setSaved(true);
    setCounting(false);
  };

  const totalLost = shrinkLog.filter((r) => r.type !== "found").reduce((s, r) => s + (r.lostValue || 0), 0);
  const totalUnits = shrinkLog.filter((r) => r.type !== "found").reduce((s, r) => s + (r.qty || 0), 0);

  return (
    <div className="fu">
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4, fontFamily: BC }}>PHYSICAL COUNT & SHRINKAGE</h1>
      <p style={{ color: C.t2, fontSize: 13, marginBottom: 20 }}>Count what's actually on the shelf. The system will compare it to expected stock and record any shrinkage or overages.</p>

      <Rw g={14}>
        <Stat label="Total Shrinkage (All Time)" value={fmt$(totalLost)} sub={`${totalUnits} units lost`} color={C.red} />
        <Stat label="Counts Logged" value={shrinkLog.length} color={NAVY} />
      </Rw>

      {/* COUNT MODE */}
      {!counting && !saved && (
        <div style={{ ...crd, marginTop: 16, textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Ready to do a physical count?</div>
          <p style={{ color: C.t2, fontSize: 13, marginBottom: 20 }}>You'll see every item with its expected quantity. Enter what you actually have and save.</p>
          <button onClick={startCount} style={{ ...bP, padding: "16px 40px", fontSize: 16, background: NAVY }}><Package size={18} /> Start Physical Count</button>
        </div>
      )}

      {saved && (
        <div style={{ ...crd, marginTop: 16, textAlign: "center", padding: 40 }}>
          <div style={{ display: "inline-flex", background: C.grn + "20", borderRadius: 16, padding: 20, marginBottom: 16 }}><CheckCircle size={48} color={C.grn} /></div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Count Saved</h2>
          <p style={{ color: C.t2, marginBottom: 20 }}>Inventory has been adjusted. Variances are logged below.</p>
          <button onClick={() => setSaved(false)} style={bP}><Check size={14} /> Done</button>
        </div>
      )}

      {counting && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1 1 200px" }}>
              <Search size={12} style={{ position: "absolute", left: 8, top: 10, color: C.t2 }} />
              <input value={searchF} onChange={(e) => setSearchF(e.target.value)} placeholder="Search items..." style={{ ...inp, paddingLeft: 26, padding: "8px 10px 8px 26px", fontSize: 12 }} />
            </div>
            <select value={catF} onChange={(e) => setCatF(e.target.value)} style={{ ...inp, width: "auto", cursor: "pointer", padding: "8px 10px", fontSize: 12 }}>
              {cats.map((c) => <option key={c}>{c}</option>)}
            </select>
            <button onClick={() => setCounting(false)} style={{ ...bS, padding: "8px 14px", fontSize: 12 }}>Cancel</button>
          </div>

          {/* VARIANCE SUMMARY */}
          {variances.length > 0 && (
            <div style={{ ...crd, marginBottom: 12, borderLeft: `4px solid ${totalShrinkage > 0 ? C.red : C.grn}`, padding: 14 }}>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 13 }}>
                <div><span style={{ color: C.t2 }}>Items Counted:</span> <strong>{countedRows.length}</strong></div>
                <div><span style={{ color: C.t2 }}>Variances:</span> <strong style={{ color: C.wrn }}>{variances.length}</strong></div>
                {totalShrinkage > 0 && <div><span style={{ color: C.t2 }}>Shrinkage:</span> <strong style={{ color: C.red }}>{fmt$(totalShrinkage)}</strong></div>}
                {totalFound > 0 && <div><span style={{ color: C.t2 }}>Found:</span> <strong style={{ color: C.grn }}>{fmt$(totalFound)}</strong></div>}
              </div>
            </div>
          )}

          {/* COUNT TABLE */}
          <div style={{ ...crd, padding: 0, overflow: "hidden" }}>
            <div style={{ overflowX: "auto", maxHeight: 500 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead><tr>
                  {["Item", "Category", "Color/Style", "System Qty", "Actual Count", "Variance", "Value Impact"].map((h) => (
                    <th key={h} style={{ padding: "10px 10px", textAlign: "left", fontWeight: 700, color: C.t2, fontSize: 10, textTransform: "uppercase", position: "sticky", top: 0, background: C.card, zIndex: 1 }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {rows.map((r) => {
                    const key = r.itemId + ":" + r.option;
                    const actual = counts[key];
                    const variance = actual !== "" && actual !== undefined ? (+actual) - r.systemQty : null;
                    const impactVal = variance !== null ? variance * r.wac : 0;
                    return (
                      <tr key={key} style={{ borderBottom: `1px solid ${C.brd}`, background: variance !== null && variance !== 0 ? (variance < 0 ? C.red + "06" : C.grn + "06") : "transparent" }}>
                        <td style={{ padding: "8px 10px", fontWeight: 600 }}>{r.itemName}</td>
                        <td style={{ padding: "8px 10px", color: C.t2 }}>{r.category}</td>
                        <td style={{ padding: "8px 10px", fontWeight: 600 }}>{r.option === "_default" ? "—" : r.option}</td>
                        <td style={{ padding: "8px 10px", fontFamily: MN, fontWeight: 600 }}>{r.systemQty} {r.unit}</td>
                        <td style={{ padding: "8px 10px" }}>
                          <input type="number" min="0" value={actual} onChange={(e) => setCount(key, e.target.value)}
                            placeholder={String(r.systemQty)}
                            style={{ ...inp, width: 80, padding: "6px 8px", textAlign: "center", fontSize: 14, fontFamily: MN, fontWeight: 700,
                              borderColor: variance !== null && variance !== 0 ? (variance < 0 ? C.red : C.grn) : C.brd,
                              color: variance !== null && variance !== 0 ? (variance < 0 ? C.red : C.grn) : C.txt }} />
                        </td>
                        <td style={{ padding: "8px 10px", fontFamily: MN, fontWeight: 700, color: variance === null || variance === 0 ? C.t2 : variance < 0 ? C.red : C.grn }}>
                          {variance === null ? "—" : variance === 0 ? "✓" : (variance > 0 ? "+" : "") + variance}
                        </td>
                        <td style={{ padding: "8px 10px", fontFamily: MN, color: impactVal === 0 || variance === null ? C.t2 : impactVal < 0 ? C.red : C.grn }}>
                          {variance === null || variance === 0 ? "—" : fmt$(Math.abs(impactVal))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* SAVE BAR */}
          <div style={{ ...crd, marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: 13, color: C.t2 }}>
              {countedRows.length} of {rows.length} items counted · {variances.length} variance{variances.length !== 1 ? "s" : ""}
            </div>
            <button onClick={saveCount} disabled={!variances.length}
              style={{ ...bP, padding: "14px 30px", fontSize: 15, background: variances.length ? C.red : C.brd, opacity: variances.length ? 1 : 0.5 }}>
              <Check size={16} /> Save Count & Adjust Inventory
            </button>
          </div>
        </div>
      )}

      {/* HISTORY */}
      <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10, marginTop: 24 }}>Adjustment History</h2>
      <div style={{ ...crd, padding: 0, overflow: "hidden" }}><div style={{ overflowX: "auto", maxHeight: 400 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr>{["Date", "Item", "Type", "Qty", "Unit Cost", "Value", "Notes"].map((h) => (
            <th key={h} style={{ padding: "9px 8px", textAlign: "left", fontWeight: 700, color: C.t2, fontSize: 10, textTransform: "uppercase", position: "sticky", top: 0, background: C.card }}>{h}</th>
          ))}</tr></thead>
          <tbody>
            {!shrinkLog.length && <tr><td colSpan={7} style={{ padding: 24, textAlign: "center", color: C.t2 }}>No adjustments logged yet. Start a physical count above.</td></tr>}
            {shrinkLog.map((r) => (
              <tr key={r.id} style={{ borderBottom: `1px solid ${C.brd}` }}>
                <td style={{ padding: "7px 8px", color: C.t2 }}>{fD(r.date)}</td>
                <td style={{ padding: "7px 8px", fontWeight: 600 }}>{r.itemName}</td>
                <td style={{ padding: "7px 8px" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 3,
                    background: r.type === "found" ? C.grn + "15" : C.red + "15",
                    color: r.type === "found" ? C.grn : C.red }}>
                    {r.type === "found" ? "FOUND" : "SHRINKAGE"}
                  </span>
                </td>
                <td style={{ padding: "7px 8px", fontFamily: MN, fontWeight: 600, color: r.type === "found" ? C.grn : C.red }}>{r.type === "found" ? "+" : "-"}{r.qty}</td>
                <td style={{ padding: "7px 8px", fontFamily: MN }}>{fmt$(r.unitCost)}</td>
                <td style={{ padding: "7px 8px", fontFamily: MN, fontWeight: 700, color: r.type === "found" ? C.grn : C.red }}>{fmt$(r.lostValue)}</td>
                <td style={{ padding: "7px 8px", color: C.t2 }}>{r.note || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>
    </div>
  );
}

// ═══ DAMAGE REPORT (for managers + admin) ═══
function DamageReport({ items, sI, shrinkLog, sSh, user }) {
  const [sel, setSel] = useState("");
  const [selOpt, setSelOpt] = useState("");
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState("Damaged");
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState(null); // base64
  const [photoName, setPhotoName] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [search, setSearch] = useState("");

  const REASONS = ["Damaged", "Broken", "Weather Damage", "Theft", "Defective", "Water Damage", "Missing", "Other"];
  const it = items.find((i) => i.id === sel);
  const opts = it ? ((it.options && it.options.length > 0) ? it.options : ["_default"]) : [];
  const variants = it ? getVariants(it) : {};
  const selVariant = selOpt ? (variants[selOpt] || { qty: 0, wac: it?.wacCost || 0 }) : null;

  const filtered = items.filter((i) => i.active !== false && (!search || i.name.toLowerCase().includes(search.toLowerCase()))).sort((a, b) => a.name.localeCompare(b.name));

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoName(file.name);
    const compressed = await compressPhoto(file);
    setPhoto(compressed);
  };

  const submit = () => {
    if (!sel || !selOpt || !qty || +qty <= 0 || !photo) return;
    setSaving(true);

    // Deduct from inventory
    const curV = variants[selOpt] || { qty: 0, wac: it.wacCost || 0 };
    const newQty = Math.max(0, (curV.qty || 0) - (+qty));
    const newVariants = { ...variants, [selOpt]: { ...curV, qty: newQty } };
    const totalQ = Object.values(newVariants).reduce((s, x) => s + (x.qty || 0), 0);
    sI(items.map((i) => i.id === sel ? { ...i, variants: newVariants, qtyOnHand: totalQ } : i));

    // Log it
    const displayName = it.name + (selOpt !== "_default" ? ` (${selOpt})` : "");
    const entry = {
      id: uid(), itemId: sel, itemName: displayName, option: selOpt,
      qty: +qty, unitCost: curV.wac || 0, lostValue: (+qty) * (curV.wac || 0),
      reason, note: note.trim(), photo,
      reportedBy: user?.name || "Unknown",
      date: new Date().toISOString(), type: "damage",
    };
    sSh([entry, ...shrinkLog]);
    setSaving(false);
    setDone(true);
    setTimeout(() => {
      setDone(false); setSel(""); setSelOpt(""); setQty(""); setReason("Damaged"); setNote(""); setPhoto(null); setPhotoName("");
    }, 2500);
  };

  const canSubmit = sel && selOpt && qty && +qty > 0 && photo && note.trim();

  return (
    <div className="fu">
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4, fontFamily: BC }}>REPORT DAMAGE</h1>
      <p style={{ color: C.t2, fontSize: 13, marginBottom: 20 }}>Report damaged, broken, or missing materials. Photo required. Inventory will be automatically adjusted.</p>

      {done && (
        <div style={{ ...crd, marginBottom: 16, borderLeft: `4px solid ${C.grn}`, display: "flex", alignItems: "center", gap: 10, padding: 14 }}>
          <CheckCircle size={20} color={C.grn} />
          <span style={{ fontWeight: 700, color: C.grn }}>Damage reported. Inventory updated.</span>
        </div>
      )}

      <div style={{ ...crd, marginBottom: 20 }}>
        <Fld label="Search & Select Item">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items..." style={inp} />
          <select value={sel} onChange={(e) => { setSel(e.target.value); setSelOpt(""); }} style={{ ...inp, cursor: "pointer", marginTop: 8 }}>
            <option value="">Choose item...</option>
            {filtered.map((i) => <option key={i.id} value={i.id}>{i.name} — {totalStock(i)} {i.unit}</option>)}
          </select>
        </Fld>

        {it && opts.length > 0 && (
          <Fld label={opts[0] === "_default" ? "Variant" : "Select Color / Style"}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {opts.map((opt) => {
                const v = variants[opt] || { qty: 0 };
                const active = selOpt === opt;
                return (
                  <button key={opt} onClick={() => setSelOpt(opt)}
                    style={{ ...bS, padding: "8px 14px", fontSize: 12, borderColor: active ? C.ac : C.brd, color: active ? C.ac : C.txt, background: active ? C.ac + "15" : "transparent" }}>
                    <span style={{ fontWeight: 700 }}>{opt === "_default" ? it.name : opt}</span>
                    <span style={{ fontSize: 10, color: C.t2, marginLeft: 6 }}>{v.qty} on hand</span>
                  </button>
                );
              })}
            </div>
          </Fld>
        )}

        {selOpt && (
          <>
            <Rw g={12}>
              <Cl><Fld label="Qty Damaged"><input type="number" min="1" max={selVariant?.qty || 999} value={qty} onChange={(e) => setQty(e.target.value)} placeholder="0" style={inp} /></Fld></Cl>
              <Cl><Fld label="Reason"><select value={reason} onChange={(e) => setReason(e.target.value)} style={{ ...inp, cursor: "pointer" }}>{REASONS.map((r) => <option key={r}>{r}</option>)}</select></Fld></Cl>
            </Rw>

            {qty && +qty > 0 && selVariant && (
              <div style={{ background: C.red + "12", border: `1px solid ${C.red}33`, borderRadius: 6, padding: 10, marginBottom: 12, fontSize: 12 }}>
                <strong>Impact:</strong> {selVariant.qty || 0} on hand → <strong>{Math.max(0, (selVariant.qty || 0) - (+qty))}</strong> after deduction · <strong style={{ color: C.red }}>{fmt$((+qty) * (selVariant.wac || 0))}</strong> loss
              </div>
            )}

            {/* PHOTO UPLOAD — REQUIRED */}
            <Fld label="Photo of Damage (required)">
              <div style={{ border: `2px dashed ${photo ? C.grn : C.brd}`, borderRadius: 8, padding: photo ? 8 : 24, textAlign: "center", cursor: "pointer", background: photo ? C.grn + "08" : C.sf, position: "relative" }}
                onClick={() => document.getElementById("dmg-photo-input")?.click()}>
                {photo ? (
                  <div>
                    <img src={photo} alt="Damage" style={{ maxHeight: 200, maxWidth: "100%", borderRadius: 6, marginBottom: 6 }} />
                    <div style={{ fontSize: 11, color: C.grn, fontWeight: 600 }}><CheckCircle size={12} style={{ verticalAlign: "middle" }} /> {photoName}</div>
                    <div style={{ fontSize: 10, color: C.t2, marginTop: 2 }}>Click to replace</div>
                  </div>
                ) : (
                  <div>
                    <Camera size={32} color={C.t2} style={{ marginBottom: 8 }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.txt }}>Take Photo or Upload</div>
                    <div style={{ fontSize: 11, color: C.t2, marginTop: 4 }}>Tap to open camera or select a file</div>
                  </div>
                )}
                <input id="dmg-photo-input" type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{ display: "none" }} />
              </div>
            </Fld>

            <Fld label="Notes (required — describe the damage)"><input value={note} onChange={(e) => setNote(e.target.value)} placeholder="What happened? Describe the damage..." style={{ ...inp, borderColor: note.trim() ? C.brd : C.red + "66" }} /></Fld>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
              <button onClick={submit} disabled={!canSubmit || saving}
                style={{ ...bP, padding: "14px 30px", fontSize: 15, background: canSubmit ? C.red : C.brd, opacity: canSubmit ? 1 : 0.5 }}>
                <AlertTriangle size={16} /> Report Damage
              </button>
            </div>
          </>
        )}
      </div>

      {/* Recent damage reports by this user */}
      <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>Your Recent Reports</h2>
      <div style={{ ...crd, padding: 0 }}><div style={{ overflowX: "auto", maxHeight: 300 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr>{["Date", "Item", "Qty", "Reason", "Value", "Photo"].map((h) => <th key={h} style={{ padding: "9px 8px", textAlign: "left", fontWeight: 700, color: C.t2, fontSize: 10, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>
            {shrinkLog.filter((r) => r.type === "damage" && r.reportedBy === user?.name).length === 0 && <tr><td colSpan={6} style={{ padding: 24, textAlign: "center", color: C.t2 }}>No damage reports yet.</td></tr>}
            {shrinkLog.filter((r) => r.type === "damage" && r.reportedBy === user?.name).slice(0, 20).map((r) => (
              <tr key={r.id} style={{ borderBottom: `1px solid ${C.brd}` }}>
                <td style={{ padding: "7px 8px", color: C.t2 }}>{fD(r.date)}</td>
                <td style={{ padding: "7px 8px", fontWeight: 600 }}>{r.itemName}</td>
                <td style={{ padding: "7px 8px", fontFamily: MN }}>{r.qty}</td>
                <td style={{ padding: "7px 8px" }}>{r.reason}</td>
                <td style={{ padding: "7px 8px", fontFamily: MN, color: C.red }}>{fmt$(r.lostValue || 0)}</td>
                <td style={{ padding: "7px 8px" }}>{r.photo ? <img src={r.photo} alt="" style={{ height: 30, borderRadius: 3 }} /> : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>
    </div>
  );
}

// ═══ DAMAGE GALLERY (admin only) ═══
function DamageGallery({ shrinkLog, sSh, items, sI }) {
  const [filter, setFilter] = useState("all"); // all, damage, shrinkage, found
  const [search, setSearch] = useState("");
  const [enlarged, setEnlarged] = useState(null);
  const [deleteWarn, setDeleteWarn] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editQty, setEditQty] = useState("");
  const [editReason, setEditReason] = useState("");
  const [editNote, setEditNote] = useState("");

  const REASONS = ["Damaged", "Broken", "Weather Damage", "Theft", "Defective", "Water Damage", "Missing", "Other"];

  const deleteDamage = (r) => {
    // Restore inventory
    const it = items.find((i) => i.id === r.itemId);
    if (it && r.qty) {
      const v = { ...(it.variants || getVariants(it)) };
      const opt = r.option || "_default";
      const curV = v[opt] || { qty: 0, wac: r.unitCost || 0 };
      v[opt] = { ...curV, qty: (curV.qty || 0) + r.qty };
      const totalQ = Object.values(v).reduce((s, x) => s + (x.qty || 0), 0);
      sI(items.map((i) => i.id === r.itemId ? { ...i, variants: v, qtyOnHand: totalQ } : i));
    }
    sSh(shrinkLog.filter((x) => x.id !== r.id));
    setDeleteWarn(null); setEnlarged(null);
  };

  const startEdit = (r) => {
    setEditing(r); setEditQty(String(r.qty || "")); setEditReason(r.reason || "Damaged"); setEditNote(r.note || "");
  };

  const saveEdit = () => {
    if (!editing) return;
    const oldQty = editing.qty || 0;
    const newQty = +editQty || 0;
    const diff = newQty - oldQty;
    if (diff !== 0) {
      const it = items.find((i) => i.id === editing.itemId);
      if (it) {
        const v = { ...(it.variants || getVariants(it)) };
        const opt = editing.option || "_default";
        const curV = v[opt] || { qty: 0, wac: editing.unitCost || 0 };
        v[opt] = { ...curV, qty: Math.max(0, (curV.qty || 0) - diff) };
        const totalQ = Object.values(v).reduce((s, x) => s + (x.qty || 0), 0);
        sI(items.map((i) => i.id === editing.itemId ? { ...i, variants: v, qtyOnHand: totalQ } : i));
      }
    }
    sSh(shrinkLog.map((x) => x.id === editing.id ? { ...x, qty: newQty, reason: editReason, note: editNote, lostValue: newQty * (x.unitCost || 0) } : x));
    setEditing(null); setEnlarged(null);
  };

  const incidents = shrinkLog.filter((r) => {
    if (filter === "damage" && r.type !== "damage") return false;
    if (filter === "shrinkage" && r.type !== "shrinkage") return false;
    if (filter === "found" && r.type !== "found") return false;
    if (search && !(r.itemName || "").toLowerCase().includes(search.toLowerCase()) && !(r.reason || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const withPhotos = incidents.filter((r) => r.photo);
  const totalLoss = incidents.filter((r) => r.type !== "found").reduce((s, r) => s + (r.lostValue || 0), 0);
  const totalDamage = incidents.filter((r) => r.type === "damage").length;

  return (
    <div className="fu">
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4, fontFamily: BC }}>REPORTED DAMAGE</h1>
      <p style={{ color: C.t2, fontSize: 13, marginBottom: 20 }}>Browse all damage reports and shrinkage incidents. Click photos or notes to enlarge.</p>

      <Rw g={14}>
        <Stat label="Total Incidents" value={incidents.length} color={NAVY} />
        <Stat label="Photo Reports" value={withPhotos.length} sub="with documentation" color={C.ac} />
        <Stat label="Total Loss" value={fmt$(totalLoss)} color={C.red} />
        <Stat label="Damage Reports" value={totalDamage} sub="from team" color={C.wrn} />
      </Rw>

      <div style={{ display: "flex", gap: 10, marginTop: 16, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <Search size={12} style={{ position: "absolute", left: 8, top: 11, color: C.t2 }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." style={{ ...inp, paddingLeft: 26 }} />
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[{ k: "all", l: "All" }, { k: "damage", l: "Damage" }, { k: "shrinkage", l: "Physical Count" }, { k: "found", l: "Found" }].map((f) => (
            <button key={f.k} onClick={() => setFilter(f.k)} style={{ ...bS, padding: "8px 14px", fontSize: 12, background: filter === f.k ? NAVY : "transparent", color: filter === f.k ? "#fff" : C.txt, borderColor: filter === f.k ? NAVY : C.brd }}>{f.l}</button>
          ))}
        </div>
      </div>

      {/* PHOTO GRID */}
      {withPhotos.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...lbl, marginBottom: 10 }}>Photos ({withPhotos.length})</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {withPhotos.slice(0, 50).map((r) => (
              <div key={r.id} onClick={() => setEnlarged(r)} style={{ cursor: "pointer", position: "relative", borderRadius: 8, overflow: "hidden", border: `1px solid ${C.brd}`, width: 140, height: 140 }}>
                <img src={r.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,.7)", padding: "4px 6px", color: "#fff", fontSize: 9 }}>
                  <div style={{ fontWeight: 700 }}>{r.itemName}</div>
                  <div>{r.reason} · {fD(r.date)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FULL LIST */}
      <div style={{ ...crd, padding: 0 }}><div style={{ overflowX: "auto", maxHeight: 500 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr>{["Date", "Item", "Type", "Reason", "Qty", "Value", "Reported By", "Photo", "Notes", "Actions"].map((h) => <th key={h} style={{ padding: "9px 8px", textAlign: "left", fontWeight: 700, color: C.t2, fontSize: 10, textTransform: "uppercase", position: "sticky", top: 0, background: C.card }}>{h}</th>)}</tr></thead>
          <tbody>
            {!incidents.length && <tr><td colSpan={10} style={{ padding: 24, textAlign: "center", color: C.t2 }}>No incidents found.</td></tr>}
            {incidents.slice(0, 100).map((r) => (
              <tr key={r.id} style={{ borderBottom: `1px solid ${C.brd}` }}>
                <td style={{ padding: "7px 8px", color: C.t2 }}>{fD(r.date)}</td>
                <td style={{ padding: "7px 8px", fontWeight: 600 }}>{r.itemName}</td>
                <td style={{ padding: "7px 8px" }}><span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 3, background: r.type === "damage" ? C.wrn + "20" : r.type === "found" ? C.grn + "20" : C.red + "20", color: r.type === "damage" ? C.wrn : r.type === "found" ? C.grn : C.red }}>{r.type}</span></td>
                <td style={{ padding: "7px 8px" }}>{r.reason || "—"}</td>
                <td style={{ padding: "7px 8px", fontFamily: MN }}>{r.qty}</td>
                <td style={{ padding: "7px 8px", fontFamily: MN, color: C.red }}>{fmt$(r.lostValue || 0)}</td>
                <td style={{ padding: "7px 8px", color: C.t2 }}>{r.reportedBy || "—"}</td>
                <td style={{ padding: "7px 8px" }}>{r.photo ? <img src={r.photo} alt="" style={{ height: 28, borderRadius: 3, cursor: "pointer" }} onClick={() => setEnlarged(r)} /> : "—"}</td>
                <td style={{ padding: "7px 8px", color: r.note ? C.ac : C.t2, maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: r.note ? "pointer" : "default", textDecoration: r.note ? "underline" : "none" }} onClick={() => r.note && setEnlarged(r)}>{r.note || "—"}</td>
                <td style={{ padding: "7px 8px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => { setEditing(r); setEditQty(String(r.qty || "")); setEditReason(r.reason || "Damaged"); setEditNote(r.note || ""); }} style={{ background: "none", border: "none", color: C.t2, cursor: "pointer" }}><Edit3 size={13} /></button>
                    <button onClick={() => setDeleteWarn(r)} style={{ background: "none", border: "none", color: C.red, cursor: "pointer" }}><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>

      {/* Enlarged photo modal */}
      {enlarged && (
        <Modal open onClose={() => setEnlarged(null)} title={`${enlarged.itemName} — ${enlarged.reason}`} wide>
          <img src={enlarged.photo} alt="" style={{ width: "100%", borderRadius: 8, marginBottom: 12 }} />
          <div style={{ fontSize: 13 }}>
            <div><strong>Date:</strong> {fD(enlarged.date)}</div>
            <div><strong>Qty:</strong> {enlarged.qty} · <strong>Value:</strong> <span style={{ color: C.red }}>{fmt$(enlarged.lostValue || 0)}</span></div>
            <div><strong>Reported by:</strong> {enlarged.reportedBy || "—"}</div>
            {enlarged.note && <div style={{ marginTop: 6 }}><strong>Notes:</strong> {enlarged.note}</div>}
          </div>
        </Modal>
      )}

      {/* Delete confirmation */}
      {deleteWarn && (
        <Modal open onClose={() => setDeleteWarn(null)} title="">
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ background: C.red + "15", borderRadius: 16, padding: 20, display: "inline-flex", marginBottom: 16 }}><AlertTriangle size={48} color={C.red} /></div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: C.red, marginBottom: 8 }}>DELETE THIS REPORT?</h2>
            <p style={{ fontSize: 14, marginBottom: 6 }}><strong>{deleteWarn.itemName}</strong> — {deleteWarn.reason}</p>
            <p style={{ color: C.t2, fontSize: 13, marginBottom: 6 }}>{deleteWarn.qty} units · {fmt$(deleteWarn.lostValue || 0)} loss · {fD(deleteWarn.date)}</p>
            <p style={{ color: C.grn, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>This will remove the report and restore {deleteWarn.qty} unit{deleteWarn.qty !== 1 ? "s" : ""} back to inventory.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setDeleteWarn(null)} style={{ ...bS, padding: "12px 28px", fontSize: 14 }}>Cancel</button>
              <button onClick={() => {
                // Restore inventory
                const r = deleteWarn;
                const opt = r.option || "_default";
                sI(items.map((it) => {
                  if (it.id !== r.itemId) return it;
                  const v = { ...(it.variants || getVariants(it)) };
                  const curV = v[opt] || { qty: 0, wac: it.wacCost || 0 };
                  v[opt] = { ...curV, qty: (curV.qty || 0) + (r.qty || 0) };
                  const totalQ = Object.values(v).reduce((s, x) => s + (x.qty || 0), 0);
                  return { ...it, variants: v, qtyOnHand: totalQ };
                }));
                sSh(shrinkLog.filter((x) => x.id !== r.id));
                setDeleteWarn(null);
              }} style={{ ...bD, padding: "12px 28px", fontSize: 14 }}><Trash2 size={14} /> Delete & Restore Inventory</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit modal */}
      {editing && (
        <Modal open onClose={() => setEditing(null)} title={`Edit Report — ${editing.itemName}`}>
          <Fld label="Quantity"><input type="number" min="1" value={editQty} onChange={(e) => setEditQty(e.target.value)} style={inp} /></Fld>
          <Fld label="Reason"><select value={editReason} onChange={(e) => setEditReason(e.target.value)} style={{ ...inp, cursor: "pointer" }}>{REASONS.map((r) => <option key={r}>{r}</option>)}</select></Fld>
          <Fld label="Notes"><input value={editNote} onChange={(e) => setEditNote(e.target.value)} style={inp} /></Fld>
          {editing.photo && <div style={{ marginBottom: 12 }}><img src={editing.photo} alt="" style={{ maxHeight: 150, borderRadius: 6 }} /></div>}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setEditing(null)} style={bS}>Cancel</button>
            <button onClick={() => {
              const newQty = +editQty || editing.qty;
              const newCost = (editing.unitCost || 0);
              sSh(shrinkLog.map((x) => x.id === editing.id ? { ...x, qty: newQty, reason: editReason, note: editNote.trim(), lostValue: newQty * newCost } : x));
              setEditing(null);
            }} style={bP}><Check size={14} /> Save Changes</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══ SUPPLIER COST ═══
function SupplierCost({ items, sI }) {
  const [edits, setEdits] = useState({}); // { itemId: supplierCostValue }
  const [saved, setSaved] = useState(false);
  const [catF, setCatF] = useState("All");
  const [searchF, setSearchF] = useState("");

  const cats = ["All", ...new Set(items.map((i) => i.category))];
  const filtered = items.filter((i) => {
    if (catF !== "All" && i.category !== catF) return false;
    if (searchF && !i.name.toLowerCase().includes(searchF.toLowerCase())) return false;
    return true;
  }).sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

  const hasChanges = Object.keys(edits).length > 0;

  const setSupplierCost = (itemId, val) => {
    setEdits((prev) => {
      const n = { ...prev };
      const item = items.find((i) => i.id === itemId);
      // Only track if different from current
      if (val === "" || (+val === (item?.supplierCost || 0))) {
        delete n[itemId];
      } else {
        n[itemId] = val;
      }
      return n;
    });
    setSaved(false);
  };

  const saveAll = () => {
    if (!hasChanges) return;
    const updated = items.map((it) => {
      if (edits[it.id] !== undefined) {
        return { ...it, supplierCost: +edits[it.id] || 0 };
      }
      return it;
    });
    sI(updated);
    setEdits({});
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const totalOurValue = filtered.reduce((s, it) => s + totalStock(it) * overallWAC(it), 0);
  const totalSupplierValue = filtered.reduce((s, it) => {
    if (!it.supplierCost) return s;
    return s + totalStock(it) * it.supplierCost;
  }, 0);
  const itemsWithSupplier = filtered.filter((it) => it.supplierCost);
  const totalSavings = itemsWithSupplier.reduce((s, it) => s + totalStock(it) * ((it.supplierCost || 0) - overallWAC(it)), 0);

  return (
    <div className="fu">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, fontFamily: BC }}>SUPPLIER COST COMPARISON</h1>
          <p style={{ color: C.t2, fontSize: 13, marginTop: 4 }}>See what suppliers would charge vs our blended cost. Edit supplier prices anytime — changes only affect going forward.</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {saved && <span style={{ color: C.grn, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}><CheckCircle size={14} /> Saved!</span>}
          <button onClick={saveAll} disabled={!hasChanges}
            style={{ ...bP, background: hasChanges ? C.grn : C.brd, opacity: hasChanges ? 1 : 0.5, padding: "10px 24px" }}>
            <Check size={14} /> Save Changes {hasChanges ? `(${Object.keys(edits).length})` : ""}
          </button>
        </div>
      </div>

      <Rw g={14}>
        <Stat label="Our Total Cost (on hand)" value={fmt$(totalOurValue)} color={NAVY} />
        {totalSupplierValue > 0 && <Stat label="Supplier Would Charge" value={fmt$(totalSupplierValue)} color={C.t2} />}
        {totalSavings !== 0 && <Stat label={totalSavings >= 0 ? "We're Saving" : "We're Overpaying"} value={fmt$(Math.abs(totalSavings))} sub="Live comparison — not used in reports" color={totalSavings >= 0 ? C.grn : C.red} />}
      </Rw>

      <div style={{ display: "flex", gap: 10, marginTop: 16, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <Search size={12} style={{ position: "absolute", left: 8, top: 10, color: C.t2 }} />
          <input value={searchF} onChange={(e) => setSearchF(e.target.value)} placeholder="Search items..." style={{ ...inp, paddingLeft: 26, padding: "8px 10px 8px 26px", fontSize: 12 }} />
        </div>
        <select value={catF} onChange={(e) => setCatF(e.target.value)} style={{ ...inp, width: "auto", cursor: "pointer", padding: "8px 10px", fontSize: 12 }}>
          {cats.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ ...crd, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto", maxHeight: 600 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead><tr>
              {["Item", "Category", "On Hand", "Our WAC (Blended)", "Supplier Cost", "Delta / Unit", "Savings on Stock"].map((h) => (
                <th key={h} style={{ padding: "10px 10px", textAlign: "left", fontWeight: 700, color: C.t2, fontSize: 10, textTransform: "uppercase", position: "sticky", top: 0, background: C.card, zIndex: 1 }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((it) => {
                const wac = overallWAC(it);
                const sc = edits[it.id] !== undefined ? +edits[it.id] : (it.supplierCost || "");
                const scNum = +sc || 0;
                const delta = scNum > 0 ? scNum - wac : 0;
                const stock = totalStock(it);
                const savingsVal = delta * stock;
                const isEdited = edits[it.id] !== undefined;
                return (
                  <tr key={it.id} style={{ borderBottom: `1px solid ${C.brd}`, background: isEdited ? "#fffde7" : (delta < 0 ? C.red + "05" : "transparent") }}>
                    <td style={{ padding: "9px 10px", fontWeight: 600 }}>{it.name}</td>
                    <td style={{ padding: "9px 10px", color: C.t2 }}>{it.category}</td>
                    <td style={{ padding: "9px 10px", fontFamily: MN }}>{stock} {it.unit}</td>
                    <td style={{ padding: "9px 10px", fontFamily: MN, fontWeight: 600 }}>{fmt$(wac)}</td>
                    <td style={{ padding: "9px 10px" }}>
                      <input type="number" step=".01" value={edits[it.id] !== undefined ? edits[it.id] : (it.supplierCost || "")}
                        onChange={(e) => setSupplierCost(it.id, e.target.value)}
                        placeholder="Enter cost"
                        style={{ ...inp, width: 100, padding: "6px 8px", textAlign: "center", fontSize: 13, fontFamily: MN, fontWeight: 600,
                          borderColor: isEdited ? C.wrn : C.brd, background: isEdited ? "#fffde7" : C.sf }} />
                    </td>
                    <td style={{ padding: "9px 10px", fontFamily: MN, fontWeight: 700, color: delta > 0 ? C.grn : delta < 0 ? C.red : C.t2 }}>
                      {scNum > 0 ? (delta > 0 ? "+" : "") + fmt$(delta) : "—"}
                    </td>
                    <td style={{ padding: "9px 10px", fontFamily: MN, fontWeight: 700, color: savingsVal > 0 ? C.grn : savingsVal < 0 ? C.red : C.t2 }}>
                      {scNum > 0 ? fmt$(savingsVal) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {hasChanges && (
        <div style={{ ...crd, marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `4px solid ${C.wrn}` }}>
          <span style={{ fontSize: 13, color: C.wrn, fontWeight: 600 }}>You have unsaved changes to {Object.keys(edits).length} item{Object.keys(edits).length > 1 ? "s" : ""}</span>
          <button onClick={saveAll} style={{ ...bP, background: C.grn }}><Check size={14} /> Save All</button>
        </div>
      )}

      <div style={{ fontSize: 11, color: C.t2, marginTop: 12, fontStyle: "italic" }}>
        Positive delta (green) = supplier costs more than us — we're saving money. Negative (red) = we're overpaying compared to supplier.
        All comparisons use our true blended cost (WAC), not markup price. Changes to supplier cost only affect future reporting.
      </div>
    </div>
  );
}

// ═══ REPORTS ═══
function Reports({ orders, items, shrinkLog }) {
  const [tab, setTab] = useState("dash");
  const [range, setRange] = useState("30");
  const [catF, setCatF] = useState("All");
  const [searchF, setSearchF] = useState("");
  const [invLog, setInvLog] = useState([]);

  useEffect(() => { (async () => { setInvLog(await ld("inv_log", [])); })(); }, []);

  const cut = new Date(); cut.setDate(cut.getDate() - +range);
  const iMap = Object.fromEntries(items.map((i) => [i.id, i]));
  const appOrders = orders.filter((o) => o.status === "approved" && o.type === "order");
  const appReturns = orders.filter((o) => o.status === "approved" && o.type === "return");
  const rangeOrders = appOrders.filter((o) => new Date(o.date) >= cut);
  const cats = ["All", ...new Set(items.map((i) => i.category))];

  const filterItem = (it) => {
    if (catF !== "All" && it.category !== catF) return false;
    if (searchF && !it.name.toLowerCase().includes(searchF.toLowerCase())) return false;
    return true;
  };

  // CSV export helper
  const exportCSV = (headers, rows, filename) => {
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename + ".csv";
    document.body.appendChild(a); a.click(); setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
  };

  // ── Computed data used across tabs ──
  // Item movement data
  const itemMovement = useMemo(() => {
    const mv = {};
    items.forEach((it) => { mv[it.id] = { sold: 0, returned: 0, lastUsed: null, firstReceived: null }; });
    appOrders.forEach((o) => o.lines.forEach((l) => {
      if (mv[l.itemId]) {
        mv[l.itemId].sold += l.qty;
        const d = new Date(o.date);
        if (!mv[l.itemId].lastUsed || d > mv[l.itemId].lastUsed) mv[l.itemId].lastUsed = d;
      }
    }));
    appReturns.forEach((o) => o.lines.forEach((l) => { if (mv[l.itemId]) mv[l.itemId].returned += l.qty; }));
    return mv;
  }, [items, appOrders, appReturns]);

  // Pending (reserved) qty per item
  const reserved = useMemo(() => {
    const r = {};
    orders.filter((o) => o.status === "pending" && o.type === "order").forEach((o) => o.lines.forEach((l) => {
      r[l.itemId] = (r[l.itemId] || 0) + l.qty;
    }));
    return r;
  }, [orders]);

  const tabs = [
    { k: "dash", l: "Dashboard" }, { k: "inv", l: "Inventory" }, { k: "move", l: "Movement" }, { k: "purchases", l: "Purchases" },
    { k: "aging", l: "Aging" }, { k: "sales", l: "Sales" }, { k: "reorder", l: "Reorder" },
    { k: "margin", l: "Margin" }, { k: "shrink", l: "Shrinkage" }, { k: "savings", l: "Savings vs Supplier" }, { k: "jobs", l: "By Job" },
  ];

  const thS = { padding: "8px 10px", textAlign: "left", fontWeight: 700, color: C.t2, fontSize: 10, textTransform: "uppercase", position: "sticky", top: 0, background: C.card };
  const tdS = { padding: "7px 10px", fontSize: 12 };

  return (
    <div className="fu">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, fontFamily: BC }}>REPORTS</h1>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}><Search size={12} style={{ position: "absolute", left: 8, top: 10, color: C.t2 }} /><input value={searchF} onChange={(e) => setSearchF(e.target.value)} placeholder="Item..." style={{ ...inp, width: 140, paddingLeft: 26, padding: "7px 10px 7px 26px", fontSize: 12 }} /></div>
          <select value={catF} onChange={(e) => setCatF(e.target.value)} style={{ ...inp, width: "auto", cursor: "pointer", padding: "7px 10px", fontSize: 12 }}>{cats.map((c) => <option key={c}>{c}</option>)}</select>
          <select value={range} onChange={(e) => setRange(e.target.value)} style={{ ...inp, width: "auto", cursor: "pointer", padding: "7px 10px", fontSize: 12 }}>
            <option value="7">7 days</option><option value="30">30 days</option><option value="90">90 days</option><option value="180">6 months</option><option value="365">1 year</option><option value="9999">All time</option>
          </select>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: 2, marginBottom: 16, flexWrap: "wrap", borderBottom: `2px solid ${C.brd}` }}>
        {tabs.map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)}
            style={{ background: tab === t.k ? C.card : "transparent", border: "none", borderBottom: tab === t.k ? `2px solid ${RED}` : "2px solid transparent",
              color: tab === t.k ? C.txt : C.t2, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: -2 }}>{t.l}</button>
        ))}
      </div>

      {/* ── DASHBOARD ── */}
      {tab === "dash" && (() => {
        const totalVal = items.reduce((s, it) => { const v = getVariants(it); return s + Object.values(v).reduce((s2, x) => s2 + (x.qty || 0) * (x.wac || 0), 0); }, 0);
        const lowStock = getLowStockVariants(items);
        const deadStock = items.filter((it) => { const mv = itemMovement[it.id]; return totalStock(it) > 0 && (!mv?.lastUsed || (Date.now() - mv.lastUsed) > 90 * 86400000); });
        const topMovers = Object.entries(itemMovement).map(([id, mv]) => ({ id, name: iMap[id]?.name || "?", sold: mv.sold })).filter((x) => x.sold > 0).sort((a, b) => b.sold - a.sold).slice(0, 8);
        const recentOrders = orders.filter((o) => o.status === "approved").sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
        const rangeShrink = (shrinkLog || []).filter((r) => new Date(r.date) >= cut);
        const shrinkVal = rangeShrink.reduce((s, r) => s + (r.lostValue || 0), 0);
        const supplierSavings = rangeOrders.reduce((s, o) => {
          return s + (o.lines || []).reduce((s2, l) => {
            if (!l.supplierCost) return s2;
            return s2 + l.qty * (l.supplierCost - (l.unitCost || 0));
          }, 0);
        }, 0);
        return (
          <div>
            <Rw g={14}>
              <Stat label="Total Inventory Value" value={fmt$(totalVal)} sub={`${items.length} items`} color={NAVY} />
              <Stat label="Low Stock" value={lowStock.length} sub={lowStock.length ? "Need reorder" : "All good"} color={lowStock.length ? C.red : C.grn} />
              <Stat label="Dead Stock (90+)" value={deadStock.length} sub="No movement" color={deadStock.length ? C.wrn : C.grn} />
              <Stat label="Shrinkage" value={fmt$(shrinkVal)} sub={`${rangeShrink.length} adjustments`} color={shrinkVal > 0 ? C.red : C.grn} />
              {supplierSavings !== 0 && <Stat label="Supplier Savings" value={fmt$(supplierSavings)} sub="On orders placed" color={supplierSavings > 0 ? C.grn : C.red} />}
            </Rw>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 16 }}>
              <div style={{ ...crd, flex: "1 1 340px" }}>
                <div style={{ ...lbl, marginBottom: 10 }}>Top Movers</div>
                {topMovers.map((t) => (
                  <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${C.brd}`, fontSize: 13 }}>
                    <span style={{ fontWeight: 600 }}>{t.name}</span><span style={{ fontFamily: MN, color: NAVY }}>{t.sold} sold</span>
                  </div>
                ))}
                {!topMovers.length && <div style={{ color: C.t2, fontSize: 13, padding: 16, textAlign: "center" }}>No sales data yet.</div>}
              </div>
              <div style={{ ...crd, flex: "1 1 340px" }}>
                <div style={{ ...lbl, marginBottom: 10 }}>Recent Activity</div>
                {recentOrders.map((o) => (
                  <div key={o.id} style={{ padding: "5px 0", borderBottom: `1px solid ${C.brd}`, fontSize: 12 }}>
                    <span style={{ fontWeight: 600 }}>{o.type === "return" ? "Return" : "Order"}</span> · PO: {o.poNumber || "—"} · {o.userName} · {fD(o.date)}
                    <span style={{ float: "right", fontFamily: MN, color: C.ac }}>{fmt$(o.lines.reduce((s, l) => s + l.qty * (l.markupCost || 0), 0))}</span>
                  </div>
                ))}
                {!recentOrders.length && <div style={{ color: C.t2, fontSize: 13, padding: 16, textAlign: "center" }}>No activity yet.</div>}
              </div>
              {lowStock.length > 0 && <div style={{ ...crd, flex: "1 1 340px", borderLeft: `4px solid ${C.red}` }}>
                <div style={{ ...lbl, marginBottom: 10, color: C.red }}>Needs Reorder</div>
                {lowStock.map((ls) => (
                  <div key={ls.itemId + ls.optName} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${C.brd}`, fontSize: 13 }}>
                    <span>{ls.itemName}{ls.optName !== "_default" ? ` — ${ls.optName}` : ""}</span><span style={{ fontFamily: MN, color: C.red }}>{ls.qty} / {ls.minStock} min</span>
                  </div>
                ))}
              </div>}
            </div>
          </div>
        );
      })()}

      {/* ── INVENTORY ── */}
      {tab === "inv" && (() => {
        const rows = items.filter(filterItem).sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
        const hs = ["Item", "Category", "Color/Style", "On Hand", "Reserved", "Available", "WAC", "Total Value"];
        const csvRows = [];
        return (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
              <button onClick={() => {
                rows.forEach((it) => { const v = getVariants(it); Object.entries(v).forEach(([opt, vd]) => {
                  const res = reserved[it.id] || 0; const avail = Math.max(0, (vd.qty || 0) - res);
                  csvRows.push([it.name, it.category, opt === "_default" ? "" : opt, vd.qty || 0, res, avail, (vd.wac || 0).toFixed(2), ((vd.qty || 0) * (vd.wac || 0)).toFixed(2)]);
                }); });
                exportCSV(hs, csvRows, "Inventory_Report");
              }} style={{ ...bS, padding: "6px 12px", fontSize: 11 }}>Export CSV</button>
            </div>
            <div style={{ ...crd, padding: 0, overflow: "hidden" }}><div style={{ overflowX: "auto", maxHeight: 500 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead><tr>{hs.map((h) => <th key={h} style={thS}>{h}</th>)}</tr></thead>
                <tbody>{rows.map((it) => {
                  const v = getVariants(it); const res = reserved[it.id] || 0;
                  return Object.entries(v).map(([opt, vd], vi) => {
                    const avail = Math.max(0, (vd.qty || 0) - (vi === 0 ? res : 0));
                    return (
                      <tr key={it.id + opt} style={{ borderBottom: `1px solid ${C.brd}` }}>
                        <td style={{ ...tdS, fontWeight: vi === 0 ? 700 : 400 }}>{vi === 0 ? it.name : ""}</td>
                        <td style={{ ...tdS, color: C.t2 }}>{vi === 0 ? it.category : ""}</td>
                        <td style={{ ...tdS, fontWeight: 600 }}>{opt === "_default" ? "—" : opt}</td>
                        <td style={{ ...tdS, fontFamily: MN, fontWeight: 600, color: (vd.qty || 0) <= 0 ? C.red : C.txt }}>{vd.qty || 0}</td>
                        <td style={{ ...tdS, fontFamily: MN, color: C.wrn }}>{vi === 0 ? res : ""}</td>
                        <td style={{ ...tdS, fontFamily: MN, color: C.grn }}>{vi === 0 ? avail : ""}</td>
                        <td style={{ ...tdS, fontFamily: MN }}>{fmt$(vd.wac)}</td>
                        <td style={{ ...tdS, fontFamily: MN, fontWeight: 600 }}>{fmt$((vd.qty || 0) * (vd.wac || 0))}</td>
                      </tr>
                    );
                  });
                })}</tbody>
              </table>
            </div></div>
          </div>
        );
      })()}

      {/* ── MOVEMENT ── */}
      {tab === "move" && (() => {
        const allTx = [];
        rangeOrders.forEach((o) => o.lines.forEach((l) => { allTx.push({ date: o.date, type: "Sold", item: iMap[l.itemId]?.name || "?", option: l.option, qty: l.qty, cost: l.unitCost, po: o.poNumber, job: o.jobName }); }));
        orders.filter((o) => o.status === "approved" && o.type === "return" && new Date(o.date) >= cut).forEach((o) => o.lines.forEach((l) => { allTx.push({ date: o.date, type: "Returned", item: iMap[l.itemId]?.name || "?", option: l.option, qty: l.qty, cost: l.unitCost, po: o.poNumber, job: o.jobName }); }));
        allTx.sort((a, b) => new Date(b.date) - new Date(a.date));
        const filtered = searchF ? allTx.filter((t) => t.item.toLowerCase().includes(searchF.toLowerCase())) : allTx;
        return (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
              <button onClick={() => exportCSV(["Date", "Type", "Item", "Option", "Qty", "Unit Cost", "PO", "Job"], filtered.map((t) => [fD(t.date), t.type, t.item, t.option || "", t.qty, (t.cost || 0).toFixed(2), t.po || "", t.job || ""]), "Movement_Report")} style={{ ...bS, padding: "6px 12px", fontSize: 11 }}>Export CSV</button>
            </div>
            <div style={{ ...crd, padding: 0 }}><div style={{ overflowX: "auto", maxHeight: 500 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead><tr>{["Date", "Type", "Item", "Option", "Qty", "Unit Cost", "PO", "Job"].map((h) => <th key={h} style={thS}>{h}</th>)}</tr></thead>
                <tbody>{!filtered.length && <tr><td colSpan={8} style={{ ...tdS, textAlign: "center", color: C.t2, padding: 20 }}>No transactions in this period.</td></tr>}
                {filtered.slice(0, 200).map((t, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.brd}` }}>
                    <td style={{ ...tdS, color: C.t2 }}>{fD(t.date)}</td>
                    <td style={{ ...tdS, fontWeight: 600, color: t.type === "Sold" ? C.ac : C.blu }}>{t.type}</td>
                    <td style={{ ...tdS, fontWeight: 600 }}>{t.item}</td>
                    <td style={{ ...tdS, color: C.t2 }}>{t.option && t.option !== "_default" ? t.option : "—"}</td>
                    <td style={{ ...tdS, fontFamily: MN }}>{t.qty}</td>
                    <td style={{ ...tdS, fontFamily: MN }}>{fmt$(t.cost)}</td>
                    <td style={{ ...tdS, color: C.t2 }}>{t.po || "—"}</td>
                    <td style={{ ...tdS, color: C.t2 }}>{t.job || "—"}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div></div>
          </div>
        );
      })()}

      {/* ── PURCHASES ── */}
      {tab === "purchases" && (() => {
        const rangeLog = invLog.filter((r) => new Date(r.date) >= cut);
        const filtered = searchF ? rangeLog.filter((r) => (r.itemName || "").toLowerCase().includes(searchF.toLowerCase())) : rangeLog;
        const totalSpent = filtered.reduce((s, r) => s + (r.qty || 0) * (r.unitCost || 0), 0);
        const totalUnits = filtered.reduce((s, r) => s + (r.qty || 0), 0);
        // By item
        const byItem = {};
        filtered.forEach((r) => {
          const k = r.itemId || r.itemName;
          if (!byItem[k]) byItem[k] = { name: r.itemName || "?", qty: 0, spent: 0, receipts: 0 };
          byItem[k].qty += r.qty || 0;
          byItem[k].spent += (r.qty || 0) * (r.unitCost || 0);
          byItem[k].receipts++;
        });
        const itemData = Object.values(byItem).sort((a, b) => b.spent - a.spent);
        // By month
        const byMonth = {};
        filtered.forEach((r) => {
          const m = new Date(r.date).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
          if (!byMonth[m]) byMonth[m] = { month: m, spent: 0 };
          byMonth[m].spent += (r.qty || 0) * (r.unitCost || 0);
        });
        const monthData = Object.values(byMonth);
        return (
          <div>
            <Rw g={14}>
              <Stat label="Total Spent" value={fmt$(totalSpent)} sub={`${filtered.length} receipts`} color={NAVY} />
              <Stat label="Total Units Received" value={totalUnits} color={C.ac} />
              <Stat label="Avg Cost / Receipt" value={filtered.length ? fmt$(totalSpent / filtered.length) : "—"} color={C.t2} />
            </Rw>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 14 }}>
              {monthData.length > 0 && <div style={{ ...crd, flex: "1 1 460px" }}>
                <div style={lbl}>Purchase Spending Over Time</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={monthData}><CartesianGrid strokeDasharray="3 3" stroke={C.brd} /><XAxis dataKey="month" stroke={C.t2} fontSize={11} /><YAxis stroke={C.t2} fontSize={11} tickFormatter={(v) => "$" + v.toLocaleString()} /><Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.brd}`, borderRadius: 6, fontSize: 12 }} formatter={(v) => fmt$(v)} /><Bar dataKey="spent" name="Spent" fill={NAVY} radius={[4, 4, 0, 0]} /></BarChart>
                </ResponsiveContainer>
              </div>}
              <div style={{ ...crd, flex: "1 1 380px", padding: 0 }}>
                <div style={{ padding: "12px 14px 0" }}><div style={lbl}>Spending by Item</div></div>
                <div style={{ overflowX: "auto", maxHeight: 350 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead><tr>{["Item", "Receipts", "Qty", "Total Spent", "Avg Unit Cost"].map((h) => <th key={h} style={thS}>{h}</th>)}</tr></thead>
                    <tbody>{!itemData.length && <tr><td colSpan={5} style={{ ...tdS, textAlign: "center", color: C.t2, padding: 20 }}>No purchase data in this period.</td></tr>}
                    {itemData.map((d, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.brd}` }}>
                        <td style={{ ...tdS, fontWeight: 600 }}>{d.name}</td>
                        <td style={{ ...tdS, fontFamily: MN }}>{d.receipts}</td>
                        <td style={{ ...tdS, fontFamily: MN }}>{d.qty}</td>
                        <td style={{ ...tdS, fontFamily: MN, fontWeight: 700, color: NAVY }}>{fmt$(d.spent)}</td>
                        <td style={{ ...tdS, fontFamily: MN }}>{d.qty > 0 ? fmt$(d.spent / d.qty) : "—"}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* Full receipt log */}
            <div style={{ ...crd, padding: 0, marginTop: 14 }}>
              <div style={{ padding: "12px 14px 0" }}><div style={lbl}>All Receipts</div></div>
              <div style={{ overflowX: "auto", maxHeight: 300 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead><tr>{["Date", "Item", "Option", "Qty", "Unit Cost", "Total", "Notes"].map((h) => <th key={h} style={thS}>{h}</th>)}</tr></thead>
                  <tbody>{filtered.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 100).map((r, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${C.brd}` }}>
                      <td style={{ ...tdS, color: C.t2 }}>{fD(r.date)}</td>
                      <td style={{ ...tdS, fontWeight: 600 }}>{r.itemName}</td>
                      <td style={{ ...tdS, color: C.t2 }}>{r.option && r.option !== "_default" ? r.option : "—"}</td>
                      <td style={{ ...tdS, fontFamily: MN }}>{r.qty}</td>
                      <td style={{ ...tdS, fontFamily: MN }}>{fmt$(r.unitCost)}</td>
                      <td style={{ ...tdS, fontFamily: MN, fontWeight: 600 }}>{fmt$((r.qty || 0) * (r.unitCost || 0))}</td>
                      <td style={{ ...tdS, color: C.t2 }}>{r.note || "—"}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── AGING ── */}
      {tab === "aging" && (() => {
        const now = Date.now();
        const agingData = items.filter(filterItem).filter((it) => totalStock(it) > 0).map((it) => {
          const mv = itemMovement[it.id];
          const daysSinceSale = mv?.lastUsed ? Math.floor((now - mv.lastUsed) / 86400000) : 999;
          const bucket = daysSinceSale <= 30 ? "0-30" : daysSinceSale <= 60 ? "31-60" : daysSinceSale <= 90 ? "61-90" : "90+";
          return { ...it, daysSinceSale, bucket, stock: totalStock(it), value: totalStock(it) * overallWAC(it) };
        }).sort((a, b) => b.daysSinceSale - a.daysSinceSale);
        const buckets = { "0-30": 0, "31-60": 0, "61-90": 0, "90+": 0 };
        agingData.forEach((d) => { buckets[d.bucket] += d.value; });
        return (
          <div>
            <Rw g={14}>
              {Object.entries(buckets).map(([b, v]) => (
                <Stat key={b} label={`${b} days`} value={fmt$(v)} color={b === "90+" ? C.red : b === "61-90" ? C.wrn : C.grn} />
              ))}
            </Rw>
            <div style={{ ...crd, padding: 0, marginTop: 14 }}><div style={{ overflowX: "auto", maxHeight: 400 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead><tr>{["Item", "Category", "On Hand", "Value", "Days Since Last Sale", "Bucket"].map((h) => <th key={h} style={thS}>{h}</th>)}</tr></thead>
                <tbody>{agingData.map((d) => (
                  <tr key={d.id} style={{ borderBottom: `1px solid ${C.brd}`, background: d.daysSinceSale > 90 ? C.red + "08" : "transparent" }}>
                    <td style={{ ...tdS, fontWeight: 600 }}>{d.name}</td>
                    <td style={{ ...tdS, color: C.t2 }}>{d.category}</td>
                    <td style={{ ...tdS, fontFamily: MN }}>{d.stock} {d.unit}</td>
                    <td style={{ ...tdS, fontFamily: MN }}>{fmt$(d.value)}</td>
                    <td style={{ ...tdS, fontFamily: MN, fontWeight: 700, color: d.daysSinceSale > 90 ? C.red : d.daysSinceSale > 60 ? C.wrn : C.grn }}>{d.daysSinceSale >= 999 ? "Never" : d.daysSinceSale}</td>
                    <td style={{ ...tdS, fontWeight: 600 }}>{d.bucket}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div></div>
          </div>
        );
      })()}

      {/* ── SALES ── */}
      {tab === "sales" && (() => {
        const byItem = {};
        rangeOrders.forEach((o) => o.lines.forEach((l) => {
          const it = iMap[l.itemId]; if (!it || !filterItem(it)) return;
          const k = l.itemId + ":" + (l.option || "");
          if (!byItem[k]) byItem[k] = { name: it.name, option: l.option && l.option !== "_default" ? l.option : "", cat: it.category, qty: 0, rev: 0, cost: 0 };
          byItem[k].qty += l.qty; byItem[k].rev += l.qty * (l.markupCost || 0); byItem[k].cost += l.qty * (l.unitCost || 0);
        }));
        const salesData = Object.values(byItem).sort((a, b) => b.qty - a.qty);
        const noMovement = items.filter(filterItem).filter((it) => !rangeOrders.some((o) => o.lines.some((l) => l.itemId === it.id)));
        const tRev = salesData.reduce((s, d) => s + d.rev, 0);
        const tCost2 = salesData.reduce((s, d) => s + d.cost, 0);
        return (
          <div>
            <Rw g={14}><Stat label="Revenue" value={fmt$(tRev)} sub={`${rangeOrders.length} orders`} color={C.ac} /><Stat label="Cost" value={fmt$(tCost2)} color={NAVY} /><Stat label="Margin" value={tRev > 0 ? `${((1 - tCost2 / tRev) * 100).toFixed(1)}%` : "—"} sub={fmt$(tRev - tCost2)} color={C.grn} /></Rw>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 14 }}>
              <div style={{ ...crd, flex: "1 1 500px", padding: 0 }}>
                <div style={{ padding: "12px 14px 0" }}><div style={lbl}>Sales by Item</div></div>
                <div style={{ overflowX: "auto", maxHeight: 400 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead><tr>{["Item", "Color/Style", "Qty Sold", "Revenue", "Cost", "Margin $", "Margin %"].map((h) => <th key={h} style={thS}>{h}</th>)}</tr></thead>
                    <tbody>{salesData.map((d, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.brd}` }}>
                        <td style={{ ...tdS, fontWeight: 600 }}>{d.name}</td>
                        <td style={{ ...tdS, color: C.t2 }}>{d.option || "—"}</td>
                        <td style={{ ...tdS, fontFamily: MN }}>{d.qty}</td>
                        <td style={{ ...tdS, fontFamily: MN, color: C.ac }}>{fmt$(d.rev)}</td>
                        <td style={{ ...tdS, fontFamily: MN, color: C.t2 }}>{fmt$(d.cost)}</td>
                        <td style={{ ...tdS, fontFamily: MN, color: C.grn }}>{fmt$(d.rev - d.cost)}</td>
                        <td style={{ ...tdS, fontFamily: MN, fontWeight: 700, color: C.grn }}>{d.rev > 0 ? ((1 - d.cost / d.rev) * 100).toFixed(1) + "%" : "—"}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
              {noMovement.length > 0 && <div style={{ ...crd, flex: "1 1 280px" }}>
                <div style={{ ...lbl, marginBottom: 10, color: C.wrn }}>No Movement ({noMovement.length})</div>
                {noMovement.slice(0, 20).map((it) => (
                  <div key={it.id} style={{ padding: "4px 0", borderBottom: `1px solid ${C.brd}`, fontSize: 12 }}>{it.name} <span style={{ color: C.t2 }}>· {totalStock(it)} {it.unit}</span></div>
                ))}
              </div>}
            </div>
          </div>
        );
      })()}

      {/* ── REORDER ── */}
      {tab === "reorder" && (() => {
        // Build per-variant reorder list
        const reorderRows = [];
        items.filter(filterItem).forEach((it) => {
          const v = getVariants(it);
          Object.entries(v).forEach(([opt, vd]) => {
            const ms = vd.minStock || 0;
            if (ms <= 0) return;
            const need = Math.max(0, ms - (vd.qty || 0));
            reorderRows.push({ itemId: it.id, name: it.name, category: it.category, unit: it.unit, optName: opt, qty: vd.qty || 0, minStock: ms, need, below: (vd.qty || 0) <= ms, wac: vd.wac || 0 });
          });
        });
        reorderRows.sort((a, b) => (b.below ? 1 : 0) - (a.below ? 1 : 0) || b.need - a.need);
        return (
          <div>
            <div style={{ ...crd, padding: 0 }}><div style={{ overflowX: "auto", maxHeight: 500 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead><tr>{["Item", "Color/Style", "Category", "On Hand", "Min Stock", "Need to Order", "Status", "WAC", "Reorder Cost"].map((h) => <th key={h} style={thS}>{h}</th>)}</tr></thead>
                <tbody>{reorderRows.map((r, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.brd}`, background: r.below ? C.red + "08" : "transparent" }}>
                    <td style={{ ...tdS, fontWeight: 600 }}>{r.name}</td>
                    <td style={{ ...tdS, fontWeight: 600, color: r.optName === "_default" ? C.t2 : C.txt }}>{r.optName === "_default" ? "—" : r.optName}</td>
                    <td style={{ ...tdS, color: C.t2 }}>{r.category}</td>
                    <td style={{ ...tdS, fontFamily: MN, color: r.below ? C.red : C.txt, fontWeight: 700 }}>{r.qty} {r.unit}</td>
                    <td style={{ ...tdS, fontFamily: MN }}>{r.minStock}</td>
                    <td style={{ ...tdS, fontFamily: MN, fontWeight: 700, color: r.need > 0 ? C.ac : C.grn }}>{r.need > 0 ? r.need : "Stocked"}</td>
                    <td style={tdS}><span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 3, background: r.below ? C.red + "18" : C.grn + "18", color: r.below ? C.red : C.grn }}>{r.below ? "LOW" : "OK"}</span></td>
                    <td style={{ ...tdS, fontFamily: MN }}>{fmt$(r.wac)}</td>
                    <td style={{ ...tdS, fontFamily: MN }}>{r.need > 0 ? fmt$(r.need * r.wac) : "—"}</td>
                  </tr>
                ))}{!reorderRows.length && <tr><td colSpan={9} style={{ ...tdS, textAlign: "center", color: C.t2, padding: 20 }}>Set low stock thresholds per color/style when adding items to use this report.</td></tr>}</tbody>
              </table>
            </div></div>
          </div>
        );
      })()}

      {/* ── MARGIN ── */}
      {tab === "margin" && (() => {
        const byItem = {};
        rangeOrders.forEach((o) => o.lines.forEach((l) => {
          const it = iMap[l.itemId]; if (!it || !filterItem(it)) return;
          const k = l.itemId;
          if (!byItem[k]) byItem[k] = { name: it.name, cat: it.category, qty: 0, rev: 0, cost: 0, markup: it.markup || 0 };
          byItem[k].qty += l.qty; byItem[k].rev += l.qty * (l.markupCost || 0); byItem[k].cost += l.qty * (l.unitCost || 0);
        }));
        const marginData = Object.values(byItem).sort((a, b) => (b.rev - b.cost) - (a.rev - a.cost));
        const tRev = marginData.reduce((s, d) => s + d.rev, 0); const tC = marginData.reduce((s, d) => s + d.cost, 0);
        return (
          <div>
            <Rw g={14}>
              <Stat label="Total Revenue" value={fmt$(tRev)} color={C.ac} />
              <Stat label="Total Cost" value={fmt$(tC)} color={NAVY} />
              <Stat label="Gross Profit" value={fmt$(tRev - tC)} color={C.grn} />
              <Stat label="Gross Margin" value={tRev > 0 ? `${((1 - tC / tRev) * 100).toFixed(1)}%` : "—"} color={C.grn} />
            </Rw>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 14 }}>
              {marginData.length > 0 && <div style={{ ...crd, flex: "1 1 450px" }}>
                <div style={lbl}>Revenue vs Cost by Item</div>
                <ResponsiveContainer width="100%" height={Math.min(300, marginData.length * 30 + 50)}>
                  <BarChart data={marginData.slice(0, 12)} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke={C.brd} />
                    <XAxis type="number" stroke={C.t2} fontSize={10} tickFormatter={(v) => "$" + v.toLocaleString()} />
                    <YAxis type="category" dataKey="name" stroke={C.t2} fontSize={10} width={100} />
                    <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.brd}`, borderRadius: 6, fontSize: 12 }} formatter={(v) => fmt$(v)} />
                    <Bar dataKey="rev" name="Revenue" fill={RED} radius={[0, 4, 4, 0]} />
                    <Bar dataKey="cost" name="Cost" fill={NAVY} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>}
              <div style={{ ...crd, flex: "1 1 400px", padding: 0 }}>
                <div style={{ padding: "12px 14px 0" }}><div style={lbl}>Margin Detail</div></div>
                <div style={{ overflowX: "auto", maxHeight: 400 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead><tr>{["Item", "Qty", "Revenue", "Cost", "Profit $", "Margin %"].map((h) => <th key={h} style={thS}>{h}</th>)}</tr></thead>
                    <tbody>{marginData.map((d, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.brd}` }}>
                        <td style={{ ...tdS, fontWeight: 600 }}>{d.name}</td>
                        <td style={{ ...tdS, fontFamily: MN }}>{d.qty}</td>
                        <td style={{ ...tdS, fontFamily: MN, color: C.ac }}>{fmt$(d.rev)}</td>
                        <td style={{ ...tdS, fontFamily: MN, color: C.t2 }}>{fmt$(d.cost)}</td>
                        <td style={{ ...tdS, fontFamily: MN, color: C.grn, fontWeight: 700 }}>{fmt$(d.rev - d.cost)}</td>
                        <td style={{ ...tdS, fontFamily: MN, fontWeight: 700, color: d.rev > 0 && (1 - d.cost / d.rev) >= 0.2 ? C.grn : C.red }}>{d.rev > 0 ? ((1 - d.cost / d.rev) * 100).toFixed(1) + "%" : "—"}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── SHRINKAGE REPORT ── */}
      {tab === "shrink" && (() => {
        const rangeShrink = (shrinkLog || []).filter((r) => new Date(r.date) >= cut);
        const totalLost = rangeShrink.filter((r) => r.type !== "found").reduce((s, r) => s + (r.lostValue || 0), 0);
        const totalFound = rangeShrink.filter((r) => r.type === "found").reduce((s, r) => s + (r.lostValue || 0), 0);
        const totalUnits = rangeShrink.filter((r) => r.type !== "found").reduce((s, r) => s + (r.qty || 0), 0);
        const netLoss = totalLost - totalFound;
        // By item
        const byItem = {};
        rangeShrink.forEach((r) => {
          const k = r.itemId || r.itemName;
          if (!byItem[k]) byItem[k] = { name: r.itemName || "?", lost: 0, found: 0, lostVal: 0, foundVal: 0 };
          if (r.type === "found") { byItem[k].found += r.qty; byItem[k].foundVal += r.lostValue || 0; }
          else { byItem[k].lost += r.qty; byItem[k].lostVal += r.lostValue || 0; }
        });
        const itemData = Object.values(byItem).sort((a, b) => b.lostVal - a.lostVal);
        return (
          <div>
            <Rw g={14}>
              <Stat label="Total Shrinkage" value={fmt$(totalLost)} sub={`${totalUnits} units`} color={C.red} />
              <Stat label="Found / Overage" value={fmt$(totalFound)} color={C.grn} />
              <Stat label="Net Loss" value={fmt$(netLoss)} color={netLoss > 0 ? C.red : C.grn} />
              <Stat label="Adjustments" value={rangeShrink.length} color={NAVY} />
            </Rw>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 14 }}>
              <div style={{ ...crd, flex: "1 1 500px", padding: 0 }}>
                <div style={{ padding: "12px 14px 0" }}><div style={lbl}>Shrinkage by Item</div></div>
                <div style={{ overflowX: "auto", maxHeight: 400 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead><tr>{["Item", "Units Lost", "Lost Value", "Units Found", "Found Value", "Net"].map((h) => <th key={h} style={thS}>{h}</th>)}</tr></thead>
                    <tbody>{!itemData.length && <tr><td colSpan={6} style={{ ...tdS, textAlign: "center", color: C.t2, padding: 20 }}>No shrinkage in this period.</td></tr>}
                    {itemData.map((d, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.brd}` }}>
                        <td style={{ ...tdS, fontWeight: 600 }}>{d.name}</td>
                        <td style={{ ...tdS, fontFamily: MN, color: C.red }}>{d.lost}</td>
                        <td style={{ ...tdS, fontFamily: MN, color: C.red }}>{fmt$(d.lostVal)}</td>
                        <td style={{ ...tdS, fontFamily: MN, color: C.grn }}>{d.found || "—"}</td>
                        <td style={{ ...tdS, fontFamily: MN, color: C.grn }}>{d.foundVal ? fmt$(d.foundVal) : "—"}</td>
                        <td style={{ ...tdS, fontFamily: MN, fontWeight: 700, color: (d.lostVal - d.foundVal) > 0 ? C.red : C.grn }}>{fmt$(d.lostVal - d.foundVal)}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
              {/* Recent adjustments */}
              <div style={{ ...crd, flex: "1 1 380px", padding: 0 }}>
                <div style={{ padding: "12px 14px 0" }}><div style={lbl}>Recent Adjustments</div></div>
                <div style={{ overflowX: "auto", maxHeight: 400 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead><tr>{["Date", "Item", "Type", "Qty", "Value"].map((h) => <th key={h} style={thS}>{h}</th>)}</tr></thead>
                    <tbody>{rangeShrink.slice(0, 30).map((r, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.brd}` }}>
                        <td style={{ ...tdS, color: C.t2 }}>{fD(r.date)}</td>
                        <td style={{ ...tdS, fontWeight: 600 }}>{r.itemName}</td>
                        <td style={tdS}><span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 3, background: r.type === "found" ? C.grn + "15" : C.red + "15", color: r.type === "found" ? C.grn : C.red }}>{r.type === "found" ? "FOUND" : "SHRINK"}</span></td>
                        <td style={{ ...tdS, fontFamily: MN }}>{r.qty}</td>
                        <td style={{ ...tdS, fontFamily: MN, color: r.type === "found" ? C.grn : C.red }}>{fmt$(r.lostValue)}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── SAVINGS VS SUPPLIER ── */}
      {tab === "savings" && (() => {
        // ALL savings are based ONLY on captured supplier costs at time of order submission
        // Changing supplier cost today does NOT affect past orders — only future ones
        const periodByItem = {};
        rangeOrders.forEach((o) => o.lines.forEach((l) => {
          const it = iMap[l.itemId]; if (!it || !filterItem(it)) return;
          const capturedSc = l.supplierCost || 0;
          if (!capturedSc) return;
          const k = l.itemId;
          if (!periodByItem[k]) periodByItem[k] = { name: it.name, category: it.category, qty: 0, ourCost: 0, supplierWouldHaveCharged: 0 };
          periodByItem[k].qty += l.qty;
          periodByItem[k].ourCost += l.qty * (l.unitCost || 0);
          periodByItem[k].supplierWouldHaveCharged += l.qty * capturedSc;
        }));
        const periodData = Object.values(periodByItem).map((d) => ({
          ...d, savings: d.supplierWouldHaveCharged - d.ourCost,
          avgOurCost: d.qty > 0 ? d.ourCost / d.qty : 0,
          avgSupplierCost: d.qty > 0 ? d.supplierWouldHaveCharged / d.qty : 0,
        })).sort((a, b) => b.savings - a.savings);
        const totalSavings = periodData.reduce((s, d) => s + d.savings, 0);
        const totalOurCost = periodData.reduce((s, d) => s + d.ourCost, 0);
        const totalSupplierCost = periodData.reduce((s, d) => s + d.supplierWouldHaveCharged, 0);
        const itemsOverpaying = periodData.filter((d) => d.savings < 0);
        const ordersWithSupplier = rangeOrders.filter((o) => o.lines.some((l) => l.supplierCost > 0));

        return (
          <div>
            <Rw g={14}>
              <Stat label="Total Savings" value={fmt$(totalSavings)} sub={`${ordersWithSupplier.length} orders with supplier pricing`} color={totalSavings >= 0 ? C.grn : C.red} />
              <Stat label="We Paid" value={fmt$(totalOurCost)} color={NAVY} />
              <Stat label="Supplier Would've Charged" value={fmt$(totalSupplierCost)} color={C.t2} />
              {itemsOverpaying.length > 0 && <Stat label="Items We Overpaid" value={itemsOverpaying.length} sub="Our cost was higher" color={C.red} />}
            </Rw>

            <div style={{ ...crd, padding: 0, marginTop: 14 }}>
              <div style={{ padding: "12px 14px 0" }}><div style={lbl}>Savings by Item — Based on Supplier Cost at Time of Each Order</div></div>
              <div style={{ overflowX: "auto", maxHeight: 500 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead><tr>{["Item", "Category", "Qty Sold", "Our Avg Cost", "Supplier Avg (at time)", "We Paid Total", "Supplier Would've", "Savings"].map((h) => <th key={h} style={thS}>{h}</th>)}</tr></thead>
                  <tbody>
                    {!periodData.length && <tr><td colSpan={8} style={{ ...tdS, textAlign: "center", color: C.t2, padding: 20 }}>No orders with supplier cost data in this period. Set supplier costs in the Supplier Cost tab — they'll be captured on future orders.</td></tr>}
                    {periodData.map((d, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.brd}`, background: d.savings < 0 ? C.red + "06" : "transparent" }}>
                        <td style={{ ...tdS, fontWeight: 600 }}>{d.name}</td>
                        <td style={{ ...tdS, color: C.t2 }}>{d.category}</td>
                        <td style={{ ...tdS, fontFamily: MN }}>{d.qty}</td>
                        <td style={{ ...tdS, fontFamily: MN }}>{fmt$(d.avgOurCost)}</td>
                        <td style={{ ...tdS, fontFamily: MN }}>{fmt$(d.avgSupplierCost)}</td>
                        <td style={{ ...tdS, fontFamily: MN }}>{fmt$(d.ourCost)}</td>
                        <td style={{ ...tdS, fontFamily: MN }}>{fmt$(d.supplierWouldHaveCharged)}</td>
                        <td style={{ ...tdS, fontFamily: MN, fontWeight: 700, color: d.savings > 0 ? C.grn : d.savings < 0 ? C.red : C.t2 }}>{d.savings > 0 ? "+" : ""}{fmt$(d.savings)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ fontSize: 11, color: C.t2, marginTop: 10, fontStyle: "italic" }}>
              Every number on this page uses the supplier cost that was set at the moment each order was submitted. Changing supplier cost today only affects future orders — past orders are never touched. All comparisons are against your true blended cost (WAC), not markup.
            </div>
          </div>
        );
      })()}

      {/* ── JOBS ── */}
      {tab === "jobs" && (() => {
        const byJob = {};
        appOrders.filter((o) => new Date(o.date) >= cut).forEach((o) => {
          const jk = o.jobName || "No Job Name";
          if (!byJob[jk]) byJob[jk] = { name: jk, orders: 0, lines: 0, cost: 0, sell: 0 };
          byJob[jk].orders++; o.lines.forEach((l) => { byJob[jk].lines++; byJob[jk].cost += l.qty * (l.unitCost || 0); byJob[jk].sell += l.qty * (l.markupCost || 0); });
        });
        const jobData = Object.values(byJob).sort((a, b) => b.sell - a.sell);
        return (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
              <button onClick={() => exportCSV(["Job", "Orders", "Items", "Material Cost", "Sell Price", "Margin $", "Margin %"], jobData.map((d) => [d.name, d.orders, d.lines, d.cost.toFixed(2), d.sell.toFixed(2), (d.sell - d.cost).toFixed(2), d.sell > 0 ? ((1 - d.cost / d.sell) * 100).toFixed(1) + "%" : "—"]), "Job_Usage_Report")} style={{ ...bS, padding: "6px 12px", fontSize: 11 }}>Export CSV</button>
            </div>
            <div style={{ ...crd, padding: 0 }}><div style={{ overflowX: "auto", maxHeight: 500 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead><tr>{["Job", "Orders", "Items", "Material Cost", "Sell Price", "Margin $", "Margin %"].map((h) => <th key={h} style={thS}>{h}</th>)}</tr></thead>
                <tbody>{!jobData.length && <tr><td colSpan={7} style={{ ...tdS, textAlign: "center", color: C.t2, padding: 20 }}>No job data in this period.</td></tr>}
                {jobData.map((d, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.brd}` }}>
                    <td style={{ ...tdS, fontWeight: 700 }}>{d.name}</td>
                    <td style={{ ...tdS, fontFamily: MN }}>{d.orders}</td>
                    <td style={{ ...tdS, fontFamily: MN }}>{d.lines}</td>
                    <td style={{ ...tdS, fontFamily: MN }}>{fmt$(d.cost)}</td>
                    <td style={{ ...tdS, fontFamily: MN, color: C.ac }}>{fmt$(d.sell)}</td>
                    <td style={{ ...tdS, fontFamily: MN, color: C.grn, fontWeight: 700 }}>{fmt$(d.sell - d.cost)}</td>
                    <td style={{ ...tdS, fontFamily: MN, fontWeight: 700, color: C.grn }}>{d.sell > 0 ? ((1 - d.cost / d.sell) * 100).toFixed(1) + "%" : "—"}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div></div>
          </div>
        );
      })()}
    </div>
  );
}

// ═══ SETTINGS PAGE ═══
function SettingsPage({ users, sU, me, items, orders, templates, shrinkLog }) {
  const ROLES = ["admin", "manager", "user"];
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("user");
  const [resetPw, setResetPw] = useState("");
  const [exporting, setExporting] = useState(false);

  const exportDatabase = async () => {
    setExporting(true);
    try {
      let invLog = [];
      try { invLog = await ld("inv_log", []); } catch {}
      const data = {
        exportDate: new Date().toISOString(),
        version: "roofus_v1",
        users: users.map((u) => ({ ...u, pw: undefined })),
        items, orders, templates,
        shrinkageLog: shrinkLog,
        inventoryReceiptLog: invLog,
      };
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Roofus_Backup_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
    } catch (e) { console.error(e); }
    setExporting(false);
  };

  const cycleRole = (u) => {
    if (u.id === me.id) return;
    const idx = ROLES.indexOf(u.role);
    const next = ROLES[(idx + 1) % ROLES.length];
    sU(users.map((x) => x.id === u.id ? { ...x, role: next } : x));
  };

  const deleteUser = (u) => {
    sU(users.filter((x) => x.id !== u.id));
    setDeleteConfirm(null);
  };

  const startEdit = (u) => {
    setEditUser(u); setEditName(u.name); setEditEmail(u.email); setEditRole(u.role); setResetPw("");
  };
  const saveEdit = () => {
    if (!editName.trim() || !editEmail.trim()) return;
    sU(users.map((x) => {
      if (x.id !== editUser.id) return x;
      const updated = { ...x, name: editName.trim(), email: editEmail.trim().toLowerCase(), role: editRole };
      if (resetPw.trim().length >= 4) updated.pw = hP(resetPw);
      return updated;
    }));
    setEditUser(null);
  };

  const roleColors = { admin: { bg: RED + "15", c: RED, border: RED + "44" }, manager: { bg: NAVY + "15", c: NAVY, border: NAVY + "44" }, user: { bg: C.sf, c: C.t2, border: C.brd }, pending: { bg: C.wrn + "15", c: C.wrn, border: C.wrn + "44" } };
  const pendingUsers = users.filter((u) => u.role === "pending");
  const activeUsers = users.filter((u) => u.role !== "pending");

  const approveUser = (u, role) => {
    sU(users.map((x) => x.id === u.id ? { ...x, role } : x));
  };
  const rejectUser = (u) => {
    sU(users.filter((x) => x.id !== u.id));
  };

  return (
    <div className="fu">
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4, fontFamily: BC }}>SETTINGS</h1>
      <p style={{ color: C.t2, fontSize: 13, marginBottom: 24 }}>Manage users, roles, and system settings.</p>

      {/* PENDING APPROVALS */}
      {pendingUsers.length > 0 && (
        <div style={{ ...crd, marginBottom: 20, borderLeft: `4px solid ${C.wrn}` }}>
          <div style={{ ...lbl, marginBottom: 10, color: C.wrn }}>Pending Approval ({pendingUsers.length})</div>
          <p style={{ fontSize: 12, color: C.t2, marginBottom: 14 }}>These people signed up and are waiting for your approval before they can log in.</p>
          {pendingUsers.map((u) => (
            <div key={u.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.brd}`, flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{u.name}</div>
                <div style={{ fontSize: 12, color: C.t2 }}>{u.email} · signed up {fD(u.created)}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => approveUser(u, "user")} style={{ ...bP, padding: "6px 14px", fontSize: 12, background: C.grn }}><Check size={12} /> Approve as User</button>
                <button onClick={() => approveUser(u, "manager")} style={{ ...bP, padding: "6px 14px", fontSize: 12, background: NAVY }}><Check size={12} /> Approve as Manager</button>
                <button onClick={() => rejectUser(u)} style={{ ...bD, padding: "6px 14px", fontSize: 12 }}><X size={12} /> Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* USER MANAGEMENT */}
      <div style={{ ...crd, marginBottom: 20 }}>
        <div style={{ ...lbl, marginBottom: 14 }}>User Management</div>
        <p style={{ fontSize: 12, color: C.t2, marginBottom: 14 }}>
          <strong>Admin</strong> — full access to everything including reports, items, inventory, and settings.
          <strong style={{ marginLeft: 12 }}>Manager</strong> — can access home, approvals, history, and edit/delete orders. No reports or inventory management.
          <strong style={{ marginLeft: 12 }}>User</strong> — can submit orders and view their own history only.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ borderBottom: `1px solid ${C.brdL}` }}>
              {["Name", "Email", "Role (click to change)", "Joined", "Actions"].map((h) => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: C.t2, fontSize: 10, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{activeUsers.map((u) => {
              const rc = roleColors[u.role] || roleColors.user;
              return (
                <tr key={u.id} style={{ borderBottom: `1px solid ${C.brd}` }}>
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>
                    {u.name}
                    {u.id === me.id && <span style={{ fontSize: 10, color: C.ac, marginLeft: 8, fontWeight: 800 }}>YOU</span>}
                  </td>
                  <td style={{ padding: "10px 12px", color: C.t2 }}>{u.email}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <button onClick={() => cycleRole(u)} disabled={u.id === me.id}
                      style={{ background: rc.bg, color: rc.c, border: `1px solid ${rc.border}`, borderRadius: 4, padding: "4px 14px", fontSize: 11, fontWeight: 800, cursor: u.id === me.id ? "default" : "pointer", textTransform: "uppercase", letterSpacing: ".04em" }}>
                      {u.role}
                    </button>
                    {u.id !== me.id && <span style={{ fontSize: 10, color: C.t2, marginLeft: 8 }}>click to change</span>}
                  </td>
                  <td style={{ padding: "10px 12px", color: C.t2, fontSize: 12 }}>{fD(u.created)}</td>
                  <td style={{ padding: "10px 12px" }}>
                    {u.id !== me.id && (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => startEdit(u)}
                          style={{ background: "none", border: `1px solid ${C.brd}`, color: C.txt, cursor: "pointer", borderRadius: 4, padding: "4px 10px", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                          <Edit3 size={12} /> Edit
                        </button>
                        <button onClick={() => setDeleteConfirm(u)}
                          style={{ background: "none", border: `1px solid ${C.red}33`, color: C.red, cursor: "pointer", borderRadius: 4, padding: "4px 10px", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </div>

      {/* ROLE INFO */}
      <div style={{ ...crd, marginBottom: 20 }}>
        <div style={{ ...lbl, marginBottom: 14 }}>Role Permissions</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead><tr style={{ borderBottom: `1px solid ${C.brdL}` }}>
              {["Feature", "Admin", "Manager", "User"].map((h) => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 700, color: C.t2, fontSize: 10, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {[
                ["Submit Orders / Returns", true, true, true],
                ["View All Order History", true, true, false],
                ["Approve / Reject Orders", true, true, false],
                ["Edit / Delete Orders", true, true, false],
                ["Manage Items & Inventory", true, false, false],
                ["Physical Count / Shrinkage", true, false, false],
                ["Supplier Cost", true, false, false],
                ["Reports & Analytics", true, false, false],
                ["User Management & Settings", true, false, false],
              ].map(([feature, admin, mgr, usr], i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.brd}` }}>
                  <td style={{ padding: "8px 12px", fontWeight: 600 }}>{feature}</td>
                  <td style={{ padding: "8px 12px", color: admin ? C.grn : C.red }}>{admin ? "✓" : "✗"}</td>
                  <td style={{ padding: "8px 12px", color: mgr ? C.grn : C.red }}>{mgr ? "✓" : "✗"}</td>
                  <td style={{ padding: "8px 12px", color: usr ? C.grn : C.red }}>{usr ? "✓" : "✗"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DATABASE BACKUP */}
      <div style={{ ...crd, marginBottom: 20, borderLeft: `4px solid ${NAVY}` }}>
        <div style={{ ...lbl, marginBottom: 10 }}>Database Backup</div>
        <p style={{ fontSize: 12, color: C.t2, marginBottom: 14 }}>Download a complete backup of all your data — items, inventory, orders, receipts, shrinkage logs, templates, and users. Use this to move to a hosted version or keep as a safety backup.</p>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={exportDatabase} disabled={exporting} style={{ ...bP, background: NAVY }}>
            <Download size={14} /> {exporting ? "Exporting..." : "Export Full Database (.json)"}
          </button>
          <span style={{ fontSize: 11, color: C.t2 }}>
            {items.length} items · {orders.length} orders · {(shrinkLog || []).length} adjustments
          </span>
        </div>
      </div>

      {/* DELETE USER MODAL */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="">
        {deleteConfirm && (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ background: C.red + "15", borderRadius: 16, padding: 20, display: "inline-flex", marginBottom: 16 }}>
              <AlertTriangle size={48} color={C.red} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: C.red, marginBottom: 8 }}>DELETE USER?</h2>
            <p style={{ fontSize: 14, marginBottom: 6 }}>
              <strong>{deleteConfirm.name}</strong> ({deleteConfirm.email})
            </p>
            <p style={{ color: C.red, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
              This will permanently remove their account. Their past orders will remain in history.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ ...bS, padding: "12px 28px", fontSize: 14 }}>Cancel</button>
              <button onClick={() => deleteUser(deleteConfirm)} style={{ ...bD, padding: "12px 28px", fontSize: 14 }}><Trash2 size={14} /> Delete User</button>
            </div>
          </div>
        )}
      </Modal>

      {/* EDIT USER MODAL */}
      <Modal open={!!editUser} onClose={() => setEditUser(null)} title={`Edit User — ${editUser?.name || ""}`}>
        {editUser && (
          <>
            <Fld label="Name"><input value={editName} onChange={(e) => setEditName(e.target.value)} style={inp} /></Fld>
            <Fld label="Email"><input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} style={inp} type="email" /></Fld>
            <Fld label="Role">
              <div style={{ display: "flex", gap: 8 }}>
                {ROLES.map((r) => {
                  const rc = roleColors[r];
                  return (
                    <button key={r} onClick={() => setEditRole(r)}
                      style={{ flex: 1, padding: "10px", borderRadius: 6, border: `2px solid ${editRole === r ? rc.c : C.brd}`,
                        background: editRole === r ? rc.bg : "transparent", cursor: "pointer", textAlign: "center" }}>
                      <div style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", color: rc.c }}>{r}</div>
                      <div style={{ fontSize: 10, color: C.t2, marginTop: 2 }}>{r === "admin" ? "Full access" : r === "manager" ? "Approvals + history" : "Orders only"}</div>
                    </button>
                  );
                })}
              </div>
            </Fld>
            <Fld label="Reset Password (leave blank to keep current)">
              <input value={resetPw} onChange={(e) => setResetPw(e.target.value)} placeholder="New password (4+ chars)..." style={inp} type="text" />
            </Fld>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
              <button onClick={() => setEditUser(null)} style={bS}>Cancel</button>
              <button onClick={saveEdit} style={bP}><Check size={14} /> Save Changes</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

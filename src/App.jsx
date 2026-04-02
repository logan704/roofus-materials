import { useState, useEffect, useCallback, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Package, Plus, Search, Trash2, Edit3, X, Check, ArrowLeft, Users, FileText, RotateCcw, LogOut, Eye, EyeOff, ChevronRight, ChevronDown, Layers, Clock, CheckCircle, XCircle, Printer, Archive, Home, BarChart2, Copy, GripVertical, AlertTriangle, DollarSign, Settings, Download, Camera, ArrowUp, ArrowDown, Image, Send } from "lucide-react";

const PFX = "rusa5_";
const CATS = ["Shingles","Underlayment","Flashing","Ridge/Hip","Drip Edge","Starter Strip","Ice & Water Shield","Pipe Boots","Vents","Step Flashing","Lumber","Plywood","Gutters","Downspouts","Fasteners","Adhesives/Sealants","Metal/Trim","Other"];
const UNITS = ["bundle","roll","sheet","piece","box","tube","lb","ft","sq ft","each","gallon","bag","square","case"];
const LOGO = "data:image/png;base64,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";

// Colors — clean white with Roof USA red/blue
const RED = "#B22234";
const NAVY = "#1B2A4A";
const C = { bg: "#F5F6F8", card: "#FFFFFF", sf: "#EEF1F5", brd: "#D5DAE0", brdL: "#C0C8D2", ac: RED, acH: "#CC3344", txt: "#1A1D23", t2: "#6B7280", red: "#B22234", grn: "#1E8449", blu: "#1B2A4A", wrn: "#D4870E", w: "#fff" };

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Barlow:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}body{background:${C.bg};color:${C.txt};font-family:'Barlow',sans-serif;-webkit-text-size-adjust:100%}
input,select,textarea,button{font-family:'Barlow',sans-serif;font-size:16px}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${C.brd};border-radius:3px}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fadeUp .3s ease-out}
button:active{transform:scale(.97)}
select option{background:${C.w};color:${C.txt}}
@media(max-width:768px){
  .hide-mobile{display:none!important}
  .hide-desktop{display:flex!important}
  .quote-sidebar{position:fixed;top:60px;left:-280px;bottom:0;z-index:300;background:#fff;padding:16px;overflow:auto;width:260px;box-shadow:4px 0 20px rgba(0,0,0,0.15);transition:left .2s}
  .nav-wrap{gap:2px!important}
  .nav-wrap button{padding:5px 8px!important;font-size:10px!important}
  table{font-size:11px!important}
  td,th{padding:5px 4px!important}
}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
@media(max-width:480px){
  .nav-wrap button{padding:4px 6px!important;font-size:9px!important}
  .nav-wrap svg{width:12px!important;height:12px!important}
}`;

const MN = `'IBM Plex Mono',monospace`;
const BC = `'Barlow Condensed',sans-serif`;

async function ld(k, d) { try { const r = await window.storage.get(PFX+k, true); return r ? JSON.parse(r.value) : d; } catch { return d; } }
async function sv(k, v) { try { await window.storage.set(PFX+k, JSON.stringify(v), true); } catch(e) { console.error(e); } }
async function ldL(k, d) { try { const v = localStorage.getItem(PFX+k); if (v) return JSON.parse(v); } catch {} try { const r = await window.storage.get(PFX+k, false); return r ? JSON.parse(r.value) : d; } catch { return d; } }
async function svL(k, v) { try { localStorage.setItem(PFX+k, JSON.stringify(v)); } catch {} try { await window.storage.set(PFX+k, JSON.stringify(v), false); } catch {} }
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

// ─── SUPABASE REST HELPERS ───
const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const sbH = { "apikey": SB_KEY, "Authorization": `Bearer ${SB_KEY}`, "Content-Type": "application/json", "Prefer": "return=representation" };
async function sbGet(table, query = "") { try { const r = await fetch(`${SB_URL}/rest/v1/${table}?${query}`, { headers: sbH }); return r.ok ? await r.json() : []; } catch { return []; } }
async function sbPost(table, data) { try { const d = Array.isArray(data) ? data.map(x => ({ id: crypto.randomUUID(), ...x })) : { id: crypto.randomUUID(), ...data }; const r = await fetch(`${SB_URL}/rest/v1/${table}`, { method: "POST", headers: sbH, body: JSON.stringify(d) }); if (!r.ok) { console.error("sbPost error:", table, await r.text()); return null; } return await r.json(); } catch(e) { console.error("sbPost catch:", e); return null; } }
async function sbPatch(table, id, data) { try { const r = await fetch(`${SB_URL}/rest/v1/${table}?id=eq.${id}`, { method: "PATCH", headers: sbH, body: JSON.stringify(data) }); return r.ok ? await r.json() : null; } catch { return null; } }
async function sbDel(table, id) { try { await fetch(`${SB_URL}/rest/v1/${table}?id=eq.${id}`, { method: "DELETE", headers: sbH }); return true; } catch { return false; } }
async function sbDelWhere(table, query) { try { await fetch(`${SB_URL}/rest/v1/${table}?${query}`, { method: "DELETE", headers: sbH }); return true; } catch { return false; } }


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

// ─── PDF: HTML generation & download ───
function generateOrderHTML(order, items) {
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
    return `<tr><td style="font-weight:700">${it.name}</td><td>${opt}</td><td class="r">${l.qty} ${it.unit||""}</td><td class="r">${fmt$(l.unitCost)}</td><td class="r" style="background:#FFFF00;font-weight:700">${fmt$(l.markupCost)}</td><td class="r">${fmt$(l.supplierCost||0)}</td><td class="r">${fmt$(l.qty*l.unitCost)}</td><td class="r" style="font-weight:700;background:#FFFF00">${fmt$(l.qty*l.markupCost)}</td></tr>`;
  }).join("");
  return `<!DOCTYPE html><html><head><title>${(order.poNumber||"Order")} Material Order</title>
<style>*{box-sizing:border-box;margin:0;padding:0;font-family:Helvetica,Arial,sans-serif}body{padding:36px;color:#1a1a1a;font-size:12px;max-width:800px;margin:0 auto}table{width:100%;border-collapse:collapse;margin:14px 0}th{text-align:left;padding:7px 6px;border-bottom:2px solid #1B2A4A;font-size:9px;text-transform:uppercase;letter-spacing:.06em;color:#666}td{padding:6px;border-bottom:1px solid #ddd;font-size:11px}.r{text-align:right}.hd{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;padding-bottom:14px;border-bottom:3px solid #B22234}.tot{margin-top:14px;padding:12px;background:#f0f2f5;border-radius:5px;border-left:4px solid #B22234}.tr{display:flex;justify-content:space-between;padding:2px 0;font-size:12px}.trb{font-size:14px;font-weight:800;border-top:2px solid #1B2A4A;padding-top:7px;margin-top:5px}.sav{margin-top:10px;padding:10px;background:#d4edda;border-radius:4px;font-size:11px}@media print{body{padding:20px}@page{margin:0.5in}}</style></head><body>
<div class="hd"><div><div style="font-size:24px;font-weight:900;letter-spacing:-0.02em">ROOFUS<span style="color:#B22234">.</span></div><div style="font-size:10px;color:#666;margin-top:2px">Construction, LLC · Columbia, MO</div></div>
<div style="text-align:right;font-size:11px;color:#666"><div style="font-weight:800;font-size:13px;color:#1B2A4A">${order.type==="return"?"RETURN":"MATERIAL ORDER"}</div><div style="margin-top:3px">PO: <strong style="color:#1a1a1a">${order.poNumber||"—"}</strong></div><div>Date: ${fD(order.date)}</div><div>By: ${order.userName||"—"}</div>
<div style="margin-top:4px"><span style="display:inline-block;padding:2px 8px;border-radius:3px;font-size:9px;font-weight:700;text-transform:uppercase;background:${order.status==="approved"?"#d4edda":"#fff3cd"};color:${order.status==="approved"?"#155724":"#856404"}">${(order.status||"pending").toUpperCase()}</span></div></div></div>
${order.jobName?`<div style="margin-bottom:12px;font-size:12px"><strong>Job:</strong> ${order.jobName}${order.jobAddress?" — "+order.jobAddress:""}</div>`:""}
<table><thead><tr><th>Item</th><th>Color/Style</th><th class="r">Qty</th><th class="r">Our Cost</th><th class="r" style="background:#FFFF00">Markup Price</th><th class="r">Supplier $</th><th class="r">Cost Ext</th><th class="r" style="background:#FFFF00">Sell Ext</th></tr></thead><tbody>${rows}</tbody></table>
<div class="tot"><div class="tr"><span>Total (Our Cost):</span><span>${fmt$(tCost)}</span></div>
<div class="tr trb" style="background:#FFFF00;padding:8px;margin:6px -12px 0;border-radius:4px"><span>Total (Markup Price):</span><span>${fmt$(tSell)}</span></div>
<div class="tr"><span>Markup Margin:</span><span style="color:#1E8449">${fmt$(savingsVsMarkup)} (${marginPct}%)</span></div>
${tSupplier > 0 ? `<div class="tr" style="border-top:1px solid #ccc;padding-top:4px;margin-top:4px"><span>Total (Supplier Would Charge):</span><span>${fmt$(tSupplier)}</span></div>
<div class="tr"><span>Savings vs Supplier:</span><span style="color:${savingsVsSupplier >= 0 ? '#1E8449' : '#B22234'}">${savingsVsSupplier >= 0 ? '+' : ''}${fmt$(savingsVsSupplier)}</span></div>` : ''}
</div>
${order.notes?`<div style="margin-top:14px;padding:8px;background:#f5f5f5;border-radius:4px;font-size:11px"><strong>Notes:</strong> ${order.notes}</div>`:""}
<div style="margin-top:30px;text-align:center;font-size:8px;color:#bbb">Roofus Construction, LLC · Columbia, MO</div></body></html>`;
}

function downloadPDF(order, items) {
  const html = generateOrderHTML(order, items);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(order.poNumber || "Order").replace(/[^a-zA-Z0-9-_ ]/g, "")} Material Order.html`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
}

// Upload order PDF to JobNimbus
async function uploadToJN(order, items) {
  if (!order.jnJobId) return null;
  try {
    const html = generateOrderHTML(order, items);
    const fileName = `${(order.poNumber || "Order").replace(/[^a-zA-Z0-9-_ ]/g, "")} Material Order.html`;
    const r = await fetch("/api/jn?action=upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName, htmlContent: html, relatedId: order.jnJobId, jobName: order.jobName || "", jobAddress: order.jobAddress || "" }),
    });
    const data = await r.json();
    return data.fileId || null;
  } catch (e) { console.error("JN upload error:", e); return null; }
}

// Delete order PDF from JobNimbus
async function deleteFromJN(jnFileId) {
  if (!jnFileId) return;
  try { await fetch(`/api/jn?action=delete&id=${jnFileId}`, { method: "DELETE" }); } catch (e) { console.error("JN delete error:", e); }
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
  const [trackedJobs, setTrackedJobs] = useState([]);
  // Public quote URL detection
  const [publicQuoteId, setPublicQuoteId] = useState(null);
  useEffect(() => { const m = window.location.pathname.match(/^\/quote\/(.+)/); if (m) setPublicQuoteId(m[1]); }, []);

  const [pg, setPg] = useState("home");
  const [vOrd, setVOrd] = useState(null);
  const [startTpl, setStartTpl] = useState(null);

  useEffect(() => {
    (async () => {
      const [u, it, o, t, sh, tj] = await Promise.all([ld("users", []), ld("items", []), ld("orders", []), ld("templates", []), ld("shrinkage", []), ld("tracked_jobs", [])]);
      if (!u.length) {
        const a = { id: uid(), name: "Logan", email: "logan@usaroof.com", pw: hP("admin"), role: "admin", created: new Date().toISOString() };
        u.push(a);
        await sv("users", u);
      }
      setUsers(u); setItems(it); setOrders(o); setTemplates(t); setShrinkLog(sh); setTrackedJobs(tj);
      try { const s = await ldL("sess", null); if (s) { const f = u.find((x) => x.id === s.uid); if (f) setUser(f); } } catch {}
      setRdy(true);
    })();
  }, []);

  const sU = useCallback((u) => { setUsers(u); sv("users", u); }, []);
  const sI = useCallback((i) => { setItems(i); sv("items", i); }, []);
  const sO = useCallback((o) => { setOrders(o); sv("orders", o); }, []);
  const sT = useCallback((t) => { setTemplates(t); sv("templates", t); }, []);
  const sSh = useCallback((s) => { setShrinkLog(s); sv("shrinkage", s); }, []);
  const sTJ = useCallback((j) => { setTrackedJobs(j); sv("tracked_jobs", j); }, []);
  const login = useCallback(async (u) => { setUser(u); setPg("home"); await svL("sess", { uid: u.id }); }, []);
  const logout = useCallback(async () => { setUser(null); setPg("home"); try { localStorage.removeItem(PFX + "sess"); } catch {} try { await window.storage.delete(PFX + "sess", false); } catch {} }, []);
  const isA = user?.role === "admin";
  const isM = user?.role === "manager";
  const canApprove = isA;
  const canEditOrders = true; // everyone can edit
  const canDeleteOrders = isA || isM;
  const [matDrop, setMatDrop] = useState(false);
  const [settDrop, setSettDrop] = useState(false);

  // Close dropdowns on page change
  useEffect(() => { setMatDrop(false); setSettDrop(false); }, [pg]);

  if (publicQuoteId) return <><style>{CSS}</style><QuotePublicView quoteId={publicQuoteId} /></>;
  if (!rdy) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: C.bg }}><style>{CSS}</style><img src={LOGO} alt="" style={{ height: 60 }} /></div>;
  if (!user) return <><style>{CSS}</style><Auth users={users} sU={sU} login={login} /></>;

  const pendCt = orders.filter((o) => o.status === "pending").length;

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <style>{CSS}</style>
      {/* HEADER */}
      <div style={{ background: "#FFFFFF", borderBottom: `3px solid ${RED}`, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, flexWrap: "wrap", gap: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setPg("home")}>
          <img src={LOGO} alt="Roof USA" style={{ height: 36 }} />
        </div>
        <div className="nav-wrap" style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
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
          {(isA || isM) && <NavBtn icon={DollarSign} label="Jobs" active={pg === "jobs"} onClick={() => setPg("jobs")} />}
          <NavBtn icon={Send} label="Quotes" active={pg === "quotes"} onClick={() => setPg("quotes")} />
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
        {pg === "home" && <HomePage isA={isA} isM={isM} go={(page, tpl) => { setStartTpl(tpl || null); setPg(page); }} pendCt={pendCt} templates={templates} />}
        {(pg === "order" || pg === "return") && <OrderBuilder type={pg} items={items} user={user} orders={orders} sO={sO} sI={sI} templates={templates} startTpl={startTpl} clearStartTpl={() => setStartTpl(null)} go={() => setPg("home")} />}
        {pg === "approvals" && canApprove && <Approvals orders={orders} sO={sO} items={items} sI={sI} view={setVOrd} />}
        {pg === "items" && isA && <ItemMgr items={items} sI={sI} />}
        {pg === "inventory" && isA && <InvMgr items={items} sI={sI} />}
        {pg === "shrinkage" && isA && <ShrinkageMgr items={items} sI={sI} shrinkLog={shrinkLog} sSh={sSh} />}
        {pg === "damage" && <DamageReport items={items} sI={sI} shrinkLog={shrinkLog} sSh={sSh} user={user} />}
        {pg === "gallery" && isA && <DamageGallery shrinkLog={shrinkLog} sSh={sSh} items={items} sI={sI} />}
        {pg === "supplier" && isA && <SupplierCost items={items} sI={sI} />}
        {pg === "templates" && isA && <TplMgr templates={templates} sT={sT} items={items} />}
        {pg === "history" && <History orders={orders} items={items} user={user} isA={isA} isM={isM} view={setVOrd} sO={sO} />}
        {pg === "jobs" && (isA || isM) && <JobTracker jobs={trackedJobs} sJ={sTJ} orders={orders} items={items} />}
        {pg === "quotes" && <QuoteBuilder user={user} isA={isA} isM={isM} items={items} />}
        {pg === "reports" && isA && <Reports orders={orders} items={items} shrinkLog={shrinkLog} />}
        {pg === "settings" && isA && <SettingsPage users={users} sU={sU} me={user} items={items} orders={orders} templates={templates} shrinkLog={shrinkLog} />}
      </div>
      {vOrd && <OrderPDF order={vOrd} items={items} onClose={() => setVOrd(null)}
        onDelete={canDeleteOrders ? (id) => {
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
          const updatedOrd = { ...ord, lines: newLines };
          sO(orders.map((o) => o.id === id ? updatedOrd : o));
          setVOrd(updatedOrd);
          // Re-upload to JN if linked
          if (updatedOrd.jnJobId) {
            if (updatedOrd.jnFileId) deleteFromJN(updatedOrd.jnFileId);
            uploadToJN(updatedOrd, items).then((newFileId) => {
              if (newFileId) sO((prev) => prev.map((o) => o.id === id ? { ...o, jnFileId: newFileId } : o));
            });
          }
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
          <img src={LOGO} alt="Roof USA" style={{ height: 100, marginBottom: 16 }} />
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
          <img src={LOGO} alt="Roof USA" style={{ height: 100, marginBottom: 16 }} />
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
              <button key={t.id} onClick={() => go("order", t)} style={{ ...crd, cursor: "pointer", padding: "14px 18px", border: `2px solid ${C.brd}`, flex: "1 1 200px", textAlign: "left", transition: "all .15s" }}
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
    <button onClick={onClick} style={{ ...crd, width: 280, maxWidth: "100%", padding: "44px 28px", textAlign: "center", cursor: "pointer", border: `2px solid ${C.brd}`, transition: "all .2s", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.brd; e.currentTarget.style.transform = "translateY(0)"; }}>
      <div style={{ color }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 800, fontFamily: BC }}>{label}</div>
      <div style={{ fontSize: 13, color: C.t2 }}>{sub}</div>
    </button>
  );
}

// ═══ ORDER BUILDER ═══
function OrderBuilder({ type, items, user, orders, sO, sI, templates, startTpl, clearStartTpl, go }) {
  const [job, setJob] = useState(""); const [addr, setAddr] = useState(""); const [notes, setNotes] = useState("");
  const [lines, setLines] = useState([]); const [search, setSearch] = useState(""); const [cat, setCat] = useState("All"); const [done, setDone] = useState(false);
  const [step, setStep] = useState("choose"); // choose, job, build
  const [jnJobId, setJnJobId] = useState("");
  const [jnAll, setJnAll] = useState([]);
  const [showJnDrop, setShowJnDrop] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  // Auto-load JN jobs on mount
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/jn?action=jobs");
        const data = await r.json();
        setJnAll(data.jobs || []);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const jnFiltered = jnAll.filter((j) => {
    if (!job.trim()) return false;
    const s = job.toLowerCase();
    return (j.name || "").toLowerCase().includes(s) || (j.address || "").toLowerCase().includes(s) || (j.number || "").toLowerCase().includes(s) || (j.jobName || "").toLowerCase().includes(s);
  }).slice(0, 6);

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

  // Auto-load template if passed from home page
  useEffect(() => {
    if (startTpl && iMap) {
      const newLines = (startTpl.items || []).map((ti) => {
        const it = iMap[ti.itemId];
        if (!it) return null;
        const hasOpts = it.options && it.options.length > 0;
        return { key: ti.itemId + ":" + uid(), itemId: ti.itemId, qty: ti.qty || 1, option: hasOpts ? "" : "_default", unitCost: it.wacCost || 0, markupCost: (it.wacCost || 0) * (1 + (it.markup || 0) / 100), supplierCost: it.supplierCost || 0, needsOption: hasOpts };
      }).filter(Boolean);
      setLines(newLines);
      setStep("build");
      if (clearStartTpl) clearStartTpl();
    }
  }, []);

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
      const hasOpts = it.options && it.options.length > 0;
      // Don't pre-select option — user picks in summary
      return { key: ti.itemId + ":" + uid(), itemId: ti.itemId, qty: ti.qty || 1, option: hasOpts ? "" : "_default", unitCost: it.wacCost || 0, markupCost: (it.wacCost || 0) * (1 + (it.markup || 0) / 100), supplierCost: it.supplierCost || 0, needsOption: hasOpts };
    }).filter(Boolean);
    setLines(newLines);
    setStep("build");
  };

  const updLn = (i, f, v) => { const n = [...lines]; n[i] = { ...n[i], [f]: v }; setLines(n); };
  const rmLn = (i) => setLines(lines.filter((_, j) => j !== i));

  const allOptionsSet = lines.every((l) => {
    const it = iMap[l.itemId];
    if (!it) return true;
    const hasOpts = it.options && it.options.length > 0;
    return !hasOpts || (l.option && l.option !== "");
  });

  const submit = () => {
    if (!lines.length || !allOptionsSet) return;
    const ord = { id: uid(), type, userId: user.id, userName: user.name, poNumber: "", jobName: job.trim(), jobAddress: addr.trim(), notes: notes.trim(), jnJobId: jnJobId || "", date: new Date().toISOString(), status: "pending", lines: lines.map((l) => ({ itemId: l.itemId, qty: l.qty, option: l.option, unitCost: l.unitCost, markupCost: l.markupCost, supplierCost: l.supplierCost || 0 })) };
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
      <div style={{ display: "inline-flex", background: C.grn + "15", borderRadius: 24, padding: 24, marginBottom: 24 }}><CheckCircle size={56} color={C.grn} /></div>
      <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>{type === "return" ? "Return" : "Order"} Submitted!</h2>
      <p style={{ color: C.t2, fontSize: 15, marginBottom: 8 }}>{job ? `Job: ${job}` : "Submitted for approval."}</p>
      <p style={{ color: C.t2, fontSize: 13, marginBottom: 30 }}>{lines.length} item{lines.length !== 1 ? "s" : ""} · {fmt$(tSell)} total</p>
      <button onClick={go} style={{ ...bP, padding: "16px 40px", fontSize: 16, borderRadius: 14 }}><Home size={16} /> Back Home</button>
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
      <button onClick={step === "build" && templates.length > 0 && type === "order" ? () => setStep("choose") : go} style={{ ...bS, marginBottom: 16, padding: "8px 14px", fontSize: 13, borderRadius: 10 }}><ArrowLeft size={14} /> Back</button>
      <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4, fontFamily: BC, letterSpacing: "-.02em" }}>NEW {type === "return" ? "RETURN" : "ORDER"}</h1>
      <p style={{ color: C.t2, fontSize: 14, marginBottom: 24 }}>Select a job, add materials, and submit.</p>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 440px", minWidth: 300 }}>

          {/* ── JOB SELECTION ── */}
          <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.brd}`, padding: 24, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.t2, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>Job Info</div>

            {!manualMode ? (
              <>
                <div style={{ position: "relative", marginBottom: 4 }}>
                  <Search size={16} style={{ position: "absolute", left: 14, top: 14, color: C.t2 }} />
                  <input value={job} onChange={(e) => { setJob(e.target.value); setShowJnDrop(true); if (!e.target.value.trim()) { setJnJobId(""); setAddr(""); } }}
                    onFocus={() => setShowJnDrop(true)} onBlur={() => setTimeout(() => setShowJnDrop(false), 200)}
                    placeholder="Search jobs in JobNimbus..." style={{ ...inp, paddingLeft: 40, padding: "14px 14px 14px 40px", fontSize: 15, borderRadius: 12, background: C.sf }} autoComplete="off" />

                  {showJnDrop && job.trim().length > 0 && (
                    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 200, background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 12, boxShadow: "0 12px 40px rgba(0,0,0,0.15)", maxHeight: 320, overflow: "auto", marginTop: 6 }}>
                      {jnFiltered.map((j) => (
                        <div key={j.id} onMouseDown={(e) => { e.preventDefault(); setJob(j.name || ""); setAddr(j.address || ""); setJnJobId(j.id || ""); setShowJnDrop(false); }}
                          style={{ padding: "14px 16px", cursor: "pointer", borderBottom: `1px solid ${C.brd}`, transition: "background .15s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = C.sf; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: C.txt }}>{j.name}</div>
                          {j.address && <div style={{ fontSize: 12, color: C.t2, marginTop: 3 }}>{j.address}</div>}
                          {j.status && <div style={{ fontSize: 10, color: C.t2, marginTop: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>{j.status}</div>}
                        </div>
                      ))}
                      {jnFiltered.length === 0 && <div style={{ padding: "16px", textAlign: "center", color: C.t2, fontSize: 13 }}>No jobs match "{job}"</div>}
                      <div onMouseDown={(e) => { e.preventDefault(); setManualMode(true); setShowJnDrop(false); }}
                        style={{ padding: "12px 16px", cursor: "pointer", background: C.sf, borderTop: `1px solid ${C.brd}`, borderRadius: "0 0 12px 12px", textAlign: "center", fontWeight: 600, fontSize: 13, color: C.ac, transition: "background .15s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = C.brd; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = C.sf; }}>
                        Enter manually without JobNimbus
                      </div>
                    </div>
                  )}
                </div>

                {jnJobId && (
                  <div style={{ marginTop: 12, background: C.grn + "10", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                    <CheckCircle size={16} color={C.grn} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{job}</div>
                      {addr && <div style={{ fontSize: 12, color: C.t2, marginTop: 2 }}>{addr}</div>}
                    </div>
                    <button onClick={() => { setJob(""); setAddr(""); setJnJobId(""); }} style={{ marginLeft: "auto", background: "none", border: "none", color: C.t2, cursor: "pointer", padding: 4 }}><X size={14} /></button>
                  </div>
                )}

                {!jnJobId && !job.trim() && (
                  <button onClick={() => setManualMode(true)} style={{ background: "none", border: "none", color: C.t2, cursor: "pointer", fontSize: 13, marginTop: 8, padding: 0, textDecoration: "underline" }}>
                    Enter manually without JobNimbus
                  </button>
                )}
              </>
            ) : (
              <>
                <div style={{ marginBottom: 10 }}>
                  <input value={job} onChange={(e) => setJob(e.target.value)} placeholder="Homeowner name" style={{ ...inp, fontSize: 15, borderRadius: 12, padding: "14px", marginBottom: 10 }} />
                  <input value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="Address" style={{ ...inp, fontSize: 15, borderRadius: 12, padding: "14px" }} />
                </div>
                <button onClick={() => { setManualMode(false); setJob(""); setAddr(""); setJnJobId(""); }} style={{ background: "none", border: "none", color: C.ac, cursor: "pointer", fontSize: 13, padding: 0, fontWeight: 600 }}>
                  ← Search JobNimbus instead
                </button>
              </>
            )}
          </div>

          {/* ── NOTES ── */}
          <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.brd}`, padding: 24, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.t2, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>Notes</div>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Delivery instructions, reminders, special requests..." rows={2} style={{ ...inp, resize: "vertical", borderRadius: 12, fontSize: 14, padding: "12px 14px" }} />
          </div>

          {/* ── ADD ITEMS ── */}
          <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.brd}`, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.t2, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>Add Materials</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <div style={{ flex: 2, position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: 12, top: 13, color: C.t2 }} />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search materials..." style={{ ...inp, paddingLeft: 34, borderRadius: 12, padding: "12px 14px 12px 34px" }} />
              </div>
              <select value={cat} onChange={(e) => setCat(e.target.value)} style={{ ...inp, cursor: "pointer", borderRadius: 12, padding: "12px 14px", flex: "0 0 auto", width: "auto", minWidth: 100 }}>{cats.map((c) => <option key={c}>{c}</option>)}</select>
            </div>
            <div style={{ maxHeight: 360, overflow: "auto" }}>
              {filt.length === 0 && <div style={{ padding: 24, textAlign: "center", color: C.t2, fontSize: 13 }}>No items found.</div>}
              {filt.map((it) => {
                const opts = it.options && it.options.length > 0 ? it.options : [""];
                const hasOpts = opts.length > 1 || (opts.length === 1 && opts[0] !== "");
                return (
                  <div key={it.id} style={{ padding: "10px 4px", borderBottom: `1px solid ${C.brd}` }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                      <div style={{ flex: "1 1 180px", minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{it.name} <span style={{ fontWeight: 400, color: C.ac, fontSize: 11 }}>({it.unit})</span></div>
                        <div style={{ fontSize: 11, color: C.t2, marginTop: 2 }}>{it.category} · {totalStock(it)} avail</div>
                      </div>
                      {hasOpts ? (
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <select id={`opt-${it.id}`} defaultValue="" style={{ ...inp, padding: "8px 10px", fontSize: 13, width: "auto", minWidth: 140, cursor: "pointer", borderRadius: 10 }}>
                            <option value="" disabled>Select option...</option>
                            {opts.map((opt) => {
                              const added = lines.find((l) => l.key === it.id + ":" + opt);
                              const vData = (getVariants(it))[opt] || { qty: 0 };
                              return <option key={opt} value={opt} disabled={!!added}>{opt} ({vData.qty} avail){added ? " ✓" : ""}</option>;
                            })}
                          </select>
                          <button onClick={() => {
                            const sel = document.getElementById(`opt-${it.id}`);
                            if (sel && sel.value) { addLn(it, sel.value); sel.value = ""; }
                          }} style={{ ...bP, padding: "8px 14px", fontSize: 13, borderRadius: 10, whiteSpace: "nowrap" }}><Plus size={13} /> Add</button>
                        </div>
                      ) : (
                        <button onClick={() => addLn(it, opts[0])} disabled={!!lines.find((l) => l.key === it.id + ":" + opts[0])}
                          style={{ ...bP, padding: "8px 14px", fontSize: 13, borderRadius: 10, opacity: lines.find((l) => l.key === it.id + ":" + opts[0]) ? 0.3 : 1 }}>
                          <Plus size={13} /> Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── SUMMARY PANEL ── */}
        <div style={{ flex: "1 1 320px", minWidth: 290 }}>
          <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.brd}`, padding: 24, position: "sticky", top: 70, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.t2, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>Order Summary · {lines.length} item{lines.length !== 1 ? "s" : ""}</div>
            {!lines.length && <div style={{ padding: 30, textAlign: "center", color: C.t2, fontSize: 14 }}>Add materials to get started</div>}
            {lines.map((l, i) => {
              const it = iMap[l.itemId] || { name: "?", unit: "" };
              const hasOpts = it.options && it.options.length > 0;
              const needsOpt = hasOpts && (!l.option || l.option === "");
              return (
                <div key={l.key} style={{ padding: "12px 0", borderBottom: `1px solid ${C.brd}`, background: needsOpt ? C.wrn + "08" : "transparent", marginLeft: needsOpt ? -10 : 0, marginRight: needsOpt ? -10 : 0, paddingLeft: needsOpt ? 10 : 0, paddingRight: needsOpt ? 10 : 0, borderRadius: needsOpt ? 10 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{it.name}{l.option && l.option !== "_default" ? <span style={{ fontWeight: 400, color: C.t2, fontSize: 12 }}> · {l.option}</span> : null}</div>
                    <button onClick={() => rmLn(i)} style={{ background: "none", border: "none", color: C.t2, cursor: "pointer", padding: 4 }}><Trash2 size={14} /></button>
                  </div>
                  {needsOpt && (
                    <div style={{ marginBottom: 8 }}>
                      <select value="" onChange={(e) => {
                        if (!e.target.value) return;
                        const opt = e.target.value;
                        const v = getVariants(it);
                        const vd = v[opt] || { wac: it.wacCost || 0 };
                        const n = [...lines]; n[i] = { ...n[i], key: it.id + ":" + opt, option: opt, unitCost: vd.wac || it.wacCost || 0, markupCost: (vd.wac || it.wacCost || 0) * (1 + (it.markup || 0) / 100) }; setLines(n);
                      }} style={{ ...inp, padding: "10px 12px", fontSize: 14, borderColor: C.wrn, cursor: "pointer", borderRadius: 10 }}>
                        <option value="">⚠ Select color/style...</option>
                        {(it.options || []).map((opt) => {
                          const vd = (getVariants(it))[opt] || { qty: 0 };
                          return <option key={opt} value={opt}>{opt} ({vd.qty} avail)</option>;
                        })}
                      </select>
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ fontSize: 11, color: C.t2, fontWeight: 600 }}>QTY ({it.unit || "each"})</div>
                    <input type="number" min="1" value={l.qty} onChange={(e) => updLn(i, "qty", Math.max(1, +e.target.value))} onFocus={(e) => e.target.select()} style={{ ...inp, padding: "8px 10px", fontSize: 14, textAlign: "center", width: 70, borderRadius: 10 }} />
                    <div style={{ marginLeft: "auto", fontFamily: MN, fontWeight: 700, fontSize: 15, color: C.ac }}>{fmt$(l.qty * l.markupCost)}</div>
                  </div>
                </div>
              );
            })}
            {lines.length > 0 && <>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `2px solid ${C.brd}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.t2, marginBottom: 6 }}><span>Our Cost</span><span style={{ fontFamily: MN }}>{fmt$(tCost)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 800 }}><span>Total</span><span style={{ fontFamily: MN, color: C.ac }}>{fmt$(tSell)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.grn, marginTop: 4 }}><span>Margin</span><span style={{ fontFamily: MN }}>{fmt$(tSell - tCost)}</span></div>
              </div>
              <button onClick={submit} disabled={!lines.length || !allOptionsSet} style={{ ...bP, width: "100%", justifyContent: "center", marginTop: 16, padding: "16px", fontSize: 16, borderRadius: 14, opacity: (!lines.length || !allOptionsSet) ? 0.5 : 1, fontWeight: 800, letterSpacing: ".01em" }}><Check size={18} /> Submit {type === "return" ? "Return" : "Order"}</button>
            </>}
          </div>
        </div>
      </div>
    </div>
  );
}
function Approvals({ orders, sO, items, sI, view }) {
  const pend = orders.filter((o) => o.status === "pending").sort((a, b) => new Date(b.date) - new Date(a.date));
  const [deleteWarn, setDeleteWarn] = useState(null);

  const approve = async (id) => {
    const order = orders.find((o) => o.id === id);
    const approvedOrder = { ...order, status: "approved", approvedDate: new Date().toISOString() };
    // Upload to JobNimbus if linked
    let jnFileId = null;
    if (approvedOrder.jnJobId) {
      jnFileId = await uploadToJN(approvedOrder, items);
    }
    sO(orders.map((o) => o.id === id ? { ...approvedOrder, jnFileId: jnFileId || o.jnFileId || "" } : o));
  };
  const reject = (id) => { if (confirm("Reject this order?")) sO(orders.map((o) => o.id === id ? { ...o, status: "rejected", approvedDate: new Date().toISOString() } : o)); };
  const deleteOrder = (id) => {
    const ord = orders.find((o) => o.id === id);
    if (ord?.jnFileId) deleteFromJN(ord.jnFileId);
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
              {["Item", "Category", "Color/Style", "On Hand", "WAC", "Supplier $", "Markup", "Sell", ""].map((h) => (
                <th key={h} style={{ padding: "10px 10px", textAlign: "left", fontWeight: 700, color: C.t2, fontSize: 10, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {!filt.length && <tr><td colSpan={9} style={{ padding: 30, textAlign: "center", color: C.t2 }}>No items yet.</td></tr>}
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
                    <td style={{ padding: "9px 10px", fontFamily: MN, color: C.blu }}>{vi === 0 ? fmt$(it.supplierCost || 0) : ""}</td>
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
  const [deleteReceipt, setDeleteReceipt] = useState(null);
  const [editReceipt, setEditReceipt] = useState(null);
  const [erQty, setErQty] = useState("");
  const [erCost, setErCost] = useState("");
  const [erNote, setErNote] = useState("");

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
          <thead><tr style={{ borderBottom: `1px solid ${C.brdL}` }}>{["Date", "Item", "Option", "Qty", "Cost", "Prev WAC", "New WAC", "Total Qty", "Notes", "Actions"].map((h) => <th key={h} style={{ padding: "9px 8px", textAlign: "left", fontWeight: 700, color: C.t2, fontSize: 10, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>
            {!log.length && <tr><td colSpan={10} style={{ padding: 24, textAlign: "center", color: C.t2 }}>No receipts yet.</td></tr>}
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
                <td style={{ padding: "7px 8px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => { setEditReceipt(r); setErQty(String(r.qty)); setErCost(String(r.unitCost)); setErNote(r.note || ""); }} style={{ background: "none", border: "none", color: C.t2, cursor: "pointer" }}><Edit3 size={13} /></button>
                    <button onClick={() => setDeleteReceipt(r)} style={{ background: "none", border: "none", color: C.red, cursor: "pointer" }}><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>

      {/* DELETE RECEIPT MODAL */}
      {deleteReceipt && (
        <Modal open onClose={() => setDeleteReceipt(null)} title="">
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ background: C.red + "15", borderRadius: 16, padding: 20, display: "inline-flex", marginBottom: 16 }}><AlertTriangle size={48} color={C.red} /></div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: C.red, marginBottom: 8 }}>DELETE THIS RECEIPT?</h2>
            <p style={{ fontSize: 14, marginBottom: 6 }}><strong>{deleteReceipt.itemName}</strong> — {deleteReceipt.qty} units @ {fmt$(deleteReceipt.unitCost)}</p>
            <p style={{ color: C.grn, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>{deleteReceipt.qty} units will be removed from inventory.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setDeleteReceipt(null)} style={{ ...bS, padding: "12px 28px", fontSize: 14 }}>Cancel</button>
              <button onClick={() => {
                const r = deleteReceipt;
                const opt = r.option || "_default";
                sI(items.map((it) => {
                  if (it.id !== r.itemId) return it;
                  const v = { ...(it.variants || getVariants(it)) };
                  const curV = v[opt] || { qty: 0, wac: it.wacCost || 0 };
                  const newQty = Math.max(0, (curV.qty || 0) - (r.qty || 0));
                  // Recalc WAC: remove the cost contribution of this receipt
                  const totalCostBefore = (curV.qty || 0) * (curV.wac || 0);
                  const removedCost = (r.qty || 0) * (r.unitCost || 0);
                  const newWac = newQty > 0 ? Math.round((totalCostBefore - removedCost) / newQty * 100) / 100 : curV.wac || 0;
                  v[opt] = { ...curV, qty: newQty, wac: newWac };
                  const totalQ = Object.values(v).reduce((s, x) => s + (x.qty || 0), 0);
                  return { ...it, variants: v, qtyOnHand: totalQ };
                }));
                svLog(log.filter((x) => x.id !== r.id));
                setDeleteReceipt(null);
              }} style={{ ...bD, padding: "12px 28px", fontSize: 14 }}><Trash2 size={14} /> Delete & Update Inventory</button>
            </div>
          </div>
        </Modal>
      )}

      {/* EDIT RECEIPT MODAL */}
      {editReceipt && (
        <Modal open onClose={() => setEditReceipt(null)} title={`Edit Receipt — ${editReceipt.itemName}`}>
          <Fld label="Quantity Received"><input type="number" min="1" value={erQty} onChange={(e) => setErQty(e.target.value)} style={inp} /></Fld>
          <Fld label="Cost Per Unit ($)"><input type="number" step=".01" value={erCost} onChange={(e) => setErCost(e.target.value)} style={inp} /></Fld>
          <Fld label="Notes"><input value={erNote} onChange={(e) => setErNote(e.target.value)} style={inp} /></Fld>
          <div style={{ background: C.sf, borderRadius: 6, padding: 10, marginBottom: 12, fontSize: 12 }}>
            <strong>Original:</strong> {editReceipt.qty} units @ {fmt$(editReceipt.unitCost)} = {fmt$(editReceipt.qty * editReceipt.unitCost)}
            {erQty && erCost && <div style={{ marginTop: 4 }}><strong>New:</strong> {erQty} units @ {fmt$(+erCost)} = {fmt$((+erQty) * (+erCost))}</div>}
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setEditReceipt(null)} style={bS}>Cancel</button>
            <button onClick={() => {
              const r = editReceipt;
              const opt = r.option || "_default";
              const oldQty = r.qty || 0;
              const newQty = +(erQty) || oldQty;
              const oldCost = r.unitCost || 0;
              const newCost = +(erCost) || oldCost;
              const qtyDiff = newQty - oldQty;
              // Adjust inventory: remove old contribution, add new
              sI(items.map((it) => {
                if (it.id !== r.itemId) return it;
                const v = { ...(it.variants || getVariants(it)) };
                const curV = v[opt] || { qty: 0, wac: it.wacCost || 0 };
                const adjQty = (curV.qty || 0) + qtyDiff;
                const totalCostBefore = (curV.qty || 0) * (curV.wac || 0);
                const costDiff = (newQty * newCost) - (oldQty * oldCost);
                const adjWac = adjQty > 0 ? Math.round((totalCostBefore + costDiff) / adjQty * 100) / 100 : newCost;
                v[opt] = { ...curV, qty: Math.max(0, adjQty), wac: adjWac };
                const totalQ = Object.values(v).reduce((s, x) => s + (x.qty || 0), 0);
                return { ...it, variants: v, qtyOnHand: totalQ };
              }));
              // Update log entry
              svLog(log.map((x) => x.id === r.id ? { ...x, qty: newQty, unitCost: newCost, note: erNote.trim() } : x));
              setEditReceipt(null);
            }} style={bP}><Check size={14} /> Save & Update Inventory</button>
          </div>
        </Modal>
      )}
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

  const addItem = (it) => {
    if (tplItems.find((x) => x.itemId === it.id)) return;
    setTplItems([...tplItems, { itemId: it.id, option: "", qty: 1 }]);
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
          <Fld label="Add Items (color/style is chosen when ordering)">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items..." style={inp} />
          </Fld>
          <div style={{ maxHeight: 250, overflow: "auto", border: `1px solid ${C.brd}`, borderRadius: 6 }}>
            {filt.map((it) => {
              const added = tplItems.find((x) => x.itemId === it.id);
              return (
                <div key={it.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px", borderBottom: `1px solid ${C.brd}` }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{it.name} <span style={{ fontWeight: 400, color: C.ac, fontSize: 10 }}>({it.unit})</span></div>
                    <div style={{ fontSize: 10, color: C.t2 }}>{it.category}{it.options?.length ? ` · ${it.options.length} options` : ""}</div>
                  </div>
                  <button onClick={() => addItem(it)} disabled={!!added}
                    style={{ ...bP, padding: "4px 12px", fontSize: 11, opacity: added ? 0.3 : 1 }}><Plus size={10} /> {added ? "Added" : "Add"}</button>
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
                <div style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>{it.name} <span style={{ fontWeight: 400, color: C.ac, fontSize: 10 }}>({it.unit})</span>{ti.option ? <span style={{ color: C.t2, fontWeight: 400 }}> · {ti.option}</span> : null}</div>
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

// ═══ JOB PROFIT TRACKER ═══
function JobTracker({ jobs, sJ, orders, items }) {
  const [view, setView] = useState("list"); // list, detail, reports, history
  const [editJob, setEditJob] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [addModal, setAddModal] = useState(false);
  const [jnAll, setJnAll] = useState([]);
  const [jnSearch, setJnSearch] = useState("");
  const [showJnDrop, setShowJnDrop] = useState(false);
  const [nName, setNName] = useState(""); const [nAddr, setNAddr] = useState(""); const [nContract, setNContract] = useState(""); const [nGP, setNGP] = useState("35"); const [nInsurance, setNInsurance] = useState(false); const [nJnId, setNJnId] = useState("");
  const [cCat, setCCat] = useState("labor"); const [cDesc, setCDesc] = useState(""); const [cAmt, setCAmt] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/jn?action=jobs");
        const d = await r.json();
        const jnJobs = d.jobs || [];
        setJnAll(jnJobs);
        // Auto-sync: if a tracked job's JN status is "Job Completed" and our status is open/in_progress, move to waiting_invoices
        // Also migrate any old "open" status to "in_progress"
        let changed = false;
        const updated = jobs.map((tj) => {
          if (tj.status === "open") { changed = true; tj = { ...tj, status: "in_progress" }; }
          if (!tj.jnJobId || tj.status === "waiting_invoices" || tj.status === "closed") return tj;
          const jnJob = jnJobs.find((j) => j.id === tj.jnJobId);
          if (jnJob && (jnJob.status || "").toLowerCase().replace(/[^a-z]/g, "") === "jobcompleted") {
            changed = true;
            return { ...tj, status: "waiting_invoices", completedDate: tj.completedDate || new Date().toISOString() };
          }
          return tj;
        });
        if (changed) sJ(updated);
      } catch(e) {}
    })();
  }, []);

  const STATUSES = ["in_progress","waiting_invoices","closed"];
  const SL = { in_progress:"Job In Progress", waiting_invoices:"Waiting on Invoices", closed:"Closed" };
  const SC = { in_progress:{bg:C.wrn+"15",c:C.wrn}, waiting_invoices:{bg:NAVY+"15",c:NAVY}, closed:{bg:C.grn+"15",c:C.grn} };

  const calcJob = (j) => {
    const contract = j.contractAmount || 0;
    const costs = (j.costs || []).reduce((s,c) => s + (c.amount||0), 0);
    const linked = orders.filter((o) => o.jnJobId && o.jnJobId === j.jnJobId && o.status === "approved");
    const matOrd = linked.reduce((s,o) => s + (o.lines||[]).reduce((s2,l) => s2 + l.qty*(l.markupCost||l.unitCost||0), 0), 0);
    const total = costs + matOrd;
    const projGP$ = contract * ((j.projectedGP||0)/100);
    const actGP$ = contract - total;
    const actGP = contract > 0 ? (actGP$/contract)*100 : 0;
    const variance = actGP$ - projGP$;
    const labor = (j.costs||[]).filter(c=>c.category==="labor").reduce((s,c)=>s+(c.amount||0),0);
    const mat = (j.costs||[]).filter(c=>c.category==="material").reduce((s,c)=>s+(c.amount||0),0) + matOrd;
    const other = (j.costs||[]).filter(c=>c.category==="other").reduce((s,c)=>s+(c.amount||0),0);
    return { ...j, totalCosts:total, projGP$, actGP$, actGP, variance, labor, mat, other, matOrd };
  };

  const allCalc = jobs.map(calcJob);
  const filtered = allCalc.filter((j) => {
    if (filterStatus !== "all" && j.status !== filterStatus) return false;
    if (filterType === "insurance" && !j.isInsurance) return false;
    if (filterType === "retail" && j.isInsurance) return false;
    if (search) { const s = search.toLowerCase(); if (!(j.name||"").toLowerCase().includes(s) && !(j.address||"").toLowerCase().includes(s)) return false; }
    return true;
  }).sort((a,b) => {
    if (sortBy==="name") return (a.name||"").localeCompare(b.name||"");
    if (sortBy==="gp") return b.actGP-a.actGP;
    if (sortBy==="variance") return a.variance-b.variance;
    if (sortBy==="contract") return b.contractAmount-a.contractAmount;
    return new Date(b.createdDate||0)-new Date(a.createdDate||0);
  });

  const jnF = jnAll.filter((j) => { if (!jnSearch.trim()) return false; const s=jnSearch.toLowerCase(); return (j.name||"").toLowerCase().includes(s)||(j.address||"").toLowerCase().includes(s); }).slice(0,6);
  const activeJ = allCalc.filter(j=>j.status!=="closed");
  const closedJ = allCalc.filter(j=>j.status==="closed");
  const totProjProfit = activeJ.reduce((s,j)=>s+j.projGP$,0);
  const totActProfit = closedJ.reduce((s,j)=>s+j.actGP$,0);
  const avgProjGP = activeJ.length ? activeJ.reduce((s,j)=>s+(j.projectedGP||0),0)/activeJ.length : 0;
  const avgActGP = closedJ.length ? closedJ.reduce((s,j)=>s+j.actGP,0)/closedJ.length : 0;

  const addJob = () => { if (!nName.trim()) return; sJ([...jobs, { id:uid(), jnJobId:nJnId, name:nName.trim(), address:nAddr.trim(), contractAmount:+nContract||0, projectedGP:+nGP||0, isInsurance:nInsurance, status:"in_progress", costs:[], notes:"", createdDate:new Date().toISOString(), completedDate:"" }]); setNName(""); setNAddr(""); setNContract(""); setNGP("35"); setNInsurance(false); setNJnId(""); setJnSearch(""); setAddModal(false); };
  const addCost = (jid) => { if (!cDesc.trim()||!cAmt) return; sJ(jobs.map(j=>j.id===jid?{...j,costs:[...(j.costs||[]),{id:uid(),category:cCat,description:cDesc.trim(),amount:+cAmt||0,date:new Date().toISOString()}]}:j)); setCDesc(""); setCAmt(""); setCCat("labor"); };
  const deleteCost = (jid,cid) => { sJ(jobs.map(j=>j.id===jid?{...j,costs:(j.costs||[]).filter(c=>c.id!==cid)}:j)); };
  const updateJob = (jid,upd) => { sJ(jobs.map(j=>j.id===jid?{...j,...upd}:j)); };

  // ── REPORTS ──
  if (view === "reports") {
    const fade = allCalc.filter(j=>j.status==="closed"&&j.variance<-500).sort((a,b)=>a.variance-b.variance);
    const wins = allCalc.filter(j=>j.status==="closed"&&j.variance>500).sort((a,b)=>b.variance-a.variance);
    const tL=closedJ.reduce((s,j)=>s+j.labor,0), tM=closedJ.reduce((s,j)=>s+j.mat,0), tO=closedJ.reduce((s,j)=>s+j.other,0), tAll=tL+tM+tO;
    return (
      <div className="fu">
        <button onClick={()=>setView("list")} style={{...bS,marginBottom:16,borderRadius:10,padding:"8px 14px",fontSize:13}}><ArrowLeft size={14}/> Back to Jobs</button>
        <h1 style={{fontSize:26,fontWeight:900,marginBottom:20,fontFamily:BC}}>JOB PROFITABILITY REPORTS</h1>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:24}}>
          {[{l:"Avg Proj GP%",v:avgProjGP.toFixed(1)+"%",c:C.blu},{l:"Avg Actual GP%",v:avgActGP.toFixed(1)+"%",c:avgActGP>=avgProjGP?C.grn:C.red},{l:"Proj Profit (Open)",v:fmt$(totProjProfit),c:C.blu},{l:"Actual Profit (Closed)",v:fmt$(totActProfit),c:totActProfit>=0?C.grn:C.red}].map((s,i)=>(
            <div key={i} style={{flex:"1 1 200px",background:C.card,borderRadius:14,border:`1px solid ${C.brd}`,padding:20,textAlign:"center"}}>
              <div style={{fontSize:11,color:C.t2,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>{s.l}</div>
              <div style={{fontSize:28,fontWeight:900,color:s.c,fontFamily:MN}}>{s.v}</div>
            </div>
          ))}
        </div>
        {tAll>0&&<div style={{background:C.card,borderRadius:14,border:`1px solid ${C.brd}`,padding:24,marginBottom:20}}>
          <div style={{fontSize:13,fontWeight:700,color:C.t2,textTransform:"uppercase",letterSpacing:".08em",marginBottom:16}}>Cost Breakdown (Completed)</div>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            {[{l:"Labor",v:tL,c:C.blu},{l:"Materials",v:tM,c:RED},{l:"Other",v:tO,c:C.wrn}].map(c=>(
              <div key={c.l} style={{flex:"1 1 150px",textAlign:"center"}}>
                <div style={{fontSize:22,fontWeight:800,color:c.c,fontFamily:MN}}>{fmt$(c.v)}</div>
                <div style={{fontSize:12,color:C.t2,marginTop:4}}>{c.l} · {tAll>0?((c.v/tAll)*100).toFixed(0):0}%</div>
                <div style={{height:6,background:C.sf,borderRadius:3,marginTop:6}}><div style={{height:6,background:c.c,borderRadius:3,width:(tAll>0?(c.v/tAll)*100:0)+"%"}}/></div>
              </div>
            ))}
          </div>
        </div>}
        {fade.length>0&&<div style={{background:C.card,borderRadius:14,border:`1px solid ${C.brd}`,padding:24,marginBottom:20}}>
          <div style={{fontSize:13,fontWeight:700,color:C.red,textTransform:"uppercase",letterSpacing:".08em",marginBottom:12}}>Profit Fade — Underperforming</div>
          {fade.slice(0,10).map(j=>(<div key={j.id} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.brd}`,alignItems:"center"}}><div><div style={{fontWeight:700,fontSize:14}}>{j.name}</div><div style={{fontSize:11,color:C.t2}}>{j.address}</div></div><div style={{textAlign:"right"}}><div style={{fontWeight:800,color:C.red,fontFamily:MN}}>{fmt$(j.variance)}</div><div style={{fontSize:10,color:C.t2}}>Proj {j.projectedGP}% → Actual {j.actGP.toFixed(1)}%</div></div></div>))}
        </div>}
        {wins.length>0&&<div style={{background:C.card,borderRadius:14,border:`1px solid ${C.brd}`,padding:24}}>
          <div style={{fontSize:13,fontWeight:700,color:C.grn,textTransform:"uppercase",letterSpacing:".08em",marginBottom:12}}>Profit Wins — Overperforming</div>
          {wins.slice(0,10).map(j=>(<div key={j.id} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.brd}`,alignItems:"center"}}><div><div style={{fontWeight:700,fontSize:14}}>{j.name}</div><div style={{fontSize:11,color:C.t2}}>{j.address}</div></div><div style={{textAlign:"right"}}><div style={{fontWeight:800,color:C.grn,fontFamily:MN}}>+{fmt$(j.variance)}</div><div style={{fontSize:10,color:C.t2}}>Proj {j.projectedGP}% → Actual {j.actGP.toFixed(1)}%</div></div></div>))}
        </div>}
      </div>
    );
  }

  // ── JOB DETAIL ──
  if (editJob) {
    const j = calcJob(editJob);
    const sc = SC[j.status]||SC.in_progress;
    return (
      <div className="fu">
        <button onClick={()=>setEditJob(null)} style={{...bS,marginBottom:16,borderRadius:10,padding:"8px 14px",fontSize:13}}><ArrowLeft size={14}/> Back</button>
        <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.brd}`,padding:28,marginBottom:16,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:16}}>
            <div><h1 style={{fontSize:24,fontWeight:900,fontFamily:BC}}>{j.name}</h1>{j.address&&<div style={{fontSize:14,color:C.t2,marginTop:4}}>{j.address}</div>}</div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {j.isInsurance&&<span style={{fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:6,background:C.blu+"15",color:C.blu}}>INSURANCE</span>}
              <select value={j.status} onChange={(e)=>{updateJob(j.id,{status:e.target.value,completedDate:e.target.value==="closed"?new Date().toISOString():j.completedDate}); if(e.target.value==="closed"){setEditJob(null);}else{setEditJob({...editJob,status:e.target.value});}}} style={{...inp,padding:"8px 12px",fontSize:12,width:"auto",borderRadius:10,fontWeight:700,background:sc.bg,color:sc.c,cursor:"pointer"}}>{STATUSES.map(s=><option key={s} value={s}>{SL[s]}</option>)}</select>
            </div>
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            {[{l:"Contract",v:fmt$(j.contractAmount),bg:C.sf,c:C.txt},{l:"Total Costs",v:fmt$(j.totalCosts),bg:C.sf,c:C.red},{l:"Actual GP",v:fmt$(j.actGP$)+" ("+j.actGP.toFixed(1)+"%)",bg:j.actGP>=(j.projectedGP||0)?C.grn+"10":C.red+"10",c:j.actGP>=0?C.grn:C.red},{l:"Variance",v:(j.variance>=0?"+":"")+fmt$(j.variance),bg:j.variance>=0?C.grn+"10":C.red+"10",c:j.variance>=0?C.grn:C.red}].map((m,i)=>(
              <div key={i} style={{flex:"1 1 120px",textAlign:"center",padding:14,background:m.bg,borderRadius:12}}><div style={{fontSize:10,color:C.t2,fontWeight:700,textTransform:"uppercase",marginBottom:4}}>{m.l}</div><div style={{fontSize:20,fontWeight:900,fontFamily:MN,color:m.c}}>{m.v}</div></div>
            ))}
          </div>
          <div style={{display:"flex",gap:12,marginTop:16,flexWrap:"wrap"}}>
            <div style={{flex:"1 1 150px"}}><div style={{fontSize:10,color:C.t2,fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Contract $</div><input type="number" value={j.contractAmount||""} onChange={(e)=>{updateJob(j.id,{contractAmount:+e.target.value||0}); setEditJob({...editJob,contractAmount:+e.target.value||0});}} onFocus={(e)=>e.target.select()} style={{...inp,borderRadius:10,padding:"10px 14px",fontSize:15,fontFamily:MN}}/></div>
            <div style={{flex:"1 1 100px"}}><div style={{fontSize:10,color:C.t2,fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Proj GP %</div><input type="number" value={j.projectedGP||""} onChange={(e)=>{updateJob(j.id,{projectedGP:+e.target.value||0}); setEditJob({...editJob,projectedGP:+e.target.value||0});}} onFocus={(e)=>e.target.select()} style={{...inp,borderRadius:10,padding:"10px 14px",fontSize:15,fontFamily:MN}}/></div>
            <div style={{flex:"0 0 auto",display:"flex",alignItems:"flex-end",paddingBottom:4}}><label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,fontWeight:600}}><input type="checkbox" checked={j.isInsurance||false} onChange={(e)=>{updateJob(j.id,{isInsurance:e.target.checked}); setEditJob({...editJob,isInsurance:e.target.checked});}} style={{width:18,height:18}}/> Insurance</label></div>
          </div>
        </div>
        <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
          <div style={{flex:"1 1 400px"}}>
            <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.brd}`,padding:24,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
              <div style={{fontSize:13,fontWeight:700,color:C.t2,textTransform:"uppercase",letterSpacing:".08em",marginBottom:14}}>Job Costs</div>
              <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
                <select value={cCat} onChange={(e)=>setCCat(e.target.value)} style={{...inp,width:"auto",minWidth:100,borderRadius:10,padding:"10px 12px",fontSize:13}}><option value="labor">Labor</option><option value="material">Material</option><option value="other">Other</option></select>
                <input value={cDesc} onChange={(e)=>setCDesc(e.target.value)} placeholder="Description" style={{...inp,flex:2,borderRadius:10,padding:"10px 12px",fontSize:13}}/>
                <input type="number" value={cAmt} onChange={(e)=>setCAmt(e.target.value)} placeholder="$" onFocus={(e)=>e.target.select()} style={{...inp,width:100,borderRadius:10,padding:"10px 12px",fontSize:13,fontFamily:MN}}/>
                <button onClick={()=>addCost(j.id)} style={{...bP,borderRadius:10,padding:"10px 16px",fontSize:13}}><Plus size={14}/></button>
              </div>
              {!(j.costs||[]).length&&!j.matOrd&&<div style={{padding:20,textAlign:"center",color:C.t2,fontSize:13}}>No costs yet.</div>}
              {(j.costs||[]).map(c=>(<div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.brd}`}}><div><span style={{fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:4,marginRight:8,background:c.category==="labor"?C.blu+"15":c.category==="material"?RED+"15":C.wrn+"15",color:c.category==="labor"?C.blu:c.category==="material"?RED:C.wrn}}>{c.category}</span><span style={{fontSize:13,fontWeight:600}}>{c.description}</span><span style={{fontSize:11,color:C.t2,marginLeft:8}}>{fD(c.date)}</span></div><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontFamily:MN,fontWeight:700,fontSize:14}}>{fmt$(c.amount)}</span><button onClick={()=>{deleteCost(j.id,c.id); setEditJob({...editJob,costs:(editJob.costs||[]).filter(x=>x.id!==c.id)});}} style={{background:"none",border:"none",color:C.t2,cursor:"pointer"}}><Trash2 size={13}/></button></div></div>))}
              {j.matOrd>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.brd}`}}><div><span style={{fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:4,marginRight:8,background:RED+"15",color:RED}}>material</span><span style={{fontSize:13,fontWeight:600,color:C.t2}}>Linked Orders (auto)</span></div><span style={{fontFamily:MN,fontWeight:700,fontSize:14}}>{fmt$(j.matOrd)}</span></div>}
              {j.totalCosts>0&&<div style={{marginTop:12,paddingTop:12,borderTop:`2px solid ${C.brd}`}}>
                {j.labor>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:C.blu,fontWeight:600}}>Labor</span><span style={{fontFamily:MN}}>{fmt$(j.labor)}</span></div>}
                {j.mat>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:RED,fontWeight:600}}>Materials</span><span style={{fontFamily:MN}}>{fmt$(j.mat)}</span></div>}
                {j.other>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:C.wrn,fontWeight:600}}>Other</span><span style={{fontFamily:MN}}>{fmt$(j.other)}</span></div>}
                <div style={{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:800,marginTop:8,paddingTop:8,borderTop:`1px solid ${C.brd}`}}><span>Total</span><span style={{fontFamily:MN,color:C.red}}>{fmt$(j.totalCosts)}</span></div>
              </div>}
            </div>
          </div>
          <div style={{flex:"0 0 280px"}}>
            <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.brd}`,padding:24,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
              <div style={{fontSize:13,fontWeight:700,color:C.t2,textTransform:"uppercase",letterSpacing:".08em",marginBottom:16}}>Profit Summary</div>
              <div style={{marginBottom:12}}><div style={{fontSize:11,color:C.t2,marginBottom:2}}>Projected</div><div style={{fontSize:20,fontWeight:800,fontFamily:MN}}>{fmt$(j.projGP$)} <span style={{fontSize:13,color:C.t2,fontWeight:600}}>({j.projectedGP}%)</span></div></div>
              <div style={{marginBottom:12}}><div style={{fontSize:11,color:C.t2,marginBottom:2}}>Actual</div><div style={{fontSize:20,fontWeight:800,fontFamily:MN,color:j.actGP$>=0?C.grn:C.red}}>{fmt$(j.actGP$)} <span style={{fontSize:13,fontWeight:600}}>({j.actGP.toFixed(1)}%)</span></div></div>
              <div style={{paddingTop:12,borderTop:`2px solid ${C.brd}`}}><div style={{fontSize:11,color:C.t2,marginBottom:2}}>Variance</div><div style={{fontSize:24,fontWeight:900,fontFamily:MN,color:j.variance>=0?C.grn:C.red}}>{j.variance>=0?"+":""}{fmt$(j.variance)}</div></div>
            </div>
            <button onClick={()=>{if(confirm("Delete this job?")) {sJ(jobs.filter(x=>x.id!==j.id)); setEditJob(null);}}} style={{...bS,width:"100%",marginTop:12,borderRadius:10,color:C.red,borderColor:C.red+"44",justifyContent:"center"}}><Trash2 size={14}/> Delete Job</button>
          </div>
        </div>
      </div>
    );
  }

  // ── LIST ──
  const isHistory = view === "history";
  const listJobs = isHistory ? filtered.filter(j=>j.status==="closed") : filtered.filter(j=>j.status!=="closed");
  const activeStatuses = STATUSES.filter(s=>s!=="closed");

  return (
    <div className="fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div><h1 style={{fontSize:26,fontWeight:900,fontFamily:BC}}>JOBS</h1><p style={{color:C.t2,fontSize:14,marginTop:4}}>{jobs.length} total · {activeJ.length} active · {closedJ.length} closed</p></div>
        <div style={{display:"flex",gap:8}}><button onClick={()=>setView("reports")} style={{...bS,borderRadius:10,padding:"10px 16px",fontSize:13}}><BarChart2 size={14}/> Reports</button><button onClick={()=>setAddModal(true)} style={{...bP,borderRadius:10,padding:"10px 16px",fontSize:13}}><Plus size={14}/> Add Job</button></div>
      </div>

      {/* ACTIVE / HISTORY TABS */}
      <div style={{display:"flex",gap:4,marginBottom:16}}>
        <button onClick={()=>setView("list")} style={{...(!isHistory?bP:bS),borderRadius:10,padding:"10px 20px",fontSize:14,fontWeight:700}}>Active Jobs ({activeJ.length})</button>
        <button onClick={()=>setView("history")} style={{...(isHistory?bP:bS),borderRadius:10,padding:"10px 20px",fontSize:14,fontWeight:700}}>History ({closedJ.length})</button>
      </div>

      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:20}}>
        {[{l:"Active",v:activeJ.length,c:C.blu},{l:"Proj Profit",v:fmt$(totProjProfit),c:C.blu},{l:"Closed",v:closedJ.length,c:C.grn},{l:"Actual Profit",v:fmt$(totActProfit),c:totActProfit>=0?C.grn:C.red}].map((s,i)=>(
          <div key={i} style={{flex:"1 1 160px",background:C.card,borderRadius:14,border:`1px solid ${C.brd}`,padding:"16px 20px"}}><div style={{fontSize:10,color:C.t2,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em"}}>{s.l}</div><div style={{fontSize:22,fontWeight:900,color:s.c,fontFamily:MN,marginTop:4}}>{s.v}</div></div>
        ))}
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        <div style={{flex:"2 1 200px",position:"relative"}}><Search size={14} style={{position:"absolute",left:12,top:13,color:C.t2}}/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search jobs..." style={{...inp,paddingLeft:34,borderRadius:10,padding:"12px 14px 12px 34px"}}/></div>
        {!isHistory && <select value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)} style={{...inp,width:"auto",minWidth:140,borderRadius:10,padding:"12px 14px",cursor:"pointer"}}><option value="all">All Status</option>{activeStatuses.map(s=><option key={s} value={s}>{SL[s]}</option>)}</select>}
        <select value={filterType} onChange={(e)=>setFilterType(e.target.value)} style={{...inp,width:"auto",minWidth:100,borderRadius:10,padding:"12px 14px",cursor:"pointer"}}><option value="all">All Types</option><option value="insurance">Insurance</option><option value="retail">Retail</option></select>
        <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)} style={{...inp,width:"auto",minWidth:100,borderRadius:10,padding:"12px 14px",cursor:"pointer"}}><option value="date">Newest</option><option value="name">Name</option><option value="gp">Best GP%</option><option value="variance">Worst Variance</option><option value="contract">Largest</option></select>
      </div>
      {!listJobs.length&&<div style={{background:C.card,borderRadius:14,border:`1px solid ${C.brd}`,padding:40,textAlign:"center",color:C.t2}}>{isHistory ? "No closed jobs yet." : "No active jobs found. Click \"Add Job\" to start."}</div>}
      {listJobs.map(j=>{const sc=SC[j.status]||SC.in_progress; return (
        <div key={j.id} onClick={()=>setEditJob(jobs.find(x=>x.id===j.id))} style={{background:C.card,borderRadius:14,border:`1px solid ${C.brd}`,padding:"18px 22px",marginBottom:10,cursor:"pointer",transition:"border-color .2s,box-shadow .2s",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}} onMouseEnter={(e)=>{e.currentTarget.style.borderColor=C.ac;e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.08)";}} onMouseLeave={(e)=>{e.currentTarget.style.borderColor=C.brd;e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.04)";}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
            <div style={{flex:"1 1 200px"}}><div style={{fontWeight:700,fontSize:16}}>{j.name}</div>{j.address&&<div style={{fontSize:12,color:C.t2,marginTop:2}}>{j.address}</div>}<div style={{display:"flex",gap:6,marginTop:8}}><span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:5,background:sc.bg,color:sc.c}}>{SL[j.status]}</span>{j.isInsurance&&<span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:5,background:C.blu+"15",color:C.blu}}>Insurance</span>}</div></div>
            <div style={{display:"flex",gap:20,alignItems:"center",flexWrap:"wrap"}}>
              <div style={{textAlign:"center",minWidth:80}}><div style={{fontSize:10,color:C.t2,fontWeight:600,marginBottom:2}}>Contract</div><div style={{fontSize:16,fontWeight:800,fontFamily:MN}}>{fmt$(j.contractAmount)}</div></div>
              <div style={{textAlign:"center",minWidth:80}}><div style={{fontSize:10,color:C.t2,fontWeight:600,marginBottom:2}}>GP%</div><div style={{fontSize:16,fontWeight:800,fontFamily:MN,color:j.actGP>=(j.projectedGP||0)?C.grn:j.totalCosts>0?C.red:C.t2}}>{j.totalCosts>0?j.actGP.toFixed(1)+"%":j.projectedGP+"% proj"}</div></div>
              <div style={{textAlign:"center",minWidth:80}}><div style={{fontSize:10,color:C.t2,fontWeight:600,marginBottom:2}}>Variance</div><div style={{fontSize:16,fontWeight:800,fontFamily:MN,color:j.variance>=0?C.grn:j.totalCosts>0?C.red:C.t2}}>{j.totalCosts>0?(j.variance>=0?"+":"")+fmt$(j.variance):"—"}</div></div>
            </div>
          </div>
        </div>
      );})}
      {addModal&&<Modal open onClose={()=>setAddModal(false)} title="Add New Job" wide>
        <div style={{position:"relative",marginBottom:12}}><Search size={14} style={{position:"absolute",left:12,top:13,color:C.t2}}/><input value={jnSearch} onChange={(e)=>{setJnSearch(e.target.value);setShowJnDrop(true);}} onFocus={()=>setShowJnDrop(true)} onBlur={()=>setTimeout(()=>setShowJnDrop(false),200)} placeholder="Search JobNimbus..." style={{...inp,paddingLeft:34,borderRadius:12,padding:"14px 14px 14px 34px",fontSize:15}} autoComplete="off"/>
          {showJnDrop&&jnSearch.trim()&&<div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:200,background:"#fff",border:`1px solid ${C.brd}`,borderRadius:12,boxShadow:"0 12px 40px rgba(0,0,0,0.15)",maxHeight:250,overflow:"auto",marginTop:4}}>
            {jnF.map(j2=>(<div key={j2.id} onMouseDown={(e)=>{e.preventDefault();setNName(j2.name||"");setNAddr(j2.address||"");setNJnId(j2.id||"");setJnSearch(j2.name||"");setShowJnDrop(false);}} style={{padding:"12px 14px",cursor:"pointer",borderBottom:`1px solid ${C.brd}`}} onMouseEnter={(e)=>{e.currentTarget.style.background=C.sf;}} onMouseLeave={(e)=>{e.currentTarget.style.background="#fff";}}><div style={{fontWeight:600,fontSize:14}}>{j2.name}</div>{j2.address&&<div style={{fontSize:12,color:C.t2,marginTop:2}}>{j2.address}</div>}</div>))}
            {!jnF.length&&<div style={{padding:14,textAlign:"center",color:C.t2,fontSize:13}}>No matches</div>}
          </div>}
        </div>
        {nJnId&&<div style={{background:C.grn+"10",borderRadius:10,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:8}}><CheckCircle size={14} color={C.grn}/><span style={{fontSize:13,fontWeight:600}}>Linked to JN</span><button onClick={()=>{setNJnId("");setJnSearch("");}} style={{marginLeft:"auto",background:"none",border:"none",color:C.t2,cursor:"pointer"}}><X size={12}/></button></div>}
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:12}}>
          <div style={{flex:"1 1 200px"}}><Fld label="Name"><input value={nName} onChange={(e)=>setNName(e.target.value)} placeholder="Homeowner / Job" style={{...inp,borderRadius:10}}/></Fld></div>
          <div style={{flex:"1 1 200px"}}><Fld label="Address"><input value={nAddr} onChange={(e)=>setNAddr(e.target.value)} placeholder="Address" style={{...inp,borderRadius:10}}/></Fld></div>
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:12}}>
          <div style={{flex:"1 1 150px"}}><Fld label="Contract ($)"><input type="number" value={nContract} onChange={(e)=>setNContract(e.target.value)} placeholder="0" onFocus={(e)=>e.target.select()} style={{...inp,borderRadius:10,fontFamily:MN}}/></Fld></div>
          <div style={{flex:"1 1 100px"}}><Fld label="Proj GP %"><input type="number" value={nGP} onChange={(e)=>setNGP(e.target.value)} placeholder="35" onFocus={(e)=>e.target.select()} style={{...inp,borderRadius:10,fontFamily:MN}}/></Fld></div>
          <div style={{flex:"0 0 auto",display:"flex",alignItems:"flex-end",paddingBottom:8}}><label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,fontWeight:600}}><input type="checkbox" checked={nInsurance} onChange={(e)=>setNInsurance(e.target.checked)} style={{width:18,height:18}}/> Insurance</label></div>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><button onClick={()=>setAddModal(false)} style={{...bS,borderRadius:10}}>Cancel</button><button onClick={addJob} disabled={!nName.trim()} style={{...bP,borderRadius:10,opacity:nName.trim()?1:0.5}}><Check size={14}/> Add Job</button></div>
      </Modal>}
    </div>
  );
}

// ═══ REPORTS ═══
// ═══════════════════════════════════════════
// QUOTE BUILDER — Phase 1
// ═══════════════════════════════════════════

const QUOTE_BASE_URL = typeof window !== "undefined" ? window.location.origin : "";
const SLIDE_TYPES = [
  { type: "cover", label: "Cover Page", icon: "🏠" },
  { type: "photos", label: "Inspection Photos", icon: "📸" },
  { type: "scope", label: "Scope of Work", icon: "📋" },
  { type: "comparison", label: "Product Comparison", icon: "⚖️" },
  { type: "pricing", label: "Pricing & Authorization", icon: "💰" },
  { type: "valueadd", label: "Info Page", icon: "ℹ️" },
  { type: "signature", label: "Signature & Terms", icon: "✍️" },
];
const VALUEADD_PRESETS = {
  about: { title: "About Roof USA", content: { heading: "About Roof USA", body: "Roofus Construction, LLC (d/b/a Roof USA) is a locally owned and operated roofing company serving Columbia, MO and surrounding areas.\n\nWe are CertainTeed ShingleMaster certified, ensuring the highest standards of workmanship and product quality.\n\nOur team brings years of experience in residential and commercial roofing, committed to delivering exceptional results on every project.\n\n• Licensed & Insured\n• ShingleMaster Certified\n• Local Columbia, MO Company\n• Manufacturer-Backed Warranties" } },
  warranty: { title: "Warranty Information", content: { heading: "Your Warranty Coverage", body: "When you choose Roof USA, your investment is protected by comprehensive warranty coverage:\n\nMANUFACTURER WARRANTY\nAs a CertainTeed ShingleMaster certified installer, we offer manufacturer-backed warranties that cover material defects for the full lifetime of your roofing system.\n\nWORKMANSHIP WARRANTY\nOur workmanship warranty covers installation-related issues, giving you complete peace of mind.\n\nWHAT'S COVERED\n• Shingle defects and premature failure\n• Installation workmanship issues\n• Wind damage up to specified speeds\n• Algae resistance (where applicable)\n\nAll warranty details will be provided at project completion." } },
  cleanup: { title: "Our Cleanup Process", content: { heading: "Job Site Cleanup", body: "We take pride in leaving your property cleaner than we found it:\n\nDURING THE JOB\n• Tarps placed around the perimeter to catch debris\n• Dump trailer on-site for immediate disposal\n• Daily cleanup at the end of each work day\n\nFINAL CLEANUP\n• Complete debris removal from roof and ground\n• Magnetic nail sweep of entire yard and driveway (3 passes minimum)\n• Gutter cleanout\n• Final walkthrough with homeowner\n• Haul-away of all old materials\n\nYour satisfaction with our cleanup is guaranteed." } },
  gutters: { title: "Gutter Services", content: { heading: "Gutter Solutions", body: "Protect your home's foundation with our professional gutter services:\n\nGUTTER INSTALLATION\n• Seamless aluminum gutters custom-fabricated on-site\n• Multiple color options to match your home\n• Proper slope and drainage engineering\n\nGUTTER GUARDS\n• Keep debris out and water flowing\n• Reduce maintenance and cleaning\n• Multiple guard styles available\n\nDOWNSPOUT EXTENSIONS\n• Direct water away from your foundation\n• Underground drainage options\n• Custom routing for your landscape" } },
};
const DEFAULT_TERMS = `CONSTRUCTION AGREEMENT\n\nThis agreement is between Roof USA (Roofus Construction, LLC) and the Customer identified above.\n\n1. SCOPE: Contractor will perform the work described in the Scope of Work slides of this proposal.\n2. PAYMENT: Payment is due upon completion unless otherwise agreed in writing.\n3. WARRANTY: All work is warranted for the period specified by manufacturer guidelines.\n4. CHANGES: Any changes to the scope must be agreed in writing.\n5. INSURANCE: Contractor maintains general liability and workers' compensation insurance.\n6. CANCELLATION: Customer may cancel within 3 business days of signing.\n\nBy signing below, Customer authorizes Roof USA to proceed with the described work at the agreed price.`;
const TIERS = ["good", "better", "best"];
const TIER_LABELS = { good: "Good", better: "Better", best: "Best" };
const TIER_COLORS = { good: "#6B7280", better: "#2563EB", best: "#059669" };

function QuoteBuilder({ user, isA, isM, items }) {
  const [view, setView] = useState("list");
  const [quotes, setQuotes] = useState([]);
  const [q, setQ] = useState(null); // current quote
  const [slides, setSlides] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [asi, setAsiRaw] = useState(0); // active slide index
  const setAsi = (newIdx) => { setAsiRaw(newIdx); };
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [analyticsRange, setAnalyticsRange] = useState("all");

  // JN job search
  const [jnAll, setJnAll] = useState([]);
  const [jnSearch, setJnSearch] = useState("");
  const [showJnDrop, setShowJnDrop] = useState(false);

  // New quote modal
  const [showNew, setShowNew] = useState(false);
  const [nf, setNf] = useState({ customer_name: "", customer_email: "", customer_phone: "", customer_address: "", jn_job_id: "", jn_job_name: "" });

  // Pricing state
  const [margin, setMargin] = useState(35);
  const [tiersEnabled, setTiersEnabled] = useState({ good: true, better: true, best: true });
  const [priceView, setPriceView] = useState("total"); // total, grouped, items

  // Templates
  const [templates, setTemplates] = useState([]);
  const [showSaveTpl, setShowSaveTpl] = useState(false);
  const [tplName, setTplName] = useState("");
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingFor, setRecordingFor] = useState(null); // slide index or "whole"
  const [activity, setActivity] = useState([]);
  const [showActivity, setShowActivity] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [listView, setListView] = useState("quotes"); // quotes, analytics

  useEffect(() => { loadQuotes(); loadJnJobs(); loadTemplates(); }, []);

  async function loadActivity(quoteId) {
    const data = await sbGet("quote_tracking", `quote_id=eq.${quoteId}&order=timestamp.desc`);
    setActivity(data || []);
  }
  async function loadQuestionsForQuote(quoteId) {
    const data = await sbGet("quote_questions", `quote_id=eq.${quoteId}&order=created_at.desc`);
    setQuestions(data || []);
  }
  async function markQuestionAnswered(qId) {
    await sbPatch("quote_questions", qId, { answered: true });
    if (q) await loadQuestionsForQuote(q.id);
  }
  async function extendExpiration(days = 30) {
    if (!q) return;
    const newDate = new Date(Date.now() + days * 86400000).toISOString();
    await sbPatch("quotes", q.id, { expiration_date: newDate });
    setQ({ ...q, expiration_date: newDate });
  }

  async function loadTemplates() {
    const data = await sbGet("quote_templates", "select=*&order=created_at.desc");
    setTemplates(data || []);
  }
  async function saveAsTemplate() {
    if (!tplName.trim() || !q) return;
    const tplSlides = slides.map(s => ({ slide_type: s.slide_type, sort_order: s.sort_order, title: s.title, content: s.content, visible: s.visible }));
    const tplItems = lineItems.map(li => ({ description: li.description, qty: li.qty, unit: li.unit, cost: li.cost, unit_price: li.unit_price, markup: li.markup, category: li.category, tier: li.tier, is_upgrade: li.is_upgrade, item_id: li.item_id, option: li.option }));
    await sbPost("quote_templates", {
      name: tplName, slides: { slides: tplSlides, lineItems: tplItems },
      default_settings: { margin, tiers_enabled: tiersEnabled, price_view: priceView },
      created_by: user?.name || "Unknown",
    });
    setShowSaveTpl(false);
    setTplName("");
    await loadTemplates();
  }
  async function loadFromTemplate(tpl) {
    if (!q) return;
    const tplData = tpl.slides || {};
    const tplSettings = tpl.default_settings || {};
    // Load slides
    const newSlides = (tplData.slides || []).map((s, i) => ({
      quote_id: q.id, slide_type: s.slide_type, sort_order: i,
      title: s.title, content: s.content, visible: s.visible !== false,
    }));
    setSlides(newSlides);
    // Load line items
    const newItems = (tplData.lineItems || []).map(li => ({ ...li }));
    setLineItems(newItems);
    // Load settings
    if (tplSettings.margin != null) setMargin(tplSettings.margin);
    if (tplSettings.tiers_enabled) setTiersEnabled(tplSettings.tiers_enabled);
    if (tplSettings.price_view) setPriceView(tplSettings.price_view);
    setAsi(0);
  }
  async function deleteTemplate(id) {
    await sbDel("quote_templates", id);
    await loadTemplates();
  }

  async function loadJnJobs() {
    try { const r = await fetch("/api/jn?action=jobs"); const d = await r.json(); setJnAll(d.jobs || []); } catch {}
  }
  async function loadQuotes() {
    setLoading(true);
    const data = await sbGet("quotes", "select=*&order=created_at.desc");
    setQuotes(data || []);
    setLoading(false);
  }
  async function openQuote(quote) {
    const sl = await sbGet("quote_slides", `quote_id=eq.${quote.id}&order=sort_order.asc`);
    const liRaw = await sbGet("quote_line_items", `quote_id=eq.${quote.id}&order=sort_order.asc`);
    const li = (liRaw || []).map(r => ({
      ...r, cost: r.unit_cost || 0, unit_price: r.line_total ? r.line_total / (r.qty || 1) : (r.unit_cost || 0) * (1 + (r.margin_pct || 0) / 100),
      markup: r.margin_pct || 0, category: r.section_name || "Other", item_id: r.portal_item_id || null,
    }));
    const uiQuote = { ...quote, customer_address: quote.address || "", jn_job_name: (quote.settings || {}).jn_job_name || "" };
    setQ(uiQuote);
    setSlides(sl || []);
    setLineItems(li || []);
    setAsi(0);
    // Load activity log
    const actData = await sbGet("quote_tracking", `quote_id=eq.${quote.id}&order=timestamp.desc&limit=50`);
    setActivity(actData || []);
    // Load questions
    const quesData = await sbGet("quote_questions", `quote_id=eq.${quote.id}&order=created_at.desc`);
    setQuestions(quesData || []);
    const settings = quote.settings || {};
    setMargin(settings.margin || 35);
    setTiersEnabled(settings.tiers_enabled || { good: true, better: true, best: true });
    setPriceView(settings.price_view || "total");
    setView("edit");
  }
  async function createQuote() {
    if (!nf.customer_name.trim()) return;
    const selectedTpl = nf.template_id ? templates.find(t => t.id === nf.template_id) : null;
    const tplSettings = selectedTpl?.default_settings || {};
    const newQ = {
      customer_name: nf.customer_name,
      customer_email: nf.customer_email,
      customer_phone: nf.customer_phone,
      address: nf.customer_address,
      jn_job_id: nf.jn_job_id,
      status: "draft",
      created_by: user?.name || "Unknown",
      settings: { margin: tplSettings.margin || 35, tiers_enabled: tplSettings.tiers_enabled || { good: true, better: true, best: true }, price_view: tplSettings.price_view || "total", jn_job_name: nf.jn_job_name || "" },
      expiration_date: new Date(Date.now() + 30 * 86400000).toISOString(),
      template_id: nf.template_id || null,
    };
    const result = await sbPost("quotes", newQ);
    if (result && result.length > 0) {
      const created = result[0];
      if (selectedTpl && selectedTpl.slides?.slides) {
        // Create slides from template
        for (const [i, s] of selectedTpl.slides.slides.entries()) {
          await sbPost("quote_slides", { quote_id: created.id, slide_type: s.slide_type, sort_order: i, title: s.title, content: s.content, visible: s.visible !== false });
        }
        // Create line items from template
        if (selectedTpl.slides.lineItems?.length > 0) {
          const tplItems = selectedTpl.slides.lineItems.map(li => ({
            quote_id: created.id, description: li.description || "", qty: li.qty || 1, unit: li.unit || "each",
            unit_cost: li.cost || 0, labor_cost: 0, margin_pct: li.markup || tplSettings.margin || 35,
            line_total: (li.qty || 1) * (li.unit_price || 0), tier: li.tier || "all",
            section_name: li.category || "Other", is_upgrade: li.is_upgrade || false,
            upgrade_price: li.is_upgrade ? (li.unit_price || 0) : null, portal_item_id: li.item_id || null, sort_order: 0,
          }));
          await sbPost("quote_line_items", tplItems);
        }
      } else {
        // Create default slides
        const defaultSlides = [
          { quote_id: created.id, slide_type: "cover", sort_order: 0, title: "Your Roofing Proposal", content: {}, visible: true },
          { quote_id: created.id, slide_type: "scope", sort_order: 1, title: "Scope of Work", content: { sections: [{ name: "Roofing", items: [] }] }, visible: true },
          { quote_id: created.id, slide_type: "pricing", sort_order: 2, title: "Investment Options", content: { terms: "" }, visible: true },
          { quote_id: created.id, slide_type: "signature", sort_order: 3, title: "Authorization", content: { terms: DEFAULT_TERMS }, visible: true },
        ];
        for (const s of defaultSlides) await sbPost("quote_slides", s);
      }
      setShowNew(false);
      setNf({ customer_name: "", customer_email: "", customer_phone: "", customer_address: "", jn_job_id: "", jn_job_name: "", template_id: "" });
      await loadQuotes();
      const fresh = await sbGet("quotes", `id=eq.${created.id}`);
      if (fresh && fresh.length > 0) await openQuote(fresh[0]);
    }
  }
  async function saveAll() {
    if (!q) return;
    setSaving(true);
    // Save quote settings
    await sbPatch("quotes", q.id, {
      customer_name: q.customer_name,
      customer_email: q.customer_email || "",
      customer_phone: q.customer_phone || "",
      address: q.customer_address || "",
      notes: q.notes || "",
      settings: { margin, tiers_enabled: tiersEnabled, price_view: priceView, jn_job_name: q.jn_job_name || "", color_options: q.settings?.color_options || [], introVideo: q.settings?.introVideo || null },
      total_price: tierTotal("best"),
      updated_at: new Date().toISOString(),
    });
    // Save slides
    for (const s of slides) {
      if (s.id) await sbPatch("quote_slides", s.id, { title: s.title, content: s.content, visible: s.visible, sort_order: s.sort_order });
      else { const r = await sbPost("quote_slides", { ...s, quote_id: q.id }); if (r?.[0]) s.id = r[0].id; }
    }
    // Save line items — delete all and re-insert
    await sbDelWhere("quote_line_items", `quote_id=eq.${q.id}`);
    if (lineItems.length > 0) {
      const toInsert = lineItems.map(li => ({
        quote_id: q.id,
        description: li.description || "",
        qty: li.qty || 1,
        unit: li.unit || "each",
        unit_cost: li.cost || 0,
        labor_cost: li.labor_cost || 0,
        margin_pct: li.markup || 0,
        line_total: (li.qty || 1) * (li.unit_price || 0),
        tier: li.tier || "all",
        section_name: li.category || "Other",
        is_upgrade: li.is_upgrade || false,
        upgrade_price: li.is_upgrade ? (li.unit_price || 0) : null,
        portal_item_id: li.item_id || null,
        sort_order: li.sort_idx || 0,
      }));
      await sbPost("quote_line_items", toInsert);
    }
    setSaving(false);
  }
  async function deleteQuote(id) {
    await sbDelWhere("quote_slides", `quote_id=eq.${id}`);
    await sbDelWhere("quote_line_items", `quote_id=eq.${id}`);
    await sbDel("quotes", id);
    await loadQuotes();
  }

  // Send quote via SMS + Email
  const [sending, setSending] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  async function sendQuote() {
    if (!q) return;
    setSending(true);
    setSendResult(null);
    await saveAll(); // save first
    const link = quoteLink;
    const custName = q.customer_name || "Customer";
    const errors = [];
    // Send SMS if phone exists
    if (q.customer_phone) {
      try {
        const r = await fetch("/api/notify?action=sms", { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: q.customer_phone, message: `Hi ${custName}, your roofing proposal from Roof USA is ready! View it here: ${link}` }) });
        if (!r.ok) errors.push("SMS failed");
      } catch { errors.push("SMS failed"); }
    }
    // Send email if email exists
    if (q.customer_email) {
      try {
        const r = await fetch("/api/notify?action=email", { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: q.customer_email, toName: custName, subject: `Your Roofing Proposal from Roof USA`,
            html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px"><h2 style="color:#1B2A4A">Your Roofing Proposal</h2><p>Hi ${custName},</p><p>Thank you for choosing Roof USA! Your personalized roofing proposal is ready for review.</p><a href="${link}" style="display:inline-block;background:#B22234;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;margin:16px 0">View Your Proposal</a><p style="color:#666;font-size:13px">This link will expire in 30 days. If you have any questions, reply to this email or call us.</p><hr style="border:none;border-top:1px solid #eee;margin:24px 0"><p style="font-size:12px;color:#999">Roof USA · Roofus Construction, LLC · Columbia, MO</p></div>` }) });
        if (!r.ok) errors.push("Email failed");
      } catch { errors.push("Email failed"); }
    }
    // Notify Logan via SMS
    try {
      await fetch("/api/notify?action=sms", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: "+15738649965", message: `Quote sent to ${custName}${q.customer_phone ? " (" + q.customer_phone + ")" : ""}. ${link}` }) });
    } catch {}
    // Update status to sent
    await sbPatch("quotes", q.id, { status: "sent", updated_at: new Date().toISOString() });
    setQ({ ...q, status: "sent" });
    await sbPost("quote_tracking", { quote_id: q.id, event_type: "sent", timestamp: new Date().toISOString(), metadata: { phone: !!q.customer_phone, email: !!q.customer_email } });
    setSending(false);
    if (errors.length > 0) setSendResult("Sent with issues: " + errors.join(", "));
    else setSendResult("Sent successfully!");
    setTimeout(() => { setSendResult(null); setShowSend(false); }, 3000);
    await loadQuotes();
  }

  // Duplicate quote
  async function duplicateQuote(srcQuote) {
    const newQ = {
      customer_name: srcQuote.customer_name + " (Copy)",
      customer_email: srcQuote.customer_email || "",
      customer_phone: srcQuote.customer_phone || "",
      address: srcQuote.address || "",
      jn_job_id: srcQuote.jn_job_id || "",
      status: "draft",
      created_by: user?.name || "Unknown",
      settings: { ...(srcQuote.settings || {}), jn_job_name: (srcQuote.settings || {}).jn_job_name || "" },
      expiration_date: new Date(Date.now() + 30 * 86400000).toISOString(),
    };
    const result = await sbPost("quotes", newQ);
    if (result?.[0]) {
      const newId = result[0].id;
      // Copy slides
      const srcSlides = await sbGet("quote_slides", `quote_id=eq.${srcQuote.id}&order=sort_order.asc`);
      for (const s of (srcSlides || [])) {
        await sbPost("quote_slides", { quote_id: newId, slide_type: s.slide_type, sort_order: s.sort_order, title: s.title, content: s.content, visible: s.visible });
      }
      // Copy line items
      const srcItems = await sbGet("quote_line_items", `quote_id=eq.${srcQuote.id}`);
      if (srcItems?.length > 0) {
        await sbPost("quote_line_items", srcItems.map(li => {
          const { id, ...rest } = li;
          return { ...rest, quote_id: newId };
        }));
      }
      await loadQuotes();
    }
  }

  const jnF = jnAll.filter((j) => { if (!jnSearch.trim()) return false; const s = jnSearch.toLowerCase(); return (j.name || "").toLowerCase().includes(s) || (j.address || "").toLowerCase().includes(s); }).slice(0, 6);

  // Helper: add a slide
  const addSlide = (type, preset) => {
    const st = SLIDE_TYPES.find(s => s.type === type);
    let content = {};
    let title = st?.label || type;
    if (type === "scope") content = { sections: [{ name: "Roofing", items: [] }] };
    else if (type === "signature") content = { terms: DEFAULT_TERMS };
    else if (type === "comparison") content = { products: [{ name: "Option A", features: ["Feature 1", "Feature 2"] }, { name: "Option B", features: ["Feature 1", "Feature 2"] }] };
    else if (type === "photos") content = { photos: [], caption: "Here's what we found during our inspection of your roof." };
    else if (type === "valueadd" && preset && VALUEADD_PRESETS[preset]) {
      title = VALUEADD_PRESETS[preset].title;
      content = VALUEADD_PRESETS[preset].content;
    } else if (type === "valueadd") content = { heading: "Page Title", body: "Add your content here..." };
    const newSlide = { quote_id: q?.id, slide_type: type, sort_order: slides.length, title, visible: true, content };
    setSlides([...slides, newSlide]);
    setAsi(slides.length);
  };
  // Video Recording
  const startRecording = async (forSlide) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: "user" }, audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9,opus" });
      const chunks = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunks, { type: "video/webm" });
        const reader = new FileReader();
        reader.onload = () => {
          if (forSlide === "intro") {
            setQ(prev => ({ ...prev, settings: { ...prev.settings, introVideo: reader.result } }));
          } else if (forSlide !== null && forSlide !== undefined) {
            const ns = [...slides];
            ns[forSlide] = { ...ns[forSlide], content: { ...ns[forSlide].content, video: reader.result } };
            setSlides(ns);
          }
        };
        reader.readAsDataURL(blob);
        setRecording(false);
        setMediaRecorder(null);
        setRecordingFor(null);
      };
      mr.start();
      setMediaRecorder(mr);
      setRecording(true);
      setRecordingFor(forSlide);
    } catch (err) { console.error("Camera error:", err); alert("Could not access camera. Please allow camera permissions."); }
  };
  const stopRecording = () => { if (mediaRecorder) mediaRecorder.stop(); };

  const removeSlide = (idx) => {
    const ns = slides.filter((_, i) => i !== idx).map((s, i) => ({ ...s, sort_order: i }));
    setSlides(ns);
    if (asi >= ns.length) setAsi(Math.max(0, ns.length - 1));
  };
  const moveSlide = (idx, dir) => {
    const ni = idx + dir;
    if (ni < 0 || ni >= slides.length) return;
    const ns = [...slides]; [ns[idx], ns[ni]] = [ns[ni], ns[idx]];
    ns.forEach((s, i) => s.sort_order = i);
    setSlides(ns);
    setAsi(ni);
  };

  // ─── LINE ITEM HELPERS ───
  const addLineItem = (item, option, tier = "all", isUpgrade = false, section = "Roofing") => {
    const v = getVariants(item);
    const vData = v[option || "_default"] || { wac: item.wacCost || 0 };
    const cost = vData.wac || item.wacCost || 0;
    const sellPrice = cost * (1 + margin / 100);
    const newLI = {
      quote_id: q?.id,
      description: item.name + (option && option !== "_default" ? ` — ${option}` : ""),
      qty: 1, unit_price: Math.round(sellPrice * 100) / 100, cost: cost,
      markup: margin, category: section || item.category || "Other",
      tier, is_upgrade: isUpgrade, item_id: item.id, option: option || "_default",
      unit: item.unit || "each",
    };
    setLineItems([...lineItems, newLI]);
  };
  const addManualItem = (desc, qty, price, cost, tier = "all", isUpgrade = false, section = "Other") => {
    setLineItems([...lineItems, {
      quote_id: q?.id, description: desc, qty, unit_price: price, cost: cost || 0,
      markup: price > 0 && cost > 0 ? Math.round(((price - cost) / cost) * 100) : 0,
      category: section || "Other", tier, is_upgrade: isUpgrade, unit: "each",
    }]);
  };
  const updateLI = (idx, field, val) => { if (field === "_reorder") { setLineItems(val); return; } const n = [...lineItems]; n[idx] = { ...n[idx], [field]: val }; setLineItems(n); };
  const removeLI = (idx) => setLineItems(lineItems.filter((_, i) => i !== idx));

  // Calculate tier totals
  const tierTotal = (tier) => {
    return lineItems
      .filter(li => !li.is_upgrade && (li.tier === "all" || TIERS.indexOf(li.tier) <= TIERS.indexOf(tier)))
      .reduce((s, li) => s + (li.qty || 1) * (li.unit_price || 0), 0);
  };
  const upgradesTotal = lineItems.filter(li => li.is_upgrade).reduce((s, li) => s + (li.qty || 1) * (li.unit_price || 0), 0);
  const totalCost = lineItems.filter(li => !li.is_upgrade).reduce((s, li) => s + (li.qty || 1) * (li.cost || 0), 0);

  // Adjust all prices when margin slider changes
  const adjustMargin = (newMargin) => {
    setMargin(newMargin);
    setLineItems(lineItems.map(li => ({
      ...li,
      unit_price: li.cost > 0 ? Math.round(li.cost * (1 + newMargin / 100) * 100) / 100 : li.unit_price,
      markup: newMargin,
    })));
  };

  const quoteLink = q ? `${QUOTE_BASE_URL}/quote/${q.id}` : "";

  // ═══ LIST VIEW ═══
  if (view === "list") {
    const filtered = quotes.filter(qt => {
      if (statusFilter !== "all" && qt.status !== statusFilter) return false;
      const jnName = (qt.settings || {}).jn_job_name || "";
      if (search && !qt.customer_name?.toLowerCase().includes(search.toLowerCase()) && !jnName.toLowerCase().includes(search.toLowerCase()) && !(qt.address || "").toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "oldest") return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "name") return (a.customer_name || "").localeCompare(b.customer_name || "");
      if (sortBy === "value_high") return (b.total_price || 0) - (a.total_price || 0);
      if (sortBy === "value_low") return (a.total_price || 0) - (b.total_price || 0);
      return 0;
    });
    const draftCt = quotes.filter(q => q.status === "draft").length;
    const sentCt = quotes.filter(q => q.status === "sent").length;
    const viewedCt = quotes.filter(q => q.status === "viewed").length;
    const signedCt = quotes.filter(q => q.status === "signed").length;
    const signedTotal = quotes.filter(q => q.status === "signed").reduce((s, q) => s + (q.total_price || 0), 0);
    const closeRate = (sentCt + signedCt) > 0 ? Math.round(signedCt / (sentCt + signedCt + viewedCt) * 100) : 0;
    const avgQuoteValue = signedCt > 0 ? signedTotal / signedCt : 0;

    // Analytics: revenue by month
    const revenueByMonth = {};
    quotes.filter(q => q.status === "signed" && q.created_at).forEach(q => {
      const m = new Date(q.created_at).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      revenueByMonth[m] = (revenueByMonth[m] || 0) + (q.total_price || 0);
    });
    const revenueData = Object.entries(revenueByMonth).map(([m, v]) => ({ month: m, revenue: v })).slice(-12);

    return (
      <div className="fu">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, fontFamily: BC }}>Quotes</h2>
            <div style={{ display: "flex", gap: 4, background: C.sf, borderRadius: 8, padding: 3 }}>
              <button onClick={() => setListView("quotes")} style={{ border: "none", padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", background: listView === "quotes" ? C.card : "transparent", color: listView === "quotes" ? C.txt : C.t2, boxShadow: listView === "quotes" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>Quotes</button>
              <button onClick={() => setListView("analytics")} style={{ border: "none", padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", background: listView === "analytics" ? C.card : "transparent", color: listView === "analytics" ? C.txt : C.t2, boxShadow: listView === "analytics" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>Analytics</button>
            </div>
          </div>
          <button onClick={() => setShowNew(true)} style={{ ...bP, borderRadius: 12, padding: "12px 20px" }}><Plus size={16} /> New Quote</button>
        </div>

        {/* Analytics View */}
        {listView === "analytics" && quotes.length > 0 && (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <Stat label="Close Rate" value={`${closeRate}%`} sub={`${signedCt} signed of ${sentCt + signedCt + viewedCt} sent`} color={closeRate >= 50 ? C.grn : C.wrn} />
              <Stat label="Avg Quote Value" value={fmt$(avgQuoteValue)} sub={`${signedCt} signed quotes`} color={C.grn} />
              <Stat label="Total Revenue" value={fmt$(signedTotal)} sub="From signed quotes" color={C.grn} />
              <Stat label="Active Quotes" value={sentCt + viewedCt} sub={`${sentCt} sent · ${viewedCt} viewed`} color="#2563EB" />
            </div>
            {revenueData.length > 1 && <div style={{ ...crd, borderRadius: 14, padding: 20, marginBottom: 16 }}>
              <div style={{ ...lbl, marginBottom: 12 }}>Revenue by Month</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={revenueData}><CartesianGrid strokeDasharray="3 3" stroke={C.brd} /><XAxis dataKey="month" tick={{ fontSize: 11, fill: C.t2 }} /><YAxis tick={{ fontSize: 11, fill: C.t2 }} tickFormatter={v => "$" + (v / 1000).toFixed(0) + "k"} /><Tooltip formatter={v => fmt$(v)} /><Bar dataKey="revenue" fill={C.grn} radius={[4, 4, 0, 0]} /></BarChart>
              </ResponsiveContainer>
            </div>}
            {/* Recent Activity */}
            <div style={{ ...crd, borderRadius: 14, padding: 20 }}>
              <div style={{ ...lbl, marginBottom: 12 }}>Recent Quote Activity</div>
              {quotes.slice(0, 15).map(qt => {
                const sc = { draft: C.wrn, sent: "#2563EB", viewed: "#7C3AED", signed: C.grn }[qt.status] || C.t2;
                return <div key={qt.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.brd}`, cursor: "pointer" }} onClick={() => openQuote(qt)}>
                  <div><span style={{ fontWeight: 700, fontSize: 13 }}>{qt.customer_name}</span><span style={{ fontSize: 11, color: C.t2, marginLeft: 8 }}>{fD(qt.created_at)}</span></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {qt.total_price > 0 && <span style={{ fontFamily: MN, fontSize: 12, fontWeight: 700 }}>{fmt$(qt.total_price)}</span>}
                    <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase", background: sc + "18", color: sc }}>{qt.status}</span>
                  </div>
                </div>;
              })}
            </div>
          </div>
        )}

        {listView === "quotes" && <>
        {/* Stats */}
        {quotes.length > 0 && <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ ...crd, flex: "1 1 120px", minWidth: 100, padding: 14, borderRadius: 12, cursor: "pointer", background: statusFilter === "draft" ? C.sf : C.card }} onClick={() => setStatusFilter(statusFilter === "draft" ? "all" : "draft")}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.wrn, textTransform: "uppercase" }}>Drafts</div>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: MN }}>{draftCt}</div>
          </div>
          <div style={{ ...crd, flex: "1 1 120px", minWidth: 100, padding: 14, borderRadius: 12, cursor: "pointer", background: statusFilter === "sent" ? C.sf : C.card }} onClick={() => setStatusFilter(statusFilter === "sent" ? "all" : "sent")}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#2563EB", textTransform: "uppercase" }}>Sent</div>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: MN }}>{sentCt}</div>
          </div>
          <div style={{ ...crd, flex: "1 1 120px", minWidth: 100, padding: 14, borderRadius: 12, cursor: "pointer", background: statusFilter === "viewed" ? C.sf : C.card }} onClick={() => setStatusFilter(statusFilter === "viewed" ? "all" : "viewed")}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#7C3AED", textTransform: "uppercase" }}>Viewed</div>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: MN }}>{viewedCt}</div>
          </div>
          <div style={{ ...crd, flex: "1 1 120px", minWidth: 100, padding: 14, borderRadius: 12, cursor: "pointer", background: statusFilter === "signed" ? C.sf : C.card }} onClick={() => setStatusFilter(statusFilter === "signed" ? "all" : "signed")}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.grn, textTransform: "uppercase" }}>Signed</div>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: MN }}>{signedCt}</div>
            {signedTotal > 0 && <div style={{ fontSize: 10, color: C.grn, marginTop: 2 }}>{fmt$(signedTotal)}</div>}
          </div>
        </div>}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: 12, color: C.t2 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search quotes..." style={{ ...inp, paddingLeft: 34, borderRadius: 10 }} />
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...bS, borderRadius: 10, padding: "8px 14px", fontSize: 12, appearance: "auto", cursor: "pointer" }}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name">Name A→Z</option>
            <option value="value_high">Highest Value</option>
            <option value="value_low">Lowest Value</option>
          </select>
        </div>
        {loading ? <div style={{ textAlign: "center", padding: 40, color: C.t2 }}>Loading quotes...</div> :
          filtered.length === 0 ? <Empty msg={quotes.length === 0 ? "No quotes yet. Create your first quote!" : "No quotes match this filter."} /> :
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(qt => {
              const statusColors = { draft: { bg: "#E6A81722", c: C.wrn }, sent: { bg: "#2563EB22", c: "#2563EB" }, viewed: { bg: "#7C3AED22", c: "#7C3AED" }, signed: { bg: "#27AE6022", c: C.grn } };
              const sc = statusColors[qt.status] || statusColors.draft;
              const daysLeft = qt.expiration_date ? Math.ceil((new Date(qt.expiration_date) - new Date()) / 86400000) : null;
              const expired = daysLeft !== null && daysLeft <= 0 && qt.status !== "signed";
              return (
                <div key={qt.id} style={{ ...crd, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", borderRadius: 14, gap: 12, flexWrap: "wrap", opacity: expired ? 0.6 : 1 }} onClick={() => openQuote(qt)}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{qt.customer_name || "Untitled"} {expired && <span style={{ fontSize: 10, color: C.red, fontWeight: 700 }}>EXPIRED</span>}</div>
                    <div style={{ fontSize: 12, color: C.t2, marginTop: 2 }}>
                      {(qt.settings || {}).jn_job_name || qt.address || "No job linked"} · {fD(qt.created_at)} · {qt.created_by || ""}
                      {daysLeft !== null && daysLeft > 0 && daysLeft <= 7 && qt.status !== "signed" && <span style={{ color: C.wrn, marginLeft: 8 }}>· {daysLeft}d left</span>}
                      {qt.status === "viewed" && <span style={{ color: "#7C3AED", marginLeft: 8 }}>· Ready to follow up</span>}
                    </div>
                  </div>
                  {qt.total_price > 0 && <div style={{ fontFamily: MN, fontWeight: 800, fontSize: 16, color: qt.status === "signed" ? C.grn : C.txt, marginRight: 12 }}>{fmt$(qt.total_price)}</div>}
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", background: sc.bg, color: sc.c }}>{qt.status}</span>
                    <button onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(`${QUOTE_BASE_URL}/quote/${qt.id}`).then(() => alert("Link copied!")); }} title="Copy Link" style={{ ...bS, padding: "5px 8px", borderRadius: 6 }}><Copy size={12} /></button>
                    <button onClick={e => { e.stopPropagation(); duplicateQuote(qt); }} title="Duplicate" style={{ ...bS, padding: "5px 8px", borderRadius: 6 }}><Layers size={12} /></button>
                    <button onClick={e => { e.stopPropagation(); if (confirm("Delete this quote?")) deleteQuote(qt.id); }} title="Delete" style={{ ...bS, padding: "5px 8px", borderRadius: 6 }}><Trash2 size={12} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        }
        </>}
        {/* New Quote Modal */}
        <Modal open={showNew} onClose={() => setShowNew(false)} title="New Quote" wide>
          <Fld label="Customer Name *"><input value={nf.customer_name} onChange={e => setNf({ ...nf, customer_name: e.target.value })} style={{ ...inp, borderRadius: 10 }} placeholder="Customer name..." /></Fld>
          <Rw>
            <Cl><Fld label="Email"><input value={nf.customer_email} onChange={e => setNf({ ...nf, customer_email: e.target.value })} style={{ ...inp, borderRadius: 10 }} placeholder="Email..." /></Fld></Cl>
            <Cl><Fld label="Phone"><input value={nf.customer_phone} onChange={e => setNf({ ...nf, customer_phone: e.target.value })} style={{ ...inp, borderRadius: 10 }} placeholder="Phone..." /></Fld></Cl>
          </Rw>
          <Fld label="Address"><input value={nf.customer_address} onChange={e => setNf({ ...nf, customer_address: e.target.value })} style={{ ...inp, borderRadius: 10 }} placeholder="Property address..." /></Fld>
          <Fld label="Link to JobNimbus Job (optional)">
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 12, top: 13, color: C.t2 }} />
              <input value={jnSearch} onChange={e => { setJnSearch(e.target.value); setShowJnDrop(true); }} onFocus={() => setShowJnDrop(true)} onBlur={() => setTimeout(() => setShowJnDrop(false), 200)} placeholder="Search JobNimbus..." style={{ ...inp, paddingLeft: 34, borderRadius: 12 }} autoComplete="off" />
              {showJnDrop && jnSearch.trim() && <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 200, background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 12, boxShadow: "0 12px 40px rgba(0,0,0,0.15)", maxHeight: 200, overflow: "auto", marginTop: 4 }}>
                {jnF.length === 0 ? <div style={{ padding: 16, color: C.t2, fontSize: 13 }}>No jobs found</div> : jnF.map(j => (
                  <button key={j.id} onMouseDown={() => { setNf({ ...nf, jn_job_id: j.id, jn_job_name: j.name || "", customer_name: nf.customer_name || j.name || "", customer_address: nf.customer_address || j.address || "" }); setJnSearch(j.name || ""); setShowJnDrop(false); }}
                    style={{ display: "block", width: "100%", padding: "10px 14px", border: "none", background: "transparent", cursor: "pointer", textAlign: "left", borderBottom: `1px solid ${C.brd}` }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{j.name || "—"}</div>
                    <div style={{ fontSize: 11, color: C.t2 }}>{j.address || "No address"}</div>
                  </button>
                ))}
              </div>}
            </div>
            {nf.jn_job_id && <div style={{ marginTop: 6, fontSize: 11, color: C.grn }}><Check size={12} /> Linked to: {nf.jn_job_name}</div>}
          </Fld>
          {templates.length > 0 && <Fld label="Start from Template (optional)">
            <select value={nf.template_id || ""} onChange={e => setNf({ ...nf, template_id: e.target.value })} style={{ ...inp, borderRadius: 10, cursor: "pointer" }}>
              <option value="">Blank Quote</option>
              {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </Fld>}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
            <button onClick={() => setShowNew(false)} style={bS}>Cancel</button>
            <button onClick={createQuote} style={{ ...bP, borderRadius: 10 }} disabled={!nf.customer_name.trim()}><Plus size={14} /> Create Quote</button>
          </div>
        </Modal>
      </div>
    );
  }

  // ═══ ANALYTICS VIEW ═══
  if (view === "analytics") {

    const closeRate = sent.length > 0 ? Math.round((signed.length / sent.length) * 100) : 0;
    const avgValue = signed.length > 0 ? signed.reduce((s, q) => s + (q.total_price || 0), 0) / signed.length : 0;
    const totalRevenue = signed.reduce((s, q) => s + (q.total_price || 0), 0);
    const thisMonth = quotes.filter(q => q.status === "signed" && new Date(q.updated_at || q.created_at).getMonth() === new Date().getMonth() && new Date(q.updated_at || q.created_at).getFullYear() === new Date().getFullYear());
    const monthRevenue = thisMonth.reduce((s, q) => s + (q.total_price || 0), 0);
    // Quotes by month
    const byMonth = {};
    rangedQuotes.forEach(q => {
      const d = new Date(q.created_at);
      const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      if (!byMonth[key]) byMonth[key] = { created: 0, signed: 0, revenue: 0 };
      byMonth[key].created++;
      if (q.status === "signed") { byMonth[key].signed++; byMonth[key].revenue += q.total_price || 0; }
    });
    const chartData = Object.entries(byMonth).slice(-6).map(([k, v]) => ({ month: k, Quotes: v.created, Signed: v.signed, Revenue: v.revenue }));
    // Date range filter
    const rangeFilter = (q) => {
      if (analyticsRange === "all") return true;
      const d = new Date(q.created_at);
      const now = new Date();
      if (analyticsRange === "30") return (now - d) / 86400000 <= 30;
      if (analyticsRange === "90") return (now - d) / 86400000 <= 90;
      if (analyticsRange === "year") return d.getFullYear() === now.getFullYear();
      return true;
    };
    const rangedQuotes = quotes.filter(rangeFilter);
    const signed = rangedQuotes.filter(q => q.status === "signed");
    const sent = rangedQuotes.filter(q => q.status === "sent" || q.status === "viewed" || q.status === "signed");
    const pipeline = rangedQuotes.filter(q => q.status === "sent" || q.status === "viewed");
    const pipelineValue = pipeline.reduce((s, q) => s + (q.total_price || 0), 0);
    const avgDaysToSign = signed.length > 0 ? Math.round(signed.reduce((s, q) => { const created = new Date(q.created_at); const updated = new Date(q.updated_at || q.created_at); return s + (updated - created) / 86400000; }, 0) / signed.length) : 0;
    return (
      <div className="fu">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, fontFamily: BC }}>Quote Analytics</h2>
          <button onClick={() => setView("list")} style={{ ...bS, borderRadius: 10, padding: "8px 14px" }}><ArrowLeft size={14} /> Back</button>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {[{ k: "30", l: "30 Days" }, { k: "90", l: "90 Days" }, { k: "year", l: "This Year" }, { k: "all", l: "All Time" }].map(r => (
            <button key={r.k} onClick={() => setAnalyticsRange(r.k)} style={{ ...bS, borderRadius: 8, padding: "6px 14px", fontSize: 11, background: analyticsRange === r.k ? C.ac + "15" : "transparent", color: analyticsRange === r.k ? C.ac : C.t2, borderColor: analyticsRange === r.k ? C.ac + "40" : C.brd }}>{r.l}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <Stat label="Close Rate" value={`${closeRate}%`} sub={`${signed.length} of ${sent.length} sent`} color={closeRate >= 50 ? C.grn : closeRate >= 25 ? C.wrn : C.red} />
          <Stat label="Avg Quote Value" value={fmt$(avgValue)} sub={`${signed.length} signed quotes`} />
          <Stat label="Total Revenue" value={fmt$(totalRevenue)} sub="All time signed" color={C.grn} />
          <Stat label="This Month" value={fmt$(monthRevenue)} sub={`${thisMonth.length} signed`} color={C.blu} />
          <Stat label="Pipeline" value={fmt$(pipelineValue)} sub={`${pipeline.length} open quotes`} color="#7C3AED" />
          <Stat label="Avg Days to Sign" value={`${avgDaysToSign}d`} sub="From created to signed" />
        </div>
        {chartData.length > 0 && <div style={{ ...crd, borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={lbl}>Quotes by Month</div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#eee" /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Legend /><Bar dataKey="Quotes" fill={C.blu} radius={[4,4,0,0]} /><Bar dataKey="Signed" fill={C.grn} radius={[4,4,0,0]} /></BarChart>
          </ResponsiveContainer>
        </div>}
        {/* Pipeline & Insights */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ ...crd, borderRadius: 14, padding: 16, flex: 1, minWidth: 250 }}>
            <div style={lbl}>Quote Status Breakdown</div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              {[{ s: "draft", c: C.wrn, l: "Draft" }, { s: "sent", c: "#2563EB", l: "Sent" }, { s: "viewed", c: "#7C3AED", l: "Viewed" }, { s: "signed", c: C.grn, l: "Signed" }].map(st => {
                const ct = rangedQuotes.filter(q => q.status === st.s).length;
                const pct = rangedQuotes.length > 0 ? Math.round(ct / rangedQuotes.length * 100) : 0;
                return <div key={st.s} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ height: 60, display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: 4 }}>
                    <div style={{ width: 24, height: `${Math.max(4, pct)}%`, background: st.c, borderRadius: "4px 4px 0 0" }} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: st.c }}>{ct}</div>
                  <div style={{ fontSize: 9, color: C.t2 }}>{st.l}</div>
                </div>;
              })}
            </div>
          </div>
          <div style={{ ...crd, borderRadius: 14, padding: 16, flex: 1, minWidth: 250 }}>
            <div style={lbl}>Conversion Funnel</div>
            {[{ l: "Created", ct: rangedQuotes.length, c: C.t2 }, { l: "Sent", ct: sent.length, c: "#2563EB" }, { l: "Viewed", ct: rangedQuotes.filter(q => q.status === "viewed" || q.status === "signed").length, c: "#7C3AED" }, { l: "Signed", ct: signed.length, c: C.grn }].map((step, i) => {
              const pct = rangedQuotes.length > 0 ? Math.round(step.ct / rangedQuotes.length * 100) : 0;
              return <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}><span style={{ fontWeight: 600 }}>{step.l}</span><span style={{ color: C.t2 }}>{step.ct} ({pct}%)</span></div>
                <div style={{ height: 6, background: "#f0f0f0", borderRadius: 3 }}><div style={{ height: "100%", width: `${pct}%`, background: step.c, borderRadius: 3, transition: "width .3s" }} /></div>
              </div>;
            })}
          </div>
        </div>

        {/* Recent signed quotes */}
        <div style={{ ...crd, borderRadius: 14, padding: 16 }}>
          <div style={lbl}>Recently Signed</div>
          {signed.length === 0 ? <div style={{ color: C.t2, fontSize: 13, padding: 16, textAlign: "center" }}>No signed quotes yet</div> :
            signed.slice(0, 10).map(qt => (
              <div key={qt.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.brd}` }}>
                <div><div style={{ fontWeight: 700, fontSize: 13 }}>{qt.customer_name}</div><div style={{ fontSize: 11, color: C.t2 }}>{fD(qt.updated_at || qt.created_at)}</div></div>
                <div style={{ fontFamily: MN, fontWeight: 800, color: C.grn }}>{fmt$(qt.total_price || 0)}</div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  // ═══ EDIT VIEW ═══
  if (view === "edit" && q) {
    const activeSlide = slides[asi];
    const isSigned = q.status === "signed";
    // Generate downloadable quote HTML
    const downloadQuoteHTML = () => {
      const tierItems = lineItems.filter(li => !li.is_upgrade && (li.tier === "all" || TIERS.indexOf(li.tier) <= TIERS.indexOf("best")));
      const upgrades = lineItems.filter(li => li.is_upgrade);
      const rows = tierItems.map(li => `<tr><td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:13px">${li.description}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center;font-size:13px">${li.qty}</td><td style="padding:8px 10px;border-bottom:1px solid #eee;text-align:right;font-weight:600;font-size:13px">${fmt$(li.qty * li.unit_price)}</td></tr>`).join("");
      const upRows = upgrades.length > 0 ? `<tr><td colspan="3" style="padding:12px 10px 6px;font-weight:800;font-size:12px;color:#D4870E;text-transform:uppercase;border-bottom:2px solid #F59E0B30">Optional Upgrades</td></tr>` + upgrades.map(li => `<tr><td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:13px">${li.description}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center;font-size:13px">${li.qty}</td><td style="padding:8px 10px;border-bottom:1px solid #eee;text-align:right;font-size:13px">${fmt$(li.qty * li.unit_price)}</td></tr>`).join("") : "";
      const tierSection = TIERS.filter(t => tiersEnabled[t]).map(t => `<div style="flex:1;min-width:150px;padding:16px;border:2px solid ${TIER_COLORS[t]};border-radius:10px;text-align:center"><div style="font-size:12px;font-weight:800;color:${TIER_COLORS[t]};text-transform:uppercase;margin-bottom:4px">${TIER_LABELS[t]}</div><div style="font-size:24px;font-weight:900;font-family:monospace">${fmt$(tierTotal(t))}</div></div>`).join("");
      // Include scope sections and value-add content
      const scopeSections = {};
      tierItems.forEach(li => { const s = li.category || "Other"; if (!scopeSections[s]) scopeSections[s] = []; scopeSections[s].push(li); });
      const scopeHTML = Object.entries(scopeSections).map(([sec, items]) => `<div style="margin-bottom:16px"><div style="font-weight:800;font-size:12px;color:#1B2A4A;text-transform:uppercase;padding:6px 0;border-bottom:2px solid #1B2A4A20">${sec}</div>${items.map(li => `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f0f0f0"><span>${li.description}</span><span style="font-weight:600">${li.qty} × ${fmt$(li.unit_price)} = ${fmt$(li.qty * li.unit_price)}</span></div>`).join("")}</div>`).join("");
      const valueAddSlides = slides.filter(s => s.slide_type === "valueadd" && s.visible !== false);
      const valueAddHTML = valueAddSlides.map(s => `<div style="margin-top:24px;padding:16px;background:#f8f9fa;border-radius:8px;page-break-inside:avoid"><h3 style="color:#1B2A4A;margin-bottom:8px">${s.content?.heading || s.title}</h3><pre style="font-family:Helvetica,sans-serif;white-space:pre-wrap;font-size:11px;line-height:1.6;color:#444">${s.content?.body || ""}</pre></div>`).join("");
      const html = `<!DOCTYPE html><html><head><title>Quote - ${q.customer_name}</title><style>*{box-sizing:border-box;margin:0;padding:0;font-family:Helvetica,Arial,sans-serif}body{padding:40px;color:#1a1a1a;font-size:13px;max-width:800px;margin:0 auto}table{width:100%;border-collapse:collapse}th{text-align:left;padding:8px 10px;border-bottom:2px solid #1B2A4A;font-size:10px;text-transform:uppercase;color:#666}@media print{body{padding:20px}}</style></head><body>` +
        `<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid #B22234"><div><div style="font-size:28px;font-weight:900;letter-spacing:-0.02em">ROOF<span style="color:#B22234">USA</span></div><div style="font-size:11px;color:#666;margin-top:2px">Roofus Construction, LLC · Columbia, MO</div></div><div style="text-align:right"><div style="font-weight:800;font-size:14px;color:#1B2A4A">QUOTE</div><div style="font-size:11px;color:#666;margin-top:4px">${fD(q.created_at)}</div><div style="margin-top:4px"><span style="display:inline-block;padding:2px 8px;border-radius:3px;font-size:9px;font-weight:700;text-transform:uppercase;background:${isSigned ? "#d4edda" : "#fff3cd"};color:${isSigned ? "#155724" : "#856404"}">${q.status?.toUpperCase() || "DRAFT"}</span></div></div></div>` +
        `<div style="margin-bottom:20px;font-size:13px"><strong>Customer:</strong> ${q.customer_name}<br><strong>Address:</strong> ${q.customer_address || "—"}<br>${q.customer_email ? `<strong>Email:</strong> ${q.customer_email}<br>` : ""}${q.customer_phone ? `<strong>Phone:</strong> ${q.customer_phone}<br>` : ""}</div>` +
        `<div style="display:flex;gap:12px;margin-bottom:24px">${tierSection}</div>` +
        `<h3 style="color:#1B2A4A;margin:20px 0 10px;font-size:14px">SCOPE OF WORK</h3>` +
        `${scopeHTML}` +
        (upRows ? `<h3 style="color:#D4870E;margin:20px 0 10px;font-size:14px">OPTIONAL UPGRADES</h3><table><thead><tr><th>Description</th><th style="text-align:center;width:60px">Qty</th><th style="text-align:right;width:100px">Amount</th></tr></thead><tbody>${upRows}</tbody></table>` : "") +
        `${valueAddHTML}` +
        (isSigned && q.settings?.signature ? `<div style="margin-top:30px;padding:20px;border:2px solid #1B2A4A;border-radius:8px"><div style="font-size:11px;color:#666;text-transform:uppercase;margin-bottom:8px">Electronic Signature</div><div style="font-family:cursive;font-size:28px;color:#1B2A4A;margin-bottom:8px">${q.settings.signature.name}</div><div style="font-size:10px;color:#999">Signed: ${fD(q.settings.signature.timestamp)} · Total: ${fmt$(q.settings.signature.total || 0)}</div></div>` : "") +
        `<div style="margin-top:30px;text-align:center;font-size:9px;color:#bbb">Roof USA · Roofus Construction, LLC · Columbia, MO</div></body></html>`;
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `Quote - ${q.customer_name.replace(/[^a-zA-Z0-9-_ ]/g, "")}.html`;
      document.body.appendChild(a); a.click(); setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
    };
    return (
      <div className="fu">
        {/* Editor Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={async () => { await saveAll(); await loadQuotes(); setView("list"); }} style={{ ...bS, padding: "8px 12px", borderRadius: 10 }}><ArrowLeft size={16} /></button>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 900, fontFamily: BC }}>{q.customer_name}</h2>
              <div style={{ fontSize: 11, color: C.t2 }}>{q.jn_job_name || q.customer_address || "No job linked"} · {slides.length} slides · {lineItems.length} items{tierTotal("best") > 0 ? ` · ${fmt$(tierTotal("best"))}` : ""}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            {q.status && <select value={q.status} onChange={async e => { const ns = e.target.value; await sbPatch("quotes", q.id, { status: ns }); setQ({ ...q, status: ns }); await loadQuotes(); }} style={{ fontSize: 10, fontWeight: 800, padding: "5px 10px", borderRadius: 6, textTransform: "uppercase", background: q.status === "signed" ? "#27AE6022" : q.status === "sent" ? "#2563EB22" : q.status === "viewed" ? "#7C3AED22" : "#E6A81722", color: q.status === "signed" ? C.grn : q.status === "sent" ? "#2563EB" : q.status === "viewed" ? "#7C3AED" : C.wrn, border: "none", cursor: "pointer", appearance: "auto" }}>
              <option value="draft">Draft</option><option value="sent">Sent</option><option value="viewed">Viewed</option><option value="signed">Signed</option>
            </select>}
            <button onClick={downloadQuoteHTML} style={{ ...bS, borderRadius: 10, padding: "8px 12px", fontSize: 12 }}><Download size={14} /></button>
            <button onClick={() => navigator.clipboard.writeText(quoteLink).then(() => alert("Quote link copied!\n\n" + quoteLink))} style={{ ...bS, borderRadius: 10, padding: "8px 12px", fontSize: 12 }}><Copy size={14} /></button>
            <button onClick={() => setView("preview")} style={{ ...bS, borderRadius: 10, padding: "8px 12px", fontSize: 12 }}><Eye size={14} /></button>
            <button onClick={() => setShowSend(true)} style={{ ...bP, borderRadius: 10, padding: "8px 14px", fontSize: 12, background: "#2563EB" }}><Send size={14} /> {q.status === "sent" || q.status === "viewed" ? "Resend" : "Send"}</button>
            {(q.status === "sent" || q.status === "viewed") && q.customer_phone && <button onClick={async () => {
              try { await fetch("/api/notify?action=sms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: q.customer_phone, message: `Hi ${q.customer_name}, just following up on your roofing proposal from Roof USA. You can view it anytime here: ${quoteLink}` }) }); alert("Follow-up sent!"); } catch { alert("Failed to send"); }
            }} style={{ ...bS, borderRadius: 10, padding: "8px 12px", fontSize: 11, color: "#7C3AED", borderColor: "#7C3AED40" }}>📱 Follow Up</button>}
            <button onClick={saveAll} style={{ ...bP, borderRadius: 10, padding: "8px 14px", fontSize: 12 }} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          </div>
        </div>

        {/* Send Quote Modal */}
        <Modal open={showSend} onClose={() => setShowSend(false)} title="Send Quote">
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Send proposal to {q.customer_name}:</div>
            {q.customer_phone && <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: C.sf, borderRadius: 10, marginBottom: 8 }}><span style={{ fontSize: 18 }}>📱</span><div><div style={{ fontSize: 12, fontWeight: 700 }}>SMS</div><div style={{ fontSize: 13 }}>{q.customer_phone}</div></div></div>}
            {q.customer_email && <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: C.sf, borderRadius: 10, marginBottom: 8 }}><span style={{ fontSize: 18 }}>📧</span><div><div style={{ fontSize: 12, fontWeight: 700 }}>Email</div><div style={{ fontSize: 13 }}>{q.customer_email}</div></div></div>}
            {!q.customer_phone && !q.customer_email && <div style={{ padding: 16, textAlign: "center", color: C.wrn, background: "#FEF3C7", borderRadius: 10, fontSize: 13 }}>No phone or email on file. Add contact info in the Cover slide first.</div>}
            <div style={{ padding: "10px 14px", background: "#EEF6FF", borderRadius: 10, marginTop: 8 }}><div style={{ fontSize: 11, fontWeight: 700, color: "#2563EB" }}>CUSTOMER LINK</div><div style={{ fontSize: 12, fontFamily: MN, wordBreak: "break-all", marginTop: 4 }}>{quoteLink}</div></div>
          </div>
          {sendResult && <div style={{ padding: 12, borderRadius: 10, background: sendResult.includes("issue") ? "#FEF3C7" : "#D1FAE5", color: sendResult.includes("issue") ? C.wrn : C.grn, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{sendResult}</div>}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setShowSend(false)} style={bS}>Cancel</button>
            <button onClick={sendQuote} disabled={sending || (!q.customer_phone && !q.customer_email)} style={{ ...bP, borderRadius: 10, background: "#2563EB", opacity: (!q.customer_phone && !q.customer_email) ? 0.5 : 1 }}>{sending ? "Sending..." : "Send Quote"}</button>
          </div>
        </Modal>

        {/* Signed Quote Banner */}
        {q.status === "signed" && <div style={{ padding: "12px 16px", background: "#D1FAE5", borderRadius: 12, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <div><div style={{ fontWeight: 800, color: C.grn, fontSize: 14 }}>This quote has been signed</div>
          <div style={{ fontSize: 12, color: "#166534" }}>Signed by {(q.settings?.signature?.name) || "customer"} on {q.settings?.signature?.timestamp ? fD(q.settings.signature.timestamp) : "—"} · {fmt$(q.total_price || q.settings?.signature?.total || 0)}</div></div>
        </div>}

        {/* Quick Actions Bar */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={() => { setShowActivity(!showActivity); setShowQuestions(false); }} style={{ ...bS, borderRadius: 8, padding: "6px 12px", fontSize: 11, background: showActivity ? C.sf : "transparent" }}><Clock size={12} /> Activity ({activity.length})</button>
          <button onClick={() => { setShowQuestions(!showQuestions); setShowActivity(false); }} style={{ ...bS, borderRadius: 8, padding: "6px 12px", fontSize: 11, background: showQuestions ? C.sf : "transparent", color: questions.filter(x => !x.answered).length > 0 ? C.ac : C.t2, borderColor: questions.filter(x => !x.answered).length > 0 ? C.ac + "40" : C.brd }}>❓ Questions {questions.filter(x => !x.answered).length > 0 && <span style={{ background: C.red, color: "#fff", fontSize: 9, fontWeight: 800, borderRadius: 8, padding: "1px 5px", marginLeft: 4 }}>{questions.filter(x => !x.answered).length}</span>}</button>
          {q.expiration_date && <span style={{ fontSize: 10, color: C.t2, marginLeft: 4 }}>Expires: {fD(q.expiration_date)} <button onClick={() => extendExpiration(30)} style={{ background: "none", border: "none", color: "#2563EB", cursor: "pointer", fontSize: 10, fontWeight: 700, textDecoration: "underline" }}>+30 days</button></span>}
        </div>

        {/* Activity Log Panel */}
        {showActivity && <div style={{ ...crd, borderRadius: 12, marginBottom: 16, maxHeight: 300, overflow: "auto" }}>
          <div style={{ ...lbl, marginBottom: 8 }}>Activity Log</div>
          {activity.length === 0 ? <div style={{ color: C.t2, fontSize: 12 }}>No activity yet</div> :
            activity.map((a, i) => {
              const icons = { opened: "👀", signed: "✍️", sent: "📤", created: "📝" };
              return <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < activity.length - 1 ? `1px solid ${C.brd}` : "none" }}>
                <span style={{ fontSize: 14 }}>{icons[a.event_type] || "📌"}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{a.event_type}</span>
                  {a.user_agent && <span style={{ fontSize: 10, color: C.t2, marginLeft: 8 }}>{a.user_agent.includes("Mobile") ? "📱 Mobile" : "💻 Desktop"}</span>}
                </div>
                <span style={{ fontSize: 10, color: C.t2 }}>{a.timestamp ? new Date(a.timestamp).toLocaleString() : "—"}</span>
              </div>;
            })
          }
        </div>}

        {/* Questions Panel */}
        {showQuestions && <div style={{ ...crd, borderRadius: 12, marginBottom: 16 }}>
          <div style={{ ...lbl, marginBottom: 8 }}>Customer Questions</div>
          {questions.length === 0 ? <div style={{ color: C.t2, fontSize: 12 }}>No questions yet. Customers can ask questions from any slide in their quote view.</div> :
            questions.map((qn, i) => (
              <div key={i} style={{ padding: "10px 0", borderBottom: i < questions.length - 1 ? `1px solid ${C.brd}` : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{qn.question}</div>
                    <div style={{ fontSize: 10, color: C.t2, marginTop: 2 }}>{qn.customer_name || "Customer"} · {qn.created_at ? new Date(qn.created_at).toLocaleString() : "—"}</div>
                  </div>
                  {!qn.answered ? <button onClick={() => markQuestionAnswered(qn.id)} style={{ ...bP, padding: "4px 10px", fontSize: 10, borderRadius: 6, background: C.grn }}><Check size={10} /> Done</button> : <span style={{ fontSize: 10, color: C.grn, fontWeight: 700 }}>✓ Answered</span>}
                </div>
              </div>
            ))
          }
        </div>}

        {/* Intro Video */}
        {q && <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
          {q.settings?.introVideo ? (
            <>
              <span style={{ fontSize: 12, color: C.grn, fontWeight: 600 }}>🎥 Intro video recorded</span>
              <button onClick={() => { const v = document.createElement("video"); v.src = q.settings.introVideo; v.controls = true; v.style.cssText = "max-width:400px;border-radius:12px"; const m = document.createElement("div"); m.style.cssText = "position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;cursor:pointer"; m.onclick = () => m.remove(); m.appendChild(v); document.body.appendChild(m); v.play(); }} style={{ ...bS, padding: "4px 10px", fontSize: 10, borderRadius: 6 }}>Preview</button>
              <button onClick={() => setQ({ ...q, settings: { ...q.settings, introVideo: null } })} style={{ ...bS, padding: "4px 10px", fontSize: 10, borderRadius: 6, color: C.red }}>Remove</button>
            </>
          ) : recording && recordingFor === "intro" ? (
            <button onClick={stopRecording} style={{ ...bP, padding: "6px 14px", fontSize: 11, borderRadius: 8, background: C.red }}>⏹ Stop Recording Intro</button>
          ) : (
            <button onClick={() => startRecording("intro")} style={{ ...bS, borderRadius: 8, padding: "6px 12px", fontSize: 11 }} disabled={recording}>🎥 Record Intro Video</button>
          )}
        </div>}

        {/* Expiration Management */}
        {q && q.expiration_date && q.status !== "signed" && (() => {
          const daysLeft = Math.ceil((new Date(q.expiration_date) - new Date()) / 86400000);
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: daysLeft <= 3 ? "#FEE2E2" : daysLeft <= 7 ? "#FEF3C7" : C.sf, borderRadius: 10, marginBottom: 16, fontSize: 12 }}>
              <Clock size={14} color={daysLeft <= 3 ? C.red : daysLeft <= 7 ? C.wrn : C.t2} />
              <span style={{ flex: 1, color: daysLeft <= 3 ? C.red : daysLeft <= 7 ? C.wrn : C.t2, fontWeight: 600 }}>
                {daysLeft <= 0 ? "This quote has expired" : `Expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""} (${fD(q.expiration_date)})`}
              </span>
              <button onClick={async () => {
                const newExp = new Date(Date.now() + 30 * 86400000).toISOString();
                await sbPatch("quotes", q.id, { expiration_date: newExp });
                setQ({ ...q, expiration_date: newExp });
              }} style={{ ...bS, padding: "4px 10px", fontSize: 10, borderRadius: 6 }}>+30 days</button>
              <button onClick={async () => {
                const newExp = new Date(Date.now() + 90 * 86400000).toISOString();
                await sbPatch("quotes", q.id, { expiration_date: newExp });
                setQ({ ...q, expiration_date: newExp });
              }} style={{ ...bS, padding: "4px 10px", fontSize: 10, borderRadius: 6 }}>+90 days</button>
            </div>
          );
        })()}

        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          {/* Mobile slide nav toggle */}
          <button onClick={() => setShowSidePanel(!showSidePanel)} style={{ ...bS, borderRadius: 10, padding: "8px 14px", fontSize: 12, marginBottom: 8 }} className="hide-mobile"><Layers size={14} /> Slides ({slides.length})</button>
          {/* Left: Slide List */}
          <div className={`quote-sidebar${showSidePanel ? " open" : ""}`} style={{ width: 220, flexShrink: 0 }}>
            <div style={{ ...crd, borderRadius: 14, padding: 12 }}>
              <div style={{ ...lbl, marginBottom: 10 }}>Slides</div>
              {slides.map((s, i) => {
                const st = SLIDE_TYPES.find(t => t.type === s.slide_type);
                return (
                  <div key={i} onClick={() => setAsi(i)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, cursor: "pointer", marginBottom: 4, background: asi === i ? C.ac + "15" : "transparent", border: asi === i ? `1px solid ${C.ac}40` : "1px solid transparent", opacity: s.visible === false ? 0.4 : 1 }}>
                    <span style={{ fontSize: 14 }}>{st?.icon || "📄"}</span>
                    <div style={{ flex: 1, fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</div>
                    <div style={{ display: "flex", gap: 2 }}>
                      <button onClick={e => { e.stopPropagation(); moveSlide(i, -1); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: C.t2, opacity: i === 0 ? 0.3 : 1 }}><ArrowUp size={10} /></button>
                      <button onClick={e => { e.stopPropagation(); moveSlide(i, 1); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: C.t2, opacity: i === slides.length - 1 ? 0.3 : 1 }}><ArrowDown size={10} /></button>
                      <button onClick={e => { e.stopPropagation(); const ns = [...slides]; ns[i] = { ...ns[i], visible: !ns[i].visible }; setSlides(ns); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: s.visible === false ? C.red : C.t2 }}>{s.visible === false ? <EyeOff size={10} /> : <Eye size={10} />}</button>
                    </div>
                  </div>
                );
              })}
              {/* Add slide */}
              <div style={{ marginTop: 8, borderTop: `1px solid ${C.brd}`, paddingTop: 8 }}>
                <div style={{ ...lbl, fontSize: 9 }}>Add Slide</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {SLIDE_TYPES.filter(st => st.type !== "valueadd").map(st => (
                    <button key={st.type} onClick={() => addSlide(st.type)} style={{ background: C.sf, border: `1px solid ${C.brd}`, borderRadius: 6, padding: "5px 8px", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, textAlign: "left" }}>
                      <span>{st.icon}</span> {st.label}
                    </button>
                  ))}
                  <div style={{ ...lbl, fontSize: 8, marginTop: 4, marginBottom: 2 }}>Info Pages</div>
                  {Object.entries(VALUEADD_PRESETS).map(([k, v]) => (
                    <button key={k} onClick={() => addSlide("valueadd", k)} style={{ background: C.sf, border: `1px solid ${C.brd}`, borderRadius: 6, padding: "5px 8px", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                      ℹ️ {v.title}
                    </button>
                  ))}
                  <button onClick={() => addSlide("valueadd")} style={{ background: C.sf, border: `1px solid ${C.brd}`, borderRadius: 6, padding: "5px 8px", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                    ℹ️ Custom Page
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Slide Editor */}
          <div style={{ flex: 1 }}>
            {activeSlide ? (
              <div style={{ ...crd, borderRadius: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <input value={activeSlide.title} onChange={e => { const ns = [...slides]; ns[asi] = { ...ns[asi], title: e.target.value }; setSlides(ns); }} style={{ ...inp, fontWeight: 800, fontSize: 18, border: "none", padding: "4px 0", background: "transparent" }} />
                  <button onClick={() => { if (confirm("Remove this slide?")) removeSlide(asi); }} style={{ ...bS, padding: "6px 10px", borderRadius: 8, color: C.red }}><Trash2 size={14} /></button>
                </div>

                {/* COVER SLIDE EDITOR */}
                {activeSlide.slide_type === "cover" && (
                  <div>
                    <Fld label="Customer Name"><input value={q.customer_name} onChange={e => setQ({ ...q, customer_name: e.target.value })} style={{ ...inp, borderRadius: 10 }} /></Fld>
                    <Fld label="Property Address"><input value={q.customer_address || ""} onChange={e => setQ({ ...q, customer_address: e.target.value })} style={{ ...inp, borderRadius: 10 }} /></Fld>
                    <Rw>
                      <Cl><Fld label="Email"><input value={q.customer_email || ""} onChange={e => setQ({ ...q, customer_email: e.target.value })} style={{ ...inp, borderRadius: 10 }} /></Fld></Cl>
                      <Cl><Fld label="Phone"><input value={q.customer_phone || ""} onChange={e => setQ({ ...q, customer_phone: e.target.value })} style={{ ...inp, borderRadius: 10 }} /></Fld></Cl>
                    </Rw>
                    <Fld label="House Photo">
                      {!activeSlide.content?.housePhoto && q.customer_address && (
                        <button onClick={async () => {
                          try {
                            const addr = encodeURIComponent(q.customer_address);
                            const svUrl = `https://maps.googleapis.com/maps/api/streetview?size=800x500&location=${addr}&key=AIzaSyBbBi7zzfw4RQhjSrflMnbf2Np_LrOLweY`;
                            // Try loading as img to verify it works
                            const img = new window.Image();
                            img.crossOrigin = "anonymous";
                            img.onload = () => {
                              const canvas = document.createElement("canvas");
                              canvas.width = img.width; canvas.height = img.height;
                              canvas.getContext("2d").drawImage(img, 0, 0);
                              try {
                                const b64 = canvas.toDataURL("image/jpeg", 0.8);
                                const ns = [...slides]; ns[asi] = { ...ns[asi], content: { ...ns[asi].content, housePhoto: b64 } }; setSlides(ns);
                              } catch {
                                // CORS blocked canvas - use URL directly
                                const ns = [...slides]; ns[asi] = { ...ns[asi], content: { ...ns[asi].content, housePhoto: svUrl } }; setSlides(ns);
                              }
                            };
                            img.onerror = () => { alert("Could not load Street View image. The address may not have coverage, or try uploading manually."); };
                            img.src = svUrl;
                          } catch { alert("Failed to load Street View. Try uploading a photo manually."); }
                        }} style={{ ...bS, borderRadius: 10, padding: "8px 14px", fontSize: 12, marginBottom: 10, width: "100%" }}>
                          <Image size={14} /> Load from Google Street View
                        </button>
                      )}
                      {activeSlide.content?.housePhoto ? (
                        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 8 }}>
                          <img src={activeSlide.content.housePhoto} alt="" style={{ width: "100%", maxHeight: 250, objectFit: "cover" }} />
                          <button onClick={() => { const ns = [...slides]; ns[asi] = { ...ns[asi], content: { ...ns[asi].content, housePhoto: null } }; setSlides(ns); }} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", padding: "4px 8px" }}><X size={14} /> Remove</button>
                        </div>
                      ) : (
                        <label style={{ display: "block", padding: 30, background: C.sf, borderRadius: 12, textAlign: "center", cursor: "pointer", border: `2px dashed ${C.brd}` }}>
                          <Camera size={24} color={C.t2} /><div style={{ fontSize: 12, color: C.t2, marginTop: 8 }}>Click to upload house photo</div>
                          <input type="file" accept="image/*" onChange={async (e) => { if (e.target.files?.[0]) { const b64 = await compressPhoto(e.target.files[0]); const ns = [...slides]; ns[asi] = { ...ns[asi], content: { ...ns[asi].content, housePhoto: b64 } }; setSlides(ns); } e.target.value=""; }} style={{ display: "none" }} />
                        </label>
                      )}
                    </Fld>
                  </div>
                )}

                {/* INSPECTION PHOTOS EDITOR */}
                {activeSlide.slide_type === "photos" && (() => {
                  const photos = activeSlide.content?.photos || [];
                  const updatePhotos = (newPhotos) => { const ns = [...slides]; ns[asi] = { ...ns[asi], content: { ...ns[asi].content, photos: newPhotos } }; setSlides(ns); };
                  const addPhoto = async (e) => {
                    const files = Array.from(e.target.files || []);
                    const newPhotos = [...photos];
                    for (const file of files) {
                      const base64 = await compressPhoto(file);
                      newPhotos.push({ src: base64, caption: "", id: uid() });
                    }
                    updatePhotos(newPhotos);
                    e.target.value = "";
                  };
                  return (
                    <div>
                      <Fld label="Section Description">
                        <input value={activeSlide.content?.caption || ""} onChange={e => { const ns = [...slides]; ns[asi] = { ...ns[asi], content: { ...ns[asi].content, caption: e.target.value } }; setSlides(ns); }} style={{ ...inp, borderRadius: 10 }} placeholder="Describe what was found during inspection..." />
                      </Fld>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 12 }}>
                        {photos.map((p, i) => (
                          <div key={p.id || i} style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: `1px solid ${C.brd}` }}>
                            <div style={{ position: "relative" }}>
                              <img src={p.src} alt="" style={{ width: "100%", height: 160, objectFit: "cover" }} />
                              {/* Annotation circles */}
                              {(p.annotations || []).map((ann, ai) => (
                                <div key={ai} onClick={e => { e.stopPropagation(); const np = [...photos]; np[i] = { ...np[i], annotations: (np[i].annotations || []).filter((_, j) => j !== ai) }; updatePhotos(np); }} style={{ position: "absolute", left: `${ann.x}%`, top: `${ann.y}%`, width: 30, height: 30, borderRadius: "50%", border: "3px solid #B22234", cursor: "pointer", transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(178,34,52,0.15)", fontSize: 10, fontWeight: 800, color: "#B22234" }}>{ai + 1}</div>
                              ))}
                              {/* Click to add annotation */}
                              <div onClick={e => { const rect = e.currentTarget.getBoundingClientRect(); const x = Math.round(((e.clientX - rect.left) / rect.width) * 100); const y = Math.round(((e.clientY - rect.top) / rect.height) * 100); const np = [...photos]; np[i] = { ...np[i], annotations: [...(np[i].annotations || []), { x, y, label: "" }] }; updatePhotos(np); }} style={{ position: "absolute", inset: 0, cursor: "crosshair" }} title="Click to add annotation circle" />
                            </div>
                            <input value={p.caption || ""} onChange={e => { const np = [...photos]; np[i] = { ...np[i], caption: e.target.value }; updatePhotos(np); }} placeholder="Caption..." style={{ width: "100%", border: "none", borderTop: `1px solid ${C.brd}`, padding: "6px 8px", fontSize: 11, outline: "none" }} />
                            <button onClick={() => updatePhotos(photos.filter((_, j) => j !== i))} style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: 4, color: "#fff", cursor: "pointer", padding: "2px 4px" }}><X size={12} /></button>
                          </div>
                        ))}
                      </div>
                      <label style={{ ...bS, borderRadius: 10, padding: "10px 16px", fontSize: 12, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <Camera size={14} /> Upload Photos
                        <input type="file" accept="image/*" multiple onChange={addPhoto} style={{ display: "none" }} />
                      </label>
                      <span style={{ fontSize: 11, color: C.t2, marginLeft: 8 }}>{photos.length} photo{photos.length !== 1 ? "s" : ""}</span>
                    </div>
                  );
                })()}

                {/* SCOPE OF WORK EDITOR */}
                {activeSlide.slide_type === "scope" && <ScopeEditor slide={activeSlide} slides={slides} setSlides={setSlides} asi={asi} items={items} lineItems={lineItems} addLineItem={addLineItem} addManualItem={addManualItem} updateLI={updateLI} removeLI={removeLI} />}

                {/* PRICING EDITOR */}
                {activeSlide.slide_type === "pricing" && (
                  <div>
                    {/* Margin Control */}
                    <div style={{ ...crd, background: C.sf, borderRadius: 12, marginBottom: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span style={lbl}>Global Margin</span>
                        <span style={{ fontFamily: MN, fontWeight: 800, fontSize: 16, color: C.grn }}>{margin}%</span>
                      </div>
                      <input type="range" min={0} max={100} value={margin} onChange={e => adjustMargin(Number(e.target.value))} style={{ width: "100%", accentColor: C.ac }} />
                    </div>
                    {/* Tier Toggles */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                      {TIERS.map(t => (
                        <button key={t} onClick={() => setTiersEnabled({ ...tiersEnabled, [t]: !tiersEnabled[t] })} style={{ ...bS, borderRadius: 10, padding: "8px 16px", fontSize: 12, background: tiersEnabled[t] ? TIER_COLORS[t] + "15" : "transparent", color: tiersEnabled[t] ? TIER_COLORS[t] : C.t2, borderColor: tiersEnabled[t] ? TIER_COLORS[t] + "40" : C.brd }}>
                          {tiersEnabled[t] ? <Check size={12} /> : null} {TIER_LABELS[t]}
                        </button>
                      ))}
                    </div>
                    {/* Customer view setting */}
                    <Fld label="Customer sees">
                      <div style={{ display: "flex", gap: 6 }}>
                        {[{ k: "total", l: "Total Only" }, { k: "grouped", l: "Grouped" }, { k: "items", l: "All Items" }].map(v => (
                          <button key={v.k} onClick={() => setPriceView(v.k)} style={{ ...bS, borderRadius: 8, padding: "6px 12px", fontSize: 11, background: priceView === v.k ? C.ac + "15" : "transparent", color: priceView === v.k ? C.ac : C.t2, borderColor: priceView === v.k ? C.ac + "40" : C.brd }}>{v.l}</button>
                        ))}
                      </div>
                    </Fld>
                    {/* Tier Summary */}
                    <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                      {TIERS.filter(t => tiersEnabled[t]).map(t => {
                        const prevTier = TIERS[TIERS.indexOf(t) - 1];
                        const addedItems = lineItems.filter(li => !li.is_upgrade && li.tier === t);
                        return (
                        <div key={t} style={{ ...crd, flex: 1, minWidth: 160, borderRadius: 12, borderTop: `3px solid ${TIER_COLORS[t]}` }}>
                          <div style={{ fontSize: 11, fontWeight: 800, color: TIER_COLORS[t], textTransform: "uppercase", marginBottom: 6 }}>{TIER_LABELS[t]}</div>
                          <div style={{ fontSize: 24, fontWeight: 900, fontFamily: MN }}>{fmt$(tierTotal(t))}</div>
                          <div style={{ fontSize: 10, color: C.t2, marginTop: 4 }}>{lineItems.filter(li => !li.is_upgrade && (li.tier === "all" || TIERS.indexOf(li.tier) <= TIERS.indexOf(t))).length} items</div>
                          {addedItems.length > 0 && prevTier && <div style={{ fontSize: 9, color: TIER_COLORS[t], marginTop: 6, borderTop: `1px solid ${C.brd}`, paddingTop: 4 }}>+ {addedItems.map(li => li.description).join(", ")}</div>}
                        </div>
                      );})}
                    </div>
                    {/* Optional Upgrades Total */}
                    {lineItems.filter(li => li.is_upgrade).length > 0 && (
                      <div style={{ marginTop: 12, padding: 12, background: C.sf, borderRadius: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.t2 }}>OPTIONAL UPGRADES</div>
                        {lineItems.filter(li => li.is_upgrade).map((li, i) => {
                          const realIdx = lineItems.indexOf(li);
                          return (
                            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${C.brd}` }}>
                              <span style={{ fontSize: 12 }}>{li.description}</span>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontFamily: MN, fontSize: 12, fontWeight: 700 }}>{fmt$(li.qty * li.unit_price)}</span>
                                <button onClick={() => removeLI(realIdx)} style={{ background: "none", border: "none", cursor: "pointer", color: C.red }}><X size={12} /></button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {/* Product Color Selections */}
                    <div style={{ marginTop: 16, padding: 12, background: C.sf, borderRadius: 10 }}>
                      <div style={{ ...lbl }}>Customer Color/Product Selections</div>
                      <div style={{ fontSize: 11, color: C.t2, marginBottom: 8 }}>Add dropdowns the customer can choose from (e.g. shingle color, drip edge color)</div>
                      {(q.settings?.color_options || []).map((co, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                          <input value={co.label} onChange={e => { const opts = [...(q.settings?.color_options || [])]; opts[i] = { ...opts[i], label: e.target.value }; setQ({ ...q, settings: { ...q.settings, color_options: opts } }); }} style={{ ...inp, borderRadius: 6, padding: "6px 10px", fontSize: 12, flex: 1 }} placeholder="Label (e.g. Shingle Color)" />
                          <input value={co.choices.join(", ")} onChange={e => { const opts = [...(q.settings?.color_options || [])]; opts[i] = { ...opts[i], choices: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }; setQ({ ...q, settings: { ...q.settings, color_options: opts } }); }} style={{ ...inp, borderRadius: 6, padding: "6px 10px", fontSize: 12, flex: 2 }} placeholder="Options, comma separated" />
                          <button onClick={() => { const opts = (q.settings?.color_options || []).filter((_, j) => j !== i); setQ({ ...q, settings: { ...q.settings, color_options: opts } }); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.red }}><X size={14} /></button>
                        </div>
                      ))}
                      <button onClick={() => { const opts = [...(q.settings?.color_options || []), { label: "", choices: [] }]; setQ({ ...q, settings: { ...q.settings, color_options: opts } }); }} style={{ ...bS, padding: "4px 10px", fontSize: 10, borderRadius: 6, marginTop: 4 }}><Plus size={10} /> Add Selection</button>
                    </div>

                    {/* GP Summary (admin only) */}
                    {isA && <div style={{ marginTop: 16, padding: 12, background: "#d4edda", borderRadius: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.grn }}>PROFIT SUMMARY (Admin Only — Hidden from Customer)</div>
                      <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                        <div><span style={{ fontSize: 10, color: C.t2 }}>Total Cost</span><div style={{ fontFamily: MN, fontWeight: 800 }}>{fmt$(totalCost)}</div></div>
                        <div><span style={{ fontSize: 10, color: C.t2 }}>Best Tier Revenue</span><div style={{ fontFamily: MN, fontWeight: 800 }}>{fmt$(tierTotal("best"))}</div></div>
                        <div><span style={{ fontSize: 10, color: C.t2 }}>GP$</span><div style={{ fontFamily: MN, fontWeight: 800, color: C.grn }}>{fmt$(tierTotal("best") - totalCost)}</div></div>
                        <div><span style={{ fontSize: 10, color: C.t2 }}>GP%</span><div style={{ fontFamily: MN, fontWeight: 800, color: C.grn }}>{tierTotal("best") > 0 ? ((1 - totalCost / tierTotal("best")) * 100).toFixed(1) : 0}%</div></div>
                      </div>
                    {/* Detailed Cost Breakdown */}
                    <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
                      <div><span style={{ fontSize: 10, color: C.t2 }}>Material Cost</span><div style={{ fontFamily: MN, fontWeight: 700, fontSize: 12 }}>{fmt$(lineItems.filter(li => !li.is_upgrade).reduce((s, li) => s + (li.qty || 1) * (li.cost || 0), 0))}</div></div>
                      <div><span style={{ fontSize: 10, color: C.t2 }}>Labor Cost</span><div style={{ fontFamily: MN, fontWeight: 700, fontSize: 12 }}>{fmt$(lineItems.filter(li => !li.is_upgrade).reduce((s, li) => s + (li.labor_cost || 0), 0))}</div></div>
                      <div><span style={{ fontSize: 10, color: C.t2 }}>Total Cost</span><div style={{ fontFamily: MN, fontWeight: 700, fontSize: 12 }}>{fmt$(lineItems.filter(li => !li.is_upgrade).reduce((s, li) => s + (li.qty || 1) * (li.cost || 0) + (li.labor_cost || 0), 0))}</div></div>
                      <div><span style={{ fontSize: 10, color: C.t2 }}>Revenue (Best)</span><div style={{ fontFamily: MN, fontWeight: 700, fontSize: 12, color: C.grn }}>{fmt$(tierTotal("best"))}</div></div>
                    </div>
                    </div>}
                  </div>
                )}

                {/* SIGNATURE EDITOR */}
                {activeSlide.slide_type === "signature" && (
                  <div>
                    <Fld label="Terms & Conditions">
                      <textarea value={activeSlide.content?.terms || ""} onChange={e => { const ns = [...slides]; ns[asi] = { ...ns[asi], content: { ...ns[asi].content, terms: e.target.value } }; setSlides(ns); }} style={{ ...inp, borderRadius: 10, minHeight: 250, fontFamily: MN, fontSize: 12, lineHeight: 1.6 }} />
                    </Fld>
                    <div style={{ padding: 16, background: C.sf, borderRadius: 10, marginTop: 12 }}>
                      <div style={{ fontSize: 12, color: C.t2 }}>Customer will type their name to sign. The system captures their name, timestamp, IP address, and user agent for a legally binding e-signature.</div>
                    </div>
                  </div>
                )}

                {/* VALUE-ADD / INFO PAGE EDITOR */}
                {activeSlide.slide_type === "valueadd" && (
                  <div>
                    <Fld label="Page Heading">
                      <input value={activeSlide.content?.heading || ""} onChange={e => { const ns = [...slides]; ns[asi] = { ...ns[asi], content: { ...ns[asi].content, heading: e.target.value } }; setSlides(ns); }} style={{ ...inp, borderRadius: 10, fontWeight: 700, fontSize: 16 }} placeholder="Section heading..." />
                    </Fld>
                    <Fld label="Content">
                      <textarea value={activeSlide.content?.body || ""} onChange={e => { const ns = [...slides]; ns[asi] = { ...ns[asi], content: { ...ns[asi].content, body: e.target.value } }; setSlides(ns); }} style={{ ...inp, borderRadius: 10, minHeight: 300, fontSize: 13, lineHeight: 1.7 }} placeholder="Write your content here. Use line breaks for formatting..." />
                    </Fld>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <div style={{ ...lbl, width: "100%", marginBottom: 4 }}>Quick Fill</div>
                      {Object.entries(VALUEADD_PRESETS).map(([k, v]) => (
                        <button key={k} onClick={() => { const ns = [...slides]; ns[asi] = { ...ns[asi], title: v.title, content: v.content }; setSlides(ns); }} style={{ ...bS, padding: "4px 10px", fontSize: 10, borderRadius: 6 }}>{v.title}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* PRODUCT COMPARISON EDITOR */}
                {activeSlide.slide_type === "comparison" && (() => {
                  const products = activeSlide.content?.products || [];
                  const updateProducts = (newProds) => { const ns = [...slides]; ns[asi] = { ...ns[asi], content: { ...ns[asi].content, products: newProds } }; setSlides(ns); };
                  return (
                    <div>
                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        {products.map((p, pi) => (
                          <div key={pi} style={{ flex: 1, minWidth: 220, ...crd, borderRadius: 12, padding: 14 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                              <input value={p.name || ""} onChange={e => { const np = [...products]; np[pi] = { ...np[pi], name: e.target.value }; updateProducts(np); }} style={{ ...inp, fontWeight: 800, fontSize: 14, border: "none", padding: 0, background: "transparent" }} placeholder="Product name..." />
                              <button onClick={() => updateProducts(products.filter((_, i) => i !== pi))} style={{ background: "none", border: "none", cursor: "pointer", color: C.red }}><X size={14} /></button>
                            </div>
                            <Fld label="Description">
                              <textarea value={p.description || ""} onChange={e => { const np = [...products]; np[pi] = { ...np[pi], description: e.target.value }; updateProducts(np); }} style={{ ...inp, borderRadius: 8, minHeight: 60, fontSize: 12 }} placeholder="Product description..." />
                            </Fld>
                            <Fld label="Features (one per line)">
                              <textarea value={(p.features || []).join("\n")} onChange={e => { const np = [...products]; np[pi] = { ...np[pi], features: e.target.value.split("\n") }; updateProducts(np); }} style={{ ...inp, borderRadius: 8, minHeight: 100, fontSize: 12 }} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
                            </Fld>
                            <Fld label="Price (optional)">
                              <input value={p.price || ""} onChange={e => { const np = [...products]; np[pi] = { ...np[pi], price: e.target.value }; updateProducts(np); }} style={{ ...inp, borderRadius: 8, fontSize: 12 }} placeholder="e.g. $250/sq" />
                            </Fld>
                          </div>
                        ))}
                      </div>
                      {products.length < 3 && <button onClick={() => updateProducts([...products, { name: "", features: [], description: "" }])} style={{ ...bS, marginTop: 12, borderRadius: 8, fontSize: 12 }}><Plus size={14} /> Add Product</button>}
                    </div>
                  );
                })()}
              </div>
            ) : <Empty msg="Add a slide to get started" />}

            {/* Save as Template + Load Template */}
            {q && <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              <button onClick={() => setShowSaveTpl(true)} style={{ ...bS, borderRadius: 10, padding: "8px 14px", fontSize: 12 }}><Copy size={14} /> Save as Template</button>
              {templates.length > 0 && <div style={{ position: "relative" }}>
                <select onChange={e => { const t = templates.find(x => x.id === e.target.value); if (t && confirm("Load this template? It will replace current slides and items.")) loadFromTemplate(t); e.target.value = ""; }} style={{ ...bS, borderRadius: 10, padding: "8px 14px", fontSize: 12, cursor: "pointer", appearance: "auto" }} defaultValue="">
                  <option value="" disabled>Load Template...</option>
                  {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>}
            </div>}

            {/* Internal Notes */}
            {q && <div style={{ marginTop: 16, ...crd, borderRadius: 12, padding: 14, background: "#FFFBEB" }}>
              <div style={{ ...lbl, color: C.wrn, fontSize: 10 }}>Internal Notes (not visible to customer)</div>
              <textarea value={q.notes || ""} onChange={e => setQ({ ...q, notes: e.target.value })} placeholder="Add internal notes, reminders, follow-up items..." rows={3} style={{ ...inp, borderRadius: 8, fontSize: 12, background: "#fff", resize: "vertical", border: `1px solid #F59E0B30` }} />
            </div>}

            {/* Activity Log */}
            {q && activity.length > 0 && <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setShowActivity(!showActivity)} style={{ ...bS, borderRadius: 10, padding: "8px 14px", fontSize: 12, flex: 1 }}>
                  <Clock size={14} /> Activity Log ({activity.length}) {showActivity ? "▲" : "▼"}
                </button>
                <button onClick={async () => { const qs = await sbGet("quote_questions", `quote_id=eq.${q.id}&order=created_at.desc`); if (qs?.length > 0) { alert("Customer Questions:\n\n" + qs.map(qq => `"${qq.question}" — ${qq.customer_name || "Customer"} (${fD(qq.created_at)})`).join("\n\n")); } else { alert("No questions yet."); } }} style={{ ...bS, borderRadius: 10, padding: "8px 14px", fontSize: 12 }}>❓ Questions</button>
                <button onClick={async () => {
                  const tracks = await sbGet("quote_tracking", `quote_id=eq.${q.id}&event_type=eq.slide_view&order=created_at.desc`);
                  if (!tracks?.length) { alert("No slide tracking data yet. Customer hasn't viewed the quote."); return; }
                  const slideStats = {};
                  tracks.forEach(t => { const title = t.metadata?.slide_title || "Unknown"; if (!slideStats[title]) slideStats[title] = { views: 0, totalTime: 0 }; slideStats[title].views++; slideStats[title].totalTime += t.duration_seconds || 0; });
                  const report = Object.entries(slideStats).sort((a, b) => b[1].totalTime - a[1].totalTime).map(([title, s]) => `${title}: ${s.views} views, ${s.totalTime}s total`).join("\n");
                  alert("Slide Engagement:\n\n" + report);
                }} style={{ ...bS, borderRadius: 10, padding: "8px 14px", fontSize: 12 }}>📊 Engagement</button>
              </div>
              {showActivity && <div style={{ ...crd, borderRadius: 12, padding: 12, marginTop: 8, maxHeight: 300, overflow: "auto" }}>
                {activity.map((a, i) => {
                  const icons = { opened: "👀", signed: "✍️", sent: "📤", viewed: "👁️" };
                  const labels = { opened: "Customer opened quote", signed: "Quote signed", sent: "Quote sent", viewed: "Quote viewed" };
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: i < activity.length - 1 ? `1px solid ${C.brd}` : "none" }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{icons[a.event_type] || "📌"}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{labels[a.event_type] || a.event_type}</div>
                        <div style={{ fontSize: 10, color: C.t2 }}>{a.timestamp ? new Date(a.timestamp).toLocaleString() : a.created_at ? new Date(a.created_at).toLocaleString() : "—"}</div>
                        {a.event_type === "signed" && a.metadata?.total && <div style={{ fontSize: 11, color: C.grn, fontWeight: 700, marginTop: 2 }}>{fmt$(a.metadata.total)} · {TIER_LABELS[a.metadata?.tier] || ""} tier</div>}
                        {a.event_type === "slide_view" && <div style={{ fontSize: 10, color: C.t2 }}>{a.metadata?.slide_title || "Slide"} · {a.duration_seconds || 0}s</div>}
                      </div>
                    </div>
                  );
                })}
              </div>}
            </div>}
          </div>
        </div>

        {/* Save as Template Modal */}
        <Modal open={showSaveTpl} onClose={() => setShowSaveTpl(false)} title="Save as Template">
          <Fld label="Template Name"><input value={tplName} onChange={e => setTplName(e.target.value)} style={{ ...inp, borderRadius: 10 }} placeholder="e.g. Standard Roof Replacement..." /></Fld>
          <div style={{ fontSize: 12, color: C.t2, marginBottom: 16 }}>This will save the current slides ({slides.length}), line items ({lineItems.length}), and pricing settings as a reusable template.</div>
          {templates.length > 0 && <div style={{ marginBottom: 16 }}>
            <div style={lbl}>Existing Templates</div>
            {templates.map(t => <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${C.brd}` }}>
              <span style={{ fontSize: 13 }}>{t.name}</span>
              <button onClick={() => { if (confirm("Delete this template?")) deleteTemplate(t.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, fontSize: 11 }}><Trash2 size={12} /></button>
            </div>)}
          </div>}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setShowSaveTpl(false)} style={bS}>Cancel</button>
            <button onClick={saveAsTemplate} disabled={!tplName.trim()} style={{ ...bP, borderRadius: 10 }}><Check size={14} /> Save Template</button>
          </div>
        </Modal>
      </div>
    );
  }

  // ═══ PREVIEW VIEW ═══
  if (view === "preview" && q) {
    return (
      <div className="fu">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <button onClick={() => setView("edit")} style={{ ...bS, borderRadius: 10, padding: "8px 14px" }}><ArrowLeft size={14} /> Back to Editor</button>
          <button onClick={() => navigator.clipboard.writeText(quoteLink).then(() => alert("Link copied!"))} style={{ ...bP, borderRadius: 10, padding: "8px 14px", fontSize: 12 }}><Copy size={14} /> Copy Customer Link</button>
        </div>
        <div style={{ border: `2px dashed ${C.brd}`, borderRadius: 16, padding: 4, background: "#f0f0f0" }}>
          <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden" }}>
            <QuotePublicView quoteId={q.id} isPreview={true} />
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ─── Scope of Work Editor Sub-Component ───
function ScopeEditor({ slide, slides, setSlides, asi, items, lineItems, addLineItem, addManualItem, updateLI, removeLI }) {
  const [iSearch, setISearch] = useState("");
  const [showAddItem, setShowAddItem] = useState(false);
  const [manualDesc, setManualDesc] = useState("");
  const [manualQty, setManualQty] = useState(1);
  const [manualPrice, setManualPrice] = useState("");
  const [manualCost, setManualCost] = useState("");
  const [addTier, setAddTier] = useState("all");
  const [addUpgrade, setAddUpgrade] = useState(false);
  const [addSection, setAddSection] = useState("Roofing");

  const active = items.filter(i => i.active !== false);
  const filtered = active.filter(i => {
    if (!iSearch.trim()) return false;
    return i.name.toLowerCase().includes(iSearch.toLowerCase()) || (i.category || "").toLowerCase().includes(iSearch.toLowerCase());
  }).slice(0, 10);

  const scopeItems = lineItems.filter(li => !li.is_upgrade);
  const upgradeItems = lineItems.filter(li => li.is_upgrade);

  // Group by section
  const sections = {};
  scopeItems.forEach((li, i) => {
    const sec = li.category || "Other";
    if (!sections[sec]) sections[sec] = [];
    sections[sec].push({ li, realIdx: lineItems.indexOf(li) });
  });
  const sectionNames = Object.keys(sections);
  const allSections = [...new Set([...sectionNames, "Roofing", "Gutters", "Interior", "Other"])];

  // Reorder within lineItems
  const moveLI = (realIdx, dir) => {
    const newItems = [...lineItems];
    const ni = realIdx + dir;
    if (ni < 0 || ni >= newItems.length) return;
    [newItems[realIdx], newItems[ni]] = [newItems[ni], newItems[realIdx]];
    // Replace the entire lineItems array via parent
    // We need a setLineItems function - pass through updateLI hack
    // Actually we need to swap - let's use updateLI to set a temp then fix
  };

  return (
    <div>
      {/* Section-grouped Line Items */}
      {sectionNames.length > 0 ? sectionNames.map(sec => {
        const secItems = sections[sec];
        const secTotal = secItems.reduce((s, { li }) => s + (li.qty || 1) * (li.unit_price || 0), 0);
        return (
          <div key={sec} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", background: NAVY + "10", borderRadius: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: NAVY, textTransform: "uppercase", letterSpacing: ".05em" }}>{sec}</span>
              <span style={{ fontSize: 11, fontWeight: 700, fontFamily: MN, color: C.t2 }}>{fmt$(secTotal)}</span>
            </div>
            {secItems.map(({ li, realIdx }, i) => (
              <div key={realIdx} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 4px", borderBottom: `1px solid ${C.brd}`, fontSize: 12 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <button onClick={() => { if (realIdx > 0) { const n = [...lineItems]; [n[realIdx], n[realIdx-1]] = [n[realIdx-1], n[realIdx]]; updateLI(0, "_reorder", n); }}} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: C.t2, opacity: realIdx === 0 ? 0.2 : 1 }}><ArrowUp size={9} /></button>
                  <button onClick={() => { if (realIdx < lineItems.length-1) { const n = [...lineItems]; [n[realIdx], n[realIdx+1]] = [n[realIdx+1], n[realIdx]]; updateLI(0, "_reorder", n); }}} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: C.t2, opacity: realIdx === lineItems.length-1 ? 0.2 : 1 }}><ArrowDown size={9} /></button>
                </div>
                <input value={li.description} onChange={e => updateLI(realIdx, "description", e.target.value)} style={{ flex: 2, border: "none", background: "transparent", fontSize: 12, fontWeight: 600, outline: "none", minWidth: 100 }} />
                <input type="number" value={li.qty} onChange={e => updateLI(realIdx, "qty", Number(e.target.value))} style={{ width: 45, border: `1px solid ${C.brd}`, borderRadius: 4, textAlign: "center", fontSize: 11, padding: "2px" }} min={1} />
                <input type="number" value={li.unit_price} onChange={e => updateLI(realIdx, "unit_price", Number(e.target.value))} style={{ width: 75, border: `1px solid ${C.brd}`, borderRadius: 4, textAlign: "right", fontSize: 11, padding: "2px 4px", fontFamily: MN }} step="0.01" />
                <select value={li.tier || "all"} onChange={e => updateLI(realIdx, "tier", e.target.value)} style={{ width: 55, border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 9, padding: "2px", background: TIER_COLORS[li.tier] ? TIER_COLORS[li.tier] + "15" : "transparent" }}>
                  <option value="all">All</option><option value="good">Good</option><option value="better">Better</option><option value="best">Best</option>
                </select>
                <input type="number" value={li.labor_cost || 0} onChange={e => updateLI(realIdx, "labor_cost", Number(e.target.value))} title="Labor cost (hidden)" style={{ width: 55, border: `1px solid ${C.brd}`, borderRadius: 4, textAlign: "right", fontSize: 10, padding: "2px", fontFamily: MN, color: C.t2, background: "#FFFBEB" }} step="0.01" placeholder="Labor" />
                <span style={{ fontSize: 10, fontFamily: MN, color: C.t2, width: 60, textAlign: "right" }}>{fmt$(li.qty * li.unit_price)}</span>
                <button onClick={() => removeLI(realIdx)} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, padding: 2 }}><X size={11} /></button>
              </div>
            ))}
          </div>
        );
      }) : <div style={{ padding: 20, textAlign: "center", color: C.t2, fontSize: 13, background: C.sf, borderRadius: 10, marginBottom: 16 }}>No line items yet. Search your inventory or add manual items below.</div>}

      {/* Scope Total */}
      {scopeItems.length > 0 && <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: NAVY, borderRadius: 8, marginBottom: 16 }}>
        <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>Scope Total ({scopeItems.length} items)</span>
        <span style={{ color: "#fff", fontSize: 14, fontWeight: 900, fontFamily: MN }}>{fmt$(scopeItems.reduce((s, li) => s + (li.qty || 1) * (li.unit_price || 0), 0))}</span>
      </div>}

      {/* Optional Upgrades */}
      {upgradeItems.length > 0 && (
        <div style={{ marginBottom: 16, padding: 12, background: "#FEF3C7", borderRadius: 10 }}>
          <div style={{ ...lbl, color: C.wrn }}>Optional Upgrades (Customer Can Toggle)</div>
          {upgradeItems.map((li, i) => {
            const realIdx = lineItems.indexOf(li);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid #F59E0B30` }}>
                <span style={{ flex: 1, fontSize: 12 }}>{li.description}</span>
                <input type="number" value={li.qty} onChange={e => updateLI(realIdx, "qty", Number(e.target.value))} style={{ width: 50, border: `1px solid ${C.brd}`, borderRadius: 4, textAlign: "center", fontSize: 12, padding: "2px" }} />
                <span style={{ fontFamily: MN, fontSize: 12, fontWeight: 700 }}>{fmt$(li.unit_price)}</span>
                <button onClick={() => removeLI(realIdx)} style={{ background: "none", border: "none", cursor: "pointer", color: C.red }}><X size={12} /></button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Items */}
      <div style={{ borderTop: `1px solid ${C.brd}`, paddingTop: 16 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
          <select value={addSection} onChange={e => setAddSection(e.target.value)} style={{ ...bS, padding: "4px 10px", fontSize: 10, borderRadius: 6, appearance: "auto" }}>
            {allSections.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div style={{ display: "flex", gap: 3 }}>
            {TIERS.map(t => (
              <button key={t} onClick={() => setAddTier(t)} style={{ ...bS, padding: "4px 8px", fontSize: 9, borderRadius: 5, background: addTier === t ? TIER_COLORS[t] + "15" : "transparent", color: addTier === t ? TIER_COLORS[t] : C.t2, borderColor: addTier === t ? TIER_COLORS[t] + "40" : C.brd }}>{TIER_LABELS[t]}</button>
            ))}
            <button onClick={() => setAddTier("all")} style={{ ...bS, padding: "4px 8px", fontSize: 9, borderRadius: 5, background: addTier === "all" ? C.ac + "15" : "transparent", color: addTier === "all" ? C.ac : C.t2 }}>All</button>
          </div>
          <button onClick={() => setAddUpgrade(!addUpgrade)} style={{ ...bS, padding: "4px 8px", fontSize: 9, borderRadius: 5, background: addUpgrade ? "#F59E0B15" : "transparent", color: addUpgrade ? "#F59E0B" : C.t2 }}>{addUpgrade ? "✓ Upgrade" : "Upgrade"}</button>
        </div>

        {/* Search inventory */}
        <div style={{ position: "relative", marginBottom: 10 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: C.t2 }} />
          <input value={iSearch} onChange={e => setISearch(e.target.value)} placeholder="Search inventory items..." style={{ ...inp, paddingLeft: 30, borderRadius: 10, fontSize: 13 }} />
          {iSearch.trim() && filtered.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 200, background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", maxHeight: 250, overflow: "auto", marginTop: 4 }}>
              {filtered.map(it => {
                const hasOpts = it.options && it.options.length > 0;
                return (
                  <div key={it.id} style={{ padding: "8px 12px", borderBottom: `1px solid ${C.brd}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{it.name}</span>
                        <span style={{ fontSize: 10, color: C.t2, marginLeft: 8 }}>{it.category}</span>
                      </div>
                      {!hasOpts && (
                        <button onClick={() => { addLineItem(it, "_default", addTier, addUpgrade, addSection); }} style={{ ...bP, padding: "4px 10px", fontSize: 10, borderRadius: 6 }}><Plus size={10} /> Add</button>
                      )}
                    </div>
                    {hasOpts && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                        {it.options.map(opt => (
                          <button key={opt} onClick={() => { addLineItem(it, opt, addTier, addUpgrade, addSection); }} style={{ ...bS, padding: "3px 8px", fontSize: 10, borderRadius: 4 }}>{opt}</button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Manual entry */}
        <button onClick={() => setShowAddItem(!showAddItem)} style={{ ...bS, fontSize: 11, borderRadius: 8, padding: "6px 12px", marginBottom: 8 }}><Plus size={12} /> Add Manual Item</button>
        {showAddItem && (
          <div style={{ padding: 12, background: C.sf, borderRadius: 10, marginTop: 6 }}>
            <Rw g={8}>
              <Cl f={3}><input value={manualDesc} onChange={e => setManualDesc(e.target.value)} placeholder="Description..." style={{ ...inp, fontSize: 12, borderRadius: 8 }} /></Cl>
              <Cl f={0.5}><input type="number" value={manualQty} onChange={e => setManualQty(Number(e.target.value))} placeholder="Qty" style={{ ...inp, fontSize: 12, borderRadius: 8, textAlign: "center" }} min={1} /></Cl>
              <Cl f={1}><input type="number" value={manualPrice} onChange={e => setManualPrice(e.target.value)} placeholder="Price" style={{ ...inp, fontSize: 12, borderRadius: 8 }} step="0.01" /></Cl>
              <Cl f={1}><input type="number" value={manualCost} onChange={e => setManualCost(e.target.value)} placeholder="Cost" style={{ ...inp, fontSize: 12, borderRadius: 8 }} step="0.01" /></Cl>
              <Cl f={0.5}><button onClick={() => { if (manualDesc.trim()) { addManualItem(manualDesc, manualQty, Number(manualPrice) || 0, Number(manualCost) || 0, addTier, addUpgrade, addSection); setManualDesc(""); setManualQty(1); setManualPrice(""); setManualCost(""); } }} style={{ ...bP, padding: "8px 14px", borderRadius: 8, fontSize: 11, width: "100%" }}>Add</button></Cl>
            </Rw>
          </div>
        )}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════
// PUBLIC QUOTE VIEW (Customer-Facing)
// ═══════════════════════════════════════════
function QuotePublicView({ quoteId, isPreview }) {
  const [quote, setQuote] = useState(null);
  const [slides, setSlides] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [currentSlide, setCurrentSlideRaw] = useState(0);
  const [slideEnterTime, setSlideEnterTime] = useState(Date.now());
  const setCurrentSlide = (idx) => {
    // Track time on previous slide
    if (!isPreview && quote) {
      const duration = Math.round((Date.now() - slideEnterTime) / 1000);
      if (duration > 1) {
        sbPost("quote_tracking", { quote_id: quote.id, event_type: "slide_view", slide_id: slides[currentSlide]?.id || null, timestamp: new Date().toISOString(), duration_seconds: duration, metadata: { slide_type: slides[currentSlide]?.slide_type, slide_title: slides[currentSlide]?.title } }).catch(() => {});
      }
    }
    setSlideEnterTime(Date.now());
    setCurrentSlideRaw(idx);
  };
  const [loading, setLoading] = useState(true);
  const [signed, setSigned] = useState(false);
  const [sigName, setSigName] = useState("");
  const [sigName2, setSigName2] = useState("");
  const [selectedTier, setSelectedTier] = useState("best");
  const [selectedUpgrades, setSelectedUpgrades] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [videoBubbleMin, setVideoBubbleMin] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (quoteId) loadPublicQuote();
  }, [quoteId]);

  async function loadPublicQuote() {
    setLoading(true);
    const qData = await sbGet("quotes", `id=eq.${quoteId}&select=*`);
    if (!qData || qData.length === 0) { setError("Quote not found"); setLoading(false); return; }
    const qt = qData[0];
    if (qt.status === "signed") { setSigned(true); }
    // Check expiration
    if (qt.expiration_date && new Date(qt.expiration_date) < new Date()) { setError("This quote has expired"); setLoading(false); return; }
    setQuote(qt);
    const sl = await sbGet("quote_slides", `quote_id=eq.${quoteId}&visible=eq.true&order=sort_order.asc`);
    const liRaw2 = await sbGet("quote_line_items", `quote_id=eq.${quoteId}&order=sort_order.asc`);
    const li = (liRaw2 || []).map(r => ({
      ...r, cost: r.unit_cost || 0, unit_price: r.line_total ? r.line_total / (r.qty || 1) : (r.unit_cost || 0) * (1 + (r.margin_pct || 0) / 100),
      markup: r.margin_pct || 0, category: r.section_name || "Other",
    }));
    setSlides(sl || []);
    setLineItems(li || []);
    // Track view
    if (!isPreview && qt.status === "draft") {
      await sbPatch("quotes", qt.id, { status: "viewed" });
    }
    if (!isPreview) {
      await sbPost("quote_tracking", { quote_id: qt.id, event_type: "opened", timestamp: new Date().toISOString(), user_agent: navigator.userAgent, metadata: {} });
      // Notify Logan via SMS that customer opened the quote
      try {
        await fetch("/api/notify?action=sms", { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: "+15738649965", message: `👀 ${qt.customer_name} just opened their quote! ${window.location.origin}/quote/${qt.id}` }) });
      } catch {}
    }
    setLoading(false);
  }

  const tierTotal = (tier) => {
    return lineItems
      .filter(li => !li.is_upgrade && (li.tier === "all" || TIERS.indexOf(li.tier) <= TIERS.indexOf(tier)))
      .reduce((s, li) => s + (li.qty || 1) * (li.unit_price || 0), 0);
  };
  const toggleUpgrade = (idx) => {
    setSelectedUpgrades({ ...selectedUpgrades, [idx]: !selectedUpgrades[idx] });
  };
  const selectedUpgradesTotal = lineItems.filter((li, i) => li.is_upgrade && selectedUpgrades[i]).reduce((s, li) => s + (li.qty || 1) * (li.unit_price || 0), 0);
  const grandTotal = tierTotal(selectedTier) + selectedUpgradesTotal;

  async function handleSign() {
    if (!sigName.trim()) return;
    const sigData = {
      name: sigName,
      name2: sigName2 || null,
      timestamp: new Date().toISOString(),
      ip: "captured-server-side",
      userAgent: navigator.userAgent,
      tier: selectedTier,
      upgrades: Object.keys(selectedUpgrades).filter(k => selectedUpgrades[k]).map(k => lineItems[k]?.description),
      total: grandTotal,
      colorSelections: selectedColors,
      customerComment: document.getElementById("customer-comment")?.value || "",
    };
    await sbPatch("quotes", quote.id, {
      status: "signed",
      signature_data: sigData,
      selected_tier: selectedTier,
      total_price: grandTotal,
      settings: { ...(quote.settings || {}), signature: sigData, selected_tier: selectedTier, selected_upgrades: selectedUpgrades },
    });
    await sbPost("quote_tracking", { quote_id: quote.id, event_type: "signed", timestamp: new Date().toISOString(), user_agent: navigator.userAgent, metadata: sigData });
    // Generate signed quote HTML and upload to JN
    if (quote.jn_job_id) {
      try {
        const tierItems = lineItems.filter(li => !li.is_upgrade && (li.tier === "all" || TIERS.indexOf(li.tier) <= TIERS.indexOf(selectedTier)));
        const upgradeList = Object.keys(selectedUpgrades).filter(k => selectedUpgrades[k]).map(k => lineItems[k]).filter(Boolean);
        const rows = [...tierItems, ...upgradeList].map(li => `<tr><td style="padding:6px;border-bottom:1px solid #ddd">${li.description}${li.is_upgrade ? ' <span style="color:#D4870E;font-size:10px">(UPGRADE)</span>' : ''}</td><td style="padding:6px;border-bottom:1px solid #ddd;text-align:center">${li.qty}</td><td style="padding:6px;border-bottom:1px solid #ddd;text-align:right;font-weight:700">${fmt$(li.qty * li.unit_price)}</td></tr>`).join("");
        const html = `<!DOCTYPE html><html><head><title>Signed Quote - ${quote.customer_name}</title><style>*{box-sizing:border-box;margin:0;padding:0;font-family:Helvetica,Arial,sans-serif}body{padding:36px;color:#1a1a1a;font-size:12px;max-width:800px;margin:0 auto}table{width:100%;border-collapse:collapse;margin:14px 0}th{text-align:left;padding:7px 6px;border-bottom:2px solid #1B2A4A;font-size:9px;text-transform:uppercase;color:#666}td{padding:6px;border-bottom:1px solid #ddd}.r{text-align:right}</style></head><body>` +
          `<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;padding-bottom:14px;border-bottom:3px solid #B22234"><div><div style="font-size:24px;font-weight:900">ROOF<span style="color:#B22234">USA</span></div><div style="font-size:10px;color:#666;margin-top:2px">Construction, LLC · Columbia, MO</div></div><div style="text-align:right"><div style="font-weight:800;font-size:13px;color:#1B2A4A">SIGNED QUOTE</div><div style="margin-top:3px;font-size:11px;color:#666">Date: ${fD(sigData.timestamp)}</div></div></div>` +
          `<div style="margin-bottom:16px"><strong>Customer:</strong> ${quote.customer_name}<br><strong>Address:</strong> ${quote.address || "—"}<br><strong>Package:</strong> ${TIER_LABELS[selectedTier]}</div>` +
          `<table><thead><tr><th>Description</th><th style="text-align:center">Qty</th><th class="r">Amount</th></tr></thead><tbody>${rows}</tbody></table>` +
          `<div style="margin-top:14px;padding:12px;background:#1B2A4A;color:#fff;border-radius:5px;display:flex;justify-content:space-between;font-size:16px;font-weight:800"><span>Total:</span><span>${fmt$(grandTotal)}</span></div>` +
          `<div style="margin-top:30px;padding:20px;border:2px solid #1B2A4A;border-radius:8px"><div style="font-size:11px;color:#666;text-transform:uppercase;margin-bottom:8px">Electronic Signature</div>` +
          `<div style="font-family:cursive;font-size:28px;color:#1B2A4A;margin-bottom:8px">${sigName}</div>` +
          `<div style="font-size:10px;color:#999">Signed: ${new Date(sigData.timestamp).toLocaleString()} | Agent: ${navigator.userAgent.slice(0, 60)}</div></div>` +
          `<div style="margin-top:30px;text-align:center;font-size:8px;color:#bbb">Roof USA · Roofus Construction, LLC · Columbia, MO</div></body></html>`;
        const fileName = `Signed Quote - ${quote.customer_name.replace(/[^a-zA-Z0-9-_ ]/g, "")}.html`;
        await fetch("/api/jn?action=upload", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName, htmlContent: html, relatedId: quote.jn_job_id, jobName: quote.customer_name, jobAddress: quote.address || "" }),
        });
      } catch (e) { console.error("JN upload error:", e); }
    }
    // Notify Logan via SMS
    try {
      await fetch("/api/notify?action=sms", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: "+15738649965", message: `🎉 QUOTE SIGNED! ${quote.customer_name} just signed for ${fmt$(grandTotal)} (${TIER_LABELS[selectedTier]} tier). ${window.location.origin}/quote/${quote.id}` }) });
    } catch {}
    // Email confirmation to customer
    if (quote.customer_email) {
      try {
        await fetch("/api/notify?action=email", { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: quote.customer_email, toName: quote.customer_name, subject: "Your Signed Agreement - Roof USA",
            html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px"><h2 style="color:#1B2A4A">Thank You, ${quote.customer_name}!</h2><p>Your roofing agreement with Roof USA has been signed and confirmed.</p><div style="background:#f8f9fa;padding:16px;border-radius:8px;margin:16px 0"><p style="margin:0"><strong>Package:</strong> ${TIER_LABELS[selectedTier]}</p><p style="margin:8px 0 0"><strong>Total:</strong> ${fmt$(grandTotal)}</p><p style="margin:8px 0 0"><strong>Signed:</strong> ${new Date().toLocaleDateString()}</p></div><p>Our team will be in contact shortly to schedule your project. If you have any questions, reply to this email or call us.</p><p style="margin-top:24px">Thank you for choosing Roof USA!</p><hr style="border:none;border-top:1px solid #eee;margin:24px 0"><p style="font-size:12px;color:#999">Roof USA · Roofus Construction, LLC · Columbia, MO</p></div>` }) });
      } catch {}
    }
    setSigned(true);
  }

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1)); }
      if (e.key === "ArrowLeft") { e.preventDefault(); setCurrentSlide(Math.max(0, currentSlide - 1)); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentSlide, slides.length]);

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#fff" }}><div style={{ textAlign: "center" }}><img src={LOGO} alt="Roof USA" style={{ height: 50, marginBottom: 16 }} /><div style={{ color: "#999", fontSize: 14 }}>Loading your proposal...</div></div></div>;
  if (error) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#fff" }}><div style={{ textAlign: "center", padding: 40 }}><img src={LOGO} alt="Roof USA" style={{ height: 50, marginBottom: 16 }} /><div style={{ color: "#B22234", fontSize: 16, fontWeight: 700 }}>{error}</div></div></div>;
  if (!quote || slides.length === 0) return <div style={{ textAlign: "center", padding: 80, color: "#999" }}>No content available</div>;

  const cs = slides[currentSlide];
  const settings = quote.settings || {};
  const tiersEnabled = settings.tiers_enabled || { good: true, better: true, best: true };
  const priceView = settings.price_view || "total";

  return (
    <div style={{ fontFamily: "'Barlow', sans-serif", background: "#fff", minHeight: isPreview ? 600 : "100vh" }}>
      {!isPreview && <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Barlow:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&family=Dancing+Script:wght@700&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Barlow',sans-serif;overflow-x:hidden}.slide-enter{animation:slideIn .3s ease-out}@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}`}</style>}

      {/* Header with progress */}
      <div style={{ display: "flex", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid #eee", gap: 12 }}>
        <img src={LOGO} alt="Roof USA" style={{ height: 28, opacity: 0.7 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {slides.map((s, i) => {
              const st = SLIDE_TYPES.find(t => t.type === s.slide_type);
              return <button key={i} onClick={() => setCurrentSlide(i)} title={s.title} style={{ flex: 1, height: 4, borderRadius: 2, border: "none", background: i <= currentSlide ? RED : "#e5e7eb", cursor: "pointer", transition: "all .3s" }} />;
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ fontSize: 10, color: "#999" }}>{slides[currentSlide]?.title}</span>
            <span style={{ fontSize: 10, color: "#999" }}>{currentSlide + 1}/{slides.length}</span>
          </div>
        </div>
      </div>

      {/* Slide Content */}
      {/* Video Bubble */}
      {slides[currentSlide]?.content?.video && (
        videoBubbleMin ? (
          <button onClick={() => setVideoBubbleMin(false)} style={{ position: "fixed", bottom: 20, right: 20, zIndex: 500, width: 48, height: 48, borderRadius: "50%", background: NAVY, border: "2px solid #fff", boxShadow: "0 4px 16px rgba(0,0,0,0.3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20 }}>🎥</button>
        ) : (
          <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 500, borderRadius: 16, overflow: "hidden", border: "3px solid #fff", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
            <video src={slides[currentSlide].content.video} autoPlay playsInline style={{ width: 200, height: 150, objectFit: "cover", display: "block" }} />
            <button onClick={() => setVideoBubbleMin(true)} style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.5)", border: "none", borderRadius: 4, color: "#fff", cursor: "pointer", padding: "2px 6px", fontSize: 10 }}>—</button>
          </div>
        )
      )}

      <div key={currentSlide} className="slide-enter" style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px", minHeight: 400 }}>
        {/* COVER */}
        {cs.slide_type === "cover" && (
          <div style={{ textAlign: "center" }}>
            {quote.settings?.introVideo && (
              <div style={{ marginBottom: 24, borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                <video src={quote.settings.introVideo} controls playsInline style={{ width: "100%", maxHeight: 350, background: "#000" }} />
                <div style={{ padding: "8px 12px", background: "#f8f9fa", fontSize: 12, color: "#666" }}>A personal message from your Roof USA team</div>
              </div>
            )}
            <img src={LOGO} alt="Roof USA" style={{ height: 70, marginBottom: 24 }} />
            <h1 style={{ fontSize: 32, fontWeight: 900, fontFamily: "'Barlow Condensed', sans-serif", color: NAVY, marginBottom: 8 }}>{cs.title || "Your Roofing Proposal"}</h1>
            <div style={{ width: 60, height: 3, background: RED, margin: "16px auto" }} />
            <div style={{ fontSize: 18, fontWeight: 600, marginTop: 20 }}>{quote.customer_name}</div>
            <div style={{ fontSize: 14, color: "#666", marginTop: 6 }}>{(quote.address || "")}</div>
            <div style={{ fontSize: 13, color: "#999", marginTop: 20 }}>{fD(quote.created_at)}</div>
            {cs.content?.housePhoto && <div style={{ marginTop: 24, borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}><img src={cs.content.housePhoto} alt="" style={{ width: "100%", maxHeight: 350, objectFit: "cover" }} /></div>}
            <div style={{ marginTop: 30, padding: 16, background: "#f8f9fa", borderRadius: 12, display: "inline-block" }}>
              <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: ".1em" }}>Prepared by</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>Roof USA · Columbia, MO</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{quote.created_by}</div>
            </div>
          </div>
        )}

        {/* SCOPE */}
        {/* INSPECTION PHOTOS */}
        {cs.slide_type === "photos" && (() => {
          const photos = cs.content?.photos || [];
          return (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 900, fontFamily: "'Barlow Condensed', sans-serif", color: NAVY, marginBottom: 8 }}>{cs.title}</h2>
              {cs.content?.caption && <p style={{ fontSize: 15, color: "#555", marginBottom: 20, lineHeight: 1.6 }}>{cs.content.caption}</p>}
              {photos.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                  {photos.map((p, i) => (
                    <div key={i} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                      <div style={{ position: "relative" }}>
                        <img src={p.src} alt={p.caption || ""} style={{ width: "100%", height: 220, objectFit: "cover" }} />
                        {(p.annotations || []).map((ann, ai) => (
                          <div key={ai} style={{ position: "absolute", left: `${ann.x}%`, top: `${ann.y}%`, width: 32, height: 32, borderRadius: "50%", border: "3px solid #B22234", transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(178,34,52,0.2)", fontSize: 11, fontWeight: 800, color: "#B22234", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>{ai + 1}</div>
                        ))}
                      </div>
                      {p.caption && <div style={{ padding: "10px 14px", fontSize: 13, color: "#444", background: "#f8f9fa" }}>{p.caption}</div>}
                    </div>
                  ))}
                </div>
              ) : <div style={{ padding: 40, textAlign: "center", color: "#999" }}>No photos added</div>}
            </div>
          );
        })()}

        {cs.slide_type === "scope" && (() => {
          const tierItems = lineItems.filter(li => !li.is_upgrade && (li.tier === "all" || TIERS.indexOf(li.tier) <= TIERS.indexOf(selectedTier)));
          const grouped = {};
          tierItems.forEach(li => { const sec = li.category || "Other"; if (!grouped[sec]) grouped[sec] = []; grouped[sec].push(li); });
          return (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 900, fontFamily: "'Barlow Condensed', sans-serif", color: NAVY, marginBottom: 20 }}>{cs.title}</h2>
            {tierItems.length > 0 ? (
              <div>
                {priceView === "items" ? (
                  Object.entries(grouped).map(([sec, secItems]) => (
                    <div key={sec} style={{ marginBottom: 20 }}>
                      {Object.keys(grouped).length > 1 && <div style={{ fontSize: 13, fontWeight: 800, color: NAVY, textTransform: "uppercase", letterSpacing: ".05em", padding: "8px 0", borderBottom: `2px solid ${NAVY}20`, marginBottom: 4 }}>{sec}</div>}
                      {secItems.map((li, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14 }}>{li.description}</div>
                            {li.qty > 1 && <div style={{ fontSize: 11, color: "#999" }}>{li.qty} × {fmt$(li.unit_price)}</div>}
                          </div>
                          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 14 }}>{fmt$(li.qty * li.unit_price)}</div>
                        </div>
                      ))}
                    </div>
                  ))
                ) : priceView === "grouped" ? (
                  Object.entries(grouped).map(([cat, secItems]) => {
                    const total = secItems.reduce((s, li) => s + li.qty * li.unit_price, 0);
                    return (
                      <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #eee", fontSize: 15 }}>
                        <div><div style={{ fontWeight: 600 }}>{cat}</div><div style={{ fontSize: 11, color: "#999" }}>{secItems.length} items</div></div>
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>{fmt$(total)}</span>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ padding: 24, background: "#f8f9fa", borderRadius: 12 }}>
                    <div style={{ fontSize: 15, color: "#444", marginBottom: 12 }}>Your {TIER_LABELS[selectedTier]} package includes:</div>
                    {Object.entries(grouped).map(([sec, secItems]) => (
                      <div key={sec} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}>
                        <span style={{ color: "#059669", fontWeight: 800 }}>✓</span>
                        <span style={{ fontSize: 14 }}>{sec} ({secItems.length} items)</span>
                      </div>
                    ))}
                    <div style={{ fontSize: 12, color: "#999", marginTop: 12 }}>See the Pricing slide for full details and pricing.</div>
                  </div>
                )}
              </div>
            ) : <div style={{ padding: 40, textAlign: "center", color: "#999" }}>No items configured</div>}
          </div>
          );
        })()}

        {/* PRICING */}
        {cs.slide_type === "pricing" && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 900, fontFamily: "'Barlow Condensed', sans-serif", color: NAVY, marginBottom: 20 }}>{cs.title}</h2>
            {/* Tier Cards */}
            <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
              {TIERS.filter(t => tiersEnabled[t]).map(t => {
                const tierItemCount = lineItems.filter(li => !li.is_upgrade && (li.tier === "all" || TIERS.indexOf(li.tier) <= TIERS.indexOf(t))).length;
                const addedItems = lineItems.filter(li => !li.is_upgrade && li.tier === t);
                const isBest = t === TIERS.filter(tt => tiersEnabled[tt]).slice(-1)[0];
                return (
                <div key={t} onClick={() => setSelectedTier(t)} style={{ flex: 1, minWidth: 200, padding: 24, borderRadius: 16, border: selectedTier === t ? `3px solid ${TIER_COLORS[t]}` : "2px solid #e5e7eb", cursor: "pointer", textAlign: "center", background: selectedTier === t ? TIER_COLORS[t] + "08" : "#fff", transition: "all .2s", position: "relative" }}>
                  {selectedTier === t && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: TIER_COLORS[t], color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 12px", borderRadius: 10, textTransform: "uppercase" }}>Selected</div>}
                  {isBest && <div style={{ position: "absolute", top: -12, right: 12, background: "#F59E0B", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 8 }}>BEST VALUE</div>}
                  <div style={{ fontSize: 14, fontWeight: 800, color: TIER_COLORS[t], textTransform: "uppercase", marginBottom: 8 }}>{TIER_LABELS[t]}</div>
                  <div style={{ fontSize: 32, fontWeight: 900, fontFamily: "'IBM Plex Mono', monospace", color: TIER_COLORS[t] }}>{fmt$(tierTotal(t))}</div>
                  <div style={{ fontSize: 11, color: "#999", marginTop: 6 }}>{tierItemCount} items included</div>
                  {addedItems.length > 0 && <div style={{ fontSize: 11, color: TIER_COLORS[t], marginTop: 8, borderTop: "1px solid #eee", paddingTop: 8, textAlign: "left" }}>
                    <div style={{ fontWeight: 700, fontSize: 10, marginBottom: 4 }}>Adds:</div>
                    {addedItems.slice(0, 4).map((li, i) => <div key={i} style={{ fontSize: 11, padding: "2px 0" }}>+ {li.description}</div>)}
                    {addedItems.length > 4 && <div style={{ fontSize: 10, color: "#999" }}>+ {addedItems.length - 4} more</div>}
                  </div>}
                </div>
              );})}
            </div>
            {/* Optional Upgrades */}
            {lineItems.filter(li => li.is_upgrade).length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: NAVY, marginBottom: 12 }}>Optional Upgrades</div>
                {lineItems.map((li, i) => {
                  if (!li.is_upgrade) return null;
                  return (
                    <div key={i} onClick={() => toggleUpgrade(i)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, border: `1px solid ${selectedUpgrades[i] ? "#059669" : "#e5e7eb"}`, marginBottom: 8, cursor: "pointer", background: selectedUpgrades[i] ? "#05966910" : "#fff" }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${selectedUpgrades[i] ? "#059669" : "#ccc"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {selectedUpgrades[i] && <Check size={14} color="#059669" />}
                      </div>
                      <div style={{ flex: 1, fontSize: 14 }}>{li.description}</div>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 14 }}>+{fmt$(li.qty * li.unit_price)}</div>
                    </div>
                  );
                })}
              </div>
            )}
            {/* Product Selections */}
            {(quote.settings?.color_options || []).length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: NAVY, marginBottom: 12 }}>Product Selections</div>
                {(quote.settings?.color_options || []).map((co, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#666", marginBottom: 6 }}>{co.label}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {co.choices.map((ch, ci) => (
                        <button key={ci} onClick={() => setSelectedColors({ ...selectedColors, [co.label]: ch })} style={{ padding: "8px 16px", borderRadius: 8, border: selectedColors[co.label] === ch ? `2px solid ${NAVY}` : "2px solid #e5e7eb", background: selectedColors[co.label] === ch ? NAVY + "10" : "#fff", cursor: "pointer", fontSize: 13, fontWeight: selectedColors[co.label] === ch ? 700 : 400 }}>
                          {ch}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Grand Total */}
            <div style={{ padding: 24, background: `linear-gradient(135deg, ${NAVY}, #2d4a7a)`, borderRadius: 16, color: "#fff", textAlign: "center", boxShadow: "0 4px 20px rgba(27,42,74,0.3)" }}>
              <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".15em", opacity: 0.7, marginBottom: 8 }}>Your Investment</div>
              <div style={{ fontSize: 44, fontWeight: 900, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "-0.02em" }}>{fmt$(grandTotal)}</div>
              <div style={{ fontSize: 13, opacity: 0.7, marginTop: 8 }}>{TIER_LABELS[selectedTier]} Package{selectedUpgradesTotal > 0 ? ` + ${fmt$(selectedUpgradesTotal)} in upgrades` : ""}</div>
            </div>
            {/* Customer Comment */}
            {!isPreview && !signed && (
              <div style={{ marginTop: 16, padding: 16, background: "#f8f9fa", borderRadius: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#666", marginBottom: 8 }}>Comments or Special Requests (optional)</div>
                <textarea id="customer-comment" placeholder="Any notes or special requests for your project..." style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, outline: "none", resize: "vertical", minHeight: 60, fontFamily: "'Barlow', sans-serif" }} />
              </div>
            )}
          </div>
        )}

        {/* SIGNATURE */}
        {cs.slide_type === "signature" && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 900, fontFamily: "'Barlow Condensed', sans-serif", color: NAVY, marginBottom: 20 }}>{cs.title}</h2>
            {signed ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#059669", fontFamily: "'Barlow Condensed', sans-serif" }}>You're All Set!</div>
                <div style={{ fontSize: 15, color: "#666", marginTop: 12, lineHeight: 1.6 }}>Thank you for choosing Roof USA, {quote.customer_name}!</div>
                <div style={{ marginTop: 20, padding: 16, background: "#f0fdf4", borderRadius: 12, display: "inline-block" }}>
                  <div style={{ fontSize: 12, color: "#166534", fontWeight: 700, marginBottom: 4 }}>WHAT HAPPENS NEXT</div>
                  <div style={{ fontSize: 14, color: "#333", lineHeight: 1.7 }}>
                    Our team has been notified and will contact you<br/>within 1 business day to schedule your project.
                  </div>
                </div>
                {quote.customer_email && <div style={{ marginTop: 16, fontSize: 12, color: "#999" }}>A confirmation has been sent to {quote.customer_email}</div>}
              </div>
            ) : (
              <div>
                {/* Terms */}
                <div style={{ padding: 20, background: "#f8f9fa", borderRadius: 12, marginBottom: 24, maxHeight: 300, overflow: "auto" }}>
                  <pre style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "#444" }}>{cs.content?.terms || DEFAULT_TERMS}</pre>
                </div>
                {/* Summary */}
                <div style={{ padding: 16, background: NAVY + "10", borderRadius: 12, marginBottom: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <span>Selected Package: <strong>{TIER_LABELS[selectedTier]}</strong></span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800 }}>{fmt$(grandTotal)}</span>
                  </div>
                </div>
                {/* Signature */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 12 }}>Type your full legal name to sign</div>
                  <input value={sigName} onChange={e => setSigName(e.target.value)} placeholder="Your full name..." style={{ width: "100%", maxWidth: 400, padding: "16px 20px", fontSize: 20, fontFamily: "'Dancing Script', cursive", textAlign: "center", border: `2px solid ${C.brd}`, borderRadius: 12, outline: "none", background: "#fffef5" }} />
                  {sigName && <div style={{ marginTop: 12, fontFamily: "'Dancing Script', cursive", fontSize: 36, color: NAVY }}>{sigName}</div>}
                  {/* Second signer (optional) */}
                  <details style={{ marginTop: 16, textAlign: "left", maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
                    <summary style={{ fontSize: 12, color: "#999", cursor: "pointer" }}>Add second signer (optional)</summary>
                    <input value={sigName2} onChange={e => setSigName2(e.target.value)} placeholder="Second signer's full name..." style={{ width: "100%", padding: "12px 16px", fontSize: 16, fontFamily: "'Dancing Script', cursive", textAlign: "center", border: `1px solid ${C.brd}`, borderRadius: 10, outline: "none", marginTop: 8, background: "#fffef5" }} />
                    {sigName2 && <div style={{ marginTop: 8, fontFamily: "'Dancing Script', cursive", fontSize: 24, color: NAVY, textAlign: "center" }}>{sigName2}</div>}
                  </details>
                  <button onClick={handleSign} disabled={!sigName.trim() || isPreview} style={{ ...bP, marginTop: 20, padding: "14px 40px", fontSize: 16, borderRadius: 12, background: sigName.trim() ? "#059669" : "#ccc", opacity: isPreview ? 0.5 : 1 }}>
                    {isPreview ? "Signing disabled in preview" : "Sign & Authorize"}
                  </button>
                  {isPreview && <div style={{ fontSize: 11, color: "#999", marginTop: 8 }}>Signing is disabled in preview mode</div>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VALUE-ADD / INFO PAGE */}
        {cs.slide_type === "valueadd" && (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Barlow Condensed', sans-serif", color: NAVY, marginBottom: 8 }}>{cs.content?.heading || cs.title}</h2>
            <div style={{ width: 50, height: 3, background: RED, marginBottom: 24 }} />
            <div style={{ fontSize: 15, lineHeight: 1.8, color: "#333", whiteSpace: "pre-wrap" }}>
              {(cs.content?.body || "").split("\n").map((line, i) => {
                if (!line.trim()) return <br key={i} />;
                if (line.trim().match(/^[A-Z][A-Z\s&]+$/) && line.trim().length > 3) return <div key={i} style={{ fontSize: 16, fontWeight: 800, color: NAVY, marginTop: 20, marginBottom: 6 }}>{line}</div>;
                if (line.trim().startsWith("•") || line.trim().startsWith("-")) return <div key={i} style={{ paddingLeft: 16, position: "relative", marginBottom: 4 }}><span style={{ position: "absolute", left: 0, color: RED, fontWeight: 800 }}>•</span>{line.trim().replace(/^[•-]\s*/, "")}</div>;
                return <div key={i}>{line}</div>;
              })}
            </div>
          </div>
        )}

        {/* PRODUCT COMPARISON */}
        {cs.slide_type === "comparison" && (() => {
          const products = cs.content?.products || [];
          return (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 900, fontFamily: "'Barlow Condensed', sans-serif", color: NAVY, marginBottom: 20 }}>{cs.title}</h2>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {products.map((p, i) => (
                  <div key={i} style={{ flex: 1, minWidth: 220, border: "2px solid #e5e7eb", borderRadius: 16, overflow: "hidden" }}>
                    <div style={{ background: i === 0 ? NAVY : i === 1 ? RED : "#6B7280", color: "#fff", padding: "16px 20px", textAlign: "center" }}>
                      <div style={{ fontSize: 18, fontWeight: 800 }}>{p.name || `Option ${i + 1}`}</div>
                      {p.price && <div style={{ fontSize: 14, opacity: 0.9, marginTop: 4 }}>{p.price}</div>}
                    </div>
                    <div style={{ padding: 20 }}>
                      {p.description && <div style={{ fontSize: 13, color: "#666", marginBottom: 16, lineHeight: 1.6 }}>{p.description}</div>}
                      {(p.features || []).filter(f => f.trim()).map((f, fi) => (
                        <div key={fi} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 0", borderBottom: fi < p.features.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                          <span style={{ color: "#059669", fontWeight: 800, fontSize: 14, marginTop: 1 }}>✓</span>
                          <span style={{ fontSize: 13, color: "#333" }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Customer Question Box */}
      {!isPreview && !signed && cs.slide_type !== "signature" && (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <details style={{ borderTop: "1px solid #eee", paddingTop: 16, marginTop: 8 }}>
            <summary style={{ fontSize: 13, color: "#666", cursor: "pointer", fontWeight: 600, marginBottom: 8 }}>Have a question about this section?</summary>
            <div style={{ display: "flex", gap: 8 }}>
              <input id="q-input" placeholder="Type your question..." style={{ flex: 1, padding: "10px 14px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, outline: "none" }} />
              <button onClick={async () => {
                const inp = document.getElementById("q-input");
                const qText = inp?.value?.trim();
                if (!qText) return;
                await sbPost("quote_questions", { quote_id: quote.id, slide_id: cs.id || null, question: qText, customer_name: quote.customer_name });
                try { await fetch("/api/notify?action=sms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: "+15738649965", message: `❓ Question from ${quote.customer_name} on their quote: "${qText}"` }) }); } catch {}
                inp.value = "";
                alert("Question sent! We\'ve notified your rep and will get back to you soon.");
              }} style={{ background: RED, color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Send</button>
            </div>
          </details>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderTop: "1px solid #eee", maxWidth: 800, margin: "0 auto" }}>
        <button onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))} disabled={currentSlide === 0} style={{ background: "transparent", border: `1px solid ${currentSlide === 0 ? "#eee" : "#ddd"}`, borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: currentSlide === 0 ? "default" : "pointer", color: currentSlide === 0 ? "#ccc" : "#333", fontFamily: "'Barlow', sans-serif" }}>← Previous</button>
        {currentSlide === slides.length - 1 && slides[currentSlide]?.slide_type !== "signature" ? (
          <span style={{ fontSize: 12, color: "#999" }}>Last slide</span>
        ) : (
          <button onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))} disabled={currentSlide === slides.length - 1} style={{ background: currentSlide === slides.length - 1 ? "#ccc" : RED, color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: currentSlide === slides.length - 1 ? "default" : "pointer", fontFamily: "'Barlow', sans-serif", boxShadow: currentSlide < slides.length - 1 ? "0 2px 8px rgba(178,34,52,0.3)" : "none" }}>
            {currentSlide === slides.length - 2 && slides[slides.length - 1]?.slide_type === "signature" ? "Review & Sign →" : "Next →"}
          </button>
        )}
      </div>

      {/* Footer */}
      {!isPreview && <div style={{ textAlign: "center", padding: "24px 16px", borderTop: "1px solid #eee" }}>
        <img src={LOGO} alt="Roof USA" style={{ height: 30, opacity: 0.5 }} />
        <div style={{ fontSize: 10, color: "#bbb", marginTop: 6 }}>Powered by Roof USA · Columbia, MO</div>
      </div>}
    </div>
  );
}


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

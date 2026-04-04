import { useState, useEffect, useCallback, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Package, Plus, Search, Trash2, Edit3, X, Check, ArrowLeft, Users, FileText, RotateCcw, LogOut, Eye, EyeOff, ChevronRight, ChevronDown, Layers, Clock, CheckCircle, XCircle, Printer, Archive, Home, BarChart2, Copy, GripVertical, AlertTriangle, DollarSign, Settings, Download, Camera, ArrowUp, ArrowDown, Image } from "lucide-react";

import { ld, sv, ldL, svL } from "./storage.js";
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
  .nav-wrap{gap:2px!important}
  .nav-wrap button{padding:5px 8px!important;font-size:10px!important}
  table{font-size:11px!important}
  td,th{padding:5px 4px!important}
}
@media(max-width:480px){
  .nav-wrap button{padding:4px 6px!important;font-size:9px!important}
  .nav-wrap svg{width:12px!important;height:12px!important}
}`;

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

// Create OSB note in JobNimbus
async function createOSBNote(order) {
  if (!order.jnJobId || !order.osbDesc) return null;
  try {
    const unit = order.osbQty === 1 ? "sheet" : "sheets";
    const jobName = order.jobName || "job";
    const noteText = order.type === "return"
      ? `Returned ${order.osbQty || 0} ${unit} 7/16 OSB from ${jobName}\nNote: ${order.osbDesc}`
      : `Brought ${order.osbQty || 0} ${unit} 7/16 OSB to ${jobName}\nNote: ${order.osbDesc}`;
    const r = await fetch("/api/jn-finance?action=create_note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: order.jnJobId, note: noteText, typeName: "Wood/Upgrades" }),
    });
    const data = await r.json();
    return data?.result?.data?.jnid || null;
  } catch (e) { console.error("JN note error:", e); return null; }
}

async function deleteOSBNote(noteId) {
  if (!noteId) return;
  try { await fetch("/api/jn-finance?action=update_note", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ noteId, note: "THIS ORDER HAS BEEN DELETED. DISREGARD." }) }); } catch (e) { console.error("JN note delete error:", e); }
}

async function updateOSBNote(noteId, order, newOsbQty) {
  if (!noteId || !order.osbDesc) return;
  try {
    const unit = newOsbQty === 1 ? "sheet" : "sheets";
    const jobName = order.jobName || "job";
    const noteText = order.type === "return"
      ? `Returned ${newOsbQty} ${unit} 7/16 OSB from ${jobName}\nNote: ${order.osbDesc}`
      : `Brought ${newOsbQty} ${unit} 7/16 OSB to ${jobName}\nNote: ${order.osbDesc}`;
    await fetch("/api/jn-finance?action=update_note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteId, note: noteText }),
    });
  } catch (e) { console.error("JN note update error:", e); }
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

  // Set favicon to Roof USA logo
  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']") || document.createElement("link");
    link.rel = "icon"; link.type = "image/png"; link.href = LOGO;
    document.head.appendChild(link);
    document.title = "Roofus Portal — Roof USA";
  }, []);

  const sU = useCallback((u) => { setUsers(u); sv("users", u); }, []);
  const sI = useCallback((i) => { setItems(i); sv("items", i); }, []);
  const sO = useCallback((o) => { setOrders(o); sv("orders", o); }, []);
  const sT = useCallback((t) => { setTemplates(t); sv("templates", t); }, []);
  const sSh = useCallback((s) => { setShrinkLog(s); sv("shrinkage", s); }, []);
  const sTJ = useCallback((j) => { setTrackedJobs(j); sv("tracked_jobs", j); }, []);
  const login = useCallback(async (u) => { setUser(u); setPg("home"); await svL("sess", { uid: u.id }); }, []);
  const logout = useCallback(async () => { setUser(null); setPg("home"); try { localStorage.removeItem("roofus_sess"); } catch {} }, []);
  const isA = user?.role === "admin";
  const isM = user?.role === "manager";
  const canApprove = isA;
  const canEditOrders = true; // everyone can edit
  const canDeleteOrders = isA || isM;
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
          {isA && <NavBtn icon={BarChart2} label="Material Reports" active={pg === "reports"} onClick={() => setPg("reports")} />}

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
        {pg === "jobs" && (isA || isM) && <JobTracker jobs={trackedJobs} sJ={sTJ} orders={orders} items={items} nav={setPg} />}
        {pg === "reports" && isA && <Reports orders={orders} items={items} shrinkLog={shrinkLog} />}
        {pg === "settings" && isA && <SettingsPage users={users} sU={sU} me={user} items={items} orders={orders} templates={templates} shrinkLog={shrinkLog} />}
      </div>
      {vOrd && <OrderPDF order={vOrd} items={items} onClose={() => setVOrd(null)}
        onDelete={canDeleteOrders ? (id) => {
          const ord = orders.find((o) => o.id === id);
          if (ord) {
            if (ord.jnFileId) deleteFromJN(ord.jnFileId);
            if (ord.osbNoteId) deleteOSBNote(ord.osbNoteId);
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
          // Update OSB note if qty changed
          if (updatedOrd.osbNoteId && updatedOrd.osbDesc) {
            const iMap2 = Object.fromEntries(items.map((i) => [i.id, i]));
            const newOsbQty = newLines.filter(l => (iMap2[l.itemId]?.name || "").toLowerCase() === "7/16 osb").reduce((s,l) => s + l.qty, 0);
            if (newOsbQty > 0) {
              updateOSBNote(updatedOrd.osbNoteId, updatedOrd, newOsbQty);
              sO((prev) => prev.map((o) => o.id === id ? { ...o, osbQty: newOsbQty } : o));
            } else {
              deleteOSBNote(updatedOrd.osbNoteId);
              sO((prev) => prev.map((o) => o.id === id ? { ...o, osbNoteId: "", osbDesc: "", osbQty: 0 } : o));
            }
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
  const [osbPrompt, setOsbPrompt] = useState(false);
  const [osbDesc, setOsbDesc] = useState("");

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

  const osbLines = lines.filter(l => (iMap[l.itemId]?.name || "").toLowerCase() === "7/16 osb");
  const hasOSB = osbLines.length > 0;
  const osbQty = osbLines.reduce((s,l) => s + l.qty, 0);
  const osbUnit = iMap[osbLines[0]?.itemId]?.unit || "sheet";

  const submit = () => {
    if (!lines.length || !allOptionsSet) return;
    if (hasOSB && !osbDesc.trim()) { setOsbPrompt(true); return; }
    const ord = { id: uid(), type, userId: user.id, userName: user.name, poNumber: "", jobName: job.trim(), jobAddress: addr.trim(), notes: notes.trim(), jnJobId: jnJobId || "", osbDesc: hasOSB ? osbDesc.trim() : "", osbQty: hasOSB ? osbQty : 0, date: new Date().toISOString(), status: "pending", lines: lines.map((l) => ({ itemId: l.itemId, qty: l.qty, option: l.option, unitCost: l.unitCost, markupCost: l.markupCost, supplierCost: l.supplierCost || 0 })) };
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
      {osbPrompt&&<Modal open onClose={()=>setOsbPrompt(false)} title="OSB Description Required">
        <div style={{padding:"4px 0"}}>
          <p style={{fontSize:14,color:C.t2,marginBottom:16}}>This {type==="return"?"return":"order"} includes <strong>{osbQty} {osbUnit}{osbQty!==1?"s":""} of 7/16 OSB</strong>. Please describe why the wood is needed{type==="return"?" or why it's being returned":""}.</p>
          <Fld label="Description (required)"><textarea value={osbDesc} onChange={(e)=>setOsbDesc(e.target.value)} placeholder={type==="return"?"e.g. Unused sheets, no damage found":"e.g. Water damage on north side of roof, replacing 3 sheets"} rows={3} style={{...inp,resize:"vertical",minHeight:80}}/></Fld>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:12}}>
            <button onClick={()=>setOsbPrompt(false)} style={{...bS,borderRadius:10}}>Cancel</button>
            <button onClick={()=>{if(osbDesc.trim()){setOsbPrompt(false);setTimeout(submit,50);}}} disabled={!osbDesc.trim()} style={{...bP,borderRadius:10,opacity:osbDesc.trim()?1:0.5}}><Check size={14}/> Continue & Submit</button>
          </div>
        </div>
      </Modal>}
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
    // Create OSB note in JN if applicable
    let osbNoteId = null;
    if (approvedOrder.osbDesc && approvedOrder.jnJobId) {
      osbNoteId = await createOSBNote(approvedOrder);
    }
    sO(orders.map((o) => o.id === id ? { ...approvedOrder, jnFileId: jnFileId || o.jnFileId || "", osbNoteId: osbNoteId || "" } : o));
  };
  const reject = (id) => { if (confirm("Reject this order?")) sO(orders.map((o) => o.id === id ? { ...o, status: "rejected", approvedDate: new Date().toISOString() } : o)); };
  const deleteOrder = (id) => {
    const ord = orders.find((o) => o.id === id);
    if (ord?.jnFileId) deleteFromJN(ord.jnFileId);
    if (ord?.osbNoteId) deleteOSBNote(ord.osbNoteId);
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
                {o.osbDesc&&<div style={{fontSize:12,marginTop:4,padding:"6px 10px",background:C.wrn+"12",borderRadius:6,border:`1px solid ${C.wrn}33`}}><strong style={{color:C.wrn}}>OSB Note:</strong> <span style={{color:C.txt}}>{o.osbQty} {o.osbQty===1?"sheet":"sheets"} — {o.osbDesc}</span></div>}
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
function JobTracker({ jobs, sJ, orders, items, nav }) {
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
  const [jnFinance, setJnFinance] = useState({});
  const [finLoading, setFinLoading] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [showJobReports, setShowJobReports] = useState(false);
  const [reportRange, setReportRange] = useState("all");

  const fetchFinance = useCallback(async () => {
    setFinLoading(true);
    try {
      const r = await fetch("/api/jn-finance?action=invoices");
      const d = await r.json();
      if (d.ok && d.byJob) setJnFinance(d.byJob);
    } catch (e) { console.error("Finance fetch error:", e); }
    setFinLoading(false);
  }, []);

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
      // Fetch invoice/payment data from JN
      fetchFinance();
    })();
  }, []);

  const STATUSES = ["in_progress","waiting_invoices","closed"];
  const SL = { in_progress:"Job In Progress", waiting_invoices:"Waiting on Invoices", closed:"Closed" };
  const SC = { in_progress:{bg:C.wrn+"15",c:C.wrn}, waiting_invoices:{bg:NAVY+"15",c:NAVY}, closed:{bg:C.grn+"15",c:C.grn} };

  const calcJob = (j) => {
    const contract = j.contractAmount || 0;
    const costs = (j.costs || []).reduce((s,c) => s + (c.amount||0), 0);
    const linked = orders.filter((o) => o.jnJobId && o.jnJobId === j.jnJobId && o.status === "approved");
    const matOrd = linked.reduce((s,o) => { const lt = (o.lines||[]).reduce((s2,l) => s2 + l.qty*(l.markupCost||l.unitCost||0), 0); return s + (o.type === "return" ? -lt : lt); }, 0);
    const total = costs + matOrd;
    const projGP$ = contract * ((j.projectedGP||0)/100);
    const actGP$ = contract - total;
    const actGP = contract > 0 ? (actGP$/contract)*100 : 0;
    const variance = actGP$ - projGP$;
    const labor = (j.costs||[]).filter(c=>c.category==="labor").reduce((s,c)=>s+(c.amount||0),0);
    const mat = (j.costs||[]).filter(c=>c.category==="material").reduce((s,c)=>s+(c.amount||0),0) + matOrd;
    const other = (j.costs||[]).filter(c=>c.category==="other").reduce((s,c)=>s+(c.amount||0),0);
    // JN invoice data
    const invoices = (j.jnJobId && jnFinance[j.jnJobId]) || [];
    const invoiced = invoices.reduce((s,i) => s + (i.total||0), 0);
    const collected = invoices.reduce((s,i) => s + (i.paid||0), 0);
    const balance = invoiced - collected;
    const unbilled = contract - invoiced;
    return { ...j, totalCosts:total, projGP$, actGP$, actGP, variance, labor, mat, other, matOrd, linkedOrders:linked, invoices, invoiced, collected, balance, unbilled };
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
  const totCollected = allCalc.reduce((s,j)=>s+j.collected,0);
  const totInvoiced = allCalc.reduce((s,j)=>s+j.invoiced,0);

  const addJob = () => { if (!nName.trim()) return; sJ([...jobs, { id:uid(), jnJobId:nJnId, name:nName.trim(), address:nAddr.trim(), contractAmount:+nContract||0, projectedGP:+nGP||0, isInsurance:nInsurance, status:"in_progress", costs:[], notes:"", createdDate:new Date().toISOString(), completedDate:"" }]); setNName(""); setNAddr(""); setNContract(""); setNGP("35"); setNInsurance(false); setNJnId(""); setJnSearch(""); setAddModal(false); };
  const addCost = (jid) => { if (!cDesc.trim()||!cAmt) return; sJ(jobs.map(j=>j.id===jid?{...j,costs:[...(j.costs||[]),{id:uid(),category:cCat,description:cDesc.trim(),amount:+cAmt||0,date:new Date().toISOString()}]}:j)); setCDesc(""); setCAmt(""); setCCat("labor"); };
  const deleteCost = (jid,cid) => { sJ(jobs.map(j=>j.id===jid?{...j,costs:(j.costs||[]).filter(c=>c.id!==cid)}:j)); };
  const updateJob = (jid,upd) => { sJ(jobs.map(j=>j.id===jid?{...j,...upd}:j)); };


  // ── JOB DETAIL ──
  if (editJob) {
    const j = calcJob(editJob);
    const sc = SC[j.status]||SC.in_progress;
    return (
      <>
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
            {[{l:"Contract",v:fmt$(j.contractAmount),bg:C.sf,c:C.txt},{l:"Total Costs",v:fmt$(j.totalCosts),bg:C.sf,c:C.red},{l:"Invoiced",v:fmt$(j.invoiced),bg:NAVY+"10",c:NAVY},{l:"Collected",v:fmt$(j.collected),bg:C.grn+"10",c:j.collected>0?C.grn:C.t2},{l:"Actual GP",v:fmt$(j.actGP$)+" ("+j.actGP.toFixed(1)+"%)",bg:j.actGP>=(j.projectedGP||0)?C.grn+"10":C.red+"10",c:j.actGP>=0?C.grn:C.red},{l:"Variance",v:(j.variance>=0?"+":"")+fmt$(j.variance),bg:j.variance>=0?C.grn+"10":C.red+"10",c:j.variance>=0?C.grn:C.red}].map((m,i)=>(
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
              {(j.linkedOrders||[]).map(ord=>{const ordTotal=(ord.lines||[]).reduce((s,l)=>s+l.qty*(l.markupCost||l.unitCost||0),0); const isRet=ord.type==="return"; return (
                <div key={ord.id} onClick={()=>setViewOrder(ord)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.brd}`,cursor:"pointer",transition:"background .15s",borderRadius:4}} onMouseEnter={(e)=>{e.currentTarget.style.background=C.sf;}} onMouseLeave={(e)=>{e.currentTarget.style.background="transparent";}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:4,background:isRet?C.grn+"15":RED+"15",color:isRet?C.grn:RED}}>{isRet?"return":"material"}</span>
                    <span style={{fontSize:13,fontWeight:600}}>{ord.jobName||"Material Order"}</span>
                    <span style={{fontSize:11,color:C.t2}}>{fD(ord.date)}</span>
                    <span style={{fontSize:10,color:C.blu,fontWeight:600}}>View →</span>
                  </div>
                  <span style={{fontFamily:MN,fontWeight:700,fontSize:14,color:isRet?C.grn:C.txt}}>{isRet?"-":""}{fmt$(ordTotal)}</span>
                </div>
              );})}
              {j.totalCosts>0&&<div style={{marginTop:12,paddingTop:12,borderTop:`2px solid ${C.brd}`}}>
                {j.labor>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:C.blu,fontWeight:600}}>Labor</span><span style={{fontFamily:MN}}>{fmt$(j.labor)}</span></div>}
                {j.mat>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:RED,fontWeight:600}}>Materials</span><span style={{fontFamily:MN}}>{fmt$(j.mat)}</span></div>}
                {j.other>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:C.wrn,fontWeight:600}}>Other</span><span style={{fontFamily:MN}}>{fmt$(j.other)}</span></div>}
                <div style={{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:800,marginTop:8,paddingTop:8,borderTop:`1px solid ${C.brd}`}}><span>Total</span><span style={{fontFamily:MN,color:C.red}}>{fmt$(j.totalCosts)}</span></div>
              </div>}
            </div>
            {/* ── INCOME FROM JOBNIMBUS ── */}
            <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.brd}`,padding:24,boxShadow:"0 2px 8px rgba(0,0,0,0.04)",marginTop:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{fontSize:13,fontWeight:700,color:C.t2,textTransform:"uppercase",letterSpacing:".08em"}}>Income from JobNimbus</div>
                <button onClick={fetchFinance} disabled={finLoading} style={{...bS,borderRadius:8,padding:"6px 12px",fontSize:11,opacity:finLoading?0.5:1}}><RotateCcw size={11}/> {finLoading?"Syncing...":"Refresh"}</button>
              </div>
              {!j.jnJobId&&<div style={{padding:16,textAlign:"center",color:C.t2,fontSize:13}}>Not linked to JobNimbus — no invoice data available.</div>}
              {j.jnJobId&&!j.invoices.length&&!finLoading&&<div style={{padding:16,textAlign:"center",color:C.t2,fontSize:13}}>No invoices found in JobNimbus for this job.</div>}
              {j.jnJobId&&finLoading&&!j.invoices.length&&<div style={{padding:16,textAlign:"center",color:C.t2,fontSize:13}}>Loading invoices...</div>}
              {j.invoices.map(inv=>{
                const isPaid = inv.paid >= inv.total && inv.total > 0;
                const isPartial = inv.paid > 0 && inv.paid < inv.total;
                return (
                <div key={inv.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.brd}`}}>
                  <div>
                    <span style={{fontSize:13,fontWeight:700}}>Invoice #{inv.number}</span>
                    <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,marginLeft:8,background:isPaid?C.grn+"15":isPartial?C.wrn+"15":C.red+"15",color:isPaid?C.grn:isPartial?C.wrn:C.red}}>{isPaid?"Paid":isPartial?"Partial":inv.status||"Unpaid"}</span>
                    {inv.created&&<span style={{fontSize:11,color:C.t2,marginLeft:8}}>{fD(inv.created*1000)}</span>}
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:MN,fontWeight:700,fontSize:14}}>{fmt$(inv.total)}</div>
                    {isPartial&&<div style={{fontSize:10,color:C.grn,fontWeight:600}}>Paid: {fmt$(inv.paid)}</div>}
                    {!isPaid&&inv.due>0&&<div style={{fontSize:10,color:C.red,fontWeight:600}}>Due: {fmt$(inv.due)}</div>}
                  </div>
                </div>
              );})}
              {j.invoices.length>0&&<div style={{marginTop:12,paddingTop:12,borderTop:`2px solid ${C.brd}`}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:NAVY,fontWeight:600}}>Total Invoiced</span><span style={{fontFamily:MN}}>{fmt$(j.invoiced)}</span></div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:C.grn,fontWeight:600}}>Total Collected</span><span style={{fontFamily:MN,color:C.grn}}>{fmt$(j.collected)}</span></div>
                {j.balance>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:C.red,fontWeight:600}}>Balance Due</span><span style={{fontFamily:MN,color:C.red}}>{fmt$(j.balance)}</span></div>}
                {j.unbilled>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:C.t2,fontWeight:600}}>Unbilled</span><span style={{fontFamily:MN,color:C.t2}}>{fmt$(j.unbilled)}</span></div>}
                <div style={{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:800,marginTop:8,paddingTop:8,borderTop:`1px solid ${C.brd}`}}><span>Collected</span><span style={{fontFamily:MN,color:C.grn}}>{fmt$(j.collected)}</span></div>
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
      {viewOrder&&<OrderPDF order={viewOrder} items={items} onClose={()=>setViewOrder(null)} />}
      </>
    );
  }

  // ── LIST ──
  const isHistory = view === "history";
  const activeList = filtered.filter(j=>j.status!=="closed");
  const historyList = filtered.filter(j=>j.status==="closed");
  // Active: waiting_invoices first (oldest), then in_progress (oldest to newest)
  if (sortBy === "date") {
    activeList.sort((a,b) => { const sp={waiting_invoices:0,in_progress:1}; const pa=sp[a.status]??1, pb=sp[b.status]??1; if(pa!==pb) return pa-pb; return new Date(a.createdDate||0)-new Date(b.createdDate||0); });
    historyList.sort((a,b) => new Date(b.completedDate||b.createdDate||0)-new Date(a.completedDate||a.createdDate||0));
  }
  const listJobs = isHistory ? historyList : activeList;
  const activeStatuses = STATUSES.filter(s=>s!=="closed");

  // ── REPORT DATA ──
  const now = Date.now();
  const rangeMs = {all:0,"30":30*86400000,"90":90*86400000,"180":180*86400000,"365":365*86400000};
  const rClosed = closedJ.filter(j => reportRange==="all" || (j.completedDate && (now - new Date(j.completedDate).getTime()) < rangeMs[reportRange]));
  const rAll = allCalc.filter(j => reportRange==="all" || (j.createdDate && (now - new Date(j.createdDate).getTime()) < rangeMs[reportRange]));
  const rAvgContract = rClosed.length ? rClosed.reduce((s,j)=>s+j.contractAmount,0)/rClosed.length : 0;
  const rAvgGP = rClosed.length ? rClosed.reduce((s,j)=>s+j.actGP,0)/rClosed.length : 0;
  const rAvgGP$ = rClosed.length ? rClosed.reduce((s,j)=>s+j.actGP$,0)/rClosed.length : 0;
  const rAvgProjGP = rClosed.length ? rClosed.reduce((s,j)=>s+(j.projectedGP||0),0)/rClosed.length : 0;
  const rTotContract = rClosed.reduce((s,j)=>s+j.contractAmount,0);
  const rTotCosts = rClosed.reduce((s,j)=>s+j.totalCosts,0);
  const rTotLabor = rClosed.reduce((s,j)=>s+j.labor,0);
  const rTotMat = rClosed.reduce((s,j)=>s+j.mat,0);
  const rTotOther = rClosed.reduce((s,j)=>s+j.other,0);
  const rLaborPct = rTotContract>0 ? (rTotLabor/rTotContract*100) : 0;
  const rMatPct = rTotContract>0 ? (rTotMat/rTotContract*100) : 0;
  const rOtherPct = rTotContract>0 ? (rTotOther/rTotContract*100) : 0;
  const rTotInvoiced = rAll.reduce((s,j)=>s+j.invoiced,0);
  const rTotCollected = rAll.reduce((s,j)=>s+j.collected,0);
  const rCollectionRate = rTotInvoiced>0 ? (rTotCollected/rTotInvoiced*100) : 0;
  const rInsurance = rClosed.filter(j=>j.isInsurance);
  const rRetail = rClosed.filter(j=>!j.isInsurance);
  const rInsGP = rInsurance.length ? rInsurance.reduce((s,j)=>s+j.actGP,0)/rInsurance.length : 0;
  const rRetGP = rRetail.length ? rRetail.reduce((s,j)=>s+j.actGP,0)/rRetail.length : 0;
  const rInsAvgContract = rInsurance.length ? rInsurance.reduce((s,j)=>s+j.contractAmount,0)/rInsurance.length : 0;
  const rRetAvgContract = rRetail.length ? rRetail.reduce((s,j)=>s+j.contractAmount,0)/rRetail.length : 0;
  const fade = rClosed.filter(j=>j.variance<-500).sort((a,b)=>a.variance-b.variance);
  const wins = rClosed.filter(j=>j.variance>500).sort((a,b)=>b.variance-a.variance);
  const unbilled = rAll.filter(j=>j.jnJobId&&j.contractAmount>0&&j.unbilled>500);
  // GP trend by month
  const monthMap = {};
  rClosed.forEach(j => { const d = new Date(j.completedDate||j.createdDate); const k = d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0"); if(!monthMap[k]) monthMap[k]={month:k,count:0,totalGP:0}; monthMap[k].count++; monthMap[k].totalGP+=j.actGP; });
  const gpTrend = Object.values(monthMap).map(m=>({month:m.month,gp:+(m.totalGP/m.count).toFixed(1)})).sort((a,b)=>a.month.localeCompare(b.month)).slice(-12);

  const dBtn = (label, icon, open, onClick, color) => (
    <button onClick={onClick} style={{flex:"1 1 200px",display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"18px 24px",background:open?color:C.card,color:open?"#fff":color,border:`2px solid ${color}`,borderRadius:14,fontSize:16,fontWeight:800,cursor:"pointer",transition:"all .2s",fontFamily:BC,letterSpacing:".03em"}}>
      {icon} {label} <ChevronDown size={18} style={{transform:open?"rotate(180deg)":"rotate(0)",transition:"transform .2s"}}/>
    </button>
  );

  return (
    <div className="fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div><h1 style={{fontSize:26,fontWeight:900,fontFamily:BC}}>JOBS</h1><p style={{color:C.t2,fontSize:14,marginTop:4}}>{jobs.length} total · {activeJ.length} active · {closedJ.length} closed</p></div>
        <div style={{display:"flex",gap:8}}><button onClick={fetchFinance} disabled={finLoading} style={{...bS,borderRadius:10,padding:"10px 16px",fontSize:13,opacity:finLoading?0.5:1}}><RotateCcw size={14}/> {finLoading?"Syncing...":"Sync JN"}</button><button onClick={()=>setAddModal(true)} style={{...bP,borderRadius:10,padding:"10px 16px",fontSize:13}}><Plus size={14}/> Add Job</button></div>
      </div>

      {/* ACTIVE / HISTORY TABS */}
      <div style={{display:"flex",gap:4,marginBottom:16}}>
        <button onClick={()=>setView("list")} style={{...(!isHistory?bP:bS),borderRadius:10,padding:"10px 20px",fontSize:14,fontWeight:700}}>Active Jobs ({activeJ.length})</button>
        <button onClick={()=>setView("history")} style={{...(isHistory?bP:bS),borderRadius:10,padding:"10px 20px",fontSize:14,fontWeight:700}}>History ({closedJ.length})</button>
      </div>

      {/* REPORT DROPDOWNS */}
      <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        {dBtn("Job Gross Profit",<DollarSign size={20}/>,showJobReports,()=>setShowJobReports(!showJobReports),NAVY)}
        {dBtn("Material Reports",<Package size={20}/>,false,()=>nav("reports"),RED)}
      </div>

      {showJobReports&&<div style={{background:C.card,borderRadius:16,border:`2px solid ${NAVY}22`,padding:24,marginBottom:20,boxShadow:"0 4px 16px rgba(0,0,0,0.06)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:8}}>
          <h2 style={{fontSize:20,fontWeight:900,fontFamily:BC,color:NAVY}}>JOB GROSS PROFIT REPORTS</h2>
          <select value={reportRange} onChange={(e)=>setReportRange(e.target.value)} style={{...inp,width:"auto",minWidth:130,borderRadius:10,padding:"10px 14px",fontSize:13,fontWeight:600,cursor:"pointer"}}><option value="all">All Time</option><option value="30">Last 30 Days</option><option value="90">Last 90 Days</option><option value="180">Last 6 Months</option><option value="365">Last 12 Months</option></select>
        </div>

        {/* SUMMARY CARDS */}
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20}}>
          {[{l:"Closed Jobs",v:rClosed.length,c:C.blu},{l:"Avg Contract",v:fmt$(rAvgContract),c:C.txt},{l:"Avg GP%",v:rAvgGP.toFixed(1)+"%",c:rAvgGP>=rAvgProjGP?C.grn:C.red},{l:"Avg GP$",v:fmt$(rAvgGP$),c:rAvgGP$>=0?C.grn:C.red},{l:"Collection Rate",v:rCollectionRate.toFixed(0)+"%",c:rCollectionRate>=90?C.grn:C.wrn}].map((s,i)=>(
            <div key={i} style={{flex:"1 1 140px",background:C.sf,borderRadius:12,padding:"14px 16px",textAlign:"center"}}><div style={{fontSize:10,color:C.t2,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",marginBottom:4}}>{s.l}</div><div style={{fontSize:22,fontWeight:900,color:s.c,fontFamily:MN}}>{s.v}</div></div>
          ))}
        </div>

        {/* PROJECTED VS ACTUAL */}
        <div style={{background:C.sf,borderRadius:14,padding:20,marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:700,color:C.t2,textTransform:"uppercase",letterSpacing:".08em",marginBottom:14}}>Projected vs Actual GP%</div>
          <div style={{display:"flex",gap:20,flexWrap:"wrap",alignItems:"center"}}>
            <div style={{flex:"1 1 150px",textAlign:"center"}}><div style={{fontSize:12,color:C.t2,marginBottom:4}}>Projected</div><div style={{fontSize:32,fontWeight:900,color:C.blu,fontFamily:MN}}>{rAvgProjGP.toFixed(1)}%</div></div>
            <div style={{fontSize:24,color:C.t2}}>→</div>
            <div style={{flex:"1 1 150px",textAlign:"center"}}><div style={{fontSize:12,color:C.t2,marginBottom:4}}>Actual</div><div style={{fontSize:32,fontWeight:900,color:rAvgGP>=rAvgProjGP?C.grn:C.red,fontFamily:MN}}>{rAvgGP.toFixed(1)}%</div></div>
            <div style={{flex:"1 1 150px",textAlign:"center"}}><div style={{fontSize:12,color:C.t2,marginBottom:4}}>Difference</div><div style={{fontSize:32,fontWeight:900,color:(rAvgGP-rAvgProjGP)>=0?C.grn:C.red,fontFamily:MN}}>{(rAvgGP-rAvgProjGP)>=0?"+":""}{(rAvgGP-rAvgProjGP).toFixed(1)}%</div></div>
          </div>
        </div>

        {/* COST AS % OF CONTRACT */}
        {rTotContract>0&&<div style={{background:C.sf,borderRadius:14,padding:20,marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:700,color:C.t2,textTransform:"uppercase",letterSpacing:".08em",marginBottom:14}}>Avg Cost as % of Contract (Closed Jobs)</div>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            {[{l:"Labor",v:rLaborPct,c:C.blu},{l:"Materials",v:rMatPct,c:RED},{l:"Other",v:rOtherPct,c:C.wrn}].map(c=>(
              <div key={c.l} style={{flex:"1 1 150px",textAlign:"center"}}>
                <div style={{fontSize:28,fontWeight:900,color:c.c,fontFamily:MN}}>{c.v.toFixed(1)}%</div>
                <div style={{fontSize:12,color:C.t2,marginTop:2}}>{c.l} · {fmt$(c.l==="Labor"?rTotLabor:c.l==="Materials"?rTotMat:rTotOther)}</div>
                <div style={{height:8,background:"#fff",borderRadius:4,marginTop:8}}><div style={{height:8,background:c.c,borderRadius:4,width:Math.min(c.v,100)+"%"}}/></div>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:12,fontSize:13,fontWeight:700,color:C.t2}}>Total Cost: {fmt$(rTotCosts)} of {fmt$(rTotContract)} ({rTotContract>0?(rTotCosts/rTotContract*100).toFixed(1):0}%)</div>
        </div>}

        {/* INSURANCE VS RETAIL */}
        {(rInsurance.length>0||rRetail.length>0)&&<div style={{background:C.sf,borderRadius:14,padding:20,marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:700,color:C.t2,textTransform:"uppercase",letterSpacing:".08em",marginBottom:14}}>Insurance vs Retail</div>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            {[{l:"Insurance",count:rInsurance.length,gp:rInsGP,contract:rInsAvgContract,c:C.blu},{l:"Retail",count:rRetail.length,gp:rRetGP,contract:rRetAvgContract,c:C.wrn}].map(t=>(
              <div key={t.l} style={{flex:"1 1 200px",background:"#fff",borderRadius:12,padding:16,border:`1px solid ${C.brd}`}}>
                <div style={{fontSize:14,fontWeight:800,color:t.c,marginBottom:10}}>{t.l} ({t.count} jobs)</div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6}}><span style={{color:C.t2}}>Avg GP%</span><span style={{fontWeight:700,fontFamily:MN}}>{t.gp.toFixed(1)}%</span></div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}><span style={{color:C.t2}}>Avg Contract</span><span style={{fontWeight:700,fontFamily:MN}}>{fmt$(t.contract)}</span></div>
              </div>
            ))}
          </div>
        </div>}

        {/* GP TREND BY MONTH */}
        {gpTrend.length>1&&<div style={{background:C.sf,borderRadius:14,padding:20,marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:700,color:C.t2,textTransform:"uppercase",letterSpacing:".08em",marginBottom:14}}>GP% Trend by Month</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={gpTrend}><CartesianGrid strokeDasharray="3 3" stroke={C.brd}/><XAxis dataKey="month" tick={{fontSize:10}} stroke={C.t2}/><YAxis tick={{fontSize:10}} stroke={C.t2} unit="%"/><Tooltip formatter={(v)=>v+"%"}/><Bar dataKey="gp" fill={NAVY} radius={[4,4,0,0]}/></BarChart>
          </ResponsiveContainer>
        </div>}

        {/* PROFIT FADE */}
        {fade.length>0&&<div style={{background:"#fff",borderRadius:14,border:`1px solid ${C.brd}`,padding:20,marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:700,color:C.red,textTransform:"uppercase",letterSpacing:".08em",marginBottom:12}}>Profit Fade — Underperforming ({fade.length})</div>
          {fade.slice(0,10).map(j=>(<div key={j.id} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.brd}`,alignItems:"center"}}><div><div style={{fontWeight:700,fontSize:14}}>{j.name}</div><div style={{fontSize:11,color:C.t2}}>{j.address}</div></div><div style={{textAlign:"right"}}><div style={{fontWeight:800,color:C.red,fontFamily:MN}}>{fmt$(j.variance)}</div><div style={{fontSize:10,color:C.t2}}>Proj {j.projectedGP}% → Actual {j.actGP.toFixed(1)}%</div></div></div>))}
        </div>}

        {/* PROFIT WINS */}
        {wins.length>0&&<div style={{background:"#fff",borderRadius:14,border:`1px solid ${C.brd}`,padding:20,marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:700,color:C.grn,textTransform:"uppercase",letterSpacing:".08em",marginBottom:12}}>Profit Wins — Overperforming ({wins.length})</div>
          {wins.slice(0,10).map(j=>(<div key={j.id} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.brd}`,alignItems:"center"}}><div><div style={{fontWeight:700,fontSize:14}}>{j.name}</div><div style={{fontSize:11,color:C.t2}}>{j.address}</div></div><div style={{textAlign:"right"}}><div style={{fontWeight:800,color:C.grn,fontFamily:MN}}>+{fmt$(j.variance)}</div><div style={{fontSize:10,color:C.t2}}>Proj {j.projectedGP}% → Actual {j.actGP.toFixed(1)}%</div></div></div>))}
        </div>}

        {/* UNBILLED JOBS */}
        {unbilled.length>0&&<div style={{background:"#fff",borderRadius:14,border:`1px solid ${C.brd}`,padding:20}}>
          <div style={{fontSize:12,fontWeight:700,color:C.wrn,textTransform:"uppercase",letterSpacing:".08em",marginBottom:12}}>Unbilled — Contract {'>'} Invoiced ({unbilled.length})</div>
          {unbilled.slice(0,10).map(j=>(<div key={j.id} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.brd}`,alignItems:"center"}}><div><div style={{fontWeight:700,fontSize:14}}>{j.name}</div><div style={{fontSize:11,color:C.t2}}>{j.address}</div></div><div style={{textAlign:"right"}}><div style={{fontWeight:700,fontFamily:MN}}>{fmt$(j.contractAmount)}</div><div style={{fontSize:10,color:C.t2}}>Invoiced: {fmt$(j.invoiced)} · Unbilled: <span style={{color:C.wrn,fontWeight:700}}>{fmt$(j.unbilled)}</span></div></div></div>))}
        </div>}

        {!rClosed.length&&<div style={{padding:30,textAlign:"center",color:C.t2,fontSize:14}}>No closed jobs in this time range. Close some jobs to see reports.</div>}
      </div>}

      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:20}}>
        {[{l:"Active",v:activeJ.length,c:C.blu},{l:"Proj Profit",v:fmt$(totProjProfit),c:C.blu},{l:"Invoiced",v:fmt$(totInvoiced),c:NAVY},{l:"Collected",v:fmt$(totCollected),c:C.grn},{l:"Closed",v:closedJ.length,c:C.grn},{l:"Actual Profit",v:fmt$(totActProfit),c:totActProfit>=0?C.grn:C.red}].map((s,i)=>(
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
              <div style={{textAlign:"center",minWidth:80}}><div style={{fontSize:10,color:C.t2,fontWeight:600,marginBottom:2}}>Invoiced</div><div style={{fontSize:16,fontWeight:800,fontFamily:MN,color:NAVY}}>{j.invoiced>0?fmt$(j.invoiced):"—"}</div></div>
              <div style={{textAlign:"center",minWidth:80}}><div style={{fontSize:10,color:C.t2,fontWeight:600,marginBottom:2}}>Collected</div><div style={{fontSize:16,fontWeight:800,fontFamily:MN,color:j.collected>0?C.grn:C.t2}}>{j.collected>0?fmt$(j.collected):"—"}</div></div>
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
      {viewOrder&&<OrderPDF order={viewOrder} items={items} onClose={()=>setViewOrder(null)} />}
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

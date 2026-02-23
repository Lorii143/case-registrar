import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED_CASES = [
  { id:1,  caseCode:"CR-2024-001", year:2024, court:"High Court",        region:"Nairobi",      county:"Nairobi",   caseType:"Criminal",       status:"Open",      closureType:"",          filingDate:"2024-01-15", lastUpdated:"2024-06-10", outcomes:"Pending hearing" },
  { id:2,  caseCode:"CV-2023-045", year:2023, court:"Magistrate Court",  region:"Coast",         county:"Mombasa",   caseType:"Civil",          status:"Closed",    closureType:"Settled",   filingDate:"2023-03-22", lastUpdated:"2023-11-30", outcomes:"Parties reached settlement" },
  { id:3,  caseCode:"FA-2024-012", year:2024, court:"Family Court",      region:"Rift Valley",  county:"Nakuru",    caseType:"Family",         status:"Open",      closureType:"",          filingDate:"2024-02-10", lastUpdated:"2024-07-01", outcomes:"Mediation ongoing" },
  { id:4,  caseCode:"LA-2022-089", year:2022, court:"Labour Court",      region:"Western",       county:"Kisumu",    caseType:"Labour",         status:"Closed",    closureType:"Judgment",  filingDate:"2022-07-14", lastUpdated:"2023-05-20", outcomes:"Ruled in favour of claimant" },
  { id:5,  caseCode:"CR-2024-078", year:2024, court:"High Court",        region:"Central",       county:"Kiambu",    caseType:"Criminal",       status:"Open",      closureType:"",          filingDate:"2024-04-03", lastUpdated:"2024-07-15", outcomes:"Trial in progress" },
  { id:6,  caseCode:"CM-2023-033", year:2023, court:"High Court",        region:"Nairobi",       county:"Nairobi",   caseType:"Commercial",     status:"Closed",    closureType:"Judgment",  filingDate:"2023-05-10", lastUpdated:"2024-01-20", outcomes:"Judgment for plaintiff" },
  { id:7,  caseCode:"LD-2024-004", year:2024, court:"Environment Court", region:"Eastern",       county:"Machakos",  caseType:"Land",           status:"Open",      closureType:"",          filingDate:"2024-03-01", lastUpdated:"2024-06-28", outcomes:"Survey ordered" },
  { id:8,  caseCode:"CR-2023-112", year:2023, court:"Magistrate Court",  region:"Nyanza",        county:"Kisii",     caseType:"Criminal",       status:"Closed",    closureType:"Acquittal", filingDate:"2023-08-15", lastUpdated:"2024-02-11", outcomes:"Accused acquitted" },
  { id:9,  caseCode:"FA-2022-056", year:2022, court:"Family Court",      region:"Coast",         county:"Kilifi",    caseType:"Family",         status:"Closed",    closureType:"Settled",   filingDate:"2022-04-20", lastUpdated:"2023-01-08", outcomes:"Custody agreement signed" },
  { id:10, caseCode:"CO-2024-009", year:2024, court:"High Court",        region:"Nairobi",       county:"Nairobi",   caseType:"Constitutional", status:"Open",      closureType:"",          filingDate:"2024-01-30", lastUpdated:"2024-07-10", outcomes:"Petition admitted" },
  { id:11, caseCode:"LA-2023-077", year:2023, court:"Labour Court",      region:"Rift Valley",  county:"Eldoret",   caseType:"Labour",         status:"Adjourned", closureType:"",          filingDate:"2023-09-05", lastUpdated:"2024-05-17", outcomes:"Awaiting witnesses" },
  { id:12, caseCode:"CV-2024-021", year:2024, court:"Magistrate Court",  region:"North Eastern", county:"Garissa",   caseType:"Civil",          status:"Open",      closureType:"",          filingDate:"2024-02-22", lastUpdated:"2024-07-02", outcomes:"Awaiting response" },
  { id:13, caseCode:"CR-2022-188", year:2022, court:"High Court",        region:"Central",       county:"Nyeri",     caseType:"Criminal",       status:"Closed",    closureType:"Conviction",filingDate:"2022-11-03", lastUpdated:"2023-08-14", outcomes:"Convicted, 5 years imprisonment" },
  { id:14, caseCode:"PR-2023-014", year:2023, court:"High Court",        region:"Western",       county:"Bungoma",   caseType:"Probate",        status:"Closed",    closureType:"Judgment",  filingDate:"2023-01-17", lastUpdated:"2023-10-29", outcomes:"Estate distributed per will" },
  { id:15, caseCode:"LD-2023-061", year:2023, court:"Environment Court", region:"Nyanza",        county:"Homa Bay",  caseType:"Land",           status:"On Appeal", closureType:"",          filingDate:"2023-06-08", lastUpdated:"2024-04-22", outcomes:"Appeal lodged at Court of Appeal" },
];

const SEED_REPORTS = [
  { id:1, title:"Annual Justice Report 2023",         org:"Kenya Law Reform Commission",                  date:"2024-02-01", type:"Annual Report",       description:"Comprehensive review of judicial outcomes and case statistics for the year 2023." },
  { id:2, title:"Gender & Access to Justice Study",   org:"International Justice Monitor",                date:"2023-11-15", type:"Research",             description:"Analysis of gender disparities in court representation and outcomes across 5 regions." },
  { id:3, title:"Court Backlog Reduction Strategy",   org:"Judiciary Performance Unit",                   date:"2024-05-10", type:"Policy Paper",         description:"Strategic framework for reducing case backlog in magistrate and high courts." },
  { id:4, title:"Q1 2024 Case Statistics Bulletin",   org:"National Council on Administration of Justice",date:"2024-04-30", type:"Quarterly Bulletin",   description:"Quarterly statistical summary of filed, concluded and pending cases nationwide." },
  { id:5, title:"Access to Justice in Arid Regions",  org:"UNHCR Kenya",                                 date:"2024-01-20", type:"Research",             description:"Study on justice access barriers in North Eastern and arid counties of Kenya." },
];

const COURTS       = ["High Court","Magistrate Court","Family Court","Labour Court","Environment Court","Appeals Court"];
const REGIONS      = ["Nairobi","Coast","Rift Valley","Central","Western","Eastern","North Eastern","Nyanza"];
const COUNTIES     = ["Nairobi","Mombasa","Nakuru","Kisumu","Kiambu","Machakos","Eldoret","Nyeri","Kisii","Thika","Kilifi","Garissa","Bungoma","Homa Bay","Meru"];
const CASE_TYPES   = ["Criminal","Civil","Family","Labour","Constitutional","Commercial","Land","Probate"];
const STATUSES     = ["Open","Closed","Adjourned","On Appeal"];
const CLOSURE_TYPES= ["Settled","Judgment","Withdrawn","Dismissed","Acquittal","Conviction"];
const USERS        = [
  { username:"admin", password:"admin123", role:"admin", name:"Admin User" },
  { username:"staff", password:"staff123", role:"staff", name:"Staff User" },
];

const PIE_COLORS = ["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f43f5e","#6366f1"];

// ─── Excel Export (pure JS, no external lib needed) ──────────────────────────
function exportExcel(cases) {
  const headers = ["Case Code","Year","Court","Region","County","Case Type","Status","Closure Type","Filing Date","Last Updated","Outcomes"];
  const rows = cases.map(c => [c.caseCode,c.year,c.court,c.region,c.county,c.caseType,c.status,c.closureType,c.filingDate,c.lastUpdated,c.outcomes]);

  // Build a minimal XLSX file using XML (Office Open XML)
  const xmlEscape = s => String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const allRows = [headers, ...rows];
  let sharedStrings = []; const ssMap = {};
  const si = v => { const k = String(v||""); if (ssMap[k]===undefined){ssMap[k]=sharedStrings.length;sharedStrings.push(k);} return ssMap[k]; };

  const cellXml = allRows.map((row,ri) =>
    `<row r="${ri+1}">${row.map((val,ci) => {
      const col = String.fromCharCode(65+ci);
      const idx = si(val);
      return `<c r="${col}${ri+1}" t="s"><v>${idx}</v></c>`;
    }).join("")}</row>`
  ).join("");

  const sharedStringsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${sharedStrings.length}" uniqueCount="${sharedStrings.length}">${sharedStrings.map(s=>`<si><t>${xmlEscape(s)}</t></si>`).join("")}</sst>`;
  const sheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${cellXml}</sheetData></worksheet>`;
  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Cases" sheetId="1" r:id="rId1"/></sheets></workbook>`;
  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/></Relationships>`;
  const appRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/></Types>`;

  // Use CSV fallback (XLSX binary requires zip which we can't do without a lib; serve as TSV with .xls MIME trick)
  const tsv = [headers, ...rows].map(r => r.join("\t")).join("\n");
  const blob = new Blob([tsv], { type: "application/vnd.ms-excel;charset=utf-8" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "case-registry.xls"; a.click();
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const IS = { width:"100%", background:"#060d1a", border:"1px solid #1e3a5f", borderRadius:8, padding:"9px 12px", color:"#e2e8f0", fontSize:13, boxSizing:"border-box", outline:"none", fontFamily:"inherit" };
const LS = { display:"block", color:"#3a5a7a", fontSize:10.5, textTransform:"uppercase", letterSpacing:1.3, marginBottom:5, fontWeight:700 };

function Badge({ status }) {
  const map = { Open:{ bg:"#042012", color:"#4ade80", bd:"#14532d" }, Closed:{ bg:"#141414", color:"#9ca3af", bd:"#374151" }, Adjourned:{ bg:"#2d1800", color:"#fbbf24", bd:"#78350f" }, "On Appeal":{ bg:"#060f2e", color:"#93c5fd", bd:"#1e3a8a" } };
  const s = map[status]||map.Closed;
  return <span style={{ background:s.bg, color:s.color, border:`1px solid ${s.bd}`, borderRadius:20, padding:"3px 11px", fontSize:11, fontWeight:700, letterSpacing:0.7 }}>{status}</span>;
}

const CTip = ({ active, payload, label }) => {
  if (!active||!payload?.length) return null;
  return <div style={{ background:"#0a1628", border:"1px solid #1e3a5f", borderRadius:10, padding:"10px 16px" }}><p style={{ color:"#64748b", fontSize:11, marginBottom:4 }}>{label}</p>{payload.map((p,i)=><p key={i} style={{ color:p.color||"#3b82f6", fontWeight:700 }}>{p.name||p.dataKey}: {p.value}</p>)}</div>;
};

// ─── Kenya Heatmap ────────────────────────────────────────────────────────────
function RegionHeatmap({ cases }) {
  const [hov, setHov] = useState(null);
  const counts = {};
  REGIONS.forEach(r => counts[r] = cases.filter(c => c.region === r).length);
  const max = Math.max(...Object.values(counts), 1);

  const getClr = n => {
    const r = n / max;
    if (!n) return "#060e1e";
    if (r < 0.2) return "#0c243f";
    if (r < 0.4) return "#0e3866";
    if (r < 0.6) return "#1a5ca0";
    if (r < 0.8) return "#2563eb";
    return "#60a5fa";
  };

  // Simplified Kenya region SVG polygons
  const paths = {
    "North Eastern":"M 62 4 L 97 4 L 97 32 L 78 32 L 62 28 Z",
    "Eastern":      "M 58 28 L 78 32 L 97 32 L 97 62 L 82 62 L 58 56 Z",
    "Coast":        "M 58 56 L 82 62 L 86 90 L 68 92 L 56 80 Z",
    "Rift Valley":  "M 18 16 L 58 16 L 58 28 L 60 44 L 48 56 L 36 50 L 18 52 Z",
    "Nairobi":      "M 48 54 L 56 54 L 58 62 L 50 64 L 46 60 Z",
    "Central":      "M 44 40 L 60 40 L 60 56 L 48 56 L 44 50 Z",
    "Nyanza":       "M 18 52 L 36 50 L 40 62 L 46 70 L 36 80 L 18 74 Z",
    "Western":      "M 8 38 L 18 16 L 18 52 L 10 60 Z",
  };
  const centers = {
    "North Eastern":{ x:76, y:16 }, "Eastern":{ x:72, y:44 }, "Coast":{ x:72, y:72 },
    "Rift Valley":{ x:36, y:36 }, "Nairobi":{ x:52, y:60 }, "Central":{ x:52, y:47 },
    "Nyanza":{ x:30, y:62 }, "Western":{ x:14, y:40 },
  };

  return (
    <div style={{ background:"#080e1e", border:"1px solid #1a3050", borderRadius:14, padding:20 }}>
      <div style={{ marginBottom:14 }}>
        <h3 style={{ color:"#7dd3fc", fontSize:12.5, textTransform:"uppercase", letterSpacing:1.6, fontWeight:700, margin:0 }}>📍 Regional Case Heatmap</h3>
        <p style={{ color:"#2a4a6a", fontSize:11.5, marginTop:3 }}>Hover a region for details</p>
      </div>
      <div style={{ display:"flex", gap:20, alignItems:"flex-start" }}>
        {/* SVG Map */}
        <div style={{ flex:"0 0 auto" }}>
          <svg viewBox="0 0 100 96" style={{ width:220, height:211, display:"block" }}>
            <rect width="100" height="96" rx="6" fill="#040810"/>
            {Object.entries(paths).map(([r,d]) => (
              <path key={r} d={d} fill={getClr(counts[r])} stroke="#0a1828" strokeWidth={0.7}
                style={{ cursor:"pointer", transition:"opacity 0.2s" }} opacity={hov && hov!==r ? 0.4 : 1}
                onMouseEnter={() => setHov(r)} onMouseLeave={() => setHov(null)} />
            ))}
            {Object.entries(centers).map(([r,{x,y}]) => (
              <g key={r}>
                <text x={x} y={y} textAnchor="middle" fontSize={3.2}
                  fill={hov===r ? "#fff" : "#94a3b8"} fontFamily="DM Sans,sans-serif" fontWeight="600" style={{ pointerEvents:"none" }}>
                  {r.replace(" Eastern","E.").replace("Rift Valley","RV").replace("North ","N.")}
                </text>
                <text x={x} y={y+4} textAnchor="middle" fontSize={3.5}
                  fill={hov===r ? "#60a5fa" : getClr(counts[r])} fontFamily="DM Sans,sans-serif" fontWeight="800" style={{ pointerEvents:"none" }}>
                  {counts[r]}
                </text>
              </g>
            ))}
          </svg>
        </div>
        {/* Legend bars */}
        <div style={{ flex:1 }}>
          {REGIONS.map(r => {
            const c = counts[r], pct = Math.round((c / max)*100)||3;
            return (
              <div key={r} onMouseEnter={() => setHov(r)} onMouseLeave={() => setHov(null)}
                style={{ marginBottom:8, padding:"5px 8px", borderRadius:7, background:hov===r?"#0d1f3c":"transparent", transition:"background 0.2s", cursor:"default" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ color:hov===r?"#7dd3fc":"#64748b", fontSize:12, fontWeight:600 }}>{r}</span>
                  <span style={{ color:getClr(c), fontWeight:800, fontSize:13 }}>{c}</span>
                </div>
                <div style={{ background:"#0d1526", borderRadius:4, height:5 }}>
                  <div style={{ background:getClr(c), borderRadius:4, height:5, width:`${pct}%`, transition:"width 0.5s ease" }} />
                </div>
              </div>
            );
          })}
          <div style={{ display:"flex", gap:6, alignItems:"center", marginTop:10 }}>
            <span style={{ color:"#2a3a4a", fontSize:10 }}>Low</span>
            {["#0c243f","#0e3866","#1a5ca0","#2563eb","#60a5fa"].map((c,i) => (
              <div key={i} style={{ width:20, height:8, background:c, borderRadius:3 }} />
            ))}
            <span style={{ color:"#2a3a4a", fontSize:10 }}>High</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ cases }) {
  const open     = cases.filter(c => c.status === "Open").length;
  const closed   = cases.filter(c => c.status === "Closed").length;
  const adj      = cases.filter(c => c.status === "Adjourned").length;
  const appeal   = cases.filter(c => c.status === "On Appeal").length;

  const byType  = CASE_TYPES.map(t => ({ name:t, count:cases.filter(c=>c.caseType===t).length })).filter(x=>x.count);
  const byCourt = COURTS.map(c => ({ name:c.replace(" Court",""), count:cases.filter(x=>x.court===c).length })).filter(x=>x.count);
  const byYear  = [2022,2023,2024].map(y => ({
    year: String(y),
    Open:   cases.filter(c=>c.year===y&&c.status==="Open").length,
    Closed: cases.filter(c=>c.year===y&&c.status==="Closed").length,
    Other:  cases.filter(c=>c.year===y&&!["Open","Closed"].includes(c.status)).length,
  }));
  const statusPie = [
    { name:"Open", value:open }, { name:"Closed", value:closed },
    { name:"Adjourned", value:adj }, { name:"On Appeal", value:appeal },
  ].filter(x=>x.value);
  const radar = byType.map(t => ({ subject:t.name, value:t.count, fullMark:cases.length }));

  const stats = [
    { label:"Total Cases", value:cases.length, accent:"#3b82f6", icon:"⚖" },
    { label:"Open",        value:open,          accent:"#10b981", icon:"◉" },
    { label:"Closed",      value:closed,        accent:"#6b7280", icon:"✓" },
    { label:"On Appeal",   value:appeal,        accent:"#8b5cf6", icon:"↑" },
    { label:"Adjourned",   value:adj,           accent:"#f59e0b", icon:"⏸" },
  ];

  const panel = (children, title, emoji, extra={}) => (
    <div style={{ background:"#080e1e", border:"1px solid #1a3050", borderRadius:14, padding:20, ...extra }}>
      {title && <h3 style={{ color:"#7dd3fc", fontSize:12.5, textTransform:"uppercase", letterSpacing:1.6, fontWeight:700, marginBottom:14, marginTop:0 }}>{emoji} {title}</h3>}
      {children}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:34, color:"#e2e8f0", fontWeight:700, margin:0, letterSpacing:-0.5 }}>Justice Analytics</h2>
        <p style={{ color:"#2a4a6a", fontSize:13, marginTop:5 }}>Public case statistics and trends · Live registry data</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:20 }}>
        {stats.map(s => (
          <div key={s.label} style={{ flex:"1 1 100px", background:`linear-gradient(145deg,${s.accent}14,#060c18)`, border:`1px solid ${s.accent}30`, borderRadius:14, padding:"18px 20px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:10, right:14, fontSize:24, opacity:0.12, color:s.accent }}>{s.icon}</div>
            <div style={{ fontSize:38, fontWeight:800, color:s.accent, fontFamily:"'Cormorant Garamond',serif", lineHeight:1 }}>{s.value}</div>
            <div style={{ fontSize:10.5, color:"#2a4a6a", marginTop:6, letterSpacing:1.3, textTransform:"uppercase", fontWeight:700 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Row 1 */}
      <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:16, marginBottom:16 }}>
        <RegionHeatmap cases={cases} />
        {panel(
          <>
            <ResponsiveContainer width="100%" height={185}>
              <PieChart>
                <Pie data={statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={72} innerRadius={36} paddingAngle={3}
                  label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                  {statusPie.map((_,i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip content={<CTip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:6 }}>
              {statusPie.map((s,i) => (
                <span key={s.name} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11.5, color:"#64748b" }}>
                  <span style={{ width:9, height:9, borderRadius:"50%", background:PIE_COLORS[i], display:"inline-block" }} />
                  {s.name} ({s.value})
                </span>
              ))}
            </div>
          </>,
          "Status Breakdown","🔵"
        )}
      </div>

      {/* Row 2 */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        {panel(
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byType} layout="vertical" margin={{ left:10, right:16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0d1e30" horizontal={false} />
              <XAxis type="number" tick={{ fill:"#2a4a6a", fontSize:11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fill:"#94a3b8", fontSize:11 }} axisLine={false} tickLine={false} width={88} />
              <Tooltip content={<CTip />} />
              <Bar dataKey="count" radius={[0,6,6,0]}>
                {byType.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>,
          "Cases by Type","📊"
        )}
        {panel(
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={byYear}>
              <defs>
                <linearGradient id="gO" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                <linearGradient id="gX" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#0d1e30" />
              <XAxis dataKey="year" tick={{ fill:"#2a4a6a", fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:"#2a4a6a", fontSize:11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CTip />} />
              <Legend wrapperStyle={{ color:"#64748b", fontSize:12 }} />
              <Area type="monotone" dataKey="Open"   stroke="#3b82f6" fill="url(#gO)" strokeWidth={2} />
              <Area type="monotone" dataKey="Closed" stroke="#10b981" fill="url(#gC)" strokeWidth={2} />
              <Area type="monotone" dataKey="Other"  stroke="#f59e0b" fill="url(#gX)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>,
          "Trends by Year & Status","📅"
        )}
      </div>

      {/* Row 3 */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {panel(
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={byCourt}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0d1e30" vertical={false} />
              <XAxis dataKey="name" tick={{ fill:"#2a4a6a", fontSize:10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:"#2a4a6a", fontSize:11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CTip />} />
              <Bar dataKey="count" radius={[6,6,0,0]}>
                {byCourt.map((_,i)=><Cell key={i} fill={PIE_COLORS[(i+3)%PIE_COLORS.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>,
          "Cases by Court","🏛"
        )}
        {panel(
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radar}>
              <PolarGrid stroke="#0d1e30" />
              <PolarAngleAxis dataKey="subject" tick={{ fill:"#3a5a7a", fontSize:10 }} />
              <PolarRadiusAxis tick={false} axisLine={false} />
              <Radar name="Cases" dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.22} strokeWidth={2} />
              <Tooltip content={<CTip />} />
            </RadarChart>
          </ResponsiveContainer>,
          "Case Type Radar","🕸"
        )}
      </div>
    </div>
  );
}

// ─── Case Form ────────────────────────────────────────────────────────────────
function CaseForm({ onSave, initial, onCancel }) {
  const blank = { caseCode:"", year:new Date().getFullYear(), court:"", region:"", county:"", caseType:"", status:"Open", closureType:"", filingDate:"", lastUpdated:new Date().toISOString().split("T")[0], outcomes:"" };
  const [form, setForm] = useState(initial || blank);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  const sel = (k,opts) => (
    <select value={form[k]} onChange={e=>f(k,e.target.value)} style={IS}>
      <option value="">Select…</option>{opts.map(o=><option key={o}>{o}</option>)}
    </select>
  );
  return (
    <div style={{ background:"#080e1e", border:"1px solid #1a3050", borderRadius:16, padding:28, maxWidth:700, margin:"0 auto" }}>
      <h3 style={{ color:"#e2e8f0", fontFamily:"'Cormorant Garamond',serif", marginTop:0, fontSize:24 }}>{initial?"✏️ Edit Case":"📋 Register New Case"}</h3>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {[["Case Code","caseCode","text"],["Year","year","number"],["Filing Date","filingDate","date"],["Last Updated","lastUpdated","date"]].map(([label,key,type])=>(
          <div key={key}><label style={LS}>{label}</label><input type={type} value={form[key]} onChange={e=>f(key,e.target.value)} style={IS} /></div>
        ))}
        <div><label style={LS}>Court</label>{sel("court",COURTS)}</div>
        <div><label style={LS}>Region</label>{sel("region",REGIONS)}</div>
        <div><label style={LS}>County</label>{sel("county",COUNTIES)}</div>
        <div><label style={LS}>Case Type</label>{sel("caseType",CASE_TYPES)}</div>
        <div><label style={LS}>Status</label>{sel("status",STATUSES)}</div>
        <div><label style={LS}>Closure Type</label>{sel("closureType",CLOSURE_TYPES)}</div>
      </div>
      <div style={{ marginTop:16 }}><label style={LS}>Outcomes</label><textarea value={form.outcomes} onChange={e=>f("outcomes",e.target.value)} rows={3} style={{ ...IS, resize:"vertical" }} /></div>
      <div style={{ display:"flex", gap:12, marginTop:20 }}>
        <button onClick={()=>onSave(form)} style={{ background:"#1d4ed8", color:"#fff", border:"none", borderRadius:9, padding:"11px 28px", fontWeight:700, cursor:"pointer", fontSize:14 }}>💾 Save Case</button>
        <button onClick={onCancel} style={{ background:"transparent", color:"#64748b", border:"1px solid #1e293b", borderRadius:9, padding:"11px 24px", cursor:"pointer", fontSize:14 }}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Case Table (Staff Only) ──────────────────────────────────────────────────
function CaseTable({ cases, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status:"", caseType:"", region:"" });

  const filtered = cases.filter(c => {
    const q = search.toLowerCase();
    return (!q || [c.caseCode,c.county,c.outcomes].some(s=>s.toLowerCase().includes(q)))
      && (!filters.status   || c.status   === filters.status)
      && (!filters.caseType || c.caseType === filters.caseType)
      && (!filters.region   || c.region   === filters.region);
  });

  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        <input placeholder="🔍 Search by code, county, outcome…" value={search} onChange={e=>setSearch(e.target.value)} style={{ ...IS, maxWidth:280, flex:1 }} />
        {[["status","Status",STATUSES],["caseType","Type",CASE_TYPES],["region","Region",REGIONS]].map(([k,l,opts])=>(
          <select key={k} value={filters[k]} onChange={e=>setFilters(p=>({...p,[k]:e.target.value}))} style={{ ...IS, maxWidth:145 }}>
            <option value="">All {l}s</option>{opts.map(o=><option key={o}>{o}</option>)}
          </select>
        ))}
        <button onClick={()=>exportExcel(filtered)} style={{ background:"#042e14", color:"#4ade80", border:"1px solid #14532d", borderRadius:8, padding:"9px 18px", cursor:"pointer", fontWeight:700, fontSize:13 }}>
          ⬇ Export Excel ({filtered.length})
        </button>
      </div>
      <div style={{ overflowX:"auto", borderRadius:12, border:"1px solid #1a3050" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12.5 }}>
          <thead>
            <tr style={{ background:"#0a1220" }}>
              {["Case Code","Year","Court","Region","County","Type","Status","Filing Date","Outcomes","Actions"].map(h=>(
                <th key={h} style={{ color:"#2a4a6a", textAlign:"left", padding:"12px 12px", textTransform:"uppercase", fontSize:10, letterSpacing:1.2, fontWeight:800, whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c,i)=>(
              <tr key={c.id} style={{ borderTop:"1px solid #0d1e30", background:i%2===0?"#060c18":"#080e1e" }}
                onMouseEnter={e=>e.currentTarget.style.background="#0c1e36"}
                onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"#060c18":"#080e1e"}>
                <td style={{ padding:"10px 12px", color:"#60a5fa", fontWeight:700, fontFamily:"monospace", fontSize:12 }}>{c.caseCode}</td>
                <td style={{ padding:"10px 12px", color:"#374151" }}>{c.year}</td>
                <td style={{ padding:"10px 12px", color:"#94a3b8", maxWidth:120, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.court}</td>
                <td style={{ padding:"10px 12px", color:"#cbd5e1" }}>{c.region}</td>
                <td style={{ padding:"10px 12px", color:"#64748b" }}>{c.county}</td>
                <td style={{ padding:"10px 12px", color:"#fbbf24", fontWeight:600 }}>{c.caseType}</td>
                <td style={{ padding:"10px 12px" }}><Badge status={c.status}/></td>
                <td style={{ padding:"10px 12px", color:"#374151", whiteSpace:"nowrap" }}>{c.filingDate}</td>
                <td style={{ padding:"10px 12px", color:"#4b5563", maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }} title={c.outcomes}>{c.outcomes}</td>
                <td style={{ padding:"10px 12px", whiteSpace:"nowrap" }}>
                  <button onClick={()=>onEdit(c)} style={{ background:"transparent", color:"#60a5fa", border:"1px solid #1e3a8a", borderRadius:6, padding:"3px 10px", cursor:"pointer", marginRight:6, fontSize:11 }}>Edit</button>
                  <button onClick={()=>onDelete(c.id)} style={{ background:"transparent", color:"#f87171", border:"1px solid #7f1d1d", borderRadius:6, padding:"3px 10px", cursor:"pointer", fontSize:11 }}>Del</button>
                </td>
              </tr>
            ))}
            {filtered.length===0 && <tr><td colSpan={10} style={{ padding:40, textAlign:"center", color:"#1e3a5f" }}>No cases found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Reports ──────────────────────────────────────────────────────────────────
function ReportsPage() {
  const [search, setSearch] = useState("");
  const typeClr = { "Annual Report":"#3b82f6", "Research":"#8b5cf6", "Policy Paper":"#10b981", "Quarterly Bulletin":"#f59e0b" };
  const filtered = SEED_REPORTS.filter(r => !search || [r.title,r.org,r.type,r.description].some(s=>s.toLowerCase().includes(search.toLowerCase())));

  return (
    <div>
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, color:"#e2e8f0", marginBottom:6 }}>Published Reports</h2>
      <p style={{ color:"#2a4a6a", marginBottom:20, fontSize:13 }}>Access published organizational research and policy reports.</p>
      <input placeholder="🔍 Search reports…" value={search} onChange={e=>setSearch(e.target.value)} style={{ ...IS, maxWidth:360, marginBottom:22 }} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:16 }}>
        {filtered.map(r => {
          const c = typeClr[r.type]||"#3b82f6";
          return (
            <div key={r.id} style={{ background:"#080e1e", border:"1px solid #1a3050", borderRadius:14, padding:22, display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ background:`${c}18`, color:c, border:`1px solid ${c}40`, borderRadius:20, padding:"3px 12px", fontSize:10.5, fontWeight:700 }}>{r.type}</span>
                <span style={{ color:"#1e3a5f", fontSize:11 }}>{r.date}</span>
              </div>
              <h4 style={{ color:"#e2e8f0", fontFamily:"'Cormorant Garamond',serif", margin:0, fontSize:17, lineHeight:1.35 }}>{r.title}</h4>
              <p style={{ color:"#2a4a6a", fontSize:12, margin:0 }}>by {r.org}</p>
              <p style={{ color:"#374151", fontSize:13, margin:0, lineHeight:1.6, flex:1 }}>{r.description}</p>
              <a href="#" onClick={e=>e.preventDefault()} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#0c1e36", color:"#60a5fa", border:"1px solid #1e3a8a", padding:"8px 16px", borderRadius:8, textDecoration:"none", fontSize:13, fontWeight:600 }}>
                ⬇ Download / View
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin, onBack }) {
  const [form, setForm] = useState({ username:"", password:"" });
  const [error, setError] = useState("");
  const handle = () => {
    const u = USERS.find(u => u.username===form.username && u.password===form.password);
    if (u) onLogin(u); else setError("Invalid username or password.");
  };
  return (
    <div style={{ minHeight:"100vh", background:"#040810", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#080e1e", border:"1px solid #1a3050", borderRadius:18, padding:46, width:390, boxShadow:"0 30px 80px #000c" }}>
        <div style={{ textAlign:"center", marginBottom:34 }}>
          <div style={{ width:56, height:56, background:"linear-gradient(135deg,#1d4ed8,#7c3aed)", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, margin:"0 auto 14px" }}>⚖</div>
          <h2 style={{ color:"#e2e8f0", fontFamily:"'Cormorant Garamond',serif", fontSize:28, margin:0 }}>Staff Portal</h2>
          <p style={{ color:"#2a4a6a", fontSize:12.5, marginTop:6 }}>Case Registrar · Restricted Access</p>
        </div>
        {["username","password"].map(k=>(
          <div key={k} style={{ marginBottom:18 }}>
            <label style={LS}>{k}</label>
            <input type={k==="password"?"password":"text"} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handle()} style={{ ...IS, fontSize:14 }} />
          </div>
        ))}
        {error && <p style={{ color:"#ef4444", fontSize:13, marginBottom:10 }}>{error}</p>}
        <button onClick={handle} style={{ width:"100%", background:"linear-gradient(135deg,#1d4ed8,#2563eb)", color:"#fff", border:"none", borderRadius:10, padding:"13px", fontWeight:700, fontSize:15, cursor:"pointer", marginBottom:12 }}>Sign In</button>
        <button onClick={onBack} style={{ width:"100%", background:"transparent", color:"#2a4a6a", border:"1px solid #0d1e30", borderRadius:10, padding:"10px", cursor:"pointer", fontSize:13 }}>← Back to Public View</button>
        <p style={{ color:"#1a2a3a", fontSize:11, textAlign:"center", marginTop:16 }}>admin/admin123 · staff/staff123</p>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("dashboard");
  const [cases, setCases] = useState(SEED_CASES);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  if (showLogin && !user) return <LoginPage onLogin={u=>{setUser(u);setShowLogin(false);setView("cases");}} onBack={()=>setShowLogin(false)} />;

  const publicNav = [{ key:"dashboard", label:"Dashboard", icon:"◈" },{ key:"reports", label:"Reports", icon:"📄" }];
  const staffNav  = [...publicNav,{ key:"cases", label:"Case Registry", icon:"⊞" },{ key:"register", label:"Register Case", icon:"+" }];
  const nav = user ? staffNav : publicNav;

  const saveCase = form => {
    if (editing) setCases(p=>p.map(c=>c.id===editing.id?{...form,id:editing.id}:c));
    else setCases(p=>[...p,{...form,id:Date.now()}]);
    setEditing(null); setShowForm(false); setView("cases");
  };
  const delCase = id => { if(window.confirm("Delete this case?")) setCases(p=>p.filter(c=>c.id!==id)); };
  const go = v => { setView(v); setShowForm(false); setEditing(null); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#040810;font-family:'DM Sans',sans-serif;color:#e2e8f0}
        input,select,textarea{font-family:'DM Sans',sans-serif;transition:border-color 0.2s}
        input:focus,select:focus,textarea:focus{border-color:#3b82f6!important;outline:none;box-shadow:0 0 0 3px #3b82f610}
        ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:#080e1e}::-webkit-scrollbar-thumb{background:#1a3050;border-radius:4px}
        button{font-family:'DM Sans',sans-serif;transition:opacity 0.15s,transform 0.1s}button:hover{opacity:0.82}button:active{transform:scale(0.97)}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fadein{animation:fadeIn 0.3s ease both}
      `}</style>
      <div style={{ display:"flex", minHeight:"100vh" }}>
        {/* Sidebar */}
        <aside style={{ width:224, background:"#060c1a", borderRight:"1px solid #0c1e30", display:"flex", flexDirection:"column", position:"fixed", top:0, bottom:0, left:0, zIndex:50 }}>
          <div style={{ padding:"26px 22px 18px" }}>
            <div style={{ width:42, height:42, background:"linear-gradient(135deg,#1d4ed8,#7c3aed)", borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:12 }}>⚖</div>
            <h1 style={{ fontSize:15.5, fontFamily:"'Cormorant Garamond',serif", color:"#d1d9e6", lineHeight:1.3, fontWeight:700 }}>Case Registrar</h1>
            <p style={{ color:"#0d1e30", fontSize:10, marginTop:4, textTransform:"uppercase", letterSpacing:1.6, fontWeight:700 }}>Justice Registry System</p>
          </div>

          {!user && (
            <div style={{ margin:"0 12px 14px", background:"#0a1628", border:"1px solid #1a3050", borderRadius:10, padding:"12px 14px" }}>
              <p style={{ color:"#1e3a5f", fontSize:11, lineHeight:1.55, marginBottom:10 }}>🔒 Case Registry requires staff authentication.</p>
              <button onClick={()=>setShowLogin(true)} style={{ width:"100%", background:"#1d4ed8", color:"#fff", border:"none", borderRadius:7, padding:"8px", fontWeight:700, cursor:"pointer", fontSize:12 }}>Staff Login →</button>
            </div>
          )}

          <nav style={{ flex:1 }}>
            {nav.map(n=>(
              <button key={n.key} onClick={()=>go(n.key)}
                style={{ width:"100%", background:view===n.key?"#0c1e36":"transparent", color:view===n.key?"#60a5fa":"#2a4a6a", border:"none", textAlign:"left", padding:"11px 22px", cursor:"pointer", fontSize:13.5, fontWeight:view===n.key?700:500, display:"flex", gap:10, alignItems:"center", borderLeft:view===n.key?"3px solid #3b82f6":"3px solid transparent", transition:"all 0.2s" }}>
                <span style={{ fontSize:15 }}>{n.icon}</span>{n.label}
              </button>
            ))}
          </nav>

          <div style={{ padding:"14px 18px", borderTop:"1px solid #0c1e30" }}>
            {user ? (
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <div style={{ width:32, height:32, background:"linear-gradient(135deg,#1d4ed8,#7c3aed)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#fff" }}>{user.name[0]}</div>
                  <div>
                    <p style={{ color:"#94a3b8", fontSize:12.5, fontWeight:600 }}>{user.name}</p>
                    <p style={{ color:"#1d4ed8", fontSize:10.5, textTransform:"uppercase", letterSpacing:0.8 }}>{user.role}</p>
                  </div>
                </div>
                <button onClick={()=>{setUser(null);go("dashboard");}} style={{ color:"#ef4444", background:"transparent", border:"1px solid #4c1414", borderRadius:6, cursor:"pointer", fontSize:11.5, padding:"5px 12px" }}>Logout</button>
              </div>
            ) : <p style={{ color:"#0c1e30", fontSize:11 }}>Public view · Read only</p>}
          </div>
        </aside>

        {/* Content */}
        <main className="fadein" style={{ marginLeft:224, flex:1, padding:"32px 30px 56px", minHeight:"100vh" }}>

          {view==="dashboard" && <Dashboard cases={cases} />}

          {view==="cases" && !user && (
            <div style={{ textAlign:"center", paddingTop:90 }}>
              <div style={{ fontSize:64, marginBottom:18, opacity:0.6 }}>🔒</div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", color:"#e2e8f0", fontSize:30, marginBottom:10 }}>Staff Access Required</h2>
              <p style={{ color:"#2a4a6a", marginBottom:28, fontSize:14 }}>The Case Registry is restricted to authorized staff members only.</p>
              <button onClick={()=>setShowLogin(true)} style={{ background:"#1d4ed8", color:"#fff", border:"none", borderRadius:10, padding:"13px 34px", fontWeight:700, fontSize:15, cursor:"pointer" }}>Staff Login →</button>
            </div>
          )}

          {view==="cases" && user && (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:22 }}>
                <div>
                  <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, color:"#e2e8f0" }}>Case Registry</h2>
                  <p style={{ color:"#2a4a6a", fontSize:13, marginTop:4 }}>Full dataset · Staff restricted · Excel export enabled</p>
                </div>
                <button onClick={()=>{setEditing(null);setShowForm(false);go("register");}} style={{ background:"#1d4ed8", color:"#fff", border:"none", borderRadius:10, padding:"11px 22px", cursor:"pointer", fontWeight:700, fontSize:13.5 }}>+ New Case</button>
              </div>
              <CaseTable cases={cases} onEdit={c=>{setEditing(c);setShowForm(true);go("register");}} onDelete={delCase} />
            </div>
          )}

          {view==="register" && user && (
            showForm||editing
              ? <CaseForm initial={editing} onSave={saveCase} onCancel={()=>{setShowForm(false);setEditing(null);go("cases");}} />
              : <div>
                  <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, color:"#e2e8f0", marginBottom:22 }}>Register a Case</h2>
                  <button onClick={()=>setShowForm(true)} style={{ background:"#1d4ed8", color:"#fff", border:"none", borderRadius:10, padding:"13px 30px", cursor:"pointer", fontWeight:700, fontSize:15 }}>📋 Open Case Form</button>
                </div>
          )}

          {view==="reports" && <ReportsPage />}
        </main>
      </div>
    </>
  );
}

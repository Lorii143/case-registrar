import { useState, useRef } from "react";
import IMLULogin from "./IMLULogin";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from "recharts";

// ─── Theme: Blue / White / Red (Light) ───────────────────────────────────────
const T = {
  bg:         "#f0f4ff",
  bgCard:     "#ffffff",
  bgRow1:     "#ffffff",
  bgRow2:     "#f8faff",
  bgHover:    "#eef2ff",
  border:     "#dbeafe",
  borderMid:  "#93c5fd",
  blue:       "#1d4ed8",
  blueLt:     "#3b82f6",
  bluePale:   "#eff6ff",
  blueXlt:    "#bfdbfe",
  red:        "#dc2626",
  redLt:      "#ef4444",
  redPale:    "#fff1f2",
  white:      "#ffffff",
  text:       "#0f172a",
  textMid:    "#334155",
  textDim:    "#64748b",
  textFade:   "#94a3b8",
  sidebar:    "#1e3a8a",
  sidebarDk:  "#172554",
};

const CHART_COLORS = ["#1d4ed8","#dc2626","#3b82f6","#ef4444","#60a5fa","#fca5a5","#1e40af","#b91c1c","#93c5fd","#f87171"];

// ─── Options ──────────────────────────────────────────────────────────────────
const CASE_TYPES     = ["Torture","CIDT","Sexual Violence","Extrajudicial Killing","Enforced Disappearance","Arbitrary Detention","Police Brutality","Other"];
const STATUSES       = ["Open","Closed","Adjourned","On Appeal","Pending Investigation"];
const REGIONS        = ["Nairobi","Coast","Rift Valley","Central","Western","Eastern","North Eastern","Nyanza"];
const COUNTIES       = ["Nairobi","Mombasa","Nakuru","Kisumu","Kiambu","Machakos","Eldoret","Nyeri","Kisii","Kilifi","Garissa","Bungoma","Homa Bay","Meru","Thika","Kakamega","Embu","Isiolo","Marsabit","Wajir","Mandera","Lamu","Taita Taveta","Kwale","Tana River"];
const GENDERS        = ["Male","Female","Non-binary","Prefer not to say"];
const PERPETRATORS   = ["Police Officer","Prison Warder","Military Personnel","Security Agent","Unknown State Actor","Non-State Actor","Other"];
const TORTURE_METHODS= ["Beating","Electrocution","Suffocation","Waterboarding","Stress Positions","Denial of Food/Water","Solitary Confinement","Sexual Violence","Psychological Torture","Other"];
const SOURCES        = ["Victim/Survivor","Family Member","NGO Referral","Legal Aid","Hospital","Community Leader","Newspaper","Other"];
const SERVICES       = ["Legal Representation","Medical Documentation","Psychosocial Support","Rehabilitation","Litigation Support","Documentation Only","Referral","Other"];
const RIGHTS         = ["Right to Life","Right Against Torture","Right to Fair Trial","Right to Liberty","Right to Dignity","Right to Health","Freedom from Discrimination","Right to Information","Other"];
const OUTCOMES_LIST  = ["Case Withdrawn","Acquittal","Conviction","Settlement","Referral","Ongoing","Closed - No Action","Transferred"];
const CONSENT_OPTS   = ["Yes","No","Pending"];
const VERIF_OPTS     = ["Verified","Unverified","Partially Verified","Under Review"];

// ─── Seed Cases ───────────────────────────────────────────────────────────────
const SEED_CASES = [
  {id:1, caseCode:"IMLU-2024-001",caseType:"Torture",              caseStatus:"Open",                 filingDate:"2024-01-15",region:"Nairobi",      county:"Nairobi",  age:32,gender:"Male",     consentObtained:"Yes",    allegedPerpetrator:"Police Officer",      tortureMethod:"Beating",               source:"Victim/Survivor",  verification:"Verified",           serviceOffered:"Legal Representation",  incidentLocation:"Pangani Police Station",  rightsViolated:"Right Against Torture", outcomes:"Ongoing"},
  {id:2, caseCode:"IMLU-2024-002",caseType:"Arbitrary Detention",  caseStatus:"Closed",               filingDate:"2024-02-10",region:"Coast",         county:"Mombasa",  age:27,gender:"Female",   consentObtained:"Yes",    allegedPerpetrator:"Security Agent",      tortureMethod:"Solitary Confinement",  source:"Family Member",    verification:"Verified",           serviceOffered:"Documentation Only",    incidentLocation:"Shimo la Tewa Prison",    rightsViolated:"Right to Liberty",      outcomes:"Settlement"},
  {id:3, caseCode:"IMLU-2024-003",caseType:"Police Brutality",     caseStatus:"Open",                 filingDate:"2024-03-05",region:"Rift Valley",   county:"Nakuru",   age:19,gender:"Male",     consentObtained:"Yes",    allegedPerpetrator:"Police Officer",      tortureMethod:"Beating",               source:"NGO Referral",     verification:"Partially Verified", serviceOffered:"Medical Documentation", incidentLocation:"Nakuru CBD",              rightsViolated:"Right to Dignity",      outcomes:"Ongoing"},
  {id:4, caseCode:"IMLU-2024-004",caseType:"Sexual Violence",      caseStatus:"On Appeal",            filingDate:"2023-11-20",region:"Western",       county:"Kisumu",   age:24,gender:"Female",   consentObtained:"Yes",    allegedPerpetrator:"Police Officer",      tortureMethod:"Sexual Violence",       source:"Hospital",         verification:"Verified",           serviceOffered:"Psychosocial Support",  incidentLocation:"Kisumu Central",          rightsViolated:"Right to Dignity",      outcomes:"Conviction"},
  {id:5, caseCode:"IMLU-2024-005",caseType:"Extrajudicial Killing",caseStatus:"Pending Investigation",filingDate:"2024-04-18",region:"Nairobi",       county:"Nairobi",  age:35,gender:"Male",     consentObtained:"Yes",    allegedPerpetrator:"Police Officer",      tortureMethod:"Other",                 source:"Community Leader", verification:"Under Review",       serviceOffered:"Litigation Support",    incidentLocation:"Mathare",                 rightsViolated:"Right to Life",         outcomes:"Ongoing"},
  {id:6, caseCode:"IMLU-2024-006",caseType:"CIDT",                 caseStatus:"Adjourned",            filingDate:"2024-05-02",region:"Eastern",       county:"Machakos", age:41,gender:"Male",     consentObtained:"Pending",allegedPerpetrator:"Prison Warder",       tortureMethod:"Denial of Food/Water",  source:"Legal Aid",        verification:"Unverified",         serviceOffered:"Referral",              incidentLocation:"Machakos GK Prison",      rightsViolated:"Right to Health",       outcomes:"Ongoing"},
  {id:7, caseCode:"IMLU-2023-088",caseType:"Torture",              caseStatus:"Closed",               filingDate:"2023-07-14",region:"Coast",         county:"Kilifi",   age:30,gender:"Female",   consentObtained:"Yes",    allegedPerpetrator:"Military Personnel",  tortureMethod:"Stress Positions",      source:"Victim/Survivor",  verification:"Verified",           serviceOffered:"Rehabilitation",        incidentLocation:"Malindi",                 rightsViolated:"Right Against Torture", outcomes:"Settlement"},
  {id:8, caseCode:"IMLU-2023-049",caseType:"Enforced Disappearance",caseStatus:"Open",               filingDate:"2023-09-30",region:"North Eastern", county:"Garissa",  age:22,gender:"Male",     consentObtained:"No",     allegedPerpetrator:"Unknown State Actor", tortureMethod:"Psychological Torture", source:"Family Member",    verification:"Partially Verified", serviceOffered:"Legal Representation",  incidentLocation:"Garissa Town",            rightsViolated:"Right to Liberty",      outcomes:"Ongoing"},
  {id:9, caseCode:"IMLU-2023-071",caseType:"Police Brutality",     caseStatus:"Closed",               filingDate:"2023-05-11",region:"Nyanza",        county:"Kisii",    age:28,gender:"Male",     consentObtained:"Yes",    allegedPerpetrator:"Police Officer",      tortureMethod:"Beating",               source:"Newspaper",        verification:"Verified",           serviceOffered:"Medical Documentation", incidentLocation:"Kisii Town",              rightsViolated:"Right to Dignity",      outcomes:"Conviction"},
  {id:10,caseCode:"IMLU-2024-010",caseType:"Arbitrary Detention",  caseStatus:"Open",                 filingDate:"2024-06-01",region:"Central",       county:"Kiambu",   age:38,gender:"Non-binary",consentObtained:"Yes",    allegedPerpetrator:"Security Agent",      tortureMethod:"Suffocation",           source:"Legal Aid",        verification:"Verified",           serviceOffered:"Litigation Support",    incidentLocation:"Thika",                   rightsViolated:"Right to Fair Trial",   outcomes:"Ongoing"},
  {id:11,caseCode:"IMLU-2024-011",caseType:"Torture",              caseStatus:"Open",                 filingDate:"2024-06-15",region:"Nairobi",       county:"Nairobi",  age:45,gender:"Male",     consentObtained:"Yes",    allegedPerpetrator:"Police Officer",      tortureMethod:"Electrocution",         source:"NGO Referral",     verification:"Verified",           serviceOffered:"Legal Representation",  incidentLocation:"Industrial Area Police",  rightsViolated:"Right Against Torture", outcomes:"Ongoing"},
  {id:12,caseCode:"IMLU-2024-012",caseType:"Sexual Violence",      caseStatus:"Open",                 filingDate:"2024-07-01",region:"Rift Valley",   county:"Eldoret",  age:20,gender:"Female",   consentObtained:"Yes",    allegedPerpetrator:"Security Agent",      tortureMethod:"Sexual Violence",       source:"Hospital",         verification:"Partially Verified", serviceOffered:"Psychosocial Support",  incidentLocation:"Eldoret Town",            rightsViolated:"Right to Dignity",      outcomes:"Ongoing"},
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const IS = {
  width:"100%", background:"#fff", border:`1px solid ${T.border}`,
  borderRadius:8, padding:"9px 12px", color:T.text, fontSize:13,
  boxSizing:"border-box", outline:"none", fontFamily:"inherit",
};
const LS = {
  display:"block", color:T.blue, fontSize:10.5, textTransform:"uppercase",
  letterSpacing:1.2, marginBottom:5, fontWeight:700,
};

const CTip = ({active,payload,label}) => {
  if(!active||!payload?.length) return null;
  return(
    <div style={{background:"#fff",border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 16px",boxShadow:"0 4px 20px rgba(29,78,216,0.12)"}}>
      <p style={{color:T.blue,fontSize:11,marginBottom:4,fontWeight:600}}>{label}</p>
      {payload.map((p,i)=><p key={i} style={{color:p.color||T.blue,fontWeight:700,fontSize:13}}>{p.name||p.dataKey}: {p.value}</p>)}
    </div>
  );
};

function Badge({status}){
  const m={
    "Open":                 {bg:"#eff6ff",c:"#1d4ed8",bd:"#bfdbfe"},
    "Closed":               {bg:"#f0fdf4",c:"#16a34a",bd:"#bbf7d0"},
    "Adjourned":            {bg:"#fffbeb",c:"#d97706",bd:"#fde68a"},
    "On Appeal":            {bg:"#fff1f2",c:"#dc2626",bd:"#fecaca"},
    "Pending Investigation":{bg:"#f0f9ff",c:"#0369a1",bd:"#bae6fd"},
  };
  const s=m[status]||m["Closed"];
  return <span style={{background:s.bg,color:s.c,border:`1px solid ${s.bd}`,borderRadius:20,padding:"3px 11px",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{status}</span>;
}

function exportExcel(cases){
  const h=["Case Code","Case Type","Case Status","Filing Date","Region","County","Age","Gender","Consent Obtained","Alleged Perpetrator","Torture Method","Source","Verification","Service Offered","Incident Location","Rights Violated","Outcomes"];
  const r=cases.map(c=>[c.caseCode,c.caseType,c.caseStatus,c.filingDate,c.region,c.county,c.age,c.gender,c.consentObtained,c.allegedPerpetrator,c.tortureMethod,c.source,c.verification,c.serviceOffered,c.incidentLocation,c.rightsViolated,c.outcomes]);
  const blob=new Blob([[h,...r].map(row=>row.join("\t")).join("\n")],{type:"application/vnd.ms-excel;charset=utf-8"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="imlu-cases.xls";a.click();
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KPICard({label,value,sub,icon,color,trend}){
  return(
    <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:14,padding:"18px 20px",position:"relative",overflow:"hidden",flex:"1 1 110px",minWidth:0,boxShadow:"0 2px 12px rgba(29,78,216,0.07)",borderTop:`3px solid ${color}`}}>
      <div style={{position:"absolute",top:14,right:16,fontSize:24,opacity:0.12}}>{icon}</div>
      <div style={{fontSize:10,color:color,textTransform:"uppercase",letterSpacing:1.5,fontWeight:800,marginBottom:6}}>{label}</div>
      <div style={{fontSize:36,fontWeight:800,color:T.text,fontFamily:"'Crimson Pro',serif",lineHeight:1}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:T.textFade,marginTop:5}}>{sub}</div>}
      {trend!==undefined&&<div style={{fontSize:11,color:trend>=0?"#16a34a":"#dc2626",marginTop:4,fontWeight:700}}>{trend>=0?"▲":"▼"} {Math.abs(trend)}% vs last month</div>}
    </div>
  );
}

// ─── Pipeline ─────────────────────────────────────────────────────────────────
function Pipeline({cases}){
  const steps=[
    {label:"Total Filed",  count:cases.length,                                            color:T.blue},
    {label:"Verified",     count:cases.filter(c=>c.verification==="Verified").length,     color:"#1e40af"},
    {label:"In Service",   count:cases.filter(c=>c.serviceOffered).length,               color:"#1e3a8a"},
    {label:"Open",         count:cases.filter(c=>c.caseStatus==="Open").length,           color:T.red},
    {label:"Closed",       count:cases.filter(c=>c.caseStatus==="Closed").length,         color:"#15803d"},
  ];
  return(
    <div style={{display:"flex",marginBottom:20,borderRadius:12,overflow:"hidden",border:`1px solid ${T.border}`,boxShadow:"0 2px 12px rgba(29,78,216,0.08)"}}>
      {steps.map((s,i)=>(
        <div key={s.label} style={{flex:1,background:s.color,padding:"14px 8px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",borderRight:i<steps.length-1?"1px solid rgba(255,255,255,0.2)":"none"}}>
          {i<steps.length-1&&<div style={{position:"absolute",right:-1,top:"50%",transform:"translateY(-50%)",width:0,height:0,borderTop:"18px solid transparent",borderBottom:"18px solid transparent",borderLeft:`13px solid ${s.color}`,zIndex:2}}/>}
          <div style={{fontSize:26,fontWeight:800,color:"#fff",fontFamily:"'Crimson Pro',serif",lineHeight:1}}>{s.count}</div>
          <div style={{fontSize:9.5,color:"rgba(255,255,255,0.88)",textTransform:"uppercase",letterSpacing:1.1,fontWeight:700,marginTop:4,textAlign:"center"}}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────
const Panel = ({children,title,emoji}) => (
  <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:14,padding:18,boxShadow:"0 2px 12px rgba(29,78,216,0.06)"}}>
    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:14,paddingBottom:10,borderBottom:`1px solid ${T.border}`}}>
      <span style={{fontSize:14}}>{emoji}</span>
      <h3 style={{color:T.blue,fontSize:11,textTransform:"uppercase",letterSpacing:1.6,fontWeight:800,margin:0}}>{title}</h3>
    </div>
    {children}
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({cases}){
  const open    =cases.filter(c=>c.caseStatus==="Open").length;
  const closed  =cases.filter(c=>c.caseStatus==="Closed").length;
  const verified=cases.filter(c=>c.verification==="Verified").length;
  const pending =cases.filter(c=>c.caseStatus==="Pending Investigation").length;
  const appeal  =cases.filter(c=>c.caseStatus==="On Appeal").length;

  const byType  =CASE_TYPES.map(t=>({name:t.replace("Extrajudicial ","EJ ").replace("Arbitrary ","Arb. ").replace("Enforced ","Enf. "),count:cases.filter(c=>c.caseType===t).length})).filter(x=>x.count);
  const byRegion=REGIONS.map(r=>({name:r,Female:cases.filter(c=>c.region===r&&c.gender==="Female").length,Male:cases.filter(c=>c.region===r&&c.gender==="Male").length})).filter(x=>x.Female+x.Male);
  const byStatus=[{name:"Open",value:open},{name:"Closed",value:closed},{name:"Adjourned",value:cases.filter(c=>c.caseStatus==="Adjourned").length},{name:"On Appeal",value:appeal},{name:"Pending",value:pending}].filter(x=>x.value);
  const byGender=GENDERS.map(g=>({name:g,value:cases.filter(c=>c.gender===g).length})).filter(x=>x.value);
  const bySource=SOURCES.map(s=>({name:s,count:cases.filter(c=>c.source===s).length})).filter(x=>x.count);
  const byPerp  =PERPETRATORS.map(p=>({name:p.replace(" Personnel","").replace(" Officer","").replace(" State Actor",""),Open:cases.filter(c=>c.allegedPerpetrator===p&&c.caseStatus==="Open").length,Closed:cases.filter(c=>c.allegedPerpetrator===p&&c.caseStatus==="Closed").length})).filter(x=>x.Open+x.Closed);
  const byMethod=TORTURE_METHODS.map(m=>({name:m.replace(" Confinement","").replace("Stress ",""),count:cases.filter(c=>c.tortureMethod===m).length})).filter(x=>x.count);
  const byMonth =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m,i)=>({month:m,Open:cases.filter(c=>c.caseStatus==="Open"&&new Date(c.filingDate).getMonth()===i).length,Closed:cases.filter(c=>c.caseStatus==="Closed"&&new Date(c.filingDate).getMonth()===i).length}));

  return(
    <div>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22,paddingBottom:18,borderBottom:`2px solid ${T.border}`}}>
        <div>
          <h2 style={{fontFamily:"'Crimson Pro',serif",fontSize:30,color:T.text,fontWeight:700,margin:0}}>Case Analysis Dashboard</h2>
          <p style={{color:T.textDim,fontSize:12,marginTop:5}}>IMLU Staff Analytics — {new Date().toLocaleDateString("en-KE",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
        </div>
        <div style={{display:"flex",gap:8}}>
          <div style={{background:T.bluePale,border:`1px solid ${T.blueXlt}`,borderRadius:8,padding:"7px 14px",fontSize:12,color:T.blue,fontWeight:700}}>📊 {cases.length} Total Cases</div>
          <div style={{background:T.redPale,border:`1px solid #fecaca`,borderRadius:8,padding:"7px 14px",fontSize:12,color:T.red,fontWeight:700}}>🔴 {open} Open</div>
        </div>
      </div>

      <Pipeline cases={cases}/>

      {/* KPI Cards */}
      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:20}}>
        <KPICard label="Total Cases"  value={cases.length} icon="📁" color={T.blue}   sub={`${verified} verified`} trend={8}/>
        <KPICard label="Open Cases"   value={open}         icon="📂" color={T.blueLt} sub="Active investigations"  trend={3}/>
        <KPICard label="Closed"       value={closed}       icon="✅" color="#16a34a"  sub="Concluded cases"        trend={-2}/>
        <KPICard label="Pending"      value={pending}      icon="⏳" color="#d97706"  sub="Awaiting investigation"/>
        <KPICard label="On Appeal"    value={appeal}       icon="⚖" color={T.red}    sub="Appellate courts"/>
      </div>

      {/* Row 1 */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1.6fr 1fr",gap:14,marginBottom:14}}>
        <Panel title="Cases by Status" emoji="🔵">
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie data={byStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={72} innerRadius={36} paddingAngle={3} label={({name,percent})=>`${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                {byStatus.map((_,i)=><Cell key={i} fill={CHART_COLORS[i]}/>)}
              </Pie>
              <Tooltip content={<CTip/>}/><Legend wrapperStyle={{fontSize:11,color:T.textDim}}/>
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Cases by Perpetrator & Status" emoji="👤">
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={byPerp} margin={{left:-10,right:10}}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
              <XAxis dataKey="name" tick={{fill:T.textFade,fontSize:9}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:T.textFade,fontSize:10}} axisLine={false} tickLine={false} allowDecimals={false}/>
              <Tooltip content={<CTip/>}/><Legend wrapperStyle={{fontSize:11,color:T.textDim}}/>
              <Bar dataKey="Open"   fill={T.blue} radius={[4,4,0,0]}/>
              <Bar dataKey="Closed" fill={T.red}  radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Cases by Type" emoji="📊">
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={byType} layout="vertical" margin={{left:4,right:10}}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false}/>
              <XAxis type="number" tick={{fill:T.textFade,fontSize:10}} axisLine={false} tickLine={false} allowDecimals={false}/>
              <YAxis type="category" dataKey="name" tick={{fill:T.blue,fontSize:9}} axisLine={false} tickLine={false} width={82}/>
              <Tooltip content={<CTip/>}/>
              <Bar dataKey="count" radius={[0,4,4,0]}>{byType.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      {/* Row 2 */}
      <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr 1fr",gap:14,marginBottom:14}}>
        <Panel title="Cases by Month & Status" emoji="📅">
          <ResponsiveContainer width="100%" height={185}>
            <AreaChart data={byMonth}>
              <defs>
                <linearGradient id="gO" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.blue} stopOpacity={0.2}/><stop offset="95%" stopColor={T.blue} stopOpacity={0}/></linearGradient>
                <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.red}  stopOpacity={0.2}/><stop offset="95%" stopColor={T.red}  stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
              <XAxis dataKey="month" tick={{fill:T.textFade,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:T.textFade,fontSize:10}} axisLine={false} tickLine={false} allowDecimals={false}/>
              <Tooltip content={<CTip/>}/><Legend wrapperStyle={{fontSize:11,color:T.textDim}}/>
              <Area type="monotone" dataKey="Open"   stroke={T.blue} fill="url(#gO)" strokeWidth={2}/>
              <Area type="monotone" dataKey="Closed" stroke={T.red}  fill="url(#gC)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Cases by Gender" emoji="⚥">
          <ResponsiveContainer width="100%" height={185}>
            <PieChart>
              <Pie data={byGender} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={72} innerRadius={36} paddingAngle={3} label={({name,percent})=>`${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                {byGender.map((_,i)=><Cell key={i} fill={CHART_COLORS[i]}/>)}
              </Pie>
              <Tooltip content={<CTip/>}/><Legend wrapperStyle={{fontSize:11,color:T.textDim}}/>
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Cases by Source" emoji="📡">
          <ResponsiveContainer width="100%" height={185}>
            <BarChart data={bySource} layout="vertical" margin={{left:4,right:10}}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false}/>
              <XAxis type="number" tick={{fill:T.textFade,fontSize:10}} axisLine={false} tickLine={false} allowDecimals={false}/>
              <YAxis type="category" dataKey="name" tick={{fill:T.blue,fontSize:9}} axisLine={false} tickLine={false} width={80}/>
              <Tooltip content={<CTip/>}/>
              <Bar dataKey="count" radius={[0,4,4,0]}>{bySource.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      {/* Row 3 */}
      <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:14}}>
        <Panel title="Cases by Region & Gender" emoji="🗺">
          <ResponsiveContainer width="100%" height={185}>
            <BarChart data={byRegion}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
              <XAxis dataKey="name" tick={{fill:T.textFade,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:T.textFade,fontSize:10}} axisLine={false} tickLine={false} allowDecimals={false}/>
              <Tooltip content={<CTip/>}/><Legend wrapperStyle={{fontSize:11,color:T.textDim}}/>
              <Bar dataKey="Female" fill={T.red}  radius={[4,4,0,0]}/>
              <Bar dataKey="Male"   fill={T.blue} radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Cases by Torture Method" emoji="⚠">
          <ResponsiveContainer width="100%" height={185}>
            <BarChart data={byMethod} layout="vertical" margin={{left:4,right:10}}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false}/>
              <XAxis type="number" tick={{fill:T.textFade,fontSize:10}} axisLine={false} tickLine={false} allowDecimals={false}/>
              <YAxis type="category" dataKey="name" tick={{fill:T.blue,fontSize:9}} axisLine={false} tickLine={false} width={82}/>
              <Tooltip content={<CTip/>}/>
              <Bar dataKey="count" radius={[0,4,4,0]}>{byMethod.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </div>
  );
}

// ─── Case Form ────────────────────────────────────────────────────────────────
function CaseForm({onSave,initial,onCancel}){
  const blank={caseCode:"",caseType:"",caseStatus:"Open",filingDate:new Date().toISOString().split("T")[0],region:"",county:"",age:"",gender:"",consentObtained:"",allegedPerpetrator:"",tortureMethod:"",source:"",verification:"",serviceOffered:"",incidentLocation:"",rightsViolated:"",outcomes:""};
  const [form,setForm]=useState(initial||blank);
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const sel=(k,opts)=>(<select value={form[k]} onChange={e=>f(k,e.target.value)} style={IS}><option value="">Select…</option>{opts.map(o=><option key={o}>{o}</option>)}</select>);
  const sec=(t)=>(<p style={{color:T.blue,fontSize:10.5,textTransform:"uppercase",letterSpacing:1.4,fontWeight:800,margin:"20px 0 12px",paddingTop:16,borderTop:`1px solid ${T.border}`}}>— {t}</p>);

  return(
    <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:16,padding:28,maxWidth:820,margin:"0 auto",boxShadow:"0 4px 24px rgba(29,78,216,0.08)"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:0,paddingBottom:16,borderBottom:`2px solid ${T.border}`}}>
        <div style={{width:5,height:28,background:`linear-gradient(180deg,${T.blue},${T.red})`,borderRadius:3}}/>
        <h3 style={{color:T.text,fontFamily:"'Crimson Pro',serif",margin:0,fontSize:24}}>{initial?"✏️ Edit Case":"📋 Register New Case"}</h3>
      </div>

      {sec("Case Details")}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
        <div><label style={LS}>Case Code</label><input value={form.caseCode} onChange={e=>f("caseCode",e.target.value)} placeholder="IMLU-2024-XXX" style={IS}/></div>
        <div><label style={LS}>Case Type</label>{sel("caseType",CASE_TYPES)}</div>
        <div><label style={LS}>Case Status</label>{sel("caseStatus",STATUSES)}</div>
        <div><label style={LS}>Filing Date</label><input type="date" value={form.filingDate} onChange={e=>f("filingDate",e.target.value)} style={IS}/></div>
        <div><label style={LS}>Region</label>{sel("region",REGIONS)}</div>
        <div><label style={LS}>County</label>{sel("county",COUNTIES)}</div>
      </div>

      {sec("Victim / Survivor")}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
        <div><label style={LS}>Age</label><input type="number" value={form.age} onChange={e=>f("age",e.target.value)} min={1} max={120} style={IS}/></div>
        <div><label style={LS}>Gender</label>{sel("gender",GENDERS)}</div>
        <div><label style={LS}>Consent Obtained</label>{sel("consentObtained",CONSENT_OPTS)}</div>
      </div>

      {sec("Incident Details")}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
        <div><label style={LS}>Alleged Perpetrator</label>{sel("allegedPerpetrator",PERPETRATORS)}</div>
        <div><label style={LS}>Torture Method</label>{sel("tortureMethod",TORTURE_METHODS)}</div>
        <div><label style={LS}>Rights Violated</label>{sel("rightsViolated",RIGHTS)}</div>
        <div style={{gridColumn:"1/-1"}}><label style={LS}>Incident Location</label><input value={form.incidentLocation} onChange={e=>f("incidentLocation",e.target.value)} placeholder="e.g. Pangani Police Station, Nairobi" style={IS}/></div>
      </div>

      {sec("Case Processing")}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
        <div><label style={LS}>Source</label>{sel("source",SOURCES)}</div>
        <div><label style={LS}>Verification</label>{sel("verification",VERIF_OPTS)}</div>
        <div><label style={LS}>Service Offered</label>{sel("serviceOffered",SERVICES)}</div>
        <div><label style={LS}>Outcomes</label>{sel("outcomes",OUTCOMES_LIST)}</div>
      </div>

      <div style={{display:"flex",gap:12,marginTop:24,paddingTop:18,borderTop:`1px solid ${T.border}`}}>
        <button onClick={()=>onSave(form)} style={{background:`linear-gradient(135deg,${T.blue},#1e40af)`,color:"#fff",border:"none",borderRadius:9,padding:"12px 30px",fontWeight:700,cursor:"pointer",fontSize:14,boxShadow:`0 4px 16px ${T.blue}30`}}>
          💾 Save Case
        </button>
        <button onClick={onCancel} style={{background:"#fff",color:T.textDim,border:`1px solid ${T.border}`,borderRadius:9,padding:"12px 24px",cursor:"pointer",fontSize:14}}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Case Table ───────────────────────────────────────────────────────────────
function CaseTable({cases,onEdit,onDelete}){
  const [search,setSearch]=useState("");
  const [filters,setFilters]=useState({caseStatus:"",caseType:"",region:""});
  const filtered=cases.filter(c=>{
    const q=search.toLowerCase();
    return(!q||[c.caseCode,c.incidentLocation,c.county,c.allegedPerpetrator].some(s=>String(s).toLowerCase().includes(q)))
      &&(!filters.caseStatus||c.caseStatus===filters.caseStatus)
      &&(!filters.caseType||c.caseType===filters.caseType)
      &&(!filters.region||c.region===filters.region);
  });
  const COLS=["Case Code","Type","Status","Filed","Region","County","Age","Gender","Consent","Perpetrator","Method","Source","Verified","Service","Location","Rights","Outcomes",""];
  return(
    <div>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center",background:T.white,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 14px",boxShadow:"0 2px 8px rgba(29,78,216,0.05)"}}>
        <input placeholder="🔍 Search code, location, perpetrator…" value={search} onChange={e=>setSearch(e.target.value)} style={{...IS,maxWidth:280,flex:1}}/>
        {[["caseStatus","Status",STATUSES],["caseType","Type",CASE_TYPES],["region","Region",REGIONS]].map(([k,l,opts])=>(
          <select key={k} value={filters[k]} onChange={e=>setFilters(p=>({...p,[k]:e.target.value}))} style={{...IS,maxWidth:145}}>
            <option value="">All {l}s</option>{opts.map(o=><option key={o}>{o}</option>)}
          </select>
        ))}
        <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
          <span style={{color:T.textFade,fontSize:12}}>{filtered.length} records</span>
          <button onClick={()=>exportExcel(filtered)} style={{background:"#f0fdf4",color:"#16a34a",border:"1px solid #bbf7d0",borderRadius:8,padding:"9px 16px",cursor:"pointer",fontWeight:700,fontSize:12.5,whiteSpace:"nowrap"}}>⬇ Export Excel</button>
        </div>
      </div>
      <div style={{overflowX:"auto",borderRadius:12,border:`1px solid ${T.border}`,boxShadow:"0 2px 12px rgba(29,78,216,0.06)"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr style={{background:`linear-gradient(135deg,${T.sidebar},${T.sidebarDk})`}}>
              {COLS.map(h=><th key={h} style={{color:"rgba(255,255,255,0.85)",textAlign:"left",padding:"12px 10px",textTransform:"uppercase",fontSize:9.5,letterSpacing:1.2,fontWeight:800,whiteSpace:"nowrap"}}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c,i)=>(
              <tr key={c.id} style={{borderTop:`1px solid ${T.border}`,background:i%2===0?T.bgRow1:T.bgRow2,transition:"background 0.15s"}}
                onMouseEnter={e=>e.currentTarget.style.background=T.bgHover}
                onMouseLeave={e=>e.currentTarget.style.background=i%2===0?T.bgRow1:T.bgRow2}>
                <td style={{padding:"10px 10px",color:T.blue,fontWeight:700,fontFamily:"monospace",fontSize:11.5,whiteSpace:"nowrap"}}>{c.caseCode}</td>
                <td style={{padding:"10px 10px",color:T.text,whiteSpace:"nowrap"}}>{c.caseType}</td>
                <td style={{padding:"10px 10px",whiteSpace:"nowrap"}}><Badge status={c.caseStatus}/></td>
                <td style={{padding:"10px 10px",color:T.textDim,whiteSpace:"nowrap"}}>{c.filingDate}</td>
                <td style={{padding:"10px 10px",color:T.textMid,whiteSpace:"nowrap"}}>{c.region}</td>
                <td style={{padding:"10px 10px",color:T.textDim,whiteSpace:"nowrap"}}>{c.county}</td>
                <td style={{padding:"10px 10px",color:T.textDim,textAlign:"center"}}>{c.age}</td>
                <td style={{padding:"10px 10px",color:T.textMid,whiteSpace:"nowrap"}}>{c.gender}</td>
                <td style={{padding:"10px 10px",color:c.consentObtained==="Yes"?"#16a34a":c.consentObtained==="No"?"#dc2626":"#d97706",fontWeight:600}}>{c.consentObtained}</td>
                <td style={{padding:"10px 10px",color:T.red,whiteSpace:"nowrap",maxWidth:130,overflow:"hidden",textOverflow:"ellipsis"}}>{c.allegedPerpetrator}</td>
                <td style={{padding:"10px 10px",color:T.textDim,whiteSpace:"nowrap",maxWidth:120,overflow:"hidden",textOverflow:"ellipsis"}}>{c.tortureMethod}</td>
                <td style={{padding:"10px 10px",color:T.textDim,whiteSpace:"nowrap"}}>{c.source}</td>
                <td style={{padding:"10px 10px",color:c.verification==="Verified"?"#16a34a":c.verification==="Unverified"?"#dc2626":"#d97706",fontWeight:600,whiteSpace:"nowrap"}}>{c.verification}</td>
                <td style={{padding:"10px 10px",color:T.textDim,whiteSpace:"nowrap",maxWidth:120,overflow:"hidden",textOverflow:"ellipsis"}}>{c.serviceOffered}</td>
                <td style={{padding:"10px 10px",color:T.textDim,whiteSpace:"nowrap",maxWidth:140,overflow:"hidden",textOverflow:"ellipsis"}} title={c.incidentLocation}>{c.incidentLocation}</td>
                <td style={{padding:"10px 10px",color:T.textDim,whiteSpace:"nowrap",maxWidth:130,overflow:"hidden",textOverflow:"ellipsis"}}>{c.rightsViolated}</td>
                <td style={{padding:"10px 10px",color:T.textDim,whiteSpace:"nowrap"}}>{c.outcomes}</td>
                <td style={{padding:"10px 10px",whiteSpace:"nowrap"}}>
                  <button onClick={()=>onEdit(c)} style={{background:T.bluePale,color:T.blue,border:`1px solid ${T.blueXlt}`,borderRadius:6,padding:"4px 10px",cursor:"pointer",marginRight:5,fontSize:11,fontWeight:600}}>Edit</button>
                  <button onClick={()=>onDelete(c.id)} style={{background:T.redPale,color:T.red,border:"1px solid #fecaca",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:11,fontWeight:600}}>Del</button>
                </td>
              </tr>
            ))}
            {!filtered.length&&<tr><td colSpan={COLS.length} style={{padding:50,textAlign:"center",color:T.textFade}}><div style={{fontSize:32,marginBottom:8}}>🔍</div>No cases found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Reports ──────────────────────────────────────────────────────────────────
function ReportsPage(){
  const [reports,setReports]=useState([
    {id:1,title:"Annual Justice Report 2023",        org:"IMLU Research Unit",            date:"2024-02-01",type:"Annual Report",     size:"2.4 MB",ext:"pdf"},
    {id:2,title:"Gender & Access to Justice Study",  org:"International Justice Monitor", date:"2023-11-15",type:"Research",          size:"1.1 MB",ext:"pdf"},
    {id:3,title:"Court Backlog Reduction Strategy",  org:"Judiciary Performance Unit",    date:"2024-05-10",type:"Policy Paper",      size:"820 KB", ext:"docx"},
    {id:4,title:"Q1 2024 Case Statistics Bulletin",  org:"NCAJ",                          date:"2024-04-30",type:"Quarterly Bulletin",size:"540 KB", ext:"pdf"},
    {id:5,title:"Access to Justice in Arid Regions", org:"UNHCR Kenya",                  date:"2024-01-20",type:"Research",          size:"3.2 MB",ext:"pdf"},
  ]);
  const [search,setSearch]=useState("");
  const [showForm,setShowForm]=useState(false);
  const [newRpt,setNewRpt]=useState({title:"",org:"",type:"Annual Report",file:null});
  const fileRef=useRef();
  const typeClr={"Annual Report":T.blue,"Research":T.red,"Policy Paper":"#16a34a","Quarterly Bulletin":"#d97706"};
  const extIcon={pdf:"📄",docx:"📝",xlsx:"📊",pptx:"📋"};
  const filtered=reports.filter(r=>!search||[r.title,r.org,r.type].some(s=>s.toLowerCase().includes(search.toLowerCase())));

  const handleUpload=()=>{
    if(!newRpt.title||!newRpt.file)return;
    const ext=newRpt.file.name.split(".").pop().toLowerCase();
    setReports(p=>[...p,{id:Date.now(),title:newRpt.title,org:newRpt.org||"IMLU",date:new Date().toISOString().split("T")[0],type:newRpt.type,size:`${(newRpt.file.size/1024).toFixed(0)} KB`,ext}]);
    setNewRpt({title:"",org:"",type:"Annual Report",file:null});
    setShowForm(false);
  };

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:22,paddingBottom:18,borderBottom:`2px solid ${T.border}`}}>
        <div>
          <h2 style={{fontFamily:"'Crimson Pro',serif",fontSize:30,color:T.text,margin:0}}>Reports & Publications</h2>
          <p style={{color:T.textDim,fontSize:13,marginTop:5}}>Upload and manage IMLU research publications and policy reports</p>
        </div>
        <button onClick={()=>setShowForm(!showForm)} style={{background:`linear-gradient(135deg,${T.blue},#1e40af)`,color:"#fff",border:"none",borderRadius:10,padding:"11px 22px",cursor:"pointer",fontWeight:700,fontSize:13,boxShadow:`0 4px 16px ${T.blue}30`}}>
          ⬆ Upload Report
        </button>
      </div>

      {showForm&&(
        <div style={{background:T.white,border:`2px solid ${T.blue}`,borderRadius:14,padding:24,marginBottom:22,boxShadow:`0 4px 20px ${T.blue}15`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,paddingBottom:12,borderBottom:`1px solid ${T.border}`}}>
            <div style={{width:4,height:24,background:`linear-gradient(180deg,${T.blue},${T.red})`,borderRadius:2}}/>
            <h3 style={{color:T.text,fontFamily:"'Crimson Pro',serif",margin:0,fontSize:20}}>Upload New Report</h3>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:14}}>
            <div><label style={LS}>Report Title *</label><input value={newRpt.title} onChange={e=>setNewRpt(p=>({...p,title:e.target.value}))} placeholder="Report title…" style={IS}/></div>
            <div><label style={LS}>Organisation</label><input value={newRpt.org} onChange={e=>setNewRpt(p=>({...p,org:e.target.value}))} placeholder="Publishing organisation…" style={IS}/></div>
            <div><label style={LS}>Report Type</label>
              <select value={newRpt.type} onChange={e=>setNewRpt(p=>({...p,type:e.target.value}))} style={IS}>
                {["Annual Report","Research","Policy Paper","Quarterly Bulletin","Other"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{marginBottom:16}}>
            <label style={LS}>File *</label>
            <div onClick={()=>fileRef.current.click()} style={{border:`2px dashed ${T.blue}`,borderRadius:10,padding:"28px",textAlign:"center",cursor:"pointer",background:T.bluePale,transition:"all 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.background=T.blueXlt+"44"}
              onMouseLeave={e=>e.currentTarget.style.background=T.bluePale}>
              {newRpt.file
                ?<p style={{color:T.blue,fontWeight:700,margin:0}}>✅ {newRpt.file.name} ({(newRpt.file.size/1024).toFixed(0)} KB)</p>
                :<div><p style={{color:T.blue,margin:0,fontWeight:600}}>📁 Click to browse file</p><p style={{color:T.textFade,margin:"6px 0 0",fontSize:11}}>PDF, DOCX, XLSX, PPTX supported</p></div>}
            </div>
            <input ref={fileRef} type="file" accept=".pdf,.docx,.xlsx,.pptx,.doc,.xls" onChange={e=>setNewRpt(p=>({...p,file:e.target.files[0]}))} style={{display:"none"}}/>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={handleUpload} style={{background:`linear-gradient(135deg,${T.blue},#1e40af)`,color:"#fff",border:"none",borderRadius:9,padding:"11px 26px",fontWeight:700,cursor:"pointer",fontSize:14,boxShadow:`0 4px 16px ${T.blue}30`}}>⬆ Upload</button>
            <button onClick={()=>setShowForm(false)} style={{background:"#fff",color:T.textDim,border:`1px solid ${T.border}`,borderRadius:9,padding:"11px 22px",cursor:"pointer",fontSize:14}}>Cancel</button>
          </div>
        </div>
      )}

      <input placeholder="🔍 Search reports…" value={search} onChange={e=>setSearch(e.target.value)} style={{...IS,maxWidth:360,marginBottom:20}}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:14}}>
        {filtered.map(r=>{
          const c=typeClr[r.type]||T.blue;
          return(
            <div key={r.id} style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:14,padding:20,display:"flex",flexDirection:"column",gap:10,transition:"all 0.2s",boxShadow:"0 2px 10px rgba(29,78,216,0.06)",borderTop:`3px solid ${c}`}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 6px 20px ${c}25`;e.currentTarget.style.transform="translateY(-2px)"}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 2px 10px rgba(29,78,216,0.06)";e.currentTarget.style.transform="none"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{background:`${c}15`,color:c,border:`1px solid ${c}40`,borderRadius:20,padding:"3px 12px",fontSize:10.5,fontWeight:700}}>{r.type}</span>
                <span style={{color:T.textFade,fontSize:20}}>{extIcon[r.ext]||"📄"}</span>
              </div>
              <h4 style={{color:T.text,fontFamily:"'Crimson Pro',serif",margin:0,fontSize:17,lineHeight:1.35}}>{r.title}</h4>
              <p style={{color:T.textDim,fontSize:12,margin:0}}>{r.org}</p>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:T.textFade}}><span>📅 {r.date}</span><span>💾 {r.size}</span></div>
              <button style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:T.bluePale,color:T.blue,border:`1px solid ${T.blueXlt}`,padding:"9px 16px",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",width:"100%",transition:"background 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.background=T.blueXlt}
                onMouseLeave={e=>e.currentTarget.style.background=T.bluePale}>
                ⬇ Download / View
              </button>
              <button onClick={()=>setReports(p=>p.filter(x=>x.id!==r.id))} style={{background:"transparent",color:T.red,border:"none",cursor:"pointer",fontSize:11,textAlign:"right",padding:0}}>🗑 Remove</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App(){
  const [user,setUser]        =useState(null);
  const [view,setView]        =useState("dashboard");
  const [cases,setCases]      =useState(SEED_CASES);
  const [editing,setEditing]  =useState(null);
  const [showForm,setShowForm]=useState(false);

  if(!user) return <IMLULogin onLogin={u=>{setUser(u);setView("dashboard");}}/>;

  const NAV=[
    {key:"dashboard",label:"Dashboard",    icon:"◈"},
    {key:"cases",    label:"Case Registry",icon:"⊞"},
    {key:"register", label:"Register Case",icon:"+"},
    {key:"reports",  label:"Reports",      icon:"📄"},
  ];

  const saveCase=form=>{
    if(editing) setCases(p=>p.map(c=>c.id===editing.id?{...form,id:editing.id}:c));
    else setCases(p=>[...p,{...form,id:Date.now()}]);
    setEditing(null);setShowForm(false);setView("cases");
  };
  const delCase=id=>{if(window.confirm("Delete this case?"))setCases(p=>p.filter(c=>c.id!==id));};
  const go=v=>{setView(v);setShowForm(false);setEditing(null);};

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:${T.bg};font-family:'DM Sans',sans-serif;color:${T.text}}
        input,select,textarea{font-family:'DM Sans',sans-serif;transition:border-color 0.2s;color:${T.text}}
        input:focus,select:focus,textarea:focus{border-color:${T.blue}!important;outline:none;box-shadow:0 0 0 3px ${T.blue}18}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:${T.bg}}
        ::-webkit-scrollbar-thumb{background:${T.blueXlt};border-radius:4px}
        ::-webkit-scrollbar-thumb:hover{background:${T.blue}}
        button{font-family:'DM Sans',sans-serif;cursor:pointer}
        @keyframes appFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fadein{animation:appFadeIn 0.3s ease both}
        .navbtn:hover{background:rgba(255,255,255,0.12)!important}
      `}</style>

      <div style={{display:"flex",minHeight:"100vh"}}>

        {/* ── Sidebar (deep blue) ── */}
        <aside style={{width:232,background:`linear-gradient(180deg,${T.sidebar} 0%,${T.sidebarDk} 100%)`,borderRight:"none",display:"flex",flexDirection:"column",position:"fixed",top:0,bottom:0,left:0,zIndex:50,boxShadow:"4px 0 24px rgba(29,78,216,0.25)"}}>
          {/* Red+white top stripe */}
          <div style={{height:4,background:`linear-gradient(90deg,${T.red},#fff,${T.blue})`}}/>

          {/* Logo */}
          <div style={{padding:"20px 20px 14px",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
            <div style={{width:40,height:40,background:"rgba(255,255,255,0.15)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,border:"1px solid rgba(255,255,255,0.2)"}}>⚖</div>
            <div>
              <h1 style={{fontSize:16,fontFamily:"'Crimson Pro',serif",color:"#fff",fontWeight:700,lineHeight:1.2}}>IMLU</h1>
              <p style={{color:"rgba(255,255,255,0.5)",fontSize:9,textTransform:"uppercase",letterSpacing:1.5,fontWeight:700}}>Case Registrar</p>
            </div>
          </div>

          {/* Nav */}
          <nav style={{flex:1,paddingTop:10}}>
            <p style={{color:"rgba(255,255,255,0.35)",fontSize:9,textTransform:"uppercase",letterSpacing:1.5,fontWeight:700,padding:"8px 20px 4px"}}>Navigation</p>
            {NAV.map(n=>(
              <button key={n.key} onClick={()=>go(n.key)} className="navbtn"
                style={{width:"100%",background:view===n.key?"rgba(255,255,255,0.15)":"transparent",color:view===n.key?"#fff":"rgba(255,255,255,0.55)",border:"none",textAlign:"left",padding:"11px 20px",fontSize:13.5,fontWeight:view===n.key?700:400,display:"flex",gap:10,alignItems:"center",borderLeft:view===n.key?"3px solid #fff":"3px solid transparent",transition:"all 0.2s"}}>
                <span style={{fontSize:15,opacity:0.9}}>{n.icon}</span>{n.label}
                {n.key==="cases"&&<span style={{marginLeft:"auto",background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:10,fontWeight:800,padding:"1px 7px",borderRadius:20}}>{cases.length}</span>}
              </button>
            ))}
          </nav>

          {/* User info */}
          <div style={{padding:"14px 18px",borderTop:"1px solid rgba(255,255,255,0.1)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <div style={{width:34,height:34,background:`linear-gradient(135deg,${T.red},#fff)`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:T.red,flexShrink:0,border:"2px solid rgba(255,255,255,0.3)"}}>{user.name[0]}</div>
              <div style={{overflow:"hidden"}}>
                <p style={{color:"#fff",fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</p>
                <p style={{color:"rgba(255,255,255,0.5)",fontSize:10.5,textTransform:"uppercase",letterSpacing:0.8,fontWeight:600}}>{user.role}</p>
              </div>
            </div>
            <button onClick={()=>setUser(null)} style={{color:T.red,background:"rgba(220,38,38,0.15)",border:"1px solid rgba(220,38,38,0.3)",borderRadius:6,fontSize:12,padding:"6px 14px",width:"100%",fontWeight:600}}>
              ↩ Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="fadein" style={{marginLeft:232,flex:1,padding:"28px 30px 60px",minHeight:"100vh",background:T.bg}}>
          {view==="dashboard"&&<Dashboard cases={cases}/>}

          {view==="cases"&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:22,paddingBottom:18,borderBottom:`2px solid ${T.border}`}}>
                <div>
                  <h2 style={{fontFamily:"'Crimson Pro',serif",fontSize:30,color:T.text,margin:0}}>Case Registry</h2>
                  <p style={{color:T.textDim,fontSize:13,marginTop:5}}>All case records · Staff restricted · Full IMLU dataset</p>
                </div>
                <button onClick={()=>go("register")} style={{background:`linear-gradient(135deg,${T.blue},#1e40af)`,color:"#fff",border:"none",borderRadius:10,padding:"11px 22px",fontWeight:700,fontSize:13.5,boxShadow:`0 4px 16px ${T.blue}30`}}>
                  + New Case
                </button>
              </div>
              <CaseTable cases={cases} onEdit={c=>{setEditing(c);setShowForm(true);go("register");}} onDelete={delCase}/>
            </div>
          )}

          {view==="register"&&(
            showForm||editing
              ?<CaseForm initial={editing} onSave={saveCase} onCancel={()=>{setShowForm(false);setEditing(null);go("cases");}}/>
              :<div>
                <div style={{paddingBottom:18,marginBottom:22,borderBottom:`2px solid ${T.border}`}}>
                  <h2 style={{fontFamily:"'Crimson Pro',serif",fontSize:30,color:T.text,margin:0}}>Register a Case</h2>
                  <p style={{color:T.textDim,fontSize:13,marginTop:5}}>Add a new case to the IMLU registry</p>
                </div>
                <button onClick={()=>setShowForm(true)} style={{background:`linear-gradient(135deg,${T.blue},#1e40af)`,color:"#fff",border:"none",borderRadius:10,padding:"13px 30px",fontWeight:700,fontSize:15,boxShadow:`0 4px 16px ${T.blue}30`}}>
                  📋 Open Case Form
                </button>
              </div>
          )}

          {view==="reports"&&<ReportsPage/>}
        </main>
      </div>
    </>
  );
}

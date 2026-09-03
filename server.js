const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");
require("dotenv").config?.();

const app = express();
const PORT = process.env.PORT || 3000;
const DATA = path.join(__dirname, "cases.json");

if (!fs.existsSync(DATA)) fs.writeFileSync(DATA, "[]");

app.use(express.json({limit:"1mb"}));
app.use(express.urlencoded({extended:true}));
app.use(session({
  secret: process.env.SESSION_SECRET || "bestie-mini-change-me",
  resave:false, saveUninitialized:false,
  cookie:{httpOnly:true,sameSite:"lax",secure:false,maxAge:86400000}
}));
app.use(express.static(path.join(__dirname,"public")));

function auth(req,res,next){
  if(req.session.admin) return next();
  res.status(401).json({error:"Unauthorized"});
}
function readCases(){ return JSON.parse(fs.readFileSync(DATA,"utf8")); }
function writeCases(x){ fs.writeFileSync(DATA, JSON.stringify(x,null,2)); }

app.post("/api/login",(req,res)=>{
  const password=String(req.body.password||"");
  if(password === String(process.env.ADMIN_PASSWORD||"change-this-password")){
    req.session.admin=true; return res.json({ok:true});
  }
  res.status(401).json({error:"Wrong password"});
});
app.post("/api/logout",auth,(req,res)=>req.session.destroy(()=>res.json({ok:true})));
app.get("/api/cases",auth,(req,res)=>res.json(readCases()));

app.post("/api/cases",auth,(req,res)=>{
  const {name,command,code}=req.body;
  if(!name||!command||!code) return res.status(400).json({error:"All fields are required"});
  const cases=readCases();
  const item={id:Date.now().toString(),name:String(name),command:String(command),code:String(code)};
  cases.push(item); writeCases(cases); res.json(item);
});
app.put("/api/cases/:id",auth,(req,res)=>{
  const cases=readCases(), i=cases.findIndex(x=>x.id===req.params.id);
  if(i<0) return res.status(404).json({error:"Not found"});
  cases[i]={...cases[i],name:String(req.body.name||""),command:String(req.body.command||""),code:String(req.body.code||"")};
  writeCases(cases); res.json(cases[i]);
});
app.delete("/api/cases/:id",auth,(req,res)=>{
  const cases=readCases().filter(x=>x.id!==req.params.id);
  writeCases(cases); res.json({ok:true});
});

app.get("/api/export",auth,(req,res)=>{
  const cases=readCases();
  const out=cases.map(x=>`case '${x.command}': {\n${x.code}\nbreak;\n}`).join("\n\n");
  res.setHeader("Content-Type","text/plain; charset=utf-8");
  res.setHeader("Content-Disposition",'attachment; filename="bestie-mini-cases.js"');
  res.send(out);
});

app.listen(PORT,()=>console.log(`Bestie Mini Admin: http://localhost:${PORT}`));

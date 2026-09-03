let editing=null;
const $=id=>document.getElementById(id);
async function api(url,opt={}){const r=await fetch(url,{headers:{"Content-Type":"application/json"},...opt});const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||"Request failed");return d}
async function login(){try{await api("/api/login",{method:"POST",body:JSON.stringify({password:$("password").value})});$("login").classList.add("hidden");$("app").classList.remove("hidden");load()}catch(e){$("err").textContent=e.message}}
async function load(){try{const a=await api("/api/cases");$("count").textContent=a.length+" cases";$("list").innerHTML=a.map(x=>`<div class="card case"><h3>${esc(x.name)}</h3><div class="tag">.${esc(x.command)}</div><pre class="code">${esc(x.code)}</pre><button onclick="edit('${x.id}')">EDIT</button><button class="secondary" onclick="del('${x.id}')">DELETE</button></div>`).join("")||'<div class="card">No cases yet. Add your first case.</div>'}catch(e){if(e.message==="Unauthorized")location.reload()}}
function showAdd(){editing=null;$("formTitle").textContent="Add Case";$("name").value="";$("command").value="";$("code").value="";$("form").classList.remove("hidden")}
function hideForm(){$("form").classList.add("hidden")}
async function edit(id){const a=await api("/api/cases");const x=a.find(v=>v.id===id);editing=id;$("formTitle").textContent="Edit Case";$("name").value=x.name;$("command").value=x.command;$("code").value=x.code;$("form").classList.remove("hidden");scrollTo(0,0)}
async function save(){const body={name:$("name").value,command:$("command").value,code:$("code").value};try{await api(editing?"/api/cases/"+editing:"/api/cases",{method:editing?"PUT":"POST",body:JSON.stringify(body)});hideForm();load()}catch(e){alert(e.message)}}
async function del(id){if(!confirm("Delete this case?"))return;await api("/api/cases/"+id,{method:"DELETE"});load()}
function exportCases(){location.href="/api/export"}
async function logout(){await api("/api/logout",{method:"POST"});location.reload()}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

const $ = (selector, root=document) => root.querySelector(selector);
const esc = (value="") => String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const status = $("#motion-status");
let editions = [];
let selectedId = null;
let openTimer = null;
const summary = $("#sumario");

function finishOpening(scrollToSummary=false){
  clearTimeout(openTimer);
  document.body.classList.remove("is-opening");
  document.body.classList.add("is-open");
  summary.inert = false;
  summary.removeAttribute("aria-hidden");
  try{sessionStorage.setItem("adapt-em-pauta-opened","1")}catch{}
  status.textContent = "O jornal abriu. Escolha uma edição no sumário.";
  if(scrollToSummary) summary.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
}
function startOpening(){
  clearTimeout(openTimer);
  summary.inert = true;
  summary.setAttribute("aria-hidden","true");
  document.body.classList.remove("is-open");
  document.body.classList.add("is-opening");
  if(matchMedia("(prefers-reduced-motion: reduce)").matches){finishOpening(false);return}
  status.textContent = "Abrindo o jornal…";
  openTimer=setTimeout(()=>finishOpening(false),1500);
}
$("#skip-opening").addEventListener("click",()=>finishOpening(true));
$("#replay-opening").addEventListener("click",()=>startOpening());
try{
  if(!matchMedia("(prefers-reduced-motion: reduce)").matches && !sessionStorage.getItem("adapt-em-pauta-opened")) startOpening();
  else finishOpening(false);
}catch{startOpening()}

function renderIndex(){
  const list=$("#edition-list");
  list.innerHTML=editions.map(item=>`<button class="edition-row" type="button" data-edition-id="${esc(item.id)}" aria-pressed="false" aria-controls="reader"><span class="edition-number">${esc(item.id)}</span><span class="edition-copy"><strong>${esc(item.title)}</strong><small>${esc(item.date)} · ${esc(item.label)}</small></span><span class="edition-arrow" aria-hidden="true">↗</span></button>`).join("");
  const featured=editions.find(item=>item.featured)||editions[0];
  if(featured) selectEdition(featured.id);
  $("#edition-count").textContent=String(editions.length).padStart(2,"0");$("#edition-count-label").textContent=String(editions.length).padStart(2,"0");
  $("#edition-list").addEventListener("click",event=>{
    const button=event.target.closest("[data-edition-id]");
    if(button)selectEdition(button.dataset.editionId);
  });
}
function selectEdition(id){
  selectedId=id;
  const item=editions.find(entry=>entry.id===id);
  if(!item)return;
  document.querySelectorAll("[data-edition-id]").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.editionId===id)));
  $("#featured-date").textContent=item.date;
  $("#featured-label").textContent=item.label;
  $("#featured-title").textContent=item.title;
  $("#featured-summary").textContent=item.summary;
  $(".featured-issue").dataset.issue=item.id;
  $("#read-selected").textContent="Ler edição "+item.id+" →";
  $("#selection-status").textContent="Edição "+item.id+" selecionada.";
}
fetch(new URL("data/editions/index.json",document.baseURI))
  .then(response=>{if(!response.ok)throw new Error("Não foi possível carregar o arquivo");return response.json()})
  .then(data=>{editions=data.editions||[];renderIndex();if(!editions.length)$("#load-status").textContent="Nenhuma edição está disponível no sumário."})
  .catch(()=>{$("#load-status").textContent="O sumário não carregou. Atualize a página para tentar de novo."});

$("#filter-editions").addEventListener("input",event=>{
  const term=event.target.value.trim().toLocaleLowerCase("pt-BR");let visible=0;
  document.querySelectorAll(".edition-row").forEach(row=>{
    const match=row.textContent.toLocaleLowerCase("pt-BR").includes(term);
    row.hidden=!match;if(match)visible++;
  });
  $("#selection-status").textContent=term?visible+" edição(ões) encontrada(s).":(selectedId?"Edição "+selectedId+" selecionada.":"");
});
$("#read-selected").addEventListener("click",async()=>{
  const item=editions.find(entry=>entry.id===selectedId);
  if(!item)return;
  const button=$("#read-selected");
  button.disabled=true;button.textContent="Abrindo edição…";
  try{
    const response=await fetch(new URL(item.path,document.baseURI));
    if(!response.ok)throw new Error("Edição não encontrada");
    renderEdition(await response.json());
    $("#reader").hidden=false;
    $("#reader").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
    $("#reader-title").focus({preventScroll:true});
  }catch{$("#load-status").textContent="Não foi possível abrir essa edição."}
  finally{button.disabled=false;button.textContent="Ler edição "+item.id+" →"}
});
function renderEdition(data){
  $("#reader-number").textContent=data.edition;$("#reader-number-cover").textContent=data.edition;
  $("#reader-date").textContent=data.date;
  $("#reader-title").textContent=data.title;
  $("#reader-dek").textContent=data.dek;
  $("#reader-intro").textContent=data.intro;
  $("#reader-stories").innerHTML=(data.stories||[]).map(item=>`<article class="story-card"><span class="micro">${esc(item.category)}</span><h4>${esc(item.title)}</h4><p>${esc(item.text)}</p><span class="story-tag">${esc(item.tag)}</span></article>`).join("");
  $("#reader-departments").innerHTML=(data.departments||[]).map(item=>`<article class="dept-card"><span class="micro">${esc(item.name)}</span><h4>${esc(item.title)}</h4><p>${esc(item.text)}</p></article>`).join("");
  $("#reader-agenda").innerHTML=(data.agenda||[]).map(item=>`<article class="agenda-row"><span class="agenda-day">${esc(item.day)}</span><div><h4>${esc(item.title)}</h4><p>${esc(item.text)}</p></div></article>`).join("");
  $("#reader-horoscope").innerHTML=(data.horoscope||[]).map(item=>`<article class="sign-card"><span class="symbol" aria-hidden="true">${esc(item.symbol)}</span><h4>${esc(item.sign)}</h4><p>${esc(item.text)}</p></article>`).join("");
  $("#reader-closing").textContent=data.closing;
}
$("#back-to-index").addEventListener("click",()=>{
  $("#reader").hidden=true;
  summary.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
  $("#read-selected").focus({preventScroll:true});
});
$("#print-edition-reader").addEventListener("click",()=>window.print());
$("#copy-tag").addEventListener("click",async()=>{
  const feedback=$("#copy-status");
  try{await navigator.clipboard.writeText("#empauta");feedback.textContent="#empauta copiada."}
  catch{feedback.textContent="Copie #empauta e publique no Feedz."}
});

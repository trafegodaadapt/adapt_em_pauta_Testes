const DATA_URL = new URL("../data/editions/001.json", document.currentScript.src);
const $ = (selector, root=document) => root.querySelector(selector);
const esc = (value="") => String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
function renderEdition(data){
  $("#edition-date").textContent = data.date;
  $("#edition-label").textContent = data.period;
  $("#cover-title").textContent = data.title;
  $("#cover-dek").textContent = data.dek;
  $("#cover-intro").textContent = data.intro;
  $("#edition-number").textContent = data.edition;
  $("#cover-stories").innerHTML = data.stories.map((item,index) => `<article class="story" data-search-card><span class="tag">${esc(item.category)}</span><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p><span class="tag">${esc(item.tag)}</span></article>`).join("");
  $("#departments").innerHTML = data.departments.map(item => `<article class="dept"><span class="tag">${esc(item.name)}</span><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></article>`).join("");
  $("#agenda-items").innerHTML = data.agenda.map(item => `<article class="agenda-card"><span class="agenda-day">${esc(item.day)}</span><div><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></div></article>`).join("");
  $("#horoscope-list").innerHTML = data.horoscope.map(item => `<article class="sign"><span aria-hidden="true">${esc(item.symbol)}</span><h3>${esc(item.sign)}</h3><p>${esc(item.text)}</p></article>`).join("");
  $("#archive-entry").innerHTML = `<div class="archive-number">${esc(data.edition)}</div><div><span class="tag">${esc(data.date)} · ${esc(data.period)}</span><h3>${esc(data.title)}</h3><p>Primeira edição disponível no arquivo de demonstração. As próximas edições podem ser adicionadas seguindo o modelo descrito no README.</p></div>`;
  $("#closing-copy").textContent = data.closing;
}
fetch(DATA_URL).then(response=>{if(!response.ok)throw new Error("Não foi possível carregar a edição");return response.json()}).then(renderEdition).catch(()=>{$("#load-status").textContent="Não foi possível carregar o conteúdo da edição. Tente atualizar a página."});
$("#search-edition").addEventListener("input", event=>{
 const term=event.target.value.trim().toLocaleLowerCase("pt-BR");let visible=0;
 document.querySelectorAll("[data-search-card]").forEach(card=>{const match=card.textContent.toLocaleLowerCase("pt-BR").includes(term);card.hidden=!match;if(match)visible++});
 $("#search-status").textContent=term?visible+" história(s) encontrada(s).":"";
});
$("#copy-tag").addEventListener("click",async()=>{
 const status=$("#copy-status");
 try{await navigator.clipboard.writeText("#empauta");status.textContent="#empauta copiada."}
 catch{status.textContent="Copie #empauta e publique no Feedz."}
});
$("#print-page").addEventListener("click",()=>window.print());

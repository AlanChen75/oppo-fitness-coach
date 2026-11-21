import{r as d}from"./sw-register-DEgpXgCw.js";import{E as g}from"./catalog-Daa4BwYz.js";d();const m=["beginner","intermediate","advanced","machine"];function s(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function f(e){return e==="front"?"正面":"側面"}function u(e){const r=e.targetsZh.join(" · "),n=e.demoOnly?`./demo.html?exercise=${encodeURIComponent(e.id)}`:`./train.html?exercise=${encodeURIComponent(e.id)}`,t=e.demoOnly?"示範":f(e.view),i=`${e.nameZh}示範`;return`
    <a class="exercise-card" href="${n}">
      <div class="exercise-card-top">
        <span class="exercise-view-tag">${s(t)}</span>
      </div>
      <div class="exercise-figure"><img src="./figures/${encodeURIComponent(e.id)}.gif" loading="lazy" alt="${s(i)}"></div>
      <div class="exercise-name">${s(e.nameZh)}</div>
      <div class="exercise-targets">${s(r)}</div>
    </a>
  `}function h(e){const r=document.querySelector("#exercise-catalog");if(!r)throw new Error("Missing #exercise-catalog");const n=m.map(t=>{const a=g.filter(l=>l.tier===t).map(u).join("");return`
      <section
        class="tier-panel"
        id="panel-${t}"
        role="tabpanel"
        aria-labelledby="tab-${t}"
        data-tier="${t}"${t===e?"":" hidden"}
      >
        <div class="exercise-grid">
          ${a}
        </div>
      </section>
    `}).join("");r.innerHTML=n}function o(e){document.querySelectorAll(".tier-tab[data-tier]").forEach(t=>{const i=t.dataset.tier===e;t.setAttribute("aria-selected",i?"true":"false"),t.classList.toggle("is-active",i)}),document.querySelectorAll(".tier-panel[data-tier]").forEach(t=>{const i=t.dataset.tier===e;t.hidden=!i})}function p(){const e=Array.from(document.querySelectorAll(".tier-tab[data-tier]"));e.length!==0&&e.forEach((r,n)=>{r.addEventListener("click",()=>{const t=r.dataset.tier;t&&o(t)}),r.addEventListener("keydown",t=>{if(t.key!=="ArrowLeft"&&t.key!=="ArrowRight")return;t.preventDefault();const i=t.key==="ArrowRight"?(n+1)%e.length:(n-1+e.length)%e.length,a=e[i],c=a==null?void 0:a.dataset.tier;a&&c&&(o(c),a.focus())})})}h("beginner");p();

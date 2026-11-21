import{r as E}from"./sw-register-DEgpXgCw.js";import{g as D}from"./catalog-Daa4BwYz.js";import{l as f,g as j,r as h,d as H}from"./storage-syORRQI_.js";import"./db-wefy5cVT.js";E();function c(s){const e=document.querySelector(s);if(!e)throw new Error(`Missing element: ${s}`);return e}const _=c("#review-status"),m=c("#session-list"),g=c("#detail-section"),b=c("#session-detail");let $=null,u=null;function a(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function w(s){const e=new Date(s);if(Number.isNaN(e.getTime()))return s;const t=n=>String(n).padStart(2,"0");return`${e.getFullYear()}-${t(e.getMonth()+1)}-${t(e.getDate())} ${t(e.getHours())}:${t(e.getMinutes())}:${t(e.getSeconds())}`}function S(s){var e;return((e=D(s))==null?void 0:e.nameZh)??s}function y(s){const e=Array.from(new Set(s.sets.map(t=>S(t.exercise))));return e.length>0?e.join("、"):"未記錄動作"}function L(s){let e=0,t=0,n=0,i=0;for(const o of s.sets){n+=o.total_sample_count??0,i+=o.valid_sample_count??0;for(const p of o.reps)p.status==="complete"?e+=1:t+=1}const r=n>0?` · 有效 ${Math.round(i/n*100)}%`:"";return s.interrupted?{complete:e,uncertain:t,totalSamples:n,validSamples:i,integrityLabel:s.pose_evidence_available?`已中斷${r}`:`已中斷 · 無 Pose 證據${r}`,integrityTone:"fail"}:s.pose_evidence_available?{complete:e,uncertain:t,totalSamples:n,validSamples:i,integrityLabel:`完整（含 Pose 證據${r}）`,integrityTone:"ok"}:{complete:e,uncertain:t,totalSamples:n,validSamples:i,integrityLabel:`無 Pose 證據${r}`,integrityTone:"warn"}}function v(s,e){_.textContent=s,_.className=`alert-banner ${e}`}function k(s){if(s.length===0){m.innerHTML='<p>尚無訓練紀錄。請先前往 <a href="./exercises.html" style="color:var(--accent)">選擇動作</a> 開始訓練。</p>';return}m.innerHTML=s.map(e=>{const t=L(e),n=y(e);return`
        <button class="session-card-btn${e.session_id===$?" selected":""}" data-session-id="${a(e.session_id)}">
          <div class="session-head">
            <span class="session-date">${a(w(e.started_at))}</span>
            <span class="badge ${t.integrityTone}">${a(t.integrityLabel)}</span>
          </div>
          <div class="session-meta">
            ${a(n)} · 組數 ${e.sets.length} 組 · 完成 ${t.complete} 下 · 待確認 ${t.uncertain} 下
          </div>
        </button>
      `}).join(""),m.querySelectorAll("[data-session-id]").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.sessionId;t&&x(t)})})}function N(s,e,t){const n=s.total_sample_count>0?`${Math.round(s.valid_sample_count/s.total_sample_count*100)}%`:"--",i=s.reps.length===0?'<tr><td colspan="6" style="color:var(--text-dim)">本組無計數 rep</td></tr>':s.reps.map((l,d)=>{const M=l.metrics.min_knee_angle!==null&&l.metrics.min_knee_angle!==void 0?`${Math.round(l.metrics.min_knee_angle)}°`:"--",P=l.status==="complete"?"ok":"warn";return`
            <tr>
              <td>${d+1}</td>
              <td><span class="badge ${P}">${a(l.status)}</span></td>
              <td>${Math.round(l.metrics.tempo_ms)}</td>
              <td>${a(M)}</td>
              <td>${Math.round(l.quality.tracking_gap_ms)}</td>
              <td>${a(l.reason)}</td>
            </tr>
          `}).join(""),r=S(s.exercise),o=s.view,p=o==="front"?"正面":o==="side"?"側面":o;return`
    <div class="card" style="background:var(--surface-2); margin-top:12px;">
      <h2>第 ${e+1} 組（${a(r)} / ${a(p)}）</h2>
      <div class="session-meta">
        樣本 ${s.valid_sample_count}/${s.total_sample_count}（${n}） · 總缺口 ${Math.round(s.total_tracking_gap_ms)} ms · OPFS Pose 樣本：${t} 筆
      </div>
      <div class="table-wrap">
        <table class="rep-table">
          <thead>
            <tr>
              <th>序號</th>
              <th>status</th>
              <th>tempo_ms</th>
              <th>峰值</th>
              <th>tracking_gap_ms</th>
              <th>reason</th>
            </tr>
          </thead>
          <tbody>${i}</tbody>
        </table>
      </div>
    </div>
  `}async function q(s){const e=await Promise.all(s.sets.map(async r=>{var o;return{set_id:r.set_id,pose_file_ref:((o=r.reps[0])==null?void 0:o.pose_file_ref)??null,samples:await h(s.session_id,r.set_id)}})),t={...s,pose_sequences:e},n=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),i=document.createElement("a");i.href=URL.createObjectURL(n),i.download=`session-${s.session_id.slice(0,8)}.json`,i.click(),URL.revokeObjectURL(i.href)}async function x(s){$=s,u=null;const e=await j(s);if(!e){g.classList.add("hidden"),v("找不到該筆訓練紀錄","warn");return}const t=await Promise.all(e.sets.map(l=>h(e.session_id,l.set_id).then(d=>d.length))),n=L(e),i=`${e.camera.facing} ${e.camera.width}x${e.camera.height}`,r=e.sets.map((l,d)=>N(l,d,t[d]??0)).join("");g.classList.remove("hidden"),b.innerHTML=`
    <div class="result-table">
      <div class="result-row"><span class="k">動作</span><span class="v">${a(y(e))}</span></div>
      <div class="result-row"><span class="k">Session ID</span><span class="v">${a(e.session_id)}</span></div>
      <div class="result-row"><span class="k">開始時間</span><span class="v">${a(w(e.started_at))}</span></div>
      <div class="result-row"><span class="k">資料狀態</span><span class="v ${n.integrityTone}">${a(n.integrityLabel)}</span></div>
      <div class="result-row"><span class="k">總次數</span><span class="v">完成 ${n.complete} / 待確認 ${n.uncertain}</span></div>
      <div class="result-row"><span class="k">Device Profile</span><span class="v">${a(e.device_profile_id)}</span></div>
      <div class="result-row"><span class="k">相機設定</span><span class="v">${a(i)}</span></div>
      <div class="result-row"><span class="k">模型 / 規則</span><span class="v">${a(e.pose_model)} / ${a(e.rules_version)}</span></div>
    </div>

    <div class="row2" style="margin-top:12px;">
      <button id="btn-export-session" class="btn-primary">匯出完整 JSON</button>
      <button id="btn-delete-step1" class="btn-danger">刪除 Session</button>
    </div>

    <div id="delete-confirm-box" class="confirm-box hidden">
      <p>確定要永久刪除此 Session 與 OPFS Pose 序列檔案？此動作無法復原。</p>
      <div class="row2">
        <button id="btn-delete-confirm" class="btn-danger">確認刪除</button>
        <button id="btn-delete-cancel" class="btn-secondary">取消</button>
      </div>
    </div>

    ${r||'<p style="margin-top:12px;">此 Session 沒有任何組別資料。</p>'}
  `,c("#btn-export-session").addEventListener("click",()=>{q(e)});const o=c("#delete-confirm-box");c("#btn-delete-step1").addEventListener("click",()=>{u=e.session_id,o.classList.remove("hidden")}),c("#btn-delete-cancel").addEventListener("click",()=>{u=null,o.classList.add("hidden")}),c("#btn-delete-confirm").addEventListener("click",()=>{u===e.session_id&&O(e.session_id)});const p=await f();k(p)}async function O(s){try{await H(s),$=null,u=null,g.classList.add("hidden"),b.innerHTML="",v("已刪除該 Session 與本地 Pose 檔案","ok"),await T()}catch(e){v(`刪除失敗：${String(e)}`,"fail")}}async function T(){try{const s=await f();k(s);const t=new URLSearchParams(window.location.search).get("session");t&&s.some(n=>n.session_id===t)&&await x(t)}catch(s){m.innerHTML="",v(`讀取紀錄失敗：${String(s)}`,"fail")}}T();

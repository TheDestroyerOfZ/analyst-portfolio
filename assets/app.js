"use strict";
(() => {
  const data = window.PORTFOLIO_DATA;
  const $ = id => document.getElementById(id);
  const esc = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = value => '$' + value.toLocaleString('en-US', {maximumFractionDigits:0});
  const exact = value => '$' + value.toLocaleString('en-US', {minimumFractionDigits:2,maximumFractionDigits:2});
  const month = value => new Date(value+'-01T12:00:00').toLocaleDateString('en',{month:'short',year:'2-digit'});
  function chart(values, width, height, labelled=false) {
    const left=labelled?45:0, right=labelled?10:0, top=12, bottom=labelled?30:3;
    const w=width-left-right, h=height-top-bottom, max=Math.max(...values)*1.15 || 1;
    const points=values.map((v,i)=>[left+i*w/(values.length-1),top+h-v/max*h]);
    let grid='';
    for(let i=0;i<=3;i++) {
      const y=top+h-i*h/3;
      grid+=`<line x1="${left}" y1="${y}" x2="${width-right}" y2="${y}" stroke="#dce3d5" stroke-width="1"/>`;
      if(labelled) grid+=`<text x="${left-9}" y="${y+3}" text-anchor="end" fill="#687b65" font-size="9">${Math.round(max*i/3000)}k</text>`;
    }
    if(labelled) points.forEach((p,i)=>{if(i%2===0||i===points.length-1)grid+=`<text x="${p[0]}" y="${height-7}" text-anchor="middle" fill="#687b65" font-size="8">${month(data.months[i]).split(' ')[0]}</text>`;});
    const line=points.map(p=>p.join(',')).join(' ');
    return grid+`<polygon points="${left},${top+h} ${line} ${width-right},${top+h}" fill="#b9d49b" opacity=".22"/><polyline points="${line}" fill="none" stroke="#367251" stroke-width="2.5" stroke-linejoin="round"/>`+points.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="${labelled?3:2}" fill="#367251"><title>${month(data.months[i])}: ${exact(values[i])}</title></circle>`).join('');
  }
  function retention() {
    const entries=Object.entries(data.retention), max=Math.max(...entries.flatMap(([,points])=>points.map(p=>p[0]))), colors=['#47745a','#ac8c55','#6b88a1'];
    let svg='<line x1="30" y1="135" x2="350" y2="135" stroke="#c5cfbb"/><line x1="30" y1="10" x2="30" y2="135" stroke="#c5cfbb"/><text x="24" y="15" text-anchor="end" font-size="8" fill="#65736a">100%</text><text x="24" y="137" text-anchor="end" font-size="8" fill="#65736a">0%</text><text x="30" y="150" font-size="8" fill="#65736a">0 months</text><text x="350" y="150" text-anchor="end" font-size="8" fill="#65736a">'+Math.ceil(max)+' months</text>';
    entries.forEach(([,points],i)=>{let path='';points.forEach(([t,v],j)=>{const x=30+t/max*320,y=10+(1-v)*125;path+=j?` H ${x} V ${y}`:`M ${x} ${y}`;});svg+=`<path d="${path}" fill="none" stroke="${colors[i%3]}" stroke-width="2"/>`;});
    return `<div class="curve-preview"><div class="curve-label">Estimated retention <small>SYNTHETIC DATA</small></div><svg viewBox="0 0 360 160" role="img" aria-label="Kaplan-Meier retention estimates by contract type">${svg}</svg><div class="curve-key">${entries.map(([name],i)=>`<span style="color:${colors[i%3]}">― ${esc(name)}</span>`).join('')}</div></div>`;
  }
  const total=data.sales['All regions'];
  const previews=[
    `<div class="preview-panel"><div class="panel-label">Revenue overview <small>SYNTHETIC DATA</small></div><div class="preview-metrics"><div><small>Total revenue</small><strong>${money(total.total)}</strong></div><div><small>Sample records</small><strong>${total.rows}</strong></div></div><svg viewBox="0 0 350 110" role="img" aria-label="Sample monthly revenue">${chart(total.monthly,350,110)}</svg></div>`,
    retention(),
    '<div class="method-lines"><div class="method-heading">A result worth questioning.</div><div><strong>01 &nbsp; Define the target</strong><span>RANKING</span></div><div><strong>02 &nbsp; Examine the universe</strong><span>BIAS</span></div><div><strong>03 &nbsp; Test later periods</strong><span>VALIDATION</span></div><div><strong>04 &nbsp; Explain the limits</strong><span>CONTEXT</span></div></div>',
    '<div class="process"><div class="process-label">THE DATA PIPELINE</div><div class="process-step"><b>01</b> Fetch & filter deals</div><div class="process-arrow">↓</div><div class="process-step"><b>02</b> Enrich & deduplicate</div><div class="process-arrow">↓</div><div class="process-step"><b>03</b> Build the searchable report</div></div>',
    '<div class="code-preview"><small>EXAMPLE QUERY · SAMPLE ORDER SCHEMA</small><em>SELECT</em> product,<br>&nbsp;&nbsp;<em>SUM</em>(amount) <em>AS</em> revenue<br><em>FROM</em> orders<br><em>GROUP BY</em> product<br><em>ORDER BY</em> revenue <em>DESC</em>;</div>'
  ];
  const styles=['sales','statistics','research','automation','sql'];
  $('project-grid').innerHTML=data.projects.map((p,i)=>`<article class="project-card" data-category="${esc(p.category)}"><div class="preview ${styles[i]}">${previews[i]}</div><div class="project-body"><div class="project-type">0${i+1} / ${esc(p.category.toUpperCase())}</div><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><div class="tags">${p.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div><button class="case-button" data-project="${i}" aria-haspopup="dialog">Explore case study <span aria-hidden="true">↗</span></button></div></article>`).join('');
  const dialog=$('case-dialog');
  document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
    const p=data.projects[Number(button.dataset.project)];
    $('case-content').innerHTML=`<div class="eyebrow">${esc(p.category)} / CASE STUDY</div><h2 id="case-title">${esc(p.title)}</h2><div class="tags">${p.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>${p.sections.map(s=>`<h3>${esc(s.title)}</h3><p>${esc(s.body)}</p>`).join('')}<p class="case-note">${esc(p.note)}</p><details class="data-table"><summary>Development context</summary><p>Personal project developed with AI assistance for implementation. Features and evidence shown here do not imply independent authorship of every line of code or commercial delivery experience.</p></details>${p.id===0?'<a class="button primary" id="open-demo" href="#demo">Explore the interactive sample ↗</a>':''}`;
    document.body.classList.add('modal-open');dialog.showModal();dialog.scrollTop=0;
    $('open-demo')?.addEventListener('click',()=>dialog.close());
  }));
  document.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));
  dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close();});
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
    let visible=0;
    document.querySelectorAll('.project-card').forEach(card=>{const category=card.dataset.category,filter=button.dataset.filter;card.hidden=!(filter==='All'||filter===category||(filter==='Statistics'&&category==='Machine learning'));if(!card.hidden)visible++;});
    $('filter-status').textContent=`${visible} projects shown`;
  }));
  const library=[
    ['NZ GPU price tracker','COLLECTION & COMPARISON','Retailer data collection, SQLite price history, and an HTML report. Price changes can be compared over time; the configured GPU performance rankings are approximate indices.'],
    ['Kaggle modelling','MACHINE LEARNING','Classification workflows, cross-validation, feature experiments, and submission generation. No leaderboard score or rank is claimed without confirmed competition evidence.'],
    ['Traffic & content research','EXPLORATORY ANALYSIS','Collects autocomplete suggestions and ranks topic opportunities with heuristic scores. These are discovery signals, not measured search volume or established commercial demand.'],
    ['Japan trip planner','SCENARIO MODELLING','An HTML tool for comparing months and adjusting trip-cost assumptions. It demonstrates how estimates change with traveller choices; the underlying prices are dated.']
  ];
  $('library-list').innerHTML=library.map(([name,type,body],i)=>`<details class="library-row"><summary><span class="library-num">0${i+1}</span><h3>${esc(name)}</h3><span class="library-type">${type}</span><span class="library-plus" aria-hidden="true">+</span></summary><p>${esc(body)}</p></details>`).join('');
  $('hero-total').textContent=money(total.total);$('hero-rows').textContent=total.rows;
  $('hero-chart').innerHTML=chart(total.monthly,420,145);
  $('region').innerHTML=Object.keys(data.sales).map(r=>`<option>${esc(r)}</option>`).join('');
  function updateDashboard(){
    const region=$('region').value, sales=data.sales[region];
    $('revenue').textContent=money(sales.total);$('records').textContent=sales.rows.toLocaleString();$('average').textContent=exact(sales.average);
    $('demo-chart').innerHTML=chart(sales.monthly,520,235,true);$('demo-chart').setAttribute('aria-label',`Monthly synthetic revenue for ${region}; exact values follow in the monthly figures table.`);
    $('category-bars').innerHTML=Object.entries(sales.categories).map(([category,value])=>`<div class="category-row"><div><span>${esc(category)}</span><span>${money(value)}</span></div><div class="bar-track"><span style="width:${value/sales.total*100}%"></span></div></div>`).join('');
    $('monthly-table').innerHTML=data.months.map((m,i)=>`<tr><th scope="row">${month(m)}</th><td>${exact(sales.monthly[i])}</td></tr>`).join('');
  }
  $('region').addEventListener('change',updateDashboard);updateDashboard();
})();

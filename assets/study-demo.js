"use strict";
(() => {
  const notes = [
    {title:'Revenue and profit', tag:'Business measures', body:'Revenue is the amount earned from sales before costs. Profit is revenue minus costs. Rising revenue alone does not demonstrate rising profit.'},
    {title:'Missing values', tag:'Data quality', body:'A missing value is not automatically zero. Check why the value is absent before deciding whether to exclude, replace, or retain it.'},
    {title:'Joining tables', tag:'SQL foundations', body:'A join combines records using a matching key. If the key is repeated, a join can multiply rows. Check the expected relationship and row counts.'}
  ];
  const cards = [
    ['Does higher revenue always mean higher profit?', 'No. Profit also depends on costs. If costs grow faster than revenue, profit can fall.'],
    ['Should a missing value automatically become zero?', 'No. First understand why it is missing. Zero represents a value and may change the interpretation.'],
    ['Why can a SQL join increase the number of rows?', 'Repeated matching keys can create multiple matches. Check key uniqueness and the intended relationship.']
  ];
  const $ = id => document.getElementById(id);
  const escape = value => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  document.querySelectorAll('[data-study-view]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-study-view]').forEach(other => {
      const selected = button === other;
      other.setAttribute('aria-pressed', String(selected));
      other.classList.toggle('selected', selected);
      $('study-' + other.dataset.studyView).hidden = !selected;
    });
  }));
  function search() {
    const query = $('study-query').value.trim().toLowerCase();
    const matches = notes.filter(note => (note.title+' '+note.tag+' '+note.body).toLowerCase().includes(query));
    $('study-results').innerHTML = matches.length ? matches.map(note => `<article class="study-result"><span>${escape(note.tag)} · FICTIONAL NOTE</span><h4>${escape(note.title)}</h4><p>${escape(note.body)}</p></article>`).join('') : '<p class="study-empty">No matching notes. Try “revenue”, “missing”, or “join”.</p>';
  }
  $('study-query').addEventListener('input', search);
  $('study-source-toggle').addEventListener('click', () => {
    const source = $('study-source');
    source.hidden = !source.hidden;
    $('study-source-toggle').setAttribute('aria-expanded', String(!source.hidden));
  });
  let index = 0;
  function showCard() {
    $('study-card-count').textContent = `${index+1} / ${cards.length}`;
    $('study-card-question').textContent = cards[index][0];
    $('study-card-answer').textContent = cards[index][1];
    $('study-card-answer').hidden = true;
    $('study-reveal').textContent = 'Reveal answer';
    $('study-reveal').setAttribute('aria-expanded','false');
  }
  $('study-reveal').addEventListener('click', () => {
    const answer = $('study-card-answer');
    answer.hidden = !answer.hidden;
    $('study-reveal').textContent = answer.hidden ? 'Reveal answer' : 'Hide answer';
    $('study-reveal').setAttribute('aria-expanded', String(!answer.hidden));
  });
  $('study-next').addEventListener('click', () => { index=(index+1)%cards.length;showCard(); });
  search();showCard();
})();

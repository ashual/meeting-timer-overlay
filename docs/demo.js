/* Interactive example only. The schedule model is copied verbatim from the extension. */
(() => {
  'use strict';
  const model = globalThis.MeetingTimer.schedule;
  const minute = 60000;
  const $ = id => document.getElementById(id);
  const labels = Array.from({length:8}, (_, i) => `Topic ${i + 1}`);
  let session, now, duration, count;
  const clock = ms => {
    const seconds = Math.round(Math.abs(ms) / 1000);
    return `${ms < 0 ? '−' : ''}${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  };
  const param = new URLSearchParams(location.search);
  if (/^\d+$/.test(param.get('minutes') || '') && +param.get('minutes') >= 5 && +param.get('minutes') <= 120) $('minutes').value = param.get('minutes');
  if (/^[2-8]$/.test(param.get('speakers') || '')) $('speakers').value = param.get('speakers');

  function render(message) {
    const v = model.view(session, now);
    const done = session.position >= count;
    $('demo-card').dataset.phase = v.phase;
    $('speaker').textContent = done ? 'All sections finished' : labels[session.position];
    $('countdown').textContent = v.big;
    $('unit').textContent = v.unit;
    $('remaining').textContent = clock(session.endMs - now);
    $('elapsed').textContent = clock(now);
    $('allocation').textContent = done ? '—' : clock(session.deadlineMs - session.turnStartMs);
    $('used').textContent = done ? '—' : clock(now - session.turnStartMs);
    $('queue').replaceChildren(...v.items.map(item => {
      const li = document.createElement('li');
      li.dataset.state = item.state;
      li.textContent = `${item.label} · ${item.state === 'current' ? 'in progress' : item.state === 'done' ? 'finished' : 'up next'}`;
      return li;
    }));
    $('advance').disabled = done;
    $('next').disabled = done;
    $('previous').disabled = session.position === 0;
    if (message) $('status').textContent = message;
  }
  function reset() {
    duration = Number($('minutes').value);
    count = Number($('speakers').value);
    now = 0;
    session = model.createSession({presentationId:'demo', deckTitle:'Example timed agenda',
      sections:labels.slice(0, count).map((label, i) => ({index:i + 1, label})),
      startMs:0, endMs:duration * minute, now});
    session = model.startTurn(session, 0, now);
    render(`${duration} minutes ÷ ${count} sections = ${clock(duration * minute / count)} for the first section. The example clock advances only when you click.`);
    $('share-link').hidden = true;
  }
  function next() {
    session = model.startTurn(session, session.position + 1, now);
    const left = count - session.position;
    render(left ? `${clock(Math.max(0, session.endMs - now))} left ÷ ${left} sections = ${clock(session.deadlineMs - session.turnStartMs)} for ${labels[session.position]}.` : 'All sections finished. Reset to try another meeting.');
  }
  $('setup').addEventListener('submit', e => {e.preventDefault(); reset();});
  $('advance').addEventListener('click', () => {now += minute; render('One simulated minute passed. The current allocation stays fixed until a handoff.');});
  $('next').addEventListener('click', next);
  $('previous').addEventListener('click', () => {session = model.previousTurn(session, now); render('Returned to the previous section. Its allocation is recalculated from the time left now.');});
  for (const [id, used] of [['early', 2], ['late', 7]]) {
    $(id).addEventListener('click', () => {
      $('minutes').value = '22'; $('speakers').value = '5'; reset();
      now = used * minute; next();
      $('status').textContent = `Topic 1 used ${used} minutes. ${$('status').textContent}`;
    });
  }
  $('share').addEventListener('click', async () => {
    const url = new URL(location.href);
    url.search = new URLSearchParams({minutes:String(duration), speakers:String(count)}).toString();
    url.hash = '';
    try {await navigator.clipboard.writeText(url.href); $('status').textContent = 'Setup link copied. It opens a fresh example with these settings.';}
    catch {const input = $('share-link'); input.value = url.href; input.hidden = false; input.focus(); input.select(); $('status').textContent = 'Copy the selected setup link.';}
  });
  reset();
})();

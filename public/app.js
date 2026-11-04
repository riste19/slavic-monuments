const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollBehavior = reducedMotion ? 'instant' : 'smooth';
if ('IntersectionObserver' in window && !reducedMotion) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.07 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
const progress = document.querySelector('.reading-progress');
let scrollScheduled = false;
function updateProgress() { const range = document.documentElement.scrollHeight - innerHeight; progress.style.width = `${range > 0 ? Math.min(100, scrollY / range * 100) : 0}%`; scrollScheduled = false; }
addEventListener('scroll', () => { if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(updateProgress); } }, { passive: true });
addEventListener('resize', updateProgress); updateProgress();
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open navigation'); }
menuButton.addEventListener('click', () => { const open = navigation.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); });
navigation.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(filter => { const active = filter === button; filter.classList.toggle('active', active); filter.setAttribute('aria-pressed', String(active)); });
  document.querySelectorAll('.collection-card').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.style !== button.dataset.filter; });
  document.querySelector('.collection-grid').classList.toggle('filtered', button.dataset.filter !== 'all');
  if (button.dataset.filter !== 'all') document.querySelector('.collection-toolbar').scrollIntoView({ behavior: scrollBehavior, block: 'start' });
}));
const memorials = {
  "upright": {
    "title": "Tradition, in every detail.",
    "value": "Upright memorial",
    "image": "assets/upright-gallery.webp",
    "description": "A shaped headstone with gold lettering and an integrated cross."
  },
  "shared": {
    "title": "Designed together.",
    "value": "Shared memorial",
    "image": "assets/real-shared.webp",
    "description": "An olive green granite memorial with matching crosses and personal details."
  },
  "single": {
    "title": "A lasting tribute.",
    "value": "Upright memorial",
    "image": "assets/real-single.webp",
    "description": "A single monument with a polished surround and a sheltered memorial niche."
  },
  "portrait": {
    "title": "A life, remembered.",
    "value": "Upright memorial",
    "image": "assets/real-hero.webp",
    "description": "An arched memorial bringing together a portrait, inscription and family photographs."
  },
  "form": {
    "title": "A softer outline.",
    "value": "Upright memorial",
    "image": "assets/detail-form.webp",
    "description": "A gently shaped headstone above a polished single memorial."
  },
  "words": {
    "title": "Words with meaning.",
    "value": "Help me choose",
    "image": "assets/detail-words.webp",
    "description": "A closer look at portrait placement, lettering and an individual inscription."
  },
  "together": {
    "title": "Side by side.",
    "value": "Shared memorial",
    "image": "assets/story-shared.webp",
    "description": "A double memorial with matching crosses and a shared stone setting."
  },
  "architecture": {
    "title": "Beyond the memorial.",
    "value": "Help me choose",
    "image": "assets/story-architecture.webp",
    "description": "Stone columns framing the entrance at Saint Nicholas Church."
  }
};
const dialog = document.querySelector('#memorial-dialog');
let selectedStyle = 'upright';
document.querySelectorAll('.collection-card').forEach(card => card.addEventListener('click', () => {
  selectedStyle = card.dataset.project; const data = memorials[selectedStyle];
  document.querySelector('#dialog-title').textContent = data.title;
  document.querySelector('#dialog-description').textContent = data.description;
  document.querySelector('#dialog-photo').src = data.image;
  document.querySelector('#dialog-photo').alt = `Completed Slavic Monuments ${data.value.toLowerCase()}`;
  dialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });

const form = document.querySelector('#enquiry-form');
const steps = [...document.querySelectorAll('.form-step')];
let stepIndex = 0;
let preparedText = '';
function showStep(index, focus = true) {
  stepIndex = index;
  steps.forEach((step, i) => { step.hidden = i !== index; step.querySelectorAll('input,textarea').forEach(field => { field.disabled = i !== index; }); });
  document.querySelectorAll('.step-track i').forEach((segment, i) => segment.classList.toggle('active', i <= index));
  document.querySelector('#step-counter').textContent = `0${index + 1} / 03`;
  document.querySelector('#back-step').hidden = index === 0;
  document.querySelector('#next-step').hidden = index === 2;
  document.querySelector('#prepare-enquiry').hidden = index !== 2;
  document.querySelector('#email-fallback').hidden = index !== 2;
  document.querySelector('#form-error').textContent = '';
  if (index === 2) {
    const summary = document.querySelector('#enquiry-summary');
    const heading = document.createElement('strong');
    heading.textContent = form.querySelector('input[name="style"]:checked')?.value || 'Help me choose';
    const details = document.createElement('p');
    details.textContent = `${form.elements.cemetery.value.trim() || 'Cemetery to be discussed'}${form.elements.message.value.trim() ? '\n' + form.elements.message.value.trim() : ''}`;
    summary.replaceChildren(heading, details);
  }
  if (focus) { const legend = steps[index].querySelector('legend'); legend.tabIndex = -1; legend.focus({ preventScroll: true }); document.querySelector('.enquiry-builder').scrollIntoView({ behavior: scrollBehavior, block: 'start' }); }
}
function startEnquiry(value, index = 0) {
  if (value) { const radio = [...form.querySelectorAll('[name="style"]')].find(r => r.value === value); if (radio) radio.checked = true; }
  form.hidden = false; document.querySelector('#form-result').hidden = true;
  showStep(index, false);
  document.querySelector('#enquiry').scrollIntoView({ behavior: scrollBehavior });
}
document.querySelector('#choose-style').addEventListener('click', () => { dialog.close(); const note = 'Project reference: ' + memorials[selectedStyle].title; if (!form.elements.message.value.includes(note)) form.elements.message.value += (form.elements.message.value ? '\n' : '') + note; startEnquiry(memorials[selectedStyle].value); });
document.querySelectorAll('[data-direction]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); startEnquiry(a.dataset.direction); }));
document.querySelector('#next-step').addEventListener('click', () => showStep(Math.min(2, stepIndex + 1)));
document.querySelector('#back-step').addEventListener('click', () => showStep(Math.max(0, stepIndex - 1)));
function prepareEmailDraft() {
  if (stepIndex < 2) { showStep(stepIndex + 1); return; }
  if (!form.reportValidity()) return;
  const name = form.elements.name.value.trim(); const email = form.elements.email.value.trim();
  if (!name) { form.elements.name.focus(); document.querySelector('#form-error').textContent = 'Please enter your name.'; return; }
  const style = form.querySelector('[name="style"]:checked')?.value || 'Help me choose';
  preparedText = `Hi Nenad,\n\nI'd like to discuss a memorial.\n\nMemorial direction: ${style}\nCemetery: ${form.elements.cemetery.value.trim() || 'Not confirmed yet'}\n\n${form.elements.message.value.trim() || 'I would appreciate a conversation about the options.'}\n\nName: ${name}\nEmail: ${email}\n\nThank you,\n${name}`;
  document.querySelector('#open-enquiry').href = `mailto:slavicmonuments@gmail.com?subject=${encodeURIComponent('Memorial enquiry')}&body=${encodeURIComponent(preparedText)}`;
  form.hidden = true; const result = document.querySelector('#form-result'); result.hidden = false; result.tabIndex = -1; result.focus({ preventScroll: true });
  document.querySelector('#copy-enquiry').textContent = 'Copy enquiry text';
  document.querySelector('.enquiry-builder').scrollIntoView({ behavior: scrollBehavior, block: 'start' });
}
document.querySelector('#edit-enquiry').addEventListener('click', () => { form.hidden = false; document.querySelector('#form-result').hidden = true; showStep(2); });
document.querySelector('#copy-enquiry').addEventListener('click', async e => {
  try { await navigator.clipboard.writeText(preparedText); e.currentTarget.textContent = 'Enquiry copied'; }
  catch { let field = document.querySelector('#copy-fallback'); if (!field) { field = document.createElement('textarea'); field.id = 'copy-fallback'; field.readOnly = true; field.setAttribute('aria-label', 'Enquiry text to copy'); document.querySelector('#form-result').append(field); } field.value = preparedText; field.select(); e.currentTarget.textContent = 'Select and copy the text below'; }
});
showStep(0, false);

window.slavic = { startEnquiry, showStep, getStep: () => stepIndex, prepareEmailDraft };

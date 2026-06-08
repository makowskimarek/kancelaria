/* =============================================
   KNS – kontakt.js
   ============================================= */

const API_URL = 'https://kns-green.vercel.app/api/contact';

const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = parseFloat(entry.target.dataset.delay || 0);
    setTimeout(() => entry.target.classList.add('visible'), delay * 1000);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));

/* =============================================
   CONTACT FORM
   ============================================= */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', async e => {
  e.preventDefault();

  if (!validateForm()) return;

  setFormLoading(true);
  clearStatus();

  const payload = {
    name:    document.getElementById('cf-name').value.trim(),
    email:   document.getElementById('cf-email').value.trim(),
    phone:   document.getElementById('cf-phone').value.trim(),
    topic:   document.getElementById('cf-topic').value,
    message: document.getElementById('cf-message').value.trim(),
    rodo:    document.getElementById('cf-rodo').checked,
    _hp:     document.getElementById('cf-hp').value,
  };

  try {
    const res  = await fetch(API_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    const body = await res.json().catch(() => ({}));

    if (res.ok) {
      showSuccess();
      form.reset();
      clearErrors();
    } else {
      const msg = body?.error
        || Object.values(body?.errors ?? {})[0]
        || 'Błąd serwera. Proszę spróbować ponownie.';
      showStatus(String(msg), 'error');
    }
  } catch {
    showStatus('Brak połączenia. Proszę spróbować ponownie lub zadzwonić bezpośrednio.', 'error');
  } finally {
    setFormLoading(false);
  }
});

function validateForm() {
  clearErrors();
  let ok = true;

  const name    = document.getElementById('cf-name');
  const email   = document.getElementById('cf-email');
  const topic   = document.getElementById('cf-topic');
  const message = document.getElementById('cf-message');
  const rodo    = document.getElementById('cf-rodo');

  if (!name.value.trim()) {
    setError(name, 'nameError', 'Proszę podać imię i nazwisko.');
    ok = false;
  }

  if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    setError(email, 'emailError', 'Proszę podać prawidłowy adres e-mail.');
    ok = false;
  }

  if (!topic.value) {
    setError(topic, 'topicError', 'Proszę wybrać temat wiadomości.');
    ok = false;
  }

  if (message.value.trim().length < 10) {
    setError(message, 'messageError', 'Treść wiadomości musi mieć co najmniej 10 znaków.');
    ok = false;
  }

  if (!rodo.checked) {
    setError(rodo, 'rodoError', 'Wymagana jest zgoda na przetwarzanie danych osobowych.');
    ok = false;
  }

  return ok;
}

function setError(field, errorId, msg) {
  field.classList.add('is-error');
  document.getElementById(errorId).textContent = msg;
}

function clearErrors() {
  form.querySelectorAll('.is-error').forEach(el => el.classList.remove('is-error'));
  form.querySelectorAll('.form-error').forEach(el => el.textContent = '');
}

function setFormLoading(loading) {
  submitBtn.classList.toggle('loading', loading);
  submitBtn.disabled = loading;
}

function showStatus(msg, type) {
  formStatus.textContent = msg;
  formStatus.className   = `form-status is-${type}`;
  formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showSuccess() {
  formStatus.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-3px;margin-right:6px"><polyline points="20 6 9 17 4 12"/></svg>
    Wiadomość wysłana. Skontaktujemy się z Państwem wkrótce.
  `;
  formStatus.className = 'form-status is-success';
  formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearStatus() {
  formStatus.textContent = '';
  formStatus.className   = 'form-status';
}

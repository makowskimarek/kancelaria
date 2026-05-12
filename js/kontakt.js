/* =============================================
   KNS – kontakt.js
   ============================================= */

const FORMSPREE_URL = 'https://formspree.io/f/FORMSPREE_ID';

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

  try {
    const res = await fetch(FORMSPREE_URL, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      showStatus('Wiadomość wysłana. Skontaktujemy się z Państwem wkrótce.', 'success');
      form.reset();
      clearErrors();
    } else {
      const body = await res.json().catch(() => ({}));
      const msg = body?.errors?.[0]?.message || 'Błąd serwera. Proszę spróbować ponownie.';
      showStatus(msg, 'error');
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
  const message = document.getElementById('cf-message');

  if (!name.value.trim()) {
    setError(name, 'nameError', 'Proszę podać imię i nazwisko.');
    ok = false;
  }

  if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    setError(email, 'emailError', 'Proszę podać prawidłowy adres e-mail.');
    ok = false;
  }

  if (message.value.trim().length < 10) {
    setError(message, 'messageError', 'Treść wiadomości musi mieć co najmniej 10 znaków.');
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

function clearStatus() {
  formStatus.textContent = '';
  formStatus.className   = 'form-status';
}

/* =============================================
   KNS Kancelaria Radców Prawnych
   main.js
   ============================================= */

/* --- Endpoint formularza kontaktowego (Vercel Function) ---
   Po deploymencie keystatic-app na Vercel zastąp VERCEL_URL
   adresem projektu, np. kns-keystatic.vercel.app
   --------------------------------------------------------- */
const CONTACT_URL = 'https://kns-green.vercel.app/api/contact';

/* =============================================
   NAVBAR — scroll effect
   ============================================= */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

const onBlogPage = !!document.querySelector('.post-header');
if (onBlogPage) navbar.classList.add('scrolled');

requestAnimationFrame(() => requestAnimationFrame(() => {
  navbar.classList.remove('navbar--init');
}));

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', onBlogPage || window.scrollY > 50);
}, { passive: true });

/* =============================================
   HAMBURGER MENU
   ============================================= */
hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

function closeMenu() {
  navMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* =============================================
   ACTIVE NAV LINK — IntersectionObserver
   ============================================= */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* =============================================
   SCROLL REVEAL
   ============================================= */
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

/* Staggered delay for card grids */
document.querySelectorAll('.cards-grid .card').forEach((card, i) => {
  card.dataset.delay = (i * 0.07).toFixed(2);
});

document.querySelectorAll('.features-grid .feature').forEach((el, i) => {
  el.dataset.delay = (i * 0.1).toFixed(2);
});

document.querySelectorAll('.team-grid .team-card').forEach((el, i) => {
  el.dataset.delay = (i * 0.12).toFixed(2);
});

/* =============================================
   SPECIALIZATION MODALS
   ============================================= */
const SPEC_DETAILS = {
  'Prawo gospodarcze': {
    items: [
      'Łączymy doradztwo prawne z realiami operacyjnymi biznesu',
      'Dobieramy rozwiązania prawne do etapu rozwoju firmy',
      'Zakładamy, przekształcamy i porządkujemy struktury biznesowe',
      'Przygotowujemy i negocjujemy umowy handlowe oraz inwestycyjne',
      'Zabezpieczamy firmę przed ryzykami w kluczowych kontraktach',
      'Porządkujemy relacje wspólników i zasady reprezentacji',
      'Wyjaśniamy odpowiedzialność członków zarządu i osób decyzyjnych',
      'Wspieramy spółki w sporach z kontrahentami',
      'Dochodzimy należności i bronimy przed niezasadnymi roszczeniami',
      'Analizujemy uchwały, umowy spółek i dokumenty korporacyjne',
      'Wspieramy negocjacje, mediacje i strategiczne decyzje właścicielskie',
      'Pomagamy bezpiecznie wejść w nowy projekt lub rynek',
      'Porządkujemy procesy decyzyjne między zarządem, wspólnikami i pełnomocnikami',
      'Ograniczamy ryzyko sporów jeszcze na etapie negocjacji',
      'Reprezentujemy przedsiębiorców przed sądami i organami administracji',
    ],
  },
  'Prawo żywnościowe': {
    items: [
      'Bezpiecznie wprowadzamy produkty spożywcze na polski rynek',
      'Weryfikujemy oraz negocjujemy umowy z dostawcami, importerami i sieciami sprzedaży',
      'Doradzamy przy imporcie, eksporcie i sprzedaży internetowej',
      'Dokonujemy weryfikacji etykiet i składów produktów pod kątem zgodności z prawem polskim oraz unijnym',
      'Wspieramy przedsiębiorców podczas kontroli organów nadzorujących i postępowań wyjaśniających',
      'Ograniczamy ryzyko zakwestionowanej reklamy',
      'Zabezpieczamy markę przed kosztownymi błędami komunikacyjnymi',
      'Przygotowujemy firmę do wejścia nowych produktów',
      'Przygotowujemy powiadomienia do GIS przed pierwszą sprzedażą',
      'Reagujemy przy wycofaniu produktu, reklamacji i kryzysie',
      'Porządkujemy etykiety, składy i oznaczenia',
      'Minimalizujemy ryzyko sporów z organami i partnerami',
      'Tłumaczymy receptury i zmiany prawa na konkretne decyzje biznesowe',
    ],
  },
  'Pomoc pokrzywdzonym konsumentom': {
    items: [
      'Sprawdzamy, czy umowa zawiera klauzule niedozwolone',
      'Wyjaśniamy realne roszczenia, koszty i ryzyka przed startem sprawy',
      'Prowadzimy sprawy kredytów i pożyczek indeksowanych lub denominowanych do walut obcych od analizy umowy do rozliczenia z bankiem i wykreślenia hipoteki z księgi wieczystej',
      'Weryfikujemy możliwość zastosowania sankcji kredytu darmowego',
      'Dochodzimy zwrotu prowizji i innych kosztów po wcześniejszej spłacie',
      'Skutecznie kwestionujemy niejasne zasady zmiany oprocentowania i opłat',
      'Reprezentujemy w negocjacjach, mediacjach i postępowaniach sądowych',
      'Chronimy konsumenta przed pochopną i niekorzystną ugodą',
    ],
  },
  'Prawo medyczne': {
    items: [
      'Porządkujemy formalności potrzebne do prowadzenia działalności leczniczej',
      'Wspieramy w rejestracji i zmianach wpisów w RPWDL',
      'Tworzymy dokumenty zgodne z prawami pacjenta',
      'Układamy bezpieczne wzory zgód, upoważnień i informacji',
      'Pomagamy bezpiecznie prowadzić i udostępniać dokumentację medyczną',
      'Analizujemy umowy z personelem, NFZ i kontrahentami',
      'Ograniczamy ryzyko skarg, sporów i naruszeń organizacyjnych',
      'Reprezentujemy placówki i medyków przed organami oraz sądami',
      'Wspieramy podmioty lecznicze w kontrolach i postępowaniach',
      'Reprezentujemy w sporach dotyczących świadczeń, dokumentacji i odpowiedzialności',
      'Konsultujemy incydenty organizacyjne, zanim przerodzą się w realne roszczenia',
      'Przygotowujemy regulaminy, polityki i dokumenty dla personelu',
      'Minimalizujemy ryzyka przy nowych usługach i modelach leczenia',
      'Szkolimy zespoły z praw pacjenta i bezpiecznej komunikacji',
    ],
  },
  'Odszkodowania i zadośćuczynienia': {
    items: [
      'Ustalamy pełny zakres możliwych roszczeń',
      'Skutecznie dochodzimy zadośćuczynienia za ból, cierpienie i trwałe skutki zdarzenia',
      'Odzyskujemy koszty leczenia, rehabilitacji i opieki',
      'Dochodzimy renty, utraconych dochodów i zwiększonych potrzeb',
      'Pomagamy rodzinom po śmierci osoby bliskiej uzyskać należne świadczenia',
      'Porządkujemy dowody medyczne, kosztowe i procesowe od początku sprawy',
      'Reprezentujemy wobec ubezpieczycieli, sprawców i innych odpowiedzialnych podmiotów',
    ],
  },
  'Stała obsługa przedsiębiorców': {
    items: [
      'Zapewniamy bieżące wsparcie prawne bez tworzenia działu prawnego',
      'Odpowiadamy szybko na codzienne pytania zarządu i zespołów',
      'Aktualizujemy umowy, regulaminy i wzory potrzebnych dokumentów',
      'Wychwytujemy ryzyka zanim przekształcą się w spór',
      'Wspieramy sprzedaż, zakupy i negocjacje w czasie rzeczywistym',
      'Porządkujemy pełnomocnictwa, uchwały i obieg akceptacji',
      'Ustalamy zasady współpracy dopasowane do tempa firmy',
      'Dajemy firmie stały punkt kontaktu do spraw prawnych',
      'Usprawniamy komunikację między biznesem, kadrami, księgowością i zarządem',
      'Pomagamy planować decyzje z wyprzedzeniem, nie po fakcie',
      'Wspieramy firmy zdalnie albo bezpośrednio w siedzibie',
      'Skalujemy zakres pomocy do etapu i budżetu',
      'Odciążamy właścicieli od prawnych tematów operacyjnych',
      'Pomagamy utrzymać przewidywalne koszty i szybką reakcję',
      'Łączymy stałe doradztwo z obsługą projektów i sporów',
    ],
  },
};

const specModal    = document.getElementById('specModal');
const modalTitle   = document.getElementById('modalTitle');
const modalList    = document.getElementById('modalList');
const modalIcon    = document.getElementById('modalIcon');
const modalClose   = document.getElementById('modalClose');
const modalCtaBtn  = document.getElementById('modalCta');

document.querySelectorAll('.card').forEach(card => {
  const specKey = card.dataset.specKey;
  if (!specKey || !SPEC_DETAILS[specKey]) return;

  const btn = document.createElement('button');
  btn.className = 'card__more';
  btn.innerHTML = `${TRANSLATIONS[currentLang]['card-more-btn']} ${ARROW_SVG}`;
  btn.addEventListener('click', () => openSpecModal(card));
  card.appendChild(btn);
});

function openSpecModal(card) {
  const title   = card.querySelector('.card__title').textContent.trim();
  const specKey = card.dataset.specKey;
  const details = currentLang === 'en' ? SPEC_DETAILS_EN : SPEC_DETAILS;
  const data    = details[specKey];
  if (!data) return;

  const iconEl = card.querySelector('.card__icon');
  modalIcon.innerHTML = iconEl ? iconEl.innerHTML : '';
  modalTitle.textContent = title;
  modalList.innerHTML    = data.items.map(item => `<li>${item}</li>`).join('');

  specModal.removeAttribute('hidden');
  requestAnimationFrame(() => specModal.classList.add('is-open'));
  document.body.style.overflow = 'hidden';
  setTimeout(() => modalClose.focus(), 60);
}

function closeSpecModal() {
  specModal.classList.remove('is-open');
  setTimeout(() => {
    specModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }, 260);
}

if (specModal) {
  modalClose.addEventListener('click', closeSpecModal);
  specModal.addEventListener('click', e => { if (e.target === specModal) closeSpecModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !specModal.hidden) closeSpecModal(); });
  modalCtaBtn.addEventListener('click', closeSpecModal);
}

/* =============================================
   BLOG — dynamic cards from posts.json
   ============================================= */
const blogGrid = document.getElementById('blogGrid');

function formatPostDate(iso) {
  const locale = currentLang === 'en' ? 'en-GB' : 'pl-PL';
  return new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
}

function blogCardHTML(p, i) {
  const delay = (i * 0.09).toFixed(2);
  const readMore = TRANSLATIONS[currentLang]['blog-read-more'] || 'Czytaj więcej';
  return `<article class="blog-card reveal" data-delay="${delay}">
    <div class="blog-card__meta">
      <span class="blog-card__category">${p.category}</span>
      <time class="blog-card__date">${formatPostDate(p.date)}</time>
    </div>
    <h3 class="blog-card__title">${p.title}</h3>
    <p class="blog-card__excerpt">${p.excerpt}</p>
    <a href="blog/post.html?slug=${p.slug}" class="blog-card__btn">${readMore} ${ARROW_SVG}</a>
  </article>`;
}

function loadBlogPosts() {
  if (!blogGrid) return;
  const jsonPath = currentLang === 'en'
    ? 'content/blog/en/posts.json'
    : 'content/blog/posts.json';

  fetch(jsonPath)
    .then(r => r.json())
    .then(posts => {
      const list = onBlogPage ? posts : posts.slice(0, 4);
      blogGrid.innerHTML = list.map(blogCardHTML).join('');
      blogGrid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    })
    .catch(() => {});
}


/* =============================================
   CONTACT FORM
   ============================================= */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormLoading(true);
    clearStatus();

    try {
      const res = await fetch(CONTACT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    document.getElementById('cf-name').value.trim(),
          email:   document.getElementById('cf-email').value.trim(),
          phone:   document.getElementById('cf-phone').value.trim(),
          topic:   document.getElementById('cf-topic').value,
          message: document.getElementById('cf-message').value.trim(),
          rodo:    document.getElementById('cf-rodo').checked,
          _hp:     document.getElementById('cf-hp').value,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        showStatus('Wiadomość wysłana. Skontaktujemy się z Państwem wkrótce.', 'success');
        form.reset();
        clearErrors();
      } else {
        showStatus(data.error || 'Błąd serwera. Proszę spróbować ponownie.', 'error');
      }
    } catch {
      showStatus('Brak połączenia. Proszę spróbować ponownie lub zadzwonić bezpośrednio.', 'error');
    } finally {
      setFormLoading(false);
    }
  });
}

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

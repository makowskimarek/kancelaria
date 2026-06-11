/* =============================================
   KNS — i18n (PL / EN)
   ============================================= */

const ARROW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;

const TRANSLATIONS = {
  pl: {
    /* Navbar */
    'nav-home':     'Strona główna',
    'nav-spec':     'Specjalizacje',
    'nav-about':    'O nas',
    'nav-articles': 'Artykuły',
    'nav-contact':  'Kontakt',
    /* Hero */
    'hero-consult': 'Umów konsultację',
    'hero-spec':    'Nasze specjalizacje',
    /* Specialisations */
    'spec-title': 'Nasze specjalizacje',
    'spec-desc':  'Oferujemy kompleksową obsługę prawną w sześciu kluczowych obszarach, łącząc wiedzę prawniczą z realiami operacyjnymi biznesu.',
    /* Card titles */
    'card-food-title':     'Prawo żywnościowe',
    'card-med-title':      'Prawo medyczne',
    'card-consumer-title': 'Pomoc pokrzywdzonym konsumentom',
    'card-biz-title':      'Prawo gospodarcze',
    'card-comp-title':     'Odszkodowania i zadośćuczynienia',
    'card-retainer-title': 'Stała obsługa przedsiębiorców',
    /* Card short lists */
    'card-food-list': [
      'Bezpiecznie wprowadzamy produkty spożywcze na polski rynek',
      'Weryfikujemy oraz negocjujemy umowy z dostawcami, importerami i sieciami sprzedaży',
      'Dokonujemy weryfikacji etykiet i składów produktów pod kątem zgodności z prawem polskim oraz unijnym',
      'Wspieramy przedsiębiorców podczas kontroli organów nadzorujących i postępowań wyjaśniających',
      'Przygotowujemy powiadomienia do GIS przed pierwszą sprzedażą',
    ],
    'card-med-list': [
      'Porządkujemy formalności potrzebne do prowadzenia działalności leczniczej',
      'Wspieramy w rejestracji i zmianach wpisów w RPWDL',
      'Tworzymy dokumenty zgodne z prawami pacjenta',
      'Analizujemy umowy z personelem, NFZ i kontrahentami',
      'Reprezentujemy placówki i medyków przed organami oraz sądami',
    ],
    'card-consumer-list': [
      'Sprawdzamy, czy umowa zawiera klauzule niedozwolone',
      'Prowadzimy sprawy kredytów i pożyczek indeksowanych lub denominowanych do walut obcych',
      'Weryfikujemy możliwość zastosowania sankcji kredytu darmowego',
      'Reprezentujemy w negocjacjach, mediacjach i postępowaniach sądowych',
    ],
    'card-biz-list': [
      'Zakładamy, przekształcamy i porządkujemy struktury biznesowe',
      'Przygotowujemy i negocjujemy umowy handlowe oraz inwestycyjne',
      'Porządkujemy relacje wspólników i zasady reprezentacji',
      'Dochodzimy należności i bronimy przed niezasadnymi roszczeniami',
      'Wspieramy negocjacje, mediacje i strategiczne decyzje właścicielskie',
      'Reprezentujemy przedsiębiorców przed sądami i organami administracji',
    ],
    'card-comp-list': [
      'Ustalamy pełny zakres możliwych roszczeń',
      'Odzyskujemy koszty leczenia, rehabilitacji i opieki',
      'Dochodzimy renty, utraconych dochodów i zwiększonych potrzeb',
      'Pomagamy rodzinom po śmierci osoby bliskiej uzyskać należne świadczenia',
      'Reprezentujemy wobec ubezpieczycieli, sprawców i innych odpowiedzialnych podmiotów',
    ],
    'card-retainer-list': [
      'Zapewniamy bieżące wsparcie prawne bez tworzenia działu prawnego',
      'Odpowiadamy szybko na codzienne pytania zarządu i zespołów',
      'Aktualizujemy umowy, regulaminy i wzory potrzebnych dokumentów',
      'Wychwytujemy ryzyka zanim przekształcą się w spór',
      'Dajemy firmie stały punkt kontaktu do spraw prawnych',
    ],
    'card-more-btn': 'Dowiedz się więcej',
    /* Team */
    'team-title': 'Nasz zespół',
    'team-desc':  'Doświadczeni radcowie prawni z pasją do rozwiązywania problemów klientów.',
    'team-nawrocki-role': 'Radca Prawny · nr wpisu KT-3894',
    'team-nawrocki-bio1': 'Doświadczenie zawodowe zdobywał już podczas studiów, odbywając staż w czołowej śląskiej kancelarii. W trakcie aplikacji radcowskiej pracował w kancelarii o wysokiej aktywności procesowej, uczestnicząc w setkach rozpraw. Po założeniu własnej praktyki poznał dogłębnie perspektywę klientów biznesowych.',
    'team-nawrocki-bio2': 'Specjalizuje się w prawie gospodarczym, budowlanym oraz sprawach odszkodowawczych. Prywatnie pasjonuje się historią starożytnego Rzymu i włoską piłką nożną.',
    'team-nawrocki-tag1': 'Prawo żywnościowe',
    'team-nawrocki-tag2': 'Odszkodowania',
    'team-nawrocki-tag3': 'Pomoc konsumentom',
    'team-slania-role': 'Radca Prawny · nr wpisu KT-3894',
    'team-slania-bio1': 'Doświadczenie zawodowe budował stopniowo, przechodząc przez kolejne etapy praktyki prawniczej — od aplikacji po samodzielne prowadzenie spraw. Przez lata pracy z klientami indywidualnymi i przedsiębiorcami wypracował podejście oparte na rzetelnej analizie i jasnej, pozbawionej zbędnego żargonu komunikacji.',
    'team-slania-bio2': 'Specjalizuje się w prawie medycznym, gospodarczym oraz ochronie konsumentów. Do każdej sprawy podchodzi z zaangażowaniem i dbałością o interes klienta.',
    'team-slania-tag1': 'Prawo medyczne',
    'team-slania-tag2': 'Prawo gospodarcze',
    'team-slania-tag3': 'Pomoc konsumentom',
    /* Blog */
    'blog-title':     'Artykuły',
    'blog-desc':      'Komentarze prawne i praktyczne informacje o zmianach przepisów przygotowane przez radców prawnych kancelarii.',
    'blog-all-btn':   'Zobacz wszystkie artykuły',
    'blog-read-more': 'Czytaj więcej',
    /* Post page */
    'post-back':      'Wszystkie artykuły',
    'post-cta-label': 'Zaufaj ekspertom',
    /* Advantage */
    'adv-title':     'Nasza przewaga',
    'adv-exp-title': 'Doświadczenie i praktyka',
    'adv-exp-desc':  'Setki poprowadzonych spraw i lata praktyki procesowej w różnorodnych dziedzinach prawa.',
    'adv-ind-title': 'Indywidualne podejście',
    'adv-ind-desc':  'Każda sprawa traktowana jest z pełnym zaangażowaniem. Zawsze znamy perspektywę naszego klienta.',
    'adv-en-title':  'Obsługa w języku angielskim',
    'adv-en-desc':   'Świadczymy pomoc prawną również w języku angielskim – dla klientów zagranicznych i transakcji międzynarodowych.',
    /* Partners */
    'partners-title': 'Zaufali nam',
    /* CTA */
    'cta-title': 'Potrzebujesz pomocy&nbsp;prawnej?',
    'cta-text':  'Każda sprawa jest wyjątkowa. Skontaktuj się z nami – wspólnie ocenimy Twoją sytuację i zaproponujemy optymalne rozwiązanie.',
    'cta-btn':   'Umów konsultację',
    /* Contact */
    'contact-title':      'Skontaktuj się z nami',
    'contact-desc':       'Zadzwoń, napisz lub odwiedź nas w biurze — chętnie odpowiemy na Państwa pytania.',
    'contact-addr-label': 'Adres',
    'contact-btn':        'Napisz do nas',
    /* Contact page */
    'contact-page-desc':     'Zapraszamy do kontaktu. Pierwsza konsultacja pomoże nam ocenić Państwa sprawę i zaproponować optymalne rozwiązanie.',
    'contact-form-heading':  'Wyślij wiadomość',
    'contact-info-heading':  'Dane kontaktowe',
    'cf-name-label':         'Imię i nazwisko <span aria-hidden="true">*</span>',
    'cf-name-ph':            'Jan Kowalski',
    'cf-email-label':        'Adres e-mail <span aria-hidden="true">*</span>',
    'cf-email-ph':           'jan@firma.pl',
    'cf-phone-label':        'Telefon',
    'cf-phone-ph':           '600 000 000',
    'cf-topic-label':        'Temat <span aria-hidden="true">*</span>',
    'cf-topic-empty':        '— wybierz temat —',
    'cf-topic-biz':          'Prawo gospodarcze',
    'cf-topic-food':         'Prawo żywnościowe',
    'cf-topic-consumer':     'Pomoc konsumentom (kredyty, roszczenia bankowe)',
    'cf-topic-med':          'Prawo medyczne',
    'cf-topic-comp':         'Odszkodowania i zadośćuczynienia',
    'cf-topic-retainer':     'Stała obsługa prawna',
    'cf-topic-other':        'Inne',
    'cf-message-label':      'Treść wiadomości <span aria-hidden="true">*</span>',
    'cf-message-ph':         'Opisz krótko swoją sprawę...',
    'cf-rodo-text':          'Wyrażam zgodę na przetwarzanie moich danych osobowych przez KNS Kancelaria Radców Prawnych w celu odpowiedzi na moje zapytanie, zgodnie z obowiązującymi przepisami o ochronie danych osobowych (RODO). <span aria-hidden="true">*</span>',
    'cf-submit':             'Wyślij wiadomość',
    'form-required-note':    '* Pola obowiązkowe.',
    'map-title':             'Lokalizacja kancelarii na mapie Google',
    'validate-name':         'Proszę podać imię i nazwisko.',
    'validate-email':        'Proszę podać prawidłowy adres e-mail.',
    'validate-topic':        'Proszę wybrać temat wiadomości.',
    'validate-message':      'Treść wiadomości musi mieć co najmniej 10 znaków.',
    'validate-rodo':         'Wymagana jest zgoda na przetwarzanie danych osobowych.',
    'form-success':          'Wiadomość wysłana. Skontaktujemy się z Państwem wkrótce.',
    'form-error-server':     'Błąd serwera. Proszę spróbować ponownie.',
    'form-error-connection': 'Brak połączenia. Proszę spróbować ponownie lub zadzwonić bezpośrednio.',
    /* Modal */
    'modal-close-aria': 'Zamknij okno',
    'modal-cta':        'Skontaktuj się z nami',
    /* Footer */
    'footer-tagline':         'Profesjonalna obsługa prawna<br>dla firm i osób prywatnych.',
    'footer-oirp':            'Radcowie prawni wpisani na listę<br>Okręgowej Izby Radców Prawnych w Katowicach',
    'footer-nav-heading':     'Nawigacja',
    'footer-contact-heading': 'Kontakt',
    'footer-home':            'Strona główna',
    'footer-spec':            'Specjalizacje',
    'footer-about':           'O nas',
    'footer-articles':        'Artykuły',
    'footer-contact-link':    'Kontakt',
    'footer-nawrocki':        '— r. pr. Nawrocki',
    'footer-slania':          '— r. pr. Słania',
    'footer-copyright':       '© 2025 KNS Kancelaria Radców Prawnych. Wszelkie prawa zastrzeżone.',
  },
  en: {
    /* Navbar */
    'nav-home':     'Home',
    'nav-spec':     'Specialisations',
    'nav-about':    'About us',
    'nav-articles': 'Articles',
    'nav-contact':  'Contact',
    /* Hero */
    'hero-consult': 'Schedule a consultation',
    'hero-spec':    'Our specialisations',
    /* Specialisations */
    'spec-title': 'Our specialisations',
    'spec-desc':  'We offer comprehensive legal services in six key areas, combining legal expertise with business operational realities.',
    /* Card titles */
    'card-food-title':     'Food Law',
    'card-med-title':      'Medical Law',
    'card-consumer-title': 'Consumer Protection',
    'card-biz-title':      'Business Law',
    'card-comp-title':     'Compensation &amp; Damages',
    'card-retainer-title': 'Ongoing Business Support',
    /* Card short lists */
    'card-food-list': [
      'We safely introduce food products to the Polish market',
      'We verify and negotiate contracts with suppliers, importers and retail chains',
      'We verify product labels and compositions for compliance with Polish and EU law',
      'We support entrepreneurs during inspections by supervisory authorities and explanatory proceedings',
      'We prepare notifications to the Chief Sanitary Inspectorate prior to first sale',
    ],
    'card-med-list': [
      'We handle formalities required to conduct medical activities',
      'We support registration and amendments to entries in the RPWDL register',
      "We create documents compliant with patients' rights",
      'We analyse contracts with staff, the National Health Fund and contractors',
      'We represent medical facilities and practitioners before authorities and courts',
    ],
    'card-consumer-list': [
      'We check whether the contract contains prohibited clauses',
      'We handle cases involving loans and credits indexed or denominated in foreign currencies',
      'We verify the possibility of applying the free credit sanction',
      'We represent in negotiations, mediations and court proceedings',
    ],
    'card-biz-list': [
      'We establish, transform and restructure business entities',
      'We draft and negotiate commercial and investment contracts',
      "We structure shareholders' relationships and rules of representation",
      'We pursue claims and defend against unjustified demands',
      'We support negotiations, mediations and strategic ownership decisions',
      'We represent entrepreneurs before courts and administrative authorities',
    ],
    'card-comp-list': [
      'We establish the full scope of possible claims',
      'We recover the costs of treatment, rehabilitation and care',
      'We pursue pensions, lost income and increased needs',
      'We help families after the death of a loved one obtain the benefits they are entitled to',
      'We represent clients before insurers, perpetrators and other liable parties',
    ],
    'card-retainer-list': [
      'We provide ongoing legal support without the need to create a legal department',
      'We respond quickly to everyday questions from management and teams',
      'We update contracts, regulations and templates of required documents',
      'We identify risks before they develop into a dispute',
      'We give the company a permanent point of contact for legal matters',
    ],
    'card-more-btn': 'Learn more',
    /* Team */
    'team-title': 'Our team',
    'team-desc':  "Experienced legal counsels with a passion for solving clients' problems.",
    'team-nawrocki-role': 'Legal Counsel · bar no. KT-3894',
    'team-nawrocki-bio1': 'He gained professional experience during his studies, completing an internship at a leading Silesian law firm. During his legal training he worked at a highly litigation-active firm, participating in hundreds of hearings. After establishing his own practice he developed a thorough understanding of the business client perspective.',
    'team-nawrocki-bio2': 'He specialises in business law, construction law and compensation cases. Outside work he is passionate about ancient Roman history and Italian football.',
    'team-nawrocki-tag1': 'Food Law',
    'team-nawrocki-tag2': 'Compensation',
    'team-nawrocki-tag3': 'Consumer Protection',
    'team-slania-role': 'Legal Counsel · bar no. KT-3894',
    'team-slania-bio1': 'He built his professional experience gradually, progressing through successive stages of legal practice — from training to independently handling cases. Over years of working with individual clients and entrepreneurs he developed an approach based on thorough analysis and clear, jargon-free communication.',
    'team-slania-bio2': "He specialises in medical law, business law and consumer protection. He approaches every case with commitment and a focus on the client's best interests.",
    'team-slania-tag1': 'Medical Law',
    'team-slania-tag2': 'Business Law',
    'team-slania-tag3': 'Consumer Protection',
    /* Blog */
    'blog-title':     'Articles',
    'blog-desc':      "Legal commentary and practical information on regulatory changes prepared by the firm's legal counsels.",
    'blog-all-btn':   'View all articles',
    'blog-read-more': 'Read more',
    /* Post page */
    'post-back':      'All articles',
    'post-cta-label': 'Trust the experts',
    /* Advantage */
    'adv-title':     'Our advantage',
    'adv-exp-title': 'Experience &amp; Practice',
    'adv-exp-desc':  'Hundreds of cases handled and years of litigation practice across diverse areas of law.',
    'adv-ind-title': 'Individual approach',
    'adv-ind-desc':  "Every case is treated with full commitment. We always understand our client's perspective.",
    'adv-en-title':  'English-language services',
    'adv-en-desc':   'We also provide legal assistance in English — for foreign clients and international transactions.',
    /* Partners */
    'partners-title': 'They trust us',
    /* CTA */
    'cta-title': 'Do you need legal&nbsp;help?',
    'cta-text':  'Every case is unique. Contact us — together we will assess your situation and propose the optimal solution.',
    'cta-btn':   'Schedule a consultation',
    /* Contact */
    'contact-title':      'Contact us',
    'contact-desc':       'Call, write or visit us at the office — we will be happy to answer your questions.',
    'contact-addr-label': 'Address',
    'contact-btn':        'Write to us',
    /* Contact page */
    'contact-page-desc':     'We welcome your enquiry. An initial consultation will help us assess your case and propose the optimal solution.',
    'contact-form-heading':  'Send a message',
    'contact-info-heading':  'Contact details',
    'cf-name-label':         'Full name <span aria-hidden="true">*</span>',
    'cf-name-ph':            'John Smith',
    'cf-email-label':        'Email address <span aria-hidden="true">*</span>',
    'cf-email-ph':           'john@example.com',
    'cf-phone-label':        'Phone',
    'cf-phone-ph':           '+48 600 000 000',
    'cf-topic-label':        'Subject <span aria-hidden="true">*</span>',
    'cf-topic-empty':        '— select subject —',
    'cf-topic-biz':          'Business Law',
    'cf-topic-food':         'Food Law',
    'cf-topic-consumer':     'Consumer Protection (credit, banking claims)',
    'cf-topic-med':          'Medical Law',
    'cf-topic-comp':         'Compensation &amp; Damages',
    'cf-topic-retainer':     'Ongoing Legal Support',
    'cf-topic-other':        'Other',
    'cf-message-label':      'Message <span aria-hidden="true">*</span>',
    'cf-message-ph':         'Briefly describe your case...',
    'cf-rodo-text':          'I consent to the processing of my personal data by KNS Law Firm for the purpose of responding to my enquiry, in accordance with applicable personal data protection regulations (GDPR). <span aria-hidden="true">*</span>',
    'cf-submit':             'Send message',
    'form-required-note':    '* Required fields.',
    'map-title':             'Law firm location on Google Maps',
    'validate-name':         'Please enter your full name.',
    'validate-email':        'Please enter a valid email address.',
    'validate-topic':        'Please select a subject.',
    'validate-message':      'Message must be at least 10 characters long.',
    'validate-rodo':         'Consent to data processing is required.',
    'form-success':          'Message sent. We will contact you shortly.',
    'form-error-server':     'Server error. Please try again.',
    'form-error-connection': 'No connection. Please try again or call us directly.',
    /* Modal */
    'modal-close-aria': 'Close window',
    'modal-cta':        'Contact us',
    /* Footer */
    'footer-tagline':         'Professional legal services<br>for businesses and individuals.',
    'footer-oirp':            'Legal counsels registered with the<br>Regional Chamber of Legal Counsels in Katowice',
    'footer-nav-heading':     'Navigation',
    'footer-contact-heading': 'Contact',
    'footer-home':            'Home',
    'footer-spec':            'Specialisations',
    'footer-about':           'About us',
    'footer-articles':        'Articles',
    'footer-contact-link':    'Contact',
    'footer-nawrocki':        '— atty. Nawrocki',
    'footer-slania':          '— atty. Słania',
    'footer-copyright':       '© 2025 KNS Law Firm. All rights reserved.',
  },
};

/* Full modal item lists for EN (keyed by PL title) */
const SPEC_DETAILS_EN = {
  'Prawo gospodarcze': {
    items: [
      'We combine legal advisory with business operational realities',
      'We tailor legal solutions to the stage of company development',
      'We establish, transform and restructure business entities',
      'We draft and negotiate commercial and investment contracts',
      'We protect the company against risks in key contracts',
      "We structure shareholders' relationships and rules of representation",
      'We explain the liability of board members and decision-makers',
      'We support companies in disputes with counterparties',
      'We pursue claims and defend against unjustified demands',
      'We analyse resolutions, articles of association and corporate documents',
      'We support negotiations, mediations and strategic ownership decisions',
      'We help safely enter a new project or market',
      'We streamline decision-making processes between management, shareholders and proxies',
      'We reduce the risk of disputes at the negotiation stage',
      'We represent entrepreneurs before courts and administrative authorities',
    ],
  },
  'Prawo żywnościowe': {
    items: [
      'We safely introduce food products to the Polish market',
      'We verify and negotiate contracts with suppliers, importers and retail chains',
      'We advise on import, export and online sales',
      'We verify product labels and compositions for compliance with Polish and EU law',
      'We support entrepreneurs during inspections by supervisory authorities and explanatory proceedings',
      'We reduce the risk of challenged advertising',
      'We protect the brand against costly communication errors',
      'We prepare the company for the launch of new products',
      'We prepare notifications to the Chief Sanitary Inspectorate prior to first sale',
      'We respond to product recalls, complaints and crises',
      'We organise labels, compositions and designations',
      'We minimise the risk of disputes with authorities and partners',
      'We translate recipes and regulatory changes into specific business decisions',
    ],
  },
  'Pomoc pokrzywdzonym konsumentom': {
    items: [
      'We check whether the contract contains prohibited clauses',
      'We explain actual claims, costs and risks before the case begins',
      'We handle cases involving loans and credits indexed or denominated in foreign currencies — from contract analysis to settlement with the bank and removal of mortgage from the land register',
      'We verify the possibility of applying the free credit sanction',
      'We pursue recovery of commissions and other costs after early repayment',
      'We effectively challenge unclear rules for changing interest rates and fees',
      'We represent in negotiations, mediations and court proceedings',
      'We protect the consumer from a hasty and unfavourable settlement',
    ],
  },
  'Prawo medyczne': {
    items: [
      'We handle formalities required to conduct medical activities',
      'We support registration and amendments to entries in the RPWDL register',
      "We create documents compliant with patients' rights",
      'We prepare safe templates for consents, authorisations and information',
      'We help safely maintain and share medical records',
      'We analyse contracts with staff, the National Health Fund and contractors',
      'We reduce the risk of complaints, disputes and organisational violations',
      'We represent medical facilities and practitioners before authorities and courts',
      'We support healthcare entities during inspections and proceedings',
      'We represent in disputes relating to benefits, documentation and liability',
      'We consult on organisational incidents before they develop into real claims',
      'We prepare regulations, policies and documents for staff',
      'We minimise risks with new services and treatment models',
      "We train teams on patients' rights and safe communication",
    ],
  },
  'Odszkodowania i zadośćuczynienia': {
    items: [
      'We establish the full scope of possible claims',
      'We effectively pursue compensation for pain, suffering and permanent consequences of the incident',
      'We recover the costs of treatment, rehabilitation and care',
      'We pursue pensions, lost income and increased needs',
      'We help families after the death of a loved one obtain the benefits they are entitled to',
      'We organise medical, cost and procedural evidence from the outset of the case',
      'We represent clients before insurers, perpetrators and other liable parties',
    ],
  },
  'Stała obsługa przedsiębiorców': {
    items: [
      'We provide ongoing legal support without the need to create a legal department',
      'We respond quickly to everyday questions from management and teams',
      'We update contracts, regulations and templates of required documents',
      'We identify risks before they develop into a dispute',
      'We support sales, purchases and negotiations in real time',
      'We manage powers of attorney, resolutions and approval workflows',
      "We establish cooperation rules tailored to the company's pace",
      'We give the company a permanent point of contact for legal matters',
      'We improve communication between business, HR, accounting and management',
      'We help plan decisions in advance, not after the fact',
      "We support companies remotely or directly at the client's premises",
      'We scale the scope of assistance to the stage and budget',
      'We relieve owners of legal operational topics',
      'We help maintain predictable costs and rapid response',
      'We combine ongoing advisory with project handling and disputes',
    ],
  },
};

let currentLang = localStorage.getItem('kns-lang') || 'pl';

function applyLang(lang) {
  currentLang = lang;
  const t = TRANSLATIONS[lang];

  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  document.querySelectorAll('[data-i18n-list]').forEach(el => {
    const key = el.dataset.i18nList;
    if (Array.isArray(t[key])) {
      el.innerHTML = t[key].map(item => `<li>${item}</li>`).join('');
    }
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.dataset.i18nAria;
    if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    if (t[key] !== undefined) el.setAttribute('placeholder', t[key]);
  });

  document.querySelectorAll('.card__more').forEach(btn => {
    btn.innerHTML = `${t['card-more-btn']} ${ARROW_SVG}`;
  });

  document.querySelectorAll('.navbar__lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  const path = window.location.pathname;
  if (path.includes('kontakt')) {
    document.title = lang === 'en' ? 'Contact | KNS Law Firm' : 'Kontakt | KNS Kancelaria Radców Prawnych';
  } else if (path.includes('blog.html')) {
    document.title = lang === 'en' ? 'Articles | KNS Law Firm' : 'Artykuły | KNS Kancelaria Radców Prawnych';
  } else if (!path.includes('post.html')) {
    document.title = lang === 'en' ? 'KNS Law Firm | Bytom' : 'KNS Kancelaria Radców Prawnych | Bytom';
  }

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    if (path.includes('kontakt')) {
      metaDesc.content = lang === 'en'
        ? 'Contact KNS Law Firm in Bytom. Contact form, phone, email and office address.'
        : 'Skontaktuj się z KNS Kancelaria Radców Prawnych w Bytomiu. Formularz kontaktowy, telefon, e-mail i adres kancelarii.';
    } else if (path.includes('blog.html')) {
      metaDesc.content = lang === 'en'
        ? "Legal commentary and practical information on regulatory changes prepared by the firm's legal counsels."
        : 'Komentarze prawne i praktyczne informacje o zmianach przepisów.';
    } else if (!path.includes('post.html')) {
      metaDesc.content = lang === 'en'
        ? 'KNS Law Firm – Marcin Nawrocki and Adam Słania. Professional legal services in Bytom. Business law, food law, medical law, compensation.'
        : 'KNS Kancelaria Radców Prawnych – Marcin Nawrocki i Adam Słania. Profesjonalna pomoc prawna w Bytomiu. Prawo gospodarcze, żywnościowe, medyczne, odszkodowania.';
    }
  }

  localStorage.setItem('kns-lang', lang);
}

document.addEventListener('DOMContentLoaded', () => {
  applyLang(currentLang);

  document.querySelectorAll('.navbar__lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyLang(btn.dataset.lang);
      document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: btn.dataset.lang } }));
    });
  });
});

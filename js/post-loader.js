(function () {
  'use strict';

  var slug = new URLSearchParams(window.location.search).get('slug');
  if (!slug) { render404(); return; }

  function loadPost(lang) {
    var primaryPath = lang === 'en'
      ? '../content/blog/en/' + slug + '.md'
      : '../content/blog/pl/' + slug + '.md';

    fetch(primaryPath)
      .then(function (r) { return r.ok ? r.text() : Promise.reject(); })
      .catch(function () {
        if (lang === 'en') {
          return fetch('../content/blog/pl/' + slug + '.md')
            .then(function (r) { return r.ok ? r.text() : Promise.reject(new Error('404')); });
        }
        return Promise.reject(new Error('404'));
      })
      .then(function (text) { renderPost(text, lang); })
      .catch(render404);
  }

  function renderPost(text, lang) {
    var post = parseMd(text);
    var suffix = lang === 'en' ? ' | KNS Law Firm' : ' | KNS Kancelaria Radców Prawnych';
    document.title = post.title + suffix;
    document.querySelector('meta[name="description"]').setAttribute('content', post.excerpt);
    document.getElementById('post-category').textContent = post.category;
    document.getElementById('post-date').textContent = formatDate(post.date, lang);
    document.getElementById('post-title-h1').textContent = post.title;
    document.getElementById('post-content').innerHTML = marked.parse(post.body);
    var defaultCtaTitle = lang === 'en' ? 'Do you need legal advice?' : 'Potrzebujesz porady prawnej?';
    var defaultCtaText  = lang === 'en'
      ? 'Contact us — we will analyse your situation and help you find the best legal solution.'
      : 'Skontaktuj się z nami — przeanalizujemy Twoją sytuację i pomożemy znaleźć najlepsze rozwiązanie prawne.';
    document.getElementById('post-cta-title').textContent = post.ctaTitle || defaultCtaTitle;
    document.getElementById('post-cta-text').textContent  = post.ctaText  || defaultCtaText;
  }

  function parseMd(text) {
    var m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!m) return { title: '', date: '', category: '', excerpt: '', ctaTitle: '', ctaText: '', body: text };

    var fm = {};
    var lastKey = null;
    m[1].split('\n').forEach(function (line) {
      var kv = line.match(/^(\w+):\s*(.*)$/);
      if (kv) {
        lastKey = kv[1];
        fm[lastKey] = parseYamlValue(kv[2]);
      } else if (lastKey && /^\s+/.test(line)) {
        fm[lastKey] += ' ' + line.trim();
      }
    });

    return {
      title:    (fm.title    || '').trim(),
      date:     (fm.date     || '').trim(),
      category: (fm.category || '').trim(),
      excerpt:  (fm.excerpt  || '').trim(),
      ctaTitle: (fm.ctaTitle || '').trim(),
      ctaText:  (fm.ctaText  || '').trim(),
      body: m[2].trim()
    };
  }

  function parseYamlValue(str) {
    str = str.trim();
    if (str[0] === '>' || str[0] === '|') return '';
    return str.replace(/^['"]|['"]$/g, '');
  }

  function formatDate(d, lang) {
    if (!d) return '';
    var locale = lang === 'en' ? 'en-GB' : 'pl-PL';
    return new Date(d).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function render404() {
    document.querySelector('main').innerHTML =
      '<div style="padding:80px 20px;text-align:center"><div class="container">' +
      '<p style="color:var(--color-muted);font-size:18px">Artykuł nie został znaleziony.</p>' +
      '<a href="../blog.html" class="btn btn--primary" style="margin-top:24px;display:inline-block">Wróć do listy artykułów</a>' +
      '</div></div>';
  }

  var initialLang = (typeof currentLang !== 'undefined') ? currentLang : 'pl';
  loadPost(initialLang);

  document.addEventListener('langchange', function (e) {
    loadPost(e.detail.lang);
  });
})();

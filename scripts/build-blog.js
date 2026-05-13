'use strict'
const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const { marked } = require('marked')

const ROOT = path.join(__dirname, '..')
const CONTENT_DIR = path.join(ROOT, 'content', 'blog')
function extract(html, startMarker, endMarker) {
  const start = html.indexOf(startMarker)
  const end = html.indexOf(endMarker)
  if (start === -1 || end === -1) throw new Error(`Marker not found: ${startMarker}`)
  return html.slice(start + startMarker.length, end).trim()
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function getAllPosts() {
  if (!fs.existsSync(CONTENT_DIR)) return []
  return fs.readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.md') || f.endsWith('.mdoc'))
    .map(file => {
      const slug = file.replace(/\.(mdoc|md)$/, '')
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8')
      const { data, content } = matter(raw)
      return {
        slug,
        title: String(data.title ?? ''),
        date: String(data.date ?? ''),
        category: String(data.category ?? ''),
        excerpt: String(data.excerpt ?? ''),
        ctaTitle: data.ctaTitle ? String(data.ctaTitle) : null,
        ctaText: data.ctaText ? String(data.ctaText) : null,
        html: marked(content),
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

const HEAD = (title, desc, cssPath) => `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${desc}">
  <title>${title} | KNS Kancelaria Radców Prawnych</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600&display=optional" rel="stylesheet">
  <link rel="stylesheet" href="${cssPath}">
</head>
<body>`

const ARROW_LEFT = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`
const ARROW_RIGHT = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`

function buildBlogList(posts, navbar, footer) {
  const cards = posts.length === 0
    ? `<p style="color:var(--color-muted);text-align:center">Brak artykułów.</p>`
    : posts.map(p => `
      <article class="blog-card">
        <div class="blog-card__meta">
          <span class="blog-card__category">${p.category}</span>
          <time class="blog-card__date">${formatDate(p.date)}</time>
        </div>
        <h2 class="blog-card__title">${p.title}</h2>
        <p class="blog-card__excerpt">${p.excerpt}</p>
        <a href="blog/post.html?slug=${p.slug}" class="blog-card__btn">Czytaj więcej ${ARROW_RIGHT}</a>
      </article>`).join('\n')

  return `${HEAD('Artykuły', 'Komentarze prawne i praktyczne informacje o zmianach przepisów.', 'css/style.css')}

${navbar}

<main>
  <div class="post-header post-header--hero">
    <img src="articles.jpg" class="post-header__bg" alt="" aria-hidden="true">
    <div class="container">
      <a href="index.html" class="post-back">${ARROW_LEFT} Strona główna</a>
      <h1 class="post-header__title">Artykuły</h1>
      <p class="section-desc" style="margin-top:14px;text-align:left">
        Komentarze prawne i praktyczne informacje o zmianach przepisów przygotowane przez radców prawnych kancelarii.
      </p>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <div class="blog-grid">
        ${cards}
      </div>
    </div>
  </section>
</main>

${footer}

<script src="js/main.js"></script>
</body>
</html>`
}

function main() {
  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8')
  const navbar = extract(indexHtml, '<!-- BLOG_NAV_START -->', '<!-- BLOG_NAV_END -->')
    .replace(/href="#/g, 'href="index.html#')
    .replace('class="navbar"', 'class="navbar scrolled navbar--init"')
  const footer = extract(indexHtml, '<!-- BLOG_FOOTER_START -->', '<!-- BLOG_FOOTER_END -->')
    .replace(/href="#/g, 'href="index.html#')

  const posts = getAllPosts()
  console.log(`Znaleziono ${posts.length} wpisów`)

  fs.writeFileSync(path.join(ROOT, 'blog.html'), buildBlogList(posts, navbar, footer), 'utf-8')
  console.log('Wygenerowano blog.html')

  console.log('Build zakończony.')
}

main()

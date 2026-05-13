import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts, formatDate } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Artykuły',
  description: 'Komentarze prawne i praktyczne informacje o zmianach przepisów przygotowane przez radców prawnych kancelarii.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <main>
      <div className="post-header post-header--hero">
        <div className="container">
          <a href={process.env.NEXT_PUBLIC_SITE_URL ?? '/'} className="post-back">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Strona główna
          </a>
          <h1 className="post-header__title">Artykuły</h1>
          <p className="section-desc" style={{ marginTop: 14, textAlign: 'left' }}>
            Komentarze prawne i praktyczne informacje o zmianach przepisów przygotowane przez radców prawnych kancelarii.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {posts.length === 0 ? (
            <p style={{ color: 'var(--color-muted)', textAlign: 'center' }}>Brak artykułów.</p>
          ) : (
            <div className="blog-grid">
              {posts.map(post => (
                <article key={post.slug} className="blog-card">
                  <div className="blog-card__meta">
                    <span className="blog-card__category">{post.category}</span>
                    <time className="blog-card__date">{formatDate(post.date)}</time>
                  </div>
                  <h2 className="blog-card__title">{post.title}</h2>
                  <p className="blog-card__excerpt">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="blog-card__btn">
                    Czytaj więcej{' '}
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

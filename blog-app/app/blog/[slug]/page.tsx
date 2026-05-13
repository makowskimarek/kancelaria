import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts, getPost, formatDate } from '@/lib/posts'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const posts = getAllPosts()
  const meta = posts.find(p => p.slug === params.slug)
  if (!meta) return {}
  return {
    title: meta.title,
    description: meta.excerpt,
    openGraph: { title: meta.title, description: meta.excerpt, type: 'article' },
  }
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kns.pl'

export default function PostPage({ params }: Props) {
  let post
  try {
    post = getPost(params.slug)
  } catch {
    notFound()
  }

  const ctaTitle = post.ctaTitle ?? 'Potrzebujesz porady prawnej?'
  const ctaText = post.ctaText ?? 'Skontaktuj się z nami — przeanalizujemy Twoją sytuację i pomożemy znaleźć najlepsze rozwiązanie prawne.'

  return (
    <main>
      <div className="post-header">
        <div className="container">
          <a href="/blog" className="post-back">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Wszystkie artykuły
          </a>
          <div className="post-header__meta">
            <span className="blog-card__category">{post.category}</span>
            <time className="blog-card__date">{formatDate(post.date)}</time>
          </div>
          <h1 className="post-header__title">{post.title}</h1>
        </div>
      </div>

      <article className="post-body">
        <div className="container post-body__inner" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>

      <section className="section-cta">
        <div className="cta-split">
          <div className="cta-split__image">
            <img src={`${SITE_URL}/img/AdobeStock_358263747.png`} alt="Konsultacja prawna" loading="lazy" />
          </div>
          <div className="cta-split__content">
            <span className="section-label cta-split__label">Zaufaj ekspertom</span>
            <h2 className="cta-split__title">{ctaTitle}</h2>
            <p className="cta-split__text">{ctaText}</p>
            <a href={`${SITE_URL}/kontakt.html`} className="btn btn--white btn--lg">Umów konsultację</a>
          </div>
        </div>
      </section>
    </main>
  )
}

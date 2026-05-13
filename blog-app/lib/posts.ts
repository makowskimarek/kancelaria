import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

const contentDir = path.join(process.cwd(), 'content', 'blog')

export interface PostMeta {
  slug: string
  title: string
  date: string
  category: string
  excerpt: string
  ctaTitle?: string
  ctaText?: string
}

export interface Post extends PostMeta {
  html: string
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'))
  return files
    .map(file => {
      const slug = file.replace(/\.md$/, '')
      const raw = fs.readFileSync(path.join(contentDir, file), 'utf-8')
      const { data } = matter(raw)
      return {
        slug,
        title: String(data.title ?? ''),
        date: String(data.date ?? ''),
        category: String(data.category ?? ''),
        excerpt: String(data.excerpt ?? ''),
        ctaTitle: data.ctaTitle ? String(data.ctaTitle) : undefined,
        ctaText: data.ctaText ? String(data.ctaText) : undefined,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPost(slug: string): Post {
  const raw = fs.readFileSync(path.join(contentDir, `${slug}.md`), 'utf-8')
  const { data, content } = matter(raw)
  return {
    slug,
    title: String(data.title ?? ''),
    date: String(data.date ?? ''),
    category: String(data.category ?? ''),
    excerpt: String(data.excerpt ?? ''),
    ctaTitle: data.ctaTitle ? String(data.ctaTitle) : undefined,
    ctaText: data.ctaText ? String(data.ctaText) : undefined,
    html: marked(content) as string,
  }
}

export { formatDate }

import { config, fields, collection } from '@keystatic/core'

const blogSchema = {
  title:    fields.slug({ name: { label: 'Tytuł' } }),
  date:     fields.date({ label: 'Data publikacji' }),
  category: fields.text({ label: 'Kategoria' }),
  excerpt:  fields.text({ label: 'Fragment', multiline: true }),
  ctaTitle: fields.text({ label: 'CTA — tytuł', validation: { isRequired: false } }),
  ctaText:  fields.text({ label: 'CTA — treść', multiline: true, validation: { isRequired: false } }),
  content:  fields.markdoc({ label: 'Treść artykułu', extension: 'md' }),
}

export default config({
  storage: {
    kind: 'github',
    repo: { owner: 'makowskimarek', name: 'kancelaria' },
  },
  ui: { brand: { name: 'KNS Blog' } },
  collections: {
    blog: collection({
      label: 'Wpisy — PL',
      slugField: 'title',
      path: 'content/blog/pl/*',
      format: { contentField: 'content' },
      schema: blogSchema,
    }),
    blogEn: collection({
      label: 'Wpisy — EN',
      slugField: 'title',
      path: 'content/blog/en/*',
      format: { contentField: 'content' },
      schema: blogSchema,
    }),
  },
})

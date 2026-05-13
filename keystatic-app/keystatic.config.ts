import { config, fields, collection } from '@keystatic/core'

export default config({
  storage: process.env.KEYSTATIC_GITHUB_CLIENT_ID
    ? {
        kind: 'github',
        repo: { owner: 'makowskimarek', name: 'kancelaria' },
        pathPrefix: 'blog-app',
      }
    : { kind: 'local' },
  ui: { brand: { name: 'KNS Blog' } },
  collections: {
    blog: collection({
      label: 'Wpisy blogowe',
      slugField: 'title',
      path: 'content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title:    fields.slug({ name: { label: 'Tytuł' } }),
        date:     fields.date({ label: 'Data publikacji' }),
        category: fields.text({ label: 'Kategoria' }),
        excerpt:  fields.text({ label: 'Fragment', multiline: true }),
        ctaTitle: fields.text({ label: 'CTA — tytuł', validation: { isRequired: false } }),
        ctaText:  fields.text({ label: 'CTA — treść', multiline: true, validation: { isRequired: false } }),
        content:  fields.markdoc({ label: 'Treść artykułu' }),
      },
    }),
  },
})

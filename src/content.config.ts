import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    cardTitle: z.string(),
    seoTitle: z.string(),
    description: z.string(),
    excerpt: z.string(),
    canonical: z.string(),
    ogImage: z.string(),
    date: z.string(),
    readingMinutes: z.number(),
    category: z.string(),
    categoryLabel: z.string(),
    isPilier: z.boolean().default(false),
    pilierLabel: z.string().optional(),
    heroImage: z.string(),
    heroImageAlt: z.string(),
    heroFigureAlt: z.string().optional(),
    heroImageTitle: z.string().optional(),
    heroImageCaption: z.string().optional(),
    heroImageWidth: z.number().optional(),
    heroImageHeight: z.number().optional(),
    imageWidth: z.number().optional(),
    imageHeight: z.number().optional(),
    ctaText: z.string(),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).default([]),
    crossLinks: z.object({
      label: z.string(),
      links: z.array(z.object({ text: z.string(), url: z.string() })),
    }).optional(),
    jsonLd: z.any(),
  }),
});

export const collections = { blog };

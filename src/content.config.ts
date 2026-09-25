import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Case studies: one Markdown file per project in src/content/case-studies */
const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: ({ image }) =>
    z.object({
      /** Outcome-first title, e.g. "250K views in 30 days for an antique shop" */
      title: z.string(),
      client: z.string(),
      /** Which filter the project appears under on /portfolio */
      service: z.enum(['websites', 'social-media']),
      industry: z.string(),
      /** One line: what we did */
      summary: z.string(),
      /** The headline number or result. Leave empty to show a placeholder slot. */
      result: z.string().optional(),
      /** Optional big stat shown on the card art, e.g. "250K+" */
      stat: z.string().optional(),
      statLabel: z.string().optional(),
      /** Client logo or project screenshot (put the file in src/assets/work) */
      image: image().optional(),
      /** "logo" shows the image on a light panel; "photo" fills the card */
      imageStyle: z.enum(['logo', 'photo']).default('logo'),
      link: z.url().optional(),
      linkLabel: z.string().default('Visit site'),
      status: z.enum(['live', 'in-progress']).default('live'),
      featured: z.boolean().default(false),
      order: z.number().default(100),
    }),
});

/** Courses and digital products: one Markdown file per product in src/content/courses */
const courses = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/courses' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Short label on the card, e.g. "Course 01" */
      kicker: z.string(),
      format: z.string(),
      /** Who it's for */
      audience: z.string(),
      /** What you'll be able to do after */
      outcome: z.string(),
      /** Display price, e.g. "$97". Leave empty while the price isn't set. */
      price: z.string().optional(),
      highlights: z.array(z.string()).default([]),
      image: image().optional(),
      /** Paste your Stripe / Gumroad / Lemon Squeezy link here to switch the card to "Buy now" */
      checkoutUrl: z.url().optional(),
      /** "waitlist" shows an email signup; "live" shows the buy button */
      status: z.enum(['waitlist', 'live']).default('waitlist'),
      placeholder: z.boolean().default(false),
      order: z.number().default(100),
    }),
});

/** Learn articles: one Markdown file per article in src/content/articles */
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    topic: z.enum(['Websites', 'Social Media', 'Growth']),
    readingTime: z.string(),
    /** Short word shown on the article card art */
    cardWord: z.string(),
    order: z.number().default(100),
  }),
});

export const collections = { 'case-studies': caseStudies, courses, articles };

import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

function removeDupsAndLowerCase(array: string[]) {
	if (!array.length) return array
	const lowercaseItems = array.map((str) => str.toLowerCase())
	const distinctItems = new Set(lowercaseItems)
	return Array.from(distinctItems)
}

const post = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/post' }),
	schema: ({ image }) =>
		z.object({
			title: z.string().max(60),
			description: z.string().min(50).max(160),
			publishDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			updatedDate: z
				.string()
				.optional()
				.transform((str) => (str ? new Date(str) : undefined)),
			coverImage: z
				.object({
					src: image(),
					alt: z.string()
				})
				.optional(),
			draft: z.boolean().default(false),
			tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
			ogImage: z.string().optional()
		})
})

const research = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/research' }),
	schema: z.object({
		id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
		locale: z.enum(['es', 'en']),
		title: z.string().min(1),
		summary: z.string().min(40),
		sourceUrl: z.url(),
		domains: z.array(z.enum(['biological', 'intelligent', 'computational', 'physical'])).min(1),
		draft: z.boolean().default(false)
	})
})

// Lab projects move through these states; the site renders each one differently.
export const labStatuses = [
	'idea',
	'prototype',
	'experimental',
	'active',
	'completed',
	'archived'
] as const

const lab = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lab' }),
	schema: z.object({
		id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
		locale: z.enum(['es', 'en']),
		title: z.string().min(1),
		summary: z.string().min(40),
		status: z.enum(labStatuses),
		statusDate: z.coerce.date(),
		// How the device reaches Home Assistant; 'tbd' until it is decided.
		link: z.enum(['lora', 'wifi', 'tbd']).default('tbd'),
		controller: z.string().optional(),
		// Public folder in github.com/oquinterol/lab (open hardware + open software).
		repository: z.url().optional(),
		measures: z.array(z.string()).default([]),
		actions: z.array(z.string()).default([]),
		domains: z.array(z.enum(['biological', 'intelligent', 'computational', 'physical'])).min(1),
		order: z.number().int().default(100),
		draft: z.boolean().default(false)
	})
})

export const collections = { post, research, lab }

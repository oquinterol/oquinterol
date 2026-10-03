import { getCollection, type CollectionEntry } from 'astro:content'
import type { Locale } from '@/i18n/ui'

export type ResearchEntry = CollectionEntry<'research'>

export async function getPublishedResearch(): Promise<ResearchEntry[]> {
	const entries = await getCollection('research', ({ data }) => !data.draft)
	const keys = new Set<string>()
	for (const entry of entries) {
		const key = `${entry.data.locale}/${entry.data.id}`
		if (entry.id !== key || keys.has(key)) {
			throw new Error(`Research entry must have a unique locale/ID path: ${entry.id}`)
		}
		keys.add(key)
	}
	return entries
}

export function researchLocales(entries: ResearchEntry[], id: string): Locale[] {
	return entries.filter((entry) => entry.data.id === id).map((entry) => entry.data.locale)
}

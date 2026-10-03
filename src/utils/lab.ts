import { getCollection, type CollectionEntry } from 'astro:content'
import type { Locale } from '@/i18n/ui'

export type LabEntry = CollectionEntry<'lab'>

export async function getLabProjects(locale: Locale): Promise<LabEntry[]> {
	const entries = await getCollection('lab', ({ data }) => !data.draft)
	const keys = new Set<string>()
	for (const entry of entries) {
		const key = `${entry.data.locale}/${entry.data.id}`
		if (entry.id !== key || keys.has(key)) {
			throw new Error(`Lab entry must have a unique locale/ID path: ${entry.id}`)
		}
		keys.add(key)
	}
	return entries
		.filter((entry) => entry.data.locale === locale)
		.sort((a, b) => a.data.order - b.data.order)
}

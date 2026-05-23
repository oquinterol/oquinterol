import type { CollectionEntry } from 'astro:content'
import { getCollection } from 'astro:content'

export function getPostSlug(post: CollectionEntry<'post'>) {
	return post.id.replace(/\/index$/, '').replace(/\.(md|mdx)$/, '')
}

async function hasPostFiles() {
	const { existsSync, readdirSync, statSync } = await import('node:fs')
	const contentDir = new URL('../content/post', import.meta.url)

	if (!existsSync(contentDir)) return false

	const hasMarkdownFile = (dir: URL): boolean =>
		readdirSync(dir, { withFileTypes: true }).some((entry) => {
			const entryUrl = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, dir)
			if (entry.isDirectory()) return hasMarkdownFile(entryUrl)
			return statSync(entryUrl).isFile() && /\.(md|mdx)$/.test(entry.name)
		})

	return hasMarkdownFile(contentDir)
}

/** Note: this function filters out draft posts based on the environment */
export async function getAllPosts() {
	if (!(await hasPostFiles())) return []

	return await getCollection('post', ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true
	})
}

export function sortMDByDate(posts: Array<CollectionEntry<'post'>>) {
	return posts.sort((a, b) => {
		const aDate = new Date(a.data.updatedDate ?? a.data.publishDate).valueOf()
		const bDate = new Date(b.data.updatedDate ?? b.data.publishDate).valueOf()
		return bDate - aDate
	})
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getAllTags(posts: Array<CollectionEntry<'post'>>) {
	return posts.flatMap((post) => [...post.data.tags])
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getUniqueTags(posts: Array<CollectionEntry<'post'>>) {
	return [...new Set(getAllTags(posts))]
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getUniqueTagsWithCount(
	posts: Array<CollectionEntry<'post'>>
): Array<[string, number]> {
	return [
		...getAllTags(posts).reduce(
			(acc, t) => acc.set(t, (acc.get(t) || 0) + 1),
			new Map<string, number>()
		)
	].sort((a, b) => b[1] - a[1])
}

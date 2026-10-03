import { locales, type Locale } from './ui'

export type Page =
	| 'home'
	| 'cv'
	| 'research'
	| 'research-detail'
	| 'lab'
	| 'tools'
	| 'vector-editor'

export function isLocale(value: string): value is Locale {
	return locales.some((locale) => locale === value)
}

export function localizedPath(locale: Locale, page: Page, id?: string): string {
	const base = import.meta.env.BASE_URL.replace(/\/$/, '')
	const prefix = `${base}/${locale}`
	switch (page) {
		case 'home':
			return `${prefix}/`
		case 'cv':
			return `${prefix}/cv/`
		case 'research':
			return `${prefix}/research/`
		case 'lab':
			return `${prefix}/lab/`
		case 'tools':
			return `${prefix}/tools/`
		case 'vector-editor':
			return `${prefix}/tools/vector-editor/`
		case 'research-detail':
			if (!id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
				throw new Error('Research pages require a stable URL-safe ID')
			}
			return `${prefix}/research/${id}/`
	}
}

export function alternatePaths(page: Page, id?: string, available: readonly Locale[] = locales) {
	return available.map((locale) => ({ locale, path: localizedPath(locale, page, id) }))
}

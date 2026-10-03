import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { remarkReadingTime } from './src/utils/remarkReadingTime.ts'
import remarkUnwrapImages from 'remark-unwrap-images'
import rehypeExternalLinks from 'rehype-external-links'
import expressiveCode from 'astro-expressive-code'
import { expressiveCodeOptions } from './src/site.config'
import { translatedRoutes } from './src/i18n/route-manifest.ts'

const builtPaths = new Set()
let basePath = '/'
const routeInventory = {
	name: 'published-route-inventory',
	hooks: {
		'astro:config:done': ({ config }) => {
			basePath = config.base.endsWith('/') ? config.base : `${config.base}/`
		},
		'astro:build:done': ({ pages }) => {
			builtPaths.clear()
			for (const page of pages) {
				const path = page.pathname.replace(/^\/|\/$/g, '')
				builtPaths.add(path ? `/${path}/` : '/')
			}
		}
	}
}

// https://astro.build/config
export default defineConfig({
	site: 'https://oquinterol.com',
	i18n: {
		locales: ['es', 'en'],
		defaultLocale: 'es',
		routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false }
	},
	integrations: [
		expressiveCode(expressiveCodeOptions),
		routeInventory,
		sitemap({
			serialize(item) {
				const current = new URL(item.url)
				const pair = translatedRoutes.find(
					([es, en]) => current.pathname.endsWith(es) || current.pathname.endsWith(en)
				)
				if (pair) {
					const matched = current.pathname.endsWith(pair[0]) ? pair[0] : pair[1]
					const base = current.pathname.slice(0, -matched.length)
					const available = pair.every(
						(path) => builtPaths.has(`${base}${path}`) || builtPaths.has(path)
					)
					if (!available) return item
					const link = (path) => new URL(`${base}${path}`, current.origin).href
					item.links = [
						{ lang: 'es-CO', url: link(pair[0]) },
						{ lang: 'en', url: link(pair[1]) }
					]
					if (pair[0] === '/es/') item.links.push({ lang: 'x-default', url: link('/') })
				} else if (current.pathname === basePath) {
					item.links = [
						{ lang: 'es-CO', url: new URL(`${basePath}es/`, current.origin).href },
						{ lang: 'en', url: new URL(`${basePath}en/`, current.origin).href },
						{ lang: 'x-default', url: item.url }
					]
				}
				return item
			}
		}),
		mdx(),
		react()
	],
	markdown: {
		remarkPlugins: [remarkUnwrapImages, remarkReadingTime],
		rehypePlugins: [
			[
				rehypeExternalLinks,
				{
					target: '_blank',
					rel: ['nofollow', 'noopener', 'noreferrer']
				}
			]
		],
		remarkRehype: {
			footnoteLabelProperties: {
				className: ['']
			}
		}
	},
	prefetch: true
})

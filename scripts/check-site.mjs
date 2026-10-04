import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'

const dist = new URL('../dist/', import.meta.url)
const expected = [
	'index.html',
	'es/index.html',
	'en/index.html',
	'es/cv/index.html',
	'en/cv/index.html',
	'es/research/index.html',
	'en/research/index.html',
	'es/research/phureja-genome/index.html',
	'es/lab/index.html',
	'en/lab/index.html',
	'es/research/phureja-rnaseq-pipeline/index.html',
	'en/research/phureja-rnaseq-pipeline/index.html',
	'es/research/genome-agent/index.html',
	'en/research/genome-agent/index.html',
	'es/tools/index.html',
	'en/tools/index.html',
	'es/tools/vector-editor/index.html',
	'en/tools/vector-editor/index.html',
	'blog/index.html',
	'tags/index.html',
	'404.html',
	'rss.xml',
	'robots.txt',
	'social-card.png',
	'sitemap-0.xml'
]
const read = (file) => readFileSync(new URL(file, dist), 'utf8')
for (const file of expected) assert.ok(existsSync(new URL(file, dist)), `Missing ${file}`)
const socialCard = readFileSync(new URL('social-card.png', dist))
assert.equal(socialCard.readUInt32BE(16), 1200)
assert.equal(socialCard.readUInt32BE(20), 630)

const root = read('index.html')
const canonical = (html) => html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/)?.[1]
const rootUrl = new URL(canonical(root))
const origin = rootUrl.origin
const basePath = rootUrl.pathname
const absolutePath = (path) => `${basePath}${path.slice(1)}`
const routeFile = (pathname) => {
	assert.ok(pathname.startsWith(basePath), `URL outside deployment base: ${pathname}`)
	return pathname === basePath ? 'index.html' : `${pathname.slice(basePath.length)}index.html`
}
const articlePair = ['/es/research/phureja-genome/', '/en/research/phureja-genome/']
const englishArticle = existsSync(new URL('en/research/phureja-genome/index.html', dist))
const pairs = [
	['/es/', '/en/'],
	['/es/cv/', '/en/cv/'],
	['/es/research/', '/en/research/'],
	['/es/lab/', '/en/lab/'],
	['/es/tools/', '/en/tools/'],
	['/es/tools/vector-editor/', '/en/tools/vector-editor/'],
	['/es/research/phureja-rnaseq-pipeline/', '/en/research/phureja-rnaseq-pipeline/'],
	['/es/research/genome-agent/', '/en/research/genome-agent/'],
	...(englishArticle ? [articlePair] : [])
]

assert.match(root, /<html lang="es"/)
assert.match(root, /lang="en"/)
assert.doesNotMatch(root, /http-equiv="refresh"/)
// / stays neutral in SSR; only a stored explicit choice can bypass its selector.
const preferenceScript = root.match(
	/<script\b[^>]*data-locale-preference[^>]*>([\s\S]*?)<\/script>/
)?.[1]
assert.ok(preferenceScript, 'Missing early locale preference script')
assert.ok(
	root.indexOf('data-locale-preference') < root.indexOf('<body'),
	'Locale restore must run before body rendering'
)
assert.match(preferenceScript, /localStorage\.getItem\(['"]site\.locale['"]\)/)
assert.match(preferenceScript, /stored === ['"]es['"] \|\| stored === ['"]en['"]/)
assert.match(preferenceScript, /window\.location\.replace\(localeHomes\[stored\]\)/)
assert.ok(root.includes(`href="${absolutePath('/es/')}"`))
assert.ok(root.includes(`href="${absolutePath('/en/')}"`))

const alternates = (html) =>
	[...html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/g)].map(
		([, lang, url]) => [lang, url]
	)
const allPages = [
	'index.html',
	'es/index.html',
	'en/index.html',
	'es/cv/index.html',
	'en/cv/index.html',
	'es/research/index.html',
	'en/research/index.html',
	'es/research/phureja-genome/index.html',
	...(englishArticle ? ['en/research/phureja-genome/index.html'] : []),
	'es/lab/index.html',
	'en/lab/index.html',
	'es/research/phureja-rnaseq-pipeline/index.html',
	'en/research/phureja-rnaseq-pipeline/index.html',
	'es/research/genome-agent/index.html',
	'en/research/genome-agent/index.html',
	'es/tools/index.html',
	'en/tools/index.html',
	'es/tools/vector-editor/index.html',
	'en/tools/vector-editor/index.html',
	'blog/index.html',
	'tags/index.html',
	'404.html'
]
for (const file of allPages) {
	const html = read(file)
	assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${file}: expected exactly one h1`)
	assert.equal(
		new URL(canonical(html)).pathname,
		file === 'index.html'
			? basePath
			: file === '404.html'
				? absolutePath('/404/')
				: absolutePath(`/${file.replace(/index\.html$/, '')}`)
	)
	for (const [lang, href] of alternates(html)) {
		assert.ok(['es-CO', 'en', 'x-default'].includes(lang), `Invalid hreflang: ${file}`)
		const url = new URL(href)
		assert.equal(url.origin, origin, `Wrong alternate origin: ${file}`)
		assert.ok(
			existsSync(new URL(routeFile(url.pathname), dist)),
			`Broken alternate: ${file} → ${href}`
		)
	}
	// The legacy blog still has historical root-relative links; preserve its old URLs.
	if (basePath !== '/' && ['blog/index.html', 'tags/index.html', '404.html'].includes(file))
		continue
	for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
		if (!href.startsWith('/') || href.startsWith('//')) continue
		const pathname = new URL(href, origin).pathname
		const target = pathname.endsWith('/') ? routeFile(pathname) : pathname.slice(basePath.length)
		assert.ok(existsSync(new URL(target, dist)), `Broken internal link: ${file} → ${href}`)
	}
}
for (const [es, en] of pairs) {
	for (const [path, lang] of [
		[es, 'es-CO'],
		[en, 'en']
	]) {
		const html = read(routeFile(absolutePath(path)))
		assert.match(html, new RegExp(`<html lang="${lang}"`), `Wrong language at ${path}`)
		const links = alternates(html)
		assert.ok(
			links.some(([code, href]) => code === 'es-CO' && href === `${origin}${absolutePath(es)}`),
			`Missing Spanish alternate: ${path}`
		)
		assert.ok(
			links.some(([code, href]) => code === 'en' && href === `${origin}${absolutePath(en)}`),
			`Missing English alternate: ${path}`
		)
	}
}
assert.ok(
	alternates(read('es/index.html')).some(
		([code, href]) => code === 'x-default' && href === `${origin}${basePath}`
	)
)
assert.ok(!alternates(read('blog/index.html')).some(([code]) => code === 'en'))
assert.match(read('es/index.html'), /<ol class="systems-list"/)
assert.match(read('en/index.html'), /<ol class="systems-list"/)
for (const locale of ['es', 'en']) {
	const home = read(`${locale}/index.html`)
	assert.match(home, /<p class="hero-name">Quintero-L, O\.<\/p>/)
	assert.match(home, /<meta content="Oscar Alexis Quintero López" name="author"/)
	assert.match(home, /class="site-brand"[^>]*>Quintero-L, O<span>\.<\/span><\/a>/)
	// Geometry is SSR-rendered twice; CSS chooses one without dropping letters or labels.
	assert.match(home, /<details class="site-mobile-menu">/)
	assert.match(home, /class="helix-stage diagram-stage"/)
	assert.equal(
		(home.match(/\bdata-rung="\d+"/g) ?? []).length,
		42 * 2,
		`${locale}: missing DNA rungs`
	)
	const labList = home.match(/<ul class="ln-list"[^>]*>([\s\S]*?)<\/ul>/)?.[1]
	assert.ok(labList, `${locale}: missing lab list`)
	const deviceCount = (labList.match(/<li\b/g) ?? []).length
	assert.ok(deviceCount > 0, `${locale}: empty lab list`)
	assert.equal(
		(home.match(/class="ln-device"/g) ?? []).length,
		deviceCount * 2,
		`${locale}: missing lab nodes`
	)
	assert.equal(
		(home.match(/class="ln-label"/g) ?? []).length,
		deviceCount * 2,
		`${locale}: missing lab labels`
	)
	assert.equal(
		(home.match(/class="ln-status"/g) ?? []).length,
		deviceCount * 2,
		`${locale}: missing lab statuses`
	)
	for (const layout of ['portrait', 'landscape']) {
		assert.match(home, new RegExp(`class="diagram-${layout}"`))
		assert.match(
			read(`${locale}/cv/index.html`),
			new RegExp(`class="skills-graph diagram-${layout}"`)
		)
		for (const project of [
			'genome-agent',
			...(locale === 'es' || englishArticle ? ['phureja-genome'] : [])
		]) {
			assert.match(
				read(`${locale}/research/${project}/index.html`),
				new RegExp(`class="(?:pl-loop )?diagram-${layout}"`)
			)
		}
	}
	// The personal map has a complete HTML reading mode, even before hydration.
	assert.match(home, /<details class="personal-map-reading">/)
	assert.match(home, /class="personal-map-intro"/)
	const mapNodes = home.match(/<ul class="map-reading-nodes">([\s\S]*?)<\/ul>/)?.[1]
	const mapEdges = home.match(/<ul class="map-reading-edges">([\s\S]*?)<\/ul>/)?.[1]
	assert.ok(mapNodes && mapEdges, `${locale}: missing personal map fallback`)
	const nodeIds = [...mapNodes.matchAll(/<li\b[^>]*\bid="([^"]+)"/g)].map(([, id]) => id)
	assert.equal(new Set(nodeIds).size, nodeIds.length, `${locale}: duplicate map nodes`)
	assert.ok(nodeIds.some((id) => id.endsWith('-read-curiosity')))
	for (const id of ['biology', 'programming', 'electronics', 'everyday', 'vector-editor']) {
		assert.ok(
			nodeIds.some((node) => node.endsWith(`-read-${id}`)),
			`${locale}: missing ${id}`
		)
	}
	const references = [...mapEdges.matchAll(/href="#([^"]+)"/g)].map(([, id]) => id)
	for (const id of references) {
		assert.ok(nodeIds.includes(id), `${locale}: dangling map relationship to ${id}`)
	}
	for (const id of nodeIds) {
		assert.ok(references.includes(id), `${locale}: isolated personal map node ${id}`)
	}
	for (const [, nodeId, body] of mapNodes.matchAll(
		/<li\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/li>/g
	)) {
		assert.match(body, /<p>[^<]+<\/p>/, `${locale}: node without a description: ${nodeId}`)
		if (
			/photobioreactor|plant-monitor|connected-dna-quantifier|connected-thermocycler|connected-flow-hood|shaking-incubator/.test(
				nodeId
			)
		) {
			assert.match(body, /class="map-status"/, `${locale}: lab idea without a status: ${nodeId}`)
		}
	}
	const reasons = [...mapEdges.matchAll(/<p>([^<]+)<\/p>/g)]
	assert.equal(reasons.length * 2, references.length, `${locale}: every edge needs an explanation`)
}
assert.match(read('es/cv/index.html'), /Universidad Nacional de Colombia/)
for (const locale of ['es', 'en']) {
	assert.match(read(`${locale}/cv/index.html`), /<h1>Oscar Alexis Quintero López<\/h1>/)
}
assert.match(read('en/cv/index.html'), /cv_english\.pdf/)
for (const file of allPages) {
	assert.doesNotMatch(read(file), /<img\b[^>]*(?:Perfil|portrait)/i, `Portrait visible: ${file}`)
}
for (const file of ['es/cv/index.html', 'en/cv/index.html']) {
	assert.doesNotMatch(read(file), /<img\b/i, `Unexpected image in CV: ${file}`)
}
assert.ok(!readdirSync(new URL('_astro/', dist)).some((file) => /perfil|portrait/i.test(file)))
// Lab projects must show their status so ideas are never presented as built systems.
for (const locale of ['es', 'en']) {
	assert.match(read(`${locale}/lab/index.html`), /aria-current="step"/)
}
assert.match(read('es/research/phureja-genome/index.html'), /repositorio\.unal\.edu\.co/)
for (const locale of ['es', 'en']) {
	assert.match(
		read(`${locale}/research/phureja-rnaseq-pipeline/index.html`),
		/repository\.udistrital\.edu\.co/
	)
}
if (englishArticle) {
	assert.match(read('en/research/phureja-genome/index.html'), /repositorio\.unal\.edu\.co/)
} else {
	assert.doesNotMatch(read('es/research/phureja-genome/index.html'), /hreflang="en"/)
}
const sitemap = read('sitemap-0.xml')
const sitemapEntries = [...sitemap.matchAll(/<url>(.*?)<\/url>/gs)].map((match) => match[1])
for (const entry of sitemapEntries) {
	for (const [, href] of entry.matchAll(/<xhtml:link\b[^>]*\bhref="([^"]+)"/g)) {
		const url = new URL(href)
		assert.equal(url.origin, origin)
		assert.ok(
			existsSync(new URL(routeFile(url.pathname), dist)),
			`Broken sitemap alternate: ${href}`
		)
	}
}
const rootSitemap = sitemapEntries.find((xml) => xml.includes(`<loc>${origin}${basePath}</loc>`))
assert.ok(rootSitemap?.includes(`hreflang="x-default" href="${origin}${basePath}"`))
for (const [es, en] of pairs) {
	for (const path of [es, en]) {
		const entry = sitemapEntries.find((xml) =>
			xml.includes(`<loc>${origin}${absolutePath(path)}</loc>`)
		)
		assert.ok(entry, `Missing sitemap entry: ${path}`)
		assert.ok(
			entry.includes(`hreflang="es-CO" href="${origin}${absolutePath(es)}"`),
			`Missing sitemap ES alternate: ${path}`
		)
		assert.ok(
			entry.includes(`hreflang="en" href="${origin}${absolutePath(en)}"`),
			`Missing sitemap EN alternate: ${path}`
		)
	}
}
if (!englishArticle) {
	const spanishArticle = sitemapEntries.find((xml) =>
		xml.includes(`<loc>${origin}${absolutePath(articlePair[0])}</loc>`)
	)
	assert.ok(spanishArticle)
	assert.ok(!spanishArticle.includes('hreflang="en"'), 'Phantom English research alternate')
}
assert.ok(
	!sitemapEntries
		.find((xml) => xml.includes(`<loc>${origin}${absolutePath('/blog/')}</loc>`))
		?.includes('hreflang=')
)
assert.match(read('robots.txt'), /Sitemap: https:\/\/oquinterol\.com\/sitemap-index\.xml/)
console.log(
	`Static smoke test passed: ${allPages.length} HTML pages, ${pairs.length} reciprocal pairs, legacy routes, assets, RSS and sitemap.`
)

import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright')
const { default: AxeBuilder } = await import(process.env.AXE_MODULE ?? '@axe-core/playwright')
const artifacts = mkdtempSync(join(tmpdir(), 'oquinterol-responsive-'))
const root = fileURLToPath(new URL('../', import.meta.url))
const port = String(process.env.RESPONSIVE_PORT ?? 4323)
const server = spawn('pnpm', ['exec', 'astro', 'preview', '--host', '127.0.0.1', '--port', port], {
	cwd: root,
	detached: true,
	stdio: 'ignore'
})
const origin = `http://127.0.0.1:${port}`
// Runs inside the browser: convert the particle's painted centre back to SVG units
// and compare it with the real wire/ring, including CSS motion-path transforms.
function flowGeometry(svg, { particle, wire }) {
	const matrix = svg.getScreenCTM().inverse()
	return [...svg.querySelectorAll(particle)].map((node) => {
		const path = node.parentElement.querySelector(wire)
		const box = node.getBoundingClientRect()
		const centre = new DOMPoint(box.x + box.width / 2, box.y + box.height / 2).matrixTransform(
			matrix
		)
		const length = path.getTotalLength()
		let error = Infinity
		for (let i = 0; i <= 500; i++) {
			const point = path.getPointAtLength((length * i) / 500)
			error = Math.min(error, Math.hypot(point.x - centre.x, point.y - centre.y))
		}
		return { error, animation: getComputedStyle(node).animationName }
	})
}
let browser
const axeIssues = []
try {
	for (let i = 0; i < 100; i++) {
		try {
			if ((await fetch(origin)).ok) break
		} catch {}
		await new Promise((r) => setTimeout(r, 100))
	}
	browser = await chromium.launch({
		executablePath: process.env.BROWSER_EXECUTABLE,
		args: ['--no-sandbox'],
		headless: true
	})
	for (const [locale, width, height] of [
		['es', 320, 640],
		['es', 375, 812],
		['en', 375, 812],
		['en', 768, 1024],
		['es', 1080, 1920],
		['en', 1080, 1920],
		['en', 1440, 2560],
		['en', 1440, 900],
		['en', 1024, 768],
		['es', 844, 390],
		['en', 560, 360]
	]) {
		const portrait = height >= width || width - 40 <= 840
		const context = await browser.newContext({
			viewport: { width, height },
			reducedMotion: 'reduce'
		})
		const page = await context.newPage(),
			errors = []
		page.on('pageerror', (e) => errors.push(e.message))
		await page.goto(`${origin}/${locale}/`)
		const dnaPortrait = await page
			.locator('.helix-stage')
			.evaluate((el) => getComputedStyle(el).getPropertyValue('--diagram-portrait').trim() === '1')
		const dna = page.locator(`.helix-stage .diagram-${dnaPortrait ? 'portrait' : 'landscape'} svg`)
		await dna.scrollIntoViewIfNeeded()
		assert.ok(await dna.isVisible())
		assert.equal(await dna.locator('[data-rung]').count(), 42)
		assert.equal(await dna.locator('[data-rung] text').count(), 84)
		assert.ok(await dna.locator('text').first().isVisible())
		const dnaGeometry = await dna.evaluate((el) => {
			const r = el.getBoundingClientRect(),
				box = el.viewBox.baseVal
			const font =
				(parseFloat(getComputedStyle(el.querySelector('text')).fontSize) * r.width) / box.width
			const clipped = [...el.querySelectorAll('text')].filter((t) => {
				const b = t.getBBox()
				return b.x < 0 || b.x + b.width > box.width || b.y < 0 || b.y + b.height > box.height
			}).length
			return { width: r.width, height: r.height, font, clipped }
		})
		if (dnaPortrait) {
			assert.ok(dnaGeometry.height > dnaGeometry.width * 2)
			assert.ok(dnaGeometry.font >= 12, JSON.stringify(dnaGeometry))
			assert.equal(dnaGeometry.clipped, 0)
		}
		const clippedLinks = await page
			.locator('.helix-links a')
			.evaluateAll((links) =>
				links
					.filter((link) => link.offsetParent && link.scrollWidth > link.clientWidth)
					.map((link) => link.textContent.trim())
			)
		assert.deepEqual(clippedLinks, [])
		const splitWords = await page.locator('.helix-links a').evaluateAll((links) =>
			links.flatMap((link) => {
				if (!link.offsetParent) return []
				return [...link.childNodes]
					.filter((node) => {
						if (
							node.nodeType !== Node.TEXT_NODE ||
							!node.textContent.trim() ||
							/\s/.test(node.textContent.trim())
						)
							return false
						const range = document.createRange()
						range.selectNodeContents(node)
						return [...range.getClientRects()].filter((rect) => rect.width > 0).length > 1
					})
					.map((node) => node.textContent.trim())
			})
		)
		assert.deepEqual(splitWords, [])
		const lab = page.locator(`.lab-network .diagram-${portrait ? 'portrait' : 'landscape'}`)
		assert.ok(await lab.isVisible())
		assert.equal(await lab.locator('.ln-device').count(), 6)
		const transmitters = await lab
			.locator(
				'.ln-device[data-status="experimental"], .ln-device[data-status="active"], .ln-device[data-status="completed"]'
			)
			.count()
		assert.equal(await lab.locator('.ln-packet').count(), transmitters)
		assert.ok(await lab.locator('.ln-label').first().isVisible())
		const diagramOverflow = await page.evaluate(() => ({
			width: innerWidth,
			scroll: document.documentElement.scrollWidth,
			culprits: [...document.querySelectorAll('body *')]
				.filter((el) => {
					const r = el.getBoundingClientRect()
					return r.right > innerWidth + 1 && getComputedStyle(el).display !== 'none' && r.width > 0
				})
				.slice(0, 8)
				.map((el) => ({
					tag: el.tagName,
					cls: String(el.className),
					right: el.getBoundingClientRect().right
				}))
		}))
		assert.ok(diagramOverflow.scroll <= width, JSON.stringify(diagramOverflow))
		if (width <= 700) {
			const menu = page.locator('.site-mobile-menu')
			await menu.locator('summary').click()
			assert.equal(await menu.locator('a').count(), 5)
			await menu.locator('a').first().focus()
			await page.keyboard.press('Escape')
			assert.equal(await menu.evaluate((el) => el.open), false)
		}
		await page
			.locator('.helix-stage')
			.screenshot({ path: `${artifacts}/portrait-dna-${locale}-${width}.png` })
		await lab.screenshot({ path: `${artifacts}/portrait-lab-${locale}-${width}.png` })
		await page.locator('.personal-map-intro').scrollIntoViewIfNeeded()
		const trigger = page.getByRole('button', {
			name: locale === 'en' ? 'Explore connections' : 'Explorar conexiones'
		})
		await trigger.click()
		const dialog = page.getByRole('dialog')
		await dialog.waitFor()
		await page.waitForFunction(
			(expected) => document.querySelector('dialog').dataset.layout === expected,
			portrait ? 'portrait' : 'landscape'
		)
		assert.equal(
			await page.locator('.map-view-switch button[aria-pressed="true"]').textContent(),
			locale === 'en' ? 'Map' : 'Mapa'
		)
		assert.equal(await page.locator('.personal-map-node').count(), 20)
		if (portrait) {
			const canvas = await page.locator('.personal-map-canvas').evaluate((el) => ({
				width: el.clientWidth,
				height: el.clientHeight,
				parent: el.parentElement.clientWidth
			}))
			assert.ok(canvas.height > canvas.width * 3)
			assert.ok(canvas.width <= canvas.parent)
		}
		const overlaps = await page.locator('.personal-map-node').evaluateAll((nodes) => {
			const r = nodes.map((n) => ({ id: n.dataset.nodeId, r: n.getBoundingClientRect() })),
				out = []
			for (let i = 0; i < r.length; i++)
				for (let j = i + 1; j < r.length; j++) {
					const a = r[i].r,
						b = r[j].r
					if (
						Math.min(a.right, b.right) > Math.max(a.left, b.left) &&
						Math.min(a.bottom, b.bottom) > Math.max(a.top, b.top)
					)
						out.push([r[i].id, r[j].id])
				}
			return out
		})
		assert.deepEqual(overlaps, [])
		await page.screenshot({ path: `${artifacts}/portrait-map-start-${locale}-${width}.png` })
		await page.locator('.personal-map-node[data-node-id="genome-agent"]').click()
		assert.equal(await page.locator('.personal-map-detail h3').textContent(), 'GenomeAgent')
		if (portrait) {
			await page
				.getByRole('button', {
					name: locale === 'en' ? 'Details of selected node' : 'Detalles del nodo seleccionado',
					exact: true
				})
				.click()
			assert.equal(
				await page.locator('.personal-map-detail').evaluate((el) => el === document.activeElement),
				true
			)
		}
		const axe = await new AxeBuilder({ page }).include('dialog').analyze()
		if (axe.violations.length)
			axeIssues.push({
				locale,
				width,
				violations: axe.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) }))
			})
		await page.screenshot({ path: `${artifacts}/portrait-map-${locale}-${width}.png` })
		await page.keyboard.press('Escape')
		await dialog.waitFor({ state: 'detached' })
		assert.equal(await trigger.evaluate((el) => el === document.activeElement), true)
		await page.goto(`${origin}/${locale}/cv/`)
		const skillsPortrait = await page
			.locator('.skills-network .diagram-stage')
			.evaluate((el) => getComputedStyle(el).getPropertyValue('--diagram-portrait').trim() === '1')
		const skill = page.locator(`.skills-graph.diagram-${skillsPortrait ? 'portrait' : 'landscape'}`)
		await skill.scrollIntoViewIfNeeded()
		await page.locator('.skills-filter button').first().waitFor()
		assert.ok(await skill.isVisible())
		await page.locator('.skills-filter button').nth(1).click()
		await page.waitForTimeout(100)
		assert.ok((await skill.locator('.sk-tool text').count()) > 0)
		if (skillsPortrait) {
			const clipped = await skill.locator('.sk-tool text').evaluateAll((ts) =>
				ts
					.filter((t) => {
						const b = t.getBBox(),
							v = t.ownerSVGElement.viewBox.baseVal
						return b.x < 0 || b.x + b.width > v.width || b.y < 0 || b.y + b.height > v.height
					})
					.map((t) => t.textContent)
			)
			assert.deepEqual(clipped, [])
		}
		await skill.screenshot({ path: `${artifacts}/portrait-skills-${locale}-${width}.png` })
		for (const id of ['phureja-genome', 'genome-agent']) {
			await page.goto(`${origin}/${locale}/research/${id}/`)
			const figure = page.locator('.pipeline-figure'),
				stage = figure.locator('.diagram-stage')
			await figure.scrollIntoViewIfNeeded()
			await page.locator('.pipeline-stages button').first().waitFor()
			const usePortrait = await stage.evaluate(
				(el) => getComputedStyle(el).getPropertyValue('--diagram-portrait').trim() === '1'
			)
			const svg = stage.locator(`svg.diagram-${usePortrait ? 'portrait' : 'landscape'}`)
			assert.ok(await svg.isVisible())
			await page.locator('.pipeline-stages button').nth(1).click()
			assert.equal(await page.locator('.pipeline-stages button[aria-pressed="true"]').count(), 1)
			if (id === 'genome-agent')
				assert.equal(await svg.locator('.pl-loop-node[data-active="true"]').count(), 1)
			else assert.equal(await svg.getAttribute('data-stage'), '1')
			await svg.screenshot({ path: `${artifacts}/portrait-${id}-${locale}-${width}.png` })
		}
		assert.deepEqual(errors, [])
		assert.equal(
			await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
			true
		)
		console.log(
			`PASS ${locale} ${width}x${height}: ${portrait ? 'vertical' : 'horizontal'} compositions, all DNA letters/lab labels, map, skills, both pipelines, menu and no page errors; DNA font ${dnaGeometry.font.toFixed(1)}px`
		)
		await context.close()
	}
	// Responsive CSS and equivalent content must work before any hydration.
	for (const locale of ['es', 'en']) {
		const context = await browser.newContext({
			viewport: { width: 375, height: 812 },
			javaScriptEnabled: false
		})
		const page = await context.newPage()
		await page.goto(`${origin}/${locale}/`)
		assert.ok(await page.locator('.helix-stage .diagram-portrait').isVisible())
		assert.ok(await page.locator('.lab-network .diagram-portrait .ln-label').first().isVisible())
		await page.locator('.site-mobile-menu summary').click()
		assert.ok(await page.locator('.site-mobile-menu nav').isVisible())
		await page.goto(`${origin}/${locale}/cv/`)
		assert.ok(await page.locator('.skills-graph.diagram-portrait').isVisible())
		assert.equal(await page.locator('.bio-module').count(), 5)
		await page.goto(`${origin}/${locale}/research/genome-agent/`)
		assert.ok(await page.locator('.pipeline-figure .diagram-portrait').isVisible())
		assert.equal(await page.locator('.pipeline-detail[hidden]').count(), 0)
		console.log(
			`PASS ${locale} no JS: vertical geometry, letters, lab labels, skills, research stages and native menu remain available`
		)
		await context.close()
	}
	const context = await browser.newContext({
		viewport: { width: 1440, height: 900 },
		reducedMotion: 'no-preference'
	})
	const page = await context.newPage()
	await page.goto(`${origin}/en/`)
	await page.locator('.helix-stage').scrollIntoViewIfNeeded()
	const pause = page.getByRole('button', { name: 'Pause reading', exact: true })
	await pause.waitFor()
	const strand = page.locator('.helix-stage .diagram-landscape [data-strand="a"]')
	const before = await strand.getAttribute('d')
	await page.waitForTimeout(200)
	assert.notEqual(await strand.getAttribute('d'), before)
	await pause.click()
	await page.waitForTimeout(150)
	const still = await strand.getAttribute('d')
	await page.waitForTimeout(200)
	assert.equal(await strand.getAttribute('d'), still)
	await page.setViewportSize({ width: 1080, height: 1920 })
	assert.ok(await page.locator('.helix-stage .diagram-portrait').isVisible())
	assert.equal(
		await page
			.getByRole('button', { name: 'Resume reading', exact: true })
			.getAttribute('aria-pressed'),
		'true'
	)
	await page.locator('.personal-map-intro').scrollIntoViewIfNeeded()
	await page.getByRole('button', { name: 'Explore connections' }).click()
	await page.locator('.personal-map-node[data-node-id="genome-agent"]').click()
	await page.setViewportSize({ width: 1440, height: 900 })
	await page.waitForFunction(() => document.querySelector('dialog').dataset.layout === 'landscape')
	assert.equal(
		await page.locator('.personal-map-node[aria-pressed="true"]').getAttribute('data-node-id'),
		'genome-agent'
	)
	await page.setViewportSize({ width: 375, height: 812 })
	await page.waitForFunction(() => document.querySelector('dialog').dataset.layout === 'portrait')
	assert.equal(
		await page.locator('.personal-map-node[aria-pressed="true"]').getAttribute('data-node-id'),
		'genome-agent'
	)
	console.log(
		'PASS rotation/resize: animation moves, pause holds, pause and selected map node survive landscape↔portrait without reload'
	)
	await page.keyboard.press('Escape')
	await page.goto(`${origin}/en/cv/`)
	const skills = page.locator('.skills-graph.diagram-portrait')
	await skills.scrollIntoViewIfNeeded()
	await page.locator('.skills-filter button').nth(1).click()
	await page.waitForTimeout(700)
	const skillFlow = await skills.evaluate(flowGeometry, { particle: '.sk-flux', wire: 'path' })
	assert.ok(skillFlow.length > 0)
	assert.ok(
		skillFlow.every((flow) => flow.animation === 'diagram-path-flow' && flow.error < 3),
		JSON.stringify(skillFlow)
	)
	const tool = page.locator('.bio-tools button').first()
	await tool.click()
	assert.equal(await tool.getAttribute('aria-pressed'), 'true')
	await page.setViewportSize({ width: 1440, height: 900 })
	assert.equal(await tool.getAttribute('aria-pressed'), 'true')
	assert.equal(
		await page.locator('.skills-filter button').nth(1).getAttribute('aria-pressed'),
		'true'
	)
	await page.setViewportSize({ width: 375, height: 812 })
	await page.goto(`${origin}/en/research/genome-agent/`)
	const loop = page.locator('.pipeline-figure .diagram-portrait')
	await loop.scrollIntoViewIfNeeded()
	await page.waitForFunction(() => document.querySelector('.pipeline').dataset.motion === 'full')
	await page.waitForTimeout(400)
	const loopFlow = await loop.evaluate(flowGeometry, {
		particle: '.pl-loop-pulse',
		wire: '.pl-loop-ring'
	})
	assert.ok(loopFlow.length === 1 && loopFlow[0].error < 3, JSON.stringify(loopFlow))
	// Isolated geometry fixture; it does NOT turn any real laboratory idea into traffic.
	await page.evaluate(() => {
		const host = document.createElement('div')
		host.className = 'lab-network'
		host.dataset.motion = 'full'
		host.dataset.testOnly = 'geometry-not-telemetry'
		host.style.width = '240px'
		const ns = 'http://www.w3.org/2000/svg'
		const svg = document.createElementNS(ns, 'svg')
		svg.id = 'motion-path-fixture'
		svg.setAttribute('viewBox', '0 0 240 240')
		const path = document.createElementNS(ns, 'path')
		path.setAttribute('class', 'ln-wire')
		path.setAttribute('d', 'M30 50 C150 50 100 180 220 180')
		const packet = document.createElementNS(ns, 'rect')
		for (const [key, value] of Object.entries({
			class: 'ln-packet',
			width: '7',
			height: '7',
			x: '-3.5',
			y: '-3.5'
		}))
			packet.setAttribute(key, value)
		packet.style.offsetPath = `path('${path.getAttribute('d')}')`
		svg.append(path, packet)
		host.append(svg)
		document.body.append(host)
	})
	await page.waitForTimeout(400)
	const packetFlow = await page
		.locator('#motion-path-fixture')
		.evaluate(flowGeometry, { particle: '.ln-packet', wire: '.ln-wire' })
	assert.ok(packetFlow.length === 1 && packetFlow[0].error < 3, JSON.stringify(packetFlow))
	console.log(
		'PASS motion geometry: particles follow their curves/ring; tool pin and selected area survive rotation'
	)
	await context.close()
	if (axeIssues.length) console.log('AXE ' + JSON.stringify(axeIssues))
	assert.deepEqual(axeIssues, [])
	console.log('PASS axe: all tested dialog layouts clean')
	console.log(`Screenshots: ${artifacts}`)
} catch (e) {
	console.error(e.stack)
	process.exitCode = 1
} finally {
	await browser?.close()
	try {
		process.kill(-server.pid, 'SIGTERM')
	} catch {}
}

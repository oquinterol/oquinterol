import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright')
const root = fileURLToPath(new URL('../', import.meta.url))
const port = String(process.env.LOCALE_PORT ?? 4324)
const base = `/${(process.env.LOCALE_BASE ?? '').replace(/^\/+|\/+$/g, '')}`.replace(/\/?$/, '/')
const origin = `http://127.0.0.1:${port}`
const url = (path = '') => `${origin}${base}${path}`
const previewArgs = ['exec', 'astro', 'preview', '--host', '127.0.0.1', '--port', port]
if (process.env.LOCALE_BASE) previewArgs.push('--base', base)
if (process.env.LOCALE_OUT_DIR) previewArgs.push('--outDir', process.env.LOCALE_OUT_DIR)
const server = spawn('pnpm', previewArgs, {
	cwd: root,
	detached: true,
	stdio: 'ignore'
})
let browser
let checks = 0
const errors = []
const pass = (label) => {
	checks++
	console.log(`PASS ${label}`)
}
const visit = async (page, path) => {
	try {
		await page.goto(url(path), { waitUntil: 'domcontentloaded' })
	} catch (error) {
		if (!/ERR_ABORTED|interrupted by another navigation/.test(error.message)) throw error
	}
}
try {
	for (let i = 0; i < 100; i++) {
		try {
			if ((await fetch(url())).ok) break
		} catch {}
		await new Promise((resolve) => setTimeout(resolve, 100))
	}
	browser = await chromium.launch({
		executablePath: process.env.BROWSER_EXECUTABLE,
		headless: true,
		args: ['--no-sandbox']
	})
	const context = await browser.newContext({
		locale: 'en-US',
		viewport: { width: 375, height: 812 }
	})
	const page = await context.newPage()
	// The preference must work without any external JS download or React hydration.
	await page.route('**/_astro/**', (route) =>
		/\.[cm]?js(?:\?|$)/.test(route.request().url()) ? route.abort() : route.continue()
	)
	await visit(page, '')
	assert.equal(page.url(), url())
	assert.ok(await page.locator('.language-gate').isVisible())
	assert.equal(await page.locator('.gate-choices a').count(), 2)
	assert.equal(await page.evaluate(() => localStorage.getItem('site.locale')), null)
	pass('first visit asks, even with an English browser; no inferred choice is saved')

	await page.locator('.gate-choices [data-language-choice="en"]').focus()
	await page.keyboard.press('Enter')
	await page.waitForURL(url('en/'))
	assert.equal(await page.evaluate(() => localStorage.getItem('site.locale')), 'en')
	const storedEnglish = await context.storageState()
	pass('explicit keyboard choice is saved before native navigation, without JS modules')

	await visit(page, '')
	await page.waitForURL(url('en/'))
	assert.equal(await page.locator('html').getAttribute('lang'), 'en')
	pass('returning visit bypasses the selector with inline head code')

	await page.locator('.language-switcher [data-language-choice="es"]').click()
	await page.waitForURL(url('es/'))
	assert.equal(await page.evaluate(() => localStorage.getItem('site.locale')), 'es')
	await visit(page, '')
	await page.waitForURL(url('es/'))
	pass('manual language switch updates the remembered choice')

	await visit(page, 'en/cv/')
	assert.equal(page.url(), url('en/cv/'))
	assert.equal(await page.locator('html').getAttribute('lang'), 'en')
	assert.equal(await page.evaluate(() => localStorage.getItem('site.locale')), 'es')
	pass('explicit locale/deep URL wins over storage, without silently changing the preference')

	await page.evaluate(() => localStorage.setItem('site.locale', 'https://example.invalid/'))
	await visit(page, '')
	assert.equal(page.url(), url())
	assert.ok(await page.locator('.language-gate').isVisible())
	pass('invalid storage values cannot cause redirects or break the selector')

	await page.evaluate(() => {
		localStorage.setItem('site.locale', 'en')
		window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }))
	})
	await page.waitForURL(url('en/'))
	pass('restoring the root from back/forward cache reuses the preference')
	await context.close()

	const returning = await browser.newContext({ storageState: storedEnglish })
	const returnPage = await returning.newPage()
	await visit(returnPage, '')
	await returnPage.waitForURL(url('en/'))
	pass('choice survives a new browser context via persistent storage, not sessionStorage')
	await returning.close()

	const blocked = await browser.newContext()
	await blocked.addInitScript(() => {
		Object.defineProperty(window, 'localStorage', {
			get() {
				throw new DOMException('Storage blocked', 'SecurityError')
			}
		})
	})
	const blockedPage = await blocked.newPage()
	blockedPage.on('pageerror', (error) => errors.push(error.message))
	await visit(blockedPage, '')
	assert.equal(blockedPage.url(), url())
	assert.ok(await blockedPage.locator('.language-gate').isVisible())
	await blockedPage.locator('.gate-choices [data-language-choice="es"]').click()
	await blockedPage.waitForURL(url('es/'))
	await visit(blockedPage, '')
	assert.ok(await blockedPage.locator('.language-gate').isVisible())
	pass('blocked storage keeps the selector and native navigation usable, without errors')
	await blocked.close()

	const noJs = await browser.newContext({ javaScriptEnabled: false, storageState: storedEnglish })
	const noJsPage = await noJs.newPage()
	await visit(noJsPage, '')
	assert.equal(noJsPage.url(), url())
	assert.ok(await noJsPage.locator('.language-gate').isVisible())
	await noJsPage.locator('.gate-choices [data-language-choice="en"]').click()
	await noJsPage.waitForURL(url('en/'))
	assert.equal(await noJsPage.locator('html').getAttribute('lang'), 'en')
	pass('without JS, remembered state does not hide the complete HTML selector')
	await noJs.close()
	assert.deepEqual(errors, [])
	console.log(`${checks} locale checks passed (${base})`)
} catch (error) {
	console.error(error.stack)
	process.exitCode = 1
} finally {
	await browser?.close()
	try {
		process.kill(-server.pid, 'SIGTERM')
	} catch {}
}

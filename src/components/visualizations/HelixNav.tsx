import React, { useEffect, useMemo, useRef, useState } from 'react'
import { complement } from '@/data/sequences'
import { useReducedMotion } from './useReducedMotion'

type Link = { id: string; label: string; href: string }

interface Props {
	links: readonly Link[]
	sequence: string
	gene: string
	organism: string
	accession: string
	sourceUrl: string
	copy: {
		label: string
		reading: string
		codon: string
		pause: string
		resume: string
		source: string
	}
}

// Geometry in viewBox units. Rung count is a multiple of 3 so the read head stays in frame.
const WIDTH = 1000
const HEIGHT = 230
const CY = 112
const AMPLITUDE = 64
const RUNGS = 42
const HEAD = 21
const TURNS = 2.6
const STEP = (WIDTH - 80) / (RUNGS - 1)
const NAV_RUNGS = [4, 13, 30, 38]
const TICK_MS = 900

const CODE = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG'
const AMINO: Record<string, string> = {
	A: 'Ala',
	R: 'Arg',
	N: 'Asn',
	D: 'Asp',
	C: 'Cys',
	Q: 'Gln',
	E: 'Glu',
	G: 'Gly',
	H: 'His',
	I: 'Ile',
	L: 'Leu',
	K: 'Lys',
	M: 'Met',
	F: 'Phe',
	P: 'Pro',
	S: 'Ser',
	T: 'Thr',
	W: 'Trp',
	Y: 'Tyr',
	V: 'Val',
	'*': 'Stop'
}
function translate(codon: string): string {
	const index = [...codon].reduce((acc, base) => acc * 4 + 'TCAG'.indexOf(base), 0)
	return AMINO[CODE[index] ?? ''] ?? '?'
}

function rungX(i: number) {
	return 40 + i * STEP
}

// Strand positions for a continuous rung coordinate, with local "unzipping" around open rungs.
function strands(t: number, phase: number, open: number[]) {
	const angle = (t / (RUNGS - 1)) * TURNS * Math.PI * 2 + phase
	const s = Math.sin(angle)
	// tanh keeps the opening direction continuous where the strands cross.
	const side = Math.tanh(s * 3)
	let bump = 0
	NAV_RUNGS.forEach((rung, k) => {
		bump += Math.exp(-((t - rung) ** 2) / 5) * (open[k] ?? 0) * 46
	})
	const a = CY + AMPLITUDE * s + side * bump
	const b = CY - AMPLITUDE * s - side * bump
	return { a, b, depth: Math.cos(angle) }
}

function strandPath(which: 'a' | 'b', phase: number, open: number[]) {
	let d = ''
	for (let t = 0; t <= RUNGS - 1; t += 0.25) {
		const p = strands(t, phase, open)
		d += `${t === 0 ? 'M' : 'L'}${rungX(t).toFixed(1)} ${p[which].toFixed(1)}`
	}
	return d
}

export default function HelixNav({
	links,
	sequence,
	gene,
	organism,
	accession,
	sourceUrl,
	copy
}: Props) {
	const reduced = useReducedMotion()
	const [offset, setOffset] = useState(0)
	const [paused, setPaused] = useState(false)
	const svgRef = useRef<SVGSVGElement>(null)
	const openTarget = useRef<number[]>(NAV_RUNGS.map(() => 0))
	const openNow = useRef<number[]>(NAV_RUNGS.map(() => 0))
	const [visible, setVisible] = useState(true)

	const initial = useMemo(() => {
		const closed = NAV_RUNGS.map(() => 0)
		return {
			a: strandPath('a', 0, closed),
			b: strandPath('b', 0, closed),
			rungs: Array.from({ length: RUNGS }, (_, i) => strands(i, 0, closed))
		}
	}, [])

	const moving = !reduced && !paused && visible

	// Pause everything while the hero is off screen or the tab is hidden.
	useEffect(() => {
		const svg = svgRef.current
		if (!svg) return
		const observer = new IntersectionObserver(([entry]) =>
			setVisible(Boolean(entry?.isIntersecting))
		)
		observer.observe(svg)
		const onVisibility = () => setVisible(!document.hidden)
		document.addEventListener('visibilitychange', onVisibility)
		return () => {
			observer.disconnect()
			document.removeEventListener('visibilitychange', onVisibility)
		}
	}, [])

	// The read head advances one codon per tick through the real coding sequence.
	useEffect(() => {
		if (!moving) return
		const timer = window.setInterval(() => {
			setOffset((current) => (current + 3 > sequence.length - RUNGS ? 0 : current + 3))
		}, TICK_MS)
		return () => window.clearInterval(timer)
	}, [moving, sequence.length])

	// Geometry loop: rotation plus easing of the unzip state. Writes attributes directly.
	useEffect(() => {
		const svg = svgRef.current
		if (!svg) return
		const pathA = svg.querySelector<SVGPathElement>('[data-strand="a"]')
		const pathB = svg.querySelector<SVGPathElement>('[data-strand="b"]')
		const rungs = [...svg.querySelectorAll<SVGGElement>('[data-rung]')]
		let phase = 0
		let frame = 0
		let last = performance.now()

		const draw = (now: number) => {
			const dt = Math.min(64, now - last)
			last = now
			if (moving) phase += dt * 0.00035
			let settling = false
			openNow.current = openNow.current.map((value, k) => {
				const target = openTarget.current[k] ?? 0
				const next = reduced ? target : value + (target - value) * Math.min(1, dt * 0.012)
				if (Math.abs(target - next) > 0.002) settling = true
				return next
			})
			const open = openNow.current
			pathA?.setAttribute('d', strandPath('a', phase, open))
			pathB?.setAttribute('d', strandPath('b', phase, open))
			rungs.forEach((group, i) => {
				const p = strands(i, phase, open)
				const line = group.querySelector('line')
				line?.setAttribute('y1', p.a.toFixed(1))
				line?.setAttribute('y2', p.b.toFixed(1))
				const [textA, textB] = group.querySelectorAll('text')
				textA?.setAttribute('y', (p.a + (p.a >= p.b ? 20 : -10)).toFixed(1))
				textB?.setAttribute('y', (p.b + (p.b > p.a ? 20 : -10)).toFixed(1))
				group.style.setProperty('--depth', ((p.depth + 1) / 2).toFixed(2))
			})
			if (moving || settling) frame = requestAnimationFrame(draw)
		}
		frame = requestAnimationFrame(draw)
		const wake = () => {
			cancelAnimationFrame(frame)
			last = performance.now()
			frame = requestAnimationFrame(draw)
		}
		svg.addEventListener('helix:open', wake)
		return () => {
			cancelAnimationFrame(frame)
			svg.removeEventListener('helix:open', wake)
		}
	}, [moving, reduced])

	const setOpen = (k: number, value: number) => {
		openTarget.current = openTarget.current.map((v, i) => (i === k ? value : v))
		svgRef.current?.dispatchEvent(new Event('helix:open'))
	}

	const window_ = sequence.slice(offset, offset + RUNGS)
	const codon = sequence.slice(offset + HEAD, offset + HEAD + 3)
	const codonNumber = (offset + HEAD) / 3 + 1

	return (
		<figure className='helix' aria-label={copy.label}>
			<div className='helix-readout'>
				<span className='helix-status' data-moving={moving}>
					{copy.reading} <strong>{gene}</strong> <em>{organism}</em> · pb {offset + 1}–
					{offset + RUNGS} / {sequence.length}
				</span>
				<span>
					{copy.codon} {codonNumber}: <strong>{codon}</strong> → {translate(codon)}
				</span>
				<a href={sourceUrl}>
					{copy.source} {accession} <span aria-hidden='true'>↗</span>
				</a>
				{!reduced && (
					<button type='button' onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
						{paused ? copy.resume : copy.pause}
					</button>
				)}
			</div>

			<div className='helix-stage'>
				<svg ref={svgRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} aria-hidden='true' focusable='false'>
					<rect
						className='helix-head'
						x={rungX(HEAD) - STEP / 2}
						y='14'
						width={STEP * 3}
						height={HEIGHT - 28}
						rx='6'
					/>
					<path data-strand='a' className='helix-strand helix-strand-a' d={initial.a} />
					<path data-strand='b' className='helix-strand helix-strand-b' d={initial.b} />
					{initial.rungs.map((p, i) => {
						const nav = NAV_RUNGS.indexOf(i)
						const base = window_[i] ?? 'N'
						return (
							<g
								key={i}
								data-rung={i}
								className={
									nav >= 0
										? 'helix-rung is-nav'
										: i >= HEAD && i < HEAD + 3
											? 'helix-rung is-head'
											: 'helix-rung'
								}
								style={{ ['--depth' as string]: ((p.depth + 1) / 2).toFixed(2) }}
							>
								<line x1={rungX(i)} x2={rungX(i)} y1={p.a} y2={p.b} />
								<text x={rungX(i)} y={p.a + (p.a >= p.b ? 20 : -10)}>
									{base}
								</text>
								<text x={rungX(i)} y={p.b + (p.b > p.a ? 20 : -10)}>
									{complement(base)}
								</text>
							</g>
						)
					})}
				</svg>

				<ol className='helix-links'>
					{links.map((link, k) => (
						<li
							key={link.id}
							style={{ ['--x' as string]: `${(rungX(NAV_RUNGS[k] ?? 0) / WIDTH) * 100}%` }}
						>
							<a
								href={link.href}
								onMouseEnter={() => setOpen(k, 1)}
								onMouseLeave={() => setOpen(k, 0)}
								onFocus={() => setOpen(k, 1)}
								onBlur={() => setOpen(k, 0)}
							>
								<span aria-hidden='true'>{String(k + 1).padStart(2, '0')}</span> {link.label}
							</a>
						</li>
					))}
				</ol>
			</div>
		</figure>
	)
}

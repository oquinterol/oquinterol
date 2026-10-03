import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

type Area = {
	id: string
	domain: string
	label: string
	scope: string
	tools: readonly string[]
	evidence: ReadonlyArray<{ href: string; title: string }>
}

interface Props {
	areas: readonly Area[]
	domains: Record<string, string>
	copy: { all: string; filter: string; tools: string; evidence: string }
}

// Conceptual links between areas (which work feeds which); drawn as metabolic "pathways".
const PATHWAYS: Array<[string, string]> = [
	['bioinformatics', 'systemsBiology'],
	['bioinformatics', 'workflows'],
	['programming', 'systemsBiology'],
	['programming', 'workflows'],
	['infrastructure', 'workflows'],
	['bioinformatics', 'programming']
]

const W = 900
const H = 330

type Point = { x: number; y: number }
type Positions = Record<string, Point & { anchor?: 'start' | 'end' | 'middle' }>

// Overview: every area as a small cluster. Focus: the chosen area spreads around the centre
// and the others fold into side columns, still linked by their pathways.
function layout(areas: readonly Area[], selected: string | null): Positions {
	const positions: Positions = {}
	if (selected === null) {
		areas.forEach((area, i) => {
			const hub = {
				x: 130 + i * ((W - 260) / Math.max(1, areas.length - 1)),
				y: H / 2 + (i % 2 ? 30 : -30)
			}
			positions[area.id] = hub
			area.tools.forEach((tool, j) => {
				const angle = (j / area.tools.length) * Math.PI * 2 - Math.PI / 2
				const radius = j % 2 ? 62 : 92
				positions[`${area.id}:${tool}`] = {
					x: hub.x + Math.cos(angle) * radius * 0.8,
					y: hub.y + Math.sin(angle) * radius
				}
			})
		})
		return positions
	}
	const others = areas.filter((area) => area.id !== selected)
	others.forEach((area, i) => {
		const left = i % 2 === 0
		const row = Math.floor(i / 2)
		positions[area.id] = { x: left ? 60 : W - 60, y: 95 + row * 140 }
		area.tools.forEach((tool) => {
			positions[`${area.id}:${tool}`] = positions[area.id]!
		})
	})
	const focus = areas.find((area) => area.id === selected)!
	const centre = { x: W / 2, y: H / 2 }
	positions[focus.id] = centre
	focus.tools.forEach((tool, j) => {
		const angle = (j / focus.tools.length) * Math.PI * 2 - Math.PI / 2
		const cos = Math.cos(angle)
		positions[`${focus.id}:${tool}`] = {
			x: centre.x + cos * 250,
			y: centre.y + Math.sin(angle) * 118,
			anchor: cos > 0.25 ? 'start' : cos < -0.25 ? 'end' : 'middle'
		}
	})
	return positions
}

const ease = (t: number) => 1 - (1 - t) ** 3

// Tweens between layouts so the reorganisation itself shows what changed.
function useTween(target: Positions, reduced: boolean): Positions {
	const [current, setCurrent] = useState(target)
	const from = useRef(target)
	useEffect(() => {
		if (reduced) {
			from.current = target
			setCurrent(target)
			return
		}
		const start = performance.now()
		const origin = from.current
		let frame = 0
		const step = (now: number) => {
			const t = ease(Math.min(1, (now - start) / 480))
			const next: Positions = {}
			for (const key of Object.keys(target)) {
				const a = origin[key] ?? target[key]!
				const b = target[key]!
				next[key] = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, anchor: b.anchor }
			}
			from.current = next
			setCurrent(next)
			if (t < 1) frame = requestAnimationFrame(step)
		}
		frame = requestAnimationFrame(step)
		return () => cancelAnimationFrame(frame)
	}, [target, reduced])
	return current
}

export default function SkillsNetwork({ areas, domains, copy }: Props) {
	const reduced = useReducedMotion()
	const [selected, setSelected] = useState<string | null>(null)
	const [hovered, setHovered] = useState<string | null>(null)
	const [hydrated, setHydrated] = useState(false)
	useEffect(() => setHydrated(true), [])
	const target = useMemo(() => layout(areas, selected), [areas, selected])
	const pos = useTween(target, reduced)
	const domainOf = Object.fromEntries(areas.map((area) => [area.id, area.domain]))

	const isLit = (areaId: string) => selected === null || selected === areaId
	const pathwayLit = ([a, b]: [string, string]) =>
		selected !== null && (a === selected || b === selected)

	return (
		<div className='skills-network' data-motion={reduced ? 'reduced' : 'full'}>
			{/* Filters only appear once they can work. */}
			<div className='skills-filter' role='group' aria-label={copy.filter} hidden={!hydrated}>
				<button type='button' aria-pressed={selected === null} onClick={() => setSelected(null)}>
					{copy.all}
				</button>
				{areas.map((area) => (
					<button
						key={area.id}
						type='button'
						data-domain={area.domain}
						aria-pressed={selected === area.id}
						onClick={() => setSelected(selected === area.id ? null : area.id)}
					>
						{area.label}
					</button>
				))}
			</div>

			<svg className='skills-graph' viewBox={`0 0 ${W} ${H}`} aria-hidden='true' focusable='false'>
				{PATHWAYS.map(([a, b]) => {
					const from = pos[a]
					const to = pos[b]
					if (!from || !to) return null
					const lit = pathwayLit([a, b])
					const [start, end] = selected === b ? [to, from] : [from, to]
					return (
						<g key={`${a}-${b}`} className='sk-pathway' data-lit={lit}>
							<line x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
							{lit && (
								<circle
									className='sk-flux'
									r='4'
									cx={start.x}
									cy={start.y}
									style={{
										['--dx' as string]: `${end.x - start.x}px`,
										['--dy' as string]: `${end.y - start.y}px`
									}}
								/>
							)}
						</g>
					)
				})}
				{areas.flatMap((area) =>
					area.tools.map((tool) => {
						const key = `${area.id}:${tool}`
						const hub = pos[area.id]!
						const p = pos[key]!
						const focused = selected === area.id
						const anchor = focused ? (p.anchor ?? 'middle') : 'middle'
						const dx = anchor === 'start' ? 10 : anchor === 'end' ? -10 : 0
						const dy = anchor === 'middle' ? (p.y < hub.y ? -11 : 20) : 4
						return (
							<g
								key={key}
								className='sk-tool'
								data-domain={area.domain}
								data-lit={isLit(area.id)}
								data-hover={hovered === key}
								onMouseEnter={() => setHovered(key)}
								onMouseLeave={() => setHovered(null)}
							>
								<line x1={hub.x} y1={hub.y} x2={p.x} y2={p.y} />
								<circle cx={p.x} cy={p.y} r='5' />
								{(focused || (selected === null && hovered === key)) && (
									<text x={p.x + dx} y={p.y + dy} textAnchor={anchor}>
										{tool}
									</text>
								)}
							</g>
						)
					})
				)}
				{areas.map((area) => {
					const p = pos[area.id]!
					const side = selected !== null && selected !== area.id
					const anchor = side ? (p.x < W / 2 ? 'start' : 'end') : 'middle'
					const x = side ? (anchor === 'start' ? p.x - 13 : p.x + 13) : p.x
					return (
						<g
							key={area.id}
							className='sk-hub'
							data-domain={area.domain}
							data-lit={isLit(area.id)}
							data-selected={selected === area.id}
							onClick={() => setSelected(selected === area.id ? null : area.id)}
						>
							<rect x={p.x - 13} y={p.y - 13} width='26' height='26' rx='7' />
							<text x={x} y={p.y + 34} textAnchor={anchor}>
								{area.label}
							</text>
						</g>
					)
				})}
			</svg>

			<ul className='bio-grid'>
				{areas.map((area, index) =>
					selected !== null && selected !== area.id ? null : (
						<li key={area.id} className='bio-module' data-domain={area.domain} id={area.id}>
							<p className='bio-module-meta'>
								<span>{String(index + 1).padStart(2, '0')}</span>
								<span className='bio-domain'>{domains[area.domain]}</span>
							</p>
							<h3>{area.label}</h3>
							<p className='bio-scope'>{area.scope}</p>
							<ul className='bio-tools' aria-label={`${copy.tools}: ${area.label}`}>
								{area.tools.map((tool) => (
									<li
										key={tool}
										data-hover={hovered === `${area.id}:${tool}`}
										onMouseEnter={() => setHovered(`${area.id}:${tool}`)}
										onMouseLeave={() => setHovered(null)}
									>
										{tool}
									</li>
								))}
							</ul>
							{area.evidence.map((item) => (
								<a key={item.href} className='bio-evidence' href={item.href}>
									<span aria-hidden='true'>→</span> {copy.evidence}: {item.title}
								</a>
							))}
						</li>
					)
				)}
			</ul>
		</div>
	)
}

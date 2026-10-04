import React, { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

type Step = { title: string; detail: string }
interface Props {
	schematic?: 'genome' | 'agent-loop'
	steps: readonly Step[]
	label: string
	schematicNote: string
	playLabel: string
	stopLabel: string
}
const STAGE_MS = 3800
function seeded(n: number) {
	const x = Math.sin(n * 9301 + 49297) * 233280
	return x - Math.floor(x)
}
const READS = Array.from({ length: 16 }, (_, i) => ({
	x: 30 + seeded(i) * 420,
	y: 40 + (i % 8) * 18,
	w: 60 + seeded(i + 40) * 90,
	delay: seeded(i + 80) * 2
}))
const GENES = [
	{ x: 70, w: 50 },
	{ x: 150, w: 80 },
	{ x: 270, w: 36 },
	{ x: 340, w: 70 },
	{ x: 450, w: 60 }
]
const NODES = [
	{ x: 120, y: 60 },
	{ x: 230, y: 40 },
	{ x: 330, y: 80 },
	{ x: 440, y: 50 },
	{ x: 170, y: 150 },
	{ x: 290, y: 170 },
	{ x: 410, y: 160 },
	{ x: 510, y: 120 }
]
const EDGES: Array<[number, number]> = [
	[0, 1],
	[1, 2],
	[2, 3],
	[0, 4],
	[4, 5],
	[2, 5],
	[5, 6],
	[6, 7],
	[3, 7],
	[1, 4]
]

function GenomeSchematic({ stage, vertical }: { stage: number; vertical: boolean }) {
	const points = vertical
		? NODES.map((n) => ({ x: 65 + (n.y - 40) * 1.7, y: 55 + (n.x - 120) * 1.05 }))
		: NODES
	return (
		<svg
			className={vertical ? 'diagram-portrait' : 'diagram-landscape'}
			viewBox={vertical ? '0 0 360 540' : '0 0 600 220'}
			aria-hidden='true'
			focusable='false'
			data-stage={stage}
		>
			<g className='pl-layer pl-reads' data-active={stage === 0}>
				{READS.map((r, i) => (
					<rect
						key={i}
						x={vertical ? 30 + seeded(i) * 160 : r.x}
						y={vertical ? 55 + i * 25 : r.y}
						width={vertical ? r.w * 0.85 : r.w}
						height={vertical ? 8 : 6}
						rx='3'
						style={{ animationDelay: `${r.delay}s` }}
					/>
				))}
			</g>
			<g className='pl-layer pl-assembly' data-active={stage === 1}>
				{READS.slice(0, 10).map((r, i) => (
					<rect
						key={i}
						x={vertical ? 125 + (i % 3) * 18 : 40 + i * 48}
						y={vertical ? 65 + i * 36 : 70 + (i % 3) * 14}
						width={vertical ? 8 : r.w * 0.8}
						height={vertical ? r.w * 0.6 : 6}
						rx='3'
						style={{ animationDelay: `${i * 0.08}s` }}
					/>
				))}
				<line
					className='pl-contig'
					x1={vertical ? 220 : 40}
					x2={vertical ? 220 : 560}
					y1={vertical ? 55 : 140}
					y2={vertical ? 475 : 140}
				/>
			</g>
			<g className='pl-layer pl-annotation' data-active={stage === 2}>
				<line
					className='pl-contig is-drawn'
					x1={vertical ? 180 : 40}
					x2={vertical ? 180 : 560}
					y1={vertical ? 55 : 110}
					y2={vertical ? 475 : 110}
				/>
				{GENES.map((g, i) => {
					const y = 55 + g.x * 0.75
					const length = g.w * 0.75
					const path = vertical
						? i % 2
							? `M184 ${y + 8} v${length - 8} h22 v${-(length - 8)} l-11 -8 z`
							: `M154 ${y} v${length - 8} l11 8 l11 -8 v${-(length - 8)} z`
						: i % 2
							? `M${g.x + 8} 114 h${g.w - 8} v18 h${-(g.w - 8)} l-8 -9 z`
							: `M${g.x} 88 h${g.w - 8} l8 9 l-8 9 h${-(g.w - 8)} z`
					return (
						<g key={i} style={{ animationDelay: `${i * 0.18}s` }} className='pl-gene'>
							<path d={path} />
						</g>
					)
				})}
			</g>
			<g className='pl-layer pl-network' data-active={stage === 3}>
				{EDGES.map(([from, to], i) => {
					const a = points[from]!,
						b = points[to]!
					return (
						<g key={i}>
							<line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
							<circle
								className='pl-flux'
								r='3'
								cx={a.x}
								cy={a.y}
								style={{
									['--dx' as string]: `${b.x - a.x}px`,
									['--dy' as string]: `${b.y - a.y}px`,
									animationDelay: `${(i % 4) * 0.45}s`
								}}
							/>
						</g>
					)
				})}
				{points.map((n, i) => (
					<circle key={i} className='pl-node' cx={n.x} cy={n.y} r={vertical ? 12 : 9} />
				))}
			</g>
		</svg>
	)
}

function LoopSchematic({
	steps,
	stage,
	vertical
}: {
	steps: readonly Step[]
	stage: number
	vertical: boolean
}) {
	const cx = vertical ? 180 : 300,
		cy = vertical ? 270 : 110
	const rx = vertical ? 115 : 82 * 2.1,
		ry = vertical ? 195 : 82
	const points = steps.map((_, i) => {
		const angle = (i / steps.length) * Math.PI * 2 - Math.PI / 2
		return { x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry }
	})
	const next = (stage + 1) % steps.length,
		from = points[stage]!,
		to = points[next]!
	return (
		<svg
			className={`pl-loop ${vertical ? 'diagram-portrait' : 'diagram-landscape'}`}
			viewBox={vertical ? '0 0 360 540' : '0 0 600 220'}
			aria-hidden='true'
			focusable='false'
		>
			<ellipse className='pl-loop-ring' cx={cx} cy={cy} rx={rx} ry={ry} />
			<text className='pl-loop-core' x={cx} y={cy - 4}>
				harness
			</text>
			<text className='pl-loop-core is-small' x={cx} y={cy + 20}>
				{vertical ? (
					<>
						<tspan x={cx}>policy · state</tspan>
						<tspan x={cx} dy='20'>
							provenance
						</tspan>
					</>
				) : (
					'policy · state · provenance'
				)}
			</text>
			{points.map((p, i) => (
				<g key={i} className='pl-loop-node' data-active={i === stage} data-next={i === next}>
					<circle cx={p.x} cy={p.y} r={vertical ? 20 : 15} />
					<text x={p.x} y={p.y + 5}>
						{String(i + 1).padStart(2, '0')}
					</text>
				</g>
			))}
			<circle
				key={stage}
				className='pl-flux pl-loop-pulse'
				r='5'
				cx={0}
				cy={0}
				style={{
					offsetPath: `path('M${from.x} ${from.y} A${rx} ${ry} 0 0 1 ${to.x} ${to.y}')`
				}}
			/>
		</svg>
	)
}

export default function PipelineExplorer({
	schematic = 'genome',
	steps,
	label,
	schematicNote,
	playLabel,
	stopLabel
}: Props) {
	const reduced = useReducedMotion()
	const [hydrated, setHydrated] = useState(false)
	const [active, setActive] = useState(0)
	const [playing, setPlaying] = useState(false)
	const timer = useRef<number | undefined>(undefined)
	useEffect(() => setHydrated(true), [])
	useEffect(() => {
		if (!playing) return
		timer.current = window.setTimeout(() => {
			if (active >= steps.length - 1) setPlaying(false)
			else setActive(active + 1)
		}, STAGE_MS)
		return () => window.clearTimeout(timer.current)
	}, [playing, active, steps.length])
	return (
		<div className='diagram-shell'>
			<div className='pipeline' data-motion={reduced ? 'reduced' : 'full'}>
				<ol className='pipeline-stages' aria-label={label}>
					{steps.map((step, index) => {
						const selected = index === active
						return (
							<li key={step.title} data-selected={selected} data-done={index < active}>
								{hydrated ? (
									<button
										type='button'
										aria-pressed={selected}
										onClick={() => {
											setPlaying(false)
											setActive(index)
										}}
									>
										<span>{String(index + 1).padStart(2, '0')}</span> {step.title}
									</button>
								) : (
									<p className='pipeline-stage-title'>
										<span>{String(index + 1).padStart(2, '0')}</span> {step.title}
									</p>
								)}
								<p className='pipeline-detail' hidden={hydrated && !selected}>
									{step.detail}
								</p>
							</li>
						)
					})}
				</ol>
				<figure className='pipeline-figure diagram-shell'>
					<div className='diagram-stage'>
						{[false, true].map((vertical) =>
							schematic === 'agent-loop' ? (
								<LoopSchematic
									key={String(vertical)}
									steps={steps}
									stage={active}
									vertical={vertical}
								/>
							) : (
								<GenomeSchematic key={String(vertical)} stage={active} vertical={vertical} />
							)
						)}
					</div>
					<figcaption>
						<span>{schematicNote}</span>
						{hydrated && (
							<button
								type='button'
								onClick={() => {
									if (!playing && active === steps.length - 1) setActive(0)
									setPlaying(!playing)
								}}
							>
								{playing ? stopLabel : playLabel}
							</button>
						)}
					</figcaption>
				</figure>
			</div>
		</div>
	)
}

import React, { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

type Step = { title: string; detail: string }

interface Props {
	steps: readonly Step[]
	label: string
	schematicNote: string
	playLabel: string
	stopLabel: string
}

const STAGE_MS = 3800

// Deterministic pseudo-random layout so server and client markup match.
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

function GenomeSchematic({ stage }: { stage: number }) {
	return (
		<svg viewBox='0 0 600 220' aria-hidden='true' focusable='false' data-stage={stage}>
			<g className='pl-layer pl-reads' data-active={stage === 0}>
				{READS.map((r, i) => (
					<rect
						key={i}
						x={r.x}
						y={r.y}
						width={r.w}
						height='6'
						rx='3'
						style={{ animationDelay: `${r.delay}s` }}
					/>
				))}
			</g>
			<g className='pl-layer pl-assembly' data-active={stage === 1}>
				{READS.slice(0, 10).map((r, i) => (
					<rect
						key={i}
						x={40 + i * 48}
						y={70 + (i % 3) * 14}
						width={r.w * 0.8}
						height='6'
						rx='3'
						style={{ animationDelay: `${i * 0.08}s` }}
					/>
				))}
				<line className='pl-contig' x1='40' x2='560' y1='140' y2='140' />
			</g>
			<g className='pl-layer pl-annotation' data-active={stage === 2}>
				<line className='pl-contig is-drawn' x1='40' x2='560' y1='110' y2='110' />
				{GENES.map((g, i) => (
					<g key={i} style={{ animationDelay: `${i * 0.18}s` }} className='pl-gene'>
						{/* Gene arrows show strand direction, as in a genome browser. */}
						<path
							d={
								i % 2
									? `M${g.x + 8} 114 h${g.w - 8} v18 h${-(g.w - 8)} l-8 -9 z`
									: `M${g.x} 88 h${g.w - 8} l8 9 l-8 9 h${-(g.w - 8)} z`
							}
						/>
					</g>
				))}
			</g>
			<g className='pl-layer pl-network' data-active={stage === 3}>
				{EDGES.map(([from, to], i) => {
					const a = NODES[from]!
					const b = NODES[to]!
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
				{NODES.map((n, i) => (
					<circle key={i} className='pl-node' cx={n.x} cy={n.y} r='9' />
				))}
			</g>
		</svg>
	)
}

export default function PipelineExplorer({
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

	// A user-started tour through the stages; it stops by itself at the last one.
	useEffect(() => {
		if (!playing) return
		timer.current = window.setTimeout(() => {
			if (active >= steps.length - 1) setPlaying(false)
			else setActive(active + 1)
		}, STAGE_MS)
		return () => window.clearTimeout(timer.current)
	}, [playing, active, steps.length])

	return (
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
							{/* Without JS every stage stays readable; with JS only the selected one expands. */}
							<p className='pipeline-detail' hidden={hydrated && !selected}>
								{step.detail}
							</p>
						</li>
					)
				})}
			</ol>
			<figure className='pipeline-figure'>
				<GenomeSchematic stage={active} />
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
	)
}

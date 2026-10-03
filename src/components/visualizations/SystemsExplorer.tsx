import React, { useEffect, useState } from 'react'

type System = { id: string; number: string; title: string; description: string }

interface Props {
	systems: readonly System[]
	label: string
	nextLabel: string
	exploreLabel: string
	backLabel: string
}

export default function SystemsExplorer({
	systems,
	label,
	nextLabel,
	exploreLabel,
	backLabel
}: Props) {
	const [hydrated, setHydrated] = useState(false)
	const [interactive, setInteractive] = useState(false)
	const [selected, setSelected] = useState(0)

	useEffect(() => setHydrated(true), [])

	// The complete sequence stays visible until the visitor explicitly chooses to explore.
	if (!interactive) {
		return (
			<div>
				<ol className='systems-list'>
					{systems.map((system) => (
						<li key={system.id} data-domain={system.id}>
							<span className='systems-number'>{system.number}</span>
							<div>
								<h3>{system.title}</h3>
								<p>{system.description}</p>
							</div>
						</li>
					))}
				</ol>
				{hydrated && (
					<button className='explore-toggle' type='button' onClick={() => setInteractive(true)}>
						{exploreLabel} ↗
					</button>
				)}
			</div>
		)
	}

	const active = systems[selected]
	const next = systems[(selected + 1) % systems.length]
	return (
		<div className='systems-explorer'>
			<button className='explore-back' type='button' onClick={() => setInteractive(false)}>
				← {backLabel}
			</button>
			<div className='systems-steps' role='group' aria-label={label}>
				{systems.map((system, index) => (
					<button
						key={system.id}
						data-domain={system.id}
						type='button'
						aria-pressed={index === selected}
						onClick={() => setSelected(index)}
					>
						<span>{system.number}</span> {system.title}
					</button>
				))}
			</div>
			{active && next && (
				<div className='systems-panel' data-domain={active.id} aria-live='polite'>
					<p className='eyebrow'>
						{active.number} / {systems.length.toString().padStart(2, '0')}
					</p>
					<h3>{active.title}</h3>
					<p>{active.description}</p>
					<p className='systems-next'>
						{nextLabel} <span aria-hidden='true'>→</span> {next.title}
					</p>
				</div>
			)}
		</div>
	)
}

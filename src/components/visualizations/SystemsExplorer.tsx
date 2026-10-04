import React, { useEffect, useId, useRef, useState } from 'react'
import PersonalMap from './PersonalMap'
import type { PersonalMapCopy, PersonalMapData } from '@/data/personal-map'

type System = { id: string; number: string; title: string; description: string }

interface Props {
	systems: readonly System[]
	exploreLabel: string
	graph: PersonalMapData
	copy: PersonalMapCopy
}

export default function SystemsExplorer({ systems, exploreLabel, graph, copy }: Props) {
	const [hydrated, setHydrated] = useState(false)
	const [open, setOpen] = useState(false)
	const triggerRef = useRef<HTMLButtonElement>(null)
	const id = useId()
	useEffect(() => setHydrated(true), [])

	const closeMap = () => {
		setOpen(false)
		triggerRef.current?.focus()
	}

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
			<div className='personal-map-intro'>
				<p className='eyebrow'>{copy.kicker}</p>
				<h3>{copy.title}</h3>
				<p>{copy.intro}</p>
				{hydrated && (
					<button
						ref={triggerRef}
						className='explore-toggle'
						type='button'
						aria-haspopup='dialog'
						onClick={() => setOpen(true)}
					>
						{exploreLabel} <span aria-hidden='true'>↗</span>
					</button>
				)}
				{/* The same nodes, statuses, sources, and reasons remain readable without JS. */}
				<details className='personal-map-reading'>
					<summary>{copy.reading}</summary>
					<p className='site-muted'>{copy.legend}</p>
					<ul className='map-reading-nodes'>
						{graph.nodes.map((node) => (
							<li key={node.id} id={`${id}-read-${node.id}`} data-domain={node.domain}>
								<p className='eyebrow'>{copy.kinds[node.kind]}</p>
								<h4>{node.label}</h4>
								{node.status && <p className='map-status'>{copy.statuses[node.status]}</p>}
								<p>{node.description}</p>
								{node.href && (
									<a className='text-link' href={node.href}>
										{copy.open} <span aria-hidden='true'>↗</span>
									</a>
								)}
							</li>
						))}
					</ul>
					<h4>{copy.connections}</h4>
					<ul className='map-reading-edges'>
						{graph.edges.map((edge) => {
							const source = graph.nodes.find((node) => node.id === edge.source)!
							const target = graph.nodes.find((node) => node.id === edge.target)!
							return (
								<li key={`${edge.source}:${edge.target}`}>
									<a href={`#${id}-read-${source.id}`}>{source.label}</a>
									{' ↔ '}
									<a href={`#${id}-read-${target.id}`}>{target.label}</a>
									<p>{edge.reason}</p>
								</li>
							)
						})}
					</ul>
				</details>
			</div>
			{open && <PersonalMap graph={graph} copy={copy} onClose={closeMap} />}
		</div>
	)
}

import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { PersonalMapCopy, PersonalMapData, PersonalMapNode } from '@/data/personal-map'
import { useDiagramLayout } from './useDiagramLayout'
import { personalMapLayout } from './personalMapLayout'

interface Props {
	graph: PersonalMapData
	copy: PersonalMapCopy
	onClose: () => void
}

const normalise = (value: string) =>
	value
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase()
const MIN_ZOOM = 0.65
const MAX_ZOOM = 1.4

// Native buttons provide the graph's interaction; the SVG only draws its relationships.
// No force simulation, autoplay, wheel interception, or drag-only controls.
export default function PersonalMap({ graph, copy, onClose }: Props) {
	const id = useId()
	const dialogRef = useRef<HTMLDialogElement>(null)
	const closeRef = useRef<HTMLButtonElement>(null)
	const viewportRef = useRef<HTMLDivElement>(null)
	const bodyRef = useRef<HTMLDivElement>(null)
	const focusRequest = useRef<string | null>(null)
	const [compact, setCompact] = useState(false)
	const [selected, setSelected] = useState('curiosity')
	const [view, setView] = useState<'map' | 'list'>('map')
	const [query, setQuery] = useState('')
	const [zoom, setZoom] = useState(MIN_ZOOM)
	const [centreRequest, setCentreRequest] = useState(0)
	const { ref: layoutRef, portrait } = useDiagramLayout()
	const layout = useMemo(() => personalMapLayout(graph.nodes, portrait), [graph.nodes, portrait])
	const [fitZoom, setFitZoom] = useState(MIN_ZOOM)
	const minimumZoom = portrait ? fitZoom : MIN_ZOOM
	const maximumZoom = portrait ? 2 : MAX_ZOOM

	useEffect(() => {
		const dialog = dialogRef.current
		if (!dialog) return
		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		const media = window.matchMedia('(max-width: 700px)')
		setCompact(media.matches)
		const resize = () => setCompact(media.matches)
		media.addEventListener('change', resize)
		dialog.showModal()
		closeRef.current?.focus()
		return () => {
			media.removeEventListener('change', resize)
			dialog.close()
			document.body.style.overflow = previousOverflow
		}
	}, [])

	useEffect(() => {
		bodyRef.current?.scrollTo({ top: 0, behavior: 'instant' })
	}, [view, centreRequest])

	useEffect(() => {
		const viewport = viewportRef.current
		if (!viewport || view !== 'map') return
		let previousWidth = -1
		const update = () => {
			if (viewport.clientWidth === previousWidth) return
			previousWidth = viewport.clientWidth
			const fit = portrait
				? Math.max(0.55, Math.min(1.1, (viewport.clientWidth - 16) / layout.width))
				: MIN_ZOOM
			setFitZoom(fit)
			setZoom(fit)
		}
		const observer = new ResizeObserver(update)
		observer.observe(viewport)
		update()
		return () => observer.disconnect()
	}, [portrait, view, layout.width])

	// A deliberately stable layout makes every relationship traceable. Native scroll works
	// with mouse, touch, keyboard, and browser zoom, including on small screens.
	useEffect(() => {
		const viewport = viewportRef.current
		if (!viewport || view !== 'map') return
		const centre = layout.nodes.find((node) => node.id === selected)!
		viewport.scrollTo({
			left: centre.x * zoom - viewport.clientWidth / 2,
			top: portrait && selected === 'curiosity' ? 0 : centre.y * zoom - viewport.clientHeight / 2,
			behavior: 'instant'
		})
	}, [zoom, view, centreRequest, portrait, layout, selected])

	const active = graph.nodes.find((node) => node.id === selected) ?? graph.nodes[0]!
	const connections = graph.edges
		.filter((edge) => edge.source === active.id || edge.target === active.id)
		.map((edge) => ({
			node: graph.nodes.find(
				(node) => node.id === (edge.source === active.id ? edge.target : edge.source)
			)!,
			reason: edge.reason
		}))
	const neighbours = new Set(connections.map(({ node }) => node.id))
	const search = normalise(query.trim())
	const matches = graph.nodes.filter((node) =>
		normalise(`${node.label} ${node.description}`).includes(search)
	)
	const positions = new Map(layout.nodes.map((node) => [node.id, node]))
	const inlineDetail = compact && view === 'list' && matches.some((node) => node.id === active.id)

	useEffect(() => {
		if (!focusRequest.current) return
		const target = dialogRef.current?.querySelector<HTMLButtonElement>(
			`[data-node-id="${focusRequest.current}"]`
		)
		target?.focus({ preventScroll: true })
		target?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' })
		focusRequest.current = null
	}, [selected, query, view])

	const selectNode = (node: PersonalMapNode, fromConnection = false) => {
		if (fromConnection) {
			focusRequest.current = node.id
			setQuery('')
		}
		setSelected(node.id)
		// Bring a connection selected from the reading panel into the map's visible region.
		const viewport = viewportRef.current
		if (!viewport || view !== 'map') return
		const point = positions.get(node.id)!
		const x = point.x * zoom
		const y = point.y * zoom
		const margin = 100 * zoom
		const left = viewport.scrollLeft
		const top = viewport.scrollTop
		if (
			x - margin < left ||
			x + margin > left + viewport.clientWidth ||
			y - margin < top ||
			y + margin > top + viewport.clientHeight
		) {
			viewport.scrollTo({
				left: x - viewport.clientWidth / 2,
				top: y - viewport.clientHeight / 2,
				behavior: 'instant'
			})
		}
	}

	const detail = (
		<section
			className='personal-map-detail'
			tabIndex={-1}
			id={`${id}-detail`}
			data-domain={active.domain}
			aria-label={copy.connections}
		>
			<div aria-live='polite' aria-atomic='true'>
				<p className='eyebrow'>{copy.kinds[active.kind]}</p>
				<h3>{active.label}</h3>
				{active.status && <p className='map-status'>{copy.statuses[active.status]}</p>}
				<p>{active.description}</p>
			</div>
			{active.href && (
				<a className='text-link' href={active.href}>
					{copy.open} <span aria-hidden='true'>↗</span>
				</a>
			)}
			<h4>{copy.connections}</h4>
			<ul className='map-connections'>
				{connections.map(({ node, reason }) => (
					<li key={node.id} data-domain={node.domain}>
						<button type='button' onClick={() => selectNode(node, true)}>
							<strong>
								{node.label} <span aria-hidden='true'>↗</span>
							</strong>
							<span>{reason}</span>
						</button>
					</li>
				))}
			</ul>
		</section>
	)

	return (
		<dialog
			ref={dialogRef}
			className='personal-map-dialog diagram-shell'
			data-layout={portrait ? 'portrait' : 'landscape'}
			aria-labelledby={`${id}-title`}
			aria-describedby={`${id}-hint`}
			onClose={onClose}
		>
			<div className='personal-map-shell'>
				<header className='personal-map-header'>
					<div>
						<p className='eyebrow'>Quintero-L, O. / {copy.kicker}</p>
						<h2 id={`${id}-title`}>{copy.title}</h2>
					</div>
					<button ref={closeRef} type='button' className='map-close' onClick={onClose}>
						{copy.close} <span aria-hidden='true'>×</span>
					</button>
				</header>

				<div className='personal-map-toolbar'>
					<div className='map-view-switch' role='group' aria-label={copy.view}>
						{(['map', 'list'] as const).map((mode) => (
							<button
								key={mode}
								type='button'
								aria-pressed={view === mode}
								onClick={() => {
									setView(mode)
									if (mode === 'map') setQuery('')
								}}
							>
								{copy[mode]}
							</button>
						))}
					</div>
					<label className='map-search'>
						<span className='map-visually-hidden'>{copy.search}</span>
						<input
							type='search'
							placeholder={copy.searchHint}
							value={query}
							onChange={(event) => {
								setQuery(event.target.value)
								if (event.target.value) setView('list')
							}}
						/>
					</label>
					<p className='map-count' role='status'>
						{matches.length} / {graph.nodes.length} {copy.nodes}
					</p>
				</div>
				<details className='personal-map-help'>
					<summary>{copy.help}</summary>
					<p className='personal-map-hint' id={`${id}-hint`}>
						{copy.hint}
					</p>
					<p className='personal-map-hint'>{copy.legend}</p>
				</details>

				<div
					className='personal-map-body diagram-stage'
					ref={(element) => {
						bodyRef.current = element
						layoutRef.current = element
					}}
				>
					<div className='personal-map-exploration'>
						{view === 'map' ? (
							<>
								<div className='map-zoom' role='group' aria-label={copy.zoom}>
									<button
										type='button'
										aria-label={copy.zoomOut}
										disabled={zoom <= minimumZoom}
										onClick={() => setZoom((value) => Math.max(minimumZoom, value - 0.15))}
									>
										−
									</button>
									<output aria-label={copy.zoom}>{Math.round(zoom * 100)}%</output>
									<button
										type='button'
										aria-label={copy.zoomIn}
										disabled={zoom >= maximumZoom}
										onClick={() => setZoom((value) => Math.min(maximumZoom, value + 0.15))}
									>
										+
									</button>
									<button
										type='button'
										aria-label={copy.reset}
										title={copy.reset}
										onClick={() => {
											setZoom(minimumZoom)
											setSelected('curiosity')
											setQuery('')
											setCentreRequest((value) => value + 1)
										}}
									>
										{portrait ? <span aria-hidden='true'>↺</span> : copy.reset}
									</button>
									{portrait && (
										<button
											type='button'
											className='map-read-selection'
											aria-label={copy.readSelection}
											title={copy.readSelection}
											onClick={() => {
												const detail =
													dialogRef.current?.querySelector<HTMLElement>('.personal-map-detail')
												detail?.scrollTo({ top: 0, behavior: 'instant' })
												detail?.focus({ preventScroll: true })
												detail?.scrollIntoView({ block: 'start', behavior: 'instant' })
											}}
										>
											{copy.details}
										</button>
									)}
								</div>
								<div
									className='personal-map-viewport'
									ref={viewportRef}
									role='region'
									aria-label={copy.map}
									tabIndex={0}
								>
									<div
										className='personal-map-canvas'
										style={{
											width: layout.width * zoom,
											height: layout.height * zoom,
											['--map-scale' as string]: zoom
										}}
									>
										<svg
											viewBox={`0 0 ${layout.width} ${layout.height}`}
											aria-hidden='true'
											focusable='false'
										>
											{graph.edges.map((edge) => {
												const from = positions.get(edge.source)!
												const to = positions.get(edge.target)!
												const lit = edge.source === selected || edge.target === selected
												return (
													<line
														key={`${edge.source}:${edge.target}`}
														className='personal-map-edge'
														data-lit={lit}
														data-domain={active.domain}
														x1={from.x}
														y1={from.y}
														x2={to.x}
														y2={to.y}
													/>
												)
											})}
										</svg>
										{layout.nodes.map((node) => (
											<button
												key={node.id}
												type='button'
												className='personal-map-node'
												data-node-id={node.id}
												data-kind={node.kind}
												data-domain={node.domain}
												data-status={node.status}
												data-connected={neighbours.has(node.id)}
												aria-pressed={selected === node.id}
												aria-controls={`${id}-detail`}
												style={{ left: node.x * zoom, top: node.y * zoom }}
												onClick={() => selectNode(node)}
											>
												<span className='map-node-mark' aria-hidden='true' />
												<strong>{node.label}</strong>
												{node.status && (
													<span className='map-node-status'>{copy.statuses[node.status]}</span>
												)}
											</button>
										))}
									</div>
								</div>
							</>
						) : (
							<div
								className='personal-map-list-region'
								role='region'
								aria-label={copy.list}
								tabIndex={0}
							>
								{matches.length === 0 && <p className='map-empty'>{copy.noResults}</p>}
								<ul className='personal-map-list'>
									{matches.map((node) => (
										<li key={node.id} data-domain={node.domain}>
											<button
												type='button'
												data-node-id={node.id}
												aria-expanded={compact ? node.id === selected : undefined}
												aria-pressed={node.id === selected}
												aria-controls={`${id}-detail`}
												onClick={() => selectNode(node)}
											>
												<span className='map-list-kind'>{copy.kinds[node.kind]}</span>
												<strong>{node.label}</strong>
												{node.status && (
													<span className='map-status'>{copy.statuses[node.status]}</span>
												)}
											</button>
											{inlineDetail && node.id === active.id && detail}
										</li>
									))}
								</ul>
							</div>
						)}
					</div>

					{!inlineDetail && detail}
				</div>
				<p className='personal-map-legend'>{copy.shortLegend}</p>
			</div>
		</dialog>
	)
}

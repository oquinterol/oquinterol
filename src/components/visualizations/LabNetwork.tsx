import React, { useEffect, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

type Status = 'idea' | 'prototype' | 'experimental' | 'active' | 'completed' | 'archived'
type Link = 'lora' | 'wifi' | 'tbd'
type Device = {
	id: string
	title: string
	summary: string
	status: Status
	link: Link
	href: string
}
interface Props {
	devices: readonly Device[]
	copy: {
		label: string
		gateway: string
		hub: string
		automations: string
		statuses: Record<Status, string>
		links: Record<Link, string>
		openProject: string
		legend: string
	}
}
const TRANSMITS: readonly Status[] = ['experimental', 'active', 'completed']

function lines(text: string, limit = 25) {
	const result: string[] = ['']
	for (const word of text.split(' ')) {
		const last = result.length - 1
		if (result[last] && result[last]!.length + word.length + 1 > limit) result.push(word)
		else result[last] += `${result[last] ? ' ' : ''}${word}`
	}
	return result
}

export default function LabNetwork({ devices, copy }: Props) {
	const reduced = useReducedMotion()
	const [hydrated, setHydrated] = useState(false)
	const [selected, setSelected] = useState<string | null>(null)
	useEffect(() => setHydrated(true), [])
	const active = devices.find((device) => device.id === selected)
	const horizontalHeight = Math.max(240, devices.length * 52 + 40)

	return (
		<div
			className='lab-network diagram-shell'
			data-motion={reduced ? 'reduced' : 'full'}
			data-has-selection={selected !== null}
		>
			<div className='diagram-stage'>
				{[false, true].map((vertical) => {
					const cy = horizontalHeight / 2
					const bottom = 80 + devices.length * 100
					const width = vertical ? 420 : 900
					const height = vertical ? bottom + 360 : horizontalHeight
					const gateway = { x: vertical ? 100 : 520, y: vertical ? bottom : cy }
					const hub = { x: vertical ? 100 : 700, y: vertical ? bottom + 120 : cy }
					const automation = { x: vertical ? 100 : 860, y: vertical ? bottom + 240 : cy }
					return (
						<svg
							key={String(vertical)}
							className={vertical ? 'diagram-portrait' : 'diagram-landscape'}
							viewBox={`0 0 ${width} ${height}`}
							aria-hidden='true'
							focusable='false'
						>
							<line className='ln-infra' x1={gateway.x} y1={gateway.y} x2={hub.x} y2={hub.y} />
							<line
								className='ln-infra'
								x1={hub.x}
								y1={hub.y}
								x2={automation.x}
								y2={automation.y}
							/>
							{devices.map((device, i) => {
								const point = {
									x: vertical ? 40 : 330,
									y: vertical ? 65 + i * 100 : cy + (i - (devices.length - 1) / 2) * 52
								}
								const target = device.link === 'wifi' ? hub : gateway
								const wire = vertical
									? `M${point.x} ${point.y} C20 ${point.y}, 20 ${target.y}, ${target.x} ${target.y}`
									: `M${point.x} ${point.y} C${point.x + 90} ${point.y}, ${target.x - 90} ${target.y}, ${target.x} ${target.y}`
								return (
									<g
										key={device.id}
										className='ln-device'
										data-status={device.status}
										data-link={device.link}
										data-selected={selected === device.id}
										onClick={() => setSelected(selected === device.id ? null : device.id)}
									>
										<path className='ln-wire' d={wire} />
										{TRANSMITS.includes(device.status) && (
											<rect
												className='ln-packet'
												width='7'
												height='7'
												rx='2'
												x={-3.5}
												y={-3.5}
												style={{
													offsetPath: `path('${wire}')`,
													animationDelay: `${i * 0.35}s`
												}}
											/>
										)}
										<circle className='ln-node' cx={point.x} cy={point.y} r={vertical ? 12 : 9} />
										{device.status === 'prototype' && (
											<circle className='ln-ping' cx={point.x} cy={point.y} r={vertical ? 12 : 9} />
										)}
										<text className='ln-label' x={vertical ? 70 : point.x - 20} y={point.y + 5}>
											{(vertical ? lines(device.title) : [device.title]).map((line, j) => (
												<tspan key={j} x={vertical ? 70 : point.x - 20} dy={j === 0 ? 0 : 22}>
													{line}
												</tspan>
											))}
										</text>
										<text
											className='ln-status'
											x={vertical ? 70 : point.x + 18}
											y={vertical ? point.y - 24 : point.y - 10}
										>
											{copy.statuses[device.status]}
										</text>
									</g>
								)
							})}
							{[
								{ point: gateway, label: copy.gateway, shape: 'gateway' },
								{ point: hub, label: copy.hub, shape: 'hub' },
								{ point: automation, label: copy.automations, shape: 'automation' }
							].map(({ point, label, shape }) => (
								<g key={shape} className='ln-hub'>
									{shape === 'gateway' ? (
										<path d={`M${point.x} ${point.y - 18} l16 28 h-32 z`} />
									) : shape === 'hub' ? (
										<rect x={point.x - 20} y={point.y - 20} width='40' height='40' rx='10' />
									) : (
										<circle cx={point.x} cy={point.y} r='12' />
									)}
									<text
										className={!vertical && shape === 'automation' ? 'is-end' : undefined}
										x={vertical ? 145 : shape === 'automation' ? point.x + 14 : point.x}
										y={
											vertical ? point.y + 5 : shape === 'automation' ? point.y - 24 : point.y + 40
										}
									>
										{(vertical ? lines(label, 22) : [label]).map((line, j) => (
											<tspan
												key={j}
												x={vertical ? 145 : shape === 'automation' ? point.x + 14 : point.x}
												dy={j === 0 ? 0 : 23}
											>
												{line}
											</tspan>
										))}
									</text>
								</g>
							))}
						</svg>
					)
				})}
			</div>
			<p className='ln-legend'>{copy.legend}</p>
			<ul className='ln-list' aria-label={copy.label}>
				{devices.map((device) => (
					<li key={device.id} data-status={device.status}>
						{hydrated ? (
							<button
								type='button'
								aria-pressed={selected === device.id}
								onClick={() => setSelected(selected === device.id ? null : device.id)}
							>
								<span className='ln-badge'>{copy.statuses[device.status]}</span> {device.title}
							</button>
						) : (
							<a href={device.href}>
								<span className='ln-badge'>{copy.statuses[device.status]}</span> {device.title}
							</a>
						)}
					</li>
				))}
			</ul>
			<div className='ln-detail' aria-live='polite'>
				{active && (
					<>
						<p className='eyebrow'>
							{copy.statuses[active.status]} · {copy.links[active.link]}
						</p>
						<h3>{active.title}</h3>
						<p>{active.summary}</p>
						<a className='text-link' href={active.href}>
							{copy.openProject} <span aria-hidden='true'>↗</span>
						</a>
					</>
				)}
			</div>
		</div>
	)
}

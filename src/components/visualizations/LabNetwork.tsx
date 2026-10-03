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

// Only devices that really send data get packets; ideas stay as blueprints.
const TRANSMITS: readonly Status[] = ['experimental', 'active', 'completed']

const ROW = 52
const DEVICE_X = 330
const GATEWAY = { x: 520 }
const HUB = { x: 700 }
const AUTO = { x: 860 }

export default function LabNetwork({ devices, copy }: Props) {
	const reduced = useReducedMotion()
	const [hydrated, setHydrated] = useState(false)
	const [selected, setSelected] = useState<string | null>(null)
	useEffect(() => setHydrated(true), [])

	const height = Math.max(240, devices.length * ROW + 40)
	const cy = height / 2
	const rowY = (i: number) => cy + (i - (devices.length - 1) / 2) * ROW
	const active = devices.find((device) => device.id === selected)

	return (
		<div
			className='lab-network'
			data-motion={reduced ? 'reduced' : 'full'}
			data-has-selection={selected !== null}
		>
			<svg viewBox={`0 0 900 ${height}`} aria-hidden='true' focusable='false'>
				{/* Infrastructure that already exists: gateway → hub → automations. */}
				<line className='ln-infra' x1={GATEWAY.x} y1={cy} x2={HUB.x} y2={cy} />
				<line className='ln-infra' x1={HUB.x} y1={cy} x2={AUTO.x} y2={cy} />
				{devices.map((device, i) => {
					const y = rowY(i)
					const target = device.link === 'wifi' ? HUB : GATEWAY
					const transmits = TRANSMITS.includes(device.status)
					return (
						<g
							key={device.id}
							className='ln-device'
							data-status={device.status}
							data-link={device.link}
							data-selected={selected === device.id}
							onClick={() => setSelected(selected === device.id ? null : device.id)}
						>
							<path
								className='ln-wire'
								d={`M${DEVICE_X} ${y} C${DEVICE_X + 90} ${y}, ${target.x - 90} ${cy}, ${target.x} ${cy}`}
							/>
							{transmits && (
								<rect
									className='ln-packet'
									width='7'
									height='7'
									rx='2'
									x={DEVICE_X - 3.5}
									y={y - 3.5}
									style={{
										['--dx' as string]: `${target.x - DEVICE_X}px`,
										['--dy' as string]: `${cy - y}px`,
										animationDelay: `${i * 0.35}s`
									}}
								/>
							)}
							<circle className='ln-node' cx={DEVICE_X} cy={y} r='9' />
							{device.status === 'prototype' && (
								<circle className='ln-ping' cx={DEVICE_X} cy={y} r='9' />
							)}
							<text className='ln-label' x={DEVICE_X - 20} y={y + 5}>
								{device.title}
							</text>
							<text className='ln-status' x={DEVICE_X + 18} y={y - 10}>
								{copy.statuses[device.status]}
							</text>
						</g>
					)
				})}
				<g className='ln-hub'>
					<path d={`M${GATEWAY.x} ${cy - 18} l16 28 h-32 z`} />
					<text x={GATEWAY.x} y={cy + 34}>
						{copy.gateway}
					</text>
				</g>
				<g className='ln-hub'>
					<rect x={HUB.x - 20} y={cy - 20} width='40' height='40' rx='10' />
					<text x={HUB.x} y={cy + 40}>
						{copy.hub}
					</text>
				</g>
				<g className='ln-hub'>
					<circle cx={AUTO.x} cy={cy} r='12' />
					<text className='is-end' x={AUTO.x + 14} y={cy - 24}>
						{copy.automations}
					</text>
				</g>
			</svg>

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

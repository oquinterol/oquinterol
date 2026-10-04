import { MAP_HEIGHT, MAP_WIDTH, type PersonalMapNode } from '@/data/personal-map'

// A portrait composition, not a rotated/scaled desktop map: question → perspectives →
// ways of exploring → research/tools → lab. Edges retain their conceptual meaning.
const PORTRAIT: Record<string, [number, number]> = {
	curiosity: [240, 95],
	biology: [125, 270],
	programming: [355, 270],
	electronics: [125, 455],
	everyday: [355, 455],
	metabolism: [125, 650],
	models: [355, 650],
	measurements: [125, 835],
	reproducibility: [355, 835],
	'phureja-genome': [125, 1030],
	'phureja-rnaseq-pipeline': [355, 1030],
	'vector-editor': [125, 1220],
	'genome-agent': [355, 1220],
	'connected-lab': [240, 1415],
	photobioreactor: [125, 1600],
	'plant-monitor': [355, 1600],
	'connected-dna-quantifier': [125, 1790],
	'connected-thermocycler': [355, 1790],
	'connected-flow-hood': [125, 1980],
	'shaking-incubator': [355, 1980]
}

export function personalMapLayout(nodes: readonly PersonalMapNode[], portrait: boolean) {
	if (!portrait) return { width: MAP_WIDTH, height: MAP_HEIGHT, nodes }
	let extra = 0
	const positioned = nodes.map((node) => {
		const point = PORTRAIT[node.id] ?? [
			extra % 2 === 0 ? 125 : 355,
			2170 + Math.floor(extra++ / 2) * 190
		]
		return { ...node, x: point[0]!, y: point[1]! }
	})
	return {
		width: 480,
		height: Math.max(0, ...positioned.map((node) => node.y)) + 120,
		nodes: positioned
	}
}

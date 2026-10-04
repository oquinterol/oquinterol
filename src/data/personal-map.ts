import { localizedPath } from '@/i18n/routing'
import { ui, type Locale } from '@/i18n/ui'

export type MapDomain = 'biological' | 'computational' | 'intelligent' | 'physical'
export type MapKind = 'question' | 'perspective' | 'method' | 'research' | 'tool' | 'project'
export type MapStatus = keyof typeof ui.es.lab.statuses | 'development'
type Translation = Record<Locale, string>

export interface PersonalMapNode {
	id: string
	label: string
	description: string
	kind: MapKind
	domain?: MapDomain
	status?: MapStatus
	href?: string
	x: number
	y: number
}

export interface PersonalMapEdge {
	source: string
	target: string
	reason: string
}

export interface PersonalMapData {
	nodes: PersonalMapNode[]
	edges: PersonalMapEdge[]
}

export const MAP_WIDTH = 1280
export const MAP_HEIGHT = 930

export const personalMapCopy = {
	es: {
		kicker: 'Lo que conecta todo',
		title: 'Un mapa de cómo pienso',
		intro:
			'Me mueve comprender cómo funcionan los sistemas que me rodean. La vida, la informática y los procesos cotidianos son misterios que me gusta explorar. Mi formación en biología se cruza con la programación y la electrónica en esa búsqueda.',
		reading: 'Leer las ideas y sus conexiones',
		close: 'Cerrar mapa',
		map: 'Mapa',
		list: 'Lista',
		view: 'Forma de explorar',
		search: 'Buscar en el mapa',
		searchHint: 'Una idea, un proyecto, una pregunta…',
		nodes: 'nodos',
		noResults: 'No hay coincidencias. Prueba otra palabra o borra la búsqueda.',
		hint: 'Elige un nodo y sigue sus conexiones. Puedes desplazarte por el mapa o leerlo como lista.',
		legend:
			'Una pregunta central, distintas maneras de explorar. Las líneas son relaciones conceptuales, no dependencias técnicas ni resultados experimentales.',
		connections: 'Se conecta con',
		open: 'Explorar en el sitio',
		zoomIn: 'Acercar',
		zoomOut: 'Alejar',
		reset: 'Volver al centro',
		readSelection: 'Detalles del nodo seleccionado',
		details: 'Detalles',
		help: 'Cómo leer el mapa',
		shortLegend: 'Relaciones conceptuales, no resultados experimentales.',
		zoom: 'Escala del mapa',
		kinds: {
			question: 'Pregunta personal',
			perspective: 'Perspectiva',
			method: 'Forma de explorar',
			research: 'Investigación documentada',
			tool: 'Herramienta',
			project: 'Proyecto de laboratorio'
		},
		statuses: { ...ui.es.lab.statuses, development: 'En desarrollo' }
	},
	en: {
		kicker: 'What connects it all',
		title: 'A map of how I think',
		intro:
			'I am driven by understanding how the systems around me work. Life, computing, and everyday processes are mysteries I enjoy exploring. My background in biology meets programming and electronics in that search.',
		reading: 'Read the ideas and their connections',
		close: 'Close map',
		map: 'Map',
		list: 'List',
		view: 'Way to explore',
		search: 'Search the map',
		searchHint: 'An idea, a project, a question…',
		nodes: 'nodes',
		noResults: 'No matches. Try another word or clear the search.',
		hint: 'Choose a node and follow its connections. Scroll through the map or read it as a list.',
		legend:
			'One central question, different ways to explore. Lines are conceptual relationships, not technical dependencies or experimental results.',
		connections: 'Connects with',
		open: 'Explore on the site',
		zoomIn: 'Zoom in',
		zoomOut: 'Zoom out',
		reset: 'Back to the centre',
		readSelection: 'Details of selected node',
		details: 'Details',
		help: 'How to read the map',
		shortLegend: 'Conceptual connections, not experimental results.',
		zoom: 'Map scale',
		kinds: {
			question: 'Personal question',
			perspective: 'Perspective',
			method: 'Way to explore',
			research: 'Documented research',
			tool: 'Tool',
			project: 'Lab project'
		},
		statuses: { ...ui.en.lab.statuses, development: 'In development' }
	}
} as const

export type PersonalMapCopy = (typeof personalMapCopy)[Locale]

interface NodeDefinition {
	id: string
	label: Translation
	description: Translation
	kind: MapKind
	domain?: MapDomain
	x: number
	y: number
}

// The personal narrative is based on the owner's account, not inferred from tool usage.
// Positions are an editorial layout, not measured distances or scientific data.
const perspectives: readonly NodeDefinition[] = [
	{
		id: 'curiosity',
		label: { es: 'Comprender sistemas', en: 'Understanding systems' },
		description: {
			es: personalMapCopy.es.intro,
			en: personalMapCopy.en.intro
		},
		kind: 'question',
		x: 640,
		y: 450
	},
	{
		id: 'biology',
		label: { es: 'Vida y biología', en: 'Life and biology' },
		description: {
			es: 'Mi formación en biología es un punto de partida para explorar la vida: de las secuencias y los organismos a las relaciones que los hacen funcionar.',
			en: 'My background in biology is a starting point for exploring life: from sequences and organisms to the relationships that make them work.'
		},
		kind: 'perspective',
		domain: 'biological',
		x: 340,
		y: 285
	},
	{
		id: 'programming',
		label: { es: 'Código y computación', en: 'Code and computing' },
		description: {
			es: 'La programación es otra forma de explorar sistemas: transformar datos, probar procedimientos y construir herramientas para hacer preguntas biológicas.',
			en: 'Programming is another way to explore systems: transform data, test procedures, and build tools for asking biological questions.'
		},
		kind: 'perspective',
		domain: 'computational',
		x: 940,
		y: 285
	},
	{
		id: 'electronics',
		label: { es: 'Electrónica y medición', en: 'Electronics and measurement' },
		description: {
			es: 'Me interesa explorar la electrónica para entender cómo sensores, instrumentos y controladores conectan lo que ocurre en el mundo físico con los datos y el código.',
			en: 'I am interested in exploring electronics to understand how sensors, instruments, and controllers connect what happens in the physical world with data and code.'
		},
		kind: 'perspective',
		domain: 'physical',
		x: 340,
		y: 625
	},
	{
		id: 'everyday',
		label: { es: 'Sistemas cotidianos', en: 'Everyday systems' },
		description: {
			es: 'La curiosidad no se queda en el laboratorio. También está en los procesos que me rodean cada día: observarlos y preguntarme cómo funcionan es parte de esa misma búsqueda.',
			en: 'Curiosity does not stay in the lab. It is also about the processes around me each day: observing them and asking how they work is part of the same search.'
		},
		kind: 'perspective',
		domain: 'physical',
		x: 940,
		y: 625
	},
	{
		id: 'models',
		label: { es: 'Modelos y agentes', en: 'Models and agents' },
		description: {
			es: 'Los modelos permiten representar partes de un sistema y examinar su comportamiento. Los agentes científicos abren otra pregunta: cómo planificar, evaluar y revisar un análisis sin perder sus límites ni su trazabilidad.',
			en: 'Models let us represent parts of a system and examine its behaviour. Scientific agents open another question: how to plan, evaluate, and revise an analysis without losing its limits or traceability.'
		},
		kind: 'method',
		domain: 'intelligent',
		x: 640,
		y: 180
	},
	{
		id: 'metabolism',
		label: { es: 'Redes metabólicas', en: 'Metabolic networks' },
		description: {
			es: 'La biología de sistemas conecta genes, reacciones y flujos. La reconstrucción metabólica de mi tesis es una forma concreta de estudiar esas relaciones a escala genómica.',
			en: 'Systems biology connects genes, reactions, and fluxes. The metabolic reconstruction in my thesis is a concrete way to study those relationships at genome scale.'
		},
		kind: 'method',
		domain: 'biological',
		x: 390,
		y: 110
	},
	{
		id: 'reproducibility',
		label: { es: 'Flujos reproducibles', en: 'Reproducible workflows' },
		description: {
			es: 'Comprender un análisis también exige poder recorrerlo otra vez: código versionado, entornos definidos y pasos documentados que conectan los datos con los resultados.',
			en: 'Understanding an analysis also means being able to follow it again: versioned code, defined environments, and documented steps connecting data with results.'
		},
		kind: 'method',
		domain: 'computational',
		x: 1130,
		y: 450
	},
	{
		id: 'measurements',
		label: { es: 'Del fenómeno al dato', en: 'From phenomena to data' },
		description: {
			es: 'Medir conecta un fenómeno con una pregunta que podemos estudiar. Las ideas del laboratorio exploran cómo registrar condiciones y observaciones para después interpretarlas.',
			en: 'Measurement connects a phenomenon with a question we can study. The lab ideas explore how to record conditions and observations so they can be interpreted.'
		},
		kind: 'method',
		domain: 'physical',
		x: 640,
		y: 730
	}
]

interface ContentNodeDefinition {
	id: string
	label: Translation
	x: number
	y: number
}

const researchNodes: readonly ContentNodeDefinition[] = [
	{
		id: 'phureja-genome',
		label: { es: 'Genoma de papa criolla', en: 'Andean potato genome' },
		x: 130,
		y: 110
	},
	{
		id: 'phureja-rnaseq-pipeline',
		label: { es: 'Pipeline de RNA-seq', en: 'RNA-seq pipeline' },
		x: 140,
		y: 450
	},
	{
		id: 'genome-agent',
		label: { es: 'GenomeAgent', en: 'GenomeAgent' },
		x: 1140,
		y: 110
	}
]

const labNodes: readonly ContentNodeDefinition[] = [
	{
		id: 'photobioreactor',
		label: { es: 'Fotobiorreactor', en: 'Photobioreactor' },
		x: 120,
		y: 800
	},
	{
		id: 'plant-monitor',
		label: { es: 'Monitor de plantas', en: 'Plant monitor' },
		x: 370,
		y: 825
	},
	{
		id: 'connected-dna-quantifier',
		label: { es: 'Cuantificador de ADN', en: 'DNA quantifier' },
		x: 1150,
		y: 625
	},
	{
		id: 'connected-thermocycler',
		label: { es: 'Termociclador conectado', en: 'Connected thermocycler' },
		x: 1150,
		y: 810
	},
	{
		id: 'connected-flow-hood',
		label: { es: 'Cabina de flujo', en: 'Flow hood' },
		x: 100,
		y: 625
	},
	{
		id: 'shaking-incubator',
		label: { es: 'Incubadora con agitación', en: 'Shaking incubator' },
		x: 640,
		y: 870
	}
]

interface EdgeDefinition {
	source: string
	target: string
	reason: Translation
}

const connection = (source: string, target: string, es: string, en: string): EdgeDefinition => ({
	source,
	target,
	reason: { es, en }
})

// Curated conceptual relationships, not an automatically inferred dependency graph.
const relationships: readonly EdgeDefinition[] = [
	connection(
		'curiosity',
		'biology',
		'La vida es uno de los sistemas que quiero comprender.',
		'Life is one of the systems I want to understand.'
	),
	connection(
		'curiosity',
		'programming',
		'La informática es otro de los misterios que me gusta explorar.',
		'Computing is another of the mysteries I enjoy exploring.'
	),
	connection(
		'curiosity',
		'electronics',
		'Explorar la electrónica me acerca a cómo funciona el mundo físico.',
		'Exploring electronics brings me closer to how the physical world works.'
	),
	connection(
		'curiosity',
		'everyday',
		'Esa misma curiosidad parte de los procesos que me rodean cada día.',
		'The same curiosity starts with the processes around me every day.'
	),
	connection(
		'biology',
		'programming',
		'La bioinformática une preguntas biológicas con métodos computacionales.',
		'Bioinformatics joins biological questions with computational methods.'
	),
	connection(
		'programming',
		'electronics',
		'El código y los controladores permiten leer sensores y actuar sobre instrumentos.',
		'Code and controllers make it possible to read sensors and act on instruments.'
	),
	connection(
		'electronics',
		'everyday',
		'La electrónica es una vía para explorar procesos físicos cotidianos.',
		'Electronics is a way to explore everyday physical processes.'
	),
	connection(
		'biology',
		'metabolism',
		'Las redes metabólicas describen relaciones entre reacciones de un organismo.',
		'Metabolic networks describe relationships between reactions in an organism.'
	),
	connection(
		'metabolism',
		'models',
		'La reconstrucción metabólica representa un sistema como un modelo de reacciones y flujos.',
		'Metabolic reconstruction represents a system as a model of reactions and fluxes.'
	),
	connection(
		'models',
		'programming',
		'El cómputo permite simular modelos y ejecutar ciclos de planificación y evaluación.',
		'Computing lets us simulate models and run planning and evaluation loops.'
	),
	connection(
		'programming',
		'reproducibility',
		'Los procedimientos computacionales necesitan pasos y entornos que se puedan repetir.',
		'Computational procedures need steps and environments that can be repeated.'
	),
	connection(
		'electronics',
		'measurements',
		'Los sensores e instrumentos convierten observaciones físicas en registros.',
		'Sensors and instruments turn physical observations into records.'
	),
	connection(
		'measurements',
		'biology',
		'Las mediciones permiten estudiar organismos y sus condiciones.',
		'Measurements let us study organisms and their conditions.'
	),
	connection(
		'measurements',
		'reproducibility',
		'Registrar cómo se obtuvo un dato permite interpretar y revisar el análisis.',
		'Recording how data were obtained makes it possible to interpret and review an analysis.'
	),
	connection(
		'phureja-genome',
		'biology',
		'Mi tesis aborda el ensamblaje y la anotación del genoma de papa criolla.',
		'My thesis addresses assembly and annotation of the Andean potato genome.'
	),
	connection(
		'phureja-genome',
		'metabolism',
		'La tesis conecta el genoma anotado con la reconstrucción de un modelo metabólico.',
		'The thesis connects the annotated genome with reconstruction of a metabolic model.'
	),
	connection(
		'phureja-rnaseq-pipeline',
		'biology',
		'El trabajo de grado estudia datos de RNA-seq de papa criolla.',
		'The undergraduate thesis studies RNA-seq data from Andean potato.'
	),
	connection(
		'phureja-rnaseq-pipeline',
		'reproducibility',
		'El pipeline organiza los pasos de procesamiento de RNA-seq.',
		'The pipeline organises the RNA-seq processing steps.'
	),
	connection(
		'phureja-rnaseq-pipeline',
		'programming',
		'El análisis convierte procedimientos repetitivos en un flujo computacional.',
		'The analysis turns repetitive procedures into a computational workflow.'
	),
	connection(
		'vector-editor',
		'biology',
		'La herramienta permite explorar cortes, extremos y ligación de secuencias.',
		'The tool lets us explore cuts, ends, and sequence ligation.'
	),
	connection(
		'vector-editor',
		'programming',
		'La simulación y la visualización se ejecutan en el navegador.',
		'Simulation and visualisation run in the browser.'
	),
	connection(
		'genome-agent',
		'models',
		'GenomeAgent explora planificación y evaluación de estrategias de ensamblaje.',
		'GenomeAgent explores planning and evaluation of assembly strategies.'
	),
	connection(
		'genome-agent',
		'reproducibility',
		'El harness controla recursos, validación y procedencia del análisis.',
		'The harness controls resources, validation, and analysis provenance.'
	),
	connection(
		'genome-agent',
		'biology',
		'La pregunta de investigación es cómo ensamblar un genoma bajo límites de recursos.',
		'The research question is how to assemble a genome under resource constraints.'
	),
	connection(
		'connected-lab',
		'electronics',
		'Los proyectos exploran instrumentos y controladores conectados.',
		'The projects explore connected instruments and controllers.'
	),
	connection(
		'connected-lab',
		'everyday',
		'El laboratorio traslada preguntas sobre procesos físicos a proyectos concretos.',
		'The lab brings questions about physical processes into concrete projects.'
	),
	connection(
		'connected-lab',
		'measurements',
		'Registrar condiciones y lecturas es un hilo común de las ideas del laboratorio.',
		'Recording conditions and readings is a shared thread of the lab ideas.'
	),
	connection(
		'photobioreactor',
		'biology',
		'La idea parte del cultivo de microalgas y cianobacterias.',
		'The idea starts with culturing microalgae and cyanobacteria.'
	),
	connection(
		'photobioreactor',
		'electronics',
		'Se propone medir la luz y regular LED según las condiciones del cultivo.',
		'It proposes measuring light and adjusting LEDs to the culture conditions.'
	),
	connection(
		'plant-monitor',
		'biology',
		'La idea busca observar las condiciones del sustrato de las plantas.',
		'The idea seeks to observe plant substrate conditions.'
	),
	connection(
		'plant-monitor',
		'everyday',
		'El cuidado de plantas conecta una pregunta cotidiana con sensores y avisos.',
		'Caring for plants connects an everyday question with sensors and alerts.'
	)
]

interface ResearchInput {
	id: string
	summary: string
	kind: 'masters-thesis' | 'bachelors-thesis' | 'research-software'
}

interface LabInput {
	id: string
	summary: string
	status: keyof typeof ui.es.lab.statuses
}

// Astro supplies published, locale-filtered entries. Missing entries never create phantom links.
export function getPersonalMap(
	locale: Locale,
	content: { research: readonly ResearchInput[]; lab: readonly LabInput[] }
): PersonalMapData {
	const nodes: PersonalMapNode[] = perspectives.map((node) => ({
		...node,
		label: node.label[locale],
		description: node.description[locale]
	}))
	nodes.push(
		{
			id: 'vector-editor',
			label: ui[locale].tools.vectorEditor.title,
			description: ui[locale].tools.vectorEditor.summary,
			kind: 'tool',
			domain: 'computational',
			href: localizedPath(locale, 'vector-editor'),
			x: 870,
			y: 105
		},
		{
			id: 'connected-lab',
			label: locale === 'es' ? 'Laboratorio conectado' : 'Connected lab',
			description: ui[locale].lab.intro,
			kind: 'perspective',
			domain: 'physical',
			href: localizedPath(locale, 'lab'),
			x: 940,
			y: 815
		}
	)

	for (const definition of researchNodes) {
		const entry = content.research.find((item) => item.id === definition.id)
		if (!entry) continue
		nodes.push({
			...definition,
			label: definition.label[locale],
			description: entry.summary,
			kind: 'research',
			domain: entry.kind === 'research-software' ? 'intelligent' : 'biological',
			status: entry.kind === 'research-software' ? 'development' : undefined,
			href: localizedPath(locale, 'research-detail', entry.id)
		})
	}

	for (const definition of labNodes) {
		const entry = content.lab.find((item) => item.id === definition.id)
		if (!entry) continue
		nodes.push({
			...definition,
			label: definition.label[locale],
			description: entry.summary,
			kind: 'project',
			domain: 'physical',
			status: entry.status,
			href: `${localizedPath(locale, 'lab')}#${entry.id}`
		})
	}

	const present = new Set(nodes.map((node) => node.id))
	const edges = relationships
		.filter((edge) => present.has(edge.source) && present.has(edge.target))
		.map((edge) => ({ ...edge, reason: edge.reason[locale] }))
	for (const definition of labNodes) {
		if (!present.has(definition.id)) continue
		edges.push({
			source: definition.id,
			target: 'connected-lab',
			reason:
				locale === 'es'
					? 'Es una de las ideas documentadas del laboratorio, con su estado publicado.'
					: 'It is one of the documented lab ideas, with its published status.'
		})
	}
	return { nodes, edges }
}

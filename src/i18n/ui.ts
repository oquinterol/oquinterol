export const locales = ['es', 'en'] as const
export type Locale = (typeof locales)[number]

export const ui = {
	es: {
		languageName: 'Español',
		selectLanguage: 'Elige un idioma',
		languageHint: 'Una forma de explorar cómo conecto la biología, la computación y los sistemas.',
		languageSuggestion: 'Idioma sugerido por tu navegador',
		nav: { home: 'Inicio', research: 'Investigación', lab: 'Laboratorio', cv: 'CV' },
		languageSwitch: 'Leer esta página en inglés',
		brand: 'Quintero-L, O. — Inicio',
		home: {
			label: 'Biología computacional · Investigación · Sistemas',
			headline: 'Construyo sistemas para comprender sistemas.',
			intro:
				'Trabajo en la intersección entre biología, bioinformática y computación: de los datos genómicos a las herramientas que permiten interpretarlos.',
			systemsTitle: 'Cuatro perspectivas, un mismo problema',
			systemsIntro:
				'El trabajo científico conecta organismos, mediciones, software y decisiones. Estas áreas no son compartimentos separados.',
			nextConnection: 'Conecta con',
			exploreSystems: 'Explorar conexiones',
			backToOverview: 'Ver todos los sistemas',
			systems: [
				{
					id: 'biological',
					number: '01',
					title: 'Sistemas biológicos',
					description: 'Genómica, bioinformática y biología de sistemas como punto de partida.'
				},
				{
					id: 'computational',
					number: '02',
					title: 'Sistemas computacionales',
					description: 'Flujos reproducibles, software e infraestructura para analizar datos.'
				},
				{
					id: 'intelligent',
					number: '03',
					title: 'Sistemas inteligentes',
					description:
						'Modelos y agentes como preguntas de investigación, no como resultados supuestos.'
				},
				{
					id: 'physical',
					number: '04',
					title: 'Sistemas físicos',
					description: 'Instrumentos, sensores y el entorno donde nacen las mediciones.'
				}
			] as const,
			helix: {
				label: 'Índice de la página como doble hélice, con la secuencia real del gen StSP6A',
				reading: 'Leyendo',
				codon: 'codón',
				pause: 'Pausar lectura',
				resume: 'Reanudar lectura',
				source: 'NCBI',
				links: ['Sistemas', 'Investigación', 'Trayectoria', 'Contacto']
			},
			researchLabel: 'Investigación documentada',
			researchTitle: 'Del genoma a un modelo metabólico',
			researchSummary:
				'Una tesis sobre el ensamblaje genómico y la reconstrucción metabólica de la variedad Colombia de papa criolla, disponible en el repositorio de la Universidad Nacional de Colombia.',
			researchLink: 'Conocer la investigación',
			cvLabel: 'Trayectoria',
			cvTitle: 'Formación y herramientas',
			cvSummary: 'El CV reúne mi formación y experiencia técnica en un formato convencional.',
			cvLink: 'Ver CV',
			contactLabel: 'Conversación',
			contactTitle: 'Conectar investigación y construcción.',
			contactLink: 'Escribirme'
		},
		lab: {
			label: 'Laboratorio',
			title: 'Un laboratorio conectado, en construcción',
			intro:
				'Dispositivos para cultivo, monitoreo e instrumentación que reportan a un sistema central en Home Assistant. Cada proyecto muestra su estado real: lo que aún es idea se ve como plano.',
			networkTitle: 'Red del laboratorio',
			networkIntro:
				'Los dispositivos de bajo consumo transmiten por LoRa para no congestionar el Wi-Fi; un gateway LoRa reúne las lecturas y Home Assistant las centraliza y automatiza.',
			networkLabel: 'Proyectos del laboratorio',
			gateway: 'Gateway LoRa',
			hub: 'Home Assistant',
			automations: 'Automatizaciones y alertas',
			statuses: {
				idea: 'Idea',
				prototype: 'Prototipo',
				experimental: 'Experimental',
				active: 'Activo',
				completed: 'Completado',
				archived: 'Archivado'
			},
			links: { lora: 'LoRa', wifi: 'Wi-Fi', tbd: 'Enlace por definir' },
			measures: 'Mide',
			actions: 'Actúa',
			controller: 'Controlador',
			since: 'Estado desde',
			tbd: 'Por definir',
			openProject: 'Ver proyecto',
			viewLab: 'Ver el laboratorio',
			repository: 'Repositorio',
			noRepository: 'Aún sin repositorio público',
			openTitle: 'Ciencia abierta',
			openIntro:
				'Todo el laboratorio es público: diseños de hardware, firmware, documentación y datos, desde la idea. Cualquiera puede revisarlo, reproducirlo y mejorarlo.',
			openRepo: 'Ver el repositorio en GitHub',
			licences: [
				{ what: 'Hardware', licence: 'CERN-OHL-P-2.0', url: 'https://ohwr.org/cern_ohl_p_v2.txt' },
				{ what: 'Firmware y código', licence: 'MIT', url: 'https://opensource.org/license/mit' },
				{
					what: 'Documentación y datos',
					licence: 'CC BY 4.0',
					url: 'https://creativecommons.org/licenses/by/4.0/deed.es'
				}
			],
			legend:
				'Plano punteado: idea · contorno que late: prototipo · paquetes en tránsito: experimental o activo'
		},
		cv: {
			label: 'Currículum vitae',
			intro: 'Formación y herramientas de trabajo, en un formato de consulta directa.',
			education: 'Formación',
			areas: 'Áreas y herramientas',
			skillsCommand: 'inventario --por-dominio',
			skillsAreas: 'áreas',
			skillsTools: 'herramientas',
			skillsEvidence: 'Aplicado en',
			skillsAll: 'Todas',
			skillsFilter: 'Filtrar por área',
			links: 'Enlaces profesionales',
			download: 'Descargar CV en español (PDF)',
			contact: 'Correo electrónico',
			bio: 'Bioinformático con formación en biología. Mi trabajo reúne genómica, análisis computacional y biología de sistemas.'
		},
		research: {
			label: 'Investigación',
			intro: 'Preguntas biológicas, métodos computacionales y fuentes para profundizar.',
			thesis: 'Tesis de maestría',
			noEntries: 'Todavía no hay investigaciones publicadas en este idioma.',
			otherLanguage: 'Ver investigaciones en inglés',
			method: 'Del dato a la interpretación',
			methodIntro:
				'El resumen institucional documenta un flujo de secuenciación, ensamblaje, evaluación, anotación y reconstrucción metabólica.',
			steps: ['PacBio HiFi', 'Ensamblaje y evaluación', 'Anotación', 'Reconstrucción metabólica'],
			stepDetails: [
				'Lecturas largas y de alta precisión: el material de partida del ensamblaje.',
				'Las lecturas que se solapan se unen en secuencias continuas; el ensamblaje se corrige, se andamia y se evalúa su calidad.',
				'Sobre la secuencia ensamblada se predicen los genes y se les asigna una función.',
				'Los genes anotados se traducen en reacciones que forman un modelo metabólico a escala genómica.'
			],
			schematicNote: 'Esquema ilustrativo: no representa datos de la tesis.',
			playTour: 'Recorrer etapas',
			stopTour: 'Detener recorrido',
			context: 'Contexto',
			methods: 'Métodos documentados',
			provenance: 'Fuente y alcance',
			provenanceText:
				'El alcance y los métodos se resumen a partir de la tesis depositada en el repositorio institucional. Este sitio no presenta resultados nuevos ni reemplaza la fuente primaria.',
			readSource: 'Consultar la tesis en la UNAL',
			back: 'Volver a investigación',
			detail: 'Ver el caso de investigación'
		},
		footer: 'Investigación · Computación · Sistemas'
	},
	en: {
		languageName: 'English',
		selectLanguage: 'Choose a language',
		languageHint: 'A way to explore how I connect biology, computing, and systems.',
		languageSuggestion: 'Language suggested by your browser',
		nav: { home: 'Home', research: 'Research', lab: 'Lab', cv: 'CV' },
		languageSwitch: 'Leer esta página en español',
		brand: 'Quintero-L, O. — Home',
		home: {
			label: 'Computational biology · Research · Systems',
			headline: 'I build systems to understand systems.',
			intro:
				'I work at the intersection of biology, bioinformatics, and computing: from genomic data to the tools that make it possible to interpret them.',
			systemsTitle: 'Four perspectives, one connected problem',
			systemsIntro:
				'Scientific work connects organisms, measurements, software, and decisions. These are not isolated disciplines.',
			nextConnection: 'Connects to',
			exploreSystems: 'Explore connections',
			backToOverview: 'View all systems',
			systems: [
				{
					id: 'biological',
					number: '01',
					title: 'Biological systems',
					description: 'Genomics, bioinformatics, and systems biology as a starting point.'
				},
				{
					id: 'computational',
					number: '02',
					title: 'Computational systems',
					description: 'Reproducible workflows, software, and infrastructure for data analysis.'
				},
				{
					id: 'intelligent',
					number: '03',
					title: 'Intelligent systems',
					description: 'Models and agents as research questions, not assumed achievements.'
				},
				{
					id: 'physical',
					number: '04',
					title: 'Physical systems',
					description: 'Instruments, sensors, and the environment where measurements begin.'
				}
			] as const,
			helix: {
				label: 'Page index drawn as a double helix, using the real StSP6A gene sequence',
				reading: 'Reading',
				codon: 'codon',
				pause: 'Pause reading',
				resume: 'Resume reading',
				source: 'NCBI',
				links: ['Systems', 'Research', 'Background', 'Contact']
			},
			researchLabel: 'Documented research',
			researchTitle: 'From a genome to a metabolic model',
			researchSummary:
				'A thesis on genome assembly and metabolic reconstruction of the Colombia variety of Andean potato, available from the National University of Colombia repository.',
			researchLink: 'Explore the research',
			cvLabel: 'Background',
			cvTitle: 'Education and tools',
			cvSummary:
				'The CV brings together my education and technical experience in a conventional format.',
			cvLink: 'View CV',
			contactLabel: 'Conversation',
			contactTitle: 'Connecting research and engineering.',
			contactLink: 'Get in touch'
		},
		lab: {
			label: 'Lab',
			title: 'A connected lab, under construction',
			intro:
				'Devices for culturing, monitoring, and instrumentation that report to a central Home Assistant system. Each project shows its real status: what is still an idea is drawn as a blueprint.',
			networkTitle: 'Lab network',
			networkIntro:
				'Low-power devices transmit over LoRa to keep Wi-Fi uncongested; a LoRa gateway collects the readings and Home Assistant centralises and automates them.',
			networkLabel: 'Lab projects',
			gateway: 'LoRa gateway',
			hub: 'Home Assistant',
			automations: 'Automations and alerts',
			statuses: {
				idea: 'Idea',
				prototype: 'Prototype',
				experimental: 'Experimental',
				active: 'Active',
				completed: 'Completed',
				archived: 'Archived'
			},
			links: { lora: 'LoRa', wifi: 'Wi-Fi', tbd: 'Link to be decided' },
			measures: 'Measures',
			actions: 'Acts on',
			controller: 'Controller',
			since: 'Status since',
			tbd: 'To be decided',
			openProject: 'View project',
			viewLab: 'Visit the lab',
			repository: 'Repository',
			noRepository: 'No public repository yet',
			openTitle: 'Open science',
			openIntro:
				'The whole lab is public — hardware designs, firmware, documentation, and data — from the idea stage onward. Anyone can review, reproduce, and improve it.',
			openRepo: 'View the repository on GitHub',
			licences: [
				{ what: 'Hardware', licence: 'CERN-OHL-P-2.0', url: 'https://ohwr.org/cern_ohl_p_v2.txt' },
				{ what: 'Firmware and code', licence: 'MIT', url: 'https://opensource.org/license/mit' },
				{
					what: 'Documentation and data',
					licence: 'CC BY 4.0',
					url: 'https://creativecommons.org/licenses/by/4.0/'
				}
			],
			legend:
				'Dotted blueprint: idea · pulsing outline: prototype · packets in transit: experimental or active'
		},
		cv: {
			label: 'Curriculum vitae',
			intro: 'Education and working tools, presented in a straightforward format.',
			education: 'Education',
			areas: 'Areas and tools',
			skillsCommand: 'inventory --by-domain',
			skillsAreas: 'areas',
			skillsTools: 'tools',
			skillsEvidence: 'Applied in',
			skillsAll: 'All',
			skillsFilter: 'Filter by area',
			links: 'Professional links',
			download: 'Download English CV (PDF)',
			contact: 'Email',
			bio: 'A bioinformatician with a background in biology. My work brings together genomics, computational analysis, and systems biology.'
		},
		research: {
			label: 'Research',
			intro: 'Biological questions, computational methods, and sources for further reading.',
			thesis: 'Master’s thesis',
			noEntries: 'No research entries have been published in this language yet.',
			otherLanguage: 'Browse research in Spanish',
			method: 'From data to interpretation',
			methodIntro:
				'The institutional abstract documents a workflow from sequencing and assembly through quality evaluation, annotation, and metabolic reconstruction.',
			steps: ['PacBio HiFi', 'Assembly and assessment', 'Annotation', 'Metabolic reconstruction'],
			stepDetails: [
				'Long, high-accuracy reads: the raw material for the assembly.',
				'Overlapping reads are joined into continuous sequences; the assembly is corrected, scaffolded, and assessed for quality.',
				'Genes are predicted along the assembled sequence and assigned a function.',
				'Annotated genes are translated into reactions that make up a genome-scale metabolic model.'
			],
			schematicNote: 'Illustrative schematic: it does not show thesis data.',
			playTour: 'Walk through stages',
			stopTour: 'Stop walkthrough',
			context: 'Context',
			methods: 'Documented methods',
			provenance: 'Source and scope',
			provenanceText:
				'This English summary is based on the Spanish-language thesis in the institutional repository. This site does not report new results or replace the primary source.',
			readSource: 'View the Spanish-language thesis at UNAL',
			back: 'Back to research',
			detail: 'Read the research case'
		},
		footer: 'Research · Computing · Systems'
	}
} as const

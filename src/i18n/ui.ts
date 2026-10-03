export const locales = ['es', 'en'] as const
export type Locale = (typeof locales)[number]

export const ui = {
	es: {
		languageName: 'Español',
		selectLanguage: 'Elige un idioma',
		languageHint: 'Una forma de explorar cómo conecto la biología, la computación y los sistemas.',
		languageSuggestion: 'Idioma sugerido por tu navegador',
		nav: {
			home: 'Inicio',
			research: 'Investigación',
			lab: 'Laboratorio',
			tools: 'Herramientas',
			cv: 'CV'
		},
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
		tools: {
			label: 'Herramientas',
			intro:
				'Herramientas abiertas para el laboratorio y la bioinformática, que corren en tu navegador.',
			status: 'Prototipo',
			code: 'Código en GitHub',
			open: 'Abrir',
			vectorEditor: {
				title: 'Editor de vectores',
				// Card on /tools/ and meta description (keep under ~160 characters).
				summary:
					'Prueba tu clonación antes de tocar la pipeta: enzimas REBASE o propias, extremos reales y el plásmido resultante en mapa y FASTA vinculados.',
				lead: 'Prueba tu clonación antes de tocar la pipeta. Elige las enzimas y mira cómo se abre el vector, qué extremos deja y cómo encaja el inserto: el plásmido aparece al instante, en un mapa circular y en un FASTA donde cada base tiene el color de donde vino.',
				detail:
					'Te avisa si una enzima corta dentro de tu gen, si los extremos no ligan o si el vector puede cerrarse sobre sí mismo. Todo corre en tu navegador: tus secuencias no salen de tu equipo.',
				noscript: 'Esta herramienta necesita JavaScript: todo el cálculo ocurre en tu navegador.',
				repository: 'https://github.com/oquinterol/vector-editor'
			}
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
			basedOn: 'Se apoya en',
			reuse:
				'No se trata de reinventar la rueda: cuando un proyecto abierto existente sirve, se integra con crédito a sus autores y respetando su licencia.',
			reuseGuide: 'Cómo se reutilizan otros proyectos',
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
			kinds: {
				'masters-thesis': 'Tesis de maestría',
				'bachelors-thesis': 'Tesis de pregrado',
				'research-software': 'Software de investigación'
			},
			advisor: 'Dirección',
			licence: 'Licencia',
			otherRecords: 'Otros registros',
			noEntries: 'Todavía no hay investigaciones publicadas en este idioma.',
			otherLanguage: 'Ver investigaciones en inglés',
			method: 'Del dato a la interpretación',
			methodIntro:
				'El resumen institucional documenta un flujo de secuenciación, ensamblaje, evaluación, anotación y reconstrucción metabólica.',
			schematicNote: 'Esquema ilustrativo: no representa datos de la tesis.',
			loopNote: 'Ciclo documentado en el repositorio; cada paso pasa por el harness.',
			playTour: 'Recorrer etapas',
			stopTour: 'Detener recorrido',
			context: 'Contexto',
			methods: 'Métodos documentados',
			provenance: 'Fuente y alcance',
			provenanceText:
				'El alcance y los métodos se resumen a partir de la tesis depositada en el repositorio institucional. Este sitio no presenta resultados nuevos ni reemplaza la fuente primaria.',
			readSource: 'Consultar la tesis en el repositorio institucional',
			readCode: 'Ver el código y la documentación en GitHub',
			softwareProvenance:
				'Resumen basado en la documentación pública del repositorio. Los hallazgos citados están registrados allí con sus datos y limitaciones.',
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
		nav: { home: 'Home', research: 'Research', lab: 'Lab', tools: 'Tools', cv: 'CV' },
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
		tools: {
			label: 'Tools',
			intro: 'Open tools for the lab and bioinformatics that run in your browser.',
			status: 'Prototype',
			code: 'Code on GitHub',
			open: 'Open',
			vectorEditor: {
				title: 'Vector editor',
				// Card on /tools/ and meta description (keep under ~160 characters).
				summary:
					'Try your cloning before the bench: REBASE or custom enzymes, real sticky ends, and the resulting plasmid in a linked map and FASTA.',
				lead: 'Try your cloning before you pick up a pipette. Choose the enzymes and watch the vector open, the ends it leaves, and how the insert fits: the plasmid appears instantly, on a circular map and in a FASTA where every base is coloured by where it came from.',
				detail:
					'It warns you when an enzyme cuts inside your gene, when ends will not ligate, or when the vector can close on itself. Everything runs in your browser: your sequences never leave your machine.',
				noscript: 'This tool needs JavaScript: all computation happens in your browser.',
				repository: 'https://github.com/oquinterol/vector-editor'
			}
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
			basedOn: 'Builds on',
			reuse:
				'No reinventing the wheel: when an existing open project fits, it is integrated with credit to its authors and within its licence.',
			reuseGuide: 'How other projects are reused',
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
			kinds: {
				'masters-thesis': 'Master’s thesis',
				'bachelors-thesis': 'Undergraduate thesis',
				'research-software': 'Research software'
			},
			advisor: 'Advisor',
			licence: 'Licence',
			otherRecords: 'Other records',
			noEntries: 'No research entries have been published in this language yet.',
			otherLanguage: 'Browse research in Spanish',
			method: 'From data to interpretation',
			methodIntro:
				'The institutional abstract documents a workflow from sequencing and assembly through quality evaluation, annotation, and metabolic reconstruction.',
			schematicNote: 'Illustrative schematic: it does not show thesis data.',
			loopNote: 'Loop documented in the repository; every step goes through the harness.',
			playTour: 'Walk through stages',
			stopTour: 'Stop walkthrough',
			context: 'Context',
			methods: 'Documented methods',
			provenance: 'Source and scope',
			provenanceText:
				'This English summary is based on the Spanish-language thesis in the institutional repository. This site does not report new results or replace the primary source.',
			readSource: 'View the Spanish-language thesis in the institutional repository',
			readCode: 'View the code and documentation on GitHub',
			softwareProvenance:
				'Summary based on the public documentation in the repository. The findings cited are recorded there with their data and limitations.',
			back: 'Back to research',
			detail: 'Read the research case'
		},
		footer: 'Research · Computing · Systems'
	}
} as const

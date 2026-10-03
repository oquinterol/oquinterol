import type { Locale } from '@/i18n/ui'

export const profile = {
	name: 'Oscar Alexis Quintero López',
	creditName: 'Quintero-L, O.',
	email: 'oquinterol@unal.edu.co',
	location: 'Bogotá D. C., Colombia',
	links: {
		github: 'https://github.com/oquinterol',
		linkedin: 'https://www.linkedin.com/in/oquinterol/',
		orcid: 'https://orcid.org/0000-0001-8926-6400'
	},
	cvPdf: {
		es: 'https://github.com/oquinterol/CurriculumVitae/releases/latest/download/cv_spanish.pdf',
		en: 'https://github.com/oquinterol/CurriculumVitae/releases/latest/download/cv_english.pdf'
	}
} as const

// These are the existing CV's education and tool inventories, not proficiency ratings.
export const education = [
	{
		id: 'bioinformatics',
		es: 'Maestría en Bioinformática',
		en: 'M.Sc. in Bioinformatics',
		institution: 'Universidad Nacional de Colombia'
	},
	{
		id: 'biology',
		es: 'Licenciatura en Biología',
		en: 'Degree in Biology Education',
		institution: 'Universidad Distrital Francisco José de Caldas'
	}
] as const

type Domain = 'biological' | 'computational' | 'intelligent' | 'physical'

interface SkillArea {
	id: string
	domain: Domain
	label: Record<Locale, string>
	scope: Record<Locale, string>
	tools: readonly string[]
	// Published research IDs where this area was applied; only verifiable sources.
	evidence?: readonly string[]
}

const skillAreas: readonly SkillArea[] = [
	{
		id: 'bioinformatics',
		domain: 'biological',
		label: { es: 'Bioinformática', en: 'Bioinformatics' },
		scope: {
			es: 'De las lecturas de secuenciación a la anotación: control de calidad, alineamiento, ensamblaje de novo, variantes y evaluación de genomas y transcriptomas.',
			en: 'From sequencing reads to annotation: quality control, alignment, de novo assembly, variants, and genome and transcriptome assessment.'
		},
		tools: [
			'BWA/Bowtie2',
			'BLAST+',
			'GATK',
			'RNA-seq',
			'GBS',
			'de novo assembly',
			'Trimmomatic',
			'Trinity',
			'FastQC/MultiQC',
			'BUSCO',
			'BlobToolKit',
			'AUGUSTUS'
		],
		evidence: ['phureja-genome']
	},
	{
		id: 'systemsBiology',
		domain: 'biological',
		label: { es: 'Biología de sistemas', en: 'Systems biology' },
		scope: {
			es: 'Reconstrucción y análisis de modelos metabólicos a escala genómica: curación, gap-filling, control de calidad y simulación de flujos.',
			en: 'Reconstruction and analysis of genome-scale metabolic models: curation, gap-filling, quality control, and flux simulation.'
		},
		tools: ['COBRApy', 'COBRA Toolbox', 'SBML', 'KEGG API', 'MEMOTE', 'FBA/FVA', 'Gap-filling'],
		evidence: ['phureja-genome']
	},
	{
		id: 'programming',
		domain: 'computational',
		label: { es: 'Programación y análisis', en: 'Programming and analysis' },
		scope: {
			es: 'Procesamiento, estadística y visualización de datos, con scripts y aplicaciones ligeras para explorar resultados.',
			en: 'Data processing, statistics, and visualization, with scripts and lightweight apps to explore results.'
		},
		tools: [
			'Python (pandas, NumPy, SciPy)',
			'R (tidyverse, ggplot2)',
			'Bash',
			'SQL/SQLite',
			'AWK',
			'MATLAB',
			'Streamlit',
			'Jupyter'
		]
	},
	{
		id: 'infrastructure',
		domain: 'computational',
		label: { es: 'Sistemas y HPC', en: 'Systems and HPC' },
		scope: {
			es: 'Entornos Linux, contenedores y cómputo en clústeres con gestores de colas.',
			en: 'Linux environments, containers, and cluster computing with job schedulers.'
		},
		tools: ['Linux (Debian/Ubuntu/Arch)', 'Docker/Compose', 'SLURM', 'Environment Modules', 'SSH']
	},
	{
		id: 'workflows',
		domain: 'computational',
		label: { es: 'Flujos reproducibles', en: 'Reproducible workflows' },
		scope: {
			es: 'Análisis versionados y repetibles: control de versiones, gestores de flujos, entornos aislados e integración continua.',
			en: 'Versioned, repeatable analyses: version control, workflow managers, isolated environments, and continuous integration.'
		},
		tools: [
			'Git/GitHub',
			'GitHub Actions (CI/CD)',
			'Make',
			'Snakemake',
			'Nextflow',
			'Conda',
			'pyenv',
			'LaTeX/Markdown'
		]
	}
]

export const spokenLanguages = {
	es: ['Español (nativo)', 'Inglés (intermedio)'],
	en: ['Spanish (native)', 'English (intermediate)']
} as const

export function getSkills(locale: Locale) {
	return skillAreas.map((area) => ({
		id: area.id,
		domain: area.domain,
		label: area.label[locale],
		scope: area.scope[locale],
		tools: area.tools,
		evidence: area.evidence ?? []
	}))
}

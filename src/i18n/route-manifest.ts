// Only routes with verified, published versions in both languages belong here.
// A partial translation must not receive hreflang or sitemap alternates.
export const translatedRoutes = [
	['/es/', '/en/'],
	['/es/cv/', '/en/cv/'],
	['/es/research/', '/en/research/'],
	['/es/lab/', '/en/lab/'],
	['/es/tools/', '/en/tools/'],
	['/es/tools/vector-editor/', '/en/tools/vector-editor/'],
	['/es/research/phureja-genome/', '/en/research/phureja-genome/'],
	['/es/research/phureja-rnaseq-pipeline/', '/en/research/phureja-rnaseq-pipeline/']
] as const

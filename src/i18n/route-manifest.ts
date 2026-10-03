// Only routes with verified, published versions in both languages belong here.
// A partial translation must not receive hreflang or sitemap alternates.
export const translatedRoutes = [
	['/es/', '/en/'],
	['/es/cv/', '/en/cv/'],
	['/es/research/', '/en/research/'],
	['/es/lab/', '/en/lab/'],
	['/es/research/phureja-genome/', '/en/research/phureja-genome/']
] as const

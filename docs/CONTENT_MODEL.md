# Modelo editorial y de contenido bilingüe

## Decisión

Aprovechar la **Content Layer API** que el proyecto ya usa en `src/content.config.ts` (Astro 6 + Zod + loader `glob()`), no incorporar un CMS inicial. Mantener UI compartida y definir colecciones para `work`, `research`, `lab`, `notes` y `concepts` cuando haya entradas verificadas. `systems` puede comenzar como página editorial con consultas por dominios/conceptos; no necesita colección propia hasta contar con casos sólidos. El CV puede comenzar como datos tipados reutilizables y narración localizada, no como un proyecto. Migrar la colección `post` **sin borrarla** hasta resolver URLs antiguas.

Elegimos **archivos de cuerpo por idioma** y metadatos compartidos estables. Es más adecuado para MDX científico extenso (estructuras de párrafos, referencias y visualizaciones distintos por lengua) que un único objeto `LocalizedString` con todo el documento duplicado dentro del frontmatter. Los labels de UI y conceptos breves sí serán objetos `{ en, es }` cuando ambas versiones estén validadas.

```text
src/content/
  work/
    es/{id}.mdx
    en/{id}.mdx
  research/
    es/{id}.mdx
    en/{id}.mdx
  lab/
    es/{id}.mdx
    en/{id}.mdx
  notes/
    es/{id}.mdx
    en/{id}.mdx
  concepts/
    es/{id}.mdx
    en/{id}.mdx
  post/                     colección legada intacta inicialmente
src/data/
  content-records.ts        metadatos compartidos opcionales, validados, sin cuerpos duplicados
  cv.ts                     datos académicos verificados y enlaces de descarga
```

El `id` lógico es estable y **no depende del título, idioma o slug**. Por defecto, el slug público es el ID en ambos idiomas; un mapa de slugs por idioma solo se introduce si una necesidad editorial real lo justifica. El ID de colección puede ser `es/phureja-genome`; `data.id` es `phureja-genome`. Las rutas se generan consultando entradas existentes, nunca suponiendo que hay un cuerpo para ambos idiomas.

## Esquema conceptual y primera implementación

La colección `research` ya tiene esquema real en `src/content.config.ts` (`id`, `locale`, `title`, `summary`, `sourceUrl`, `domains`, `draft`). Las interfaces siguientes son un contrato de evolución para las demás colecciones, no código ya implementado:

```ts
type Locale = 'es' | 'en'
type Domain = 'biological' | 'intelligent' | 'computational' | 'physical'
type ContentKind = 'work' | 'research' | 'lab' | 'notes' | 'concepts'
type WorkStatus =
	| 'concept'
	| 'research'
	| 'prototype'
	| 'active'
	| 'experimental'
	| 'finished'
	| 'archived'
type LabStatus = 'idea' | 'prototype' | 'experimental' | 'active' | 'completed' | 'archived'

type Related = Partial<Record<ContentKind, string[]>>

interface SharedRecord {
	id: string // p. ej. phureja-genome, nunca label localizado
	kind: ContentKind
	domains: Domain[] // puede haber múltiples dominios
	related?: Related // solo referencias a IDs existentes
	featured?: boolean
	year?: number
	repository?: string
	externalUrl?: string
	images?: Array<{ src: string; alt: Record<Locale, string>; credit?: string }>
}

interface LocalizedEntry {
	id: string // coincide con SharedRecord.id
	locale: Locale
	title: string
	summary: string
	publishDate?: Date
	updatedDate?: Date
	draft?: boolean
	// cuerpo .md/.mdx independiente; slug estable por defecto
}

interface Concept {
	id: string
	labels: Record<Locale, string>
	related?: Related
}
```

Los campos de ejemplo representan contratos deseados, no propiedades verificadas en contenido real. Cada colección añade campos relevantes y opcionales: `work` (problema, contexto, rol, arquitectura, implementación, resultados, lecciones, links); `research` (pregunta, método, figuras, datasets, referencias con DOI/URL, métricas con procedencia y límites); `lab` (número, hipótesis, estado, hallazgos/fallos); `notes` (tema, fecha, enlaces); `concepts` (definición, relaciones). Mantener `publishDate` obligatoria solo si la política editorial la exige; no inventar fechas.

### Ejemplo hipotético de metadatos (NO publicar como hecho)

```ts
const example: SharedRecord = {
	id: 'autonomous-assembly-agent',
	kind: 'lab',
	domains: ['biological', 'intelligent', 'computational'],
	related: {
		concepts: ['genome-assembly', 'scientific-agents'],
		research: ['phureja-genome']
	}
}
```

No implica que el experimento, investigación ni sus enlaces ya existan públicamente. La UI debe poder mostrar `idea`/`research` sin atribuir resultados terminados.

## Integridad y estados de traducción

La fuente de verdad de disponibilidad es la existencia de `/{locale}/{id}.mdx` **publicable** (no draft); no duplicar un campo manual susceptible de divergencia. Una vista de inventario o reporte generado puede derivar:

```ts
translationStatus: {
	en: 'complete' | 'pending'
	es: 'complete' | 'pending'
}
```

“Complete” aquí significa publicado y revisado, no traducción perfecta por definición. Puede existir un estado editorial adicional `needs-review` fuera de la generación pública. Para páginas sin equivalente, **no** construir URL fantasma ni mostrar automáticamente el texto del otro idioma bajo `<html lang>` incorrecto. Mostrar en la página disponible un control que indique que falta la traducción y permita elegir la otra lengua; si el usuario navega a una URL inexistente por enlace antiguo, servir 404 con enlace explícito a la versión disponible. Ver [I18N_ARCHITECTURE.md](./I18N_ARCHITECTURE.md).

### Referencias y validación

- Normalizar `related` como `{ concepts: ['genome-assembly'], research: ['phureja-genome'] }` y verificar en build que destino, ID y visibilidad existen. No crear relaciones basadas en labels traducidos ni enlaces a borradores.
- Los IDs deben ser únicos por tipo, no cambiar al traducir. Si dos tipos comparten ID, siempre usar `kind + id` al indexar o construir el grafo.
- Evitar en los resultados de búsqueda duplicados ES/EN: indexar por `(kind, id, locale)`, mostrar por defecto solo la lengua activa, ofrecer otras lenguas explícitamente cuando falte traducción.
- Markdown/MDX permite insertar una visualización, pero cada figura exige leyenda, `alt` o tabla/datos alternativos, fuente, unidades y procedencia. No representar datos inventados como experimentales.
- Los enlaces a repositorios, publicaciones, CV y medios requieren confirmación; URL vacía u objeto `TODO` queda fuera de UI pública.
- Mantener `draft` semántico: solo contenido revisado se genera en producción; las entradas de laboratorio pueden publicarse sin estar terminadas **si su estado y límites son explícitos**.

## Inventario mínimo antes de publicar

Para cada entrada: ID, tipo, dominios, título y resumen por lengua disponible, estado verificable, problema/pregunta, qué hizo Oscar y qué está pendiente, URLs, autoría y permisos de medios, relaciones existentes, fuentes de cualquier resultado/afirmación, traducciones faltantes. La lista de brechas y una plantilla operativa están en [CONTENT_TODO.md](./CONTENT_TODO.md).

## Migración del contenido ya existente

1. El antiguo `src/pages/index.astro` permanece en el historial de git como **fuente histórica** del CV; formación, competencias y enlaces se trasladaron a datos y páginas ES/EN. La afirmación de “cursar actualmente” no se trasladó. El retrato se retiró de la UI por preferencia expresa del propietario.
2. `src/content/post/proximamente.md` es borrador y no equivale a una nota pública. Dejarlo fuera de listados de notas y RSS hasta que haya una decisión editorial.
3. Migrar posts publicados futuros a `notes` con mapeo de URL y redirección estática por entrada; mantener RSS funcionando con enlaces canónicos. Evitar eliminar `/blog/` prematuramente.
4. Iniciar cada colección con **cero contenido ficticio**; crear contenido real solo tras confirmar hechos y, para investigación, las cifras con su fuente.

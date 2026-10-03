# Arquitectura de internacionalización (español e inglés)

## Decisiones confirmadas

- URLs prerenderizadas y canónicas por idioma: `/es/...` y `/en/...`. `es` usa español de Colombia (`html lang="es-CO"`, OG `es_CO`); `en` usa inglés (`html lang="en"`, OG `en_US` si se decide variante editorial). El prefijo de ruta sigue siendo `es`/`en` y no cambia por país.
- **El propietario eligió `/` como selector neutral** `x-default`: selector ES/EN accesible y contenido mínimo propio; puede sugerir un idioma una sola vez usando preferencias del navegador, pero no redirigir silenciosa ni continuamente. Un enlace directo a `/es/...` o `/en/...` siempre gana a cookies, `localStorage` y al navegador.
- Slugs estables compartidos al principio: `/es/research/phureja-genome/` ↔ `/en/research/phureja-genome/`. Etiquetas, título, textos y metadata sí se localizan. Se documenta la alternativa de slugs traducidos como decisión futura, no una necesidad actual.
- Contenido largo: `.mdx` independientes `es/{id}` y `en/{id}` bajo una misma colección por tipo; etiquetas cortas/UI: diccionario tipado. Una lengua ausente no recibe página simulada.

## Por qué esta combinación

Astro ya renderiza HTML estático y tiene soporte nativo de [routing i18n](https://docs.astro.build/en/guides/internationalization/) y [colecciones de contenido](https://docs.astro.build/en/guides/content-collections/). La configuración ya aplicada es `locales: ['es', 'en']`, `defaultLocale: 'es'`, `routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false }`. Astro deja el `index.astro` raíz como selector sin redirección. El build y el verificador de `dist/` comprueban las rutas legadas, páginas dinámicas y alternates del sitemap, también con un prefijo de despliegue distinto de `/`. Los wrappers de páginas ES/EN pueden compartir vistas/layouts; los detalles dinámicos usarán `getStaticPaths()` sobre traducciones publicadas. Si Astro i18n automatizado interfiere con rutas legadas, evaluar `routing: 'manual'` con tests completos, no forzar una segunda aplicación duplicada.

## Ruta raíz y preferencia

`/` debe ser HTML completo, indexable, canonical propio (`https://oquinterol.com/`), `<html lang="es">` o contenido genuinamente neutro con fragmentos etiquetados `lang="es"` / `lang="en"`; no declarar que el cuerpo entero está en una lengua que no tiene. Dos enlaces visibles hacia `/es/` y `/en/`. `hreflang="x-default"` en **ambas portadas** apunta a `/`; no se apunta a `/` como alternativa universal de páginas interiores no equivalentes.

Algoritmo de mejora progresiva del selector raíz: primero mostrar ambos idiomas sin JS; después, si existe una preferencia manual guardada, destacar esa opción sin redirigir; de lo contrario, en la primera visita sugerir `es` o `en` por `navigator.languages`, sin bloquear la otra. Un cambio manual desde cualquier página guarda `site.locale` (valor `es` o `en`) solo si storage está disponible; su ausencia no rompe la UI. No leer `Accept-Language` del servidor en GitHub Pages estático ni simular que el build conoce al visitante.

## Cambio de idioma que preserva contexto

La URL equivalente se calcula desde **tipo de ruta + ID estable**, no mediante sustitución ciega del prefijo cuando existan slugs distintos o páginas parciales. En rutas compartidas se puede mapear `/{lang}/{section}/{slug}/` solo tras comprobar que hay una traducción publicada. En `/es/notes/{id}/`, si `en/{id}` existe se enlaza a `/en/notes/{id}/`; si no, indicar “Disponible solo en español” y enlazar explícitamente a la versión existente, **sin enviar al visitante a `/en/` como si fuera el mismo documento**. La alternativa para una página sin traducción puede ser un texto informativo en el selector; no se genera la URL faltante como página falsa. Para 404 de enlaces externos ofrecer versión existente cuando se identifique el ID.

El control muestra texto `ES / EN` y estado actual legible, enlace `<a>` sin depender de JS, foco visible y nombre accesible (p. ej. “Read this page in English”). No usar bandera nacional. Probar rutas de segundo/tercer nivel, paginación, parámetros y enlaces con hash; conservar fragmentos solo si existe el mismo ID de encabezado en la otra lengua; en caso contrario, omitirlos.

## Disponibilidad editorial

Usar `locale` e `id` en entradas reales para indexar cada versión (`{kind, id, locale}`). Estado derivado `complete/pending` a partir de contenido publicado, con posibilidad de `needs-review` en el flujo editorial. No configurar `i18n.fallback` automático ni `fallbackType: 'rewrite'` para contenido largo: podría servir texto de un idioma bajo URL y metadata de otro. Un borrador no cuenta como traducción disponible. Las páginas generales (home, navegación, CV, about) se lanzan con ambos idiomas completos antes de anunciar bilingüismo integral; las notas largas pueden indicar explícitamente disponibilidad parcial.

## SEO bilingüe: contrato por URL

| Elemento             | Regla                                                                                                                                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HTML                 | `lang` correcto en cada página, incluyendo prosa incrustada en otra lengua etiquetada                                                                                                                                      |
| Title/description/OG | Localizados; `og:locale` correcto; `og:locale:alternate` solo si existe contraparte                                                                                                                                        |
| Canonical            | Absoluto y autorreferencial (`/es/...` o `/en/...`); no canonical cruzado hacia otra lengua                                                                                                                                |
| `hreflang`           | `es-CO` y `en` como alternates recíprocos **solo de versiones disponibles**; opcional `es` si se requiere distribución panhispánica coherente; `x-default` solo para selector/home equivalente, no para cualquier artículo |
| Sitemap              | Incluir solo URLs publicadas y reales, excluir drafts; verificar recíproca de alternates, raíz neutral y legacy URLs antes de activar alternates XML                                                                       |
| Datos estructurados  | `inLanguage`, autor, URL y enlaces de mismo tema únicamente cuando haya datos verificados; investigación no debe inventar DOI o publicación                                                                                |
| Social image         | Default existente hasta contar con tarjetas locales; no asumir un generador `/og-image/` inexistente                                                                                                                       |

Ejemplo de equivalencia real, suponiendo **ambas versiones publicadas**:

```html
<link rel="canonical" href="https://oquinterol.com/es/research/phureja-genome/" />
<link rel="alternate" hreflang="es-CO" href="https://oquinterol.com/es/research/phureja-genome/" />
<link rel="alternate" hreflang="en" href="https://oquinterol.com/en/research/phureja-genome/" />
```

`@astrojs/sitemap` dispone de [opción i18n](https://docs.astro.build/en/guides/integrations-guide/sitemap/), pero agrupa URLs por prefijo y trata las rutas **sin prefijo** como lengua por defecto: eso puede representar mal `/` neutral, `/blog/` legado y traducciones parciales. En esta entrega **no** se activó el i18n automático del sitemap: `serialize()` emite `links` explícitos solo para pares registrados en `src/i18n/route-manifest.ts` **y efectivamente generados** según el inventario de rutas de `astro:build:done`; las rutas legadas y las traducciones parciales no reciben alternates inventados. El verificador inspecciona el XML generado. Al publicar un par nuevo, actualizar el manifiesto y sus tests.

## Tests de aceptación mínimos

1. Build produce `/`, `/es/`, `/en/` y las rutas publicadas correspondientes en `dist/`; `/` no redirige automáticamente.
2. `/es/` y `/en/` funcionan sin JS y no cambian por idioma del navegador ni preferencia guardada.
3. Selector desde una página con traducción conserva sección e ID; desde una página sin traducción nunca apunta a 404 ni silencia un fallback.
4. Para cada pareja generada, canonical y alternates recíprocos válidos; sin `hreflang` hacia páginas ausentes.
5. Sitemap/robots/RSS solo mencionan URLs reales; etiquetas largas en español no rompen menú móvil; pestaña, foco y lector de pantalla funcionan.

Referencias: [Astro i18n routing](https://docs.astro.build/en/guides/internationalization/), [receta de contenido i18n](https://docs.astro.build/en/recipes/i18n/) y [sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/).

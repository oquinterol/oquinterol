# Desarrollo de la primera vertical bilingüe

## Estado implementado

La raíz `/` ahora es un selector neutral ES/EN que **no redirige automáticamente**. `/es/` y `/en/` ofrecen una portada editorial con cuatro sistemas, un caso de investigación verificado y acceso al CV. `/es/cv/` y `/en/cv/` conservan formación, inventario técnico, correo y descargas PDF, sin mostrar retrato por preferencia explícita del propietario; la biografía omite la afirmación antigua de que la maestría está en curso. `/es/research/` y `/en/research/` enumeran entradas de la colección `research`, con una tesis en MDX por lengua y una fuente institucional explícita. Se mantienen `/blog/`, `/tags/`, `/rss.xml` y el 404 compartido. La firma visual **«Quintero-L, O.»** reproduce el nombre de crédito público de ORCID en cabecera y portada; el CV y los metadatos conservan **Oscar Alexis Quintero López**. No se copia el diseño ni se incorpora contenido dinámico del perfil ORCID.

El primer componente React (`SystemsExplorer.tsx`) aparece **solo en la portada**: sirve la secuencia completa desde el servidor y sin JS; al hidratarse cuando es visible permite que el visitante abra una exploración por etapas. No se instaló biblioteca de animación ni se hidrató el shell. El selector de idioma funciona como enlace HTML, preserva sección/ID cuando hay contraparte y nunca envía a una traducción inexistente. La preferencia manual en `localStorage` solo destaca un idioma en `/` y no anula URL explícita.

## Comandos

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm run format:check
pnpm run lint:check
pnpm exec astro check
pnpm run build
pnpm run verify:site
pnpm preview
```

`verify:site` inspecciona `dist/` después del build: rutas principales y legadas, enlaces internos, un `h1` por página, canonical, pares hreflang HTML y sitemap, idiomas, firma/nombre en home y CV, tarjeta social de 1200 × 630 y HTML del componente React sin JS. El workflow de GitHub Pages ejecuta el verificador antes de subir el artefacto. El sitemap verifica que ambas rutas de cada pareja se generaron antes de publicar hreflang; una traducción marcada `draft` no se enlaza como publicada. Para una vista visual rápida usar el preview de Astro a 375 y 1440 CSS px en ambas lenguas; no hay suite de navegador automatizada todavía.

## Agregar contenido de investigación

1. Crear `src/content/research/es/{id}.mdx` y/o `en/{id}.mdx`, con `id`, `locale`, `title`, `summary`, `sourceUrl`, `domains`. La ruta del archivo debe coincidir con `{locale}/{id}` y los IDs deben ser únicos por idioma. `draft: true` excluye la entrada en producción.
2. Los dos archivos contienen **cuerpos genuinamente localizados**; no rellenar faltantes mostrando contenido de otra lengua. `getPublishedResearch()` genera solo páginas existentes y `researchLocales()` alimenta el selector de idioma de cada detalle.
3. Si hay dos versiones publicadas, registrar las URLs en `src/i18n/route-manifest.ts` para alternates del sitemap. Si solo hay una, **no** registrarla: el HTML del artículo tampoco mostrará alternate inexistente.
4. Actualizar `scripts/check-site.mjs` con la pareja nueva si se añade al manifiesto; verificar relaciones, enlaces, títulos y la fuente primaria. Prohibido inventar resultados o fechas.

## Límites intencionales

La tarjeta social sin retrato se reproduce con `python3 scripts/generate-social-card.py` (Pillow y fuentes locales); no requiere librerías de imagen en el build de Astro.

No se han publicado `/work/`, `/systems/`, `/lab/`, `/notes/`, `/about/` ni `/explore/`: faltan entradas reales revisadas. No hay búsqueda ni grafo antes de contar con relaciones estables. No se modificó `README.md`, cuyo uso como perfil GitHub sigue pendiente de verificación antes de editarlo. El CV anterior estaba en `/`; ahora permanece localizado y enlazado desde ambos idiomas. Rutas legadas del blog continúan activas. Los enlaces de los dos PDF se comprobaron con respuestas HTTP 200 durante esta implementación, pero conviene revisar su contenido editorial antes de anunciar datos académicos actualizados.

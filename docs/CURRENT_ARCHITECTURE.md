# Arquitectura actual — auditoría de oquinterol.com

**Instantánea anterior a la implementación bilingüe.** Este documento describe el sitio heredado tal como se encontró en la primera pasada; para el estado implementado ahora, consultar [DEVELOPMENT.md](./DEVELOPMENT.md). Las decisiones futuras están en [SITE_ARCHITECTURE.md](./SITE_ARCHITECTURE.md). El retrato que aquí aparece como parte del inventario histórico ya no se muestra en el sitio por solicitud del propietario.

## Resumen ejecutivo

El sitio es un CV estático en español, derivado de un tema Astro, con un blog técnico preparado pero sin publicaciones públicas. Ya cuenta con build reproducible, despliegue a GitHub Pages, Astro Content Collections, MDX, SEO básico, RSS y tipografía local. No usa React ni tiene rutas bilingües. La funcionalidad existente merece migración, no una reescritura en bloque.

### Restricción crítica: `README.md`

`README.md` **no se debe usar como documentación interna del proyecto**: también tiene el papel de README de perfil de GitHub según el contrato del proyecto. Se inspeccionaron tanto el archivo actual como su historial: el archivo actual contiene instrucciones de desarrollo, validación y despliegue; versiones anteriores contenían presentación pública y el comentario de repositorio especial de perfil de GitHub. Hay, por tanto, una **discrepancia preexistente** entre el contenido actual y el uso declarado del archivo. No se modifica en esta pasada. Antes de cualquier edición, confirmar la configuración real del perfil de GitHub y restaurar/actualizar el contenido público solo con aprobación; guardar documentación técnica en `docs/`.

## Stack y ejecución

| Aspecto                    | Implementación actual                                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Framework                  | Astro `^6.3.7`; salida estática (sin adaptador SSR configurado)                                                      |
| UI                         | Componentes `.astro`; **React y `@astrojs/react` no están instalados**                                               |
| TypeScript                 | `astro/tsconfigs/strict`, `strictNullChecks`, aliases `@/…`                                                          |
| Estilos                    | Tailwind CSS `^3.4.19`, plugin typography/aspect-ratio, PostCSS/autoprefixer, variables HSL en `src/styles/app.css`  |
| Contenido                  | Content Layer API de Astro 6: colección `post` con `glob()` en `src/content.config.ts`; Markdown/MDX, `@astrojs/mdx` |
| Markdown                   | Expressive Code (dos temas), remark lectura/desenvolver imágenes, rehype enlaces externos                            |
| Dependencias UI auxiliares | `clsx`, `tailwind-merge`, `sharp`; no hay biblioteca de animación ni canvas/WebGL                                    |
| Package manager            | `pnpm@11.2.2`, lockfile presente; workflow usa Node 22 y `pnpm install --frozen-lockfile`                            |
| Hosting                    | GitHub Pages por `.github/workflows/astro.yml`, desde `main`; `site` configurado como `https://oquinterol.com`       |
| Calidad                    | Prettier 3, ESLint 8, `astro check`; workflow valida formato, lint, tipos y build antes del deploy                   |

Los scripts efectivos están en `package.json`: `pnpm dev`, `pnpm start`, `pnpm build`, `pnpm run format:check`, `pnpm run lint:check`. El deploy usa `astro build --site … --base …` suministrados por GitHub Pages: conservar ese comportamiento al cambiar rutas y enlaces.

### Línea base verificada

En esta pasada `pnpm run format:check`, `pnpm run lint:check`, `pnpm exec astro check` y `pnpm exec astro build` terminaron con código 0; Astro reportó **0 errores, 0 advertencias y 4 páginas estáticas**. La salida local de `dist/` tiene 25 archivos (~628 KiB sin comprimir): ~337 KiB de TTF, ~57 KiB de CSS y ~4.7 KiB de JS total. Son tamaños de archivos compilados, **no** una medición de transferencia, Core Web Vitals, caché, accesibilidad automatizada ni rendimiento en dispositivos reales. `dist/` está ignorado; no se detectaron tests de navegador o CI de accesibilidad.

## Mapa actual de rutas

| Ruta                     | Fuente                           | Estado                                                     |
| ------------------------ | -------------------------------- | ---------------------------------------------------------- |
| `/`                      | `src/pages/index.astro`          | CV completo y única página de contenido principal          |
| `/blog/` y paginación    | `src/pages/blog/[...page].astro` | Listado funcional; sin publicaciones públicas              |
| `/blog/:slug/`           | `src/pages/blog/[slug].astro`    | Plantilla de artículo MDX/Markdown, sin artículos públicos |
| `/tags/`, `/tags/:tag/…` | `src/pages/tags/`                | Índice y filtrado basados en posts; vacíos en producción   |
| `/rss.xml`               | `src/pages/rss.xml.js`           | Feed de posts públicos, hoy sin entradas                   |
| `/404/`                  | `src/pages/404.astro`            | Página de error con enlace ajeno al tema original          |
| `/sitemap-index.xml`     | `@astrojs/sitemap`               | Sitemap generado en build                                  |

Solo hay `src/content/post/proximamente.md`, marcado `draft: true`. `getAllPosts()` filtra borradores en producción y los expone en desarrollo. `BlogPost.astro` ya usa `render()`, TOC y fecha de lectura; `PostPreview.astro`, paginación y RSS dependen de esa colección. La utilidad `getPostSlug()` deriva la ruta del ID del archivo. **No existe aún** `/cv`, `/work`, `/research`, `/systems`, `/lab`, `/notes` ni `/explore`.

## Contenido y activos que conviene conservar

- El CV de `src/pages/index.astro`: descripción de formación en biología y bioinformática, Universidad Nacional de Colombia, Universidad Distrital, ciudad, correo, enlaces a LinkedIn y a los PDF del CV en releases de `oquinterol/CurriculumVitae`, además de áreas técnicas. Es contenido que debe pasar a `/cv` **después de verificar vigencia y redacción**; no corresponde a la portada narrativa.
- Los enlaces sociales existentes en `Footer.astro`: GitHub, LinkedIn, Mastodon, Bluesky, X y ORCID. Validar qué perfiles siguen vigentes; no borrar contactos sin revisar preferencias. El ORCID presente es `0000-0001-8926-6400`.
- Foto local `src/assets/Perfil.png` optimizada actualmente mediante `<Image />`, imagen neutra `blank.png`, fuentes locales Satoshi/Clash Display, favicon y `public/social-card.png`.
- Blog y utilidades `src/utils/post.ts`, `remarkReadingTime.ts`, `generateToc.ts`, `FormattedDate.astro`, RSS, tags, sitemap, Expressive Code, soporte Markdown/MDX, optimización de imágenes y la validación de esquemas.
- Paleta clara y capacidad de tema oscuro como punto de partida técnico, **no** como identidad visual definitiva.

No se encontraron inventarios de proyectos, investigaciones, experimentos o publicaciones estructurados en el repositorio. El prompt del producto y notas personales externas al repositorio pueden orientar la recopilación, pero **no se publicarán como hechos sin verificación editorial y permiso**. Ver el inventario editorial privado (`.private/CONTENT_TODO.md`, fuera del repositorio público).

## Arquitectura de componentes y estado de la UI

`BaseLayout.astro` monta `BaseHead.astro`, `Header.astro`, `Footer.astro` y `ThemeProvider.astro`. El contenido actual vive principalmente como texto y arreglos dentro de `src/pages/index.astro`, apoyado por `Card.astro`, `Section.astro`, `Label.astro`, `Button.astro` y `SkillLayout.astro`. `ProjectCard.astro` existe pero no hay un inventario de proyectos que lo alimente. La cabecera solo muestra “Currículum Vitae” y un botón de tema; Blog está comentado. No hay directivas `client:*`, componentes React ni dependencia de animación. La única interactividad usa scripts pequeños para el tema y el botón de volver arriba en posts.

## SEO, idiomas y accesibilidad: observaciones comprobadas

- `BaseHead.astro` genera `<title>`, descripción, canonical, Open Graph, Twitter card, enlace al sitemap y descubrimiento RSS; `site.config.ts` fija `lang: 'es-CO'` y `ogLocale: 'es_CO'` para todo el sitio.
- No hay `hreflang`, metadatos traducidos, sitemap con alternates, datos estructurados localizados, páginas por idioma ni buscador. Etiquetas del blog, errores y CTA mezclan español e inglés.
- `BaseLayout.astro` coloca `<Header />`, `<slot />` y `<Footer />` **dentro del mismo `<main>`**; habrá que separar landmarks. No hay enlace para saltar al contenido ni foco explícito documentado.
- `Card.astro` usa `h1` y `h2` para datos de tarjetas; la portada compilada contiene **tres `h1`**. `SkillLayout.astro` presenta etiquetas de habilidades como botones sin acción. Los iconos sociales del pie no tienen nombres accesibles visibles para lectores de pantalla. Estos son hallazgos de inspección, no una auditoría WCAG completa.
- No se encontró regla `prefers-reduced-motion`. Hay pulso decorativo en los enlaces al CV/contacto, transiciones y scroll suave de vuelta arriba, que necesitan alternativas.
- La foto usa un `alt` genérico (`profile photo`); los enlaces e iconos requieren revisión editorial de texto alternativo/etiquetas.
- `ThemeProvider.astro` persiste `theme` en `localStorage` y reacciona a `prefers-color-scheme`; también guarda como preferencia una selección detectada automáticamente, por lo que una visita inicial puede impedir que futuros cambios del sistema se reflejen. Conservar tema si se decide soportarlo, pero revisar esta lógica.

## Riesgos y deuda técnica

| Riesgo                             | Evidencia                                                                                          | Tratamiento propuesto                                                                       |
| ---------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| README de perfil desplazado        | Contenido actual técnico; historial con presentación de perfil                                     | Proteger; revisar externamente el perfil antes de editar                                    |
| Datos profesionales obsoletos      | Portada afirma que Oscar cursa la maestría; hay que verificar su estado actual                     | Validar fuentes primarias antes de migrar a `/cv`; no copiar a la nueva portada sin revisar |
| Restos de plantilla                | `/404/` enlaza a `srleom/astro-theme-resume`; comentarios/config mencionan rutas que ya no existen | Sustituirlos en una fase de limpieza medida                                                 |
| Imagen OG de artículos inexistente | `BlogPost.astro` supone `/og-image/${slug}.png`; no existe tal ruta en `src/pages/`                | Usar `social-card.png` hasta contar con generador real                                      |
| Manifest de favicon                | `site.webmanifest` referencia `/android-chrome-*.png` pero los archivos están bajo `/favicon/`     | Corregir cuando se trabaje la identidad visual                                              |
| Contenido acoplado a portada       | CV, arrays de herramientas y textos están hardcodeados en `index.astro`                            | Extraer datos validados y reutilizarlos entre `/cv` y secciones pertinentes                 |
| Layout estrecho universal          | `max-w-[60rem]` en `<main>` sirve al CV pero limitaría investigaciones/visualizaciones             | Crear anchos por tipo de contenido, sin romper blog                                         |
| Enlaces y clases heredadas         | Links absolutos de raíz, clases de tema shadcn-like, footer © 2024, `ProjectCard` no utilizado     | Migración incremental con enlaces/SEO revisados                                             |
| Falta de cobertura automática      | No se localizaron tests de navegación, i18n, a11y ni presupuestos de JS                            | Añadir smoke tests por fases                                                                |

## Matriz de acciones

| Conservar                                                                                     | Refactorizar                                                                   | Extender                                                                                                    | Reemplazar/retirar con validación                                                                                            |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Astro estático + Pages, pnpm/CI, colección `post`, MDX, RSS/sitemap, foto y medios originales | Layout, metadata, tipos, CV, menú, tarjetas, estado del tema, enlaces en rutas | Colecciones de work/research/lab/notes/concepts, rutas ES/EN, SEO/i18n, relaciones, React islands puntuales | Link de plantilla en 404, textos genéricos/desactualizados, botones sin acción, assets neutros cuando haya medios auténticos |

No hay razón técnica demostrada para migrar el sitio entero a React, adoptar SSR, instalar un CMS, cambiar de hosting o reemplazar Tailwind durante esta primera etapa.

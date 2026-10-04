# Hoja de ruta priorizada

Objetivo: pasar de CV Astro estático a plataforma bilingüe de investigación y construcción de sistemas, sin perder el sitio publicable. “Prioridad” designa **orden de dependencia**, no fechas/promesas de entrega. Una página sin contenido verificable no se publica solo para completar un checklist.

## Estado tras la primera pasada (auditoría histórica)

- [x] Inspeccionar repo, README e historial, stack, rutas, contenido, activos, CI/hosting, SEO, a11y y línea base del build.
- [x] Evaluar patrones de ObsidianUI frente al stack Astro sin instalar dependencias.
- [x] Elegir con el propietario `/` como selector neutral `x-default`.
- [x] Documentar arquitectura actual/objetivo, modelo editorial, i18n, diseño, movimiento y faltantes.
- [ ] Implementar migración: **no se han modificado páginas de producción, rutas ni dependencias** en esta pasada.

## Implementación iniciada (segunda pasada)

- [x] Selector neutral en `/`, páginas HTML estáticas `/es/` y `/en/` y shell editorial responsive con foco y skip link.
- [x] CV localizado con formación y herramientas existentes, enlaces PDF comprobados y biografía sin afirmación temporal obsoleta.
- [x] Colección bilingüe `research` con IDs estables y una tesis enlazada al repositorio institucional; `getStaticPaths()` solo para traducciones publicadas.
- [x] React incorporado como isla de exploración de sistemas, activada por el visitante y con contenido SSR completo sin JS.
- [x] Alternates recíprocos HTML/sitemap para rutas equivalentes verificadas; `robots.txt`, smoke test del `dist/` y gate de CI.
- [ ] Confirmar el uso efectivo del README de perfil y revisar contenido académico completo del CV descargable; no editar README sin autorización.
- [ ] Auditar manualmente con lector de pantalla y medir CWV reales; el smoke test no los sustituye.
- [ ] Los apartados pendientes requieren contenido verificable; no publicar páginas de relleno.

## P0 — Asegurar el terreno (fundación en curso)

1. **Confirmar hechos sensibles:** papel real de `README.md` en el perfil GitHub, situación académica y enlaces del CV, vigencia de perfiles sociales y permiso de publicación de medios. No modificar README sin consentimiento.
2. **Rutas i18n en una rama incremental:** prototipar `/es/`, `/en/` y raíz neutral en Astro 6 con `prefixDefaultLocale: true`, sin romper `/blog/`, `/tags/`, RSS y GitHub Pages. Probar builds y archivos generados para ambas lenguas; ninguna ruta faltante.
3. **Pruebas de URLs y metadata:** canonical, `hreflang` real y recíproco, sitemap no engañoso, sitemap/robots, OG, language switch con página equivalente y alternativa para traducción ausente. Asegurar que una URL directa no se redirige por preferencia local.
4. **Modelo mínimo de contenido:** IDs y dominios multi-etiqueta tipados, utilidad de relaciones verificadas y detección de traducciones presentes. Empezar con CV/listado real y cero proyectos ficticios.
5. **Fundación visual accesible:** tokens claros, CSS reduced-motion, landmarks, skip link, focos visibles, botones reales, labels sociales, headings semánticos. No re-tematizar todo el blog de una vez.

**Gate P0:** `format:check`, `lint:check`, `astro check`, `astro build` exitosos; snapshots/smoke de `/`, `/es/`, `/en/`, rutas legadas y enlaces; CV actual accesible bajo `/cv/` localizado antes del cambio de `/`; contenido histórico conservado o respaldado. Si no se cumplen, no hacer el corte de home.

## P1 — Primer recorrido completo

1. Shell ligero: navegación bilingüe responsiva, footer reducido, selector ES/EN que mantiene ID y acceso al CV.
2. Home narrativo a partir de identidad y ejemplos **confirmados**: tesis, cuatro sistemas como continuum, trabajo/investigación verificados, experimento con estado real, nota reciente si existe, about/contacto. Fallback editorial cuando falte una categoría, sin tarjetas vacías.
3. `/work/`, `/research/`, `/lab/` primero con vistas útiles cuando haya material validado; `/systems/` como explicación de relaciones, no skill ratings. Diseño de caso Phureja listo para métodos, figuras, referencias y resultados con procedencia.
4. `/about/` y `/cv/` localizados, con enlaces de descarga correctos; preparar figuras reales y traducción técnica revisada. No mostrar retrato de perfil por preferencia del propietario.

**Gate P1:** se puede navegar desde la portada a contenido real en ambos idiomas; ambos menús funcionan en móvil/teclado/reduced motion; URLs equivalentes, metadatos y enlaces del CV verificados; pruebas visuales a tamaños estrechos; build estático sin regresión de blog/RSS.

## P2 — Red de contenido

- Publicar `/notes/` (digital garden) con notas verificadas y proceso editorial; migrar `/blog/` solo con mapa de URLs y destino equivalente.
- Páginas de detalle avanzadas de trabajo, investigación y lab; backlinks y relaciones entre IDs.
- Búsqueda estática por idioma cuando exista masa crítica: índice local por `(kind,id,locale)`, sin resultados traducidos duplicados. Añadir command palette accesible `⌘K`/`Ctrl+K` solo sobre el índice probado.
- Revisar si alguna isla React mejora interacción; instalar React + integración **en esa entrega**, medir coste, evitar hidratación del shell.

**Gate P2:** búsqueda navegable por teclado y lector de pantalla; resultados presentes solo en idioma activo salvo alternativa clara; relaciones sin links rotos, perfil de JS y accesibilidad sin regresiones.

## P3 — Exploración y visualización

- `/explore/` como visualización alternativa del grafo **después** de acumular IDs y relaciones reales; lista textual/teclado accesible de los mismos enlaces.
- Visualizaciones específicas (genoma, pipelines, agente, redes, IoT) con fuentes/leyendas/datos, alternativas y métricas auditadas.
- Animación avanzada seleccionada tras medir beneficio y rendimiento. ObsidianUI solo como fuente de patrones/fragmentos revisados y adaptados; no importar un kit completo.

**Gate P3:** una visualización añade comprensión no ofrecida por texto sencillo; funciona en móvil/reduced motion y no bloquea el contenido, con datos científicamente verificables.

## Cadencia de cambios y commits

Agrupar por intención y pasar CI en cada cambio: `docs: audit current architecture`, `feat: introduce locale-aware routing`, `feat: add light-first design tokens`, `refactor: migrate verified CV content`, `feat: build systems narrative`. No usar commits gigantes ni reescribir historial. Crear `docs/DEVELOPMENT.md` cuando existan scripts de migración y tests nuevos; el README raíz sigue reservado a perfil público.

## Riesgos a vigilar continuamente

- El README actual no cumple inequívocamente su contrato de perfil: revisar antes de cualquier cambio allí.
- GitHub Pages no hace negociación de idioma, redirecciones por servidor ni SSR; el selector raíz debe funcionar en estático.
- MDX soporta islas, pero la ciencia exige procedencia de métricas y alt/alternativas; no convertir notas privadas sin revisión.
- Sitemap i18n automático puede inventar alternates en traducciones parciales y clasificar rutas legadas sin prefijo como español: inspeccionar XML real.
- Las tecnologías AI/IoT propuestas en el prompt son **candidatas de inventario**, no logros verificados.

Consultar [CURRENT_ARCHITECTURE.md](./CURRENT_ARCHITECTURE.md) para el inventario actual, [I18N_ARCHITECTURE.md](./I18N_ARCHITECTURE.md) para SEO/rutas, y el inventario editorial privado (`.private/CONTENT_TODO.md`, fuera del repositorio público) para las brechas editoriales.

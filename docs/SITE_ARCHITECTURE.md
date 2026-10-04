# Arquitectura objetivo del sitio

## Producto y decisión técnica

El sitio evoluciona de un CV/blog a un sistema público de investigación y construcción técnica: biología ↔ datos ↔ computación ↔ software ↔ inteligencia ↔ mundo físico. La navegación debe revelar conexiones reales, no reunir categorías aisladas de habilidades. La primera entrega de implementación será una portada bilingüe con base sólida; **no** un grafo, buscador y visualizaciones terminados.

**Stack objetivo incremental:** conservar Astro 6, TypeScript estricto, Content Layer/MDX, Tailwind 3 existente, Expressive Code, pnpm y GitHub Pages (sitio prerenderizado). `@astrojs/react`, `react` y `react-dom` ya se incorporaron para `SystemsExplorer` como isla localizada bajo `client:visible`, no como SPA envolvente ni dependencia de todas las páginas. El HTML inicial contiene toda la secuencia y la interacción solo reemplaza la vista cuando el visitante la solicita. Mantener dependencia de motion en evaluación hasta un caso de uso y una medición concretos; ningún CMS o servicio backend inicialmente.

**Decisión actual del propietario:** `/` conserva el selector neutral `x-default` ES/EN en la primera visita; después reutiliza la elección explícita guardada en `site.locale` mediante un script inline temprano. No se decide por el idioma del navegador y las URLs directas conservan su idioma. `/en/` y `/es/` son las rutas canónicas completas. Detalles en [I18N_ARCHITECTURE.md](./I18N_ARCHITECTURE.md).

## Mapa de rutas objetivo

```text
/                         selector de idioma, x-default
/es/ y /en/              portada narrativa
/{lang}/work/            trabajos técnicos curados
/{lang}/work/{slug}/     casos de estudio
/{lang}/research/        investigaciones
/{lang}/research/{slug}/
/{lang}/systems/         arquitecturas y sistemas
/{lang}/systems/{slug}/  solo cuando haya contenido sustancial
/{lang}/lab/             cuaderno experimental
/{lang}/lab/{slug}/
/{lang}/notes/           jardín técnico/científico
/{lang}/notes/{slug}/
/{lang}/about/           tesis personal
/{lang}/cv/              representación convencional y descargas verificadas
/{lang}/explore/         futuro: vista alternativa del grafo
/blog/, /blog/{slug}/, /tags/..., /rss.xml    rutas legadas durante la migración
```

`/{lang}` es notación conceptual; las rutas dinámicas usan `getStaticPaths()` y se prueban con la configuración de i18n de Astro. No publicar páginas vacías solo por completar el mapa. Etiquetas de menú cortas en ambos idiomas; opciones secundarias para idioma, búsqueda (cuando exista) y tema (si se conserva). La portada enlaza solo trabajo real o entradas con estado explícito; no relleno sintético.

### Compatibilidad de rutas

- Mantener `/` funcional durante toda la migración. Antes de convertirlo en selector, publicar y probar `/es/` con contenido equivalente al CV actual en `/es/cv/` o migración de CV de igual calidad. Hacer corte de `/` en una única entrega de navegación y enlaces; conservar un acceso claro al CV.
- Conservar `/blog/`, `/blog/{slug}/`, `/tags/` y `/rss.xml` mientras existan enlaces entrantes, aun cuando las listas estén vacías; decidir `/notes/` versus blog mediante redirecciones probadas por URL cuando haya contenido. **GitHub Pages solo sirve archivos estáticos:** implementar redirects legados únicamente con un mecanismo compatible (página HTML de redirección estática o conservación de ruta); no asumir reglas de servidor.
- `404.html` se debe mantener como página estática compartida y localizada cuando sea viable, con enlaces explícitos a `/es/` y `/en/`.

## Capas y responsabilidades

```text
src/
  pages/                 rutas delgadas + getStaticPaths + metadata
    index.astro          selector raíz neutral
    [lang]/              páginas públicas ES/EN (plan a validar con Astro i18n)
    blog/, tags/         rutas legadas durante transición
  layouts/               documento, landmarks, slots y metadatos por locale
  components/
    layout/              header/footer/skip link/contenedores
    navigation/          menú, selector de idioma, breadcrumbs
    content/             encabezados, prosa, relaciones, media
    motion/              mejora progresiva (cuando se necesite)
    research/, projects/, lab/, notes/
    visualizations/      SVG explicativo o islas interactivas por caso
    search/, graph/      etapas posteriores
  content/               Markdown/MDX + JSON/YAML verificados
  content.config.ts      colecciones y esquemas Zod
  i18n/                  mensajes UI, URL helpers, equivalencias y disponibilidad
  data/                  taxonomía estable, CV validado y metadatos compartidos
  styles/                tokens, base, prosa, motion
  utils/                 fechas, enlaces y consultas de contenido
```

Las páginas Astro consultan las colecciones durante el build; los componentes `.astro` producen HTML semántico sin hidratación. Los componentes React reciben solo datos serializables filtrados y se hidratan con `client:visible` o `client:idle` si la interacción lo requiere; usar `client:load` únicamente para controles imprescindibles al inicio. Contenido, enlaces y estados deben existir como HTML incluso si JS falla. MDX permite visualizaciones puntuales, con alternativa textual y componente estático si no existe JS.

## Modelo de relaciones y relato

Cada entrada tiene un ID estable y cero o más `domains` de `biological | intelligent | computational | physical`. Relaciona IDs tipados (`concepts`, `projects`, `research`, `notes`, `experiments`) **solo si el destino existe**. El modelo de datos debe poder alimentar backlinks, módulos “relacionado con” y un futuro `/explore/`; el grafo visual será una proyección, no la fuente de verdad. Ver [CONTENT_MODEL.md](./CONTENT_MODEL.md).

Portada propuesta, sujeta a contenido validado: tesis/posición; cuatro sistemas presentados como un circuito de observación y acción; trabajo seleccionado; investigación destacada; arquitectura de sistemas inteligentes; experimentos; notas recientes; about/contacto. `/cv/` conserva educación y experiencia sin dominar el home. `/research/` expresa problema, métodos, figuras, evidencia y límites; `/work/` expresa problema, arquitectura, implementación, resultados y lecciones; `/lab/` admite hipótesis y fracasos etiquetados.

## ObsidianUI: encaje selectivo, no tema global

El catálogo [ObsidianUI](https://www.obsidianui.dev/components) ofrece **código fuente para React** personalizable, no componentes Astro nativos. Sus manifiestos de registro revelan dependencias y costes distintos:

| Patrón                                                                     | Uso posible                                  | Decisión inicial                                                                                                                                       |
| -------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Scroll Stack](https://www.obsidianui.dev/docs/scroll-stack)               | Relación y progresión de los cuatro sistemas | **Estudiar y prototipar más adelante**: manifiesto usa GSAP/ScrollTrigger y React; en móvil/reduced motion mostrar cuatro secciones lineales completas |
| [Text Fill Animation](https://www.obsidianui.dev/docs/text-fill-animation) | Destacar una tesis breve al leer             | Opcional, no bloquear lectura; depende de GSAP, `clsx`, `tailwind-merge`                                                                               |
| [Parallax Gallery](https://www.obsidianui.dev/docs/parallax-gallery)       | Secuencia de medios de investigación reales  | Posponer hasta tener medios; manifiesto requiere GSAP y Motion                                                                                         |
| Dotted Grid                                                                | Fondo científico sutil                       | **No adoptar el ejemplo original**: manifiesto implementa canvas animado con interacción continua; CSS/SVG estático es más apropiado aquí              |
| Interactive Blur Reveal                                                    | Descubrir detalles por puntero               | **No adoptar inicialmente**: manifiesto contiene lógica WebGL extensa; contenido no puede depender de hover ni GPU                                     |
| Masonry/horizontal scroll y similares                                      | Inventario heterogéneo de trabajos           | Usar CSS Grid y scroll nativo primero; considerar una isla si existe una necesidad probada y fallback móvil/accesible                                  |

No ejecutar instaladores de componentes indiscriminadamente. Si se adopta uno, descargar **solo** el manifiesto exacto, revisar licencia (ObsidianUI se publica como MIT), dependencias, helpers, soporte de reduced motion, accesibilidad por teclado, compatibilidad con Astro/Tailwind y tamaño final. Adaptarlo al lenguaje visual propio y medir su coste en la página relevante. Referencias: [guía para agentes](https://www.obsidianui.dev/agent-instructions.md), [registro](https://www.obsidianui.dev/r/registry.json), [Astro React](https://docs.astro.build/en/guides/integrations-guide/react/).

## Calidad y contrato de despliegue

- Build prerenderizado y verificado con `pnpm run format:check`, `pnpm run lint:check`, `pnpm exec astro check`, `pnpm build` (sin cambios al workflow hasta necesidad demostrada).
- Validar rutas ES/EN en `dist/`, canonicals/hreflang solo entre páginas equivalentes, sitemap, RSS y 404. Fijar tests para enlaces internos y referencias de contenido antes de publicar colecciones grandes.
- Semántica `header/nav/main/footer`, un `h1` por página, skip link, foco visible, contraste, contenido sin hover, medios con alt descriptivo, `prefers-reduced-motion` en toda interacción.
- Presupuesto inicial orientativo para **JS añadido**: 0 KiB de React en rutas de texto/CV y ≤80 KiB gzip por isla inicial si la interacción lo justifica; revisar con build/análisis real antes de aceptar una biblioteca GSAP/WebGL. No confundir peso sin comprimir de `dist/` con transferencia.
- Optimizar imágenes con Astro; formatos modernos cuando sea posible, dimensiones estables; diferir galerías/datos hasta visibles. Medir Lighthouse/Core Web Vitals en dispositivos representativos antes/después; ningún dato de CWV ha sido medido en esta fase.

## Orden de migración

1. Congelar línea base y corregir las fuentes de verdad del contenido (README, CV y enlaces). Documentar sin alterar producción.
2. Construir rutas y utilidades bilingües con pruebas de equivalencia; conservar legacy URLs.
3. Introducir tokens/layout/navegación y accesibilidad sin reescribir el blog.
4. Migrar CV a `/es/cv/` y `/en/cv/` con textos validados; publicar selector `/` y home narrativo progresivamente.
5. Añadir colecciones conforme existan contenidos verificados; solo entonces decidir React/motion, búsqueda y grafo.

El backlog y las condiciones de avance se detallan en [ROADMAP.md](./ROADMAP.md).

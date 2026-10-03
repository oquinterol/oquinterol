# Sistema de diseño — propuesta v0

Este documento define la **dirección objetivo**, no declara que las variables ya estén aplicadas. Referencia de producto: publicación científica × cuaderno de ingeniería × laboratorio de investigación. Ligero, editorial, claro por defecto y técnicamente preciso. La arquitectura visual explica relaciones entre sistemas en lugar de imitar una plantilla SaaS o un portfolio negro/neón.

## Principios

1. **Contenido antes que cromo.** Una figura o un extracto de método desplaza a un adorno si el espacio es limitado.
2. **Jerarquía por tipografía, espaciado, ritmo y reglas.** No envolver todas las secciones en tarjetas.
3. **Datos reales o ningún dato.** Ningún cromosoma, red o métrica simulada como si fuera experimental.
4. **Oscuro biopunk como identidad (decisión del propietario, 2026-10-02).** Paleta de `~/.config/biopunk/palette.json` en `src/styles/site.css`; el blog legado conserva su tema.
5. **Una sola familia de acentos.** Color con semántica (enlaces, estado, relaciones), no saturación arbitraria.

## Tokens candidatos (pendientes de prueba visual y contraste)

| Rol                | Claro     | Oscuro futuro | Aplicación                                   |
| ------------------ | --------- | ------------- | -------------------------------------------- |
| `--surface-page`   | `#FAF9F6` | `#141918`     | Fondo cálido, no blanco puro obligatorio     |
| `--surface-raised` | `#FFFFFF` | `#1D2523`     | Paneles/figuras donde aporten semántica      |
| `--text-primary`   | `#202824` | `#F3F2ED`     | Títulos y prosa                              |
| `--text-secondary` | `#4B5A53` | `#C0CBC5`     | Metadatos legibles                           |
| `--border-subtle`  | `#D6DDD8` | `#3A4741`     | Separadores y controles                      |
| `--accent`         | `#215F59` | `#8CCEC0`     | Enlaces, trazados, foco selectivo            |
| `--focus`          | `#12554E` | `#A6DFD3`     | Anillo visible, adicional a cambios de color |

Estos son **valores de diseño propuestos**, no contrastes certificados: comprobar WCAG AA para texto, estados hover/focus y gráficos sobre cada superficie en ambas lenguas y temas antes de implementarlos. Nunca codificar significado únicamente por tono; estados y dominios llevan etiqueta o forma. Los cuatro dominios no necesitan cuatro colores saturados: una base neutra y variaciones sutiles de patrones/diagrama son preferibles.

Tokens semánticos se sitúan en `src/styles/app.css` y Tailwind los consume por CSS variables; no duplicar valores hex en múltiples componentes. Conservar aliases actuales (`background`, `foreground`, `border`…) durante la transición o migrarlos mediante una capa compatible para no romper el blog.

## Tipografía

- **Lectura/UI:** Satoshi local ya disponible, con fallback `system-ui, sans-serif`. Verificar que los archivos tienen licencia de redistribución y añadir `font-display: swap`; optimizar a WOFF2 solo si la licencia lo permite.
- **Títulos:** Clash Display existente de forma contenida en encabezados grandes; probarlo en acentos en español, no imponerlo a todas las páginas. Una serif editorial para citas/títulos de investigación **solo si** aumenta legibilidad y hay fuente/licencia adecuada; no descargar familias indiscriminadamente.
- **Código/datos:** stack monospace del sistema primero; números tabulares (`font-variant-numeric: tabular-nums`) en tablas y métricas.
- Escala tentativa en rem: texto `1`, nota `0.875`, lead `1.25`, subtítulo `1.5`, sección `2–2.75`, portada `clamp(2.75rem, 6vw, 5.5rem)`; altura de línea de prosa `1.6–1.8`. Ajustar por pruebas en español/inglés.
- Cuerpo de lectura ~`65–75ch`, pero tablas, diagramas y figuras pueden usar contenedor ancho; longitud de línea no es ancho universal de página.

## Espaciado, composición y componentes

- Escala propuesta: `0.25`, `0.5`, `0.75`, `1`, `1.5`, `2`, `3`, `4`, `6`, `8` rem. Adaptar a utilidades Tailwind ya disponibles y usar tokens solo donde aporten consistencia.
- Tres anchos con intención: prosa ~`72ch`, contenido ~`72rem`, medios/figuras hasta ~`88rem` según contexto. No perpetuar `max-w-[60rem]` del CV en todo el sitio.
- Layout en columnas fluidas que colapsa a una columna para lectura móvil. Puntos de referencia Tailwind existentes (`sm`, `md`, `lg`) al iniciar; introducir nuevos breakpoints solo después de pruebas reales con titulares largos en español.
- Bordes finos con contraste suficiente; radios modestos (`0.25–0.75rem`) para controles y paneles; sombra suave solo para capas con profundidad real. `z-index` semántico: base `0`, header `10`, overlays `30`, diálogo `50` (si llega a existir).
- Estados: hover es complemento, no único acceso a información; `:focus-visible` con contorno evidente y espacio; targets táctiles cómodos (~44 × 44 CSS px); el menú debe funcionar por teclado sin JS cuando sea posible.
- Navegación primaria escueta: marca `OQ.`, Work/Research/Systems/Lab/Notes/About (labels localizados). CV y Explore pueden ocupar navegación secundaria mientras no haya contenido. Los encabezados largos deben envolver sin recortar.

## Patrones editoriales

- Hero: posición profesional respaldada por contenido; no “Hi, I’m…” ni habilidades en forma de barras o insignias masivas.
- Cuatro sistemas: un diagrama legible en estático con enlaces a descripciones, más una versión progresivamente interactiva si explica flujo real.
- Work: casos destacados con escala visual variable; experimentos pequeños en lista compacta, no mosaico homogéneo forzado.
- Research: título, pregunta, método, hallazgos comprobados y límites; figuras con fuente/alt, tabla accesible, texto que no dependa de visualización.
- Lab/Notes: fechas y estados explícitos, referencias cruzadas; metáfora de cuaderno, no landing comercial.
- CV: formato convencional estructurado, verificado y descargable sin monopolizar la portada.

## Fotografías, gráficos y medios

No mostrar el retrato de perfil: el propietario pidió retirarlo del sitio. Para fotografías de laboratorio y hardware, exigir consentimiento/autoría antes de publicar. Mantener alt descriptivo y créditos; arte puramente decorativo debe declararse como tal. Las figuras científicas deben registrar datos, unidades, leyenda, procedencia y fecha/versión. Usar optimización Astro `<Image />` para activos versionados cuando sea posible; reservar tamaño/aspect ratio para evitar cambios de layout. En móvil ofrecer tablas desplazables con contexto y versión textual de visualizaciones.

## Criterios de aceptación visual

Comparar portada, artículo y CV a 320/375/768/1280 px con textos completos ES/EN. Verificar lectura, focos, contraste real, navegación sin hover, pantallas estrechas para tablas/código y contraste de estados. Una futura opción oscura tendrá tokens revisados de forma independiente y coherencia con los temas de Expressive Code.

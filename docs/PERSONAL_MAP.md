# Mapa personal

El botón «Explorar conexiones / Explore connections» de la portada abre una lectura alternativa del sitio: una pregunta personal —**comprender cómo funcionan los sistemas que me rodean**— conectada con perspectivas, métodos, investigación, herramientas e ideas del laboratorio.

La presentación personal parte del relato del propietario: su interés por la vida, la informática y los procesos cotidianos, y por explorarlos desde su formación en biología, la programación y la electrónica. No se infieren hobbies, valores, experiencia ni logros a partir del uso de herramientas.

## Fuente de verdad

- `src/data/personal-map.ts`: textos ES/EN, posiciones editoriales y relaciones conceptuales con una explicación por enlace.
- `Home.astro`: entrega únicamente investigaciones publicadas y proyectos de laboratorio del idioma actual.
- Las descripciones de proyectos y los estados del laboratorio provienen de sus colecciones. Las etiquetas cortas y las relaciones se curan manualmente.
- GenomeAgent está rotulado «En desarrollo», de acuerdo con su entrada pública actual; revisar esa etiqueta cuando cambie su estado.
- Si falta una entrada en un idioma, no se dibuja su nodo ni sus relaciones. No se enlazan páginas inexistentes.

Las líneas no son dependencias técnicas, mediciones de afinidad ni resultados experimentales. La posición de un nodo sirve para leer el mapa; no representa datos cuantitativos.

## Interacción

`SystemsExplorer.tsx` conserva las cuatro perspectivas originales y ofrece una lectura HTML completa mediante `<details>`. El mapa se abre solo por acción del visitante en `PersonalMap.tsx`, dentro de un diálogo nativo.

- Seleccionar un nodo resalta sus relaciones y muestra sus explicaciones y enlaces.
- Mapa y lista presentan los mismos nodos. La búsqueda ignora mayúsculas y acentos y lleva a la lista.
- En móvil se empieza por la lista; el detalle se despliega junto al nodo seleccionado. El mapa sigue disponible con desplazamiento nativo y controles de escala.
- Escape cierra el diálogo, se restaura el foco al botón de entrada y se libera el scroll de la página.
- Los nodos son botones HTML; el SVG dibuja únicamente las relaciones. No hay simulación de fuerzas, autoplay, captura de rueda ni funciones que dependan de arrastrar o hacer hover.
- `prefers-reduced-motion` desactiva las transiciones del mapa. Sin JavaScript permanecen disponibles las ideas, los estados, los enlaces y las razones de todas las conexiones.

## Añadir contenido

1. Publicar la investigación o idea correspondiente en su colección, con su idioma y estado real.
2. Añadir su ID, etiqueta corta bilingüe y posición a `researchNodes` o `labNodes`.
3. Curar relaciones en `relationships`: cada una debe tener una razón ES/EN y destinos existentes. Las ideas de laboratorio ya se enlazan automáticamente con el laboratorio conectado.
4. Revisar la legibilidad, los solapamientos, el recorrido por teclado y ambas traducciones.
5. Ejecutar `pnpm run format:check`, `pnpm run lint:check`, `pnpm run build` y `pnpm run verify:site`. El smoke test comprueba el respaldo HTML, nodos únicos, relaciones válidas, explicaciones, ausencia de nodos aislados y estados visibles del laboratorio.

El mapa no importa bibliotecas nuevas de grafos ni añade servicios externos. Sus estilos están en `src/styles/personal-map.css`, que se carga únicamente en la portada.

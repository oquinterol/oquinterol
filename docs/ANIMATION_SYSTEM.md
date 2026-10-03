# Sistema de movimiento — contrato de interacción

> El movimiento comunica estructura; la interacción revela información.

Documento de decisiones, **no** una biblioteca instalada. Ninguna animación puede ocultar la tesis, cifras, enlaces o resultados cuando JS falla o `prefers-reduced-motion: reduce` está activo.

## Gramática propuesta

| Uso                                | Duración objetivo                    | Curva propuesta                   | Respaldo sin movimiento                     |
| ---------------------------------- | ------------------------------------ | --------------------------------- | ------------------------------------------- |
| Hover/foco de controles            | 120–180 ms                           | `ease-out`                        | Color, borde y foco visibles inmediatamente |
| Aparición de elementos secundarios | 180–320 ms                           | `cubic-bezier(.22, 1, .36, 1)`    | Elemento visible desde el inicio            |
| Transición de diagrama/etapa       | 350–600 ms                           | `ease-in-out` con pausas legibles | Todas las etapas en orden y etiquetadas     |
| Scroll narrativo excepcional       | Vinculado a progreso, no tiempo fijo | Transform/opacity                 | Secciones apiladas en flujo normal          |

Tokens posibles: `--motion-fast: 160ms`, `--motion-normal: 260ms`, `--motion-slow: 480ms`, `--ease-emphasized: cubic-bezier(.22, 1, .36, 1)`. No escalonar más de ~60 ms por elemento ni secuencias largas que atrasen la lectura. Una sola interacción dominante por viewport; elementos de lectura y navegación permanecen estables.

## Implementación progresiva

1. **Astro + CSS primero** para links, foco, secciones y diagramas SVG estáticos. La semántica y el orden de lectura no cambian con JS.
2. Si un reveal realmente mejora contexto, usar `IntersectionObserver` encapsulado y desconectarlo al terminar; no montar listeners por cada carácter ni calcular layout continuamente.
3. Usar React islands para interacción **con estado real** (explorar conexiones, seleccionar etapas del pipeline), con hidratación diferida (`client:visible`/`client:idle`) y fallback HTML equivalente.
4. Evaluar una biblioteca de motion solo después de un prototipo medido; no importar GSAP/Motion/WebGL globalmente. Componentes de ObsidianUI dependen de paquetes diferentes, por lo que copiar un demo puede introducir runtime desproporcionado.
5. Preferir `transform` y `opacity`; evitar animar `width`, `height`, `top`, filtros grandes o desenfoques permanentes. En galerías, respetar dimensiones y liberar animaciones fuera de pantalla.

## Accesibilidad obligatoria

```css
@media (prefers-reduced-motion: reduce) {
	/* Se desactivan secuencias, scroll suave y movimientos no esenciales.
     El contenido ya debe ser visible y utilizable en el DOM. */
}
```

`reduced motion` debe aplicarse también a animaciones JS (`matchMedia`, desmontaje/limpieza, sin autoplay) y a los pulsos existentes de enlaces CV/contacto. No usar movimiento perpetuo como única señal de estado. Toda funcionalidad hover tiene equivalente clic/toque/teclado; controles anuncian estado cuando corresponde. No crear scroll-trapping ni capturar rueda/teclas en una galería. El foco no puede desplazarse a un panel fuera de vista por animación.

## Casos candidatos y decisiones

- **Cuatro sistemas:** diagrama editorial estático primero. Probar scroll stack solo si expresa flujo biología ↔ medición ↔ cómputo ↔ inteligencia ↔ acción mejor que una secuencia accesible simple; en móvil y reduced motion, cuatro secciones convencionales visibles.
- **Pipeline Phureja:** etapas reales, etiquetas y evidencia; selección de una etapa con detalles y tabla/texto alternativos. No animar cromosomas ficticios.
- **Agentes científicos:** grafo de estados/acciones cuando haya arquitectura documentada; interacción revela contexto/evaluación, no humo visual.
- **Galería de laboratorio:** parallax sutil solo con fotografías legítimas y si no afecta lectura, CLS o batería.
- **Búsqueda/grafo:** transiciones de estados accesibles; no animar miles de nodos en segundo plano.

## Umbrales de revisión

El prototipo debe demostrar: utilidad para la comprensión, menú y contenido disponibles sin JS, cumplimiento `prefers-reduced-motion`, fluidez razonable en móvil modesto, ausencia de layout shifts perceptibles, tamaño de JS medido por ruta y no empeorar CWV frente a la línea base medida. Si falla cualquiera, volver a la variante estática. Consultar [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) para color/contraste y [SITE_ARCHITECTURE.md](./SITE_ARCHITECTURE.md) para límites de islas.

## Implementado (2026-10-02)

Tokens `--motion-*` y `--ease-emphasized` en `src/styles/site.css`; `useReducedMotion()` en `src/components/visualizations/` arranca en "reducido" para que el HTML del servidor nunca asuma movimiento.

| Pieza                     | Archivo                                     | Función estructural                                                                                                                                                                         | Datos                                                                  |
| ------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Hélice-índice (hero)      | `HelixNav.tsx`                              | Índice de la portada; abre la hélice en el enlace activo; cabezal traduce codones; botón pausar                                                                                             | Real: StSP6A, NCBI `NM_001287968.1` (`src/data/sequences.ts`)          |
| Pipeline de investigación | `PipelineExplorer.tsx` (`variant='genome'`) | Selector de etapas reales de la tesis; recorrido iniciado por el visitante                                                                                                                  | Esquema ilustrativo, rotulado                                          |
| Red del laboratorio       | `LabNetwork.tsx`                            | Dispositivos → gateway LoRa → Home Assistant; el `status` de cada entrada de `src/content/lab/` define su dibujo (idea = plano punteado, prototipo = pulso, experimental/activo = paquetes) | Colección `lab`; nunca muestra tráfico de un proyecto que no transmite |
| Red de habilidades (CV)   | `SkillsNetwork.tsx`                         | Filtro por área; la red se reorganiza; flujo hacia áreas conectadas; hover enlaza chip ↔ nodo                                                                                               | Inventario de `src/data/profile.ts`                                    |
| Texturas                  | `site.css`                                  | Grano global estático; retícula de microscopio en hero y figuras                                                                                                                            | —                                                                      |

Todas: contenido completo sin JS, pausa fuera de pantalla, sin autoplay perpetuo salvo la lectura de la hélice (pausable, WCAG 2.2.2).

Para avanzar un proyecto del laboratorio basta con editar `status`, `statusDate` y, cuando se decida, `link` (`lora` / `wifi`), `controller`, `measures` y `actions` en `src/content/lab/{es,en}/<id>.md`. La red y la línea de estado se actualizan solas.

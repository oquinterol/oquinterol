# Inventario de contenido pendiente de verificar

**No es contenido publicable.** Este archivo registra información faltante y fuentes potenciales para revisión editorial. El prompt inicial propone posibles trabajos; su mención aquí **no confirma autoría, resultados, estado, tecnologías ni permisos**. No copiar notas privadas, correos, resultados o archivos de investigación al sitio sin revisión y autorización.

## P0 — datos ya presentes en el repositorio

| Material                                          | Fuente actual                                                                 | Falta para publicarlo o migrarlo con seguridad                                                                                                                                                                          |
| ------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Formación en biología y bioinformática            | `src/data/profile.ts` y versión previa en git                                 | Revisar nombre/tildes, denominación exacta de títulos, estado y fechas. La biografía anterior decía que la maestría estaba en curso; se retiró esa frase de la nueva web. Verificar con CV/diploma antes de actualizar. |
| CV descargable ES/EN                              | URLs GitHub Releases en `src/data/profile.ts`                                 | Ambos PDF respondieron HTTP 200; revisar su contenido y vigencia editorial antes de atribuir títulos/fechas. No apuntar a `public/docs/resume_cv.pdf`: no está presente en el repositorio actual.                       |
| Contacto, GitHub, LinkedIn, ORCID, otros sociales | `src/data/profile.ts`, `SiteFooter.astro` y footer legado                     | Confirmar correo vigente, perfiles a mostrar/retirar, orden preferido y enlaces accesibles.                                                                                                                             |
| Foto de perfil                                    | `src/assets/Perfil.png`                                                       | El propietario pidió no mostrar retrato en el sitio; `Perfil.png` se conserva como archivo fuente, sin importarlo en ninguna página.                                                                                    |
| Bio actual y lista de herramientas                | `src/data/profile.ts` y páginas `/es/cv/`, `/en/cv/`                          | Revisar exactitud y convertir a CV/arquitecturas concretas; evitar presentar listas como resultados, experiencia profesional o estrellas.                                                                               |
| Blog y feeds                                      | `src/content/post/proximamente.md`, `src/pages/blog/`, `src/pages/rss.xml.js` | Solo hay un draft; reunir notas reales con permisos, fechas y versión ES/EN antes de poblar secciones.                                                                                                                  |
| Metadata social                                   | `src/site.config.ts`, `public/social-card.png`                                | La tarjeta sin retrato con firma ORCID y nombre completo ya está en `public/social-card.png`; el fallback OG de posts usa esa imagen. Pendiente revisar copy social específico por idioma y aprobación editorial final. |

## P1 — piezas editoriales por recopilar

| Candidato                                          | Estado verificado en ESTE repositorio                                                        | Lo que falta                                                                                                                                                                                                                                               |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Investigación de _Solanum tuberosum_ Group Phureja | Ahora hay un resumen bilingüe en `src/content/research/` con enlace a la tesis institucional | La tesis pública ya está enlazada; faltan revisión editorial de rol, datasets/versiones, métodos detallados, figuras con permisos y métricas finales con procedencia. Material externo personal puede servir de pista, no de evidencia pública automática. |
| Genómica de poblaciones / GBS                      | No está estructurada en el sitio                                                             | Pregunta, muestras públicas/autorizadas, pipeline, limitaciones, resultados confirmados, figuras/leyendas, enlaces, relación con investigación Phureja si se acredita.                                                                                     |
| Agente autónomo de ensamblaje                      | Mencionado como idea futura, sin fuente pública aquí                                         | Estado real (`concept`, `research`, `prototype`…), arquitectura evaluable, código si existe, criterios de evaluación y límites; **no** describir como agente ya ejecutado sin pruebas.                                                                     |
| Sistemas AI/MCP                                    | No inventariados aquí                                                                        | Seleccionar proyectos propios, separar experimentos de sistemas desplegados, arquitectura, evaluaciones y referencias a código.                                                                                                                            |
| Ecosistema 57uno                                   | Solo candidato del encargo                                                                   | Rol, URLs, capturas, alcance técnico, años y resultados con autorización.                                                                                                                                                                                  |
| LoRaWAN, ESP32, instrumentación                    | Solo candidatos del encargo                                                                  | Dispositivos/prototipos reales, fotografías propias, versiones de hardware, mediciones verificables y permisos.                                                                                                                                            |
| Linux/redes/HPC e infraestructura                  | Habilidades declaradas en CV                                                                 | Casos concretos con problema, arquitectura, rol, decisiones y resultados divulgables; no exponer configuraciones/credenciales.                                                                                                                             |
| Cuaderno `/lab/` y jardín `/notes/`                | No hay entradas publicadas                                                                   | Primera entrada con estado honesto y revisión técnica ES/EN; comprobar qué notas personales son aptas para publicación.                                                                                                                                    |

## Medios, ciencia y traducción: checklist por entrada

- [ ] Problema/pregunta y rol exacto de Oscar confirmados.
- [ ] Estado (idea/prototipo/activo/finalizado) sustentado por fuente o aclarado como plan.
- [ ] Imagen/diagrama/foto auténtica, alt, pie, fecha, crédito y permiso.
- [ ] Datos de figuras descargables o tabla textual; unidades, versiones y limitaciones.
- [ ] Número/afirmación cuantitativa con fuente primaria y contexto reproducible.
- [ ] Publicación, identificador DOI o enlace institucional comprobados; no inventar citas.
- [ ] URL de repositorio y demo probadas; no revelar datos sensibles del laboratorio.
- [ ] Traducción ES revisada por terminología; traducción EN revisada por naturalidad y precisión.
- [ ] ID estable, dominios múltiples y relaciones solo con destinos publicados.
- [ ] Fecha y estado editorial revisados; metadata SEO y CTA acordes a la página.

## Plantilla de inventario de proyecto

```markdown
## Nombre provisional del proyecto

ID estable:
Tipo: work / research / lab / note
Dominios: Biological / Intelligent / Computational / Physical (varios posibles)
Año (si se confirma):
Estado verificable:
Problema o pregunta:
Contexto:
Qué hice personalmente:
Arquitectura y decisiones técnicas:
Métodos y tecnologías comprobadas:
Resultados verificables (fuente, versión, fecha):
Limitaciones, errores y aprendizajes:
Medios, alt, crédito y permisos:
Código disponible:
Repositorio:
Enlace público:
Conceptos relacionados (IDs):
Investigación/notas/experimentos relacionados (IDs):
Disponibilidad y revisión ES:
Disponibilidad y revisión EN:
Fuentes por verificar:
```

Priorizar **un caso profundo y exacto** sobre diez tarjetas vacías. Ver [CONTENT_MODEL.md](./CONTENT_MODEL.md) para la estructura que recibe las piezas cuando estén revisadas.

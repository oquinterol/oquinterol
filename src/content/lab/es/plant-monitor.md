---
id: plant-monitor
locale: es
title: 'Monitor de plantas'
summary: 'Sensores de pH y humedad del sustrato que avisan cuando las plantas necesitan agua.'
status: idea
statusDate: 2026-10-03
link: tbd
repository: https://github.com/oquinterol/lab/tree/main/projects/plant-monitor
measures:
  - 'pH'
  - 'Humedad del sustrato'
actions:
  - 'Avisar cuando se requiere riego'
domains:
  - biological
  - physical
order: 3
---

## Qué resolvería

Saber cuándo regar a partir de mediciones del sustrato, en lugar de hacerlo por calendario.

## Cómo lo pienso

Sensores de pH y humedad en el sustrato → lecturas periódicas → Home Assistant envía un aviso cuando hace falta agua.

## Por definir

Sensores, frecuencia de medición, umbrales y enlace de comunicación.

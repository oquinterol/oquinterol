---
id: photobioreactor
locale: es
title: 'Fotobiorreactor con luz regulada'
summary: 'Un sistema para cultivar microalgas y cianobacterias como la espirulina, que mide la luz y regula los LED según lo que el cultivo necesita.'
status: idea
statusDate: 2026-10-03
link: tbd
repository: https://github.com/oquinterol/lab/tree/main/projects/photobioreactor
measures:
  - 'Intensidad de luz'
actions:
  - 'Regular la emisión de los LED'
domains:
  - biological
  - physical
order: 1
---

## Qué resolvería

Las microalgas y cianobacterias como la espirulina necesitan luz constante. En lugar de dejar los LED encendidos a una intensidad fija, el sistema mediría la luz que recibe el cultivo y ajustaría la emisión solo cuando haga falta.

## Cómo lo pienso

Sensor de luz → controlador → LED regulables, con las lecturas y el estado enviados a Home Assistant para registrar y automatizar.

## Por definir

Sensor, controlador, enlace de comunicación (LoRa o Wi-Fi) y criterios de regulación.

---
id: plant-monitor
locale: en
title: 'Plant monitor'
summary: 'Substrate pH and moisture sensors that send an alert when the plants need water.'
status: idea
statusDate: 2026-10-03
link: tbd
repository: https://github.com/oquinterol/lab/tree/main/projects/plant-monitor
measures:
  - 'pH'
  - 'Substrate moisture'
actions:
  - 'Alert when watering is needed'
domains:
  - biological
  - physical
order: 3
---

## What it would solve

Knowing when to water from substrate measurements rather than a fixed schedule.

## How I think about it

pH and moisture sensors in the substrate → periodic readings → Home Assistant sends an alert when water is needed.

## To be decided

Sensors, measurement frequency, thresholds, and communication link.

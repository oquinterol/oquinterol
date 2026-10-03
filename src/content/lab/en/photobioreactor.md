---
id: photobioreactor
locale: en
title: 'Light-regulated photobioreactor'
summary: 'A system for growing microalgae and cyanobacteria such as spirulina that measures light and drives the LEDs according to what the culture needs.'
status: idea
statusDate: 2026-10-03
link: tbd
repository: https://github.com/oquinterol/lab/tree/main/projects/photobioreactor
measures:
  - 'Light intensity'
actions:
  - 'Regulate LED output'
domains:
  - biological
  - physical
order: 1
---

## What it would solve

Microalgae and cyanobacteria such as spirulina need constant light. Instead of running the LEDs at a fixed intensity, the system would measure the light reaching the culture and adjust the output only when needed.

## How I think about it

Light sensor → controller → dimmable LEDs, with readings and state sent to Home Assistant for logging and automation.

## To be decided

Sensor, controller, communication link (LoRa or Wi-Fi), and regulation criteria.

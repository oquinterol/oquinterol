---
id: shaking-incubator
locale: en
title: 'Controlled shaking incubator'
summary: 'An incubator whose shaking is controlled by an ESP32 and integrated with Home Assistant to automate how it runs.'
status: idea
statusDate: 2026-10-03
link: tbd
repository: https://github.com/oquinterol/lab/tree/main/projects/shaking-incubator
controller: ESP32
measures: []
actions:
  - 'Control shaking'
domains:
  - biological
  - physical
order: 2
---

## What it would solve

Control culture shaking from an ESP32 and bring its state into Home Assistant to schedule and automate incubation.

## How I think about it

An ESP32 as the shaking controller, connected to the lab's central system.

## To be decided

Variables to measure, shaking mechanism, and communication link.

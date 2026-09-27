# BocaSpeak — Master Build Direction

## Product
Offline-first English learning for Spanish-speaking learners, initially Colombia.

## Two experiences
- Student App: simple, mobile-first, offline-first learning.
- Teacher Studio: desktop-first planning, content, assignments, pronunciation editing and progress.

## Core principle
The application must remain useful with all AI services turned off. AI is an invisible optional service for teacher assistance and selected online features, not the product's foundation.

## Local-first direction
Student device should eventually use SQLite WASM + OPFS (with compatibility fallback), with a PostgreSQL cloud database for shared/synchronised data. Learning activity should be event-oriented and lessons versioned to reduce sync conflicts.

## Voice
Prefer pre-generated lesson audio for reliable offline playback. Device speech synthesis can be a fallback. Universal offline speech recognition is not promised until supported technologies are tested on target devices.

## Prototype status
The current prototype deliberately uses browser persistence rather than the final SQLite/OPFS adapter. It demonstrates the user experience and information architecture before adding authentication, sync and cloud infrastructure.

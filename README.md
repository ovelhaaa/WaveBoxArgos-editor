# Wavebox Argos - Web MIDI Editor

A completely browser-based, client-side MIDI editor and librarian for the **Wavebox Argos** pedal.

## Overview

This project provides a reliable and clear user interface for managing presets and editing parameters of the Wavebox Argos. It connects directly to the pedal via the **Web MIDI API** natively supported by modern browsers (Google Chrome, Microsoft Edge, etc).

## Getting Started

### Prerequisites
- Node.js (v18+)
- A modern browser that supports the Web MIDI API (e.g., Google Chrome).

### Installation & Execution

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the local server URL (usually `http://localhost:5173`).

### Tests
To run unit and integration tests:
```bash
npm run test
```
*(Tests are powered by Vitest).*

## Architecture & Technology Stack

- **Framework:** React + TypeScript + Vite
- **Styling:** Tailwind CSS (for rapid, maintainable, and responsive UI)
- **State Management:** Zustand (for lightweight, boilerplate-free state logic)
- **Validation:** Zod (for domain model validation against the manual limits)
- **MIDI Layer:** Abstract `ArgosMidiPort` built over the native `WebMidi.MIDIAccess`.

### Domain Logic & UX Safety

- The UI respects all minimum and maximum limits for parameters exactly as defined in the official manual (e.g., Treble from -12dB to +12dB).
- **Factory Presets Protection:** Presets 1-10 are explicitly labeled as factory defaults. If you attempt to save an edit made to a factory preset, the app will safely divert you to a "Save As" flow, forcing you to pick a slot between 11 and 40.
- All unsaved edits are clearly signaled by a "Unsaved changes" indicator.

## MIDI Protocol & Hardware Limitations (V1)

**IMPORTANT: Assumptions and Stubs**

As per the official Wavebox Argos manual provided, the documentation explicitly defines how to send **Program Changes (1-40)** for preset selection and mentions the capability of **Control Changes** for Volume/Expression.

However, the manual **does not document** the precise `SysEx` (System Exclusive) protocol or individual CC strings to dump/synchronize the *entire* state of a preset back to the editor natively.

Therefore, for this V1 release:
1. **Unidirectional Control:** The editor successfully connects, sends parameter changes, and sends Program Changes to switch presets.
2. **Local Librarian:** Reading/writing a complete preset currently relies on the *local browser storage (`localStorage` via Zustand persist)* rather than polling the pedal for a hardware dump.
3. **Stubs for Snyc:** The `readPreset` and `writePreset` functions in `src/midi/adapter.ts` are implemented as **stubs** with clear `TODO` comments.

**Future Discovery:**
To reach full two-way synchronization, the physical hardware's SysEx dump messages must be sniffed and reverse-engineered, or an updated official MIDI implementation chart must be acquired. Once discovered, they can easily replace the stubs within the isolated `ArgosMidiAdapter`.

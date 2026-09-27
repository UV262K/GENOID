# GENOID

Genoid is an Electron + React desktop AI companion prototype.

## Stack

- Electron
- React
- Vite
- Three.js / React Three Fiber
- Gemini API proxy through the Electron main process
- Local JSON memory and personality storage

## Features

- AI conversation through the Gemini API
- Local memory key/value storage
- Configurable companion personality
- 3D model panel with Three.js
- Electron desktop window with a Vite development workflow

## Project structure

```
GENOID/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   └── components/
│       └── Tiger3DPanel.jsx
├── main.js
├── preload.js
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
└── .env.example
```

## Setup

1. Install Node.js.
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env`.
4. Add your Gemini API key to `.env`.
5. Start the development app:

```bash
npm run dev
```

## Production build

```bash
npm run build
npm start
```

## Notes

The current 3D panel is a prototype and loads the Three.js sample Duck GLB at runtime. The component is named `Tiger3DPanel`, but the current model is not a tiger.

Do not commit `.env` or `db.json`. `.env` contains secrets and `db.json` can contain local conversation history and memory.

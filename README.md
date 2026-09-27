# 🤖 GENOID

An Electron + React desktop AI companion prototype combining conversational AI, local memory, configurable personality, and a Three.js-powered 3D interface.

## ✨ Features

- 💬 AI conversations through the Gemini API
- 🧠 Local key/value memory
- 🎭 Configurable companion personality
- 🖥️ Electron desktop application
- ⚛️ React + Vite frontend
- 🧊 Three.js / React Three Fiber 3D interface
- 🔐 Gemini API handled through the Electron main process
- 💾 Local JSON storage for memory and conversation data

## 🏗️ Architecture

```text
┌─────────────────────────────┐
│       React Renderer        │
│        GENOID UI            │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      Electron Preload       │
│        IPC Bridge           │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      Electron Main          │
│  Gemini Proxy + Local Data  │
└──────────────┬──────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
     Gemini API    db.json
```

## 🛠️ Tech Stack

| Technology | Role |
|---|---|
| Electron | Desktop application runtime |
| React | UI |
| Vite | Development/build tooling |
| Three.js | 3D rendering |
| React Three Fiber | React-based 3D scene |
| Gemini API | Conversational AI |
| Node.js | Electron backend/runtime |
| JSON | Local memory/personality storage |

## 📁 Project Structure

```text
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

## 🚀 Setup

### Requirements

- Node.js
- A Gemini API key

### Installation

```bash
git clone https://github.com/UV262K/GENOID.git
cd GENOID
npm install
```

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

Then add your Gemini API key:

```text
GEMINI_API_KEY=your_gemini_api_key_here
```

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

## 🔐 Security

Never commit your real `.env` file or API keys.

Local `db.json` data is also excluded because it can contain conversation history and memory.

## 🧪 Current 3D Prototype

The current 3D component is a prototype and loads the Three.js sample Duck GLB at runtime. The component is currently named `Tiger3DPanel`, but the loaded model is not yet a tiger.

## 🗺️ Roadmap

- Replace the prototype 3D model with the intended character
- Improve conversational memory
- Add richer personality controls
- Add voice interaction
- Add persistent settings
- Package the application for distribution
- Improve UI/UX and error handling

## 👨‍💻 Author

**Yuvraj Singh Pathania**

B.Sc. Computer Science (Hons.) — Cloud Computing  
MIT World Peace University, Pune

GitHub: [@UV262K](https://github.com/UV262K)

// main.js - Electron main with simple JSON memory + Gemini proxy

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// If your Node < 18 and you installed node-fetch@2, uncomment:
// const fetch = require('node-fetch');

const DB_FILE = path.join(__dirname, 'db.json');

// ensure db exists
function loadDB() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    const initial = { memory: {}, personality: { name: 'Mika', species: 'Tiger', style: 'anime' }, history: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
}
function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// helper: append conversation history (limited)
function appendHistory(entry) {
  const db = loadDB();
  db.history = db.history || [];
  db.history.push({ ...entry, ts: new Date().toISOString() });
  // keep only last 200 messages
  if (db.history.length > 200) db.history = db.history.slice(-200);
  saveDB(db);
}

// Compose system prompt using personality + memory
function buildPrompt(userPrompt) {
  const db = loadDB();
  const personality = db.personality || { name: 'Mika', species: 'Tiger' };
  // pick some memory snippets (simple)
  const mem = db.memory || {};
  const memSnippets = Object.entries(mem).slice(-6).map(([k,v]) => `${k}: ${v}`).join('\n');

  const system = `
You are ${personality.name}, an anime-style ${personality.species} companion. You are friendly, curious, and concise.
Personality traits: ${JSON.stringify(personality)}
Recent memory: ${memSnippets || 'none'}
Rules: keep responses under 180 words. If the user asks to do anything unsafe, refuse politely.
`;

  const prompt = `${system}\nUser: ${userPrompt}\nAssistant:`;
  return prompt;
}

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000, height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL;
  if (devUrl) mainWindow.loadURL(devUrl);
  else mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));

  mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);
app.on('window-all-closed', ()=> { if (process.platform !== 'darwin') app.quit(); });

/* IPC handlers */

// Ask -> call Gemini
ipcMain.handle('genoid:ask', async (event, prompt) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) return "Error: No GEMINI_API_KEY in .env";

  const fullPrompt = buildPrompt(prompt);
  appendHistory({ role: 'user', text: prompt });

  try {
    const resp = await fetch('https://generativeai.googleapis.com/v1beta2/text:generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        // adapt this payload to the exact GEMINI API payload/version you have
        prompt: fullPrompt,
        max_output_tokens: 400,
        temperature: 0.6
      })
    });

    const json = await resp.json();
    console.log('Gemini response:', JSON.stringify(json).slice(0,4000));

    // safe extraction: these fields vary by API version
    const text = json?.candidates?.[0]?.content || json?.output?.[0]?.content || (json?.response ? JSON.stringify(json.response) : JSON.stringify(json));
    appendHistory({ role: 'assistant', text });
    return text;
  } catch (err) {
    console.error('Gen error', err);
    return 'Error contacting Gemini: ' + (err.message || String(err));
  }
});

// Memory ops: remember key/value
ipcMain.handle('genoid:remember', async (event, key, value) => {
  const db = loadDB();
  db.memory = db.memory || {};
  db.memory[key] = value;
  saveDB(db);
  return { ok: true };
});

ipcMain.handle('genoid:getMemory', async (event, key) => {
  const db = loadDB();
  return db.memory ? db.memory[key] : null;
});

ipcMain.handle('genoid:getAllMemory', async () => {
  const db = loadDB();
  return db.memory || {};
});

// Personality read/write
ipcMain.handle('genoid:setPersonality', async (event, profile) => {
  const db = loadDB();
  db.personality = profile || db.personality;
  saveDB(db);
  return { ok: true };
});
ipcMain.handle('genoid:getPersonality', async () => {
  const db = loadDB();
  return db.personality || { name: 'Mika' };
});

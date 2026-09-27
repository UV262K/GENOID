// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // send a prompt, receive text reply (calls main -> Gemini)
  ask: (prompt) => ipcRenderer.invoke('genoid:ask', prompt),

  // memory operations
  remember: (key, value) => ipcRenderer.invoke('genoid:remember', key, value),
  getMemory: (key) => ipcRenderer.invoke('genoid:getMemory', key),
  getAllMemory: () => ipcRenderer.invoke('genoid:getAllMemory'),

  // set personality profile
  setPersonality: (profile) => ipcRenderer.invoke('genoid:setPersonality', profile),
  getPersonality: () => ipcRenderer.invoke('genoid:getPersonality')
});

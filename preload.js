const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectDirectory: () => ipcRenderer.invoke('select-directory'),
    searchImages: (directoryPath, searchTerm) => ipcRenderer.invoke('search-images', directoryPath, searchTerm),
    getFileSize: (size) => ipcRenderer.invoke('get-file-size', size)
}); 
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectDirectory: () => ipcRenderer.invoke('select-directory'),
    searchImages: (directoryPath, searchTerm) => ipcRenderer.invoke('search-images', directoryPath, searchTerm),
    getFileSize: (size) => ipcRenderer.invoke('get-file-size', size),
    compressImages: (imagePaths, options) => ipcRenderer.invoke('compress-images', imagePaths, options),
    compressSingleImage: (imagePath, options) => ipcRenderer.invoke('compress-single-image', imagePath, options),
    getCompressionSuggestions: (imagePath) => ipcRenderer.invoke('get-compression-suggestions', imagePath)
}); 
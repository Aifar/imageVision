const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectDirectory: (defaultPath) => ipcRenderer.invoke('select-directory', defaultPath),
    getDefaultCompressedFolder: () => ipcRenderer.invoke('get-default-compressed-folder'),
    searchImages: (directoryPath, searchTerm) => ipcRenderer.invoke('search-images', directoryPath, searchTerm),
    getFileSize: (size) => ipcRenderer.invoke('get-file-size', size),
    compressImages: (imagePaths, options) => ipcRenderer.invoke('compress-images', imagePaths, options),
    compressSingleImage: (imagePath, options) => ipcRenderer.invoke('compress-single-image', imagePath, options),
    getCompressionSuggestions: (imagePath) => ipcRenderer.invoke('get-compression-suggestions', imagePath)
}); 
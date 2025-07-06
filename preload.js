const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectDirectory: (defaultPath) => ipcRenderer.invoke('select-directory', defaultPath),
    getDefaultCompressedFolder: () => ipcRenderer.invoke('get-default-compressed-folder'),
    searchImages: (directoryPath, compressedFolderPath, searchTerm) => ipcRenderer.invoke('search-images', directoryPath, compressedFolderPath, searchTerm),
    getFileSize: (size) => ipcRenderer.invoke('get-file-size', size),
    compressImages: (imagePaths, options) => ipcRenderer.invoke('compress-images', imagePaths, options),
    compressSingleImage: (imagePath, options) => ipcRenderer.invoke('compress-single-image', imagePath, options),
    getCompressedInfo: (imagePath) => ipcRenderer.invoke('get-compressed-info', imagePath),
    getCompressionSuggestions: (imagePath) => ipcRenderer.invoke('get-compression-suggestions', imagePath),
    deleteOriginalImages: (imagePaths) => ipcRenderer.invoke('delete-original-images', imagePaths),
    showImportView: () => ipcRenderer.send('show-import-view'),
    refreshGalleryWall: (data) => ipcRenderer.send('refresh-gallery-wall', data),
    onRefreshGalleryWall: (callback) => ipcRenderer.on('refresh-gallery-wall', (event, data) => callback(data)),
    // 设置相关的API
    getSettings: () => ipcRenderer.invoke('get-settings'),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
    selectImageDirectory: (currentPath) => ipcRenderer.invoke('select-image-directory', currentPath),
    copyImagesToDirectory: (from, to) => ipcRenderer.invoke('copy-images-to-directory', { from, to }),
    logToMain: (msg) => ipcRenderer.send('debug-log', msg)
}); 
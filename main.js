const { app, BrowserWindow, ipcMain, dialog, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        titleBarStyle: 'hiddenInset',
        show: false
    });

    mainWindow.loadFile('index.html');

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // 开发环境下打开开发者工具
    if (process.argv.includes('--dev')) {
        mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// IPC 处理器
ipcMain.handle('select-directory', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    });

    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
    }
    return null;
});

// 递归搜索图片文件
function findImages(dir, imageFiles = []) {
    const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tiff', '.tif'];

    try {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                // 跳过 thumb 目录
                if (path.basename(filePath) !== 'thumb') {
                    findImages(filePath, imageFiles);
                }
            } else {
                const ext = path.extname(file).toLowerCase();
                if (supportedExtensions.includes(ext)) {
                    imageFiles.push(filePath);
                }
            }
        }
    } catch (error) {
        console.error(`扫描目录失败: ${dir}`, error);
    }

    return imageFiles;
}

// 确保 thumb 目录存在
function ensureThumbDirectory(directoryPath) {
    const thumbDir = path.join(directoryPath, 'thumb');
    if (!fs.existsSync(thumbDir)) {
        fs.mkdirSync(thumbDir, { recursive: true });
    }
    return thumbDir;
}

// 生成缩略图文件名
function generateThumbnailName(originalPath, thumbDir) {
    const fileName = path.basename(originalPath);
    const nameWithoutExt = path.parse(fileName).name;
    const ext = path.parse(fileName).ext;

    // 使用原始文件的相对路径来避免文件名冲突
    const relativePath = path.relative(path.dirname(thumbDir), originalPath);
    const safeName = relativePath.replace(/[\\/:]/g, '_');

    return path.join(thumbDir, `${safeName}_thumb${ext}`);
}

ipcMain.handle('search-images', async (event, directoryPath, searchTerm = '') => {
    try {
        const files = findImages(directoryPath);

        let filteredFiles = files;
        if (searchTerm) {
            filteredFiles = files.filter(file =>
                path.basename(file).toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 确保 thumb 目录存在
        const thumbDir = ensureThumbDirectory(directoryPath);

        const imageData = await Promise.all(
            filteredFiles.map(async (filePath) => {
                try {
                    const stats = fs.statSync(filePath);
                    const fileName = path.basename(filePath);

                    // 使用 nativeImage 来获取图片信息
                    const image = nativeImage.createFromPath(filePath);
                    const size = image.getSize();

                    // 创建缩略图
                    const thumbnailSize = { width: 200, height: 200 };
                    const aspectRatio = size.width / size.height;

                    if (aspectRatio > 1) {
                        thumbnailSize.height = Math.round(200 / aspectRatio);
                    } else {
                        thumbnailSize.width = Math.round(200 * aspectRatio);
                    }

                    const thumbnail = image.resize(thumbnailSize);

                    // 生成缩略图文件路径
                    const thumbnailPath = generateThumbnailName(filePath, thumbDir);

                    // 检查缩略图是否已存在，如果不存在则保存
                    if (!fs.existsSync(thumbnailPath)) {
                        const buffer = thumbnail.toPNG();
                        fs.writeFileSync(thumbnailPath, buffer);
                    }

                    return {
                        path: filePath,
                        name: fileName,
                        size: stats.size,
                        originalWidth: size.width,
                        originalHeight: size.height,
                        thumbnailWidth: thumbnailSize.width,
                        thumbnailHeight: thumbnailSize.height,
                        thumbnail: thumbnailPath, // 返回缩略图文件路径而不是 data URL
                        lastModified: stats.mtime
                    };
                } catch (error) {
                    console.error(`处理图片失败: ${filePath}`, error);
                    return null;
                }
            })
        );

        return imageData.filter(item => item !== null);
    } catch (error) {
        console.error('搜索图片失败:', error);
        throw error;
    }
});

ipcMain.handle('get-file-size', (event, size) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let fileSize = size;

    while (fileSize >= 1024 && unitIndex < units.length - 1) {
        fileSize /= 1024;
        unitIndex++;
    }

    return `${fileSize.toFixed(1)} ${units[unitIndex]}`;
}); 
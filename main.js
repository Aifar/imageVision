const { app, BrowserWindow, ipcMain, dialog, nativeImage, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const sharp = require('sharp');
const fse = require('fs-extra');

let mainWindow;
let importWindow = null;
let settingsWindow = null;

// 获取默认压缩文件夹路径
function getDefaultCompressedFolder() {
    const documentsPath = path.join(os.homedir(), 'Documents');
    const imagevisionPath = path.join(documentsPath, 'imagevision');

    // 确保目录存在
    if (!fs.existsSync(imagevisionPath)) {
        fs.mkdirSync(imagevisionPath, { recursive: true });
    }

    return imagevisionPath;
}

// 菜单多语言支持
function getMenuLang() {
    // 读取设置文件 language 字段，否则用系统语言
    const settingsPath = require('path').join(os.homedir(), '.imagevision-settings.json');
    let lang = 'zh';
    try {
        if (fs.existsSync(settingsPath)) {
            const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
            if (settings.language) lang = settings.language;
        } else {
            const sysLang = (process.env.LANG || 'zh').toLowerCase();
            if (sysLang.startsWith('en')) lang = 'en';
        }
    } catch { }
    return lang;
}
const translations = {
    zh: {
        feature: '功能',
        import: '导入',
        settings: '设置',
        quit: '退出'
    },
    en: {
        feature: 'Feature',
        import: 'Import',
        settings: 'Settings',
        quit: 'Quit'
    }
};
const lang = getMenuLang();
const t = key => (translations[lang] && translations[lang][key]) || key;

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

    mainWindow.loadFile('main.html');

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // 新增：应用菜单，增加"导入"和"设置"功能
    const template = [
        {
            label: t('feature'),
            submenu: [
                {
                    label: t('import'),
                    click: () => {
                        createImportWindow();
                    }
                },
                {
                    label: t('settings'),
                    click: () => {
                        createSettingsWindow();
                    }
                },
                { role: 'quit', label: t('quit') }
            ]
        },
        { role: 'editMenu' },
        { role: 'viewMenu' }
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    // 开发环境下打开开发者工具
    if (process.argv.includes('--dev')) {
        mainWindow.webContents.openDevTools();
    }
}

function createImportWindow() {
    if (importWindow) {
        importWindow.focus();
        return;
    }
    importWindow = new BrowserWindow({
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
        show: false,
        parent: mainWindow,
        modal: false
    });
    importWindow.loadFile('import.html');
    importWindow.once('ready-to-show', () => {
        importWindow.show();
    });
    importWindow.on('closed', () => {
        importWindow = null;
    });
}

function createSettingsWindow() {
    if (settingsWindow) {
        settingsWindow.focus();
        return;
    }
    settingsWindow = new BrowserWindow({
        width: 600,
        height: 600,
        minWidth: 500,
        minHeight: 500,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        titleBarStyle: 'hiddenInset',
        show: false,
        resizable: true,
        modal: true,
        parent: mainWindow
    });
    settingsWindow.loadFile('settings.html');
    settingsWindow.once('ready-to-show', () => {
        settingsWindow.show();
    });
    settingsWindow.on('closed', () => {
        settingsWindow = null;
    });
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
ipcMain.handle('select-directory', async (event, currentPath) => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
        defaultPath: currentPath || undefined
    });

    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
    }
    return null;
});

// 获取默认压缩文件夹路径
ipcMain.handle('get-default-compressed-folder', () => {
    return getDefaultCompressedFolder();
});

// 显示导入窗口
ipcMain.on('show-import-view', () => {
    createImportWindow();
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
                findImages(filePath, imageFiles);
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


// 获取压缩配置
function getCompressionConfig() {
    try {
        if (fs.existsSync(settingsPath)) {
            const settingsData = fs.readFileSync(settingsPath, 'utf8');
            const settings = JSON.parse(settingsData);

            return {
                jpeg: {
                    quality: settings.jpegQuality || 85,
                    progressive: true,
                    mozjpeg: true
                },
                png: {
                    quality: [0.6, 0.8],
                    speed: 4
                },
                gif: {
                    optimizationLevel: 3
                },
                webp: {
                    quality: settings.jpegQuality || 85
                }
            };
        }
    } catch (error) {
        console.error('读取压缩配置失败:', error);
    }

    // 默认配置
    return {
        jpeg: {
            quality: 85,
            progressive: true,
            mozjpeg: true
        },
        png: {
            quality: [0.6, 0.8],
            speed: 4
        },
        gif: {
            optimizationLevel: 3
        },
        webp: {
            quality: 85
        }
    };
}

// 使用 Sharp 压缩图片
async function compressImageWithSharp(inputPath, outputPath, options = {}) {
    try {
        const ext = path.extname(inputPath).toLowerCase();
        let sharpInstance = sharp(inputPath);
        const compressionConfig = getCompressionConfig();

        // 根据文件类型应用不同的压缩策略
        switch (ext) {
            case '.jpg':
            case '.jpeg':
                sharpInstance = sharpInstance.jpeg({
                    quality: options.quality || compressionConfig.jpeg.quality,
                    progressive: compressionConfig.jpeg.progressive,
                    mozjpeg: compressionConfig.jpeg.mozjpeg
                });
                break;
            case '.png':
                sharpInstance = sharpInstance.png({
                    quality: options.quality || compressionConfig.png.quality[1] * 100,
                    compressionLevel: 9
                });
                break;
            case '.webp':
                sharpInstance = sharpInstance.webp({
                    quality: options.quality || compressionConfig.webp.quality
                });
                break;
            case '.gif':
                // Sharp 对 GIF 支持有限，保持原格式
                break;
            default:
                // 其他格式保持原样
                break;
        }

        await sharpInstance.toFile(outputPath);
        return true;
    } catch (error) {
        console.error(`Sharp 压缩失败: ${inputPath}`, error);
        return false;
    }
}

// 使用 Imagemin 压缩图片
async function compressImageWithImagemin(inputPath, outputPath, options = {}) {
    try {
        // 动态导入 imagemin 模块
        const imagemin = (await import('imagemin')).default;
        const imageminMozjpeg = (await import('imagemin-mozjpeg')).default;
        const imageminPngquant = (await import('imagemin-pngquant')).default;
        const imageminGifsicle = (await import('imagemin-gifsicle')).default;
        const imageminWebp = (await import('imagemin-webp')).default;

        const ext = path.extname(inputPath).toLowerCase();
        const plugins = [];
        const compressionConfig = getCompressionConfig();

        // 根据文件类型选择压缩插件
        switch (ext) {
            case '.jpg':
            case '.jpeg':
                plugins.push(imageminMozjpeg({
                    quality: options.quality || compressionConfig.jpeg.quality,
                    progressive: compressionConfig.jpeg.progressive
                }));
                break;
            case '.png':
                plugins.push(imageminPngquant({
                    quality: options.quality || compressionConfig.png.quality,
                    speed: compressionConfig.png.speed
                }));
                break;
            case '.gif':
                plugins.push(imageminGifsicle({
                    optimizationLevel: compressionConfig.gif.optimizationLevel
                }));
                break;
            case '.webp':
                plugins.push(imageminWebp({
                    quality: options.quality || compressionConfig.webp.quality
                }));
                break;
        }

        if (plugins.length > 0) {
            const files = await imagemin([inputPath], {
                destination: path.dirname(outputPath),
                plugins: plugins
            });

            if (files.length > 0) {
                // 重命名文件到目标路径
                const compressedFile = files[0];
                if (compressedFile.destinationPath !== outputPath) {
                    fs.renameSync(compressedFile.destinationPath, outputPath);
                }
                return true;
            }
        }

        return false;
    } catch (error) {
        console.error(`Imagemin 压缩失败: ${inputPath}`, error);
        return false;
    }
}

// 智能图片压缩 - 优先使用 Sharp，失败时回退到 Imagemin
async function compressImage(inputPath, outputPath, options = {}) {
    // 首先尝试使用 Sharp
    const sharpSuccess = await compressImageWithSharp(inputPath, outputPath, options);

    if (sharpSuccess) {
        return { success: true, method: 'sharp' };
    }

    // 如果 Sharp 失败，尝试使用 Imagemin
    const imageminSuccess = await compressImageWithImagemin(inputPath, outputPath, options);

    if (imageminSuccess) {
        return { success: true, method: 'imagemin' };
    }

    // 如果都失败了，复制原文件
    try {
        fs.copyFileSync(inputPath, outputPath);
        return { success: true, method: 'copy' };
    } catch (error) {
        console.error(`复制文件失败: ${inputPath}`, error);
        return { success: false, method: 'none' };
    }
}

// 获取压缩后的文件大小
function getCompressedFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.size;
    } catch (error) {
        console.error(`获取文件大小失败: ${filePath}`, error);
        return 0;
    }
}

ipcMain.handle('search-images', async (event, directoryPath, compressedFolderPath, searchTerm = '') => {
    try {
        const files = findImages(directoryPath);

        let filteredFiles = files;
        if (searchTerm) {
            filteredFiles = files.filter(file =>
                path.basename(file).toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        const imageData = await Promise.all(
            filteredFiles.map(async (filePath) => {
                try {
                    const stats = fs.statSync(filePath);
                    const fileName = path.basename(filePath);

                    // 使用 nativeImage 来获取图片信息
                    const image = nativeImage.createFromPath(filePath);
                    const size = image.getSize();

                    // 生成压缩图片路径
                    const nameWithoutExt = path.parse(fileName).name;
                    const ext = path.parse(fileName).ext;
                    const compressedPath = path.join(compressedFolderPath, `${nameWithoutExt}${ext}`);

                    // 检查压缩图片是否已存在
                    let compressedSize = 0;
                    let compressionRatio = 0;
                    let compressionMethod = 'none';
                    let isCompressed = false;

                    if (fs.existsSync(compressedPath)) {
                        compressedSize = getCompressedFileSize(compressedPath);
                        compressionRatio = ((stats.size - compressedSize) / stats.size * 100);
                        compressionMethod = 'existing';
                        isCompressed = true;
                    }

                    return {
                        path: filePath,
                        compressedPath: compressedPath,
                        name: fileName,
                        originalSize: stats.size,
                        compressedSize: compressedSize,
                        compressionRatio: parseFloat(compressionRatio.toFixed(1)),
                        compressionMethod: compressionMethod,
                        originalWidth: size.width,
                        originalHeight: size.height,
                        lastModified: stats.mtime,
                        isCompressed: isCompressed,
                        originalExists: true
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

// 单个图片压缩接口
ipcMain.handle('compress-single-image', async (event, imagePath, options = {}) => {
    try {
        const fileName = path.basename(imagePath);
        const nameWithoutExt = path.parse(fileName).name;
        const ext = path.parse(fileName).ext;

        // 使用自定义压缩目录或默认目录
        const compressedDir = options.compressedDir || path.join(path.dirname(imagePath), 'compressed');
        const compressedPath = path.join(compressedDir, `${nameWithoutExt}${ext}`);

        // 确保压缩目录存在
        if (!fs.existsSync(compressedDir)) {
            fs.mkdirSync(compressedDir, { recursive: true });
        }

        // 如果压缩文件已存在，直接返回信息
        if (fs.existsSync(compressedPath)) {
            const originalSize = fs.statSync(imagePath).size;
            const compressedSize = getCompressedFileSize(compressedPath);
            const compressionRatio = ((originalSize - compressedSize) / originalSize * 100);

            return {
                success: true,
                originalPath: imagePath,
                compressedPath: compressedPath,
                originalSize: originalSize,
                compressedSize: compressedSize,
                compressionRatio: parseFloat(compressionRatio.toFixed(1)),
                method: 'existing'
            };
        }

        // 获取原始文件大小
        const originalSize = fs.statSync(imagePath).size;

        // 压缩图片
        const compressionResult = await compressImage(imagePath, compressedPath, options);

        if (compressionResult.success) {
            // 获取压缩后的文件大小
            const compressedSize = getCompressedFileSize(compressedPath);
            const compressionRatio = ((originalSize - compressedSize) / originalSize * 100);

            return {
                success: true,
                originalPath: imagePath,
                compressedPath: compressedPath,
                originalSize: originalSize,
                compressedSize: compressedSize,
                compressionRatio: parseFloat(compressionRatio.toFixed(1)),
                method: compressionResult.method
            };
        } else {
            return {
                success: false,
                originalPath: imagePath,
                error: '压缩失败'
            };
        }
    } catch (error) {
        console.error(`压缩单个图片失败: ${imagePath}`, error);
        return {
            success: false,
            originalPath: imagePath,
            error: error.message
        };
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

// 批量压缩图片
ipcMain.handle('compress-images', async (event, imagePaths, options = {}) => {
    const results = [];
    const compressedDir = path.join(path.dirname(imagePaths[0]), 'compressed');

    // 确保压缩目录存在
    if (!fs.existsSync(compressedDir)) {
        fs.mkdirSync(compressedDir, { recursive: true });
    }

    for (const imagePath of imagePaths) {
        try {
            const fileName = path.basename(imagePath);
            const nameWithoutExt = path.parse(fileName).name;
            const ext = path.parse(fileName).ext;
            const compressedPath = path.join(compressedDir, `${nameWithoutExt}${ext}`);

            // 获取原始文件大小
            const originalSize = fs.statSync(imagePath).size;

            // 压缩图片
            const compressionResult = await compressImage(imagePath, compressedPath, options);

            if (compressionResult.success) {
                // 获取压缩后的文件大小
                const compressedSize = getCompressedFileSize(compressedPath);
                const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

                results.push({
                    originalPath: imagePath,
                    compressedPath: compressedPath,
                    originalSize: originalSize,
                    compressedSize: compressedSize,
                    compressionRatio: parseFloat(compressionRatio),
                    method: compressionResult.method,
                    success: true
                });
            } else {
                results.push({
                    originalPath: imagePath,
                    success: false,
                    error: '压缩失败'
                });
            }
        } catch (error) {
            console.error(`压缩图片失败: ${imagePath}`, error);
            results.push({
                originalPath: imagePath,
                success: false,
                error: error.message
            });
        }
    }

    return results;
});

// 获取压缩信息
ipcMain.handle('get-compressed-info', async (event, imagePath) => {
    try {
        const fileName = path.basename(imagePath);
        const nameWithoutExt = path.parse(fileName).name;
        const ext = path.parse(fileName).ext;
        const compressedDir = path.join(path.dirname(imagePath), 'compressed');
        const compressedPath = path.join(compressedDir, `${nameWithoutExt}${ext}`);

        // 检查压缩文件是否存在
        if (fs.existsSync(compressedPath)) {
            const originalSize = fs.statSync(imagePath).size;
            const compressedSize = getCompressedFileSize(compressedPath);

            return {
                isCompressed: true,
                originalSize: originalSize,
                compressedSize: compressedSize,
                compressedPath: compressedPath
            };
        } else {
            return {
                isCompressed: false
            };
        }
    } catch (error) {
        console.error(`获取压缩信息失败: ${imagePath}`, error);
        return {
            isCompressed: false,
            error: error.message
        };
    }
});

// 获取图片压缩建议
ipcMain.handle('get-compression-suggestions', async (event, imagePath) => {
    try {
        const stats = fs.statSync(imagePath);
        const ext = path.extname(imagePath).toLowerCase();
        const fileSize = stats.size;

        const suggestions = {
            recommended: false,
            estimatedSavings: 0,
            quality: 85,
            reason: ''
        };

        // 根据文件大小和类型给出建议
        if (fileSize > 1024 * 1024) { // 大于 1MB
            suggestions.recommended = true;
            suggestions.estimatedSavings = Math.round(fileSize * 0.3); // 估计节省 30%
            suggestions.reason = '文件较大，压缩可以显著减少存储空间';
        } else if (fileSize > 500 * 1024) { // 大于 500KB
            suggestions.recommended = true;
            suggestions.estimatedSavings = Math.round(fileSize * 0.2); // 估计节省 20%
            suggestions.reason = '文件中等大小，压缩可以适度减少存储空间';
        } else {
            suggestions.reason = '文件较小，压缩效果有限';
        }

        // 根据文件类型调整建议
        switch (ext) {
            case '.jpg':
            case '.jpeg':
                suggestions.quality = 85;
                break;
            case '.png':
                suggestions.quality = 80;
                break;
            case '.webp':
                suggestions.quality = 85;
                break;
            case '.gif':
                suggestions.quality = 90;
                suggestions.reason += '（GIF 压缩效果有限）';
                break;
        }

        return suggestions;
    } catch (error) {
        console.error(`获取压缩建议失败: ${imagePath}`, error);
        return {
            recommended: false,
            error: error.message
        };
    }
});

// 删除已压缩图片的原图
ipcMain.handle('delete-original-images', async (event, imagePaths) => {
    const results = {
        success: true,
        deletedCount: 0,
        list: [],
        errors: []
    };

    for (let imagePath of imagePaths) {
        try {
            // 检查文件是否存在
            if (fs.existsSync(imagePath.path) && imagePath.isCompressed && imagePath.originalExists) {
                // 删除文件
                fs.unlinkSync(imagePath.path);
                results.deletedCount++;
                console.log(`已删除原图: ${imagePath.path}`);
                imagePath.originalExists = false;
            }
        } catch (error) {
            console.error(`删除原图失败: ${imagePath.path}`, error);
            results.errors.push({
                path: imagePath.path,
                error: error.message
            });
        }
    }

    results.list = imagePaths;

    // 如果有错误，标记为部分失败
    if (results.errors.length > 0) {
        results.success = results.deletedCount > 0;
    }

    return results;
});

// 设置相关的 IPC 处理器
const settingsPath = path.join(os.homedir(), '.imagevision-settings.json');

// 获取设置
ipcMain.handle('get-settings', () => {
    try {
        if (fs.existsSync(settingsPath)) {
            const settingsData = fs.readFileSync(settingsPath, 'utf8');
            return JSON.parse(settingsData);
        }
        return {
            imageDirectory: getDefaultCompressedFolder(),
            compressionQuality: 85,
            jpegQuality: 85,
            pngQuality: 80,
            webpQuality: 85
        };
    } catch (error) {
        console.error('读取设置失败:', error);
        return {
            imageDirectory: getDefaultCompressedFolder(),
            compressionQuality: 85,
            jpegQuality: 85,
            pngQuality: 80,
            webpQuality: 85
        };
    }
});

// 保存设置
ipcMain.handle('save-settings', async (event, settings) => {
    try {
        const settingsData = JSON.stringify(settings, null, 2);
        fs.writeFileSync(settingsPath, settingsData, 'utf8');
        return { success: true };
    } catch (error) {
        console.error('保存设置失败:', error);
        return { success: false, error: error.message };
    }
});

// 选择图片目录
ipcMain.handle('select-image-directory', async (event, currentPath) => {
    const result = await dialog.showOpenDialog(settingsWindow || mainWindow, {
        properties: ['openDirectory'],
        defaultPath: currentPath || undefined
    });

    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
    }
    return null;
});

ipcMain.handle('copy-images-to-directory', async (event, { from, to }) => {
    try {
        if (!fs.existsSync(from) || !fs.existsSync(to)) {
            return { success: false, error: '目录不存在' };
        }
        // 只复制图片文件
        const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tiff', '.tif'];
        const files = findImages(from);
        for (const file of files) {
            const rel = path.relative(from, file);
            const dest = path.join(to, rel);
            await fse.ensureDir(path.dirname(dest));
            await fse.copyFile(file, dest);
        }
        return { success: true, count: files.length };
    } catch (e) {
        return { success: false, error: e.message };
    }
});

ipcMain.on('debug-log', (event, msg) => {
    console.log('[Renderer Debug]', msg);
});
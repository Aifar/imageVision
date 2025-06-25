const { app, BrowserWindow, ipcMain, dialog, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

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
                if (path.basename(filePath) !== 'thumb' && path.basename(filePath) !== 'compressed') {
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

// 图片压缩配置
const compressionConfig = {
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

// 使用 Sharp 压缩图片
async function compressImageWithSharp(inputPath, outputPath, options = {}) {
    try {
        const ext = path.extname(inputPath).toLowerCase();
        let sharpInstance = sharp(inputPath);

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
        // 确保 compressed 目录存在
        const compressedDir = path.join(directoryPath, 'compressed');
        if (!fs.existsSync(compressedDir)) {
            fs.mkdirSync(compressedDir, { recursive: true });
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
                    const compressedPath = path.join(compressedDir, `${nameWithoutExt}_compressed${ext}`);

                    // 检查压缩图片是否已存在，如果不存在则压缩
                    let compressedSize = 0;
                    let compressionRatio = 0;
                    let compressionMethod = 'none';

                    if (!fs.existsSync(compressedPath)) {
                        const compressionResult = await compressImage(filePath, compressedPath, {
                            quality: 85 // 默认压缩质量
                        });

                        if (compressionResult.success) {
                            compressedSize = getCompressedFileSize(compressedPath);
                            compressionRatio = ((stats.size - compressedSize) / stats.size * 100);
                            compressionMethod = compressionResult.method;
                        }
                    } else {
                        compressedSize = getCompressedFileSize(compressedPath);
                        compressionRatio = ((stats.size - compressedSize) / stats.size * 100);
                        compressionMethod = 'existing';
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
            const compressedPath = path.join(compressedDir, `${nameWithoutExt}_compressed${ext}`);

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
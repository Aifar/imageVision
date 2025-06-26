class ImageViewer {
    constructor() {
        this.currentDirectory = null;
        this.allImages = [];
        this.filteredImages = [];
        this.currentSearchTerm = '';

        // 并发压缩控制
        this.maxConcurrentCompressions = 100;
        this.currentCompressions = 0;
        this.compressionQueue = [];

        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        // 获取DOM元素
        this.selectFolderBtn = document.getElementById('selectFolderBtn');
        this.currentFolder = document.getElementById('currentFolder');
        this.searchInput = document.getElementById('searchInput');
        this.clearSearch = document.getElementById('clearSearch');
        this.loadingContainer = document.getElementById('loadingContainer');
        this.emptyState = document.getElementById('emptyState');
        this.imageGrid = document.getElementById('imageGrid');
        this.statsBar = document.getElementById('statsBar');
        this.imageCount = document.getElementById('imageCount');
        this.folderPath = document.getElementById('folderPath');

        // 压缩控件元素
        this.compressionControls = document.querySelector('.compression-controls');
        this.compressBtn = document.getElementById('compressBtn');
        this.compressionQuality = document.getElementById('compressionQuality');
        this.qualityValue = document.getElementById('qualityValue');

        // 模态框元素
        this.imageModal = document.getElementById('imageModal');
        this.modalClose = document.getElementById('modalClose');
        this.modalImage = document.getElementById('modalImage');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalOriginalSize = document.getElementById('modalOriginalSize');
        this.modalFileSize = document.getElementById('modalFileSize');
        this.modalCompressionSuggestion = document.getElementById('modalCompressionSuggestion');
        this.compressSingleBtn = document.getElementById('compressSingleBtn');

        // 压缩进度对话框元素
        this.compressionModal = document.getElementById('compressionModal');
        this.compressionProgress = document.getElementById('compressionProgress');
        this.compressionCurrent = document.getElementById('compressionCurrent');
        this.compressionTotal = document.getElementById('compressionTotal');
        this.compressionResults = document.getElementById('compressionResults');
        this.compressionSuccess = document.getElementById('compressionSuccess');
        this.compressionFailed = document.getElementById('compressionFailed');
        this.compressionSaved = document.getElementById('compressionSaved');
        this.openCompressedFolder = document.getElementById('openCompressedFolder');
        this.closeCompressionModal = document.getElementById('closeCompressionModal');
    }

    bindEvents() {
        // 选择文件夹
        this.selectFolderBtn.addEventListener('click', () => this.selectFolder());

        // 搜索功能
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.clearSearch.addEventListener('click', () => this.clearSearchInput());

        // 压缩功能
        this.compressBtn.addEventListener('click', () => this.compressAllImages());
        this.compressionQuality.addEventListener('input', (e) => {
            this.qualityValue.textContent = `${e.target.value}%`;
        });
        this.compressSingleBtn.addEventListener('click', () => this.compressSingleImage());

        // 压缩进度对话框事件
        this.closeCompressionModal.addEventListener('click', () => this.closeCompressionModal());
        this.openCompressedFolder.addEventListener('click', () => this.openCompressedFolder());
        this.compressionModal.addEventListener('click', (e) => {
            if (e.target === this.compressionModal) {
                this.closeCompressionModal();
            }
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeCompressionModal();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                this.searchInput.focus();
            }
        });

        // 模态框事件
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.imageModal.addEventListener('click', (e) => {
            if (e.target === this.imageModal) {
                this.closeModal();
            }
        });
    }

    async selectFolder() {
        try {
            const folderPath = await window.electronAPI.selectDirectory();
            if (folderPath) {
                this.currentDirectory = folderPath;
                this.updateCurrentFolderDisplay(folderPath);
                this.searchInput.disabled = false;
                await this.loadImages();
            }
        } catch (error) {
            console.error('选择文件夹失败:', error);
            this.showError('选择文件夹失败，请重试。');
        }
    }

    updateCurrentFolderDisplay(folderPath) {
        const folderName = folderPath.split(/[/\\]/).pop();
        this.currentFolder.innerHTML = `
            <i class="fas fa-folder"></i>
            <span title="${folderPath}">${folderName}</span>
        `;
    }

    async loadImages() {
        this.showLoading(true);
        this.hideEmptyState();

        try {
            const images = await window.electronAPI.searchImages(this.currentDirectory, '');
            this.allImages = images;
            this.filteredImages = images;

            if (images.length === 0) {
                this.showEmptyResults();
            } else {
                this.renderImages(images);
                this.updateStats(images.length, this.currentDirectory);
                // 显示压缩控件
                this.compressionControls.style.display = 'flex';
            }
        } catch (error) {
            console.error('加载图片失败:', error);
            this.showError('加载图片失败，请检查文件夹权限。');
        } finally {
            this.showLoading(false);
        }
    }

    handleSearch(searchTerm) {
        this.currentSearchTerm = searchTerm.trim();

        if (this.currentSearchTerm === '') {
            this.clearSearch.style.display = 'none';
            this.filteredImages = this.allImages;
        } else {
            this.clearSearch.style.display = 'block';
            this.filteredImages = this.allImages.filter(image =>
                image.name.toLowerCase().includes(this.currentSearchTerm.toLowerCase())
            );
        }

        this.renderImages(this.filteredImages);
        this.updateStats(this.filteredImages.length, this.currentDirectory);
    }

    clearSearchInput() {
        this.searchInput.value = '';
        this.handleSearch('');
    }

    renderImages(images) {
        if (images.length === 0) {
            this.showEmptyResults();
            return;
        }

        this.imageGrid.innerHTML = '';
        this.imageGrid.style.display = 'grid';
        this.statsBar.style.display = 'flex';

        images.forEach(image => {
            const imageCard = this.createImageCard(image);
            this.imageGrid.appendChild(imageCard);
        });
    }

    createImageCard(image) {
        const card = document.createElement('div');
        card.className = 'image-card';
        card.dataset.imagePath = image.path;
        card.dataset.isCompressed = image.isCompressed.toString();
        card.addEventListener('click', () => this.openModal(image));

        // 使用 file:// 协议加载图片文件
        const originalSrc = `file://${image.path}`;

        // 根据是否已压缩显示不同的压缩信息
        const compressionInfoHtml = image.isCompressed ? `
            <div class="detail-row">
                <span class="detail-label">压缩后大小:</span>
                <span>${this.formatFileSize(image.compressedSize)}</span>
                <span class="compression-ratio">节省 ${image.compressionRatio}%</span>
            </div>
        ` : `
            <div class="detail-row">
                <span class="compression-status pending">等待压缩...</span>
            </div>
        `;

        card.innerHTML = `
            <div class="image-container">
                <img src="${originalSrc}" 
                     alt="${image.name}"
                     loading="lazy"
                     onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'color: white; text-align: center; padding: 20px;\\'>图片加载失败</div>';">
            </div>
            <div class="image-info">
                <div class="image-name" title="${image.name}">${image.name}</div>
                <div class="image-details">
                    <div class="detail-row">
                        <span class="detail-label">尺寸:</span>
                        <span>${image.originalWidth} × ${image.originalHeight}</span>
                        <span class="detail-label">原图大小:</span>
                        <span>${this.formatFileSize(image.originalSize)}</span>
                    </div>
                    <div class="compression-info">
                        ${compressionInfoHtml}
                    </div>
                </div>
            </div>
        `;

        // 如果图片还未压缩，添加到压缩队列
        if (!image.isCompressed) {
            this.addToCompressionQueue(card, image.path);
        }

        return card;
    }

    async openModal(image) {
        this.currentImage = image;
        this.modalTitle.textContent = image.name;
        this.modalOriginalSize.textContent = `${image.originalWidth} × ${image.originalHeight}`;
        this.modalFileSize.textContent = this.formatFileSize(image.originalSize);

        // 获取压缩建议
        try {
            const suggestions = await window.electronAPI.getCompressionSuggestions(image.path);
            if (suggestions.recommended) {
                this.modalCompressionSuggestion.textContent = suggestions.reason;
                this.compressSingleBtn.style.display = 'block';
                this.compressSingleBtn.parentElement.style.display = 'block';
            } else {
                this.modalCompressionSuggestion.textContent = suggestions.reason || '无需压缩';
                this.compressSingleBtn.style.display = 'none';
                this.compressSingleBtn.parentElement.style.display = 'none';
            }
        } catch (error) {
            console.error('获取压缩建议失败:', error);
            this.modalCompressionSuggestion.textContent = '无法获取压缩建议';
            this.compressSingleBtn.style.display = 'none';
            this.compressSingleBtn.parentElement.style.display = 'none';
        }

        // 加载高质量图片（显示原图）
        this.modalImage.src = `file://${image.path}`;
        this.imageModal.style.display = 'block';

        // 添加加载动画
        this.modalImage.style.opacity = '0.5';
        this.modalImage.onload = () => {
            this.modalImage.style.opacity = '1';
        };
    }

    closeModal() {
        this.imageModal.style.display = 'none';
        this.modalImage.src = '';
    }

    updateStats(count, folderPath) {
        const totalImages = this.allImages.length;
        const compressedImages = this.allImages.filter(img => img.isCompressed).length;
        const compressionProgress = totalImages > 0 ? Math.round((compressedImages / totalImages) * 100) : 0;

        this.imageCount.textContent = `${count} 张图片`;
        if (this.currentSearchTerm) {
            this.imageCount.textContent += ` (搜索: "${this.currentSearchTerm}")`;
        }

        // 添加压缩进度信息
        if (totalImages > 0) {
            const queueCount = this.compressionQueue ? this.compressionQueue.length : 0;
            const processingCount = this.currentCompressions || 0;

            if (compressionProgress < 100) {
                this.imageCount.textContent += ` | 压缩进度: ${compressionProgress}% (${compressedImages}/${totalImages})`;
                if (queueCount > 0) {
                    this.imageCount.textContent += ` | 队列: ${queueCount}`;
                }
                if (processingCount > 0) {
                    this.imageCount.textContent += ` | 压缩中: ${processingCount}`;
                }
            } else {
                this.imageCount.textContent += ` | 全部压缩完成`;
            }
        }

        const folderName = folderPath ? folderPath.split(/[/\\]/).pop() : '';
        this.folderPath.textContent = folderName;
    }

    showLoading(show) {
        this.loadingContainer.style.display = show ? 'flex' : 'none';
        if (show) {
            this.imageGrid.style.display = 'none';
            this.statsBar.style.display = 'none';
        }
    }

    hideEmptyState() {
        this.emptyState.style.display = 'none';
    }

    showEmptyResults() {
        this.imageGrid.style.display = 'none';
        this.statsBar.style.display = 'none';
        this.emptyState.style.display = 'flex';

        if (this.currentSearchTerm) {
            this.emptyState.innerHTML = `
                <div class="empty-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>未找到匹配的图片</h3>
                <p>尝试调整搜索关键词或选择其他文件夹</p>
            `;
        } else {
            this.emptyState.innerHTML = `
                <div class="empty-icon">
                    <i class="fas fa-images"></i>
                </div>
                <h3>文件夹中没有图片</h3>
                <p>此文件夹中没有找到支持的图片格式</p>
            `;
        }
    }

    showError(message) {
        this.imageGrid.style.display = 'none';
        this.statsBar.style.display = 'none';
        this.emptyState.style.display = 'flex';
        this.emptyState.innerHTML = `
            <div class="empty-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3>出现错误</h3>
            <p>${message}</p>
        `;
    }

    formatFileSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }

    getCompressionMethodName(method) {
        const methodNames = {
            'sharp': 'Sharp',
            'imagemin': 'Imagemin',
            'copy': '复制',
            'existing': '已存在',
            'none': '无压缩'
        };
        return methodNames[method] || method;
    }

    // 压缩所有图片
    async compressAllImages() {
        if (!this.filteredImages || this.filteredImages.length === 0) {
            this.showError('没有可压缩的图片');
            return;
        }

        const quality = parseInt(this.compressionQuality.value);
        const imagePaths = this.filteredImages.map(img => img.path);

        this.showCompressionModal();
        this.updateCompressionProgress(0, imagePaths.length);

        try {
            const results = await window.electronAPI.compressImages(imagePaths, { quality });
            this.showCompressionResults(results);
        } catch (error) {
            console.error('压缩图片失败:', error);
            this.showError('压缩图片失败，请重试');
            this.closeCompressionModal();
        }
    }

    // 压缩单张图片
    async compressSingleImage() {
        if (!this.currentImage) {
            return;
        }

        const quality = parseInt(this.compressionQuality.value);
        this.closeModal();
        this.showCompressionModal();
        this.updateCompressionProgress(0, 1);

        try {
            const results = await window.electronAPI.compressImages([this.currentImage.path], { quality });
            this.showCompressionResults(results);
        } catch (error) {
            console.error('压缩图片失败:', error);
            this.showError('压缩图片失败，请重试');
            this.closeCompressionModal();
        }
    }

    // 显示压缩进度对话框
    showCompressionModal() {
        this.compressionModal.style.display = 'block';
        this.compressionResults.style.display = 'none';
        this.compressionProgress.style.width = '0%';
    }

    // 更新压缩进度
    updateCompressionProgress(current, total) {
        const percentage = (current / total) * 100;
        this.compressionProgress.style.width = `${percentage}%`;
        this.compressionCurrent.textContent = current;
        this.compressionTotal.textContent = total;
    }

    // 显示压缩结果
    showCompressionResults(results) {
        const successCount = results.filter(r => r.success).length;
        const failedCount = results.length - successCount;
        const totalSaved = results
            .filter(r => r.success)
            .reduce((sum, r) => sum + (r.originalSize - r.compressedSize), 0);

        this.compressionSuccess.textContent = successCount;
        this.compressionFailed.textContent = failedCount;
        this.compressionSaved.textContent = this.formatFileSize(totalSaved);

        this.compressionResults.style.display = 'block';
    }

    // 关闭压缩进度对话框
    closeCompressionModal() {
        this.compressionModal.style.display = 'none';
    }

    // 打开压缩文件夹
    openCompressedFolder() {
        if (this.currentDirectory) {
            const compressedDir = path.join(this.currentDirectory, 'compressed');
            // 这里需要调用主进程来打开文件夹
            // 暂时使用系统默认方式
            window.open(`file://${compressedDir}`);
        }
    }

    // 并发压缩控制方法
    async processCompressionQueue() {
        while (this.compressionQueue.length > 0 && this.currentCompressions < this.maxConcurrentCompressions) {
            const { card, imagePath } = this.compressionQueue.shift();
            this.currentCompressions++;

            // 异步执行压缩，不等待完成
            this.compressImageInBackground(card, imagePath).finally(() => {
                this.currentCompressions--;
                // 压缩完成后，继续处理队列
                this.processCompressionQueue();
            });
        }
    }

    // 添加图片到压缩队列
    addToCompressionQueue(card, imagePath) {
        this.compressionQueue.push({ card, imagePath });

        // 更新等待状态显示队列位置
        const compressionStatus = card.querySelector('.compression-status');
        if (compressionStatus && compressionStatus.classList.contains('pending')) {
            const queuePosition = this.compressionQueue.length;
            compressionStatus.textContent = `排队中 (第${queuePosition}位)`;
        }

        this.processCompressionQueue();
    }

    async compressImageInBackground(card, imagePath) {
        try {
            // 显示压缩中状态
            const compressionInfo = card.querySelector('.compression-info');
            const compressionStatus = card.querySelector('.compression-status');

            if (compressionStatus) {
                compressionStatus.textContent = `压缩中... (${this.currentCompressions}/${this.maxConcurrentCompressions})`;
                compressionStatus.className = 'compression-status compressing';
            }

            // 调用后台压缩接口
            const result = await window.electronAPI.compressSingleImage(imagePath, {
                quality: parseInt(this.compressionQuality.value)
            });

            if (result.success) {
                // 更新压缩信息显示
                if (compressionInfo) {
                    compressionInfo.innerHTML = `
                        <div class="detail-row">
                            <span class="detail-label">压缩后大小:</span>
                            <span>${this.formatFileSize(result.compressedSize)}</span>
                            <span class="compression-ratio">节省 ${result.compressionRatio}%</span>
                        </div>
                    `;
                }

                // 标记为已压缩
                card.dataset.isCompressed = 'true';

                // 更新对应的图片数据
                const imageIndex = this.allImages.findIndex(img => img.path === imagePath);
                if (imageIndex !== -1) {
                    this.allImages[imageIndex].isCompressed = true;
                    this.allImages[imageIndex].compressedSize = result.compressedSize;
                    this.allImages[imageIndex].compressionRatio = result.compressionRatio;
                    this.allImages[imageIndex].compressionMethod = result.method;
                }

                // 更新统计信息
                this.updateStats(this.filteredImages.length, this.currentDirectory);
            } else {
                // 显示压缩失败
                if (compressionInfo) {
                    compressionInfo.innerHTML = `
                        <div class="detail-row">
                            <span class="error-message">压缩失败: ${result.error || '未知错误'}</span>
                        </div>
                    `;
                }
            }
        } catch (error) {
            console.error('后台压缩失败:', error);

            const compressionInfo = card.querySelector('.compression-info');

            if (compressionInfo) {
                compressionInfo.innerHTML = `
                    <div class="detail-row">
                        <span class="error-message">压缩失败: ${error.message}</span>
                    </div>
                `;
            }
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new ImageViewer();
});

// 添加一些实用的全局快捷键
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + R 刷新当前文件夹
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        const viewer = document.querySelector('.app-container').__imageViewer;
        if (viewer && viewer.currentDirectory) {
            viewer.loadImages();
        }
    }
}); 
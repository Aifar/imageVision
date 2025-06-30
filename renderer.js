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
        this.isCompressing = false;

        // 等待i18n初始化完成
        this.waitForI18n().then(() => {
            this.initializeElements();
            this.bindEvents();
            this.initializeDefaultSettings();
            this.initializeLanguageSelector();
            this.updateAllTexts();
        });
    }

    async waitForI18n() {
        // 等待i18n实例可用
        while (!window.i18n) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    }

    initializeElements() {
        // 获取DOM元素
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
        this.compressedFolderBtn = document.getElementById('compressedFolderBtn');
        this.compressedFolderText = document.getElementById('compressedFolderText');
        this.compressionQuality = document.getElementById('compressionQuality');
        this.qualityValue = document.getElementById('qualityValue');

        // 语言选择器元素
        this.languageBtn = document.getElementById('languageBtn');
        this.languageDropdown = document.getElementById('languageDropdown');
        this.languageSelector = document.querySelector('.language-selector');
        this.currentLanguageFlag = document.getElementById('currentLanguageFlag');

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

        // 压缩文件夹路径存储
        this.compressedFolderPath = '';
    }

    initializeLanguageSelector() {
        // 创建语言选项
        const languages = window.i18n.getAllLanguages();
        this.languageDropdown.innerHTML = '';

        languages.forEach(lang => {
            const option = document.createElement('button');
            option.className = 'language-option';
            option.dataset.lang = lang.code;

            if (lang.code === window.i18n.getCurrentLanguage()) {
                option.classList.add('active');
            }

            option.innerHTML = `
                <span class="flag">${lang.flag}</span>
                <span class="name">${lang.name}</span>
            `;

            option.addEventListener('click', () => {
                this.changeLanguage(lang.code);
            });

            this.languageDropdown.appendChild(option);
        });

        // 更新当前语言显示
        this.updateCurrentLanguageDisplay();
    }

    updateCurrentLanguageDisplay() {
        const currentLang = window.i18n.getCurrentLanguage();
        const languages = window.i18n.getAllLanguages();
        const langInfo = languages.find(lang => lang.code === currentLang);

        if (langInfo) {
            this.currentLanguageFlag.textContent = langInfo.flag;
        }
    }

    changeLanguage(langCode) {
        window.i18n.setLanguage(langCode);
        this.updateCurrentLanguageDisplay();
        this.updateAllTexts();
        this.toggleLanguageDropdown(false);

        // 更新语言选项的active状态
        this.languageDropdown.querySelectorAll('.language-option').forEach(option => {
            option.classList.toggle('active', option.dataset.lang === langCode);
        });
    }

    toggleLanguageDropdown(show = null) {
        const isActive = this.languageSelector.classList.contains('active');
        const shouldShow = show !== null ? show : !isActive;

        this.languageSelector.classList.toggle('active', shouldShow);
    }

    updateAllTexts() {
        // 更新所有带有data-i18n属性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = window.i18n.t(key);
        });

        // 更新所有带有data-i18n-placeholder属性的元素
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = window.i18n.t(key);
        });

        // 更新页面标题
        document.title = window.i18n.t('appTitle');

        // 更新动态内容
        if (this.allImages.length > 0) {
            this.updateStats(this.filteredImages.length, this.currentDirectory);
            // 重新渲染图片卡片以更新动态文本
            this.renderImages(this.filteredImages);
        }
    }

    bindEvents() {
        // 选择文件夹
        this.currentFolder.addEventListener('click', () => {
            if (!this.currentFolder.classList.contains('disabled')) {
                this.selectFolder();
            }
        });

        // 搜索功能
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.clearSearch.addEventListener('click', () => this.clearSearchInput());

        // 压缩功能
        this.compressedFolderBtn.addEventListener('click', () => this.selectCompressedFolder());
        this.compressionQuality.addEventListener('input', (e) => {
            this.qualityValue.textContent = `${e.target.value}%`;
        });

        // 语言选择器事件
        this.languageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleLanguageDropdown();
        });

        // 点击外部关闭语言下拉菜单
        document.addEventListener('click', (e) => {
            if (!this.languageSelector.contains(e.target)) {
                this.toggleLanguageDropdown(false);
            }
        });

        // 语言改变事件监听
        window.addEventListener('languageChanged', () => {
            this.updateAllTexts();
        });

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
                this.toggleLanguageDropdown(false);
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
            // 传递当前目录作为默认路径
            const folderPath = await window.electronAPI.selectDirectory(this.currentDirectory);
            if (folderPath) {
                this.currentDirectory = folderPath;
                this.updateFolderDisplay(folderPath);
                this.searchInput.disabled = false;
                await this.loadImages();
            }
        } catch (error) {
            console.error('选择文件夹失败:', error);
            this.showError(window.i18n.t('selectFolderError'));
        }
    }

    updateFolderDisplay(folderPath) {
        let folderName;
        if (folderPath) {
            // 使用JavaScript字符串方法获取文件夹名称，兼容Windows和Unix路径
            folderName = folderPath.split(/[/\\]/).pop() || folderPath;
        } else {
            folderName = '请选择图片文件夹';
        }

        this.currentFolder.querySelector('span').textContent = folderName;
        this.folderPath.textContent = folderPath || '';

        if (folderPath) {
            this.currentFolder.classList.add('has-folder');
        } else {
            this.currentFolder.classList.remove('has-folder');
        }
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

                // 设置默认压缩文件夹路径为Documents/imagevision
                if (!this.compressedFolderPath) {
                    try {
                        const defaultFolder = await window.electronAPI.getDefaultCompressedFolder();
                        this.compressedFolderPath = defaultFolder;
                    } catch (error) {
                        console.error('获取默认压缩文件夹失败:', error);
                        // 如果获取失败，使用当前目录作为备选
                        this.compressedFolderPath = this.currentDirectory;
                    }
                }
                this.updateCompressedFolderButton();
            }
        } catch (error) {
            console.error('加载图片失败:', error);
            this.showError(window.i18n.t('loadImagesError'));
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
                    <span class="detail-label">${window.i18n.t('compressedSize')}</span>
                    <span>${this.formatFileSize(image.compressedSize)}</span>
                    <span class="compression-ratio">${window.i18n.t('saved', { ratio: image.compressionRatio })}</span>
            </div>
        ` : `
            <div class="detail-row">
                <span class="compression-status pending">${window.i18n.t('waitingCompression')}</span>
            </div>
        `;

        card.innerHTML = `
            <div class="image-container">
                <img src="${originalSrc}" 
                     alt="${image.name}"
                     loading="lazy">
            </div>
            <div class="image-info">
                <div class="image-name" title="${image.name}">${image.name}</div>
                <div class="image-details">
                    <div class="detail-row">
                      
                        <span>${image.originalWidth} × ${image.originalHeight}</span>
                    
                        <span>${this.formatFileSize(image.originalSize)}</span>
                    </div>
                    <div class="compression-info">
                        ${compressionInfoHtml}
                    </div>
                </div>
            </div>
        `;

        // 添加图片错误处理
        const imgElement = card.querySelector('img');
        imgElement.onerror = () => {
            imgElement.style.display = 'none';
            imgElement.parentElement.innerHTML = `<div style="color: white; text-align: center; padding: 20px;">${window.i18n.t('imageLoadFailed')}</div>`;
        };

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
        this.modalCompressionSuggestion.textContent = window.i18n.t('saved', { ratio: image.compressionRatio });
        this.compressSingleBtn.style.display = 'block';
        this.compressSingleBtn.parentElement.style.display = 'block';

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

        this.imageCount.textContent = window.i18n.t('imagesCount', { count: count });
        if (this.currentSearchTerm) {
            this.imageCount.textContent += ` (${window.i18n.t('searchPlaceholder')}: "${this.currentSearchTerm}")`;
        }

        // 添加压缩进度信息
        if (totalImages > 0) {
            const queueCount = this.compressionQueue ? this.compressionQueue.length : 0;
            const processingCount = this.currentCompressions || 0;

            if (compressionProgress < 100) {
                this.imageCount.textContent += ` | ${window.i18n.t('compressionProgress', { progress: compressionProgress, current: compressedImages, total: totalImages })}`;
                if (queueCount > 0) {
                    this.imageCount.textContent += ` | ${window.i18n.t('queue')}: ${queueCount}`;
                }
                if (processingCount > 0) {
                    this.imageCount.textContent += ` | ${window.i18n.t('compressing')}: ${processingCount}`;
                }
            } else {
                this.imageCount.textContent += ` | ${window.i18n.t('allCompressed')}`;
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
                <h3>${window.i18n.t('noMatchingImages')}</h3>
                <p>${window.i18n.t('noMatchingImagesDesc')}</p>
            `;
        } else {
            this.emptyState.innerHTML = `
                <div class="empty-icon">
                    <i class="fas fa-images"></i>
                </div>
                <h3>${window.i18n.t('noImagesInFolder')}</h3>
                <p>${window.i18n.t('noImagesFoundDesc')}</p>
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
            <h3>${window.i18n.t('errorOccurred')}</h3>
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
        // 确保i18n已经初始化
        if (!window.i18n) {
            return method;
        }

        const methodNames = {
            'sharp': 'Sharp',
            'imagemin': 'Imagemin',
            'copy': window.i18n.t('copy'),
            'existing': window.i18n.t('existing'),
            'none': window.i18n.t('none')
        };
        return methodNames[method] || method;
    }

    // 打开压缩文件夹
    openCompressedFolder() {
        if (this.compressedFolderPath) {
            // 这里需要调用主进程来打开文件夹
            // 暂时使用系统默认方式
            window.open(`file://${this.compressedFolderPath}`);
        }
    }

    // 并发压缩控制方法
    async processCompressionQueue() {
        // 如果有任务在处理或队列中有任务，设置压缩状态
        if ((this.currentCompressions > 0 || this.compressionQueue.length > 0) && !this.isCompressing) {
            this.isCompressing = true;
            this.setCompressionState(true);
        }

        while (this.compressionQueue.length > 0 && this.currentCompressions < this.maxConcurrentCompressions) {
            const { card, imagePath } = this.compressionQueue.shift();
            this.currentCompressions++;

            // 异步执行压缩，不等待完成
            this.compressImageInBackground(card, imagePath).finally(() => {
                this.currentCompressions--;
                // 压缩完成后，继续处理队列
                this.processCompressionQueue();

                // 如果所有压缩任务都完成了，解除压缩状态
                if (this.currentCompressions === 0 && this.compressionQueue.length === 0 && this.isCompressing) {
                    this.isCompressing = false;
                    this.setCompressionState(false);
                }
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
            compressionStatus.textContent = window.i18n.t('queueing', { position: queuePosition });
        }

        this.processCompressionQueue();
    }

    async compressImageInBackground(card, imagePath) {
        try {
            // 检查是否设置了压缩文件夹
            if (!this.compressedFolderPath) {
                // 如果没有设置压缩文件夹，显示提示
                const compressionInfo = card.querySelector('.compression-info');
                if (compressionInfo) {
                    compressionInfo.innerHTML = `
                        <div class="detail-row">
                            <span class="error-message">${window.i18n.t('selectCompressedFolderFirst')}</span>
                        </div>
                    `;
                }
                return;
            }

            // 显示压缩中状态
            const compressionInfo = card.querySelector('.compression-info');
            const compressionStatus = card.querySelector('.compression-status');

            if (compressionStatus) {
                compressionStatus.textContent = window.i18n.t('compressingStatus', {
                    current: this.currentCompressions,
                    max: this.maxConcurrentCompressions
                });
                compressionStatus.className = 'compression-status compressing';
            }

            // 调用后台压缩接口
            const result = await window.electronAPI.compressSingleImage(imagePath, {
                quality: parseInt(this.compressionQuality.value),
                compressedDir: this.compressedFolderPath
            });

            if (result.success) {
                // 更新压缩信息显示
                if (compressionInfo) {
                    compressionInfo.innerHTML = `
                        <div class="detail-row">
                            <span class="detail-label">${window.i18n.t('compressedSize')}</span>
                            <span>${this.formatFileSize(result.compressedSize)}</span>
                            <span class="compression-ratio">${window.i18n.t('saved', { ratio: result.compressionRatio })}</span>
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

    async selectCompressedFolder() {
        try {
            console.info('选择压缩文件夹:', this.compressedFolderPath);
            const folderPath = await window.electronAPI.selectDirectory(this.compressedFolderPath);
            if (folderPath) {
                this.compressedFolderPath = folderPath;
                this.updateCompressedFolderButton();
            }
        } catch (error) {
            console.error('选择压缩文件夹失败:', error);
            this.showError('选择压缩文件夹失败，请重试。');
        }
    }

    // 更新压缩文件夹按钮显示
    updateCompressedFolderButton() {
        if (this.compressedFolderPath) {
            // 显示文件夹名称
            const folderName = this.compressedFolderPath.split(/[/\\]/).pop();
            this.compressedFolderText.textContent = folderName;
            this.compressedFolderBtn.className = 'btn btn-folder has-folder';
            this.compressedFolderBtn.title = this.compressedFolderPath;
        } else {
            // 显示选择提示
            this.compressedFolderText.textContent = '选择';
            this.compressedFolderBtn.className = 'btn btn-folder';
            this.compressedFolderBtn.title = '点击选择压缩文件夹';
        }
    }

    // 设置压缩状态控制
    setCompressionState(isCompressing) {
        if (isCompressing) {
            this.currentFolder.classList.add('disabled');
            this.compressedFolderBtn.disabled = true;
        } else {
            this.currentFolder.classList.remove('disabled');
            this.compressedFolderBtn.disabled = false;
        }
    }

    async initializeDefaultSettings() {
        try {
            // 设置默认压缩文件夹路径
            const defaultFolder = await window.electronAPI.getDefaultCompressedFolder();
            this.compressedFolderPath = defaultFolder;
            this.updateCompressedFolderButton();
        } catch (error) {
            console.error('初始化默认设置失败:', error);
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
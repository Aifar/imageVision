// 这里将包含原renderer.js中与导入/压缩相关的全部逻辑，供import.html使用。
// ... 代码迁移中 ...

class ImportCompressor {
    constructor() {
        this.currentDirectory = null;
        this.allImages = [];
        this.filteredImages = [];
        this.currentSearchTerm = '';
        this.maxConcurrentCompressions = 100;
        this.currentCompressions = 0;
        this.compressionQueue = [];
        this.isCompressing = false;
        this.compressedFolderPath = '';
        this.deleteOriginalsBtn = null;
        this.init();

        // 添加窗口焦点事件监听
        window.addEventListener('focus', async () => {

            if (this.settings.language && this.settings.language !== window.i18n.getCurrentLanguage()) {
                window.electronAPI.logToMain('ImportView focus, sync language:' + this.settings.language);
                this.changeLanguage(this.settings.language);
            }
        });
    }

    async init() {
        await this.waitForI18n();
        this.initializeElements();
        this.bindEvents();
        this.initializeDefaultSettings();
        this.initializeLanguageSelector();
        this.updateAllTexts();
    }

    async waitForI18n() {
        while (!window.i18n) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    }

    initializeElements() {
        this.currentFolder = document.getElementById('currentFolder');
        // this.searchInput = document.getElementById('searchInput');
        // this.clearSearch = document.getElementById('clearSearch');
        this.loadingContainer = document.getElementById('loadingContainer');
        this.emptyState = document.getElementById('emptyState');
        this.imageGrid = document.getElementById('imageGrid');
        this.statsBar = document.getElementById('statsBar');
        this.imageCount = document.getElementById('imageCount');
        this.folderPath = document.getElementById('folderPath');
        // this.compressionControls = document.querySelector('.compression-controls');
        // this.compressedFolderBtn = document.getElementById('compressedFolderBtn');
        // this.compressedFolderText = document.getElementById('compressedFolderText');
        // this.compressionQuality = document.getElementById('compressionQuality');
        // this.qualityValue = document.getElementById('qualityValue');
        // this.languageBtn = document.getElementById('languageBtn');
        // this.languageDropdown = document.getElementById('languageDropdown');
        // this.languageSelector = document.querySelector('.language-selector');
        // this.currentLanguageFlag = document.getElementById('currentLanguageFlag');
        this.imageModal = document.getElementById('imageModal');
        this.modalClose = document.getElementById('modalClose');
        this.modalImage = document.getElementById('modalImage');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalOriginalSize = document.getElementById('modalOriginalSize');
        this.modalFileSize = document.getElementById('modalFileSize');
        this.modalCompressionSuggestion = document.getElementById('modalCompressionSuggestion');
        this.compressSingleBtn = document.getElementById('compressSingleBtn');
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

    initializeLanguageSelector() {
        // 创建语言选项
        const languages = window.i18n.getAllLanguages();

        // 更新当前语言显示
        this.updateCurrentLanguageDisplay();
    }

    updateCurrentLanguageDisplay() {
        const currentLang = window.i18n.getCurrentLanguage();
        window.electronAPI.logToMain('currentLang:' + currentLang);
        const languages = window.i18n.getAllLanguages();
        const langInfo = languages.find(lang => lang.code === currentLang);

    }

    changeLanguage(langCode) {
        window.i18n.setLanguage(langCode);
        this.updateCurrentLanguageDisplay();
        this.updateAllTexts();

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
        // this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        // this.clearSearch.addEventListener('click', () => this.clearSearchInput());

        // 压缩功能
        // this.compressedFolderBtn.addEventListener('click', () => this.selectCompressedFolder());
        // this.compressionQuality.addEventListener('input', (e) => {
        //     this.qualityValue.textContent = `${e.target.value}%`;
        // });

        // 语言选择器事件
        // this.languageBtn.addEventListener('click', (e) => {
        //     e.stopPropagation();
        //     this.toggleLanguageDropdown();
        // });

        // 点击外部关闭语言下拉菜单
        // document.addEventListener('click', (e) => {
        //     if (!this.languageSelector.contains(e.target)) {
        //         this.toggleLanguageDropdown(false);
        //     }
        // });

        // 语言改变事件监听
        window.addEventListener('languageChanged', (e) => {
            window.electronAPI.logToMain('ImportView languageChanged:' + e.detail.language);
            this.changeLanguage(e.detail.language);
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
                // this.searchInput.disabled = false;
                await this.loadImages();
            }
        } catch (error) {
            console.error('选择文件夹失败:', error);
            this.showError(window.i18n.t('selectFolderError'));
            // this.showError(error);
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

        window.electronAPI.logToMain('ImportView loadImages:' + this.compressedFolderPath);
        try {
            // 设置默认压缩文件夹路径为Documents/imagevision
            if (!this.compressedFolderPath) {
                try {
                    const defaultFolder = await window.electronAPI.getDefaultCompressedFolder();
                    this.compressedFolderPath = defaultFolder;

                } catch (error) {
                    window.electronAPI.logToMain('ImportView loadImages, get default compressed folder failed:' + error);

                    // 如果获取失败，使用当前目录作为备选
                    this.compressedFolderPath = this.currentDirectory;
                }
            }


            const images = await window.electronAPI.searchImages(this.currentDirectory, this.compressedFolderPath, '');

            this.allImages = images;
            this.filteredImages = images;

            if (images.length === 0) {
                this.showEmptyResults();
            } else {
                this.renderImages(images);
                this.updateStats(images.length, this.currentDirectory);

                // 显示压缩控件
                // this.compressionControls.style.display = 'flex';

                // this.updateCompressedFolderButton();
            }
        } catch (error) {
            console.error('加载图片失败:', error);
            this.showError(window.i18n.t('loadImagesError'));
        } finally {
            this.showLoading(false);
        }
    }

    // 注释掉不再需要的方法
    // handleSearch(searchTerm) {
    //     this.currentSearchTerm = searchTerm;
    //     this.clearSearch.style.display = searchTerm ? 'block' : 'none';
    //     this.filterImages();
    // }

    // clearSearchInput() {
    //     this.searchInput.value = '';
    //     this.handleSearch('');
    // }

    // selectCompressedFolder() {
    //     // ... 压缩文件夹选择相关代码 ...
    // }

    // toggleLanguageDropdown(show = null) {
    //     const isActive = this.languageSelector.classList.contains('active');
    //     const shouldShow = show !== null ? show : !isActive;
    //     this.languageSelector.classList.toggle('active', shouldShow);
    // }

    // initializeLanguageSelector() {
    //     // ... 语言选择器初始化代码 ...
    // }

    // updateCurrentLanguageDisplay() {
    //     // ... 更新语言显示代码 ...
    // }

    // updateCompressedFolderButton() {
    //     // ... 更新压缩文件夹按钮代码 ...
    // }

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

        // 如果原图不存在，添加特殊样式类
        if (!image.originalExists) {
            card.classList.add('original-deleted');
        }

        let originalSrc = `file://${image.path}`;

        // 使用 file:// 协议加载图片文件
        if (!image.originalExists) {
            originalSrc = `file://${image.compressedPath}`;
        }

        console.log(image);
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

        // 构建原图状态显示文本
        const originalStatusText = !image.originalExists
            ? `<span class="original-deleted-badge">${window.i18n.t('originalDeleted')}</span>`
            : '';

        card.innerHTML = `
          <div class="image-container">
              <img src="${originalSrc}"
                   alt="${image.name}"
                   loading="lazy">
          </div>
          <div class="image-info">
              <div class="image-name" title="${image.name}">${image.name}${originalStatusText}</div>
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

        // 如果图片已压缩，创建左右对比布局
        if (image.isCompressed) {
            // 构建压缩图路径
            const compressedPath = image.compressedPath;

            // 动态创建对比布局
            const modalImageContainer = document.querySelector('.modal-image-container');

            if (image.originalExists) {
                // 原图存在，显示对比布局
                modalImageContainer.innerHTML = `
                  <div style="display: flex; height: 100%; position: relative;">
                      <div style="flex: 1; display: flex; flex-direction: column;">
                          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px; text-align: center; font-weight: bold; font-size: 14px; height: 44px; display: flex; align-items: center; justify-content: center;">
                          ${window.i18n.t('original')}:${this.formatFileSize(image.originalSize)}</div>
                          <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: #f8f9fa; padding: 10px;">
                              <img src="file://${image.path}" style="max-width: 100%; max-height: 100%; object-fit: contain;" alt="${window.i18n.t('originalImage')}" />
                          </div>
                      </div>

                      <div style="flex: 1; display: flex; flex-direction: column;">
                          <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 10px; text-align: center; font-weight: bold; font-size: 14px; height: 44px; display: flex; align-items: center; justify-content: center;">
                          ${window.i18n.t('compressed')}:${this.formatFileSize(image.compressedSize)}</div>
                          <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: #f8f9fa; padding: 10px;">
                              <img src="file://${compressedPath}" style="max-width: 100%; max-height: 100%; object-fit: contain;" alt="${window.i18n.t('compressed')}" />
                          </div>
                      </div>
                  </div>
              `;
            } else {
                // 原图不存在，只显示压缩图，但使用特殊样式
                modalImageContainer.innerHTML = `
                  <div style="display: flex; height: 100%; position: relative; justify-content: center;">
                      <div style="max-width: 80%; display: flex; flex-direction: column; border: 3px solid #ffc107; border-radius: 12px; overflow: hidden; background: linear-gradient(135deg, #fff9c4 0%, #fff3cd 100%);">
                          <div style="background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%); color: #212529; padding: 12px; text-align: center; font-weight: bold; font-size: 16px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                              <span>⚠</span>
                              <span>${window.i18n.t('originalDeleted')} - ${window.i18n.t('compressed')}</span>
                              <span>⚠</span>
                          </div>
                          <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: #f8f9fa; padding: 20px; min-height: 400px;">
                              <img id="modalImage" src="file://${compressedPath}" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);" alt="${window.i18n.t('compressed')}" />
                          </div>
                          <div style="padding: 15px; background: white; text-align: center; border-top: 2px solid #ffc107;">
                              <div style="color: #856404; font-weight: 600; margin-bottom: 5px;">${window.i18n.t('compressed')}: ${this.formatFileSize(image.compressedSize)}</div>
                              <div style="color: #6c757d; font-size: 14px;">${window.i18n.t('saved', { ratio: image.compressionRatio })}</div>
                          </div>
                      </div>
                  </div>
              `;
                this.modalImage = document.getElementById('modalImage');
            }

            // 设置详情信息
            this.modalOriginalSize.textContent = `${image.originalWidth} × ${image.originalHeight}`;
            this.modalFileSize.textContent = `${window.i18n.t('original')}: ${this.formatFileSize(image.originalSize)}`;
            this.modalCompressionSuggestion.textContent = `${window.i18n.t('saved', { ratio: image.compressionRatio })} (${window.i18n.t('compressed')}: ${this.formatFileSize(image.compressedSize)})`;
        } else {
            // 未压缩图片，恢复单图布局
            const modalImageContainer = document.querySelector('.modal-image-container');
            modalImageContainer.innerHTML = `<img id="modalImage" src="" alt="" />`;
            this.modalImage = document.getElementById('modalImage');

            this.modalOriginalSize.textContent = `${image.originalWidth} × ${image.originalHeight}`;
            this.modalFileSize.textContent = this.formatFileSize(image.originalSize);
            this.modalCompressionSuggestion.textContent = window.i18n.t('notCompressed');

            // 加载高质量图片（显示原图）
            this.modalImage.src = `file://${image.path}`;

            // 添加加载动画
            this.modalImage.style.opacity = '0.5';
            this.modalImage.onload = () => {
                this.modalImage.style.opacity = '1';
            };
        }

        this.compressSingleBtn.style.display = 'none';
        this.compressSingleBtn.parentElement.style.display = 'block';
        this.imageModal.style.display = 'block';
    }

    closeModal() {
        this.imageModal.style.display = 'none';

        // 恢复原始的模态框布局
        const modalImageContainer = document.querySelector('.modal-image-container');
        modalImageContainer.innerHTML = `<img id="modalImage" src="" alt="" />`;
        this.modalImage = document.getElementById('modalImage');
    }

    updateStats(count, folderPath) {
        const totalImages = this.allImages.length;
        const compressedImages = this.allImages.filter(img => img.isCompressed).length;
        const compressionProgress = totalImages > 0 ? Math.round((compressedImages / totalImages) * 100) : 0;

        // 计算节省的空间
        let totalOriginalSize = 0;
        let totalCompressedSize = 0;
        let spaceSaved = 0;

        this.allImages.forEach(img => {
            totalOriginalSize += img.originalSize || 0;
            if (img.isCompressed) {
                totalCompressedSize += img.compressedSize || 0;
            }
        });

        if (totalOriginalSize > 0 && totalCompressedSize > 0) {
            spaceSaved = totalOriginalSize - totalCompressedSize;
        }

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

            // 添加节省空间信息
            if (spaceSaved > 0) {
                this.imageCount.textContent += ` | ${window.i18n.t('spaceSaved')}: ${this.formatFileSize(spaceSaved)}`;

                // 添加删除原图按钮
                if (compressedImages > 0) {
                    // 创建删除原图按钮
                    if (!this.deleteOriginalsBtn) {
                        this.deleteOriginalsBtn = document.createElement('button');
                        this.deleteOriginalsBtn.className = 'delete-originals-btn';
                        this.deleteOriginalsBtn.style.cssText = `
                          margin-left: 10px;
                          padding: 4px 8px;
                          background: #dc3545;
                          color: white;
                          border: none;
                          border-radius: 4px;
                          font-size: 12px;
                          cursor: pointer;
                          transition: background-color 0.2s;
                      `;
                        this.deleteOriginalsBtn.addEventListener('mouseenter', () => {
                            this.deleteOriginalsBtn.style.background = '#c82333';
                        });
                        this.deleteOriginalsBtn.addEventListener('mouseleave', () => {
                            this.deleteOriginalsBtn.style.background = '#dc3545';
                        });
                        this.deleteOriginalsBtn.addEventListener('click', () => this.deleteOriginalImages());
                        this.imageCount.parentElement.appendChild(this.deleteOriginalsBtn);
                    }
                    this.deleteOriginalsBtn.textContent = window.i18n.t('deleteOriginals');
                    this.deleteOriginalsBtn.style.display = 'inline-block';
                } else if (this.deleteOriginalsBtn) {
                    this.deleteOriginalsBtn.style.display = 'none';
                }
            } else if (this.deleteOriginalsBtn) {
                this.deleteOriginalsBtn.style.display = 'none';
            }
        }

        // const folderName = folderPath ? folderPath.split(/[/\\]/).pop() : '';
        // this.folderPath.textContent = folderName;
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
                    window.electronAPI.logToMain('ImportView processCompressionQueue done:' + this.allImages.length);
                    window.electronAPI.refreshGalleryWall({ images: this.allImages });
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
                quality: parseInt(this.settings.jpegQuality),
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

    // 设置压缩状态控制
    setCompressionState(isCompressing) {
        window.electronAPI.logToMain('ImportView setCompressionState:' + isCompressing);
        if (isCompressing) {
            this.currentFolder.classList.add('disabled');
            // this.compressedFolderBtn.disabled = true;
        } else {
            this.currentFolder.classList.remove('disabled');
            // this.compressedFolderBtn.disabled = false;
        }
    }

    async initializeDefaultSettings() {
        try {
            // 设置默认压缩文件夹路径
            this.settings = await window.electronAPI.getSettings();
            const defaultFolder = this.settings.imageDirectory;
            this.compressedFolderPath = defaultFolder;
        } catch (error) {
            console.error('初始化默认设置失败:', error);
        }
    }

    // 删除已压缩图片的原图
    async deleteOriginalImages() {
        const compressedImages = this.allImages.filter(img => img.isCompressed && img.originalExists);

        if (compressedImages.length === 0) {
            return;
        }

        // 确认对话框
        const confirmed = confirm(window.i18n.t('confirmDeleteOriginals'));
        if (!confirmed) {
            return;
        }

        try {
            // 获取要删除的原图路径
            // const originalPaths = compressedImages.map(img => img.path);

            // 调用后端删除文件
            const result = await window.electronAPI.deleteOriginalImages(this.allImages);

            if (result.success) {
                // 显示成功消息
                alert(window.i18n.t('deleteOriginalsSuccess', { count: result.deletedCount }));
                this.allImages = result.list;
                this.filteredImages = result.list;
                // 重新加载图片列表
                this.renderImages(this.allImages);
            } else {
                // 显示错误消息
                alert(window.i18n.t('deleteOriginalsError'));
                console.error('删除原图时出现错误:', result.errors);
            }
        } catch (error) {
            console.error('删除原图失败:', error);
            alert(window.i18n.t('deleteOriginalsError'));
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ImportCompressor();
});

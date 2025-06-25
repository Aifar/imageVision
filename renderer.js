class ImageViewer {
    constructor() {
        this.currentDirectory = null;
        this.allImages = [];
        this.filteredImages = [];
        this.currentSearchTerm = '';

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

        // 模态框元素
        this.imageModal = document.getElementById('imageModal');
        this.modalClose = document.getElementById('modalClose');
        this.modalImage = document.getElementById('modalImage');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalOriginalSize = document.getElementById('modalOriginalSize');
        this.modalFileSize = document.getElementById('modalFileSize');
    }

    bindEvents() {
        // 选择文件夹
        this.selectFolderBtn.addEventListener('click', () => this.selectFolder());

        // 搜索功能
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.clearSearch.addEventListener('click', () => this.clearSearchInput());

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
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
        card.addEventListener('click', () => this.openModal(image));

        // 使用 file:// 协议加载缩略图文件
        const thumbnailSrc = `file://${image.thumbnail}`;

        card.innerHTML = `
            <img class="image-thumbnail" 
                 src="${thumbnailSrc}" 
                 alt="${image.name}"
                 loading="lazy"
                 onerror="this.style.display='none'; this.nextElementSibling.innerHTML='<div style=\\'color: #999; text-align: center; padding: 20px;\\'>缩略图加载失败</div>';">
            <div class="image-info">
                <div class="image-name" title="${image.name}">${image.name}</div>
                <div class="image-details">
                    <div class="detail-row">
                        <span class="detail-label">缩略图:</span>
                        <span>${image.thumbnailWidth} × ${image.thumbnailHeight}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">原图:</span>
                        <span>${image.originalWidth} × ${image.originalHeight}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">大小:</span>
                        <span>${this.formatFileSize(image.size)}</span>
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    async openModal(image) {
        this.modalTitle.textContent = image.name;
        this.modalOriginalSize.textContent = `${image.originalWidth} × ${image.originalHeight}`;
        this.modalFileSize.textContent = this.formatFileSize(image.size);

        // 加载高质量图片
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
        this.imageCount.textContent = `${count} 张图片`;
        if (this.currentSearchTerm) {
            this.imageCount.textContent += ` (搜索: "${this.currentSearchTerm}")`;
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
class GalleryWall {
    constructor() {
        this.allImages = [];
        this.imageGrid = document.getElementById('imageGrid');
        this.emptyState = document.getElementById('emptyState');
        this.init();
    }

    async init() {
        await this.waitForI18n();
        const settings = await window.electronAPI.getSettings();
        if (settings.language) {
            window.i18n.setLanguage(settings.language);
        }
        if (settings.imageDirectory) {
            this.imageDirectory = settings.imageDirectory;
        }

        this.loadImages();
    }

    async waitForI18n() {
        while (!window.i18n) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    }

    async loadImages() {
        // 假设主进程提供了默认图片目录
        const images = await window.electronAPI.searchImages(this.imageDirectory, '', '');
        if (images.length > 0) {
            this.allImages = images;
            this.renderImages(images);
        } else {
            this.emptyState.style.display = 'block';
        }
    }

    renderImages(images) {
        this.imageGrid.innerHTML = '';
        images.forEach(image => {
            const card = document.createElement('div');
            card.className = 'image-card';
            card.innerHTML = `
                <div class="image-container">
                    <img src="file://${image.path}" alt="${image.name}" loading="lazy">
                </div>
            `;
            card.addEventListener('click', () => this.openModal(image));
            this.imageGrid.appendChild(card);
        });
    }

    openModal(image) {
        // 只做简单预览
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        modalImg.src = `file://${image.path}`;
        modal.style.display = 'block';
        modal.onclick = () => { modal.style.display = 'none'; };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GalleryWall();

    // 导入链接点击事件
    const importLink = document.getElementById('importLink');
    if (importLink) {
        importLink.addEventListener('click', () => {
            window.electronAPI.showImportView();
        });
    }
}); 
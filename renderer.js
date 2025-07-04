class GalleryWall {
    constructor() {
        this.allImages = [];
        this.imageGrid = document.getElementById('imageGrid');
        this.init();
    }

    async init() {
        await this.waitForI18n();
        this.loadImages();
    }

    async waitForI18n() {
        while (!window.i18n) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    }

    async loadImages() {
        // 假设主进程提供了默认图片目录
        const defaultFolder = await window.electronAPI.getDefaultCompressedFolder();
        const images = await window.electronAPI.searchImages(defaultFolder, defaultFolder, '');
        this.allImages = images;
        this.renderImages(images);
    }

    renderImages(images) {
        this.imageGrid.innerHTML = '';
        this.imageGrid.classList.add('gallery-wall');
        images.forEach(image => {
            const card = document.createElement('div');
            card.className = 'image-card gallery-wall';
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
}); 
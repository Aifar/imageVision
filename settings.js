function getSystemLanguage() {
    const lang = (navigator.language || navigator.userLanguage || 'zh').toLowerCase();
    if (lang.startsWith('zh')) return 'zh';
    if (lang.startsWith('en')) return 'en';
    return 'en';
}

class SettingsManager {
    constructor() {
        this.settings = {};
        this.init();
    }

    async init() {
        await this.waitForI18n();
        await this.loadSettings();
        this.bindEvents();
    }

    async waitForI18n() {
        while (!window.i18n) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    }

    async loadSettings() {
        try {
            this.settings = await window.electronAPI.getSettings();
            // 语言优先级：设置文件 > 系统
            let lang = this.settings.language || getSystemLanguage();
            window.i18n.language = lang;
            // 设置下拉框
            const langSelect = document.getElementById('languageSelect');
            if (langSelect) langSelect.value = lang;
            this.updateUI();
        } catch (error) {
            console.error('加载设置失败:', error);
            // 使用默认设置
            this.settings = {
                imageDirectory: '',
                compressionQuality: 85,
                jpegQuality: 85,
                pngQuality: 80,
                webpQuality: 85
            };
            this.updateUI();
        }
    }

    updateUI() {
        // 更新图片目录
        document.getElementById('imageDirectory').value = this.settings.imageDirectory || '';

        // 更新压缩质量滑块
        const jpegSlider = document.getElementById('jpegQuality');

        jpegSlider.value = this.settings.jpegQuality || 85;


        // 更新显示的值
        document.getElementById('jpegQualityValue').textContent = jpegSlider.value;


        // 更新预设按钮状态
        this.updatePresetButtons('jpeg', this.settings.jpegQuality || 85);
    }

    updatePresetButtons(type, value) {
        const presets = document.querySelectorAll(`[data-quality]`);
        presets.forEach(preset => {
            preset.classList.remove('active');
            if (parseInt(preset.dataset.quality) === value) {
                preset.classList.add('active');
            }
        });
    }

    bindEvents() {
        // 关闭按钮
        document.getElementById('closeBtn').addEventListener('click', () => {
            window.close();
        });

        // 取消按钮
        document.getElementById('cancelBtn').addEventListener('click', () => {
            window.close();
        });

        // 选择目录按钮
        document.getElementById('selectDirectoryBtn').addEventListener('click', async () => {
            const currentPath = document.getElementById('imageDirectory').value;
            const selectedPath = await window.electronAPI.selectImageDirectory(currentPath);
            if (selectedPath) {
                document.getElementById('imageDirectory').value = selectedPath;
                // this.settings.imageDirectory = selectedPath;
            }
        });

        // 质量滑块事件
        const jpegSlider = document.getElementById('jpegQuality');

        jpegSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            document.getElementById('jpegQualityValue').textContent = value;
            this.settings.jpegQuality = parseInt(value);
            this.updatePresetButtons('jpeg', value);
        });


        // 预设按钮事件
        document.querySelectorAll('.quality-preset').forEach(preset => {
            preset.addEventListener('click', (e) => {
                const quality = parseInt(e.target.dataset.quality);
                const settingItem = e.target.closest('.setting-item');
                const slider = settingItem.querySelector('input[type="range"]');
                const valueDisplay = settingItem.querySelector('.quality-value');

                slider.value = quality;
                valueDisplay.textContent = quality;

                // 更新对应的设置
                if (settingItem.querySelector('#jpegQuality')) {
                    this.settings.jpegQuality = quality;
                    this.updatePresetButtons('jpeg', quality);
                }
            });
        });

        // 表单提交事件
        document.getElementById('settingsForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.saveSettings();
        });

        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.close();
            }
        });

        // 语言切换
        const langSelect = document.getElementById('languageSelect');
        console.log('langSelect', langSelect);
        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                console.log('change langSelect', e.target.value);
                window.i18n.setLanguage(e.target.value);
                this.settings.language = e.target.value;
                applyI18n();
                //this.updateUI();
            });
        }
    }

    async saveSettings() {
        const saveBtn = document.getElementById('saveBtn');
        const originalText = saveBtn.textContent;
        try {
            saveBtn.disabled = true;
            saveBtn.textContent = '保存中...';

            const oldDir = this.settings.imageDirectory;
            const newDir = document.getElementById('imageDirectory').value;

            // 保存设置
            this.settings.imageDirectory = newDir;
            this.settings.jpegQuality = parseInt(document.getElementById('jpegQuality').value);
            this.settings.language = document.getElementById('languageSelect').value;

            const result = await window.electronAPI.saveSettings(this.settings);
            if (result.success) {
                if (oldDir && oldDir !== newDir) {
                    const confirmCopy = window.confirm('检测到图片目录已更改，是否将原目录下的图片复制到新目录？');
                    if (confirmCopy) {
                        const copyResult = await window.electronAPI.copyImagesToDirectory(oldDir, newDir);
                        if (copyResult.success) {
                            this.showMessage(`已复制${copyResult.count}张图片到新目录`, 'success');
                        } else {
                            this.showMessage('图片复制失败: ' + copyResult.error, 'error');
                        }
                    }
                }
                this.showMessage('设置已保存', 'success');
                setTimeout(() => { window.close(); }, 1000);
            } else {
                throw new Error(result.error || '保存失败');
            }
        } catch (error) {
            this.showMessage('保存设置失败: ' + error.message, 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = originalText;
        }
    }

    showMessage(message, type = 'info') {
        // 创建消息元素
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            ${type === 'success' ? 'background: #28a745;' : ''}
            ${type === 'error' ? 'background: #dc3545;' : ''}
            ${type === 'info' ? 'background: #17a2b8;' : ''}
        `;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(messageEl);

        // 3秒后自动移除
        setTimeout(() => {
            messageEl.remove();
            style.remove();
        }, 3000);
    }
}

function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = window.i18n.t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = window.i18n.t(key);
    });
}

function fillLanguageOptions() {
    const langSelect = document.getElementById('languageSelect');
    if (!langSelect) return;
    langSelect.innerHTML = '';
    const languages = window.i18n.getAllLanguages();
    languages.forEach(lang => {
        const opt = document.createElement('option');
        opt.value = lang.code;
        opt.textContent = `${lang.flag} ${lang.name}`;
        langSelect.appendChild(opt);
    });
}

// 初始化设置管理器
document.addEventListener('DOMContentLoaded', () => {
    fillLanguageOptions();
    new SettingsManager();
    applyI18n();
    // 监听语言切换事件，刷新i18n文本和UI
    window.addEventListener('languageChanged', () => {
        applyI18n();
    });
}); 
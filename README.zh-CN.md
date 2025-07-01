# ImageVision - 智能图片压缩查看器

<div align="center">

![ImageVision Logo](https://via.placeholder.com/200x80/667eea/ffffff?text=ImageVision)

**一款功能强大的图片管理和压缩工具**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-v27.0.0-blue.svg)](https://www.electronjs.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](https://github.com/electron/electron)
[![Node.js](https://img.shields.io/badge/Node.js-v16.0+-green.svg)](https://nodejs.org/)

[English](README.en.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Русский](README.ru.md) | [العربية](README.ar.md)

</div>

---

## 🌟 功能特性

- **📁 智能文件夹浏览** - 支持递归扫描图片文件，自动识别图片格式
- **🖼️ 多格式支持** - 支持 JPG, PNG, GIF, BMP, WebP, SVG, TIFF 等主流格式
- **⚡ 高效压缩** - 基于 Sharp 和 Imagemin 的双引擎压缩，显著减少文件大小
- **📊 对比查看** - 原图与压缩图的左右分屏对比显示
- **🗑️ 智能管理** - 一键批量删除原图，释放存储空间
- **🌍 多语言支持** - 支持 9 种语言界面，实时切换
- **💾 批量处理** - 支持批量压缩和并发处理，提升效率
- **📈 实时统计** - 显示压缩进度、节省空间和处理速度
- **🎨 现代界面** - 美观的用户界面，支持响应式布局

## 🚀 快速开始

### 系统要求

- Node.js 16.0 或更高版本
- 支持的操作系统：Windows, macOS, Linux
- 至少 4GB 内存和 1GB 可用磁盘空间

### 安装步骤

```bash
# 克隆项目
git clone https://github.com/your-username/imagevision.git
cd imagevision

# 安装依赖
npm install

# 启动应用
npm start
```

### 开发模式

```bash
# 开发模式启动（带开发者工具）
npm run dev

# 构建应用
npm run build

# 测试压缩功能
npm test
```

## 📖 使用指南

1. **选择文件夹** - 点击"选择文件夹"按钮，选择包含图片的文件夹
2. **设置压缩目录** - 选择压缩图片的保存位置（默认为 Documents/imagevision）
3. **调整压缩质量** - 使用滑块调整压缩质量（0-100，推荐 75-85）
4. **切换语言** - 右上角选择您偏好的语言界面
5. **查看图片** - 点击图片卡片查看详细信息和对比效果
6. **批量压缩** - 应用会自动压缩文件夹中的所有图片
7. **管理原图** - 压缩完成后可选择删除原图文件释放空间
8. **实时统计** - 查看压缩进度、节省空间和文件数量统计

## 🔧 核心功能详解

### 📊 对比查看模式

- **左右分屏显示**：原图与压缩图并排对比，直观查看压缩效果
- **文件信息展示**：显示文件大小、尺寸、压缩比例等详细信息
- **高清预览**：支持图片缩放和全屏查看
- **快捷操作**：支持键盘方向键切换图片，ESC 键退出

### 🗑️ 智能文件管理

- **安全删除**：删除前会弹出确认对话框，避免误操作
- **批量操作**：一键删除所有已压缩的原图文件
- **状态标识**：已删除原图的文件会显示金黄色特殊标识
- **存储统计**：实时显示节省的磁盘空间

### ⚡ 高效压缩引擎

- **多引擎支持**：集成 Sharp 和 Imagemin 双引擎
- **格式优化**：针对不同格式使用最优压缩算法
  - **JPG**: mozjpeg 引擎优化，保持高画质
  - **PNG**: pngquant 量化压缩，减少颜色数量
  - **GIF**: gifsicle 优化，动图压缩
  - **WebP**: 现代格式转换，更高压缩率
- **并发处理**：支持多文件同时压缩，充分利用多核 CPU

## 🎨 界面特性

- **现代化设计** - 简洁美观的用户界面，遵循现代设计规范
- **响应式布局** - 适配不同屏幕尺寸，完美支持高分辨率显示器
- **实时反馈** - 压缩进度和状态实时显示，进度条动画流畅
- **智能标识** - 已删除原图的特殊金黄色标识和警告图标
- **悬浮效果** - 图片卡片悬浮动画，提升用户体验
- **多语言切换** - 右上角语言选择器，支持 9 种语言实时切换

## 📊 数据统计

应用提供详细的压缩统计信息：

- **处理进度** - 实时显示当前处理的文件数和总文件数
- **压缩比例** - 显示平均压缩率和总体节省空间
- **文件状态** - 区分已压缩、压缩中、原图已删除等状态
- **性能指标** - 显示处理速度和预计完成时间

## 🛠️ 技术架构

- **前端框架**：原生 JavaScript + HTML5 + CSS3
- **桌面框架**：Electron v27.0.0
- **图片处理**：Sharp v0.33.0, Imagemin v8.0.1
- **压缩引擎**：mozjpeg, pngquant, gifsicle, webp
- **文件系统**：Node.js fs 模块
- **国际化**：自定义 i18n 系统

## 📁 项目结构

```
imagevision/
├── main.js              # 主进程文件，处理应用生命周期
├── renderer.js          # 渲染进程文件，处理用户界面
├── preload.js           # 预加载脚本，安全的API桥接
├── index.html           # 主界面HTML结构
├── styles.css           # 样式文件，界面美化
├── languages.js         # 多语言配置文件
├── package.json         # 项目配置和依赖管理
├── test-compression.js  # 压缩功能测试脚本
├── test-images/         # 测试图片目录
└── README.md            # 项目说明文档
```

## 🌐 支持的语言

- 🇨🇳 **简体中文** (zh-CN) - 中国大陆
- 🇺🇸 **English** (en) - 英语
- 🇯🇵 **日本語** (ja) - 日语
- 🇰🇷 **한국어** (ko) - 韩语
- 🇫🇷 **Français** (fr) - 法语
- 🇩🇪 **Deutsch** (de) - 德语
- 🇪🇸 **Español** (es) - 西班牙语
- 🇷🇺 **Русский** (ru) - 俄语
- 🇸🇦 **العربية** (ar) - 阿拉伯语

## 🔧 故障排除

### 常见问题

**Q: 应用无法启动？**
A: 请确保已安装 Node.js 16.0 或更高版本，并运行 `npm install` 安装所有依赖。

**Q: 图片压缩失败？**
A: 检查图片文件是否损坏，确保有足够的磁盘空间，并验证压缩目录权限。

**Q: 语言切换不生效？**
A: 重启应用后语言设置会生效，设置会自动保存到本地存储。

**Q: 删除原图后如何恢复？**
A: 删除操作是永久性的，建议在删除前先备份重要图片。

### 性能优化建议

- **大文件处理**: 对于大量图片，建议分批处理以避免内存不足
- **质量设置**: 建议使用 75-85 的压缩质量，在文件大小和画质间取得平衡
- **存储空间**: 确保压缩目录有足够空间存储压缩后的文件

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！详见[贡献指南](#贡献指南)。

---

## 📈 版本更新日志

### v1.0.0 (Current)

- ✅ 基础图片压缩功能
- ✅ 多格式支持 (JPG, PNG, GIF, WebP, etc.)
- ✅ 左右对比查看模式
- ✅ 批量删除原图功能
- ✅ 9 种语言国际化支持
- ✅ 实时压缩统计
- ✅ 响应式用户界面

### 🚀 计划功能 (Roadmap)

- 🔄 支持更多压缩格式 (AVIF, HEIC)
- 🔄 图片编辑功能 (旋转、裁剪、滤镜)
- 🔄 云存储集成 (Google Drive, Dropbox)
- 🔄 批量重命名功能
- 🔄 EXIF 数据查看和编辑
- 🔄 图片格式转换
- 🔄 深度学习图片增强

## 💡 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. **Fork** 这个项目
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 **Pull Request**

### 开发环境设置

```bash
# 克隆项目
git clone https://github.com/your-username/imagevision.git
cd imagevision

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
npm test
```

### 代码规范

- 使用 ES6+ 语法
- 遵循 JSDoc 注释规范
- 保持代码简洁和可读性
- 添加适当的错误处理

## 📞 支持与联系

如果您遇到问题或有建议，请通过以下方式联系我们：

- 📧 **Email**: support@imagevision.com
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/your-username/imagevision/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/your-username/imagevision/discussions)
- 📖 **Documentation**: [Wiki](https://github.com/your-username/imagevision/wiki)
- 💬 **Community**: [Discord Server](https://discord.gg/imagevision)

## 🙏 致谢

特别感谢以下开源项目和库：

- [Electron](https://www.electronjs.org/) - 跨平台桌面应用框架
- [Sharp](https://sharp.pixelplumbing.com/) - 高性能图像处理库
- [Imagemin](https://github.com/imagemin/imagemin) - 图像压缩工具链
- 所有贡献者和用户的支持与反馈

---

<div align="center">

### ⭐ 如果这个项目对您有帮助，请给我们一个 Star！

[![GitHub stars](https://img.shields.io/github/stars/your-username/imagevision.svg?style=social&label=Star)](https://github.com/your-username/imagevision)
[![GitHub forks](https://img.shields.io/github/forks/your-username/imagevision.svg?style=social&label=Fork)](https://github.com/your-username/imagevision/fork)
[![GitHub watchers](https://img.shields.io/github/watchers/your-username/imagevision.svg?style=social&label=Watch)](https://github.com/your-username/imagevision)

**ImageVision - 让图片管理变得简单高效**

**Made with ❤️ by the ImageVision Team**

</div>

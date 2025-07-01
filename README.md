# ImageVision - Smart Image Compression Viewer

<div align="center">

![ImageVision Logo](https://via.placeholder.com/200x80/667eea/ffffff?text=ImageVision)

**A powerful image management and compression tool**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-v27.0.0-blue.svg)](https://www.electronjs.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](https://github.com/electron/electron)
[![Node.js](https://img.shields.io/badge/Node.js-v16.0+-green.svg)](https://nodejs.org/)

[English](README.md) | [中文](README.zh-CN.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Русский](README.ru.md) | [العربية](README.ar.md)

</div>

---

## 🌟 Features

- **📁 Smart Folder Browsing** - Recursive image file scanning with automatic format detection
- **🖼️ Multi-Format Support** - Supports JPG, PNG, GIF, BMP, WebP, SVG, TIFF and more
- **⚡ Efficient Compression** - Dual-engine compression with Sharp and Imagemin
- **📊 Comparison View** - Side-by-side comparison of original and compressed images
- **🗑️ Smart Management** - One-click batch deletion of original images to free up space
- **🌍 Multi-Language Support** - 9 language interfaces with real-time switching
- **💾 Batch Processing** - Batch compression with concurrent processing
- **📈 Real-time Statistics** - Compression progress, space savings, and processing speed display
- **🎨 Modern Interface** - Beautiful UI with responsive design

## 🚀 Quick Start

### System Requirements

- Node.js 16.0 or higher
- Supported OS: Windows, macOS, Linux
- At least 4GB RAM and 1GB available disk space

### Installation

```bash
# Clone the project
git clone https://github.com/your-username/imagevision.git
cd imagevision

# Install dependencies
npm install

# Start the application
npm start
```

### Development Mode

```bash
# Start in development mode (with dev tools)
npm run dev

# Build the application
npm run build

# Test compression functionality
npm test
```

## 📖 User Guide

1. **Select Folder** - Click "Select Folder" to choose a folder containing images
2. **Set Compression Directory** - Choose where to save compressed images (default: Documents/imagevision)
3. **Adjust Quality** - Use the slider to adjust compression quality (0-100, recommended 75-85)
4. **Switch Language** - Select your preferred language from the top-right corner
5. **View Images** - Click image cards to view details and comparison
6. **Batch Compression** - The app automatically compresses all images in the folder
7. **Manage Originals** - Optionally delete original files after compression to free up space
8. **Real-time Statistics** - Monitor compression progress, space savings, and file counts

## 🔧 Core Features

### 📊 Comparison View Mode

- **Split-screen Display**: Side-by-side comparison of original and compressed images
- **File Information**: Shows file size, dimensions, compression ratio, and other details
- **High-quality Preview**: Supports image zooming and full-screen viewing
- **Quick Navigation**: Arrow keys for image switching, ESC to exit

### 🗑️ Smart File Management

- **Safe Deletion**: Confirmation dialog before deletion to prevent accidents
- **Batch Operations**: One-click deletion of all compressed original images
- **Status Indicators**: Special golden markers for deleted original files
- **Storage Statistics**: Real-time display of saved disk space

### ⚡ Efficient Compression Engine

- **Multi-engine Support**: Integrated Sharp and Imagemin dual engines
- **Format Optimization**: Optimal compression algorithms for different formats
  - **JPG**: mozjpeg engine optimization, maintaining high quality
  - **PNG**: pngquant quantization compression, reducing color count
  - **GIF**: gifsicle optimization for animated images
  - **WebP**: Modern format conversion with higher compression ratios
- **Concurrent Processing**: Multi-file simultaneous compression utilizing multi-core CPUs

## 🎨 Interface Features

- **Modern Design** - Clean and beautiful UI following modern design principles
- **Responsive Layout** - Adapts to different screen sizes with perfect high-resolution display support
- **Real-time Feedback** - Live compression progress with smooth progress bar animations
- **Smart Indicators** - Special golden markers and warning icons for deleted originals
- **Hover Effects** - Image card hover animations enhancing user experience
- **Multi-language Switching** - Top-right language selector with 9 languages supported

## 📊 Data Statistics

The application provides detailed compression statistics:

- **Processing Progress** - Real-time display of current and total file counts
- **Compression Ratio** - Shows average compression rate and total space savings
- **File Status** - Distinguishes between compressed, processing, and deleted original states
- **Performance Metrics** - Processing speed and estimated completion time

## 🛠️ Technical Architecture

- **Frontend Framework**: Native JavaScript + HTML5 + CSS3
- **Desktop Framework**: Electron v27.0.0
- **Image Processing**: Sharp v0.33.0, Imagemin v8.0.1
- **Compression Engines**: mozjpeg, pngquant, gifsicle, webp
- **File System**: Node.js fs module
- **Internationalization**: Custom i18n system

## 📁 Project Structure

```
imagevision/
├── main.js              # Main process file, handles app lifecycle
├── renderer.js          # Renderer process file, handles user interface
├── preload.js           # Preload script, secure API bridge
├── index.html           # Main interface HTML structure
├── styles.css           # Stylesheet for interface styling
├── languages.js         # Multi-language configuration file
├── package.json         # Project configuration and dependency management
├── test-compression.js  # Compression functionality test script
├── test-images/         # Test images directory
└── README.md            # Project documentation
```

## 🌐 Supported Languages

- 🇨🇳 **简体中文** (zh-CN) - Simplified Chinese
- 🇺🇸 **English** (en) - English
- 🇯🇵 **日本語** (ja) - Japanese
- 🇰🇷 **한국어** (ko) - Korean
- 🇫🇷 **Français** (fr) - French
- 🇩🇪 **Deutsch** (de) - German
- 🇪🇸 **Español** (es) - Spanish
- 🇷🇺 **Русский** (ru) - Russian
- 🇸🇦 **العربية** (ar) - Arabic

## 🔧 Troubleshooting

### Common Issues

**Q: Application won't start?**
A: Ensure Node.js 16.0+ is installed and run `npm install` to install all dependencies.

**Q: Image compression fails?**
A: Check if image files are corrupted, ensure sufficient disk space, and verify compression directory permissions.

**Q: Language switching doesn't work?**
A: Restart the application for language settings to take effect. Settings are automatically saved to local storage.

**Q: How to recover deleted originals?**
A: Deletion is permanent. It's recommended to backup important images before deletion.

### Performance Optimization Tips

- **Large File Processing**: For many images, process in batches to avoid memory issues
- **Quality Settings**: Recommended compression quality of 75-85 for optimal balance between file size and image quality
- **Storage Space**: Ensure compression directory has sufficient space for compressed files

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Issues and Pull Requests are welcome! See [Contributing Guide](#contributing-guide) for details.

---

## 📈 Version Update Log

### v1.0.0 (Current)

- ✅ Basic image compression functionality
- ✅ Multi-format support (JPG, PNG, GIF, WebP, etc.)
- ✅ Side-by-side comparison view mode
- ✅ Batch deletion of original images
- ✅ 9-language internationalization support
- ✅ Real-time compression statistics
- ✅ Responsive user interface

### 🚀 Planned Features (Roadmap)

- 🔄 Support for more compression formats (AVIF, HEIC)
- 🔄 Image editing features (rotate, crop, filters)
- 🔄 Cloud storage integration (Google Drive, Dropbox)
- 🔄 Batch rename functionality
- 🔄 EXIF data viewing and editing
- 🔄 Image format conversion
- 🔄 Deep learning image enhancement

## 💡 Contributing Guide

We welcome all forms of contributions!

### How to Contribute

1. **Fork** this project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

### Development Environment Setup

```bash
# Clone the project
git clone https://github.com/your-username/imagevision.git
cd imagevision

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

### Code Standards

- Use ES6+ syntax
- Follow JSDoc comment standards
- Keep code clean and readable
- Add appropriate error handling

## 📞 Support & Contact

If you encounter issues or have suggestions, please contact us through:

- 📧 **Email**: support@imagevision.com
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/your-username/imagevision/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/your-username/imagevision/discussions)
- 📖 **Documentation**: [Wiki](https://github.com/your-username/imagevision/wiki)
- 💬 **Community**: [Discord Server](https://discord.gg/imagevision)

## 🙏 Acknowledgments

Special thanks to the following open source projects and libraries:

- [Electron](https://www.electronjs.org/) - Cross-platform desktop application framework
- [Sharp](https://sharp.pixelplumbing.com/) - High-performance image processing library
- [Imagemin](https://github.com/imagemin/imagemin) - Image compression toolchain
- All contributors and users for their support and feedback

---

<div align="center">

### ⭐ If this project helps you, please give us a Star!

[![GitHub stars](https://img.shields.io/github/stars/your-username/imagevision.svg?style=social&label=Star)](https://github.com/your-username/imagevision)
[![GitHub forks](https://img.shields.io/github/forks/your-username/imagevision.svg?style=social&label=Fork)](https://github.com/your-username/imagevision/fork)
[![GitHub watchers](https://img.shields.io/github/watchers/your-username/imagevision.svg?style=social&label=Watch)](https://github.com/your-username/imagevision)

**ImageVision - Making Image Management Simple and Efficient**

**Made with ❤️ by the ImageVision Team**

</div>

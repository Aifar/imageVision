# ImageVision - 智能图片压缩查看器

<div align="center">

![ImageVision Logo](https://via.placeholder.com/200x80/667eea/ffffff?text=ImageVision)

**一款功能强大的图片管理和压缩工具**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-v27.0.0-blue.svg)](https://www.electronjs.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](https://github.com/electron/electron)
[![Node.js](https://img.shields.io/badge/Node.js-v16.0+-green.svg)](https://nodejs.org/)

[English](#english) | [中文](#中文) | [日本語](#日本語) | [한국어](#한국어) | [Français](#français) | [Deutsch](#deutsch) | [Español](#español) | [Русский](#русский) | [العربية](#العربية)

</div>

---

## 中文

### 🌟 功能特性

- **📁 智能文件夹浏览** - 支持递归扫描图片文件，自动识别图片格式
- **🖼️ 多格式支持** - 支持 JPG, PNG, GIF, BMP, WebP, SVG, TIFF 等主流格式
- **⚡ 高效压缩** - 基于 Sharp 和 Imagemin 的双引擎压缩，显著减少文件大小
- **📊 对比查看** - 原图与压缩图的左右分屏对比显示
- **🗑️ 智能管理** - 一键批量删除原图，释放存储空间
- **🌍 多语言支持** - 支持 9 种语言界面，实时切换
- **💾 批量处理** - 支持批量压缩和并发处理，提升效率
- **📈 实时统计** - 显示压缩进度、节省空间和处理速度
- **🎨 现代界面** - 美观的用户界面，支持响应式布局

### 🚀 快速开始

#### 系统要求

- Node.js 16.0 或更高版本
- 支持的操作系统：Windows, macOS, Linux
- 至少 4GB 内存和 1GB 可用磁盘空间

#### 安装步骤

```bash
# 克隆项目
git clone https://github.com/your-username/imagevision.git
cd imagevision

# 安装依赖
npm install

# 启动应用
npm start
```

#### 开发模式

```bash
# 开发模式启动（带开发者工具）
npm run dev

# 构建应用
npm run build

# 测试压缩功能
npm test
```

### 📖 使用指南

1. **选择文件夹** - 点击"选择文件夹"按钮，选择包含图片的文件夹
2. **设置压缩目录** - 选择压缩图片的保存位置（默认为 Documents/imagevision）
3. **调整压缩质量** - 使用滑块调整压缩质量（0-100，推荐 75-85）
4. **切换语言** - 右上角选择您偏好的语言界面
5. **查看图片** - 点击图片卡片查看详细信息和对比效果
6. **批量压缩** - 应用会自动压缩文件夹中的所有图片
7. **管理原图** - 压缩完成后可选择删除原图文件释放空间
8. **实时统计** - 查看压缩进度、节省空间和文件数量统计

### 🔧 核心功能详解

#### 📊 对比查看模式

- **左右分屏显示**：原图与压缩图并排对比，直观查看压缩效果
- **文件信息展示**：显示文件大小、尺寸、压缩比例等详细信息
- **高清预览**：支持图片缩放和全屏查看
- **快捷操作**：支持键盘方向键切换图片，ESC 键退出

#### 🗑️ 智能文件管理

- **安全删除**：删除前会弹出确认对话框，避免误操作
- **批量操作**：一键删除所有已压缩的原图文件
- **状态标识**：已删除原图的文件会显示金黄色特殊标识
- **存储统计**：实时显示节省的磁盘空间

#### ⚡ 高效压缩引擎

- **多引擎支持**：集成 Sharp 和 Imagemin 双引擎
- **格式优化**：针对不同格式使用最优压缩算法
  - **JPG**: mozjpeg 引擎优化，保持高画质
  - **PNG**: pngquant 量化压缩，减少颜色数量
  - **GIF**: gifsicle 优化，动图压缩
  - **WebP**: 现代格式转换，更高压缩率
- **并发处理**：支持多文件同时压缩，充分利用多核 CPU

### 🎨 界面特性

- **现代化设计** - 简洁美观的用户界面，遵循现代设计规范
- **响应式布局** - 适配不同屏幕尺寸，完美支持高分辨率显示器
- **实时反馈** - 压缩进度和状态实时显示，进度条动画流畅
- **智能标识** - 已删除原图的特殊金黄色标识和警告图标
- **悬浮效果** - 图片卡片悬浮动画，提升用户体验
- **多语言切换** - 右上角语言选择器，支持 9 种语言实时切换

### 📊 数据统计

应用提供详细的压缩统计信息：

- **处理进度** - 实时显示当前处理的文件数和总文件数
- **压缩比例** - 显示平均压缩率和总体节省空间
- **文件状态** - 区分已压缩、压缩中、原图已删除等状态
- **性能指标** - 显示处理速度和预计完成时间

### 🛠️ 技术架构

- **前端框架**：原生 JavaScript + HTML5 + CSS3
- **桌面框架**：Electron v27.0.0
- **图片处理**：Sharp v0.33.0, Imagemin v8.0.1
- **压缩引擎**：mozjpeg, pngquant, gifsicle, webp
- **文件系统**：Node.js fs 模块
- **国际化**：自定义 i18n 系统

### 📁 项目结构

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

### 🌐 支持的语言

- 🇨🇳 **简体中文** (zh-CN) - 中国大陆
- 🇺🇸 **English** (en) - 英语
- 🇯🇵 **日本語** (ja) - 日语
- 🇰🇷 **한국어** (ko) - 韩语
- 🇫🇷 **Français** (fr) - 法语
- 🇩🇪 **Deutsch** (de) - 德语
- 🇪🇸 **Español** (es) - 西班牙语
- 🇷🇺 **Русский** (ru) - 俄语
- 🇸🇦 **العربية** (ar) - 阿拉伯语

### 🔧 故障排除

#### 常见问题

**Q: 应用无法启动？**
A: 请确保已安装 Node.js 16.0 或更高版本，并运行 `npm install` 安装所有依赖。

**Q: 图片压缩失败？**
A: 检查图片文件是否损坏，确保有足够的磁盘空间，并验证压缩目录权限。

**Q: 语言切换不生效？**
A: 重启应用后语言设置会生效，设置会自动保存到本地存储。

**Q: 删除原图后如何恢复？**
A: 删除操作是永久性的，建议在删除前先备份重要图片。

#### 性能优化建议

- **大文件处理**: 对于大量图片，建议分批处理以避免内存不足
- **质量设置**: 建议使用 75-85 的压缩质量，在文件大小和画质间取得平衡
- **存储空间**: 确保压缩目录有足够空间存储压缩后的文件

### 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

### 🤝 贡献

欢迎提交 Issue 和 Pull Request！详见[贡献指南](#贡献指南)。

---

## English

### 🌟 Features

- **📁 Smart Folder Browsing** - Recursive image file scanning with automatic format detection
- **🖼️ Multi-Format Support** - Supports JPG, PNG, GIF, BMP, WebP, SVG, TIFF and more
- **⚡ Efficient Compression** - Dual-engine compression with Sharp and Imagemin
- **📊 Comparison View** - Side-by-side comparison of original and compressed images
- **🗑️ Smart Management** - One-click batch deletion of original images to free up space
- **🌍 Multi-Language Support** - 9 language interfaces with real-time switching
- **💾 Batch Processing** - Batch compression with concurrent processing
- **📈 Real-time Statistics** - Compression progress, space savings, and processing speed display
- **🎨 Modern Interface** - Beautiful UI with responsive design

### 🚀 Quick Start

#### System Requirements

- Node.js 16.0 or higher
- Supported OS: Windows, macOS, Linux
- At least 4GB RAM and 1GB available disk space

#### Installation

```bash
# Clone the project
git clone https://github.com/your-username/imagevision.git
cd imagevision

# Install dependencies
npm install

# Start the application
npm start
```

#### Development Mode

```bash
# Start in development mode (with dev tools)
npm run dev

# Build the application
npm run build

# Test compression functionality
npm test
```

### 📖 User Guide

1. **Select Folder** - Click "Select Folder" to choose a folder containing images
2. **Set Compression Directory** - Choose where to save compressed images (default: Documents/imagevision)
3. **Adjust Quality** - Use the slider to adjust compression quality (0-100, recommended 75-85)
4. **Switch Language** - Select your preferred language from the top-right corner
5. **View Images** - Click image cards to view details and comparison
6. **Batch Compression** - The app automatically compresses all images in the folder
7. **Manage Originals** - Optionally delete original files after compression to free up space
8. **Real-time Statistics** - Monitor compression progress, space savings, and file counts

### 🔧 Core Features

#### 📊 Comparison View Mode

- **Split-screen Display**: Side-by-side comparison of original and compressed images
- **File Information**: Shows file size, dimensions, compression ratio, and other details
- **High-quality Preview**: Supports image zooming and full-screen viewing
- **Quick Navigation**: Arrow keys for image switching, ESC to exit

#### 🗑️ Smart File Management

- **Safe Deletion**: Confirmation dialog before deletion to prevent accidents
- **Batch Operations**: One-click deletion of all compressed original images
- **Status Indicators**: Special golden markers for deleted original files
- **Storage Statistics**: Real-time display of saved disk space

#### ⚡ Efficient Compression Engine

- **Multi-engine Support**: Integrated Sharp and Imagemin dual engines
- **Format Optimization**: Optimal compression algorithms for different formats
  - **JPG**: mozjpeg engine optimization, maintaining high quality
  - **PNG**: pngquant quantization compression, reducing color count
  - **GIF**: gifsicle optimization for animated images
  - **WebP**: Modern format conversion with higher compression ratios
- **Concurrent Processing**: Multi-file simultaneous compression utilizing multi-core CPUs

### 🎨 Interface Features

- **Modern Design** - Clean and beautiful UI following modern design principles
- **Responsive Layout** - Adapts to different screen sizes with perfect high-resolution display support
- **Real-time Feedback** - Live compression progress with smooth progress bar animations
- **Smart Indicators** - Special golden markers and warning icons for deleted originals
- **Hover Effects** - Image card hover animations enhancing user experience
- **Multi-language Switching** - Top-right language selector with 9 languages supported

### 📊 Data Statistics

The application provides detailed compression statistics:

- **Processing Progress** - Real-time display of current and total file counts
- **Compression Ratio** - Shows average compression rate and total space savings
- **File Status** - Distinguishes between compressed, processing, and deleted original states
- **Performance Metrics** - Processing speed and estimated completion time

### 🛠️ Technical Architecture

- **Frontend Framework**: Native JavaScript + HTML5 + CSS3
- **Desktop Framework**: Electron v27.0.0
- **Image Processing**: Sharp v0.33.0, Imagemin v8.0.1
- **Compression Engines**: mozjpeg, pngquant, gifsicle, webp
- **File System**: Node.js fs module
- **Internationalization**: Custom i18n system

### 📁 Project Structure

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

### 🌐 Supported Languages

- 🇨🇳 **简体中文** (zh-CN) - Simplified Chinese
- 🇺🇸 **English** (en) - English
- 🇯🇵 **日本語** (ja) - Japanese
- 🇰🇷 **한국어** (ko) - Korean
- 🇫🇷 **Français** (fr) - French
- 🇩🇪 **Deutsch** (de) - German
- 🇪🇸 **Español** (es) - Spanish
- 🇷🇺 **Русский** (ru) - Russian
- 🇸🇦 **العربية** (ar) - Arabic

### 🔧 Troubleshooting

#### Common Issues

**Q: Application won't start?**
A: Ensure Node.js 16.0+ is installed and run `npm install` to install all dependencies.

**Q: Image compression fails?**
A: Check if image files are corrupted, ensure sufficient disk space, and verify compression directory permissions.

**Q: Language switching doesn't work?**
A: Restart the application for language settings to take effect. Settings are automatically saved to local storage.

**Q: How to recover deleted originals?**
A: Deletion is permanent. It's recommended to backup important images before deletion.

#### Performance Optimization Tips

- **Large File Processing**: For many images, process in batches to avoid memory issues
- **Quality Settings**: Recommended compression quality of 75-85 for optimal balance between file size and image quality
- **Storage Space**: Ensure compression directory has sufficient space for compressed files

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 🤝 Contributing

Issues and Pull Requests are welcome! See [Contributing Guide](#contributing-guide) for details.

---

## 日本語

### 🌟 機能

- **📁 スマートフォルダブラウジング** - 自動フォーマット検出による再帰的画像ファイルスキャン
- **🖼️ 多形式サポート** - JPG、PNG、GIF、BMP、WebP、SVG、TIFF など多数の形式をサポート
- **⚡ 効率的圧縮** - Sharp と Imagemin のデュアルエンジン圧縮
- **📊 比較表示** - 元画像と圧縮画像の左右比較表示
- **🗑️ スマート管理** - ワンクリックで元画像を一括削除し、容量を節約
- **🌍 多言語サポート** - 9 言語インターフェースとリアルタイム切り替え
- **💾 バッチ処理** - 並行処理によるバッチ圧縮
- **📈 リアルタイム統計** - 圧縮進行状況、容量節約、処理速度の表示
- **🎨 モダンインターフェース** - レスポンシブデザインによる美しい UI

### 🚀 クイックスタート

#### システム要件

- Node.js 16.0 以上
- サポート OS：Windows、macOS、Linux
- 最低 4GB の RAM と 1GB の利用可能ディスク容量

#### インストール

```bash
# プロジェクトをクローン
git clone https://github.com/your-username/imagevision.git
cd imagevision

# 依存関係をインストール
npm install

# アプリケーションを起動
npm start
```

### 📖 使用ガイド

1. **フォルダ選択** - 「フォルダ選択」をクリックして画像を含むフォルダを選択
2. **圧縮ディレクトリ設定** - 圧縮画像の保存場所を選択（デフォルト：Documents/imagevision）
3. **品質調整** - スライダーで圧縮品質を調整（0-100、推奨 75-85）
4. **言語切り替え** - 右上角から希望の言語インターフェースを選択
5. **画像表示** - 画像カードをクリックして詳細と比較を表示
6. **バッチ圧縮** - アプリがフォルダ内のすべての画像を自動圧縮
7. **元画像管理** - 圧縮後に元画像ファイルを削除して容量を節約
8. **リアルタイム統計** - 圧縮進行状況、容量節約、ファイル数の監視

---

## 한국어

### 🌟 기능

- **📁 스마트 폴더 브라우징** - 자동 형식 감지를 통한 재귀적 이미지 파일 스캔
- **🖼️ 다중 형식 지원** - JPG, PNG, GIF, BMP, WebP, SVG, TIFF 등 다양한 형식 지원
- **⚡ 효율적 압축** - Sharp와 Imagemin의 듀얼 엔진 압축
- **📊 비교 보기** - 원본과 압축 이미지의 좌우 비교 표시
- **🗑️ 스마트 관리** - 원클릭으로 원본 이미지 일괄 삭제하여 공간 절약
- **🌍 다국어 지원** - 9개 언어 인터페이스와 실시간 전환
- **💾 배치 처리** - 동시 처리를 통한 배치 압축
- **📈 실시간 통계** - 압축 진행률, 공간 절약, 처리 속도 표시
- **🎨 모던 인터페이스** - 반응형 디자인의 아름다운 UI

### 🚀 빠른 시작

#### 시스템 요구사항

- Node.js 16.0 이상
- 지원 OS: Windows, macOS, Linux
- 최소 4GB RAM 및 1GB 사용 가능한 디스크 공간

#### 설치

```bash
# 프로젝트 클론
git clone https://github.com/your-username/imagevision.git
cd imagevision

# 의존성 설치
npm install

# 애플리케이션 시작
npm start
```

### 📖 사용 가이드

1. **폴더 선택** - "폴더 선택"을 클릭하여 이미지가 포함된 폴더 선택
2. **압축 디렉토리 설정** - 압축된 이미지를 저장할 위치 선택 (기본값: Documents/imagevision)
3. **품질 조정** - 슬라이더로 압축 품질 조정 (0-100, 권장 75-85)
4. **언어 전환** - 우상단에서 원하는 언어 인터페이스 선택
5. **이미지 보기** - 이미지 카드를 클릭하여 세부사항 및 비교 보기
6. **배치 압축** - 앱이 폴더의 모든 이미지를 자동으로 압축
7. **원본 관리** - 압축 후 원본 파일을 삭제하여 공간 절약
8. **실시간 통계** - 압축 진행률, 공간 절약, 파일 수 모니터링

---

## Français

### 🌟 Fonctionnalités

- **📁 Navigation intelligente des dossiers** - Analyse récursive des fichiers d'image avec détection automatique du format
- **🖼️ Support multi-format** - Supporte JPG, PNG, GIF, BMP, WebP, SVG, TIFF et plus
- **⚡ Compression efficace** - Compression double moteur avec Sharp et Imagemin
- **📊 Vue de comparaison** - Comparaison côte à côte des images originales et compressées
- **🗑️ Gestion intelligente** - Suppression par lot des images originales en un clic pour libérer de l'espace
- **🌍 Support multilingue** - 9 interfaces linguistiques avec commutation en temps réel
- **💾 Traitement par lots** - Compression par lots avec traitement simultané
- **📈 Statistiques en temps réel** - Affichage du progrès de compression, des économies d'espace et de la vitesse de traitement
- **🎨 Interface moderne** - Belle interface utilisateur avec design responsive

### 🚀 Démarrage rapide

#### Configuration système requise

- Node.js 16.0 ou supérieur
- OS supportés : Windows, macOS, Linux
- Au moins 4GB de RAM et 1GB d'espace disque disponible

#### Installation

```bash
# Cloner le projet
git clone https://github.com/your-username/imagevision.git
cd imagevision

# Installer les dépendances
npm install

# Démarrer l'application
npm start
```

---

## Deutsch

### 🌟 Funktionen

- **📁 Intelligente Ordner-Navigation** - Rekursive Bilddatei-Scannung mit automatischer Format-Erkennung
- **🖼️ Multi-Format-Unterstützung** - Unterstützt JPG, PNG, GIF, BMP, WebP, SVG, TIFF und mehr
- **⚡ Effiziente Komprimierung** - Dual-Engine-Komprimierung mit Sharp und Imagemin
- **📊 Vergleichsansicht** - Seite-an-Seite-Vergleich von Original- und komprimierten Bildern
- **🗑️ Intelligente Verwaltung** - Ein-Klick-Stapellöschung von Originalbildern zur Platzeinsparung
- **🌍 Mehrsprachige Unterstützung** - 9 Sprachoberflächen mit Echtzeit-Umschaltung
- **💾 Stapelverarbeitung** - Stapelkomprimierung mit gleichzeitiger Verarbeitung
- **📈 Echtzeitstatistiken** - Anzeige von Komprimierungsfortschritt, Platzeinsparungen und Verarbeitungsgeschwindigkeit
- **🎨 Moderne Oberfläche** - Schöne Benutzeroberfläche mit responsivem Design

### 🚀 Schnellstart

#### Systemanforderungen

- Node.js 16.0 oder höher
- Unterstützte Betriebssysteme: Windows, macOS, Linux
- Mindestens 4GB RAM und 1GB verfügbarer Festplattenspeicher

#### Installation

```bash
# Projekt klonen
git clone https://github.com/your-username/imagevision.git
cd imagevision

# Abhängigkeiten installieren
npm install

# Anwendung starten
npm start
```

---

## Español

### 🌟 Características

- **📁 Navegación inteligente de carpetas** - Escaneo recursivo de archivos de imagen con detección automática de formato
- **🖼️ Soporte multi-formato** - Soporta JPG, PNG, GIF, BMP, WebP, SVG, TIFF y más
- **⚡ Compresión eficiente** - Compresión de doble motor con Sharp e Imagemin
- **📊 Vista de comparación** - Comparación lado a lado de imágenes originales y comprimidas
- **🗑️ Gestión inteligente** - Eliminación por lotes de imágenes originales con un clic para liberar espacio
- **🌍 Soporte multiidioma** - 9 interfaces de idioma con cambio en tiempo real
- **💾 Procesamiento por lotes** - Compresión por lotes con procesamiento simultáneo
- **📈 Estadísticas en tiempo real** - Visualización del progreso de compresión, ahorro de espacio y velocidad de procesamiento
- **🎨 Interfaz moderna** - Hermosa interfaz de usuario con diseño responsive

### 🚀 Inicio rápido

#### Requisitos del sistema

- Node.js 16.0 o superior
- SO soportados: Windows, macOS, Linux
- Al menos 4GB de RAM y 1GB de espacio en disco disponible

#### Instalación

```bash
# Clonar el proyecto
git clone https://github.com/your-username/imagevision.git
cd imagevision

# Instalar dependencias
npm install

# Iniciar la aplicación
npm start
```

---

## Русский

### 🌟 Возможности

- **📁 Умная навигация по папкам** - Рекурсивное сканирование файлов изображений с автоматическим определением формата
- **🖼️ Поддержка множества форматов** - Поддерживает JPG, PNG, GIF, BMP, WebP, SVG, TIFF и другие
- **⚡ Эффективное сжатие** - Двухмоторное сжатие с Sharp и Imagemin
- **📊 Вид сравнения** - Сравнение оригинальных и сжатых изображений бок о бок
- **🗑️ Умное управление** - Пакетное удаление оригинальных изображений одним кликом для освобождения места
- **🌍 Многоязычная поддержка** - 9 языковых интерфейсов с переключением в реальном времени
- **💾 Пакетная обработка** - Пакетное сжатие с одновременной обработкой
- **📈 Статистика в реальном времени** - Отображение прогресса сжатия, экономии места и скорости обработки
- **🎨 Современный интерфейс** - Красивый пользовательский интерфейс с адаптивным дизайном

### 🚀 Быстрый старт

#### Системные требования

- Node.js 16.0 или выше
- Поддерживаемые ОС: Windows, macOS, Linux
- Минимум 4GB RAM и 1GB доступного дискового пространства

#### Установка

```bash
# Клонировать проект
git clone https://github.com/your-username/imagevision.git
cd imagevision

# Установить зависимости
npm install

# Запустить приложение
npm start
```

---

## العربية

### 🌟 المميزات

- **📁 تصفح ذكي للمجلدات** - مسح متكرر لملفات الصور مع الكشف التلقائي عن التنسيق
- **🖼️ دعم متعدد التنسيقات** - يدعم JPG, PNG, GIF, BMP, WebP, SVG, TIFF وأكثر
- **⚡ ضغط فعال** - ضغط بمحرك مزدوج مع Sharp و Imagemin
- **📊 عرض المقارنة** - مقارنة جنباً إلى جنب للصور الأصلية والمضغوطة
- **🗑️ إدارة ذكية** - حذف دفعي للصور الأصلية بنقرة واحدة لتوفير المساحة
- **🌍 دعم متعدد اللغات** - 9 واجهات لغوية مع التبديل في الوقت الفعلي
- **💾 معالجة دفعية** - ضغط دفعي مع معالجة متزامنة
- **📈 إحصائيات فورية** - عرض تقدم الضغط وتوفير المساحة وسرعة المعالجة
- **🎨 واجهة حديثة** - واجهة مستخدم جميلة مع تصميم متجاوب

### 🚀 البداية السريعة

#### متطلبات النظام

- Node.js 16.0 أو أعلى
- أنظمة التشغيل المدعومة: Windows, macOS, Linux
- على الأقل 4GB من ذاكرة التشغيل و 1GB من مساحة القرص المتاحة

#### التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/your-username/imagevision.git
cd imagevision

# تثبيت التبعيات
npm install

# تشغيل التطبيق
npm start
```

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

# ImageVision - スマート画像圧縮ビューア

<div align="center">

![ImageVision Logo](https://via.placeholder.com/200x80/667eea/ffffff?text=ImageVision)

**強力な画像管理・圧縮ツール**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-v27.0.0-blue.svg)](https://www.electronjs.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](https://github.com/electron/electron)
[![Node.js](https://img.shields.io/badge/Node.js-v16.0+-green.svg)](https://nodejs.org/)

[English](README.md) | [中文](README.zh-CN.md) | [한국어](README.ko.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Русский](README.ru.md) | [العربية](README.ar.md)

</div>

---

## 🌟 機能

- **📁 スマートフォルダブラウジング** - 自動フォーマット検出による再帰的画像ファイルスキャン
- **🖼️ 多形式サポート** - JPG、PNG、GIF、BMP、WebP、SVG、TIFF など多数の形式をサポート
- **⚡ 効率的圧縮** - Sharp と Imagemin のデュアルエンジン圧縮
- **📊 比較表示** - 元画像と圧縮画像の左右比較表示
- **🗑️ スマート管理** - ワンクリックで元画像を一括削除し、容量を節約
- **🌍 多言語サポート** - 9 言語インターフェースとリアルタイム切り替え
- **💾 バッチ処理** - 並行処理によるバッチ圧縮
- **📈 リアルタイム統計** - 圧縮進行状況、容量節約、処理速度の表示
- **🎨 モダンインターフェース** - レスポンシブデザインによる美しい UI

## 🚀 クイックスタート

### システム要件

- Node.js 16.0 以上
- サポート OS：Windows、macOS、Linux
- 最低 4GB の RAM と 1GB の利用可能ディスク容量

### インストール

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

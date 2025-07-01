# ImageVision - 스마트 이미지 압축 뷰어

<div align="center">

![ImageVision Logo](https://via.placeholder.com/200x80/667eea/ffffff?text=ImageVision)

**강력한 이미지 관리 및 압축 도구**

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](https://opensource.org/licenses/GPL-3.0)
[![Electron](https://img.shields.io/badge/Electron-v27.0.0-blue.svg)](https://www.electronjs.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](https://github.com/electron/electron)
[![Node.js](https://img.shields.io/badge/Node.js-v16.0+-green.svg)](https://nodejs.org/)

[English](README.md) | [中文](README.zh-CN.md) | [日本語](README.ja.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Русский](README.ru.md) | [العربية](README.ar.md)

</div>

---

## 🌟 기능

- **📁 스마트 폴더 브라우징** - 자동 형식 감지를 통한 재귀적 이미지 파일 스캔
- **🖼️ 다중 형식 지원** - JPG, PNG, GIF, BMP, WebP, SVG, TIFF 등 다양한 형식 지원
- **⚡ 효율적 압축** - Sharp와 Imagemin의 듀얼 엔진 압축
- **📊 비교 보기** - 원본과 압축 이미지의 좌우 비교 표시
- **🗑️ 스마트 관리** - 원클릭으로 원본 이미지 일괄 삭제하여 공간 절약
- **🌍 다국어 지원** - 9개 언어 인터페이스와 실시간 전환
- **💾 배치 처리** - 동시 처리를 통한 배치 압축
- **📈 실시간 통계** - 압축 진행률, 공간 절약, 처리 속도 표시
- **🎨 모던 인터페이스** - 반응형 디자인의 아름다운 UI

## 🚀 빠른 시작

### 시스템 요구사항

- Node.js 16.0 이상
- 지원 OS: Windows, macOS, Linux
- 최소 4GB RAM 및 1GB 사용 가능한 디스크 공간

### 설치

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

// 多语言配置文件
const languages = {
    'zh-CN': {
        name: '简体中文',
        flag: '🇨🇳',
        translations: {
            // 应用标题
            appTitle: '图片查看器',

            // 工具栏
            selectFolder: '请选择图片文件夹',
            saveTo: '保存到:',
            selectSaveFolder: '选择',
            quality: '质量:',
            searchPlaceholder: '',

            // 主界面
            loadingImages: '正在扫描图片...',
            startBrowsing: '开始浏览图片',
            startBrowsingDesc: '点击"选择文件夹"来浏览您的图片集合',
            imagesCount: '{count} 张图片',

            // 图片信息
            originalSize: '原始尺寸:',
            fileSize: '文件大小:',
            compressionSuggestion: '压缩建议:',
            compressThisImage: '压缩此图片',

            // 压缩相关
            compressing: '正在压缩图片...',
            compressionComplete: '压缩完成',
            success: '成功:',
            failed: '失败:',
            spaceSaved: '节省空间:',
            openCompressedFolder: '打开压缩文件夹',
            close: '关闭',

            // 错误信息
            selectFolderError: '选择文件夹失败，请重试。',
            loadImagesError: '加载图片失败，请检查文件夹权限。',
            noImagesFound: '未找到图片文件',
            noImagesFoundDesc: '此文件夹中没有找到支持的图片格式',

            // 压缩方法
            compressionMethods: {
                sharp: 'Sharp',
                mozjpeg: 'MozJPEG',
                pngquant: 'PNGQuant',
                gifsicle: 'Gifsicle',
                webp: 'WebP'
            },

            // 语言选择
            selectLanguage: '选择语言',

            // 统计信息
            compressionProgress: '压缩进度: {progress}% ({current}/{total})',
            queue: '队列',
            allCompressed: '全部压缩完成',
            searchResult: '搜索',
            noMatchingImages: '未找到匹配的图片',
            noMatchingImagesDesc: '尝试调整搜索关键词或选择其他文件夹',
            noImagesInFolder: '文件夹中没有图片',
            errorOccurred: '出现错误',

            // 压缩状态
            queueing: '排队中 (第{position}位)',
            compressingStatus: '压缩中... ({current}/{max})',
            compressedSize: '压缩后大小:',
            saved: '节省 {ratio}%',
            selectCompressedFolderFirst: '请先选择压缩文件夹',
            waitingCompression: '等待压缩...',
            imageLoadFailed: '图片加载失败',

            // 压缩方法翻译
            copy: '复制',
            existing: '已存在',
            none: '无压缩',

            // 图片详情
            dimensions: '尺寸:',
            originalFileSize: '原图大小:',

            // 压缩信息
            compressionRatio: '压缩比: {ratio}%',
            alreadyCompressed: '已压缩',
            noCompressionNeeded: '无需压缩',
            unableToGetSuggestions: '无法获取压缩建议'
        }
    },

    'en': {
        name: 'English',
        flag: '🇺🇸',
        translations: {
            appTitle: 'Image Viewer',

            selectFolder: 'Please select image folder',
            saveTo: 'Save to:',
            selectSaveFolder: 'Select',
            quality: 'Quality:',
            searchPlaceholder: '',

            loadingImages: 'Scanning images...',
            startBrowsing: 'Start browsing images',
            startBrowsingDesc: 'Click "Select Folder" to browse your image collection',
            imagesCount: '{count} images',

            originalSize: 'Original Size:',
            fileSize: 'File Size:',
            compressionSuggestion: 'Compression Suggestion:',
            compressThisImage: 'Compress This Image',

            compressing: 'Compressing images...',
            compressionComplete: 'Compression Complete',
            success: 'Success:',
            failed: 'Failed:',
            spaceSaved: 'Space Saved:',
            openCompressedFolder: 'Open Compressed Folder',
            close: 'Close',

            selectFolderError: 'Failed to select folder, please try again.',
            loadImagesError: 'Failed to load images, please check folder permissions.',
            noImagesFound: 'No images found',
            noImagesFoundDesc: 'No supported image formats found in this folder',

            compressionMethods: {
                sharp: 'Sharp',
                mozjpeg: 'MozJPEG',
                pngquant: 'PNGQuant',
                gifsicle: 'Gifsicle',
                webp: 'WebP'
            },

            selectLanguage: 'Select Language',

            compressionProgress: 'Compression Progress: {progress}% ({current}/{total})',
            queue: 'Queue',
            allCompressed: 'All Compressed',
            searchResult: 'Search',
            noMatchingImages: 'No matching images found',
            noMatchingImagesDesc: 'Try adjusting search keywords or select another folder',
            noImagesInFolder: 'No images in folder',
            errorOccurred: 'An error occurred',

            queueing: 'Queuing (#{position})',
            compressingStatus: 'Compressing... ({current}/{max})',
            compressedSize: 'Compressed Size:',
            saved: 'Saved {ratio}%',
            selectCompressedFolderFirst: 'Please select compressed folder first',
            waitingCompression: 'Waiting for compression...',
            imageLoadFailed: 'Image load failed',

            copy: 'Copy',
            existing: 'Existing',
            none: 'No Compression',

            dimensions: 'Dimensions:',
            originalFileSize: 'Original Size:',

            compressionRatio: 'Compression Ratio: {ratio}%',
            alreadyCompressed: 'Already Compressed',
            noCompressionNeeded: 'No Compression Needed',
            unableToGetSuggestions: 'Unable to get compression suggestions'
        }
    },

    'ja': {
        name: '日本語',
        flag: '🇯🇵',
        translations: {
            appTitle: '画像ビューア',

            selectFolder: '画像フォルダを選択してください',
            saveTo: '保存先:',
            selectSaveFolder: '選択',
            quality: '品質:',
            searchPlaceholder: '',

            loadingImages: '画像をスキャン中...',
            startBrowsing: '画像の閲覧を開始',
            startBrowsingDesc: '「フォルダを選択」をクリックして画像コレクションを閲覧',
            imagesCount: '{count}枚の画像',

            originalSize: '元のサイズ:',
            fileSize: 'ファイルサイズ:',
            compressionSuggestion: '圧縮の提案:',
            compressThisImage: 'この画像を圧縮',

            compressing: '画像を圧縮中...',
            compressionComplete: '圧縮完了',
            success: '成功:',
            failed: '失敗:',
            spaceSaved: '節約された容量:',
            openCompressedFolder: '圧縮フォルダを開く',
            close: '閉じる',

            selectFolderError: 'フォルダの選択に失敗しました。再試行してください。',
            loadImagesError: '画像の読み込みに失敗しました。フォルダの権限を確認してください。',
            noImagesFound: '画像が見つかりません',
            noImagesFoundDesc: 'このフォルダには対応する画像形式がありません',

            compressionMethods: {
                sharp: 'Sharp',
                mozjpeg: 'MozJPEG',
                pngquant: 'PNGQuant',
                gifsicle: 'Gifsicle',
                webp: 'WebP'
            },

            selectLanguage: '言語を選択',

            compressionProgress: '圧縮進行状況: {progress}% ({current}/{total})',
            queue: 'キュー',
            allCompressed: 'すべて圧縮完了',
            searchResult: '検索',
            noMatchingImages: '一致する画像が見つかりません',
            noMatchingImagesDesc: '検索キーワードを調整するか、別のフォルダを選択してください',
            noImagesInFolder: 'フォルダに画像がありません',
            errorOccurred: 'エラーが発生しました',

            queueing: 'キューに追加中 (第{position}位)',
            compressingStatus: '圧縮中... ({current}/{max})',
            compressedSize: '圧縮後のサイズ:',
            saved: '{ratio}%節約',
            selectCompressedFolderFirst: '最初に圧縮フォルダを選択してください',
            waitingCompression: '圧縮待ち...',
            imageLoadFailed: '画像の読み込みに失敗しました',

            copy: 'コピー',
            existing: '既存',
            none: '圧縮なし',

            dimensions: 'サイズ:',
            originalFileSize: '元のファイルサイズ:',

            compressionRatio: '圧縮率: {ratio}%',
            alreadyCompressed: '既に圧縮済み',
            noCompressionNeeded: '圧縮不要',
            unableToGetSuggestions: '圧縮提案を取得できません'
        }
    },

    'ko': {
        name: '한국어',
        flag: '🇰🇷',
        translations: {
            appTitle: '이미지 뷰어',

            selectFolder: '이미지 폴더를 선택해주세요',
            saveTo: '저장 위치:',
            selectSaveFolder: '선택',
            quality: '품질:',
            searchPlaceholder: '',

            loadingImages: '이미지 스캔 중...',
            startBrowsing: '이미지 탐색 시작',
            startBrowsingDesc: '"폴더 선택"을 클릭하여 이미지 컬렉션을 탐색하세요',
            imagesCount: '{count}개의 이미지',

            originalSize: '원본 크기:',
            fileSize: '파일 크기:',
            compressionSuggestion: '압축 제안:',
            compressThisImage: '이 이미지 압축',

            compressing: '이미지 압축 중...',
            compressionComplete: '압축 완료',
            success: '성공:',
            failed: '실패:',
            spaceSaved: '절약된 공간:',
            openCompressedFolder: '압축 폴더 열기',
            close: '닫기',

            selectFolderError: '폴더 선택에 실패했습니다. 다시 시도해주세요.',
            loadImagesError: '이미지 로드에 실패했습니다. 폴더 권한을 확인해주세요.',
            noImagesFound: '이미지를 찾을 수 없습니다',
            noImagesFoundDesc: '이 폴더에서 지원되는 이미지 형식을 찾을 수 없습니다',

            compressionMethods: {
                sharp: 'Sharp',
                mozjpeg: 'MozJPEG',
                pngquant: 'PNGQuant',
                gifsicle: 'Gifsicle',
                webp: 'WebP'
            },

            selectLanguage: '언어 선택',

            compressionProgress: '압축 진행률: {progress}% ({current}/{total})',
            queue: '대기열',
            allCompressed: '모든 압축 완료',
            searchResult: '검색',
            noMatchingImages: '일치하는 이미지가 없습니다',
            noMatchingImagesDesc: '검색 키워드를 조정하거나 다른 폴더를 선택하세요',
            noImagesInFolder: '폴더에 이미지가 없습니다',
            errorOccurred: '오류가 발생했습니다',

            queueing: '대기 중 (#{position}번째)',
            compressingStatus: '압축 중... ({current}/{max})',
            compressedSize: '압축된 크기:',
            saved: '{ratio}% 절약',
            selectCompressedFolderFirst: '먼저 압축 폴더를 선택하세요',
            waitingCompression: '압축 대기 중...',
            imageLoadFailed: '이미지 로드 실패',

            copy: '복사',
            existing: '기존',
            none: '압축 없음',

            dimensions: '크기:',
            originalFileSize: '원본 파일 크기:',

            compressionRatio: '압축 비율: {ratio}%',
            alreadyCompressed: '이미 압축됨',
            noCompressionNeeded: '압축 불필요',
            unableToGetSuggestions: '압축 제안을 가져올 수 없습니다'
        }
    },

    'fr': {
        name: 'Français',
        flag: '🇫🇷',
        translations: {
            appTitle: 'Visionneuse d\'Images',

            selectFolder: 'Choisir dossier images‌',
            saveTo: 'Enregistrer dans:',
            selectSaveFolder: 'Sélectionner',
            quality: 'Qualité:',
            searchPlaceholder: '',

            loadingImages: 'Analyse des images...',
            startBrowsing: 'Commencer à parcourir les images',
            startBrowsingDesc: 'Cliquez sur "Sélectionner un dossier" pour parcourir votre collection d\'images',
            imagesCount: '{count} images',

            originalSize: 'Taille originale:',
            fileSize: 'Taille du fichier:',
            compressionSuggestion: 'Suggestion de compression:',
            compressThisImage: 'Compresser cette image',

            compressing: 'Compression des images...',
            compressionComplete: 'Compression terminée',
            success: 'Succès:',
            failed: 'Échec:',
            spaceSaved: 'Espace économisé:',
            openCompressedFolder: 'Ouvrir le dossier compressé',
            close: 'Fermer',

            selectFolderError: 'Échec de la sélection du dossier, veuillez réessayer.',
            loadImagesError: 'Échec du chargement des images, veuillez vérifier les permissions du dossier.',
            noImagesFound: 'Aucune image trouvée',
            noImagesFoundDesc: 'Aucun format d\'image pris en charge trouvé dans ce dossier',

            compressionMethods: {
                sharp: 'Sharp',
                mozjpeg: 'MozJPEG',
                pngquant: 'PNGQuant',
                gifsicle: 'Gifsicle',
                webp: 'WebP'
            },

            selectLanguage: 'Sélectionner la langue',

            compressionProgress: 'Progression de la compression: {progress}% ({current}/{total})',
            queue: 'File d\'attente',
            allCompressed: 'Tout compressé',
            searchResult: 'Recherche',
            noMatchingImages: 'Aucune image correspondante trouvée',
            noMatchingImagesDesc: 'Essayez d\'ajuster les mots-clés de recherche ou sélectionnez un autre dossier',
            noImagesInFolder: 'Aucune image dans le dossier',
            errorOccurred: 'Une erreur s\'est produite',

            queueing: 'En file d\'attente (#{position})',
            compressingStatus: 'Compression... ({current}/{max})',
            compressedSize: 'Taille compressée:',
            saved: '{ratio}% économisé',
            selectCompressedFolderFirst: 'Veuillez d\'abord sélectionner le dossier compressé',
            waitingCompression: 'En attente de compression...',
            imageLoadFailed: 'Échec du chargement de l\'image',

            copy: 'Copier',
            existing: 'Existant',
            none: 'Aucune compression',

            dimensions: 'Dimensions:',
            originalFileSize: 'Taille originale:',

            compressionRatio: 'Taux de compression: {ratio}%',
            alreadyCompressed: 'Déjà compressé',
            noCompressionNeeded: 'Aucune compression nécessaire',
            unableToGetSuggestions: 'Impossible d\'obtenir des suggestions de compression'
        }
    },

    'de': {
        name: 'Deutsch',
        flag: '🇩🇪',
        translations: {
            appTitle: 'Bildbetrachter',

            selectFolder: 'Bildordner wählen',
            saveTo: 'Speichern in:',
            selectSaveFolder: 'Auswählen',
            quality: 'Qualität:',
            searchPlaceholder: '',

            loadingImages: 'Bilder werden gescannt...',
            startBrowsing: 'Bilder durchsuchen beginnen',
            startBrowsingDesc: 'Klicken Sie auf "Ordner auswählen", um Ihre Bildersammlung zu durchsuchen',
            imagesCount: '{count} Bilder',

            originalSize: 'Originalgröße:',
            fileSize: 'Dateigröße:',
            compressionSuggestion: 'Komprimierungsvorschlag:',
            compressThisImage: 'Dieses Bild komprimieren',

            compressing: 'Bilder werden komprimiert...',
            compressionComplete: 'Komprimierung abgeschlossen',
            success: 'Erfolgreich:',
            failed: 'Fehlgeschlagen:',
            spaceSaved: 'Gesparter Speicherplatz:',
            openCompressedFolder: 'Komprimierten Ordner öffnen',
            close: 'Schließen',

            selectFolderError: 'Ordnerauswahl fehlgeschlagen, bitte versuchen Sie es erneut.',
            loadImagesError: 'Laden der Bilder fehlgeschlagen, bitte überprüfen Sie die Ordnerberechtigungen.',
            noImagesFound: 'Keine Bilder gefunden',
            noImagesFoundDesc: 'Keine unterstützten Bildformate in diesem Ordner gefunden',

            compressionMethods: {
                sharp: 'Sharp',
                mozjpeg: 'MozJPEG',
                pngquant: 'PNGQuant',
                gifsicle: 'Gifsicle',
                webp: 'WebP'
            },

            selectLanguage: 'Sprache auswählen',

            compressionProgress: 'Komprimierungsfortschritt: {progress}% ({current}/{total})',
            queue: 'Warteschlange',
            allCompressed: 'Alle komprimiert',
            searchResult: 'Suche',
            noMatchingImages: 'Keine passenden Bilder gefunden',
            noMatchingImagesDesc: 'Versuchen Sie, die Suchbegriffe anzupassen oder einen anderen Ordner auszuwählen',
            noImagesInFolder: 'Keine Bilder im Ordner',
            errorOccurred: 'Ein Fehler ist aufgetreten',

            queueing: 'In Warteschlange (#{position})',
            compressingStatus: 'Komprimierung... ({current}/{max})',
            compressedSize: 'Komprimierte Größe:',
            saved: '{ratio}% gespart',
            selectCompressedFolderFirst: 'Bitte wählen Sie zuerst den komprimierten Ordner',
            waitingCompression: 'Warten auf Komprimierung...',
            imageLoadFailed: 'Bild konnte nicht geladen werden',

            copy: 'Kopieren',
            existing: 'Vorhanden',
            none: 'Keine Komprimierung',

            dimensions: 'Abmessungen:',
            originalFileSize: 'Originalgröße:',

            compressionRatio: 'Komprimierungsrate: {ratio}%',
            alreadyCompressed: 'Bereits komprimiert',
            noCompressionNeeded: 'Keine Komprimierung erforderlich',
            unableToGetSuggestions: 'Komprimierungsvorschläge können nicht abgerufen werden'
        }
    },

    'es': {
        name: 'Español',
        flag: '🇪🇸',
        translations: {
            appTitle: 'Visor de Imágenes',

            selectFolder: 'Seleccione carpeta de imágenes‌',
            saveTo: 'Guardar en:',
            selectSaveFolder: 'Seleccionar',
            quality: 'Calidad:',
            searchPlaceholder: '',

            loadingImages: 'Escaneando imágenes...',
            startBrowsing: 'Comenzar a explorar imágenes',
            startBrowsingDesc: 'Haga clic en "Seleccionar carpeta" para explorar su colección de imágenes',
            imagesCount: '{count} imágenes',

            originalSize: 'Tamaño original:',
            fileSize: 'Tamaño del archivo:',
            compressionSuggestion: 'Sugerencia de compresión:',
            compressThisImage: 'Comprimir esta imagen',

            compressing: 'Comprimiendo imágenes...',
            compressionComplete: 'Compresión completada',
            success: 'Éxito:',
            failed: 'Fallido:',
            spaceSaved: 'Espacio ahorrado:',
            openCompressedFolder: 'Abrir carpeta comprimida',
            close: 'Cerrar',

            selectFolderError: 'Error al seleccionar carpeta, por favor inténtelo de nuevo.',
            loadImagesError: 'Error al cargar imágenes, por favor verifique los permisos de la carpeta.',
            noImagesFound: 'No se encontraron imágenes',
            noImagesFoundDesc: 'No se encontraron formatos de imagen compatibles en esta carpeta',

            compressionMethods: {
                sharp: 'Sharp',
                mozjpeg: 'MozJPEG',
                pngquant: 'PNGQuant',
                gifsicle: 'Gifsicle',
                webp: 'WebP'
            },

            selectLanguage: 'Seleccionar idioma',

            compressionProgress: 'Progreso de compresión: {progress}% ({current}/{total})',
            queue: 'Cola',
            allCompressed: 'Todo comprimido',
            searchResult: 'Búsqueda',
            noMatchingImages: 'No se encontraron imágenes coincidentes',
            noMatchingImagesDesc: 'Intente ajustar las palabras clave de búsqueda o seleccione otra carpeta',
            noImagesInFolder: 'No hay imágenes en la carpeta',
            errorOccurred: 'Ocurrió un error',

            queueing: 'En cola (#{position})',
            compressingStatus: 'Comprimiendo... ({current}/{max})',
            compressedSize: 'Tamaño comprimido:',
            saved: '{ratio}% ahorrado',
            selectCompressedFolderFirst: 'Por favor seleccione primero la carpeta comprimida',
            waitingCompression: 'Esperando compresión...',
            imageLoadFailed: 'Error al cargar imagen',

            copy: 'Copiar',
            existing: 'Existente',
            none: 'Sin compresión',

            dimensions: 'Dimensiones:',
            originalFileSize: 'Tamaño original:',

            compressionRatio: 'Relación de compresión: {ratio}%',
            alreadyCompressed: 'Ya comprimido',
            noCompressionNeeded: 'No se necesita compresión',
            unableToGetSuggestions: 'No se pueden obtener sugerencias de compresión'
        }
    },

    'ru': {
        name: 'Русский',
        flag: '🇷🇺',
        translations: {
            appTitle: 'Просмотрщик изображений',

            selectFolder: 'Выберите папку изображений',
            saveTo: 'Сохранить в:',
            selectSaveFolder: 'Выбрать',
            quality: 'Качество:',
            searchPlaceholder: '',

            loadingImages: 'Сканирование изображений...',
            startBrowsing: 'Начать просмотр изображений',
            startBrowsingDesc: 'Нажмите "Выбрать папку", чтобы просмотреть вашу коллекцию изображений',
            imagesCount: '{count} изображений',

            originalSize: 'Исходный размер:',
            fileSize: 'Размер файла:',
            compressionSuggestion: 'Предложение по сжатию:',
            compressThisImage: 'Сжать это изображение',

            compressing: 'Сжатие изображений...',
            compressionComplete: 'Сжатие завершено',
            success: 'Успешно:',
            failed: 'Неудачно:',
            spaceSaved: 'Сэкономлено места:',
            openCompressedFolder: 'Открыть папку со сжатыми файлами',
            close: 'Закрыть',

            selectFolderError: 'Ошибка выбора папки, пожалуйста, попробуйте снова.',
            loadImagesError: 'Ошибка загрузки изображений, проверьте права доступа к папке.',
            noImagesFound: 'Изображения не найдены',
            noImagesFoundDesc: 'В этой папке не найдены поддерживаемые форматы изображений',

            compressionMethods: {
                sharp: 'Sharp',
                mozjpeg: 'MozJPEG',
                pngquant: 'PNGQuant',
                gifsicle: 'Gifsicle',
                webp: 'WebP'
            },

            selectLanguage: 'Выбрать язык',

            compressionProgress: 'Прогресс сжатия: {progress}% ({current}/{total})',
            queue: 'Очередь',
            allCompressed: 'Все сжато',
            searchResult: 'Поиск',
            noMatchingImages: 'Подходящие изображения не найдены',
            noMatchingImagesDesc: 'Попробуйте изменить ключевые слова поиска или выберите другую папку',
            noImagesInFolder: 'В папке нет изображений',
            errorOccurred: 'Произошла ошибка',

            queueing: 'В очереди (#{position})',
            compressingStatus: 'Сжатие... ({current}/{max})',
            compressedSize: 'Сжатый размер:',
            saved: '{ratio}% сэкономлено',
            selectCompressedFolderFirst: 'Пожалуйста, сначала выберите папку для сжатых файлов',
            waitingCompression: 'Ожидание сжатия...',
            imageLoadFailed: 'Ошибка загрузки изображения',

            copy: 'Копировать',
            existing: 'Существующий',
            none: 'Без сжатия',

            dimensions: 'Размеры:',
            originalFileSize: 'Исходный размер:',

            compressionRatio: 'Степень сжатия: {ratio}%',
            alreadyCompressed: 'Уже сжато',
            noCompressionNeeded: 'Сжатие не требуется',
            unableToGetSuggestions: 'Невозможно получить рекомендации по сжатию'
        }
    },

    'ar': {
        name: 'العربية',
        flag: '🇸🇦',
        dir: 'rtl',
        translations: {
            appTitle: 'عارض الصور',

            selectFolder: 'الرجاء اختيار مجلد الصور',
            saveTo: 'حفظ في:',
            selectSaveFolder: 'اختيار',
            quality: 'الجودة:',
            searchPlaceholder: '',

            loadingImages: 'فحص الصور...',
            startBrowsing: 'بدء تصفح الصور',
            startBrowsingDesc: 'انقر على "اختيار مجلد" لتصفح مجموعة الصور الخاصة بك',
            imagesCount: '{count} صورة',

            originalSize: 'الحجم الأصلي:',
            fileSize: 'حجم الملف:',
            compressionSuggestion: 'اقتراح الضغط:',
            compressThisImage: 'ضغط هذه الصورة',

            compressing: 'ضغط الصور...',
            compressionComplete: 'اكتمل الضغط',
            success: 'نجح:',
            failed: 'فشل:',
            spaceSaved: 'مساحة محفوظة:',
            openCompressedFolder: 'فتح مجلد الصور المضغوطة',
            close: 'إغلاق',

            selectFolderError: 'فشل في اختيار المجلد، الرجاء المحاولة مرة أخرى.',
            loadImagesError: 'فشل في تحميل الصور، الرجاء التحقق من أذونات المجلد.',
            noImagesFound: 'لم يتم العثور على صور',
            noImagesFoundDesc: 'لم يتم العثور على تنسيقات صور مدعومة في هذا المجلد',

            compressionMethods: {
                sharp: 'Sharp',
                mozjpeg: 'MozJPEG',
                pngquant: 'PNGQuant',
                gifsicle: 'Gifsicle',
                webp: 'WebP'
            },

            selectLanguage: 'اختيار اللغة',

            compressionProgress: 'تقدم الضغط: {progress}% ({current}/{total})',
            queue: 'قائمة الانتظار',
            allCompressed: 'تم ضغط الكل',
            searchResult: 'البحث',
            noMatchingImages: 'لم يتم العثور على صور مطابقة',
            noMatchingImagesDesc: 'حاول تعديل كلمات البحث أو اختر مجلداً آخر',
            noImagesInFolder: 'لا توجد صور في المجلد',
            errorOccurred: 'حدث خطأ',

            queueing: 'في الانتظار (#{position})',
            compressingStatus: 'ضغط... ({current}/{max})',
            compressedSize: 'الحجم المضغوط:',
            saved: 'تم توفير {ratio}%',
            selectCompressedFolderFirst: 'الرجاء اختيار مجلد الضغط أولاً',
            waitingCompression: 'في انتظار الضغط...',
            imageLoadFailed: 'فشل تحميل الصورة',

            copy: 'نسخ',
            existing: 'موجود',
            none: 'بدون ضغط',

            dimensions: 'الأبعاد:',
            originalFileSize: 'الحجم الأصلي:',

            compressionRatio: 'نسبة الضغط: {ratio}%',
            alreadyCompressed: 'مضغوط بالفعل',
            noCompressionNeeded: 'لا حاجة للضغط',
            unableToGetSuggestions: 'غير قادر على الحصول على اقتراحات الضغط'
        }
    }
};

// 国际化管理类
class I18n {
    constructor() {
        this.currentLang = this.getStoredLanguage() || this.detectBrowserLanguage();
        this.translations = {};
        this.loadTranslations();
    }

    getStoredLanguage() {
        return localStorage.getItem('imageviewer-language');
    }

    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;

        // 检查是否有完全匹配的语言
        if (languages[browserLang]) {
            return browserLang;
        }

        // 检查语言前缀匹配
        const langPrefix = browserLang.split('-')[0];
        for (const lang in languages) {
            if (lang.startsWith(langPrefix)) {
                return lang;
            }
        }

        // 默认返回中文
        return 'zh-CN';
    }

    loadTranslations() {
        if (languages[this.currentLang]) {
            this.translations = languages[this.currentLang].translations;
        } else {
            this.translations = languages['zh-CN'].translations;
        }
    }

    setLanguage(lang) {
        if (languages[lang]) {
            this.currentLang = lang;
            this.loadTranslations();
            localStorage.setItem('imageviewer-language', lang);
            this.updateUI();
        }
    }

    t(key, params = {}) {
        let translation = this.translations[key] || key;

        // 处理嵌套的键
        if (key.includes('.')) {
            const keys = key.split('.');
            let current = this.translations;
            for (const k of keys) {
                if (current && current[k]) {
                    current = current[k];
                } else {
                    return key;
                }
            }
            translation = current;
        }

        // 替换参数
        for (const param in params) {
            translation = translation.replace(`{${param}}`, params[param]);
        }

        return translation;
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    getLanguageInfo() {
        return languages[this.currentLang] || languages['zh-CN'];
    }

    getAllLanguages() {
        return Object.keys(languages).map(code => ({
            code,
            name: languages[code].name,
            flag: languages[code].flag
        }));
    }

    updateUI() {
        // 更新页面标题
        document.title = this.t('appTitle');

        // 更新HTML lang属性
        const langInfo = this.getLanguageInfo();
        document.documentElement.lang = this.currentLang;

        // 更新文字方向
        if (langInfo.dir === 'rtl') {
            document.documentElement.dir = 'rtl';
            document.body.classList.add('rtl');
        } else {
            document.documentElement.dir = 'ltr';
            document.body.classList.remove('rtl');
        }

        // 触发自定义事件，通知其他组件语言已更改
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLang }
        }));
    }
}

// 导出全局实例
window.i18n = new I18n(); 
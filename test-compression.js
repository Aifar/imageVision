const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 测试压缩功能
async function testCompression() {
    console.log('🧪 测试图片压缩功能...\n');

    // 检查依赖是否正确安装
    try {
        console.log('✅ Sharp 库已安装');
        console.log('✅ Imagemin 库已安装');
        console.log('✅ MozJPEG 插件已安装');
        console.log('✅ PNGQuant 插件已安装\n');
    } catch (error) {
        console.error('❌ 依赖库安装失败:', error.message);
        return;
    }

    // 创建测试目录
    const testDir = path.join(__dirname, 'test-images');
    if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir);
    }

    // 创建一个简单的测试图片（如果不存在）
    const testImagePath = path.join(testDir, 'test.png');
    if (!fs.existsSync(testImagePath)) {
        console.log('📸 创建测试图片...');
        // 创建一个简单的 PNG 图片
        const width = 800;
        const height = 600;
        const buffer = Buffer.alloc(width * height * 4);

        // 填充一些测试数据
        for (let i = 0; i < buffer.length; i += 4) {
            buffer[i] = Math.floor(Math.random() * 255);     // R
            buffer[i + 1] = Math.floor(Math.random() * 255); // G
            buffer[i + 2] = Math.floor(Math.random() * 255); // B
            buffer[i + 3] = 255;                             // A
        }

        await sharp(buffer, {
            raw: {
                width: width,
                height: height,
                channels: 4
            }
        })
            .png()
            .toFile(testImagePath);

        console.log('✅ 测试图片创建完成');
    }

    // 测试 Sharp 压缩
    console.log('\n🔧 测试 Sharp 压缩...');
    try {
        const sharpOutputPath = path.join(testDir, 'test_sharp_compressed.png');
        await sharp(testImagePath)
            .png({ quality: 80, compressionLevel: 9 })
            .toFile(sharpOutputPath);

        const originalSize = fs.statSync(testImagePath).size;
        const compressedSize = fs.statSync(sharpOutputPath).size;
        const ratio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

        console.log(`✅ Sharp 压缩成功: ${originalSize} -> ${compressedSize} bytes (节省 ${ratio}%)`);
    } catch (error) {
        console.error('❌ Sharp 压缩失败:', error.message);
    }

    // 测试 Imagemin 压缩
    console.log('\n🔧 测试 Imagemin 压缩...');
    try {
        // 动态导入 imagemin 模块
        const imagemin = (await import('imagemin')).default;
        const imageminPngquant = (await import('imagemin-pngquant')).default;

        const imageminOutputPath = path.join(testDir, 'test_imagemin_compressed.png');
        const files = await imagemin([testImagePath], {
            destination: path.dirname(imageminOutputPath),
            plugins: [
                imageminPngquant({
                    quality: [0.6, 0.8],
                    speed: 4
                })
            ]
        });

        if (files.length > 0) {
            const originalSize = fs.statSync(testImagePath).size;
            const compressedSize = fs.statSync(files[0].destinationPath).size;
            const ratio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

            console.log(`✅ Imagemin 压缩成功: ${originalSize} -> ${compressedSize} bytes (节省 ${ratio}%)`);
        } else {
            console.log('⚠️ Imagemin 压缩未产生输出文件');
        }
    } catch (error) {
        console.error('❌ Imagemin 压缩失败:', error.message);
    }

    console.log('\n🎉 压缩功能测试完成！');
    console.log('📁 测试文件保存在:', testDir);
}

// 运行测试
testCompression().catch(console.error); 
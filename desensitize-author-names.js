const fs = require('fs');
const path = require('path');

// 游戏目录路径
const gamesDir = './games/';

// 姓名脱敏函数
function desensitizeName(name) {
    if (name && name.length > 1 && name !== '未知') {
        return '*' + name.substring(1);
    }
    return name;
}

// 读取游戏目录
fs.readdir(gamesDir, (err, files) => {
    if (err) {
        console.error('读取游戏目录失败:', err);
        return;
    }

    // 过滤HTML文件
    const htmlFiles = files.filter(file => path.extname(file) === '.html');
    
    console.log(`找到 ${htmlFiles.length} 个游戏文件，开始进行姓名脱敏处理...`);

    let processedCount = 0;
    let modifiedCount = 0;

    htmlFiles.forEach(file => {
        const filePath = path.join(gamesDir, file);
        
        // 读取文件内容
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`读取文件 ${file} 失败:`, err);
                processedCount++;
                return;
            }

            // 查找Author Signature Widget V2脚本
            const authorWidgetRegex = /var authorNameStr = '([^']+)';/g;
            let hasModification = false;
            
            // 替换作者姓名
            const newContent = data.replace(authorWidgetRegex, (match, authorName) => {
                const desensitizedName = desensitizeName(authorName);
                if (desensitizedName !== authorName) {
                    hasModification = true;
                    console.log(`  ${file}: "${authorName}" -> "${desensitizedName}"`);
                }
                return `var authorNameStr = '${desensitizedName}';`;
            });

            processedCount++;

            if (hasModification) {
                modifiedCount++;
                // 写入文件
                fs.writeFile(filePath, newContent, 'utf8', (err) => {
                    if (err) {
                        console.error(`写入文件 ${file} 失败:`, err);
                    } else {
                        console.log(`✅ ${file} 姓名脱敏完成`);
                    }
                    
                    // 检查是否所有文件都处理完成
                    if (processedCount === htmlFiles.length) {
                        console.log(`\n处理完成！`);
                        console.log(`总文件数: ${htmlFiles.length}`);
                        console.log(`修改文件数: ${modifiedCount}`);
                        console.log(`跳过文件数: ${htmlFiles.length - modifiedCount}`);
                    }
                });
            } else {
                console.log(`⏭️  ${file} 无需修改`);
                
                // 检查是否所有文件都处理完成
                if (processedCount === htmlFiles.length) {
                    console.log(`\n处理完成！`);
                    console.log(`总文件数: ${htmlFiles.length}`);
                    console.log(`修改文件数: ${modifiedCount}`);
                    console.log(`跳过文件数: ${htmlFiles.length - modifiedCount}`);
                }
            }
        });
    });
});
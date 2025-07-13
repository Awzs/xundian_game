const fs = require('fs');
const path = require('path');

// 游戏目录路径
const gamesDir = './games/';

// 返回主页按钮的HTML代码
const homeButtonHTML = `
<!-- 返回主页按钮 -->
<div id="homeNavigation" style="position: fixed; top: 20px; left: 20px; z-index: 9999;">
    <a href="../index.html" 
       style="display: inline-flex; align-items: center; gap: 8px; 
              background: linear-gradient(135deg, #FF6B6B, #4ECDC4); 
              color: white; padding: 12px 20px; border-radius: 25px; 
              text-decoration: none; font-family: 'Microsoft YaHei', sans-serif; 
              font-weight: bold; font-size: 14px; 
              box-shadow: 0 4px 15px rgba(0,0,0,0.2); 
              transition: all 0.3s ease;
              backdrop-filter: blur(10px);"
       onmouseover="this.style.transform='translateY(-2px) scale(1.05)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.3)';"
       onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.2)';">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
        返回星球工坊
    </a>
</div>
`;

// 读取游戏目录
fs.readdir(gamesDir, (err, files) => {
    if (err) {
        console.error('读取游戏目录失败:', err);
        return;
    }

    // 过滤HTML文件
    const htmlFiles = files.filter(file => path.extname(file) === '.html');
    
    console.log(`找到 ${htmlFiles.length} 个游戏文件，开始添加导航按钮...`);

    htmlFiles.forEach(file => {
        const filePath = path.join(gamesDir, file);
        
        // 读取文件内容
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`读取文件 ${file} 失败:`, err);
                return;
            }

            // 检查是否已经有返回按钮
            if (data.includes('homeNavigation') || data.includes('返回星球工坊')) {
                console.log(`${file} 已经有导航按钮，跳过...`);
                return;
            }

            // 在body标签后添加返回按钮
            const bodyIndex = data.indexOf('<body');
            if (bodyIndex === -1) {
                console.error(`${file} 中未找到body标签`);
                return;
            }

            // 找到body标签的结束位置
            const bodyEndIndex = data.indexOf('>', bodyIndex) + 1;
            
            // 插入返回按钮
            const newContent = data.slice(0, bodyEndIndex) + 
                             homeButtonHTML + 
                             data.slice(bodyEndIndex);

            // 写入文件
            fs.writeFile(filePath, newContent, 'utf8', (err) => {
                if (err) {
                    console.error(`写入文件 ${file} 失败:`, err);
                } else {
                    console.log(`✅ ${file} 导航按钮添加成功`);
                }
            });
        });
    });
});
# Love App

一个用React开发的恋爱记录和情感管理手机应用。通过记录日常付出、培育情感树、管理共同回忆和纪念日等功能，帮助情侣们更好地维护和经营感情。

## 功能特点

- **记录付出**：每天记录为对方做的小事，表达爱意
- **情感树**：根据记录次数自动成长，分为种子、发芽、长叶、开花、结果五个阶段
- **果实兑换**：用积累的果实兑换各种有趣的爱情奖励
- **共同回忆**：记录和分享生活中的美好瞬间
- **纪念日管理**：设置并提醒重要的纪念日
- **恋爱小贴士**：提供实用的恋爱建议和技巧

## 技术栈

- **前端**：React、React Router、Vite
- **样式**：CSS3
- **存储**：LocalStorage（浏览器本地存储）
- **移动平台**：Capacitor（支持Android平台）

## 项目文件框架

### 核心文件结构

| 文件/目录 | 功能作用 |
|----------|---------|
| `index.html` | HTML入口文件，包含应用的基本结构 |
| `package.json` | 项目配置文件，定义依赖和脚本命令 |
| `vite.config.js` | Vite构建工具配置文件 |
| `.gitignore` | Git版本控制忽略文件配置 |
| `README.md` | 项目说明文档 |
| `capacitor.config.json` | Capacitor配置文件，用于移动平台构建 |

### 源代码目录 (`src/`)

| 文件/目录 | 功能作用 |
|----------|---------|
| `src/main.jsx` | React应用入口文件 |
| `src/App.jsx` | 应用主组件，包含路由和状态管理 |
| `src/index.css` | 全局样式文件 |
| `src/App.css` | 应用主样式文件 |
| `src/pages/` | 页面组件目录 |
| &nbsp;&nbsp;`src/pages/Home.jsx` | 首页组件，显示情感树和功能导航 |
| &nbsp;&nbsp;`src/pages/Record.jsx` | 记录付出页面组件 |
| &nbsp;&nbsp;`src/pages/Tree.jsx` | 情感树详情页面组件 |
| &nbsp;&nbsp;`src/pages/Rewards.jsx` | 果实兑换页面组件 |
| &nbsp;&nbsp;`src/pages/Memories.jsx` | 共同回忆页面组件 |
| &nbsp;&nbsp;`src/pages/Anniversaries.jsx` | 纪念日页面组件 |
| &nbsp;&nbsp;`src/pages/Tips.jsx` | 恋爱小贴士页面组件 |

### 静态资源目录 (`public/`)

| 文件/目录 | 功能作用 |
|----------|---------|
| `public/images/` | 存放应用所需的图片资源 |
| &nbsp;&nbsp;`public/images/tree_seed.svg` | 情感树种子阶段图片 |
| &nbsp;&nbsp;`public/images/tree_sprout.svg` | 情感树发芽阶段图片 |
| &nbsp;&nbsp;`public/images/tree_leaf.svg` | 情感树长叶阶段图片 |
| &nbsp;&nbsp;`public/images/tree_flower.svg` | 情感树开花阶段图片 |
| &nbsp;&nbsp;`public/images/tree_fruit.svg` | 情感树结果阶段图片 |

### 构建输出目录 (`dist/`)

构建后的生产版本文件将生成在此目录中，用于部署或移动平台打包。

### Android平台目录 (`android/`)

Capacitor生成的Android项目目录，用于构建Android应用。

## 开发和运行

### 前提条件

- 安装Node.js (推荐14.x或更高版本)
- 安装npm或yarn

### 安装依赖

```bash
npm install
# 或
 yarn install
```

### 开发模式

```bash
npm run dev
# 或
 yarn dev
```

然后在浏览器中访问 `http://localhost:3000`

### 构建生产版本

```bash
npm run build
# 或
 yarn build
```

构建后的文件将在 `dist` 目录中

## 注意事项

- 本应用使用LocalStorage存储数据，数据仅保存在用户的浏览器中
- 推荐在现代浏览器中运行（Chrome、Firefox、Safari、Edge）
- 如需在手机上查看，可使用浏览器的开发者工具切换到移动设备视图

## License

MIT
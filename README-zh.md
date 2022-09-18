# Periotris.js

[English](README.md) | **中文**

**在游戏中牢牢掌握化学元素周期表！**

![Periotris.js v2.0.1 PWA 屏幕截图](https://user-images.githubusercontent.com/32665105/152916976-93b9617a-7f82-489c-9ede-92f16a2c45e9.png)
_Periotris.js v2.0.1_

[![Gatsby](https://github.com/CSharperMantle/periotrisjs/actions/workflows/gatsby.yml/badge.svg?branch=develop)](https://github.com/CSharperMantle/periotrisjs/actions/workflows/gatsby.yml)

## 快速上手

### 游戏网址

Periotris.js 在 GitHub Pages 和 Vercel 上都可以访问。

- GitHub Pages: https://csharpermantle.github.io/periotrisjs
- Vercel: https://periotrisjs.vercel.app/
- Vercel (开发分支预览): https://periotrisjs-git-develop-csharpermantle.vercel.app/

本游戏是[渐进式 Web 应用](https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps)，提供与原生应用一样的体验。请查看所使用浏览器的说明文档以获取更多信息。

### 操作

键盘：

- `W`: 旋转
- `A`: 左移
- `D`: 右移
- `S`: 下移
- `Space`: 立即下落

触摸：

- `短按`: 旋转
- `左划`: 左移
- `右划`: 右移
- `下划`: 下移
- `长按`: 立即下落

### 自定义

Periotris.js 支持多种自定义方式，如：

- 自定义颜色主题
- 自定义游戏地图
- 调整游戏进行速度
- 调整游戏难度
- 自定义元素周期表显示内容

大部分自定义选项可以在游戏内“设置”页面调整。所有用户设置都存储于本地，**不会**被上传至任何服务器。

大多数选项都支持实时保存和实时验证。对设置做出的修改将在游戏中即时生效。

如果收到“格式错误”的提示，请检查提交的配置文件是否符合格式要求。

#### 自定义游戏地图

游戏地图定义了游戏中玩家将要拼贴的元素周期表形状。Periotris.js 使用[JSON 格式](https://developer.mozilla.org/zh-CN/docs/Glossary/JSON)保存游戏地图，其格式如下：

1. 游戏地图文件是一个 JSON 文件，以一个对象作为根元素。
2. 游戏地图对象应当包含以下属性：
   - `map`：一个二维数组，以行优先形式存储地图的所有方格，包括可以填充的和无法填充的。每个元素为包含以下属性的对象：
     - `atomicNumber`：一个整数，表示该方格所代表的元素。
     - `filledBy`：一个整数，表示该方格是否被填充，`7`代表可被填充，`8`代表不可被填充。
   - `totalAvailableBlocksCount`：一个整数，表示地图中可以填充的方格数量(即所有`filledBy`属性为`7`的方格数量)。
   - `playAreaSize`：具有两个属性的对象，描述地图的全部可见区域的尺寸：
     - `width`：一个整数，宽度。
     - `height`：一个整数，高度。

请参考[DefaultMap.json](src/json/DefaultMap.json)以获得默认的游戏地图作为样例。

请查阅[Map.json.schema](src/json/schema/Map.json.schema)以获得形式化的、用于游戏内格式检查的游戏地图文件规范，该文件以[JSON Schema](https://json-schema.org/)格式编写。

#### 自定义颜色主题

颜色主题是用于渲染每个方格背景颜色的一系列规则，同样使用 JSON 格式，规格如下：

1. 颜色主题文件是一个 JSON 文件，以一个对象作为根元素。
2. 颜色主题对象应包含以下属性：
   - `rules`：一个一维数组。每个元素表示一条颜色渲染规则。每个元素为一个对象，包含以下属性：
     - `atomicNumberRange`：一个对象，表示该规则所适用的元素范围，从`from`到`to`，且包含两个端点。
     - `color`：字符串，表示该规则渲染的颜色。应为一个合法的 CSS 颜色。

参阅[DefaultColorScheme.json](src/json/DefaultColorScheme.json)以获得样例。

查阅[ColorScheme.json.schema](src/json/schema/ColorScheme.json.schema)以获得形式化规范文件。

## 开发环境搭建

### 克隆仓库

```sh
git clone --depth 1 -- https://github.com/CSharperMantle/periotrisjs.git
cd periotrisjs
```

### 安装依赖

需要手动安装的依赖：

- [Node.js v14.x+](https://nodejs.org/)
- [yarn berry+](https://yarnpkg.com/)

之后，运行：

```sh
yarn install --immutable
```

### 本地构建

构建 Release 版：

```sh
yarn run build && yarn run serve
```

运行调试服务器：

```sh
yarn run develop
```

之后按照终端内的指示操作。

### 单元测试

```sh
yarn run test
```

上述命令运行所有测试用例，正常情况下这些应该均能通过。

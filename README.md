# Career Compass AI

一个基于 AI 的简历分析工具，用户可以上传简历（PDF/DOCX）和岗位描述，工具会分析简历与岗位描述的匹配度，给出匹配分数和优化建议。

## 技术栈

- **框架**: Next.js (App Router)
- **语言**: TypeScript
- **UI**: React 19 + Tailwind CSS 4
- **AI**: LangChain + 多种 LLM 支持
- **桌面应用**: Electron
- **包管理**: pnpm

## 支持的模型

- 阿里云千问 (Qwen)
- 火山豆包 (Doubao)
- OpenAI
- DeepSeek

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

**Web 开发**:

```bash
pnpm dev:web
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

**Electron 开发**:

```bash
pnpm dev:electron
```

### 构建

**Web 构建**:

```bash
pnpm build:web
```

**Electron 构建**:

```bash
pnpm build:electron
```

### 打包桌面应用

```bash
pnpm package
```

### 代码检查

```bash
pnpm lint
```

```bash
pnpm format
```

## 项目结构

```
career-compass-ai/
├── app/                    # Next.js 应用代码
│   ├── api/                # API 路由
│   │   ├── analyze/        # AI 分析接口
│   │   └── upload/         # 文件上传接口
│   ├── components/         # React 组件
│   ├── lib/                # 工具库
│   ├── services/           # 业务逻辑层
│   └── types/              # TypeScript 类型定义
├── electron/               # Electron 主进程代码
│   ├── main.ts             # 主进程入口
│   ├── preload.ts          # 预加载脚本
│   └── dist/               # 构建输出
├── export/                 # Next.js 导出目录（Electron 使用）
├── next.config.ts          # Next.js 配置
├── webpack.electron.config.js  # Electron Webpack 配置
└── package.json            # 项目依赖配置
```

## 环境配置

在项目根目录创建 `.env` 文件，配置 API Key：

```env
# 阿里云千问 API Key
DASHSCOPE_API_KEY=your-api-key

# 火山豆包 API Key
DOUBAO_API_KEY=your-api-key

# OpenAI API Key
OPENAI_API_KEY=your-api-key

# DeepSeek API Key
DEEPSEEK_API_KEY=your-api-key
```

## 使用说明

1. 在模型配置面板中选择您使用的 LLM 服务
2. 输入对应的 API Key
3. 上传简历文件（PDF 或 DOCX 格式）
4. 输入岗位描述（JD）
5. 点击分析按钮，获取匹配度报告和优化建议

## License

MIT
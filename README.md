# YouTube Summarizer

一个基于React的YouTube视频摘要生成工具。

## 项目结构

- `frontend/`: React前端应用
- `supabase/functions/`: Serverless函数

## 开发环境设置

### 前提条件

- Node.js和npm

### 安装依赖

```bash
# 安装前端依赖
npm install
```

## 开发

```bash
# 启动前端开发服务器
npm run dev
```

## 部署

```bash
# 构建前端
npm run build
```

## API使用

调用YouTube摘要API:

```typescript
const response = await fetch('https://yourdomain.functions.supabase.co/youtube-summary', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ url: 'https://www.youtube.com/watch?v=...' }),
});

const data = await response.json();
console.log(data.summary);
``` 
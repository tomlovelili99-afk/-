# 熊鹏程个人作品集官网

React + Vite 实现的个人作品集与简历官网基础版，包含全屏 Hero、个人简介、工作经历、精选项目、个人优势和整屏联系方式收尾页。

## 本地运行

```bash
pnpm install
pnpm run dev
```

如使用 npm：

```bash
npm install
npm run dev
```

默认预览地址为 `http://127.0.0.1:5173`。如需让同一局域网的其他设备访问，可使用：

```bash
pnpm run dev:host
```

## 发布前检查

```bash
pnpm run render:pdf-pages
pnpm run check:assets
pnpm run build
```

如在非交互式终端或 CI 中遇到 pnpm 清理依赖目录提示，可使用：

```bash
CI=true pnpm run render:pdf-pages
CI=true pnpm run check:assets
CI=true pnpm run build
```

发布静态目录为 `dist/`。项目已包含 `_redirects` 和 `_headers`，用于单页应用回退、静态资源缓存与基础安全响应头。

## PDF 作品预览

源 PDF 放在 `source-pdfs/`，不要放进 `public/assets/`。替换 PDF 后执行：

```bash
python3 scripts/normalize-pdfs.py
pnpm run render:pdf-pages
```

页面会发布 `public/assets/pdf-pages/` 中的 WebP 预览页，不直接发布 PDF 文件本体，从而避开浏览器自带下载、保存、打印工具栏。

## 内容替换

- 参考图资源：`public/assets/reference-style.jpg`
- 页面内容：`src/main.jsx`
- 视觉样式：`src/styles.css`

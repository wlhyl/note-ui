# 项目说明

这是一个基于 Angular 开发的博客前端。：

# 此项目的 API 后端

https://github.com/wlhyl/note.git

# 开始使用

## 运行 API

根据 API 后端的 README.md 运行 API

## 安装依赖

```bash
npm install
```

## 启动项目

```bash
ng serve
```

# Docker 镜像构建

## 单页应用镜像构建

```bash
docker build -t note/ui:spa -f Dockerfile.spa .
```

## 服务器端渲染镜像构建

```bash
docker build -t note/ui:ssr -f Dockerfile.ssr .
```

# 许可证

项目使用 AGPL-3.0 许可证 ([LICENSE](LICENSE))。

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.5.0] - 2026-10-19

### Added

- 文章保存历史功能：编辑页（已有文章）工具栏新增"历史"按钮，弹出 NgbModal 查看历史列表（保存时间、标题、摘要、标签、私有状态）、历史详情（含正文预览），并支持回滚到指定历史版本（二次确认后调用后端回滚接口，用返回的文章刷新编辑器）
- 新增 `ArticleHistoryPreview` / `ArticleHistoryDetail` 类型，以及历史列表、历史详情、回滚三个接口方法（`ArticleApiService`）

### Fixed

- 修复 markdown 表格在编辑页预览、文章历史预览等位置显示不正常的问题（样式从文章详情页组件迁移到全局，见 Changed）

### Changed

- markdown 表格样式（边框、表头、斑马纹、悬停、单元格换行、横向滚动）从 `article.component.scss` 迁移到全局 `src/styles.scss`，所有渲染 `<markdown>` 的位置共用同一套样式

## [0.4.1] - 2026-10-18

### Fixed

- 修复手机浏览器上编辑页保存按钮及底部内容不可见的问题（移除 `.user-layout` 的 `height: 100vh`，避免移动端地址栏/工具栏遮挡，高度改由 `position: fixed` 的 inset 决定）
- 修复小屏幕下管理后台内容区域底部被裁剪、无法滚动到最后一部分内容的问题（`.main-area` 改用 `min-height: 0` 配合 flex 布局）
- 修复小屏幕下编辑器与预览区横向溢出到页面外的问题（flex 容器启用 `flex-wrap: wrap`，预览区正常换行堆叠）

### Changed

- 页面语言声明改为中文（`index.html` 的 `<html lang>` 改为 `zh-CN`）

## [0.4.0] - 2026-10-18

### Added

- 启用 KaTeX 数学公式渲染：文章详情页与编辑页预览区支持 `$...$` 行内公式和 `$$...$$` 块级公式
- 新增依赖 `marked-katex-extension` 与 `katex`（显式声明，避免仅作为自动 peer 在重装时丢失）

### Changed

- `angular.json` 构建样式引入 `katex.min.css`
- `provideMarkdown` 配置 KaTeX 选项：`throwOnError: false`（公式语法错误降级为红色提示），`output: 'html'`（规避 Angular 消毒器对 MathML 标签的过滤）

## [0.3.4] - 2026-10-18

### Fixed

- 修复文章分页组件 NG0955 重复 track key 问题（占位数组改用 track $index）
- 修复 total 变更时页码范围计算的 off-by-one 问题（多渲染一个页码）

### Changed

- 升级到 marked 18.1.1
- 升级到 ngx-markdown 22.1.1

## [0.3.3] - 2026-08-08

### Fixed

- 修复浏览器后退时分页组件无法恢复页码的问题，将页码同步到 URL 查询参数（?page=N）

## [0.3.2] - 2026-07-06

### Fixed

- 修复 ngx-markdown 动态渲染内容样式不生效的问题（使用 ::ng-deep 穿透视图封装）
- 修复 Markdown 表格无样式的问题，添加边框、表头背景、斑马纹和悬停高亮
- 修复响应式布局下 Markdown 内标题和代码字号不生效的问题
- 修复 Markdown 表格中文短内容被挤压换行的问题（使用 word-break: keep-all）

### Changed

- 升级到 Angular 22
- 升级到 ng-bootstrap 21.0.0
- 升级到 marked 18.0.5
- 升级到 ngx-cookie-service-ssr 22.0.0
- 升级到 ngx-markdown 22.0.0
- 升级 Docker 基础镜像 node 到 24.18.0
- 升级 Docker 基础镜像 nginx 到 1.31-alpine-slim

## [0.3.1] - 2026-04-21

### Added

- 分类文章排序支持直接输入目标位置快速跳转

## [0.3.0] - 2026-04-20

### Added

- 新增分类文章排序功能

## [0.2.1] - 2026-03-05

### Fixed

- 修复管理后台页面滚动问题，现在只有右侧内容区域可以滚动

## [0.2.0] - 2026-03-04

### Fixed

- 修复文章分页点击页码跳转错误的问题
- 美化分页、增加响应式设计
- 升级到Angular 21

## [0.1.1] - 2025-12-05

### Changed

- 更新 code-editor 配置，启用 lineWrapping 选项

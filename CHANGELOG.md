# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

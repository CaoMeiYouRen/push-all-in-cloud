# push-all-in-cloud

## [2.5.1](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v2.5.0...v2.5.1) (2026-06-19)


### 🐛 Bug 修复

* **workflows:** 添加类型检查步骤 ([9908111](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/9908111)), closes [#360](https://github.com/CaoMeiYouRen/push-all-in-cloud/issues/360)

# [2.5.0](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v2.4.0...v2.5.0) (2025-03-04)


### ♻ 代码重构

* **layout:** 重构页面布局并添加样式 ([edec8b2](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/edec8b2))


### ✨ 新功能

* **public:** 优化配置页面功能和用户体验 ([687872d](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/687872d))
* **public:** 添加配置导出和导入功能 ([bca67ed](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/bca67ed))
* **push:** 添加 WxPusher 推送支持并更新相关文档 ([1e29e87](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/1e29e87))

# [2.4.0](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v2.3.0...v2.4.0) (2025-02-11)


### ✨ 新功能

* 更新 push-all-in-one 依赖至 4.3.0，添加 Ntfy 推送支持 ([6dd3938](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/6dd3938))

# [2.3.0](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v2.2.0...v2.3.0) (2025-02-10)


### ✨ 新功能

* 添加飞书推送支持，更新依赖版本 ([5012ab5](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/5012ab5))

# [2.2.0](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v2.1.5...v2.2.0) (2024-11-20)


### ✨ 新功能

* **env:** 添加新的推送配置项；支持 PushDeer 推送端点配置 ([39ca07d](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/39ca07d))

## [2.1.5](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v2.1.4...v2.1.5) (2024-11-20)


### 🐛 Bug 修复

* **app:** 修复请求体解析问题 ([c1e7c5f](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/c1e7c5f))

## [2.1.4](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v2.1.3...v2.1.4) (2024-11-19)


### 🐛 Bug 修复

* 修复 `await c.req.json()` 无法获取数据的问题，新增 `getBodyByReq` 函数处理请求体解析 ([5c70e47](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/5c70e47))

## [2.1.3](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v2.1.2...v2.1.3) (2024-11-19)


### ⏪ 回退

* 暂时移除 secureHeaders ([ab7e58b](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/ab7e58b))


### 🐛 Bug 修复

* 调整超时时间配置；优化路由处理逻辑 ([9675e1a](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/9675e1a))

## [2.1.2](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v2.1.1...v2.1.2) (2024-11-19)


### 🐛 Bug 修复

* 在表单字段中添加提示信息，使用字段的描述作为提示内容 ([17647fa](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/17647fa))

## [2.1.1](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v2.1.0...v2.1.1) (2024-11-19)


### ♻ 代码重构

* 优化代码结构和命名 ([4b4058b](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/4b4058b))


### 🐛 Bug 修复

* 更新 Vue CDN 链接并优化配置选项获取 ([38b585f](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/38b585f))

# [2.1.0](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v2.0.0...v2.1.0) (2024-11-19)


### ✨ 新功能

* 新增 push-all-in-one 配置生成器 ([1c0f8c8](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/1c0f8c8))


### 🐛 Bug 修复

* 优化 配置页功能；修复 空字符串的附加参数会覆盖默认参数的问题 ([8ad320b](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/8ad320b))
* 修复 AUTH_PUSH_KEY 和 AUTH_FORWARD_KEY 为空时无法推送的问题；增加推送测试按钮 ([632577c](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/632577c))
* 修复 postForward 未设置 AUTH_FORWARD_KEY 的问题 ([47e0cd1](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/47e0cd1))
* 升级 push-all-in-one 到 4.1.0-beta.1 ([e1ee360](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/e1ee360))

# [2.1.0-beta.3](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v2.1.0-beta.2...v2.1.0-beta.3) (2024-11-19)


### 🐛 Bug 修复

* 修复 postForward 未设置 AUTH_FORWARD_KEY 的问题 ([47e0cd1](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/47e0cd1))

# [2.1.0-beta.2](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v2.1.0-beta.1...v2.1.0-beta.2) (2024-11-18)


### 🐛 Bug 修复

* 优化 配置页功能；修复 空字符串的附加参数会覆盖默认参数的问题 ([8ad320b](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/8ad320b))
* 修复 AUTH_PUSH_KEY 和 AUTH_FORWARD_KEY 为空时无法推送的问题；增加推送测试按钮 ([632577c](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/632577c))

# [2.1.0-beta.1](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v2.0.1-beta.1...v2.1.0-beta.1) (2024-11-18)


### ✨ 新功能

* 新增 push-all-in-one 配置生成器 ([1c0f8c8](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/1c0f8c8))

## [2.0.1-beta.1](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v2.0.0...v2.0.1-beta.1) (2024-11-17)


### 🐛 Bug 修复

* 升级 push-all-in-one 到 4.1.0-beta.1 ([e1ee360](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/e1ee360))

# [2.0.0](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v1.3.1...v2.0.0) (2024-11-16)


### ✨ 新功能

* 修改 批量推送和转发推送的逻辑；修改环境变量配置 ([f8ae375](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/f8ae375))


### 💥 BREAKING CHANGES

* 升级 push-all-in-one 到 v4 版本

# [2.0.0-beta.2](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2024-11-16)


### 🐛 Bug 修复

* 修复 outputDirectory 路径错误的问题 ([9ce17dc](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/9ce17dc))

# [2.0.0-beta.1](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v1.3.0...v2.0.0-beta.1) (2024-11-09)


### ✨ 新功能

* 修改 批量推送和转发推送的逻辑；修改环境变量配置 ([f8ae375](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/f8ae375))


### 💥 BREAKING CHANGES

* 升级 push-all-in-one 到 v4 版本
## [1.3.1](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v1.3.0...v1.3.1) (2024-11-16)


### 🐛 Bug 修复

* 修复 outputDirectory 路径错误的问题 ([9ce17dc](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/9ce17dc))

# [1.3.0](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v1.2.4...v1.3.0) (2024-10-06)


### ✨ 新功能

* 增加 Server 酱³ 支持；添加接口调用例子 ([24bc4d6](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/24bc4d6)), closes [#3](https://github.com/CaoMeiYouRen/push-all-in-cloud/issues/3)

## [1.2.4](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v1.2.3...v1.2.4) (2024-10-04)


### 🐛 Bug 修复

* 优化 环境变量的读取 ([3052320](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/3052320))

## [1.2.3](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v1.2.2...v1.2.3) (2024-10-04)


### 🐛 Bug 修复

* 修复 vercel post 请求解析错误的问题 ([33e2334](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/33e2334))

## [1.2.2](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v1.2.1...v1.2.2) (2024-08-26)


### 🐛 Bug 修复

* 修复 日志输出环境变量错误 ([77b991f](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/77b991f))

## [1.2.1](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v1.2.0...v1.2.1) (2024-07-05)


### 🐛 Bug 修复

* 修复 release 无法推送到 GitHub package 的 bug ([2d8f488](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/2d8f488))

# [1.2.0](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v1.1.0...v1.2.0) (2024-07-05)


### ✨ 新功能

* 更改 转发推送时，部分配置的名称；更新说明文档 ([c0a5267](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/c0a5267))

# [1.1.0](https://github.com/CaoMeiYouRen/push-all-in-cloud/compare/v1.0.0...v1.1.0) (2024-07-03)


### ✨ 新功能

* 新增 权限验证；增加全局错误捕获 ([b769bcd](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/b769bcd))


### 🐛 Bug 修复

* 启用 cors/secureHeaders 中间件以增强安全性 ([0f829e6](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/0f829e6))

# 1.0.0 (2024-07-03)


### ✨ 新功能

* 初步完成逻辑开发 ([27bd806](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/27bd806))
* 添加 tsup 构建；修复 vercel 构建支持 ([f28867c](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/f28867c))


### 🐛 Bug 修复

* 修复部分文档错误；添加 vercel 支持 ([0cde614](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/0cde614))
* 更新文档；优化 转发推送 ([576f5ab](https://github.com/CaoMeiYouRen/push-all-in-cloud/commit/576f5ab))

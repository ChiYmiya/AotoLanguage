# 自动翻译工具 MVP 设计

## 1. 目标

只维护中文源文件。
当中文文档发生变化时，GitHub Actions 自动调用翻译脚本，
生成对应语言文件并提交到仓库。

## 2. 当前范围

- 支持 Markdown 文件
- 中文翻译为日语
- 暂时处理一个固定文件
- 使用 Gemini API
- GitHub Actions 自动执行
- 不提供前端、后台和数据库

## 3. 处理流程

1. 修改 `docs/zh/README.md`
2. GitHub Actions 被触发
3. 安装 Node.js 和项目依赖
4. 执行 `scripts/translate.ts`
5. 读取源文件
6. 调用翻译 API
7. 写入 `docs/ja/README.md`
8. 提交并推送生成结果

## 4. 职责划分

### GitHub Actions

- 决定何时执行
- 准备 Node.js 环境
- 安装依赖
- 注入 Secret 和路径配置
- 执行脚本
- 提交生成文件

### translate.ts

- 接收输入、输出路径
- 读取源文件
- 调用翻译 API
- 写入翻译结果
- 返回明确的成功或失败状态

## 5. 当前配置

| 配置 | 默认值 | 来源 |
|---|---|---|
| 输入路径 | `docs/zh/README.md` | 暂时写死 |
| 输出路径 | `docs/ja/README.md` | 暂时写死 |
| API Key | Gemini | GitHub Secrets |
| 目标语言 | 日语 | 暂时写死 |

## 6. 暂不实现

- 后台管理页面
- 数据库
- 用户登录
- 在线文件选择
- 多翻译服务商
- 复杂缓存
- 多仓库支持

## 7. 后续扩展顺序

1. 跑通单文件翻译
2. 使用配置文件管理多个文件
3. 根据 Git diff 只翻译变化文件
4. 增加缓存和失败重试
5. 再评估是否需要后台

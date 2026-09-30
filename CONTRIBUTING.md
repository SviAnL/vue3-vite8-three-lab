## 项目开发流程

- 项目名称：SviAnL
- 项目地址：https://github.com/SviAnL/frontend-template.git
- 包管理器：pnpm
- node版本：24.16.0+
- 项目规范：Conventional Commits + husky + lint-staged + commit-and-tag-version

#### 一、提交代码

```bash
git status  # 查看改动
git diff    # 查看具体差异
git add .   # 暂存全部改动
pnpm commit # 交互式生成规范 commit
git push    # 推送到远程
```

`pnpm commit` 依次询问：改动类型 → 作用域 → 简短描述 → 详细描述 → 是否破坏性变更 → 关联 issue。

提交时 husky 自动触发 lint-staged，对暂存文件执行：

| 文件类型                           | 自动执行                                                |
| ---------------------------------- | ------------------------------------------------------- |
| `.js` / `.ts`                      | `eslint --fix` + `prettier --write`                     |
| `.vue`                             | `eslint --fix` + `stylelint --fix` + `prettier --write` |
| `.css`                             | `stylelint --fix` + `prettier --write`                  |
| `.html`                            | `prettier --write`                                      |
| `.json` / `.md` / `.yml` / `.yaml` | `prettier --write`                                      |

> lint-staged 不含 typecheck 和 test；涉及逻辑/类型改动时手动执行（见第四节）。

#### 二、更新版本

```bash
git status                              # 确认工作区干净
pnpm release --dry-run                  # 预览版本号与 changelog，不改文件
pnpm release                            # 正式发版
git push --follow-tags origin master    # 推送代码并带上 tag
```

`pnpm release` 自动完成：递增 `package.json` version → 更新 `CHANGELOG.md` → 创建 release commit → 打 `vX.Y.Z` tag。

版本号由 commit message 自动判定：

| commit 类型                                 | 版本变化               |
| ------------------------------------------- | ---------------------- |
| `feat:`                                     | minor（1.0.0 → 1.1.0） |
| `fix:`                                      | patch（1.0.0 → 1.0.1） |
| `BREAKING CHANGE` / `feat!`                 | major（1.0.0 → 2.0.0） |
| `docs:` / `chore:` / `style:` / `refactor:` | 不单独触发             |

手动指定版本：

```bash
pnpm release --release-as patch # 或 minor / major
```

验证与发布：

```bash
git tag                     # 查看本地 tag
git ls-remote --tags origin # 查看远程 tag
```

推送后可在仓库 Releases 页面基于新 tag 手动创建 GitHub Release。

#### 三、更新部署

```bash
pnpm typecheck  # 类型检查，便于定位错误
pnpm build      # 生产构建，产物在 dist/
pnpm preview    # 本地预览构建产物
pnpm analyze    # 可选：分析打包体积
```

`pnpm build` 实际执行：`vue-tsc --noEmit --incremental && vite build --mode production`。先类型检查，通过后 Vite 构建。

部署产物按托管方式选择：

| 托管方式         | 部署方式                     |
| ---------------- | ---------------------------- |
| Vercel / Netlify | 推送后自动构建               |
| 服务器           | rsync / scp 上传 `dist/`     |
| GitHub Pages     | `gh-pages` 或 GitHub Actions |

⚠️ 部署前确认 `.env.production` 中 `base` / `VITE_*` 配置正确，否则可能资源 404、路由错误。

#### 四、项目自检

```bash
pnpm typecheck      # TypeScript 类型检查
pnpm lint           # ESLint 检查 JS/TS/Vue
pnpm style          # Stylelint 检查 CSS/Vue 样式
pnpm format         # Prettier 检查格式，不修改文件
pnpm test           # 单元测试
pnpm test:coverage  # 测试覆盖率
```

一键修复：

```bash
pnpm format:fix # Prettier 自动格式化
pnpm lint:fix   # ESLint 自动修复
pnpm style:fix  # Stylelint 自动修复
```

推荐顺序（先格式化可减少 lint/stylelint 报错）：

```bash
pnpm format:fix && pnpm lint:fix && pnpm style:fix
```

通过标准：

- 各命令无输出 / 无 error
- `pnpm format` 输出 `All matched files use Prettier code style!`
- `pnpm test` 全部通过

#### 附：命令速查

| 场景     | 命令                                   | 作用                             |
| -------- | -------------------------------------- | -------------------------------- |
| 提交     | `pnpm commit`                          | 交互式生成规范 commit            |
| 发版预览 | `pnpm release --dry-run`               | 预览版本与 changelog，不改文件   |
| 发版     | `pnpm release`                         | 递增版本、更新 changelog、打 tag |
| 推送     | `git push --follow-tags origin master` | 推送代码并带上 tag               |
| 构建     | `pnpm build`                           | 类型检查 + 生产构建              |
| 预览     | `pnpm preview`                         | 本地预览 dist                    |
| 类型     | `pnpm typecheck`                       | TS 类型检查                      |
| 代码     | `pnpm lint` / `pnpm lint:fix`          | ESLint 检查 / 修复               |
| 样式     | `pnpm style` / `pnpm style:fix`        | Stylelint 检查 / 修复            |
| 格式     | `pnpm format` / `pnpm format:fix`      | Prettier 检查 / 格式化           |
| 测试     | `pnpm test` / `pnpm test:watch`        | 单测 / 监听模式                  |

#### 标准工作流

```bash
pnpm dev                                                                        # 开发
pnpm typecheck && pnpm test                                                     # 提交前自检
git add . && pnpm commit && git push                                            # 提交
pnpm release --dry-run && pnpm release && git push --follow-tags origin master  # 发版
pnpm build && pnpm preview                                                      # 构建并本地验证
# → 部署 dist/
```

v1.0・2026-09-23

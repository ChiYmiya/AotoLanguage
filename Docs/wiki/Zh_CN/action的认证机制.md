# GitHub 认证与权限机制总结

## 一、GitHub 有三个核心概念

```text
Repository（仓库）
        │
        ├── 可见性（Public / Private）
        ├── 用户权限（Owner、Collaborator...）
        └── Token 权限（PAT、GITHUB_TOKEN）
```

很多新人会把这三个概念混在一起，其实它们是彼此独立的。

---

## 二、Public 和 Private 管的是「能不能看」

例如：

```text
Public
```

任何人都可以：

```bash
git clone
```

但是：

```bash
git push
```

**仍然需要权限。**

| 仓库类型 | Clone | Push |
| -------- | ----- | ---- |
| Public   | ✅    | ❌ 默认不行 |
| Private  | ❌（未授权） | ❌（未授权） |

> **Public ≠ 谁都能提交**

---

## 三、谁能 Push？

GitHub **不认邮箱**。

例如：

```bash
git config user.email "abc@qq.com"
```

不会增加任何权限。

GitHub 真正认的是：

```text
认证凭证（Credential）
```

例如：

- SSH Key
- Personal Access Token（PAT）
- GITHUB_TOKEN（GitHub Actions）

认证流程：

```text
git push
      │
      ▼
Git 提供 Token
      │
      ▼
GitHub
      │
      ▼
数据库验证
      │
      ├── 有权限
      └── 没权限（403）
```

> **Token 才是真正的身份证。**

---

## 四、git config 是干什么的？

很多人都会误会。

例如：

```bash
git config user.name
git config user.email
```

它只是告诉 Git：

```text
Commit 作者是谁
```

例如：

```text
Author:
ChiYmiya <xxx@qq.com>
```

和权限一点关系都没有。

---

## 五、为什么我电脑不用输入密码？

因为 Git 已经保存了认证信息。

例如：

```text
Git
 │
 ▼
Credential Manager
 │
 ▼
PAT
```

或者：

```text
Git
 │
 ▼
SSH Key
```

所以：

```bash
git push
```

Git 会自动把 Token 发给 GitHub。

---

## 六、GitHub Actions 怎么认证？

Actions 没有你的电脑。

Workflow 启动时：

```text
Workflow
      │
      ▼
GitHub
      │
      ▼
生成临时 GITHUB_TOKEN
```

然后：

```yaml
uses: actions/checkout@v4
```

会自动把 Git 配置成：

```text
origin
```

类似：

```text
https://x-access-token:GITHUB_TOKEN@github.com/owner/repo.git
```

所以：

```bash
git push
```

时，Git 会自动携带这个 Token。

---

## 七、为什么我的 Action 会 403？

因为默认情况下：

```text
GITHUB_TOKEN
```

只有：

```text
contents: read
```

所以：

```bash
git push
```

GitHub 返回：

```text
403 Forbidden
```

解决方法：

### 仓库设置

``` txt
Settings
└── Actions
    └── General
        └── Workflow permissions
            → Read and write permissions
```

### Workflow

```yaml
permissions:
  contents: write
```

两边都允许，才能 Push。

---

## 八、Fork 是什么？

很多新人以为：

```text
clone
```

就是 Fork。

其实不是。

### Clone

只是：

```text
GitHub
   │
   ▼
本地电脑
```

---

### Fork

是在 GitHub 上复制一份仓库：

```text
GitHub

别人仓库
      │
      ▼
你的仓库
```

Fork 后：

你拥有自己的仓库，可以自由 Push。

修改完成后：

```text
Pull Request
```

请求原作者合并。

---

## 九、为什么别人不能改你的仓库？

GitHub 的权限是：

```text
Repository
```

级别。

例如：

```text
ChiYmiya/AotoLanguage
```

只有：

- Owner
- Collaborator
- Organization Team

才能：

```bash
git push
```

其他人：

```text
Fork
    ↓
修改
    ↓
Pull Request
```

等待维护者审核。

---

## 十、为什么 Action 不能随便 Push？

GitHub 每次都会生成：

```text
GITHUB_TOKEN
```

它的权限来自：

```text
Repository Settings
        ∩
Workflow permissions
```

也就是说：

> **最终权限 = 仓库允许的权限 ∩ Workflow 申请的权限**

例如：

仓库：

```text
Read & Write
```

Workflow：

```yaml
permissions:
  contents: write
```

最终：

```text
Write
```

如果仓库只有：

```text
Read
```

即使 Workflow 写了：

```yaml
permissions:
  contents: write
```

最终仍然只有：

```text
Read
```

因为仓库不给。

---

## 整体流程图

```text
                 GitHub Repository
                        │
        ┌───────────────┴───────────────┐
        │                               │
   Visibility                     Repository Role
(Public / Private)      (Owner / Collaborator...)
        │                               │
        └───────────────┬───────────────┘
                        │
                 git clone / git push
                        │
                  Git 提供 Credential
                        │
      ┌─────────────────┼──────────────────┐
      │                 │                  │
   SSH Key          PAT Token       GITHUB_TOKEN
                                       ▲
                                       │
                                GitHub Actions
                                       │
                        仓库设置 ∩ Workflow permissions
                                       │
                               最终决定能否 Push
```

## 一句话总结

- **Public**：任何人都可以 Clone，但不能随便 Push。
- **Private**：没有权限连 Clone 都不行。
- **git config**：只决定 Commit 作者，不决定权限。
- **Token（PAT、SSH Key、GITHUB_TOKEN）**：真正决定是否有权限。
- **GitHub Actions**：使用 GitHub 自动签发的临时 `GITHUB_TOKEN`。
- **最终权限 = 仓库设置 ∩ Workflow 申请权限。**

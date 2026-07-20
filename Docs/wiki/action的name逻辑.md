# GitHub Actions 中 `name` / `step` / Shell 的执行逻辑

## 1. 每个 `- name:` 都是一个独立的 Step

例如：

```yaml
steps:
  - name: Step A
    run: |
      echo A

  - name: Step B
    run: |
      echo B
```

实际上会执行：

```
启动 Shell①
执行 Step A
关闭 Shell①

启动 Shell②
执行 Step B
关闭 Shell②
```

**结论：**

- 每个 Step 都会启动一个新的 Shell（新的进程）。
- 上一个 Step 的 Shell 状态不会保留。

---

## 2. 为什么环境变量会消失

例如：

```yaml
- name: Step A
  env:
    GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
  run: |
    echo "长度=${#GEMINI_API_KEY}"

- name: Step B
  run: |
    echo "长度=${#GEMINI_API_KEY}"
```

结果：

```
Step A
长度=39

Step B
长度=0
```

原因：

- `env:` 写在 Step A 下，仅对 **Step A** 生效。
- Step B 启动了新的 Shell，不会继承 Step A 的环境变量。

---

## 3. env 的作用域

### Workflow 级

```yaml
env:
  KEY: value
```

作用范围：

```
整个 Workflow
```

---

### Job 级（推荐）

```yaml
jobs:
  build:
    env:
      KEY: value
```

作用范围：

```
当前 Job 的所有 Step
```

---

### Step 级

```yaml
steps:
  - name: Test
    env:
      KEY: value
```

作用范围：

```
仅当前 Step
```

---

## 4. 为什么目录不会变

虽然每个 Step 都启动了新的 Shell，

但是 GitHub Actions 会把新的 Shell 的工作目录重新设置为：

```
$GITHUB_WORKSPACE
```

所以：

```bash
pwd
```

每次都会得到类似：

```
/home/runner/work/AotoLanguage/AotoLanguage
```

因此：

```ts
process.cwd()
```

每个 Step 都是一样的。

---

## 5. 哪些东西不会保留

下面这些在 Step 结束后都会丢失：

- `cd`
- `export`
- Shell 变量
- alias
- 当前进程中的环境变量

例如：

```yaml
- run: |
    cd scripts
    pwd

- run: |
    pwd
```

输出：

```
Step1
.../scripts

Step2
.../AotoLanguage
```

因为 Step2 是新的 Shell。

---

## 6. 哪些东西会保留

能够保留的是：

- Checkout 下来的文件
- 新建/修改的文件
- Git 仓库内容
- 上传到 Artifact 的文件

因为它们写到了磁盘，而不是保存在 Shell 内存中。

---

## 7. 实践建议

对于需要整个 Job 使用的配置（例如 API Key），优先放在 Job 级：

```yaml
jobs:
  translate:
    runs-on: ubuntu-latest

    env:
      GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}

    steps:
      - uses: actions/checkout@v4

      - run: npx tsx scripts/translate.ts
```

这样所有 Step 都能通过：

```ts
process.env.GEMINI_API_KEY
```

读取到同一个环境变量。

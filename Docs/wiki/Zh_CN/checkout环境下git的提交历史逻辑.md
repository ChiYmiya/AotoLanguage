# checkout环境下git的提交历史逻辑

## commit（提交）和Push（推送）

checkout其他机器下拉时
一次push会包含所有commit，
把第一次定义为before，
push的最后版本会被定义为after

在checkout下使用fetch-depth: 0 可以下载完整提交历史
使用fetch-depth: 2，3可以下载往前数的第2次提交（倒数第一次提交为最新）

具体使用例：

```besh
jobs:
  testAnything:
    runs-on: ubuntu-latest
    env:
      GEMINI_API_KEY: ${{secrets.GEMINI_API_KEY}}
      BEFORE: ${{ github.event.before }}
      AFTER: ${{ github.sha }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
```

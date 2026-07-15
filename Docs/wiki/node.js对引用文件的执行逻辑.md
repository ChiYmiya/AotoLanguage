# node对引用文件的路径

它既不是相对于这个 JS 文件，也不是绝对路径。
默认情况下，它是相对于 Node.js 进程的当前工作目录（Current Working Directory，简称 CWD）

## 举个例子

``` txt
my-project/
│
├── docs/
│   └── zh/
│       └── readme.md
│
├── scripts/
│   └── demo.js
│
└── package.json
```

在当前目录下取决于怎么执行demo.js的方式
例如在my-project/下执行

``` node
node scripts/translate.js
```

js代码中执行

``` js
console.log("cwd :>> ", process.cwd());
```

会得到xxx\my-project

在Github Action中执行时会打出以下路径，因为node是运行在runner虚拟环境中的。

``` txt
/home/runner/work/my-project/docs/zh/demo.md
```

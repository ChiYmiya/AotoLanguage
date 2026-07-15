# windows下运行 npx 的问题

原因：

- PowerShell 默认优先执行 `npx.ps1`
- `npx.ps1` 会受到 Execution Policy 限制
- 与 Node 本身无关，nvm 只是更容易暴露这个问题

解决方法：

1. 推荐：使用 Git Bash 或 CMD
2. 或执行 `npx.cmd`
3. 或调整 PowerShell Execution Policy（RemoteSigned）
    Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
    （当windows系统有更高优先级时，此设置失效。因此不推荐）

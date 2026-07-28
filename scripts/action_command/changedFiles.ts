import { execSync } from "node:child_process";

export const getChangedFiles = (): string[] => {
  const before = process.env.BEFORE;
  const after = process.env.AFTER;
  if (!before || !after) {
    throw new Error("BEFORE 或 AFTER 环境变量未设置");
  }
  return execSync(`git diff --name-only ${before} ${after}`, {
    encoding: "utf-8",
  })
    .trim()
    .split("\n")
    .filter(Boolean);
};

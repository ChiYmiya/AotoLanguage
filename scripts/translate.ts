import { GoogleGenAI } from "@google/genai";
import path from "node:path";
import { fileTypeMap } from "./filetypeconfig";
import fs from "node:fs/promises";
import { getmodels } from "./modellist";
import { getChangedFiles } from "./action_command/changedFiles";
// 读取环境变量 GEMINI_API_KEY
const apiKey = process.env.GEMINI_API_KEY!;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY 没有配置");
}
// 初始化 GoogleGenAI 实例
const ai = new GoogleGenAI({
  apiKey: apiKey,
});

for (const file of getChangedFiles()) {
  if (!file) {
    console.log("文件路径为空，跳过处理");
    continue;
  }
  // 获取提交的文件路径
  const filepath = file;
  const languagetext = await fs.readFile(filepath, "utf8");
  // 获取文件名后缀
  const filetype = path.extname(filepath);

  if (filetype === ".md" || filetype === ".json") {
    // 获取文件名
    const filename = path.basename(filepath);
    // 根据文件类型获取对应的 prompt 函数
    const promptFunction = fileTypeMap[filetype];
    // 组装 prompt
    const prompt =
      // 指定国家和语言
      promptFunction("日本", "日语") +
      languagetext +
      `
      -----文件结束-----
      `;
    // 调用API模型翻译函数，带重试机制
    const executeApi = async function generate(prompt: string) {
      let flag = true;
      const models = await getmodels();
      let modelIndex = 0;
      do {
        // 循环尝试备用模型
        for (let i = 0; i < 3; i++) {
          // 每个模型尝试3次
          try {
            // 调用模型生成内容
            return await ai.models.generateContent({
              model: models[modelIndex],
              contents: prompt,
            });
          } catch (e: any) {
            // 捕获异常，根据状态码进行处理
            switch (e.status) {
              case 503: // 服务不可用，可能是模型请求超时
                console.log(`请求模型超时，第 ${i + 1} 次重试...`);
                console.log("e.message :>> ", e.message);
                await new Promise((r) => setTimeout(r, 3000));
                break;
              case 404: // 模型未找到，尝试下一个模型
                console.log(
                  `请求模型 ${models[modelIndex]} 未找到，第 ${i + 1} 次重试...`,
                );
                console.log("e.message :>> ", e.message);
                continue;
              default: // 其他错误，抛出异常
                console.log("e.message :>> ", e.message);
                throw e;
            }
          }

          console.log(`${models[modelIndex]}重试3次仍失败`);
          modelIndex++;
          if (modelIndex >= models.length) {
            flag = false;
          }
          console.log(
            `切换到备用模型 ${models[modelIndex]} 进行尝试...`,
          );
        }
      } while (flag);
      console.log(`${models[modelIndex]}，已无备用模型可用`);
      throw new Error("重试所有模型后仍失败");
    };

    const response = await executeApi(prompt);
    if (!response.text) {
      throw new Error("Gemini 没有返回文本");
    }

    // 创建 docs/wiki/ja 目录（如果不存在）
    await fs.mkdir("docs/wiki/ja", { recursive: true });
    // 写入翻译后的文本到 docs/wiki/ja 目录下的同名文件
    await fs.writeFile(
      `docs/wiki/ja/${filename}_ja`,
      response.text,
      "utf8",
    );
    console.log(`翻译完成：docs/wiki/ja/${filename}_ja`);
  }
}

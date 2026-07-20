import { GoogleGenAI } from "@google/genai";
import path from "node:path";
import { fileTypeMap } from "./filetypeconfig";
import fs from "node:fs/promises";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY 没有配置");
}
const ai = new GoogleGenAI({
  apiKey: apiKey,
});

// 读取文件内容
const filepath = path.join(process.cwd(), "language", "Zh-CN.json");
const languagetext = await fs.readFile(filepath, "utf8");
// 判断文件类型
const filetype = path.extname(filepath);
// 根据文件类型获取对应的 prompt 函数
const promptFunction = fileTypeMap[filetype];
// 组装 prompt
const prompt =
  promptFunction("日本", "日语") +
  languagetext +
  `
  -----文件结束-----
  `;

// API调用函数，带重试机制
const executeApi = async function generate(prompt: string) {
  for (let i = 0; i < 3; i++) {
    try {
      return await ai.models.generateContent({
        model: "gemini-flash-latest",
        // model: "gemini-2.5-flash-lite",
        // model: "gemini-2.5-flash",
        // model: "gemini-3-flash-preview",
        contents: prompt,
      });
    } catch (e: any) {
      if (e.status !== 503) throw e;

      console.log(`第 ${i + 1} 次重试...`);
      console.log("e.message :>> ", e.message);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  throw new Error("重试 3 次后仍失败");
};
const response = await executeApi(prompt);
if (!response.text) {
  throw new Error("Gemini 没有返回文本");
}

await fs.mkdir("language/ja", { recursive: true });

await fs.writeFile("language/ja/ja.json", response.text, "utf8");

console.log("翻译完成：language/ja/ja.json");

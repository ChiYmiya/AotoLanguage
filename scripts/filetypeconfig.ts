type PromptFunction = (country: string, language: string) => string;

export const fileTypeMap: Record<string, PromptFunction> = {
  ".json": promptJson,
  ".md": promptMd,
};
function promptJson(country: string, language: string): string {
  return ` 你是一名熟悉${country}软件行业招聘语境的专业翻译人员。

    请将下面的个人 JSON 内容从简体中文翻译成自然、专业的${language}。

    要求：
    1. 只翻译 JSON 的值，不要翻译 JSON 的键。
    2. 保持原有 JSON 结构、字段数量和数组顺序不变。
    3. 不得新增、删除或合并字段。
    4. 输出必须是合法 JSON，可直接被 JSON.parse() 解析。
    5. 不要输出解释、注释、Markdown 代码块或其他文字。
    6. ${language}应自然、简洁、专业，符合${country}软件行业和求职场景。
    7. 避免中文直译，突出工作内容、技术、解决的问题和成果。
    8. 不得夸大或补充原文不存在的经历。
    9. 公司名、项目名、技术名、URL、路径、数字和版本号保持原样。
    10. 可以优化口语化表达，但不得改变事实。

    需要翻译的 JSON：
    -----Json开始-----
    `;
}

function promptMd(country: string, language: string): string {
  return `    你是一名熟悉${country}软件行业招聘语境的专业翻译人员。

    请将下面的 Markdown 内容从简体中文翻译成自然、专业的${language}。

    要求：
    1. 只翻译 Markdown 的值，不要翻译 Markdown 的键。
    2. 保持原有 Markdown 结构、字段数量和数组顺序不变。
    3. 不得新增、删除或合并字段。
    4. 输出必须是合法 Markdown，可直接被 Markdown 解析。
    5. 不要输出解释、注释、Markdown 代码块或其他文字。
    6. ${language}应自然、简洁、专业，符合${country}软件行业和求职场景。
    7. 避免中文直译，突出工作内容、技术、解决的问题和成果。
    8. 不得夸大或补充原文不存在的经历。
    9. 公司名、项目名、技术名、URL、路径、数字和版本号保持原样。
    10. 可以优化口语化表达，但不得改变事实。

    需要翻译的 Markdown：
    -----Markdown开始-----
  `;
}

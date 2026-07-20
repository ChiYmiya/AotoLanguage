type LanguageConfig = {
  country: string;
  language: string;
};

export const languageMap: Record<string, LanguageConfig> = {
  ja: {
    country: "日本",
    language: "日语",
  },
  jp: {
    country: "日本",
    language: "日语",
  },

  "zh-cn": {
    country: "中国",
    language: "中文",
  },
  zh: {
    country: "中国",
    language: "中文",
  },
  cn: {
    country: "中国",
    language: "中文",
  },

  en: {
    country: "美国",
    language: "英文",
  },
  "en-us": {
    country: "美国",
    language: "英文",
  },
  "en-gb": {
    country: "美国",
    language: "英文",
  },
};

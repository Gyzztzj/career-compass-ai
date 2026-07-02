import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

function getApiKey(): string {
  const key = process.env.DASHSCOPE_API_KEY;
  if (!key) {
    throw new Error("DASHSCOPE_API_KEY 环境变量未设置，请在 .env 文件中配置");
  }
  return key;
}

/**
 * 配置Langchain的OpenAI模型
 */
export const llm = new ChatOpenAI({
  model: "qwen-plus",
  configuration: {
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  },
  apiKey: process.env.DASHSCOPE_API_KEY || "",
  temperature: 0.3,
  maxRetries: 3,
  timeout: 60000,
});

/**
 * 验证OpenAI API密钥
 */
export function validateApiKey() {
  getApiKey();
}

/**
 * 配置分析提示模板
 */
export const analysisPrompt = PromptTemplate.fromTemplate(`
你是专业的简历分析专家。请分析以下简历与JD的匹配度。

简历内容：
{resume}

JD内容：
{jd}

请严格按照以下JSON格式输出，不要包含任何Markdown标记或额外说明：
{{
  "matchScore": 85,
  "summary": "简短结论",
  "detailSummary": "详细分析",
  "skills": [
    {{ "label": "技能匹配", "score": 88 }},
    {{ "label": "经验匹配", "score": 82 }},
    {{ "label": "学历匹配", "score": 90 }},
    {{ "label": "项目匹配", "score": 78 }}
  ],
  "suggestions": ["建议1", "建议2", "建议3"]
}}
`);

/**
 * 配置输出解析器
 */
export const outputParser = new StringOutputParser();

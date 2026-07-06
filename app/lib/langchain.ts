import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import type { IModelConfig } from "@/app/types/main";

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

export const outputParser = new StringOutputParser();

/**
 * 创建LLM实例
 * @param config 模型配置
 * @returns ChatOpenAI实例
 */
export function createLLM(config: IModelConfig): ChatOpenAI {
  return new ChatOpenAI({
    model: config.modelName,
    configuration: {
      baseURL: config.baseUrl,
    },
    apiKey: config.apiKey,
    temperature: 0.3,
    maxRetries: 3,
    timeout: 60000,
  });
}

export function validateApiKey(apiKey: string): void {
  if (!apiKey || !apiKey.trim()) {
    throw new Error("API密钥未设置，请在配置中填写");
  }
}

import { llm, analysisPrompt, outputParser } from "@/app/lib/langchain";
import { analyzeLogger } from "@/app/services/logServive";
import { IAnalysisInput, IAnalysisResult } from "../types/main";

/**
 * 运行简历分析
 * @param input 分析输入
 * @returns 分析结果
 */
export async function runAnalysis(
  input: IAnalysisInput,
): Promise<IAnalysisResult> {
  const chain = analysisPrompt.pipe(llm).pipe(outputParser);

  let rawResult: string;
  try {
    rawResult = await chain.invoke({
      resume: input.resumeText,
      jd: input.jdText,
    });
  } catch (error: any) {
    analyzeLogger.error("LLM调用失败:", error.message || error);
    throw new Error(`LLM服务调用失败: ${error.message || "未知错误"}`);
  }

  analyzeLogger.info("LLM返回原始结果", {
    length: rawResult.length,
    preview: rawResult.substring(0, 100),
  });

  try {
    const jsonStr = rawResult
      .replace(/```json\s*/g, "")
      .replace(/\s*```/g, "")
      .trim();
    const parsed = JSON.parse(jsonStr);

    if (!parsed.matchScore || !parsed.summary) {
      throw new Error("返回格式不完整");
    }

    return parsed;
  } catch (parseError: any) {
    analyzeLogger.warn("JSON解析失败，使用默认结果:", parseError.message, {
      rawResult: rawResult.substring(0, 200),
    });
    return {
      matchScore: 60,
      summary: "分析完成",
      detailSummary: "AI返回格式异常，已使用默认评分",
      skills: [
        { label: "技能匹配", score: 60 },
        { label: "经验匹配", score: 60 },
        { label: "学历匹配", score: 60 },
        { label: "项目匹配", score: 60 },
      ],
      suggestions: ["建议重新提交简历或JD内容"],
    };
  }
}

import { NextResponse } from "next/server";
import { runAnalysis } from "@/app/services/analyzisService";
import { analyzeLogger } from "@/app/services/logServive";
import { IModelConfig, DEFAULT_MODEL_CONFIG } from "@/app/types/main";

/**
 * 处理分析请求
 */
export async function POST(request: Request) {
  try {
    const { resumeText, jdText, modelConfig } = await request.json();

    if (!resumeText || !jdText) {
      return NextResponse.json(
        { error: "缺少参数: resumeText 和 jdText 都是必填项" },
        { status: 400 },
      );
    }

    if (!resumeText.trim()) {
      return NextResponse.json(
        { error: "简历内容为空，请重新上传" },
        { status: 400 },
      );
    }

    if (!jdText.trim()) {
      return NextResponse.json(
        { error: "JD内容为空，请输入岗位描述" },
        { status: 400 },
      );
    }

    // 合并默认配置和用户配置
    const config: IModelConfig = {
      ...DEFAULT_MODEL_CONFIG,
      ...modelConfig,
    };

    analyzeLogger.info("开始分析", {
      resumeLength: resumeText.length,
      jdLength: jdText.length,
      modelName: config.modelName,
    });
    const result = await runAnalysis({ resumeText, jdText }, config); // 执行分析
    analyzeLogger.info("分析完成", { matchScore: result.matchScore }); // 记录分析结果
    return NextResponse.json({ success: true, data: result }, { status: 200 }); // 返回分析结果
  } catch (error: any) {
    analyzeLogger.error("分析失败:", error.message || error);
    return NextResponse.json(
      { error: `分析失败: ${error.message || "未知错误"}` },
      { status: 500 },
    );
  }
}

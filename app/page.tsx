"use client";

import { useState, useCallback, useEffect } from "react";
import Header from "./components/Header";
import ResumeUpload from "./components/ResumeUpload";
import JDInput from "./components/JDInput";
import AnalysisResult from "./components/AnalysisResult";
import ModelConfig from "./components/ModelConfig";
import { Loader2 } from "lucide-react";
import {
  IAnalysisResult,
  IUploadResponse,
  IModelConfig,
  DEFAULT_MODEL_CONFIG,
} from "@/app/types/main";
import { analyzeResume } from "@/app/lib/platform";

type Step = "input" | "analyzing" | "result";

const STORAGE_KEY = "career-compass-ai-config";

export default function Home() {
  const [step, setStep] = useState<Step>("input");
  const [resumeFile, setResumeFile] = useState<IUploadResponse | null>(null);
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState<IAnalysisResult | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [modelConfig, setModelConfig] =
    useState<IModelConfig>(DEFAULT_MODEL_CONFIG);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as IModelConfig;
        setModelConfig({
          ...DEFAULT_MODEL_CONFIG,
          ...parsed,
        });
      } catch {}
    }
  }, []);

  const canAnalyze =
    resumeFile !== null &&
    jdText.trim().length > 0 &&
    modelConfig.apiKey.trim().length > 0;

  const handleAnalyze = async () => {
    if (!resumeFile?.content || !jdText) return;

    setStep("analyzing");

    try {
      const analysisResult = await analyzeResume(
        {
          resumeText: resumeFile.content,
          jdText: jdText,
        },
        modelConfig,
      );
      setResult(analysisResult);
      setStep("result");
    } catch (error: any) {
      setStep("input");
      alert(error.message || "分析失败，请重试");
    }
  };

  const handleReset = useCallback(() => {
    setStep("input");
    setResumeFile(null);
    setJdText("");
    setResult(null);
  }, []);

  const handleConfigChange = (config: IModelConfig) => {
    setModelConfig(config);
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Header onConfigClick={() => setShowConfig(true)} />

      <main className="flex flex-1 justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl space-y-6">
          {(step === "input" || step === "analyzing") && (
            <>
              <ResumeUpload
                fileInfo={resumeFile}
                onFileChange={setResumeFile}
              />

              <JDInput value={jdText} onChange={setJdText} />

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!canAnalyze || step === "analyzing"}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {step === "analyzing" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    分析约需10-30秒，请耐心等待
                  </>
                ) : !modelConfig.apiKey.trim() ? (
                  "请先配置 API 密钥"
                ) : (
                  "上传简历与JD后开始分析"
                )}
              </button>

              {step === "input" && (
                <p className="text-center text-xs text-zinc-400">
                  系统将从技能、经验、学历与项目经历四个维度生成匹配报告。
                </p>
              )}
            </>
          )}

          {step === "result" && result && (
            <>
              <AnalysisResult
                matchScore={result.matchScore}
                summary={result.summary}
                detailSummary={result.detailSummary}
                skills={result.skills}
                suggestions={result.suggestions}
              />

              <button
                type="button"
                onClick={handleReset}
                className="flex w-full items-center justify-center rounded-xl border border-zinc-300 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50"
              >
                重新分析
              </button>
            </>
          )}
        </div>
      </main>

      {showConfig && (
        <ModelConfig
          config={modelConfig}
          onChange={handleConfigChange}
          onClose={() => setShowConfig(false)}
        />
      )}
    </div>
  );
}

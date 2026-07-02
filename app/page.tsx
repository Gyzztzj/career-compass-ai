"use client";

import { useState, useCallback } from "react";
import Header from "./components/Header";
import ResumeUpload from "./components/ResumeUpload";
import JDInput from "./components/JDInput";
import AnalysisResult from "./components/AnalysisResult";
import { Loader2 } from "lucide-react";
import { IAnalysisResult, IUploadResponse } from "@/app/types/main";

type Step = "input" | "analyzing" | "result";

export default function Home() {
  const [step, setStep] = useState<Step>("input");
  const [resumeFile, setResumeFile] = useState<IUploadResponse | null>(null);
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState<IAnalysisResult | null>(null);
  const canAnalyze = resumeFile !== null && jdText.trim().length > 0;

  /**
   * 处理分析点击事件
   */
  const handleAnalyze = async () => {
    if (!resumeFile?.content || !jdText) return;

    setStep("analyzing");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: resumeFile?.content,
          jdText: jdText,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "分析失败");
      }

      setResult(result.data);
      setStep("result");
    } catch (error: any) {
      setStep("input");
      alert(error.message || "分析失败，请重试");
    }
  };
  /**
   * 处理重置点击事件
   */
  const handleReset = useCallback(() => {
    setStep("input");
    setResumeFile(null);
    setJdText("");
    setResult(null);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Header />

      <main className="flex flex-1 justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl space-y-6">
          {/* Step: Input */}
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

          {/* Step: Result */}
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
    </div>
  );
}

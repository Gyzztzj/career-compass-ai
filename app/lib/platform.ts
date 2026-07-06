import type {
  IUploadResponse,
  IAnalysisInput,
  IAnalysisResult,
  IModelConfig,
} from "@/app/types/main";

declare global {
  interface Window {
    electronAPI?: {
      selectAndParseFile: () => Promise<IUploadResponse>;
      analyze: (
        input: IAnalysisInput,
        config: IModelConfig,
      ) => Promise<IAnalysisResult>;
    };
  }
}

/**
 * 检查是否在Electron环境中
 * @returns 是否在Electron环境中
 */
function isElectron(): boolean {
  return typeof window !== "undefined" && !!window.electronAPI;
}

/**
 * 选择并解析文件
 * @returns 解析后的文件内容
 */
export async function selectAndParseFile(): Promise<IUploadResponse> {
  if (isElectron()) {
    return window.electronAPI!.selectAndParseFile();
  }
  throw new Error("此功能仅在桌面端可用");
}

/**
 * 上传文件
 * @param file 要上传的文件
 * @returns 上传后的文件信息
 */
export async function uploadFile(file: File): Promise<IUploadResponse> {
  if (isElectron()) {
    throw new Error("Electron环境请使用selectAndParseFile");
  }

  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "文件上传失败");
  }
  return result;
}

/**
 * 分析简历
 * @param input 分析输入
 * @param config 模型配置
 * @returns 分析结果
 */
export async function analyzeResume(
  input: IAnalysisInput,
  config: IModelConfig,
): Promise<IAnalysisResult> {
  if (isElectron()) {
    return window.electronAPI!.analyze(input, config);
  }

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...input,
      modelConfig: config,
    }),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "分析失败");
  }
  return result.data;
}

export { isElectron };

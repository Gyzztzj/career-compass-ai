/**
 * 上传文件响应
 * @param fileId 文件ID
 * @param content 文件内容
 * @param contentSize 文件大小
 * @param fileName 文件名
 */
export interface IUploadResponse {
  fileId: string;
  content: string;
  contentSize: number;
  fileName: string;
}
/**
 * 分析简历响应
 * @param resumeText 简历文本
 * @param jdText JD文本
 */
export interface IAnalysisInput {
  resumeText: string;
  jdText: string;
}
/**
 * 分析简历结果
 * @param matchScore 匹配分数
 * @param summary 摘要
 * @param detailSummary 详细摘要
 * @param skills 技能匹配结果
 * @param suggestions 建议列表
 */
export interface IAnalysisResult {
  matchScore: number;
  summary: string;
  detailSummary: string;
  skills: { label: string; score: number }[];
  suggestions: string[];
}

/**
 * 简历上传组件属性
 * @param fileInfo 上传文件信息
 * @param onFileChange 文件上传回调
 */
export interface IResumeUploadProps {
  fileInfo: IUploadResponse | null;
  onFileChange: (fileInfo: IUploadResponse | null) => void;
}

/**
 * 模型配置
 * @param apiKey API密钥
 * @param baseUrl 模型基础URL
 * @param modelName 模型名称
 */
export interface IModelConfig {
  apiKey: string;
  baseUrl: string;
  modelName: string;
}

export const DEFAULT_MODEL_CONFIG: IModelConfig = {
  apiKey: "",
  baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  modelName: "qwen-plus",
};

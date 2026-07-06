import { promises as fs } from "fs";
import path from "path";
import { extractText, getDocumentProxy } from "unpdf";
import mammoth from "mammoth";
import { IUploadResponse } from "../types/main";
import { fileLogger } from "./logServive";

const PDF_TYPES = [
  "application/pdf",
  "application/x-pdf",
  "application/octet-stream",
];

const DOCX_TYPES = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/octet-stream",
];

/**
 * 检查文件路径是否为PDF文件
 * @param filePath 文件路径
 * @returns 是否为PDF文件
 */
function isPDFFromPath(filePath: string): boolean {
  return filePath.toLowerCase().endsWith(".pdf");
}

/**
 * 检查文件路径是否为DOCX文件
 * @param filePath 文件路径
 * @returns 是否为DOCX文件
 */
function isDOCXFromPath(filePath: string): boolean {
  return filePath.toLowerCase().endsWith(".docx");
}

/**
 * 检查文件是否为PDF文件
 * @param file 文件
 * @returns 是否为PDF文件
 */
function isPDFFromFile(file: File): boolean {
  return (
    PDF_TYPES.includes(file.type) || file.name.toLowerCase().endsWith(".pdf")
  );
}

/**
 * 检查文件是否为DOCX文件
 * @param file 文件
 * @returns 是否为DOCX文件
 */
function isDOCXFromFile(file: File): boolean {
  return (
    DOCX_TYPES.includes(file.type) || file.name.toLowerCase().endsWith(".docx")
  );
}

/**
 * 超时处理Promise
 * @param promise 要处理的Promise
 * @param ms 超时时间（毫秒）
 * @returns 处理后的Promise
 */
function timeoutPromise<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`解析超时（${ms}ms）`));
    }, ms);
    promise.then(
      (result) => {
        clearTimeout(timer);
        resolve(result);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

/**
 * 解析简历文件
 * @param file 文件
 * @returns 解析后的简历内容
 */
export async function parseResumeFile(file: File): Promise<IUploadResponse> {
  const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  const tempPath = path.join(process.cwd(), "temp", `${fileId}.tmp`);
  await fs.mkdir(path.dirname(tempPath), { recursive: true });

  const arrayBuffer = await file.arrayBuffer();
  await fs.writeFile(tempPath, Buffer.from(arrayBuffer));

  fileLogger.info("开始解析文件", {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  });

  try {
    let content: string = "";

    if (isPDFFromFile(file)) {
      content = await timeoutPromise(parsePDF(tempPath), 30000);
    } else if (isDOCXFromFile(file)) {
      content = await timeoutPromise(parseDOCX(tempPath), 30000);
    } else {
      throw new Error(`不支持的文件类型: ${file.type}`);
    }

    if (!content || content.trim().length === 0) {
      throw new Error("文件解析结果为空，可能是扫描件或加密文件");
    }

    fileLogger.info("文件解析成功", {
      fileName: file.name,
      contentLength: content.length,
    });

    return {
      fileId,
      content,
      contentSize: content.length,
      fileName: file.name,
    };
  } finally {
    await fs.unlink(tempPath).catch(() => {});
  }
}

/**
 * 解析简历文件（从路径）
 * @param filePath 文件路径
 * @returns 解析后的简历内容
 */
export async function parseResumeFromPath(
  filePath: string,
): Promise<IUploadResponse> {
  const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  const fileName = path.basename(filePath);
  const stats = await fs.stat(filePath);

  fileLogger.info("开始解析文件（路径）", {
    fileName,
    filePath,
    fileSize: stats.size,
  });

  try {
    let content: string = "";

    if (isPDFFromPath(filePath)) {
      content = await timeoutPromise(parsePDF(filePath), 30000);
    } else if (isDOCXFromPath(filePath)) {
      content = await timeoutPromise(parseDOCX(filePath), 30000);
    } else {
      throw new Error(`不支持的文件类型`);
    }

    if (!content || content.trim().length === 0) {
      throw new Error("文件解析结果为空，可能是扫描件或加密文件");
    }

    fileLogger.info("文件解析成功", {
      fileName,
      contentLength: content.length,
    });

    return {
      fileId,
      content,
      contentSize: content.length,
      fileName,
    };
  } catch (error: any) {
    fileLogger.error("文件解析错误:", error.message || error);
    throw error;
  }
}

/**
 * 解析PDF文件
 * @param filePath 文件路径
 * @returns 解析后的PDF内容
 */
async function parsePDF(filePath: string): Promise<string> {
  try {
    const buf = await fs.readFile(filePath);
    const unit8Data = new Uint8Array(buf);
    const pdfDoc = await getDocumentProxy(unit8Data);
    const { text } = await extractText(pdfDoc, { mergePages: true });
    return cleanText(text);
  } catch (error: any) {
    fileLogger.error("PDF解析错误:", filePath, error.message || error);
    throw new Error(`PDF解析错误: ${error.message}`);
  }
}

/**
 * 解析DOCX文件
 * @param filePath 文件路径
 * @returns 解析后的DOCX内容
 */
async function parseDOCX(filePath: string): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return cleanText(result.value);
  } catch (error: any) {
    fileLogger.error("DOCX解析错误:", filePath, error.message || error);
    throw new Error(`DOCX解析错误: ${error.message}`);
  }
}

/**
 * 清理文本
 * @param text 待清理的文本
 * @returns 清理后的文本
 */
function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n /g, "\n")
    .replace(/ \n/g, "\n")
    .trim();
}

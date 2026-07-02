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

function isPDF(file: File): boolean {
  return (
    PDF_TYPES.includes(file.type) || file.name.toLowerCase().endsWith(".pdf")
  );
}

function isDOCX(file: File): boolean {
  return (
    DOCX_TYPES.includes(file.type) || file.name.toLowerCase().endsWith(".docx")
  );
}

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

    if (isPDF(file)) {
      content = await timeoutPromise(parsePDF(tempPath), 30000);
    } else if (isDOCX(file)) {
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
 * PDF 解析器
 * @param filePath PDF 文件路径
 * @returns 解析后的文本
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
 * DOCX 解析器
 * @param filePath DOCX 文件路径
 * @returns 解析后的文本
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
 * 清洗文本
 * @param text 待清洗的文本
 * @returns 清洗后的文本
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

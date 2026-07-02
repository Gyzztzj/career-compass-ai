import { NextResponse } from "next/server";
import { parseResumeFile } from "@/app/services/fileService";
import { fileLogger } from "@/app/services/logServive";

/**
 * 上传文件路由
 * @param req POST 请求
 * @returns 解析后的文本
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "请选择文件" }, { status: 400 });
    }

    // 校验格式
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "仅支持 PDF/DOCX 格式" },
        { status: 400 },
      );
    }

    // 校验文件大小
    if (file.size > 1024 * 1024 * 20) {
      return NextResponse.json(
        { message: "文件大小不能超过 20MB" },
        { status: 400 },
      );
    }

    // 解析文件
    const result = await parseResumeFile(file);
    return NextResponse.json(
      {
        success: true,
        fileId: result.fileId,
        content: result.content,
        contentSize: result.contentSize,
        fileName: result.fileName,
      },
      { status: 200 },
    );
  } catch (error: any) {
    fileLogger.error("文件解析错误:", error);
    return NextResponse.json(
      {
        success: false,
        message: `文件解析失败: ${error.message}`,
      },
      { status: 500 },
    );
  }
}

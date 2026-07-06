"use client";

import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { Upload, FileText, X, CheckCircle2, FolderOpen } from "lucide-react";
import { IResumeUploadProps } from "@/app/types/main";
import { isElectron, selectAndParseFile, uploadFile } from "@/app/lib/platform";

export default function ResumeUpload({
  fileInfo,
  onFileChange,
}: IResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * 处理拖拽文件事件
   */
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  /**
   * 处理拖拽文件离开事件
   */
  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  /**
   * 处理拖拽文件事件
   */
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0]; //获取拖拽的文件
    if (!droppedFile) return;
    if (droppedFile) {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (
        validTypes.includes(droppedFile.type) &&
        droppedFile.size <= 20 * 1024 * 1024
      ) {
        handleWebUpload(droppedFile);
      }
    }
  };

  /**
   * 处理文件输入事件
   */
  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      handleWebUpload(selected);
    }
  };

  /**
   * 处理删除文件事件
   */
  const handleRemove = () => {
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  /**
   * 格式化文件大小
   */
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  /**
   * 处理文件上传事件
   */
  const handleWebUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const result = await uploadFile(file);
      onFileChange(result);
    } catch (error: any) {
      alert(error.message || "文件上传失败");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 处理Electron文件选择事件
   */
  const handleElectronSelect = async () => {
    setIsLoading(true);
    try {
      const result = await selectAndParseFile();
      onFileChange(result);
    } catch (error: any) {
      if (error.message !== "未选择文件") {
        alert(error.message || "文件选择失败");
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 处理点击事件
   */
  const handleClick = () => {
    if (isElectron()) {
      handleElectronSelect();
    } else {
      inputRef.current?.click();
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <div className="mb-3 flex items-center gap-2">
        <Upload className="h-5 w-5 text-indigo-600" />
        <h3 className="text-base font-semibold text-zinc-900">上传简历</h3>
      </div>
      <p className="mb-4 text-sm text-zinc-500">
        {isElectron() ? "点击选择文件" : "文件上传 · 粘贴文本"}
      </p>

      {fileInfo ? (
        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm font-medium text-zinc-900">
                {fileInfo.fileName}
              </p>
              <p className="text-xs text-zinc-500">
                {formatSize(fileInfo.contentSize)} · 上传成功
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={!isElectron() ? handleDragOver : undefined}
          onDragLeave={!isElectron() ? handleDragLeave : undefined}
          onDrop={!isElectron() ? handleDrop : undefined}
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleClick();
            }
          }}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 transition-colors ${
            isDragging
              ? "border-indigo-400 bg-indigo-50"
              : "border-zinc-300 bg-zinc-50 hover:border-indigo-300 hover:bg-indigo-50/50"
          }`}
        >
          {isLoading ? (
            <>
              <div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
              <p className="text-sm font-medium text-zinc-700">解析中...</p>
            </>
          ) : isElectron() ? (
            <>
              <FolderOpen className="mb-3 h-10 w-10 text-zinc-400" />
              <p className="text-sm font-medium text-zinc-700">点击选择文件</p>
              <p className="mt-1 text-xs text-zinc-400">
                支持 .pdf/.docx 格式，最大 20MB
              </p>
            </>
          ) : (
            <>
              <Upload className="mb-3 h-10 w-10 text-zinc-400" />
              <p className="text-sm font-medium text-zinc-700">
                拖拽文件至此处 或 点击上传
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                支持 .pdf/.docx 格式，最大 20MB
              </p>
            </>
          )}
          {!isElectron() && (
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileInput}
              className="hidden"
            />
          )}
        </div>
      )}
    </div>
  );
}

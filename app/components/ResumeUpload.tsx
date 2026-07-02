"use client";

import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { IResumeUploadProps } from "@/app/types/main";

/**
 * 简历上传组件
 * @param onFileChange 文件上传回调
 */
export default function ResumeUpload({
  fileInfo,
  onFileChange,
}: IResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * 处理拖拽事件
   * @param e 拖拽事件
   */
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  /**
   * 处理拖拽离开事件
   * @param e 拖拽离开事件
   */
  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  /**
   * 处理拖拽文件事件
   * @param e 拖拽文件事件
   */
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (
        validTypes.includes(droppedFile.type) &&
        droppedFile.size <= 20 * 1024 * 1024
      ) {
        handleUpload(droppedFile);
      }
    }
  };

  /**
   * 处理文件输入事件
   * @param e 文件输入事件
   */
  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      handleUpload(selected);
    }
  };

  /**
   * 处理移除文件事件
   */
  const handleRemove = () => {
    handleUpload(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  /**
   * 格式化文件大小
   * @param bytes 文件大小（字节）
   * @returns 格式化后的文件大小字符串
   */
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  /**
   * 上传文件到服务器并获取文件信息
   * @param file 上传的文件
   */
  const handleUpload = async (file: File | null) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const fileInfo = await response.json();
      if (!response.ok || !fileInfo.success) {
        alert(fileInfo.message || "文件上传失败");
        return;
      }
      onFileChange(fileInfo);
    } catch (error) {
      alert("文件上传失败，请检查网络或重试");
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <div className="mb-3 flex items-center gap-2">
        <Upload className="h-5 w-5 text-indigo-600" />
        <h3 className="text-base font-semibold text-zinc-900">上传简历</h3>
      </div>
      <p className="mb-4 text-sm text-zinc-500">文件上传 · 粘贴文本</p>

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
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              inputRef.current?.click();
            }
          }}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 transition-colors ${
            isDragging
              ? "border-indigo-400 bg-indigo-50"
              : "border-zinc-300 bg-zinc-50 hover:border-indigo-300 hover:bg-indigo-50/50"
          }`}
        >
          <Upload className="mb-3 h-10 w-10 text-zinc-400" />
          <p className="text-sm font-medium text-zinc-700">
            拖拽文件至此处 或 点击上传
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            支持 .pdf/.docx 格式，最大 20MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}

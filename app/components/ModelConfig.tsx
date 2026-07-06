"use client";

import { useState, useEffect } from "react";
import { Settings, X, Save, RotateCcw } from "lucide-react";
import { IModelConfig, DEFAULT_MODEL_CONFIG } from "@/app/types/main";

interface IModelConfigProps {
  config: IModelConfig;
  onChange: (config: IModelConfig) => void;
  onClose: () => void;
}

const MODEL_PRESETS: { name: string; config: Partial<IModelConfig> }[] = [
  {
    name: "阿里云千问",
    config: {
      baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
      modelName: "qwen-plus",
    },
  },
  {
    name: "豆包",
    config: {
      baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
      modelName: "doubao",
    },
  },
  {
    name: "OpenAI",
    config: {
      baseUrl: "https://api.openai.com/v1",
      modelName: "gpt-4o-mini",
    },
  },
  {
    name: "DeepSeek",
    config: {
      baseUrl: "https://api.deepseek.com/v1",
      modelName: "deepseek-chat",
    },
  },
];

const STORAGE_KEY = "career-compass-ai-config";

export default function ModelConfig({
  config,
  onChange,
  onClose,
}: IModelConfigProps) {
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [baseUrl, setBaseUrl] = useState(config.baseUrl);
  const [modelName, setModelName] = useState(config.modelName);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as IModelConfig;
        setApiKey(parsed.apiKey || "");
        setBaseUrl(parsed.baseUrl || DEFAULT_MODEL_CONFIG.baseUrl);
        setModelName(parsed.modelName || DEFAULT_MODEL_CONFIG.modelName);
      } catch {}
    }
  }, []);

  const handlePresetSelect = (preset: (typeof MODEL_PRESETS)[0]) => {
    setBaseUrl(preset.config.baseUrl || DEFAULT_MODEL_CONFIG.baseUrl);
    setModelName(preset.config.modelName || DEFAULT_MODEL_CONFIG.modelName);
  };

  const handleSave = () => {
    const newConfig: IModelConfig = {
      apiKey: apiKey.trim(),
      baseUrl: baseUrl.trim() || DEFAULT_MODEL_CONFIG.baseUrl,
      modelName: modelName.trim() || DEFAULT_MODEL_CONFIG.modelName,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    onChange(newConfig);
    onClose();
  };

  const handleReset = () => {
    setApiKey("");
    setBaseUrl(DEFAULT_MODEL_CONFIG.baseUrl);
    setModelName(DEFAULT_MODEL_CONFIG.modelName);
    localStorage.removeItem(STORAGE_KEY);
    onChange(DEFAULT_MODEL_CONFIG);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-zinc-900">模型配置</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              API 密钥
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="请输入您的 API Key"
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              模型预设
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MODEL_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetSelect(preset)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    baseUrl === preset.config.baseUrl &&
                    modelName === preset.config.modelName
                      ? "bg-indigo-600 text-white"
                      : "border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              模型 Base URL
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.example.com/v1"
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              模型名称
            </label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="model-name"
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <RotateCcw className="h-4 w-4" />
            重置
          </button>
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            保存配置
          </button>
        </div>

        {apiKey.trim() && (
          <p className="mt-4 text-center text-xs text-zinc-400">
            配置已保存到本地存储
          </p>
        )}
      </div>
    </div>
  );
}

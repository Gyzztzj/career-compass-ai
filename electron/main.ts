import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import waitOn from "wait-on";
import { parseResumeFromPath } from "../app/services/fileService";
import { runAnalysis } from "../app/services/analyzisService";
import {
  IUploadResponse,
  IAnalysisInput,
  IAnalysisResult,
  IModelConfig,
} from "../app/types/main";

let mainWindow: BrowserWindow | null = null; // 主窗口实例
const isDev = !app.isPackaged; // 是否为开发环境
const devUrl = "http://localhost:3000"; // 开发环境URL
const prodUrl = path.join(__dirname, "../../export/index.html"); // 生产环境URL

/**
 * 创建主窗口
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // 预加载脚本路径
      nodeIntegration: false, // 禁用Node.js集成
      contextIsolation: true, // 启用上下文隔离
      sandbox: true, // 启用沙箱
    },
  });

  if (isDev && mainWindow) {
    // 开发环境下，加载开发环境URL并打开开发者工具
    waitOn({ resources: [devUrl] }).then(() => {
      mainWindow!.loadURL(devUrl);
      mainWindow!.webContents.openDevTools();
    });
  } else {
    // 生产环境下，加载生产环境URL
    mainWindow.loadFile(prodUrl);
  }
}

/**
 * 处理选择并解析文件事件
 */
ipcMain.handle("select-and-parse-file", async (): Promise<IUploadResponse> => {
  if (!mainWindow) {
    throw new Error("主窗口未初始化");
  }

  const result = await dialog.showOpenDialog(mainWindow, {
    title: "选择简历文件",
    filters: [
      { name: "PDF 文件", extensions: ["pdf"] },
      { name: "Word 文档", extensions: ["docx"] },
    ],
    properties: ["openFile"],
  });

  if (result.canceled || result.filePaths.length === 0) {
    throw new Error("未选择文件");
  }

  const filePath = result.filePaths[0];
  const parsedResult = await parseResumeFromPath(filePath);
  return parsedResult;
});

/**
 * 处理分析简历事件
 */
ipcMain.handle(
  "analyze-resume",
  async (
    _,
    input: IAnalysisInput,
    config: IModelConfig,
  ): Promise<IAnalysisResult> => {
    const result = await runAnalysis(input, config);
    return result;
  },
);

/**
 * 处理最小化窗口事件
 */
ipcMain.on("window-min", () => {
  mainWindow?.minimize();
});

/**
 * 处理关闭窗口事件
 */
ipcMain.on("window-close", () => {
  mainWindow?.close();
});

/**
 * 应用准备就绪时创建主窗口
 */
app.whenReady().then(createWindow);

/**
 * 所有窗口关闭时触发事件
 */
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

/**
 * 应用激活时触发事件
 */
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

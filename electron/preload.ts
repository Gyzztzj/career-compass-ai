import { contextBridge, ipcRenderer } from "electron";
import type { IModelConfig } from "../app/types/main";

contextBridge.exposeInMainWorld("electronAPI", {
  selectAndParseFile: () => ipcRenderer.invoke("select-and-parse-file"),
  analyze: (
    input: { resumeText: string; jdText: string },
    config: IModelConfig,
  ) => ipcRenderer.invoke("analyze-resume", input, config),
  minimize: () => ipcRenderer.send("window-min"),
  close: () => ipcRenderer.send("window-close"),
});

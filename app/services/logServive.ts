type LogLevel = "debug" | "info" | "warn" | "error";

class ModuleLogger {
  private moduleName: string;
  constructor(name: string) {
    this.moduleName = name;
  }

  /**
   * 打印日志消息
   * @param level 日志级别
   * @param args 日志消息参数
   */
  private print(level: LogLevel, ...args: unknown[]) {
    const time = new Date().toLocaleString();
    const prefix = `[${time}] [${level.toUpperCase()}] [${this.moduleName}]`;
    switch (level) {
      case "debug":
        return console.debug(prefix, ...args);
      case "info":
        return console.info(prefix, ...args);
      case "warn":
        return console.warn(prefix, ...args);
      case "error":
        return console.error(prefix, ...args);
    }
  }

  debug(...args: unknown[]) {
    this.print("debug", ...args);
  }
  info(...args: unknown[]) {
    this.print("info", ...args);
  }
  warn(...args: unknown[]) {
    this.print("warn", ...args);
  }
  error(...args: unknown[]) {
    this.print("error", ...args);
  }
}

// 给文件解析服务单独生成日志实例
export const fileLogger = new ModuleLogger("FileService");
// 后续简历分析服务也可以新增
export const analyzeLogger = new ModuleLogger("AnalyzeService");

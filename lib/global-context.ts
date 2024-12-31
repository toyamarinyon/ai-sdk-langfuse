import type { LangfuseExporter } from "langfuse-vercel";

// declare global {
//   var langfuseExporter: LangfuseExporter;
// }
//
interface GlobalContext {
  langfuseExporter: LangfuseExporter;
}
const _global = globalThis as unknown as GlobalContext;

export function setLangfuseExporter(langfuseExporter: LangfuseExporter) {
  _global.langfuseExporter = langfuseExporter;
}

export function getLangfuseExporter() {
  return _global.langfuseExporter;
}

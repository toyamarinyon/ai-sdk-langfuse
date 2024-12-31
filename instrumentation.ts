import { registerOTel } from "@vercel/otel";
import { LangfuseExporter } from "langfuse-vercel";
import { setLangfuseExporter } from "./lib/global-context";

export async function register() {
  const langfuseExporter = new LangfuseExporter({
    debug: true,
    flushInterval: Number.parseInt(
      process.env.LANGFUSE_FLUSH_INTERVAL ?? "1000",
    ),
  });
  setLangfuseExporter(langfuseExporter);
  registerOTel({
    serviceName: "langfuse-vercel-ai-nextjs-example",
    traceExporter: langfuseExporter,
  });
}

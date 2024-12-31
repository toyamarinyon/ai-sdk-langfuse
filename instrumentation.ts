import { registerOTel } from "@vercel/otel";
import { LangfuseExporter } from "langfuse-vercel";

export async function register() {
  registerOTel({
    serviceName: "langfuse-vercel-ai-nextjs-example",
    traceExporter: new LangfuseExporter({
      debug: true,
      flushInterval: Number.parseInt(
        process.env.LANGFUSE_FLUSH_INTERVAL ?? "1000",
      ),
    }),
  });
}

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { after } from "next/server";

const otelBspScheduleDelay = Number.parseInt(
  process.env.OTEL_BSP_SCHEDULE_DELAY ?? "5000",
);
const langfuseFlushInterval = Number.parseInt(
  process.env.LANGFUSE_FLUSH_INTERVAL ?? "1000",
);
const waitForFlush = new Promise((resolve) =>
  setTimeout(resolve, otelBspScheduleDelay + langfuseFlushInterval),
);
export async function POST(req: Request) {
  const { prompt } = await req.json();
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt,
    maxTokens: 10,
    experimental_telemetry: {
      isEnabled: true,
      functionId: "local-function-id",
      metadata: { example: "value" },
    },
  });
  after(waitForFlush);
  return Response.json({ text });
}

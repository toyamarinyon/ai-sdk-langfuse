import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { LangfuseExporter } from "langfuse-vercel";
import { after } from "next/server";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
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
  console.log(LangfuseExporter.langfuse);
  return Response.json({ text });
}

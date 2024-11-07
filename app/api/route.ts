import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export async function POST(req: Request) {
  const { prompt } = await req.json();
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt,
    maxTokens: 100,
    experimental_telemetry: {
      isEnabled: true,
      functionId: "example-function-id",
      metadata: { example: "value" },
    },
  });
  await sleep(1000 * 10);
  return Response.json({ text });
}

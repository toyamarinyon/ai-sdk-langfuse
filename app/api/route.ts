import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

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
  return Response.json({ text });
}

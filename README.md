# Next.js + Vercel AI SDK + Langfuse Integration Example

A production-ready example demonstrating how to instrument a Next.js application with Langfuse telemetry while deployed on Vercel, using the Vercel AI SDK.

## Overview

This repository provides a working solution for deploying a Langfuse-instrumented Next.js application on Vercel's serverless environment. While Langfuse offers a sample Next.js application using the Vercel AI SDK, deploying it on Vercel requires specific adaptations due to the platform's serverless architecture. This repository implements and documents those necessary modifications.

## Understanding Telemetry Data Flow

When collecting telemetry data in your Next.js application using `@vercel/otel`, `vercel-langfuse`, and `ai` packages, the data passes through two sequential delay stages:

1. Application to LangfuseExporter delay
   - Managed by `@vercel/otel`
   - Configured via `OTEL_BSP_SCHEDULE_DELAY` environment variable

2. LangfuseExporter to Langfuse host delay
   - Managed by Langfuse
   - Configured via `flushInterval` constructor parameter

These delays must be accounted for in server actions, route handlers, and other asynchronous operations to ensure complete telemetry data collection and transmission.

## Implementation Details

This repository implements the following solution for reliable telemetry collection on Vercel:

1. Configure Langfuse's flush interval using the `LANGFUSE_FLUSH_INTERVAL` environment variable

2. Implement a helper function to manage both delay stages:

    ```typescript
    // lib/wait-for-flush.ts

    // type safety for environment variables
    const otelBspScheduleDelay = Number.parseInt(
      process.env.OTEL_BSP_SCHEDULE_DELAY ?? "5000",
    );
    const langfuseFlushInterval = Number.parseInt(
      process.env.LANGFUSE_FLUSH_INTERVAL ?? "1000",
    );

    // wait for both delay stages
    export const waitForFlush = new Promise((resolve) =>
      setTimeout(resolve, otelBspScheduleDelay + langfuseFlushInterval),
    );
    ```

3. Use the helper function in server actions, route handlers, and other asynchronous operations:

    ```typescript
    import { waitForFlush } from "../../lib/wait-for-flush";
    import { openai } from "@ai-sdk/openai";
    import { generateText } from "ai";
    import { after } from "next/server";

    export async function POST(req: Request) {
      const { prompt } = await req.json();
      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        prompt,
        maxTokens: 10,
        experimental_telemetry: {
          isEnabled: true,
          functionId: "some-function-id",
          metadata: { example: "value" },
        },
      });
      after(waitForFlush);
      return Response.json({ text });
    }
    ```

This implementation ensures reliable telemetry collection in Vercel's serverless environment while maintaining application performance.

## Getting Started

1. Clone this repository
1. Deploy to Vercel
1. Configure the following environment variables in your Vercel project:

   Name | Value
   -----|-------
   `OTEL_BSP_SCHEDULE_DELAY`|`5000`
   `LANGFUSE_FLUSH_INTERVAL`|`1000`
   `OPENAI_API_KEY`|Your OpenAI API key
   `LANGFUSE_BASEURL`|Your Langfuse base URL
   `LANGFUSE_PUBLIC_KEY`|Your Langfuse public key
   `LANGFUSE_SECRET_KEY`|Your Langfuse secret key
1. Redeploy to set the environment variables
1. Test the application by sending a POST request to `/api` with a JSON body containing a `prompt` field

    ```sh
     curl -X POST -H "Content-Type: application/json" -d '{"prompt":"hello"}' YOUR_VERCEL_URL/api
     ```
1. Check the Langfuse dashboard for telemetry data

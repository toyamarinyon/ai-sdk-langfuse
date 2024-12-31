import { trace, TraceAPI } from "@opentelemetry/api";
import Langfuse from "langfuse";

export async function POST() {
  console.log(_global);
  const tracer = trace.getTracer("ai");
  console.log(tracer);
  return Response.json({ hello: "world" });
}

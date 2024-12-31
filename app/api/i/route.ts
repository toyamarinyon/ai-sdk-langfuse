import { globalTest } from "@/instrumentation";

export function GET() {
  console.log(_global);
  console.log(globalTest);
  return Response.json({ hello: "world" });
}

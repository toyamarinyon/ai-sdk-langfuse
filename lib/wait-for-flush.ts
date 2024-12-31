const otelBspScheduleDelay = Number.parseInt(
  process.env.OTEL_BSP_SCHEDULE_DELAY ?? "5000",
);
const langfuseFlushInterval = Number.parseInt(
  process.env.LANGFUSE_FLUSH_INTERVAL ?? "1000",
);
export const waitForFlush = new Promise((resolve) =>
  setTimeout(resolve, otelBspScheduleDelay + langfuseFlushInterval),
);

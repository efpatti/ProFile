// Simple environment-aware logger
const isDev = process.env.NODE_ENV !== "production";

type Level = "log" | "warn" | "error" | "info";

function build(level: Level) {
 return (...args: unknown[]) => {
  if (!isDev && level === "log") return; // suppress verbose logs in prod
  // eslint-disable-next-line no-console
  console[level]("[App]", ...args);
 };
}

export const logger = {
 log: build("log"),
 info: build("info"),
 warn: build("warn"),
 error: build("error"),
};

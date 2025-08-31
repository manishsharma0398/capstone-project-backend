import type { CorsOptions } from "cors";

const whitelist: Array<string> = [
  "http://localhost:3000",
  "localhost:3000",
  "http://127.0.0.1:3000",
  "127.0.0.1:3000",
];

export const corsOptions: CorsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, origin?: boolean) => void
  ) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

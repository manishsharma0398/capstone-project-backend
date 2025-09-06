import type { CorsOptions } from "cors";

const allowedLocalPorts: Array<number> = [8000, 3000];

const generateWishlist = (ports: number[]): string[] => {
  const hosts = ["localhost", "127.0.0.1"];
  const protocols = ["http://", ""]; // with and without protocol

  return ports.flatMap((port) =>
    hosts.flatMap((host) => protocols.map((proto) => `${proto}${host}:${port}`))
  );
};

const whitelist: Array<string> = generateWishlist(allowedLocalPorts);

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

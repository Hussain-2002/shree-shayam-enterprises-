import { cpSync, existsSync, rmSync } from "node:fs";

if (!existsSync("out")) {
  console.error("Next.js did not create the out folder.");
  process.exit(1);
}

rmSync("dist", { recursive: true, force: true });
cpSync("out", "dist", { recursive: true });

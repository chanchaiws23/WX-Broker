import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { prisma as defaultPrisma } from "./lib/prisma";
import { createAuthRoutes } from "./routes/auth";
import { createBrokerRoutes } from "./routes/brokers";

type AppPrisma = typeof defaultPrisma;

export function createApp({ prisma = defaultPrisma as AppPrisma } = {}) {
  const app = express();

  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ ok: true, service: "woxa-broker-api" });
  });

  app.use("/api", createAuthRoutes(prisma));
  app.use("/api/brokers", createBrokerRoutes(prisma));

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found", code: "NOT_FOUND" });
  });

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled API error:", error);
    res.status(500).json({ error: "Internal server error", code: "INTERNAL_SERVER_ERROR" });
  });

  return app;
}

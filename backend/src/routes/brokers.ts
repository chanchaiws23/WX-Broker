import { Router } from "express";
import { prisma as defaultPrisma } from "../lib/prisma";
import { z } from "zod";
import { getSessionFromRequest } from "../lib/auth";

type AppPrisma = typeof defaultPrisma;

const brokerTypes = ["cfd", "bond", "stock", "crypto"] as const;

const brokerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z.string().trim().toLowerCase().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens only"),
  description: z.string().trim().min(1, "Description is required"),
  logoUrl: z.string().trim().url("Logo URL must be a valid URL"),
  website: z.string().trim().url("Website must be a valid URL"),
  brokerType: z.enum(brokerTypes),
});

const querySchema = z.object({
  search: z.string().trim().optional().default(""),
  type: z.enum([...brokerTypes, "all"]).optional().default("all"),
});

function normalizeBrokerPayload(body: unknown) {
  if (!body || typeof body !== "object") return body;
  const payload = body as Record<string, unknown>;
  return {
    ...payload,
    logoUrl: payload.logoUrl ?? payload.logo_url,
    brokerType: payload.brokerType ?? payload.broker_type,
  };
}

function serializeBroker<T extends { logoUrl: string; brokerType: string }>(broker: T) {
  return {
    ...broker,
    logo_url: broker.logoUrl,
    broker_type: broker.brokerType,
  };
}

export function createBrokerRoutes(prisma: AppPrisma = defaultPrisma) {
  const router = Router();

  router.get("/", async (req, res) => {
  try {
    const result = querySchema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({ error: "Invalid broker type", code: "VALIDATION_ERROR" });
      return;
    }

    const { search, type } = result.data;
    const where: any = {};
    if (search) where.name = { contains: search, mode: "insensitive" };
    if (type && type !== "all") where.brokerType = type;

    const brokers = await prisma.broker.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ brokers: brokers.map(serializeBroker) });
  } catch (error) {
    console.error("Get brokers error:", error);
    res.status(500).json({ error: "Internal server error", code: "INTERNAL_SERVER_ERROR" });
  }
});

  router.post("/", async (req, res) => {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      res.status(401).json({ error: "Unauthorized", code: "UNAUTHORIZED" });
      return;
    }

    const result = brokerSchema.safeParse(normalizeBrokerPayload(req.body));
    if (!result.success) {
      res.status(400).json({ error: result.error.errors[0].message, code: "VALIDATION_ERROR" });
      return;
    }

    const { name, slug, description, logoUrl, website, brokerType } = result.data;
    const existingBroker = await prisma.broker.findUnique({ where: { slug } });
    if (existingBroker) {
      res.status(409).json({ error: "Slug already exists", code: "SLUG_EXISTS" });
      return;
    }

    const broker = await prisma.broker.create({
      data: { name, slug, description, logoUrl, website, brokerType },
    });

    res.status(201).json({ message: "Broker created successfully", broker: serializeBroker(broker) });
  } catch (error) {
    console.error("Create broker error:", error);
    res.status(500).json({ error: "Internal server error", code: "INTERNAL_SERVER_ERROR" });
  }
});

  router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const broker = await prisma.broker.findUnique({ where: { slug } });
    if (!broker) {
      res.status(404).json({ error: "Broker not found", code: "BROKER_NOT_FOUND" });
      return;
    }
    res.status(200).json({ broker: serializeBroker(broker) });
  } catch (error) {
    console.error("Get broker error:", error);
    res.status(500).json({ error: "Internal server error", code: "INTERNAL_SERVER_ERROR" });
  }
});

  return router;
}

export default createBrokerRoutes();

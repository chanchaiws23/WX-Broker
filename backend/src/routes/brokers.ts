import { Router } from "express";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { getSessionFromRequest } from "../lib/auth";

const router = Router();

const brokerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens only"),
  description: z.string().min(1, "Description is required"),
  logoUrl: z.string().url("Logo URL must be a valid URL"),
  website: z.string().url("Website must be a valid URL"),
  brokerType: z.enum(["cfd", "bond", "stock", "crypto"]),
});

router.get("/", async (req, res) => {
  try {
    const search = (req.query.search as string) || "";
    const type = (req.query.type as string) || "";

    const where: any = {};
    if (search) where.name = { contains: search };
    if (type && type !== "all") where.brokerType = type;

    const brokers = await prisma.broker.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ brokers });
  } catch (error) {
    console.error("Get brokers error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const result = brokerSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.errors[0].message });
      return;
    }

    const { name, slug, description, logoUrl, website, brokerType } = result.data;
    const existingBroker = await prisma.broker.findUnique({ where: { slug } });
    if (existingBroker) {
      res.status(409).json({ error: "Slug already exists" });
      return;
    }

    const broker = await prisma.broker.create({
      data: { name, slug, description, logoUrl, website, brokerType },
    });

    res.status(201).json({ message: "Broker created successfully", broker });
  } catch (error) {
    console.error("Create broker error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const broker = await prisma.broker.findUnique({ where: { slug } });
    if (!broker) {
      res.status(404).json({ error: "Broker not found" });
      return;
    }
    res.status(200).json({ broker });
  } catch (error) {
    console.error("Get broker error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

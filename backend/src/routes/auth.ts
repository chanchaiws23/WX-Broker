import { Router } from "express";
import { prisma as defaultPrisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createToken, getSessionFromRequest, removeTokenCookie, setTokenCookie } from "../lib/auth";

type AppPrisma = typeof defaultPrisma;

const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email address").transform((email) => email.toLowerCase()),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address").transform((email) => email.toLowerCase()),
  password: z.string().min(1, "Password is required"),
});

function publicUser(user: { id: number; fullName: string; email: string; createdAt?: Date; updatedAt?: Date }) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function createAuthRoutes(prisma: AppPrisma = defaultPrisma) {
  const router = Router();

  router.post("/register", async (req, res) => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.errors[0].message, code: "VALIDATION_ERROR" });
      return;
    }

    const { fullName, email, password } = result.data;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: "Email already registered", code: "EMAIL_EXISTS" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { fullName, email, password: hashedPassword },
    });

    res.status(201).json({ message: "User registered successfully", user: publicUser(user) });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error", code: "INTERNAL_SERVER_ERROR" });
  }
});

  router.post("/login", async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.errors[0].message, code: "VALIDATION_ERROR" });
      return;
    }

    const { email, password } = result.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.deletedAt) {
      res.status(401).json({ error: "Invalid email or password", code: "INVALID_CREDENTIALS" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: "Invalid email or password", code: "INVALID_CREDENTIALS" });
      return;
    }

    const token = await createToken({ userId: user.id, email: user.email });
    setTokenCookie(res, token);
    res.status(200).json({ message: "Login successful", token, user: publicUser(user) });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error", code: "INTERNAL_SERVER_ERROR" });
  }
});

  router.get("/me", async (req, res) => {
    const session = await getSessionFromRequest(req);
    if (!session) {
      res.status(401).json({ error: "Unauthorized", code: "UNAUTHORIZED" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user || user.deletedAt) {
      res.status(401).json({ error: "Unauthorized", code: "UNAUTHORIZED" });
      return;
    }

    res.status(200).json({ user: publicUser(user) });
  });

  router.post("/logout", (_req, res) => {
    removeTokenCookie(res);
    res.status(200).json({ message: "Logout successful" });
  });

  return router;
}

export default createAuthRoutes();

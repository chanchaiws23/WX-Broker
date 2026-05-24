import { SignJWT, jwtVerify } from "jose";
import { Request, Response } from "express";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "local-development-jwt-value"
);

const alg = "HS256";

export async function createToken(payload: { userId: number; email: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret, {
      clockTolerance: 60,
    });
    return payload as { userId: number; email: string };
  } catch {
    return null;
  }
}

export async function getSessionFromRequest(req: Request) {
  const header = req.headers.authorization;
  const bearerToken = header?.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : null;
  const token = bearerToken || req.cookies?.token;
  if (!token) return null;
  return verifyToken(token);
}

export function setTokenCookie(res: Response, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7 * 1000,
    path: "/",
  });
}

export function removeTokenCookie(res: Response) {
  res.clearCookie("token", { path: "/" });
}

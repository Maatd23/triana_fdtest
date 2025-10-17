import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function auth(req: Request, res: Response, next: NextFunction) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : "";
  try {
    const payload = jwt.verify(token, env.jwtAccess) as any;
    (req as any).user = { id: payload.id };
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

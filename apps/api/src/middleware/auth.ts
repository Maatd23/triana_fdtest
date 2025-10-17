import { Request, Response, NextFunction } from "express";
import { verifyAccess } from "../utils/jwt";

export function auth(req: Request, res: Response, next: NextFunction) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : "";
  try {
    const payload = verifyAccess(token) as any;
    (req as any).user = { id: payload.id };
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

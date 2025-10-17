import { Request, Response } from "express";
import { prisma } from "../../db/prisma";

export const me = async (req: Request, res: Response) => {
  const id = (req as any).user.id;
  const u = await prisma.user.findUnique({
    where: { id },
    select: { username: true, email: true, emailVerified: true },
  });
  res.json(u);
};

export const list = async (req: Request, res: Response) => {
  const { q, verified } = req.query;
  const where: any = {};
  if (typeof verified !== "undefined")
    where.emailVerified = String(verified) === "true";
  if (q)
    where.OR = [
      { username: { contains: String(q), mode: "insensitive" } },
      { email: { contains: String(q), mode: "insensitive" } },
    ];
  const users = await prisma.user.findMany({
    where,
    select: { id: true, username: true, email: true, emailVerified: true },
    orderBy: { username: "asc" },
  });
  res.json(users);
};

import { prisma } from '../../db/prisma';

export async function getMe(userId: string) {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true, email: true, emailVerified: true },
  });
  return u;
}

export type ListUsersParams = { q?: string; verified?: boolean | undefined };

export async function listUsers({ q, verified }: ListUsersParams) {
  const where: any = {};
  if (typeof verified !== 'undefined') where.emailVerified = verified;
  if (q) {
    where.OR = [
      { username: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
    ];
  }
  return prisma.user.findMany({
    where,
    select: { id: true, username: true, email: true, emailVerified: true },
    orderBy: { username: 'asc' },
  });
}

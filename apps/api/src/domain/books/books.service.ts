import { prisma } from "../../db/prisma";
import { z } from "zod";

export const BookCreateDto = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  description: z.string().min(1),
  coverUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  rating: z.number().int().min(1).max(5).optional(),
});

export const BookUpdateDto = BookCreateDto.partial();

export type PublicListParams = {
  author?: string;
  from?: string;
  to?: string;
  rating?: number;
  page?: number;
  limit?: number;
  q?: string;
};

export async function createBook(userId: string, input: unknown) {
  const data = BookCreateDto.parse(input);
  return prisma.book.create({
    data: {
      title: data.title,
      author: data.author,
      description: data.description,
      coverUrl: data.coverUrl,
      rating: data.rating ?? 0,
      uploadedBy: userId,
    },
  });
}

export async function updateBook(id: string, input: unknown) {
  const data = BookUpdateDto.parse(input);
  if (
    typeof data.rating !== "undefined" &&
    (data.rating! < 1 || data.rating! > 5)
  ) {
    throw { status: 400, message: "Rating 1..5" };
  }
  return prisma.book.update({ where: { id }, data });
}

export async function deleteBook(id: string) {
  await prisma.book.delete({ where: { id } });
}

export async function getBook(id: string) {
  const b = await prisma.book.findUnique({ where: { id } });
  if (!b) throw { status: 404, message: "Not found" };
  return b;
}

export async function listAuthBooks() {
  return prisma.book.findMany({ orderBy: { createdAt: "desc" } });
}

export async function listPublicBooks(params: PublicListParams) {
  const { author, from, to, rating, page = 1, limit = 10, q } = params;
  const where: any = {};
  if (author) where.author = { contains: author, mode: "insensitive" };
  if (typeof rating !== "undefined") where.rating = Number(rating);
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }
  if (from || to) {
    where.createdAt = {
      gte: from ? new Date(from) : undefined,
      lte: to ? new Date(to) : undefined,
    };
  }

  const take = Number(limit) || 10;
  const skip = (Number(page) - 1) * take;

  const [items, total] = await Promise.all([
    prisma.book.findMany({ where, orderBy: { createdAt: "desc" }, skip, take }),
    prisma.book.count({ where }),
  ]);

  return { items, total, page: Number(page), pages: Math.ceil(total / take) };
}

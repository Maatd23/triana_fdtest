import { Request, Response } from "express";
import * as books from "./books.service";

export const create = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const book = await books.createBook(userId, req.body);
  return res.status(201).json(book);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const book = await books.updateBook(id, req.body);
  return res.json(book);
};

export const remove = async (req: Request, res: Response) => {
  await books.deleteBook(req.params.id);
  return res.status(204).send();
};

export const get = async (req: Request, res: Response) => {
  const data = await books.getBook(req.params.id);
  return res.json(data);
};

export const listAuth = async (_req: Request, res: Response) => {
  const items = await books.listAuthBooks();
  return res.json(items);
};

export const listPublic = async (req: Request, res: Response) => {
  const params = {
    author: req.query.author ? String(req.query.author) : undefined,
    from: req.query.from ? String(req.query.from) : undefined,
    to: req.query.to ? String(req.query.to) : undefined,
    rating: req.query.rating ? Number(req.query.rating) : undefined,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    q: req.query.q ? String(req.query.q) : undefined,
  };
  const data = await books.listPublicBooks(params);
  return res.json(data);
};

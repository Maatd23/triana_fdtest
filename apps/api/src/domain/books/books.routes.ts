import { Router } from "express";
import { auth } from "../../middleware/auth";
import * as c from "./books.controller";

const r = Router();
r.get("/public", c.listPublic);
r.get("/", auth, c.listAuth);
r.post("/", auth, c.create);
r.get("/:id", auth, c.get);
r.put("/:id", auth, c.update);
r.delete("/:id", auth, c.remove);
export default r;

import { Router } from "express";
import { auth } from "../../middleware/auth";
import * as c from "./users.controller";

const r = Router();
r.get("/me", auth, c.me);
r.get("/", auth, c.list);
export default r;

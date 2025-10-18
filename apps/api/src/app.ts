import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error";
import authRoutes from "./domain/auth/auth.routes";
import userRoutes from "./domain/users/users.routes";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "./config/swagger";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// health
app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
// error handler
app.use(errorHandler);

export default app;

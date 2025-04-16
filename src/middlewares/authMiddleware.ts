import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Coloquei o secret aqui apenas para desenvolvimento
const JWT_SECRET = "AAABBBCCC";

declare module "express-serve-static-core" {
  interface Request {
    userId?: number;
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "Não autorizado" });
    return;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    res.status(401).json({ error: "Token mal formatado." });
    return;
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    req.userId = decoded.userId;
    next();
  } catch (error: unknown) {
    res.status(401).json({ error: "Token inválido." + error });
  }
};

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token eksik" });

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
    const session = await prisma.session.findUnique({ where: { token } });

    if (!session || session.status !== "online") {
      return res.status(401).json({ error: "Oturum geçersiz" });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(500).json({ error: "Token doğrulanamadı" });
  }
};

import { Request, Response, NextFunction } from "express";
import AppError from "../errorHelpers/AppError";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../config/db";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken|| req.headers.authorization;

    if (!accessToken) {
      throw new AppError(403, "No token received");
    }

    const verifiedToken = verifyToken(
      accessToken,
      envVars.JWT_ACCESS_SECRET
    ) as JwtPayload;

    const isUserExist = await prisma.user.findUnique({
      where: { email: verifiedToken.email },
    });

    if (!isUserExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
    }

    // 👉 No role check needed, since all are USER
    req.user = verifiedToken;

    next();
  } catch (error) {
    next(error);
  }
};


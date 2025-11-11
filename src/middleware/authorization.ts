import { Request, Response, NextFunction } from "express";
import { usersAttributes } from "../database/models/users";
import { StatusCodes } from "http-status-codes";
import { decodeToken } from "../helpers";
import userRepo from "../modules/users/repository/userRepo";

interface ExtendedRequest extends Request {
  user: usersAttributes;
}

export const userAuthorization = function (roles: string[]): any {
  return async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];

      if (!token) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ status: StatusCodes.UNAUTHORIZED, message: "Not authorized" });
      }

      const decoded: any = await decodeToken(token);

      const user = await userRepo.findUserByAttributes("id", decoded.id);
      if (!user) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ status: StatusCodes.UNAUTHORIZED, message: "Not authorized" });
      }


      if (!roles.includes(user.role)) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ status: StatusCodes.UNAUTHORIZED, message: "Not authorized" });
      }

      req.user = user;
      next();
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  };
};
import { Request, Response, NextFunction } from "express"
import userRepo from "../modules/users/repository/userRepo";
import { StatusCodes } from "http-status-codes"
import { comparePassword } from "../helpers";
import { ExtendRequest } from "../types";
import Joi from "joi";


const validation =
    (schema: Joi.ObjectSchema | Joi.ArraySchema) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { error } = schema.validate(req.body, { abortEarly: false });

                if (error) {
                    throw new Error(
                        error.details
                            .map((detail) => detail.message.replace(/"/g, ""))
                            .join(", ")
                    );
                }
                return next();
            } catch (error:any) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ status: StatusCodes.BAD_REQUEST, message: error.message });
            }
        };


const isUserExist = async (req: Request, res: Response, next: NextFunction): Promise<void | any> => {
    try {
        if (!req.body.username || !req.body.email || !req.body.password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.BAD_REQUEST,
                error: "Username, email, and password are required"
            })
        }

        const usernameExists = await userRepo.findUserByAttributes("username", req.body.username)
        if (usernameExists) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.BAD_REQUEST,
                error: "user already exist"
            })
        }
        const emailExists = await userRepo.findUserByAttributes("email", req.body.email)

        if (emailExists) {
            return res.status(StatusCodes.CONFLICT).json({
                status: StatusCodes.CONFLICT,
                error: "email already exist"
            })
        }

        return next();
    } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        })
    }
}

const verifyUser = async (req: ExtendRequest, res: Response, next: NextFunction): Promise<void | any> => {
    try {
        const user = await userRepo.findUserByAttributes("email", req.body.email);
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: StatusCodes.UNAUTHORIZED,
                error: "Invalid credential"
            })
        }
        const isValidPassword = await comparePassword(req.body.password, user.password)
        if (!isValidPassword) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: StatusCodes.UNAUTHORIZED,
                error: "Invalid credential"
            })
        }
        req.user = user
        return next();
    } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error: error.message
        })
    }
}

export {
    isUserExist,
    verifyUser,
    validation
}
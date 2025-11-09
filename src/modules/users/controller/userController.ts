import userRepo from "../repository/userRepo";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { generateToken } from "../../../helpers/index";

const registerUser = async (req:Request, res:Response): Promise<void>=>{
    try{
        const register = await userRepo.createUser(req.body);
        res.status(StatusCodes.CREATED).json({
            message: "Account created successfully",
            data: {user: register}
        })
    }catch(error: any){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        })
    }
}

const loginUser = async(req: any, res:Response)=> {
    try{
        const token = generateToken(req.user.id)
        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: "Logged in Successfully",
            data: {token}
        })
    }catch(error: any){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error: error.message
        })
    }
}

export default {
    registerUser,
    loginUser
}
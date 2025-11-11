import { Request, Response, NextFunction } from "express"
import userRepo from "../modules/users/repository/userRepo";
import { StatusCodes } from "http-status-codes"
import { comparePassword } from "../helpers";
import { ExtendRequest } from "../types";
import Joi from "joi";
import productRepo from "../modules/products/repository/productRepo";
import { Op } from "sequelize";
import db from "../database/models";
import orderRepo from "../modules/orders/repository/orderRepo";


const validation =
    (schema: Joi.ObjectSchema | Joi.ArraySchema) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { error } = schema.validate(req.body, { abortEarly: false });

                if (error) {
                    throw new Error(
                        error.details.map((detail) => detail.message.replace(/"/g, "")).join(", ")
                    );
                }
                return next();
            } catch (error: any) {
                res.status(StatusCodes.BAD_REQUEST).json({ 
                    status:StatusCodes.BAD_REQUEST,
                    success:false,
                    error: error.message
                });
            }
        };


const isUserExist = async (req: Request, res: Response, next: NextFunction): Promise<void | any> => {
    try {
        if (!req.body.username || !req.body.email || !req.body.password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status:StatusCodes.BAD_REQUEST,
                success: false,
                error: "Username, email, and password are required"
            })
        }

        const usernameExists = await userRepo.findUserByAttributes("username", req.body.username)
        if (usernameExists) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status:StatusCodes.BAD_REQUEST,
                success: false,
                error: "username already exist"
            })
        }
        const emailExists = await userRepo.findUserByAttributes("email", req.body.email)

        if (emailExists) {
            return res.status(StatusCodes.CONFLICT).json({
                status:StatusCodes.CONFLICT,
                success:false,
                error: "email already exist"
            })
        }

        return next();
    } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status:StatusCodes.INTERNAL_SERVER_ERROR,
            success:false,
            message: error.message
        })
    }
}

const verifyUser = async (req: ExtendRequest, res: Response, next: NextFunction): Promise<void | any> => {
    try {
        const user = await userRepo.findUserByAttributes("email", req.body.email);
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status:StatusCodes.UNAUTHORIZED,
                success:false,
                error: "Invalid credential"
            })
        }
        const isValidPassword = await comparePassword(req.body.password, user.password)
        if (!isValidPassword) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status:StatusCodes.UNAUTHORIZED,
                success: false,
                error: "Invalid credential"
            })
        }
        req.user = user
        return next();
    } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            success:false,
            error: error.message
        })
    }
}

const isProductExist = async (req: any, res: Response, next: NextFunction) => {
    try {

        const productId = req.params.productId;

        if (!productId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status:StatusCodes.BAD_REQUEST,
                success: false,
                message: "Product ID is required"
            });
        }

        const product = await productRepo.findProductByAttributes("id", productId);

        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status:StatusCodes.NOT_FOUND,
                success:false,
                message: "Product not found"
            });
        }

        if (product.userId !== req.user.id) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status:StatusCodes.FORBIDDEN,
                success:false,
                message: "You do not have permission to update this product"
            });
        }

        req.product = product;
        next();
    } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: error.message,
        });
    }
};
const isPaginated = (req: ExtendRequest, res: Response, next: NextFunction): any => {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;

    req.pagination = {
        limit,
        page,
        offset: (page - 1) * limit
    };

    next();
};

const isProductExistById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        const product = await productRepo.findProductByAttributes("id", req.params.productId);
        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: StatusCodes.NOT_FOUND,
                success:false,
                message: "product not  found."
            });
        }
        (req as ExtendRequest).product = product;

        next();
    } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            success:false,
            message: error.message,
        });
    }
};
const isSearchFiltered = async (
    req: ExtendRequest,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { name, category, description, price } = req.query;
    const where: any = {};
    const orConditions: any[] = [];

    if (name) orConditions.push({ name: { [Op.iLike]: `%${name}%` } });
    if (category) orConditions.push({ category });
    if (description) orConditions.push({ description: { [Op.iLike]: `%${description}%` } });
    if (orConditions.length > 0) {
        where[Op.or] = orConditions;
    }

    try {
        const product = await db.Products.findOne({ where });

        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: StatusCodes.NOT_FOUND,
                success:false,
                message: 'No product matches the given search criteria',
            });
        }    
    req.searchQuery = { where };
        next();
    } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            success:false,
            message: error.message,
        });
    }
};


const validateOrderItems = async (req: ExtendRequest, res: Response, next: NextFunction) => {
  const items: { productId: string; quantity: number }[] = req.body;
  const transaction = await db.sequelize.transaction();
  try {
    const validatedProducts = [];

    for (const { productId, quantity } of items) {
      const product = await db.Products.findByPk(productId, { transaction });
      if (!product) {
        await transaction.rollback();
        return res.status(StatusCodes.NOT_FOUND).json({
          status: StatusCodes.NOT_FOUND,
          message: `Product with ID ${productId} not found.`,
        });
      }

      if (product.stock < quantity) {
        await transaction.rollback();
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: `Insufficient stock for product ${product.name}.`,
        });
      }

      validatedProducts.push({ product, quantity });
    }
    await transaction.commit();
    console.log(">>>>>>>>>>>>>>>>>>>>>",req.validatedProducts)
    req.validatedProducts = validatedProducts;
    next();
  } catch (error: any) {
    await transaction.rollback();
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const isUserOrdersExist = async (req: ExtendRequest, res: Response, next: NextFunction) => {
    try {
      const orders:any = await orderRepo.userFindAllOrders(req.user.id);
  
      if (!orders || orders.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "No orders exist for this user.",
          data: {}
        });
      }
      req.orders = orders;
      next();
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error.",
        error: error.message
      });
    }
  };
export {
    isUserExist,
    verifyUser,
    validation,
    isProductExist,
    isPaginated,
    isProductExistById,
    isSearchFiltered,
    validateOrderItems,
    isUserOrdersExist
}
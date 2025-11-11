import { StatusCodes } from "http-status-codes";
import db from "../../../database/models";
import { ExtendRequest } from "../../../types";
import { Response } from "express";

const placeOrder = async (req: ExtendRequest, res: Response) => {
    const userId = req.user.id;
    const validatedItems = req.validatedProducts;
    const transaction = await db.sequelize.transaction();
  
    try {
      let totalPrice = 0;
      const orderProducts = [];
  
      for (const { product, quantity } of validatedItems) {
        totalPrice += parseFloat(product.price.toString()) * quantity;
        product.stock -= quantity;
        await product.save({ transaction });
  
        orderProducts.push({ productId: product.id, quantity });
      }
  
      const order = await db.Orders.create(
        {
          userId,
          description: `Order for ${orderProducts.length} items`,
          totalPrice,
          status: 'pending',
        },
        { transaction }
      );
  
      for (const op of orderProducts) {
        await db.OrderProducts.create(
          {
            orderId: order.id,
            productId: op.productId,
            quantity: op.quantity,
          },
          { transaction }
        );
      }
  
      await transaction.commit();
  
      return res.status(StatusCodes.CREATED).json({
        orderId: order.id,
        status: order.status,
        totalPrice: order.totalPrice,
        products: orderProducts,
      });
    } catch (error: any) {
      await transaction.rollback();
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  };

  const userGetOrderHistory = async (req: ExtendRequest, res: Response) => {
    try {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Order history returned successfully.",
        orders: req.orders
      });
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error.",
        error: error.message
      });
    }
  };
  export default {
    placeOrder,
    userGetOrderHistory
  }
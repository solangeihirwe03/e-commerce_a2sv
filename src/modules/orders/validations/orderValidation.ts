import Joi from 'joi';

export const placeOrderSchema = Joi.array()
  .items(
    Joi.object({
      productId: Joi.string() .guid({ version: 'uuidv4' }) .required().messages({
          'string.guid': 'Invalid UUID format for productId',
          'any.required': 'productId is required',
        }),
      quantity: Joi.number().integer().min(1).required() .messages({
          'number.base': 'Quantity must be a number',
          'number.min': 'Quantity must be at least 1',
          'any.required': 'Quantity is required',
        }),
    })
  ).min(1).required().messages({
    'array.base': 'Order must be an array of products',
    'array.min': 'Order must contain at least one product',
  });
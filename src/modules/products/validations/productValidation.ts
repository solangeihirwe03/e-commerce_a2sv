import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
      "string.base": "Name must be a string",
      "string.empty": "Name cannot be empty",
      "string.min": "Name must be at least 3 characters",
      "string.max": "Name must be at most 100 characters",
      "any.required": "Name is required"
    }),

  description: Joi.string().min(10).required().messages({
      "string.base": "Description must be a string",
      "string.empty": "Description cannot be empty",
      "string.min": "Description must be at least 10 characters",
      "any.required": "Description is required"
    }),

  price: Joi.number().positive().required().messages({
      "number.base": "Price must be a number",
      "number.positive": "Price must be greater than 0",
      "any.required": "Price is required"
    }),

  stock: Joi.number().integer().min(0).required().messages({
      "number.base": "Stock must be a number",
      "number.integer": "Stock must be an integer",
      "number.min": "Stock cannot be negative",
      "any.required": "Stock is required"
    }),

  category: Joi.string().required().messages({
      "string.base": "category must be a string",
      "string.empty": "category cannot be empty",
      "any.required": "category is required"
    })
});

export const productUpdateSchema = Joi.object({
  name: Joi.string().min(1).messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be a non-empty string"
  }),

  description: Joi.string().min(1).messages({
    "string.base": "Description must be a string",
    "string.empty": "Description cannot be empty",
    "string.min": "Description must be a non-empty string"
  }),

  price: Joi.number().positive().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be a positive number"
  }),

  stock: Joi.number().integer().min(0).messages({
    "number.base": "Stock must be a number",
    "number.integer": "Stock must be an integer",
    "number.min": "Stock must be a non-negative integer"
  }),

  category: Joi.string().min(1).messages({
    "string.base": "Category must be a string",
    "string.empty": "Category cannot be empty",
    "string.min": "Category must be a non-empty string"
  })
});
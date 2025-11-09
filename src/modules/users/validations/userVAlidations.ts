import Joi from "joi";
interface User {
    username: string;
    email: string;
    password: string;
}

const userSchema = Joi.object({
    username: Joi.string().alphanum().required().messages({
        "string.base": "Username should be a type of text",
        "string.alphanum": "Username must contain only letters and numbers",
        "string.empty": "Username cannot be an empty field",
        "any.required": "Username is required"
    }),

    email: Joi.string().email().required().messages({
        "string.base": "Email should be a type of text",
        "string.email": "Email must be a valid email",
        "string.empty": "Email cannot be an empty field",
        "any.required": "Email is required"
    }),

    password: Joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$")).required().messages({
        "string.pattern.base": "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
        "string.empty": "Password cannot be an empty field",
        "any.required": "Password is required"
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.base": "Email should be a type of text",
        "string.email": "Email must be a valid email",
        "string.empty": "Email cannot be an empty field",
        "any.required": "Email is required"
    }),

    password: Joi.string().required().messages({
        "string.base": "Password should be a type of text",
        "string.empty": "Password cannot be an empty field",
        "any.required": "Password is required"
    })
});


export {
    userSchema,
    loginSchema
}

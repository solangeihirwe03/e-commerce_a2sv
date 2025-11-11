import { Router } from "express";
import { userAuthorization } from "../middleware/authorization";
import upload from "../helpers/multer";
import productController from "../modules/products/controller/productController";
import { isProductExist, validation, isPaginated, isProductExistById, isSearchFiltered } from "../middleware/validation";
import { createProductSchema, productUpdateSchema } from "../modules/products/validations/productValidation";


const router: Router = Router();
router.post(
  "/create-product",
  userAuthorization(["admin"]),
  upload.single("images"),
  validation(createProductSchema),
  productController.createProduct
);

router.put(
  "/admin-update-product/:productId",
  userAuthorization(["admin"]),
  isProductExist,
  upload.single("images"),
  validation(productUpdateSchema),
  productController.userUpdateProduct
);

router.get(
  "/user-get-products",
  isPaginated,
  productController.userGetAllProducts
);

router.get(
  "/user-get-product-by-id/:productId",
  isProductExistById,
  productController.userGetProduct
);

router.delete(
  "/delete-product/:productId",
  userAuthorization(["admin"]),
  isProductExistById,
  productController.DeleteProduct
);

router.get(
  "/search-products",
  isSearchFiltered,
  isPaginated,
  productController.userSearchProducts
);

export default router
import { StatusCodes } from "http-status-codes";
import productRepo from "../repository/productRepo";
import { ExtendRequest } from "../../../types";
import { Response } from "express";
import uploadImages from "../../../helpers/uploadImage";
import db from "../../../database/models";

const createProduct = async (req: ExtendRequest, res: Response) => {
  try {
    let imageUrl;
    if (req.file) {
      const upload = await uploadImages(req.file)
      imageUrl = upload.secure_url
    }
    const productData = {
      ...req.body,
      userId: req.user.id,
      images: imageUrl,
    };
    const product = await productRepo.createProduct(productData);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Product created successfully",
      data: { product },
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

const userUpdateProduct = async (req: ExtendRequest, res: Response): Promise<any>=> {
  try {
    const product = req.product
        const updatedProductData = {
            ...product,
            ...req.body
        }
        if (req.file) {
            const upload = await uploadImages(req.file);
            updatedProductData.imageUrl = upload.secure_url;
        }
        const updateProduct = await productRepo.findProductAndUpdate("id",req.params.productId, updatedProductData)

        return res.status(StatusCodes.OK).json({
            status:StatusCodes.OK,
            message: "Product updated successfullty!",
            updateProduct
        })
  } catch (error: any) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const userGetAllProducts = async (req: ExtendRequest, res: Response):Promise<any> => {
  try {
    const { limit, page, offset } = req.pagination!;

    const products = await productRepo.userGetProducts(limit, offset);
    if (products.count === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
            Success: false,
            Message: 'No products available at the moment. Please check back later.',
            Object: [],
            PageNumber: page,
            PageSize: limit,
            TotalSize: 0,
            Errors: []
          });
    }

    return res.status(StatusCodes.OK).json({
      Success: true,
      Message: 'All products have been fetched successfully',
      Object: products.rows,
      PageNumber: page,
      PageSize: limit,
      TotalSize: products.count,
      Errors: []
    });
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message
    });
  }
};

const userGetProduct = async (req: ExtendRequest, res: Response) => {
  try {
    const product = req.product
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Products is fetched successfully.",
      data: product
    });
  } catch (error:any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

export const DeleteProduct = async (
  req: ExtendRequest,
  res: Response
): Promise<Response> => {
  try {
    const productId = req.product.id;

    await productRepo.deleteProductById(productId);

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const userSearchProducts = async (
  req: ExtendRequest,
  res: Response
): Promise<Response> => {
  try {
    const { limit, page, offset } = req.pagination!;
    const searchQuery = req.searchQuery;

    const products = await productRepo.userSearchProducts(searchQuery, limit, offset);

    const totalPages = Math.ceil(products.count / limit);
    const nextPage = page < totalPages ? page + 1 : undefined;
    const previousPage = page > 1 ? page - 1 : undefined;

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'All products have been fetched successfully',
      data: {
        products: products.rows,
        nextPage,
        currentPage: page,
        previousPage,
        limit,
      },
    });
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
}




export default {
  createProduct,
  userGetAllProducts,
  userUpdateProduct,
  userGetProduct,
  DeleteProduct,
  userSearchProducts
}

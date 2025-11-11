import Products from "../../../database/models/products";
import { Op } from "sequelize";
import db from "../../../database/models";
import sequelizeConnection from "../../../database/config/db.config";

const createProduct = async (body: any) => {
  return await Products.create(body);
};

const findProductByAttributes = async (key: string, value: any) => {
  return await Products.findOne({ where: { [key]: value } });
};
const findProductById = async (id: string) => {
  return await Products.findOne({ where: { id } });
};

const findProductAndUpdate = async (
  key: string,
  value: any,
  productData: any
) => {
  await Products.update(
    { ...productData },
    { where: { [key]: value }, returning: true }
  );
  return findProductByAttributes(key,value)
};

const userGetProducts = async (limit: number, offset: number) => {
  const { Products } = db;

  const { rows, count } = await Products.findAndCountAll({
    where: {
      id: {
        [Op.notIn]: sequelizeConnection.literal(`(
            SELECT DISTINCT "productId" FROM "order_products"
          )`)
      }
    },
    limit,
    offset
  });

  return { rows, count };
};

const deleteProductById = async (productId: string) => {
  const product = await findProductById(productId);
  if (product) {
    await db.Products.destroy({ where: { id: productId } });
  }
  return product;
};


const userSearchProducts = async (
  searchQuery: any,
  limit: number,
  offset: number
): Promise<{ rows: any[]; count: number }> => {
  return await db.Products.findAndCountAll({
    ...searchQuery,
    limit,
    offset,
  });
};

const findProductByPK = async (productId: string, transaction: any) => {
  await db.Products.findByPk(productId, { transaction })
}

export default {
  createProduct,
  findProductByAttributes,
  findProductAndUpdate,
  userGetProducts,
  deleteProductById,
  userSearchProducts,
  findProductByPK
}
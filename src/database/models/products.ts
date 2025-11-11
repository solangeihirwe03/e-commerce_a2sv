import { Model, DataTypes, Sequelize } from "sequelize";
import sequelizeConnection from "../config/db.config";
import { IProduct } from "../../types";
import OrderProducts from "./orderProducts";
import Orders from "./orders";
import Users from "./users";


class Products extends Model<IProduct> {
  declare id: string;
  declare name: string;
  declare description?: string;
  declare price: number;
  declare stock: number;
  declare category: string;
  declare images: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare userId: string;

  static associate() {
    Products.belongsTo(Users, {foreignKey: "userId", as:'user'});
    Products.belongsToMany(Orders, {
      through: OrderProducts,
      foreignKey: 'productId',
      otherKey: 'orderId',
      as: 'orders',
    });
     
    
  }
  
}

Products.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      allowNull: false,
      type: DataTypes.DECIMAL(10, 2),
    },
    stock: {
      allowNull: false,
      type: DataTypes.BIGINT,
    },
    category: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    images: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "products",
    modelName: "Products",
    timestamps: true,
  }
);

export default Products;
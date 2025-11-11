import { Model, DataTypes } from 'sequelize';
import sequelizeConnection from '../config/db.config';

class OrderProducts extends Model {
  declare id: string;
  declare orderId: string;
  declare productId: string;
  declare quantity: number;
}

OrderProducts.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: 'order_products',
    modelName: 'OrderProducts',
    timestamps: false,
  }
);

export default OrderProducts;
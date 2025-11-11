import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";
import Users from "./users";
import Products from "./products";
import OrderProducts from "./orderProducts";
import { OrderStatus } from "../../enums";

export interface OrderAttributes {
    id?: string;
    userId: string;
    description: string;
    totalPrice: number;
    orderDate?: Date;
    status?: string;
    // products: {
    //     productId: string;
    //     quantity: number;
    // }[];
    createdAt?: Date;
    updatedAt?: Date;
}

class Orders extends Model<OrderAttributes> implements OrderAttributes {
    declare id: string;
    declare userId: string;
    declare orderDate: Date;
    declare description: string;
    declare totalPrice: number;
    declare status: string;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        Orders.belongsTo(Users, { foreignKey: "userId", as: "user" });
        Orders.belongsToMany(Products, {
            through: OrderProducts,
            foreignKey: 'orderId',
            otherKey: 'productId',
            as: 'products',
        });
    }
}

Orders.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: new DataTypes.UUID,
            allowNull: false
        },
        description: {
            type: new DataTypes.STRING,
            allowNull: false
        },
        totalPrice: {
            type: new DataTypes.STRING,
            allowNull: false
        },
        orderDate: {
            type: new DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        },
        status: {
            type: DataTypes.ENUM(...Object.values(OrderStatus)),
            allowNull: false,
            defaultValue: OrderStatus.PENDING,
          },
          
        createdAt: {
            field: "createdAt",
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            field: "updatedAt",
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize: sequelizeConnection,
        tableName: "orders",
        timestamps: true,
        modelName: "Orders"
    }
);

export default Orders

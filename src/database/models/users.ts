import { Model, DataTypes, Optional } from "sequelize";
import sequelizeConnection from "../config/db.config";
import { hashPassword } from "../../helpers";

export interface usersAttributes {
    id: string;
    username: string;
    email: string;
    password: string;
    role?:string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UsersCreationAttributes extends Optional<usersAttributes, "id"> { }
class Users extends Model<usersAttributes, UsersCreationAttributes> implements usersAttributes {
    declare id: string;
    declare username: string;
    declare email: string;
    declare password: string;
    declare createdAt: Date;
    declare updatedAt: Date;
}

Users.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(128),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        role: {
            type: DataTypes.STRING(128),
            allowNull: true,
            defaultValue:"user"
        },
        createdAt: {
            type: DataTypes.DATE,
            field: "createdAt",
            defaultValue: DataTypes.NOW,
            allowNull: true
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: "createdAt",
            defaultValue: DataTypes.NOW,
            allowNull: true
        },
    },
    {
        sequelize: sequelizeConnection,
        tableName: "users",
        timestamps: true,
        modelName: "Users",
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    user.password = await hashPassword(user.password)
                }
            }
        }
    }
);

export default Users
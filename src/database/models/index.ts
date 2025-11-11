import OrderProducts from "./orderProducts";
import Orders from "./orders";
import Products from "./products";
import Users from "./users";
import sequelizeConnection from '../config/db.config';


const db = {
    sequelize: sequelizeConnection,
    Products,
    Users,
    OrderProducts,
    Orders
};

Object.values(db).forEach((model: any) => {
    if (model.associate) {
        model.associate(db)
    }
})

export default db
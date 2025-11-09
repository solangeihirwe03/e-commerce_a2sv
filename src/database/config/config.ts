import { config } from "dotenv";
import { Sequelize } from "sequelize";

config();

const commonDatabaseConfig = {
    dialect: "postgres"
}

const sequelizeConfig: any = {
    development : {
        ...commonDatabaseConfig,
        url: process.env.DATABASE_URL_DEV,
    },
    prod: {
        ...commonDatabaseConfig,
        url: process.env.DATABASE_URL_PRO,
        dialectOptions: {
            ssl:{
                require: true,
                rejectUnauthorized: false
            }
        }
    }
}

module.exports = sequelizeConfig
// const env = process.env.NODE_ENV || "development";
// const currentConfig = sequelizeConfig[env];
// const sequelize = new Sequelize(currentConfig.url, currentConfig);

// // Check connection
// sequelize.authenticate()
//     .then(() => {
//         console.log("Database connection has been established successfully.");
//     })
//     .catch((err) => {
//         console.error("Unable to connect to the database:", err);
//     });

// export default sequelize;
import { hashPassword } from "../../helpers";
import { v4 as uuidv4 } from "uuid";
import { QueryInterface } from "sequelize";

const userOne = {
  id: uuidv4(),
  createdAt: new Date(),
  updatedAt: new Date(),
  username: "Admin",
  email: "admin@gmail.com",
  password: hashPassword("Password@123"),
  role: "admin",
};

export const up = (queryInterface: QueryInterface) =>
  queryInterface.bulkInsert("users", [
    userOne
  ]);

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.bulkDelete("users", {});
};
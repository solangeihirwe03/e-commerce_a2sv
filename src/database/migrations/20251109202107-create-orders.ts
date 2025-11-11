import { QueryInterface, DataTypes } from "sequelize";

export = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("orders", {
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
        type: DataTypes.STRING,
        allowNull: false
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
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("orders");
  }
};
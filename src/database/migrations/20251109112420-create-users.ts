import { DataTypes, QueryInterface } from "sequelize";

export default {
  up: async(queryInterface:QueryInterface)=>{
    await queryInterface.createTable("users", {
      id:{
        type: new DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      username:{
        type: new DataTypes.STRING(128),
        allowNull: true
      },
      email:{
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      password:{
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      role: {
        type: new DataTypes.STRING(128),
        allowNull: true
      },
      createdAt: {
        allowNull: true,
        type: new DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        allowNull: true,
        type: new DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    })
  },
  down: async(queryInterface: QueryInterface)=>{
    await queryInterface.dropTable("users")
  }
}
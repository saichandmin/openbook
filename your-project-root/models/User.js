import { DataTypes } from "sequelize";
import sequelize from "../config/database"; // Your Sequelize instance

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Unique constraint
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Other fields...
});

export default User;

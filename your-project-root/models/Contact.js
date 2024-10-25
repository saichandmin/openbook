import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database"; // Adjust based on your setup
import User from "./User"; // Adjust the import based on your directory structure

class Contact extends Model {}

Contact.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Unique constraint
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Contact",
    timestamps: true,
    hooks: {
      beforeCreate: (contact) => {
        contact.createdAt = new Date(); // Store in UTC
        contact.updatedAt = new Date(); // Store in UTC
      },
      beforeUpdate: (contact) => {
        contact.updatedAt = new Date(); // Update timestamp to UTC
      },
    },
  }
);

// Define relationships
User.hasMany(Contact, { foreignKey: "userId", onDelete: "CASCADE" });
Contact.belongsTo(User, { foreignKey: "userId" });

export default Contact;

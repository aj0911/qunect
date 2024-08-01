const { Model, DataTypes } = require("sequelize");
const sequelize = require("../Config/database");
const User = require("./UserModel");

class Conversation extends Model {
  //Additional Methods
}

Conversation.init(
  {
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    recieverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Conversation",
    tableName: "conversations",
    timestamps: true,
  }
);

Conversation.belongsTo(User, { foreignKey: "senderId" });
Conversation.belongsTo(User, { foreignKey: "recieverId" });

module.exports = Conversation;

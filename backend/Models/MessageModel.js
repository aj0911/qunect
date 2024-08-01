const { Model, DataTypes } = require("sequelize");
const sequelize = require("../Config/database");
const Conversation = require("./ConversationModel");

class Message extends Model {
  //Additional Methods
}

Message.init(
  {
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Conversation,
        key: "id",
      },
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Message",
    tableName: "messages",
    timestamps: true,
  }
);

Message.belongsTo(Conversation, { foreignKey: "conversationId" });


module.exports = Message;

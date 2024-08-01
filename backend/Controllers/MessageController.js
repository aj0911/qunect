const redis = require("../Config/RedisDB");
const protect = require("../Middlewares/CatchAsyncErrors");
const Conversation = require("../Models/ConversationModel");
const Message = require("../Models/MessageModel");

exports.sendMessage = protect(async (req, res) => {
  const { text, conversationId } = req.body;
  const message = await Message.create({ text, conversationId });
  let messages = await redis.get(`messages:${conversationId}`);
  if (messages) {
    await redis.del(
      `messages:${conversationId}`
    );
  }
  res.status(200).json({
    success: true,
    message: "Message Sent Successfully",
    data: message,
  });
});

exports.getAllMessages = protect(async (req, res, next) => {
  const { conversationId } = req.params;
  let messages = await redis.get(`messages:${conversationId}`);
  if (messages) messages = JSON.parse(messages);
  else {
    messages = await getMessages(conversationId);
    await redis.setex(
      `messages:${conversationId}`,
      3600,
      JSON.stringify(messages)
    );
  }
  res.status(200).json({
    success: true,
    message: "All Message Recieved Successfully",
    data: messages,
  });
});

const getMessages = async (conversationId) => {
  const messageList1 = await Message.findAll({ where: { conversationId } });
  const senderMessages = await Promise.all(
    messageList1.map((x) => {
      return {
        conversationId: x.conversationId,
        text: x.text,
        time: x.createdAt,
        type: "sent",
      };
    })
  );
  const { senderId, recieverId } = await Conversation.findOne({
    where: { id: conversationId },
  });
  const conversation = await Conversation.findOne({
    where: { senderId: recieverId, recieverId: senderId },
  });
  const messageList2 = conversation
    ? await Message.findAll({
      where: { conversationId: conversation.id },
    })
    : [];
  const recieverMessages = messageList2
    ? await Promise.all(
      messageList2.map((x) => {
        return {
          conversationId: x.conversationId,
          text: x.text,
          time: x.createdAt,
          type: "recieved",
        };
      })
    )
    : [];
  const messages = [...senderMessages, ...recieverMessages].sort((a, b) => {
    dt1 = new Date(a.time);
    dt2 = new Date(b.time);
    return dt1 - dt2;
  });
  return messages;
};

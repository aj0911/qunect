const protect = require("../Middlewares/CatchAsyncErrors");
const Conversation = require("../Models/ConversationModel");
const User = require("../Models/UserModel");

exports.createConversation = protect(async (req, res) => {
  const { senderId, recieverId } = req.body;
  const conversation = await Conversation.create({ senderId, recieverId });
  const reciever = await User.findOne({ where: { id: recieverId } });
  res.status(200).json({
    success: true,
    message: "Conversation created Successfully",
    data: { id: conversation.id, reciever },
  });
});

exports.existConversation = protect(async (req, res) => {
  const { senderId } = req.params;
  let conversations = await Conversation.findAll({
    where: { senderId },
  });
  conversations = await Promise.all(
    conversations.map(async (x) => {
      const reciever = await User.findOne({ where: { id: x.recieverId } })
      const val = await Conversation.findOne({where:{senderId:reciever.id,recieverId:senderId}});
      return {
        id: x.id,
        reciever,
        revConversationId:val?val.id:-1
      };
    })
  );
  res.status(200).json({
    success: true,
    message: "Conversation recieved Successfully",
    data: conversations,
  });
});

exports.checkConversation = protect(async(req,res)=>{
  const {senderId,recieverId} = req.body;
  const resp = await Conversation.findOne({where:{senderId,recieverId}});
    const conversation = {
      id:resp?resp.id:-1,
      reciever:await User.findOne({ where: { id: recieverId } })
    }
  res.status(200).json({
    success: true,
    message: "Conversation recieved Successfully",
    data: conversation,
  });
})

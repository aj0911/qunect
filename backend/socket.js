const socketIO = require("socket.io");
const http = require("http");
const app = require("./app");

const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

let online_users = {};

io.on("connection", (socket) => {
  //connection
//   console.log("New Client Connected: ", socket.id);

  //disconnecting user
  socket.on("disconnect", () => {
    // console.log("Client disconnected:", socket.id);
    for (let userId in online_users) {
      if (online_users[userId] === socket.id) {
        delete online_users[userId];
        break;
      }
    }
    io.emit("update_online_users", Object.keys(online_users));
  });

  //recieving user id from frontend
  socket.on("user_online", (user_id) => {
    online_users[user_id] = socket.id;

    //sending online users to frontend
    io.emit("update_online_users", Object.keys(online_users));
  });

  //recieving message from frontend
  socket.on(
    "send_message",
    ({ reciever, text, sender, senderData, conversationId,revConversationId }) => {
    //   console.log({ reciever, text, sender }, online_users);
      const recieverSocketID = online_users[reciever];
      if (recieverSocketID) {
        //send message to that user's frontend
        io.to(recieverSocketID).emit("recieve_message", {
          text,
          sender,
          reciever,
          senderData,
          conversationId,
          revConversationId
        });
      }
    }
  );
});

module.exports = server;

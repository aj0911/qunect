const express = require("express");
const { sendMessage, getAllMessages } = require("../Controllers/MessageController");

const router = express.Router();

router.post('/message/send',sendMessage);
router.get('/message/get/:conversationId',getAllMessages);

module.exports = router;
const express = require("express");
const { createConversation, existConversation, checkConversation } = require("../Controllers/ConversationController");

const router = express.Router();

router.post('/conversation/create/new',createConversation);
router.get('/conversation/:senderId',existConversation)
router.post('/conversation/check',checkConversation)

module.exports = router;
const express = require('express');
const router = express.Router();
const { sendMessageController, receiveMessageController, listMessagesController } = require('../controllers/messageController');
const { healthController } = require('../controllers/healthController');

router.get('/health', healthController)
router.post('/message', sendMessageController);
router.post('/message/worker', receiveMessageController);
router.get('/message/:userIdSend/:userIdReceive', listMessagesController);

module.exports = router;
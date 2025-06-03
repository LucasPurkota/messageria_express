const express = require('express');
const router = express.Router();
const { sendMessageController, receiveMessage } = require('../controllers/messageController');

router.post('/message', sendMessageController);
router.post('/message/worker', receiveMessage);

module.exports = router;
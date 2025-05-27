const express = require('express');
const router = express.Router();
const { sendMessageController, receiveMessage } = require('../controllers/messageController');

router.post('/send', sendMessageController);
router.post('/receive', receiveMessage);

module.exports = router;
const express = require('express');
const router = express.Router();
const { sendMessage, receiveMessage } = require('../controllers/messageController');

router.post('/send', sendMessage);
router.post('/receive', receiveMessage);

module.exports = router;
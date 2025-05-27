const { sendMessageService } = require('../services/messageService');

exports.sendMessageController = (req, res) => {

  sendMessageService(req.body.message, req.body.senderId, req.body.receiverId);
  
  res.status(200).json({
    message: "Message sent successfully"
  });
}

exports.receiveMessage = (req, res) => {
  res.status(200).json({
    message: "Message received successfully"
  });
}
const { sendMessage } = require('../services/messageService');

exports.sendMessage = (req, res) => {

  sendMessage(req.body.message, req.body.receiverId);
  
  res.status(200).json({
    message: "Message sent successfully"
  });
}

exports.receiveMessage = (req, res) => {
  res.status(200).json({
    message: "Message sent successfully"
  });
}
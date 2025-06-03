const { sendMessageService, receiveMessageService } = require('../services/messageService');

exports.sendMessageController = (req, res) => {

  sendMessageService(req.body.message, req.body.userIdSend, req.body.userIdReceive);
  
  res.status(200).json({
    message: "Mesage sended with success"
  });
}

exports.receiveMessage = (req, res) => {

  receiveMessageService(req.body.userIdSend, req.body.userIdReceive);

  res.status(200).json({
    message: "Message received successfully"
  });
}
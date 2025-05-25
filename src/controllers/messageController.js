
exports.sendMessage = (req, res) => {
  res.status(200).json({
    message: "Message sent successfully"
  });
}

exports.receiveMessage = (req, res) => {
  res.status(200).json({
    message: "Message sent successfully"
  });
}
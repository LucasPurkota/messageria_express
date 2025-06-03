exports.receiveMessage = (res) => {
  res.status(200).json({
    message: "Service is running"
  });
}
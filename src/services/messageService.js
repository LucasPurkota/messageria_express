const { connectRabbitMQ } = require('../config/rabbitmq');

function sendMessageService(message, senderId, receiverId) {
  connectRabbitMQ((error, channel) => {
    if (error) {
      console.error('Erro no Producer:', error);
      return;
    }
    const queueName = `queue_${senderId}_${receiverId}`;
    channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`[Producer] Mensagem enviada para ${queueName}: ${message}`);
  });
}

module.exports = { sendMessageService };
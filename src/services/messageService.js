const { connectRabbitMQ } = require('../config/rabbitmq');

function sendMessage(message, receiverId) {
  connectRabbitMQ((error, channel) => {
    if (error) {
      console.error('Erro no Producer:', error);
      return;
    }
    const queueName = `user_${receiverId}_queue`;
    channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`[Producer] Mensagem enviada para ${queueName}: ${message}`);
  });
}

module.exports = { sendMessage };
const { connectRabbitMQ } = require('../config/rabbitmq');
const axios = require('axios');

function sendMessageService(message, userIdSend, userIdReceive) {
  connectRabbitMQ((error, channel) => {
    if (error) {
      console.error('Erro no Producer:', error);
      return;
    }
    const queueName = `${userIdSend}_${userIdReceive}`;
    
    channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`[Producer] Mensagem enviada para ${queueName}: ${message}`);
  });
}

async function callMessageAPI(messageData) {
  try {
    const response = await axios.post('http://localhost:8000/messages', messageData);
    console.log('Mensagem enviada para API com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao chamar a API:', error.response?.data || error.message);
    throw error;
  }
}

function parseMessageContent(content) {
  const str = content.toString();
  
  // Tenta parsear como JSON, se falhar trata como texto puro
  try {
    const parsed = JSON.parse(str);
    return {
      message: parsed.message || parsed.text || str, // Prioriza campos específicos
      ...parsed // Mantém outras propriedades se existirem
    };
  } catch {
    return { message: str }; // Fallback para texto puro
  }
}

function receiveMessageService(userIdSend, userIdReceive) {
  connectRabbitMQ((error, channel) => {
    if (error) {
      console.error('Erro ao conectar no RabbitMQ:', error);
      return;
    }
    
    const queueName = `${userIdSend}_${userIdReceive}`;
    channel.assertQueue(queueName, { durable: true });
    
    channel.consume(queueName, async function(msg) {
      try {
        const rawContent = msg.content.toString();
        console.log("Mensagem recebida do RabbitMQ:", rawContent);
        
        // Parse seguro do conteúdo
        const messageContent = parseMessageContent(msg.content);
        
        // Prepara dados para a API
        const messageData = {
          message: messageContent.message,
          user_id_send: parseInt(userIdSend),
          user_id_receive: parseInt(userIdReceive),
          // Adiciona timestamp se necessário
          timestamp: messageContent.timestamp || new Date().toISOString()
        };
        
        await callMessageAPI(messageData);
        
      } catch (error) {
        console.error('Erro ao processar mensagem:', {
          error: error.message,
          stack: error.stack
        });
      }
    }, {
      noAck: true
    });
  });
}

module.exports = { sendMessageService, receiveMessageService };
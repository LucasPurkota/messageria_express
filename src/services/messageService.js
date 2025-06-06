const { connectRabbitMQ } = require('../config/rabbitmq');
const axios = require('axios');
const { createClient } = require('redis');
let redisClient;

// Criar e conectar o cliente Redis
(async () => {
  redisClient = createClient();
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  await redisClient.connect();
})();

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
  
  try {
    const parsed = JSON.parse(str);
    return {
      message: parsed.message || parsed.text || str,
      ...parsed
    };
  } catch {
    return { message: str };
  }
}

async function receiveMessageService(userIdSend, userIdReceive) {
  try {
    // Primeiro, verifica no Redis se há mensagens em cache
    const redisKey = `messages:${userIdSend}_${userIdReceive}`;
    
    let cachedMessages = [];
    try {
      cachedMessages = await redisClient.lRange(redisKey, 0, -1);
      if (cachedMessages && cachedMessages.length > 0) {
        console.log('Mensagens recuperadas do Redis:', cachedMessages.length);
        // Limpa as mensagens do cache após recuperá-las
        await redisClient.del(redisKey);
        return cachedMessages;
      }
    } catch (redisErr) {
      console.error('Erro ao acessar Redis:', redisErr);
      // Continua mesmo com erro no Redis
    }

    // Se não encontrou no Redis, verifica no RabbitMQ
    return new Promise((resolve, reject) => {
      connectRabbitMQ(async (error, channel) => {
        if (error) {
          console.error('Erro ao conectar no RabbitMQ:', error);
          reject(error);
          return;
        }

        const queueName = `${userIdSend}_${userIdReceive}`;
        channel.assertQueue(queueName, { durable: true }, async (err) => {
          if (err) {
            channel.close();
            reject(err);
            return;
          }
          
          channel.get(queueName, { noAck: true }, async (err, msg) => {
            channel.close();
            
            if (err) {
              reject(err);
            } else if (msg) {
              console.log("Mensagem recebida:", msg.content.toString());
              
              try {
                const messageContent = parseMessageContent(msg.content);
                const messageData = {
                  message: messageContent.message,
                  user_id_send: parseInt(userIdSend),
                  user_id_receive: parseInt(userIdReceive),
                  timestamp: messageContent.timestamp || new Date().toISOString()
                };

                // Armazena no Redis
                try {
                  await redisClient.rPush(redisKey, msg.content.toString());
                  await redisClient.expire(redisKey, 86400); // Expira em 24 horas
                } catch (redisErr) {
                  console.error('Erro ao armazenar no Redis:', redisErr);
                }

                await callMessageAPI(messageData);
                resolve(msg.content.toString());
              } catch (error) {
                console.error('Erro ao processar mensagem:', {
                  error: error.message,
                  stack: error.stack
                });
                reject(error);
              }
            } else {
              resolve(null);
            }
          });
        });
      });
    });
  } catch (error) {
    console.error('Erro no receiveMessageService:', error);
    throw error;
  }
}

module.exports = { sendMessageService, receiveMessageService };


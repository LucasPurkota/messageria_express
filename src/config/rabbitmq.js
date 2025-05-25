const amqp = require('amqplib/callback_api');


function connectRabbitMQ(callback) {
  amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) return callback(error0);

    connection.createChannel((error1, channel) => {
      if (error1) return callback(error1);
      
      callback(null, { channel, queue });
    });
  });
}

module.exports = connectRabbitMQ;
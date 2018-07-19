#!/usr/bin/env node
const amqp = require('amqplib');
const moment = require('moment');

async function consumeAllFromQueue() {
  const conn = await amqp.connect('amqp:localhost');

  const channel = await conn.createChannel();
  const queueName = 'MY_QUEUE';

  await channel.consume(
    queueName,
    msg => {
      console.log(`${moment().toISOString()} | Consume message = ${msg.content.toString('UTF-8')}`);
    },
    { noAck: true }
  );
}

consumeAllFromQueue();

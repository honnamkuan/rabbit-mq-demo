#!/usr/bin/env node

const amqp = require("amqplib");
const moment = require("moment");

async function sendMessage() {
  const conn = await amqp.connect("amqp:localhost"); // establish connection
  const channel = await conn.createChannel(); // create channel
  const queueName = "MY_QUEUE";

  await channel.assertQueue(queueName, { durable: false }); // create queue if not exists
  
  let sendCount = 0;

  const timer = setInterval(async () => {
    sendCount++;

    try {
      const message = `HELLO WORLD`.substr(0, 6 + sendCount);
      await channel.sendToQueue(queueName, Buffer.from(message), {
        persistent: false
      });
      console.log(`${moment().toISOString()} | Message sent = ${message}`);
    } catch (error) {
      await clearTimerAndCloseConns(timer, channel, conn);
      throw error;
    }

    if (sendCount === 5) {
      await clearTimerAndCloseConns(timer, channel, conn);
    }
  }, 1000);
}

try {
  sendMessage();
} catch (error) {
  console.error(error);
}

async function clearTimerAndCloseConns(timer, channel, conn) {
  clearInterval(timer);
  await channel.close();
  await conn.close();
}

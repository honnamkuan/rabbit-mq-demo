#!/usr/bin/env node
const amqp = require("amqplib");
const moment = require("moment");

const queueName = "MY_QUEUE";
const messages = ["HE", "HELLO", "HELLO W", "HELLO WOR", "HELLO WORLD"];
const lastIndex = messages.length - 1;

async function sendMessages() {
  const conn = await amqp.connect("amqp:localhost"); // establish connection
  const channel = await conn.createChannel(); // create channel

  await channel.assertQueue(queueName, { durable: true }); // create queue if not exists

  sendMessageOneByOne(conn, channel, 0);
}

async function sendMessageOneByOne(conn, channel, currentIndex) {
  setTimeout(async () => {
    try {
      const currentMessage = messages[currentIndex];

      // send message directly to queue
      await channel.sendToQueue(queueName, Buffer.from(currentMessage), {
        persistent: true
      });
      console.log(
        `${moment().toISOString()} | Message sent = ${currentMessage}`
      );
      if (currentIndex < lastIndex) {
        sendMessageOneByOne(conn, channel, ++currentIndex);
      } else {
        closeConns(conn, channel);
      }
    } catch (error) {
      closeConns(conn, channel);
      throw error;
    }
  }, 1000);
}

async function closeConns(conn, channel) {
  await channel.close();
  await conn.close();
}

// execute
sendMessages();

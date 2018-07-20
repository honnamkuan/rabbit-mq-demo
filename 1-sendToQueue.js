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

  sendMessageWithInterval(conn, channel, 0);
}

async function sendMessageWithInterval(conn, channel, currentIndex) {
  setTimeout(async () => {
    const currentMessage = messages[currentIndex];

    // send message directly to queue
    await channel.sendToQueue(queueName, Buffer.from(currentMessage), {
      persistent: true
    });
    console.log(`${moment().toISOString()} | Message sent = ${currentMessage}`);
    if (currentIndex < lastIndex) {
      // send next message after 1 second
      sendMessageWithInterval(conn, channel, ++currentIndex);
    } else {
      // close connections
      await channel.close();
      await conn.close();
    }
  }, 1000);
}

// execute
sendMessages();

#!/usr/bin/env node

const amqp = require("amqplib");
const moment = require("moment");

const queueName = "MY_QUEUE";

async function consumeFromQueue() {
  const conn = await amqp.connect("amqp:localhost"); // establish connection

  const channel = await conn.createChannel(); // create channel

  await channel.assertQueue(queueName, { durable: false }); // create queue if not exists

  const reply = await channel.consume(
    queueName,
    msg => {
      console.log(
        `${moment().toISOString()} | Consume message = ${msg.content.toString(
          "UTF-8"
        )}`
      );
    },
    { noAck: true }
  );

  console.log(`consumerTag = ${reply.consumerTag}`);
}

consumeFromQueue();

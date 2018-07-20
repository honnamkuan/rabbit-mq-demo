#!/usr/bin/env node
const amqp = require("amqplib");
const moment = require("moment");

const queueName = "MY_QUEUE";

async function consumeFromQueue() {
  const conn = await amqp.connect("amqp:localhost"); // establish connection

  const channel = await conn.createChannel(); // create channel
  // channel.prefetch(1);

  await channel.assertQueue(queueName, { durable: true }); // create queue if not exists

  const reply = await channel.consume(
    queueName,
    msg => {
      console.log(`Receive message`);

      setTimeout(() => {
        console.log(
          `${moment().toISOString()} | Consume message = ${msg.content.toString(
            "UTF-8"
          )}`
        );
        channel.ack(msg);
      }, 10000);
    },
    { noAck: false }
  );

  console.log(`consumerTag = ${reply.consumerTag}`);
}

// execute
consumeFromQueue();

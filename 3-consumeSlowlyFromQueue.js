#!/usr/bin/env node
const amqp = require("amqplib");
const moment = require("moment");

const queueName = "MY_QUEUE";

async function consumeFromQueue() {
  const conn = await amqp.connect("amqp:localhost"); // establish connection

  const channel = await conn.createChannel(); // create channel
  channel.prefetch(1);

  await channel.assertQueue(queueName, { durable: true }); // create queue if not exists

  // consume and acknowledge message
  await channel.consume(
    queueName,
    msg => {
      console.log(`Received message`);

      setTimeout(() => {
        console.log(
          `${moment().toISOString()} | Consume message = ${msg.content.toString(
            "UTF-8"
          )}`
        );
        channel.ack(msg); // acknowledge message
      }, 10000);
    },
    { noAck: false }
  );

  console.log(`Started successfully, waiting for message`);
}

// execute
consumeFromQueue();

#!/usr/bin/env node
const amqp = require("amqplib");

const topicName = "MY_TOPIC";

async function consume(subscriberQueueName, routingKeyPattern) {
  const conn = await amqp.connect("amqp:localhost");
  const channel = await conn.createChannel();

  // create exchange if not exists
  await channel.assertExchange(topicName, "topic", {
    durable: true
  });

  // create queue if not exists
  const queueResponse = await channel.assertQueue(subscriberQueueName, {
    durable: true
  });

  await channel.bindQueue(queueResponse.queue, topicName, routingKeyPattern); // bind queue to provided routingKeyPattern

  // consume and acknowledge message
  channel.consume(
    queueResponse.queue,
    msg => {
      console.log(msg.content.toString("UTF-8"));
      channel.ack(msg);
    },
    { noAck: false }
  );
}

// cmdLine execute
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log(`provide argument [subscriberQueueName, routingKeyPattern]`);
  process.exit(1);
}
const [subscriberQueueName, routingKeyPattern] = args;
consume(subscriberQueueName, routingKeyPattern);

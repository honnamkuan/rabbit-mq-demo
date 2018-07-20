#!/usr/bin/env node
const amqp = require("amqplib");

const topicName = "MY_TOPIC";

async function publishToTopic(routingKey, message) {
  const conn = await amqp.connect("amqp:localhost"); // establish connection
  const channel = await conn.createChannel(); // create channel

  // create exchange if not exists
  const exchangeResponse = await channel.assertExchange(topicName, "topic", {
    durable: true
  });

  // publish message to topic with routingKey
  const hasPublished = await channel.publish(
    exchangeResponse.exchange,
    routingKey,
    Buffer.from(message, "UTF-8"),
    { persistent: true } // Ensure message survives MQ server restart
  );
  console.log(hasPublished ? "Published to topic" : "Publish failed");

  // cleanup
  await channel.close();
  await conn.close();
}

// cmdLine execute
const args = process.argv.slice(2);

if (args.length !== 2) {
  console.log(`Enter arguments [routingKey, message]`);
  process.exit(1);
}
console.log(args);
const [routingKey, message] = args;
publishToTopic(routingKey, message);

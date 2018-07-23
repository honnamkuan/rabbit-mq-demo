# Demo Project to showcase RabbitMQ integration

## Prerequisites
- RabbitMQ server on localhost
- Latest Node.js LTS version
- npm or yarn installed globally

## Installation
  1. Clone git repo
  1. Open terminal at project folder
  1. npm install

## Running the demo
### Queue Demo
1. Execute `node 1-sendToQueue.js` to create queue and send messages into queue `MY_QUEUE`.
1. Execute `node 2-consumeFromQueue.js` to consume and print messages from the queue.
1. Optionally, execute `node 3-consumeSlowlyFromQueue.js` as well to observe Fair dispatch in action.

### Topic Demo
1. Execute `node 4-publishTopic.js {routingKey} {messageToPublish}` to create and publish message to Topic `MY_TOPIC` with the specified `routingKey`.
2. Execute `node 5-consumeFromTopic.js {subscriberQueueName} {routingKeyPattern}` to create a bind a subscribed specific queue to `MY_TOPIC`, only receive messages that based on `routingKeyPattern` matches.

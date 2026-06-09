const { Kafka } = require('kafkajs');
const initDB = require('./db');
require('dotenv').config();

const kafka = new Kafka({
  clientId: 'tp9-consumer',
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'tp9-group' });

const run = async () => {
  const db = await initDB();
  const collection = db.messages;

  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.KAFKA_TOPIC,
    fromBeginning: true,
  });

  console.log('Consumer RxDB actif');

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const payload = JSON.parse(message.value.toString());

      await collection.insert({
        id: message.offset + '-' + Date.now(),
        topic,
        partition,
        offset: Number(message.offset),
        key: message.key ? message.key.toString() : null,
        payload,
        createdAt: new Date().toISOString(),
      });

      console.log('Sauvegardé dans RxDB');
    },
  });
};

run().catch(console.error);
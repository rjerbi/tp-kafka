const { createRxDatabase } = require('rxdb');
const { getRxStorageLocalStorage } = require('rxdb/plugins/storage-localstorage');

let dbPromise;

const initDB = async () => {
  if (dbPromise) return dbPromise;

  const db = await createRxDatabase({
    name: 'kafka_db',
    storage: getRxStorageLocalStorage(),
  });

  await db.addCollections({
    messages: {
      schema: {
        title: 'message schema',
        version: 0,
        type: 'object',
        primaryKey: 'id',
        properties: {
          id: { type: 'string' },
          topic: { type: 'string' },
          partition: { type: 'number' },
          offset: { type: 'number' },
          key: { type: 'string' },
          payload: { type: 'object' },
          createdAt: { type: 'string' },
        },
        required: ['id', 'topic', 'payload', 'createdAt'],
      },
    },
  });

  dbPromise = db;
  return db;
};

module.exports = initDB;
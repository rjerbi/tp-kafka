const express = require('express');
const initDB = require('./db');

const app = express();
const port = 3000;

app.use(express.json());

let collection;

(async () => {
  const db = await initDB();
  collection = db.messages;
})();

app.get('/messages', async (req, res) => {
  try {
    const docs = await collection.find().exec();
    res.json(docs.map(d => d.toJSON()));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/messages/:id', async (req, res) => {
  try {
    const doc = await collection.findOne(req.params.id).exec();

    if (!doc) return res.status(404).send('Not found');

    res.json(doc.toJSON());
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
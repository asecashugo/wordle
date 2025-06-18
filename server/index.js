// filepath: c:\js\wordle\index.js
const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors');

app.use(cors());

// Load words from words.json
const words = require('./words.json');

app.get('/api/word', (req, res) => {
  res.json({
    word:  words[Math.floor(Math.random() * words.length)],
  });
  });

app.get('/api/check/:word', (req, res) => {
  const { word } = req.params;
  const isValid = words.includes(word);
  res.json({ valid: isValid });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
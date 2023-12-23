const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;
const connection_url = 'mongodb://localhost:27017/my_marvel_database';

mongoose.connect(connection_url);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));
db.once('open', () => {
    console.log('Successful connection to MongoDB!');
});

const Character = mongoose.model('characters', {
    real_name: String,
    nickname: String,
    description: String
});

app.get('/', (req, res) => {
    res.send('Application running...');
});

app.get('/avengers/', async (req, res) => {
    try {
        const avengers = await Character.find();
        res.json(avengers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao obter personagens' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
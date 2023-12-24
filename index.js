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

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Application running...');
});

app.get('/avengers/', async (req, res) => {
    try {
        const avengers = await Character.find();
        res.json(avengers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting characters!' });
    }
});

app.get('/avengers/:id/', async (req, res) => {
    try {
        const character = await Character.findById(req.params.id);

        if (!character) {
            return res.status(404).json({ error: 'Character not found!' });
        }

        res.json(character);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting character by ID!' });
    }
});

app.post('/avengers/', async (req, res) => {
    try {
        const { real_name, nickname, description } = req.body;

        if (!real_name || !nickname || !description) {
            return res.status(400).json({ error: 'All fields are mandatory.' });
        }

        const newCharacter = new Character({
            real_name,
            nickname,
            description
        });

        const savedCharacter = await newCharacter.save();

        res.status(201).json(savedCharacter);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating a new character!' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
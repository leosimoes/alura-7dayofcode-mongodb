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
        const avengers = await Character.find({}, { _id: 0 });
        res.json(avengers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting characters!' });
    }
});

app.get('/avengers/id/:id/', async (req, res) => {
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

app.get('/avengers/nickname/:nickname', async (req, res) => {
    try {
        const { nickname } = req.params;
        const decodedNickname = decodeURIComponent(nickname); // Decodifica o valor

        const avenger = await Character.findOne({ nickname: decodedNickname });

        if (!avenger) {
            return res.status(404).json({ error: 'Avenger not found' });
        }

        const avengerWithoutId = avenger.toObject();
        delete avengerWithoutId._id;

        res.json(avengerWithoutId);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Error getting Avenger by nickname' });
    }
});

app.get('/avengers/realname/:realname', async (req, res) => {
    try {
        const { realname } = req.params;
        const decodedNickname = decodeURIComponent(realname); // Decodifica o valor

        const avenger = await Character.findOne({ real_name: decodedNickname });

        if (!avenger) {
            return res.status(404).json({ error: 'Avenger not found!' });
        }

        const avengerWithoutId = avenger.toObject();
        delete avengerWithoutId._id;

        res.json(avengerWithoutId);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Error getting Avenger by nickname!' });
    }
});

const ITEMS_PER_PAGE = 4; // Number of items per page

app.get('/avengers/pages/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;

        const startIndex = (page - 1) * ITEMS_PER_PAGE;

        const avengers = await Character.find({}, { _id: 0 }).skip(startIndex).limit(ITEMS_PER_PAGE);

        res.json(avengers);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Error getting characters!' });
    }
});

app.post('/avengers/', async (req, res) => {
    try {
        const { real_name, nickname, description } = req.body;

        const hasAdditionalAttributes = Object.keys(req.body).some(attribute => !['real_name', 'nickname', 'description'].includes(attribute));

        if (hasAdditionalAttributes) {
            return res.status(400).json({ error: 'Only "real_name", "nickname", and "description" are allowed.' });
        }

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
        res.status(400).json({ error: 'Error creating a new character!' });
    }
});

app.delete('/avengers/nickname/:nickname', async (req, res) => {
    try {
        const { nickname } = req.params;
        const decodedNickname = decodeURIComponent(nickname);

        const result = await Character.deleteOne({ nickname: decodedNickname });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Avenger not found' });
        }

        res.json({ message: 'Avenger deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting Avenger by nickname' });
    }
});

app.delete('/avengers/real_name/:real_name', async (req, res) => {
    try {
        const { real_name } = req.params;
        const decodedRealName = decodeURIComponent(real_name);

        const result = await Character.deleteOne({ real_name: decodedRealName });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Avenger not found' });
        }

        res.json({ message: 'Avenger deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting Avenger by real_name' });
    }
});

app.put('/avengers/nickname/:nickname', async (req, res) => {
    try {
        const { nickname } = req.params;
        const decodedNickname = decodeURIComponent(nickname);

        const { real_name, description } = req.body;

        const result = await Character.updateOne(
            { nickname: decodedNickname },
            { $set: { real_name, description } }
        );

        if (result.n === 0) {
            return res.status(404).json({ error: 'Avenger not found' });
        }

        res.json({ message: 'Avenger updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating Avenger by nickname' });
    }
});

app.put('/avengers/real_name/:real_name', async (req, res) => {
    try {
        const { real_name } = req.params;
        const decodedRealName = decodeURIComponent(real_name);

        const { nickname, description } = req.body;

        const result = await Character.updateOne(
            { real_name: decodedRealName },
            { $set: { nickname, description } }
        );

        if (result.n === 0) {
            return res.status(404).json({ error: 'Avenger not found' });
        }

        res.json({ message: 'Avenger updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating Avenger by real_name' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
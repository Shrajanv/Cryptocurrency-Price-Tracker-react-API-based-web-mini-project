const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS middleware

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Define a schema for the favorites
const favoriteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    marketCap: { type: Number, required: true },
    change24h: { type: Number, required: true }
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

// Endpoint to add a favorite
app.post('/api/favorites', async (req, res) => {
    const { name, price, marketCap, change24h } = req.body;
    const newFavorite = new Favorite({ name, price, marketCap, change24h });

    try {
        await newFavorite.save();
        res.status(201).json(newFavorite);
    } catch (error) {
        res.status(500).json({ message: 'Error saving favorite', error });
    }
});

// Endpoint to get all favorites
app.get('/api/favorites', async (req, res) => {
    try {
        const favorites = await Favorite.find();
        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching favorites', error });
    }
});

// Endpoint to remove a favorite
app.delete('/api/favorites/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Favorite.findByIdAndDelete(id);
        res.status(204).send(); // No content to send back
    } catch (error) {
        res.status(500).json({ message: 'Error deleting favorite', error });
    }
});

// Connect to MongoDB and start server
mongoose.connect('mongodb://localhost:27017/cryptoTracker', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(5000, () => console.log('Server running on http://localhost:5000')))
    .catch((err) => console.error(err));

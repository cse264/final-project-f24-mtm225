const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.use(bodyParser.json());

// Save Pokémon info
app.post("/api/pokemon-info", async (req, res) => {
    const { userId, pokemonName, info } = req.body;
    try {
        await pool.query(
            "INSERT INTO pokemon_info (user_id, pokemon_name, info) VALUES ($1, $2, $3)",
            [userId, pokemonName, info]
        );
        res.send({ message: "Pokémon information saved." });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to save Pokémon info." });
    }
});

// Get Pokémon info for a user
app.get("/api/pokemon-info/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query("SELECT * FROM pokemon_info WHERE user_id = $1", [userId]);
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to fetch Pokémon info." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

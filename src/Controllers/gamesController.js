import db from "../Database/databaseConnection.js";

export async function postGame(req, res) {
    try {
        const { name, image, stockTotal, pricePerDay } = req.body;
        const insert = await db.query(
            `INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1,$2,$3,$4);`,
            [name, image, stockTotal, pricePerDay]
        );
    
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getGames(req, res) {
    try {
        const games = await db.query(`SELECT * FROM games;`);
        res.send(games.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}
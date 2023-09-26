import db from "../Database/databaseConnection.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
    try {
        const rentals = await db.query(`
            SELECT
                rentals.*, customers.name AS "customerName", games.name AS "gameName"
            FROM rentals
            JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId" = games.id;
        `);
        const rentalsFormat = rentals.rows.map(r => ({
            id: r.id,
            customerId: r.customerId,
            gameId: r.gameId,
            rentDate: r.rentDate,
            daysRented: r.daysRented,
            returnDate: r.returnDate,
            originalPrice: r.originalPrice,
            delayFee: r.delayFee,
            customer: {
                id: r.customerId,
                name: r.customerName
            },
            game: {
                id: r.gameId,
                name: r.gameName
            }
        }));
        res.send(rentalsFormat);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function postRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    const rentDate = dayjs().format('YYYY-MM-DD');

    try {
        // Validations
        const customer = await db.query(`SELECT * FROM customers WHERE id = $1 ;`, [customerId]);
        if (customer.rowCount === 0) { return res.sendStatus(400) }

        const game = await db.query(`SELECT * FROM games WHERE id = $1 ;`, [gameId]);
        if (game.rowCount === 0) { return res.sendStatus(400) }

        const rentalsOfGame = await db.query(`SELECT * FROM rentals WHERE "gameId" = $1 ;`, [gameId]);
        if (rentalsOfGame.rowCount >= game.rows[0].stockTotal) { return res.sendStatus(400) }
        const originalPrice = game.rows[0].pricePerDay * daysRented;

        const insert = await db.query(
            `INSERT INTO rentals
                ("customerId", "gameId", "daysRented", "rentDate", "returnDate", "originalPrice", "delayFee")
            VALUES
                ($1,$2,$3,$4,$5,$6,$7);`,
            [customerId, gameId, daysRented, rentDate, null, originalPrice, null]
        );

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function returnRental(req, res) {
    const { id } = req.params;
    const returnDate = dayjs().format('YYYY-MM-DD');
    try {
        // Validations
        const rental = await db.query(`SELECT * FROM rentals WHERE id = $1 ;`, [id]);
        if (rental.rowCount === 0) { return res.sendStatus(404) }
        if (rental.rows[0].returnDate !== null) { return res.sendStatus(400) }

        const { rentDate, daysRented, originalPrice } = rental.rows[0];
        const parsedRentDate = dayjs(rentDate);
        const parsedReturnDate = dayjs(returnDate);
        const interval = parsedReturnDate.diff(parsedRentDate, 'day');

        const delay = (interval > daysRented) ? (interval - daysRented) : 0;
        const delayFee = (originalPrice / daysRented) * delay;

        const update = await db.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3;`, [returnDate, delayFee, id]);

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params;
    try {
        // Validations
        const rental = await db.query(`SELECT * FROM rentals WHERE id = $1 ;`, [id]);
        if (rental.rowCount === 0) { return res.sendStatus(404) }
        if (rental.rows[0].returnDate !== null) { return res.sendStatus(400) }

        await db.query(
            `DELETE FROM rentals WHERE id = $1;`,
            [id]
        );

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}
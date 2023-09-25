import db from "../Database/databaseConnection.js";

export async function postCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    try {
        const cpfExists = await db.query(`SELECT * FROM customers WHERE cpf = $1;`, [cpf]);
        if (cpfExists.rows.length !== 0) { return res.sendStatus(409) }

        const insert = await db.query(
            `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1,$2,$3,$4);`,
            [name, phone, cpf, birthday]
        );

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getCustomers(req, res) {
    try {
        const customer = await db.query(`SELECT * FROM customers;`);
        res.send(customer.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getCustomerById(req, res) {
    const { id } = req.params;
    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id=$1;`, [id]);
        if (!customer.rows[0]) { return res.sendStatus(404) }
        res.send(customer.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function putCustomer(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;
    try {
        const cpfExists = await db.query(`SELECT * FROM customers WHERE id <> $1 AND cpf = $2;`, [id, cpf]);
        if (cpfExists.rows.length !== 0) { return res.sendStatus(409) }

        const insert = await db.query(
            `UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5;`,
            [name, phone, cpf, birthday, id]
        );

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}
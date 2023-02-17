// Simple script to create a user and hash a password
require('dotenv').config()
const argon2 = require('@node-rs/argon2');
const readline = require('readline');
const uuid = require('uuid');
const { Client } = require('pg');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();

        const email = await prompt("Enter email: ");
        const password = await prompt("Enter password: ");
        rl.close();

        console.log('> hashing password');
        const hashed = await argon2.hash(password, {
            memoryCost: 8192,
            timeCost: 10,
            outputLen: 32,
            parallelism: 1,
            algorithm: argon2.Algorithm.Argon2id,
            version: argon2.Version.V0x13,
        });

        console.log("> saving to database...");

        const id = uuid.v4();
        await client.query('BEGIN');
        await client.query('INSERT INTO users (id, email, active) VALUES ($1, $2, $3)', [id, email, true]);
        await client.query('INSERT INTO auth_password (user_id, password) VALUES ($1, $2)', [id, hashed]);
        await client.query('COMMIT');
    } catch (error) {
        console.error(error);
        await client.query('ROLLBACK');
    }
}

if (require.main === module) {
    main().then(() => console.log('exiting'));
}
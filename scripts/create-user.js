// Simple script to create a user and hash a password
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
    // attempt to load a .env file
    try {
        require('dotenv').config()
    } catch (error) {
        console.warn(`dotenv module not found, skipping (${error})`)
    }

    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        console.log('> enter user information');
        const email = await prompt("Enter email: ");
        const username = await prompt('Enter username: ');
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
        await client.connect();
        await client.query('BEGIN');
        await client.query('INSERT INTO users (id, email, username, active) VALUES ($1, $2, $3, $4)', [id, email, username, true]);
        await client.query('INSERT INTO auth_password (user_id, password) VALUES ($1, $2)', [id, hashed]);
        await client.query('COMMIT');
    } catch (error) {
        console.error(error);
        await client.query('ROLLBACK');
    } finally {
        await client.end();
    }
}

if (require.main === module) {
    main().then(() => console.log('exiting'));
}
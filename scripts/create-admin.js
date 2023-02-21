// Simple script to create a user and hash a password
const argon2 = require('@node-rs/argon2');
const uuid = require('uuid');
const { Client } = require('pg');

async function createAdmin(client, email, username, password) {
    if (!password || password === '') {
        throw new Error("must specify admin password via environment variable GUNSLINGER_ADMIN_PASSWORD");
    }

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
    await client.query('INSERT INTO users (id, email, username, admin, active) VALUES ($1, $2, $3, $4, $5)', [id, email, username, true, true]);
    await client.query('INSERT INTO auth_password (user_id, password) VALUES ($1, $2)', [id, hashed]);
}

async function main() {
    var ret = 0;

    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        await client.query('BEGIN');

        console.log('> enter user information');
        const username = "Deltron Zero";
        const email = process.env.GUNSLINGER_ADMIN_EMAIL;
        const password = process.env.GUNSLINGER_ADMIN_PASSWORD;

        if (!email || email === '') {
            throw new Error("must specify admin email via environment variable GUNSLINGER_ADMIN_EMAIL");
        }

        // check if admin already exists
        console.log(`> checking for admin user (${email})`)
        const exists = await client.query('SELECT username FROM users WHERE email = $1', [email]);
        if (exists.rows == 0) {
            await createAdmin(client, email, username, password);
        } else {
            console.log('> admin user exists, skipping createAdmin');
        }

        await client.query('COMMIT');
    } catch (error) {
        console.error(error);
        await client.query('ROLLBACK');
        ret = -1;
    } finally {
        await client.end();
    }

    return ret;
}

if (require.main === module) {
    main()
        .then(ret => process.exit(ret));
}
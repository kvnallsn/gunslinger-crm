-- +goose Up
-- users table
-- stores all active and inactive users of this application
CREATE TABLE IF NOT EXISTS users (
	id		UUID			PRIMARY KEY NOT NULL,
	email 	TEXT			NOT NULL UNIQUE,
	created TIMESTAMPTZ 	NOT NULL DEFAULT 'now()',
	active 	BOOLEAN			NOT NULL DEFAULT false
);

-- password store
-- if the user has configured a password, it is stored here
CREATE TABLE IF NOT EXISTS auth_password (
	user_id  UUID 	NOT NULL REFERENCES users(id),
	password TEXT 	NOT NULL
);

-- +goose Down
DROP TABLE IF EXISTS auth_password;
DROP TABLE IF EXISTS users;

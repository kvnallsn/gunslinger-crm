-- +goose Up
CREATE TYPE permission AS ENUM ('public', 'read', 'edit', 'owner');

-- users table
-- stores all active and inactive users of this application
CREATE TABLE IF NOT EXISTS users (
	id			UUID			PRIMARY KEY NOT NULL,
	email 		TEXT			NOT NULL UNIQUE,
	username	TEXT			NOT NULL UNIQUE,
	created 	TIMESTAMPTZ 	NOT NULL DEFAULT now(),
	modified	TIMESTAMPTZ		NOT NULL DEFAULT now(),
	active 		BOOLEAN			NOT NULL DEFAULT false,
	admin		BOOLEAN			NOT NULL DEFAULT false
);

-- password store
-- if the user has configured a password, it is stored here
CREATE TABLE IF NOT EXISTS auth_password (
	user_id  	UUID 			NOT NULL UNIQUE REFERENCES users(id),
	password 	TEXT 			NOT NULL,
	changed		TIMESTAMPTZ		NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS groups (
	id			UUID			PRIMARY KEY NOT NULL,
	name		TEXT			NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS group_members (
	group_id	UUID			NOT NULL REFERENCES groups(id),
	user_id 	UUID 			NOT NULL REFERENCES users(id),
	level		permission 		NOT NULL DEFAULT 'public',
	PRIMARY KEY(group_id, user_id)
);

-- +goose Down
DROP TABLE IF EXISTS group_members;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS auth_password;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS permission;
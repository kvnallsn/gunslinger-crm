-- +goose Up
-- various grades/titles (Mr., Mrs. Dr.)
CREATE TABLE IF NOT EXISTS grades (
	id			UUID	PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
	name		TEXT 	NOT NULL UNIQUE
);

-- different organizations a contact can belong to
CREATE TABLE IF NOT EXISTS organizations (
	id			UUID 	PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
	name		TEXT 	NOT NULL UNIQUE
);

-- base / locations table
-- stores common locations shared between engagements and contacts
CREATE TABLE IF NOT EXISTS locations (
	id			UUID 	PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
	city		TEXT 	NOT NULL,
	state		TEXT 	NOT NULL
);

-- types of phone systems (cell, pots, voip, etc.)
CREATE TABLE IF NOT EXISTS contact_phone_types(
	id			UUID 	PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
	name		TEXT	NOT NULL UNIQUE
);

-- types of email providers (gmail, hotmail, etc.)
CREATE TABLE IF NOT EXISTS contact_email_types(
	id			UUID 	PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
	name		TEXT	NOT NULL UNIQUE
);

-- stores all contacts/persons of interest
CREATE TABLE IF NOT EXISTS contacts (
	id			UUID	PRIMARY KEY NOT NULL,
	user_id 	UUID 	REFERENCES users(id),
	last_name 	TEXT 	NOT NULL,
	first_name 	TEXT 	NOT NULL,
	grade 		UUID 	NOT NULL REFERENCES grades(id),
	location 	UUID 	NOT NULL REFERENCES locations(id),
	org			UUID	NOT NULL REFERENCES organizations(id),
	title		TEXT	NOT NULL,
	metadata	JSONB
);

-- +goose Down
DROP TABLE IF EXISTS contact_phone_types;
DROP TABLE IF EXISTS contact_email_types;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS grades;

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
	last_name 	TEXT 	NOT NULL,
	first_name 	TEXT 	NOT NULL,
	grade 		UUID 	NOT NULL REFERENCES grades(id),
	location 	UUID 	NOT NULL REFERENCES locations(id),
	org			UUID	NOT NULL REFERENCES organizations(id),
	title		TEXT	NOT NULL,
	metadata	JSONB
);

CREATE VIEW contact_details AS
	SELECT
		contacts.id,
		contacts.last_name,
		contacts.first_name,
		contacts.title,
		contacts.metadata,
		grades.id AS grade_id,
		grades.name AS grade,
		locations.id AS location_id,
		locations.city AS city,
		locations.state AS state,
		organizations.id AS org_id,
		organizations.name AS org
	FROM
		contacts
	INNER JOIN
		grades ON grades.id = contacts.grade
	INNER JOIN
		locations ON locations.id = contacts.location
	INNER JOIN
		organizations ON organizations.id = contacts.org;

-- +goose Down
DROP VIEW IF EXISTS contact_details;
DROP TABLE IF EXISTS contact_phone_types;
DROP TABLE IF EXISTS contact_email_types;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS grades;

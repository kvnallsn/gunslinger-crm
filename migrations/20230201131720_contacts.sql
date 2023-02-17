-- +goose Up
-- various grades/titles (GS-15, Maj Gen, etc.)
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

-- types of phone systems (cell, dsn, nsts, tsvoip, etc.)
CREATE TABLE IF NOT EXISTS contact_phone_types(
	id			UUID 	PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
	name		TEXT	NOT NULL UNIQUE
);

-- types of email networks (nipr, sipr, jwics, etc.)
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

INSERT INTO grades (name) VALUES
	('O-1'),
	('O-2'),
	('O-3'),
	('O-4'),
	('O-5'),
	('O-6'),
	('O-7'),
	('O-8'),
	('O-9'),
	('O-10'),
	('GS-9'),
	('GS-10'),
	('GS-11'),
	('GS-12'),
	('GS-13'),
	('GS-14'),
	('GS-15'),
	('SES-1'),
	('SES-2'),
	('SES-3'),
	('SES-4'),
	('SES-5'),
	('E-1'),
	('E-2'),
	('E-3'),
	('E-4'),
	('E-5'),
	('E-6'),
	('E-7'),
	('E-8'),
	('E-9'),
	('W-1'),
	('W-2'),
	('W-3'),
	('W-4'),
	('W-5'),
	('N/A');

INSERT INTO contact_phone_types (name) VALUES
	('DSN'),
	('Cell'),
	('STU-III'),
	('STE'),
	('VoSIP'),
	('SVoIP'),
	('TSVoIP'),
	('NSTS'),
	('Commercial');

INSERT INTO contact_email_types (name) VALUES
	('Personal'),
	('NIPR'),
	('SIPR'),
	('JWICS'),
	('NSANet');

-- +goose Down
DROP VIEW IF EXISTS contact_details;
DROP TABLE IF EXISTS contact_phone_types;
DROP TABLE IF EXISTS contact_email_types;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS grades;

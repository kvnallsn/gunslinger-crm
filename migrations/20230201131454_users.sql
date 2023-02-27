-- +goose Up
-- users table
-- stores all active and inactive users of this application
CREATE TABLE IF NOT EXISTS users (
	id			UUID			PRIMARY KEY NOT NULL,
	email 		TEXT			NOT NULL UNIQUE,
	username	TEXT			NOT NULL UNIQUE,
	created 	TIMESTAMPTZ 	NOT NULL DEFAULT 'now()',
	modified	TIMESTAMPTZ		NOT NULL DEFAULT 'now()',
	active 		BOOLEAN			NOT NULL DEFAULT false,
	admin		BOOLEAN			NOT NULL DEFAULT false
);

-- password store
-- if the user has configured a password, it is stored here
CREATE TABLE IF NOT EXISTS auth_password (
	user_id  	UUID 			NOT NULL UNIQUE REFERENCES users(id),
	password 	TEXT 			NOT NULL,
	changed		TIMESTAMPTZ		NOT NULL DEFAULT 'now()'
);

CREATE TABLE IF NOT EXISTS groups (
	id			UUID			PRIMARY KEY NOT NULL,
	name		TEXT			NOT NULL UNIQUE
);

CREATE TYPE permission AS ENUM ('public', 'read', 'edit', 'owner');

CREATE TABLE IF NOT EXISTS group_members (
	group_id	UUID			NOT NULL REFERENCES groups(id),
	user_id 	UUID 			NOT NULL REFERENCES users(id),
	level		permission 		NOT NULL DEFAULT 'public',
	PRIMARY KEY(group_id, user_id)
);

-- +goose StatementBegin
CREATE VIEW user_groups AS
    SELECT
        user_id,
        array_agg(group_id) AS memberof
    FROM
        group_members
    GROUP BY
        user_id;
-- +goose StatementEnd

-- +goose StatementBegin
CREATE VIEW user_detail AS
	WITH user_groups AS (
		SELECT
			group_members.user_id,
			json_agg(json_build_object(
				'id', groups.id,
				'name', groups.name,
				'level', group_members.level
			)) AS groups
		FROM
			group_members
		INNER JOIN
			groups
			ON groups.id = group_members.group_id
		GROUP BY
			group_members.user_id
	)
	SELECT
		users.id,
		users.email,
		users.username,
		users.created,
		users.modified,
		users.active,
		users.admin,
		user_groups.groups
	FROM
		users
	LEFT JOIN
		user_groups ON
		user_groups.user_id = users.id;
-- +goose StatementEnd

-- +goose StatementBegin
CREATE VIEW group_detail AS
	SELECT
		groups.id,
		groups.name,
		COALESCE(json_agg(json_build_object(
			'id', group_members.user_id,
			'username', users.username,
			'level', group_members.level
		)) FILTER (WHERE group_members.group_id IS NOT NULL), '[]') AS members
	FROM
		groups
	LEFT JOIN
		group_members
		ON
			group_members.group_id = groups.id
	INNER JOIN
		users
		ON
			users.id = group_members.user_id
	GROUP BY
		groups.id
-- +goose StatementEnd

-- +goose Down
DROP VIEW IF EXISTS group_detail;
DROP VIEW IF EXISTS user_detail;
DROP VIEW IF EXISTS user_groups;
DROP TABLE IF EXISTS group_members;
DROP TYPE IF EXISTS permission;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS auth_password;
DROP TABLE IF EXISTS users;

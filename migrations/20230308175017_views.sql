-- +goose Up
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

CREATE VIEW last_contacted AS
    SELECT
        contact_id,
        engagement_id,
        date AS last_contact
    FROM
        engagements
    INNER JOIN
        engagement_contacts
        ON engagement_contacts.engagement_id = engagements.id;

CREATE VIEW user_engagements AS
    SELECT
        engagements.id AS engagement_id,
        contacts.user_id
    FROM
        engagements
    LEFT JOIN
        engagement_contacts
        ON engagement_contacts.engagement_id = engagements.id
    INNER JOIN
        contacts
        ON contacts.id = engagement_contacts.contact_id
    WHERE
        contacts.user_id IS NOT NULL;

CREATE VIEW contact_details AS
	SELECT
		contacts.id,
		contacts.user_id,
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

-- +goose StatementBegin
CREATE OR REPLACE FUNCTION user_contact_details(id uuid)
    RETURNS TABLE (id UUID, user_id UUID, last_name TEXT, first_name TEXT, title TEXT, metadata TEXT, grade_id UUID, grade TEXT, location_id UUID, city TEXT, state TEXT, org_id UUID, org TEXT, last_contact TIMESTAMPTZ)
    LANGUAGE sql AS
$func$
WITH last_contact AS (
    SELECT
        contact_id,
        MAX(last_contact) AS last_contact
    FROM
        last_contacted
    WHERE
        engagement_id IN (
            SELECT engagement_id FROM user_engagements WHERE user_id = $1
        )
    GROUP BY
        contact_id
)
SELECT
    contacts.id,
    contacts.user_id,
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
    organizations.name AS org,
    last_contact.last_contact
FROM
    contacts
INNER JOIN
    grades ON grades.id = contacts.grade
INNER JOIN
    locations ON locations.id = contacts.location
INNER JOIN
    organizations ON organizations.id = contacts.org
LEFT JOIN
    last_contact ON last_contact.contact_id = contacts.id;
$func$;
-- +goose StatementEnd


-- +goose StatementBegin
CREATE VIEW engagement_orgs AS
    SELECT
        engagement_id,
        json_agg(DISTINCT jsonb_build_object(
            'org_id', organizations.id,
            'org_name', organizations.name
        )) AS orgs
    FROM
        engagement_contacts
    INNER JOIN
        organizations
        ON
            organizations.id = engagement_contacts.org_id
    GROUP BY
        engagement_id;
-- +goose StatementEnd

-- +goose StatementBegin
CREATE VIEW engagement_contact_details AS
    SELECT
        engagement_id,
        json_agg(json_build_object(
            'id', contact_details.id,
            'org_id', organizations.id,
            'org', organizations.name,
            'grade', contact_details.grade,
            'lastName', contact_details.last_name,
            'firstName', contact_details.first_name
        )) AS contacts
    FROM
        engagement_contacts
    INNER JOIN
        contact_details
        ON
            contact_details.id = engagement_contacts.contact_id
    INNER JOIN
        organizations
        ON
            organizations.id = engagement_contacts.org_id
    GROUP BY
        engagement_id;
-- +goose StatementEnd

-- +goose StatementBegin
CREATE VIEW engagement_note_details AS
    WITH perms AS (
        SELECT
            note_id, 
            array_agg(group_id) AS groups,
            array_agg(g.name) AS group_names
        FROM
            engagement_note_permissions
        INNER JOIN
            groups AS g
            ON g.id = group_id
        GROUP BY
            note_id
    )
    SELECT
        engagement_notes.id,
        engagement_notes.engagement_id,
        engagement_notes.created_by,
        users.username,
        engagement_notes.public,
        engagement_notes.note,
        perms.groups,
        perms.group_names
    FROM
        engagement_notes
    LEFT JOIN
        perms
        ON perms.note_id = engagement_notes.id
    INNER JOIN
        users
        ON users.id = engagement_notes.created_by;
-- +goose StatementEnd

-- +goose StatementBegin
CREATE VIEW engagement_details AS
    WITH eg_topics AS (
        SELECT 
            engagement_topics.engagement_id,
            json_agg(jsonb_build_object(
                'id', topics.id,
                'topic', topics.topic
            )) AS topics
        FROM
            engagement_topics
        INNER JOIN
            topics
            ON topics.id = engagement_topics.topic_id
        GROUP BY
            engagement_topics.engagement_id
    )
    SELECT
        engagements.id,
        engagements.created_by,
        users.username,
        engagements.date,
        engagements.modified,
        engagement_contact_details.contacts,
        engagement_orgs.orgs,
        eg_topics.topics
    FROM
        engagements
    INNER JOIN
        users
        ON
            users.id = created_by
    INNER JOIN
        engagement_contact_details
        ON
            engagement_contact_details.engagement_id = engagements.id
    INNER JOIN
        engagement_orgs
        ON
            engagement_orgs.engagement_id = engagements.id
    INNER JOIN
        eg_topics
        ON
            eg_topics.engagement_id = engagements.id;
-- +goose StatementEnd

-- +goose Down
DROP FUNCTION user_contact_details;
DROP VIEW IF EXISTS engagement_note_details;
DROP VIEW IF EXISTS engagement_details;
DROP VIEW IF EXISTS engagement_contact_details;
DROP VIEW IF EXISTS engagement_orgs;
DROP VIEW IF EXISTS contact_details;
DROP VIEW IF EXISTS last_contacted;
DROP VIEW IF EXISTS user_engagements;
DROP VIEW IF EXISTS group_detail;
DROP VIEW IF EXISTS user_detail;
DROP VIEW IF EXISTS user_groups;
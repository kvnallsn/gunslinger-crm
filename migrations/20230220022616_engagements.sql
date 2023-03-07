-- +goose Up
CREATE TABLE IF NOT EXISTS topics(
    id          UUID            PRIMARY KEY NOT NULL,
    created_by  UUID            NOT NULL REFERENCES users(id),
    created     TIMESTAMPTZ     NOT NULL DEFAULT 'now()',
    topic       TEXT            NOT NULL
);

CREATE TABLE IF NOT EXISTS engagements(
    id          UUID            PRIMARY KEY NOT NULL,
    date        TIMESTAMPTZ     NOT NULL DEFAULT 'now()',
	created_by  UUID 	        NOT NULL REFERENCES users(id),
    created     TIMESTAMPTZ     NOT NULL DEFAULT 'now()',
    modified    TIMESTAMPTZ     NOT NULL DEFAULT 'now()'
);

CREATE TABLE IF NOT EXISTS engagement_topics(
    engagement_id   UUID        NOT NULL REFERENCES engagements(id),
    topic_id        UUID        NOT NULL REFERENCES topics(id),
    PRIMARY KEY(engagement_id, topic_id)
);

CREATE TABLE IF NOT EXISTS engagement_contacts(
    engagement_id   UUID        NOT NULL REFERENCES engagements(id),
    contact_id      UUID        NOT NULL REFERENCES contacts(id),
    org_id          UUID        NOT NULL REFERENCES organizations(id),
    PRIMARY KEY(engagement_id, contact_id, org_id)
);

CREATE TABLE IF NOT EXISTS engagement_notes(
    id              UUID        PRIMARY KEY NOT NULL,
    engagement_id   UUID        NOT NULL REFERENCES engagements(id),
    created_by      UUID        NOT NULL REFERENCES users(id),
    public          BOOLEAN     NOT NULL DEFAULT true,
    note            TEXT        NOT NULL
);

CREATE TABLE IF NOT EXISTS engagement_note_permissions(
    note_id         UUID        NOT NULL REFERENCES engagement_notes(id),
    group_id        UUID        NOT NULL REFERENCES groups(id),
    PRIMARY KEY(note_id, group_id)
);

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
    SELECT
        engagements.id,
        engagements.created_by,
        users.username,
        engagements.date,
        engagements.modified,
        engagement_contact_details.contacts,
        engagement_orgs.orgs
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
            engagement_orgs.engagement_id = engagements.id;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP VIEW IF EXISTS engagement_note_details;
DROP VIEW IF EXISTS engagement_details;
DROP VIEW IF EXISTS engagement_contact_details;
DROP VIEW IF EXISTS engagement_orgs;
DROP TABLE IF EXISTS engagement_note_permissions;
DROP TABLE IF EXISTS engagement_topics;
DROP TABLE IF EXISTS engagement_notes;
DROP TABLE IF EXISTS engagement_contacts;
DROP TABLE IF EXISTS engagements;
-- +goose StatementEnd

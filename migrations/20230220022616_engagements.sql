-- +goose Up
CREATE TABLE IF NOT EXISTS engagements(
    id          UUID            PRIMARY KEY NOT NULL,
	created_by  UUID 	        NOT NULL REFERENCES users(id),
    topic       TEXT            NOT NULL,
    public      BOOLEAN         NOT NULL DEFAULT true,
    date        TIMESTAMPTZ     NOT NULL DEFAULT 'now()',
    modified    TIMESTAMPTZ     NOT NULL DEFAULT 'now()'
);

CREATE TABLE IF NOT EXISTS engagement_contacts(
    engagement_id   UUID        NOT NULL REFERENCES engagements(id),
    contact_id      UUID        NOT NULL REFERENCES contacts(id),
    PRIMARY KEY(engagement_id, contact_id)
);

CREATE TABLE IF NOT EXISTS engagement_notes(
    id              UUID        PRIMARY KEY NOT NULL,
    engagement_id   UUID        NOT NULL REFERENCES engagements(id),
    public          BOOLEAN     NOT NULL DEFAULT true,
    note            TEXT        NOT NULL
);

CREATE TABLE IF NOT EXISTS engagement_permissions(
    engagement_id       UUID        NOT NULL REFERENCES engagements(id),
    group_id            UUID        NOT NULL REFERENCES groups(id),
    PRIMARY KEY(engagement_id, group_id)
);

-- +goose StatementBegin
CREATE VIEW engagement_contact_details AS
    SELECT
        engagement_id,
        json_agg(json_build_object(
            'id', id,
            'grade', grade,
            'lastName', last_name,
            'firstName', first_name
        )) AS contacts
    FROM
        engagement_contacts
    INNER JOIN
        contact_details
        ON
            contact_details.id = engagement_contacts.contact_id
    GROUP BY
        engagement_id;
-- +goose StatementEnd

-- +goose StatementBegin
CREATE VIEW engagement_details AS
    WITH perms AS (
        SELECT
            engagement_id,
            array_agg(group_id) AS groups
        FROM
            engagement_permissions
        GROUP BY
            engagement_id
    )
    SELECT
        id,
        created_by,
        topic,
        date,
        public,
        modified,
        contacts,
        groups
    FROM
        engagements
    INNER JOIN
        engagement_contact_details
        ON
            engagement_contact_details.engagement_id = id
    INNER JOIN 
        perms
        ON
            perms.engagement_id = id;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP VIEW IF EXISTS engagement_details;
DROP VIEW IF EXISTS engagement_contact_details;
DROP TABLE IF EXISTS engagement_permissions;
DROP TABLE IF EXISTS engagement_notes;
DROP TABLE IF EXISTS engagement_contacts;
DROP TABLE IF EXISTS engagements;
-- +goose StatementEnd

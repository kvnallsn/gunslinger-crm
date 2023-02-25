-- +goose Up
CREATE TABLE IF NOT EXISTS engagements(
    id          UUID            PRIMARY KEY NOT NULL,
	created_by  UUID 	        NOT NULL REFERENCES users(id),
    topic       TEXT            NOT NULL,
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
    public          BOOLEAN     NOT NULL DEFAULT false,
    TEXT            TEXT        NOT NULL
);

CREATE TABLE IF NOT EXISTS engagement_notes_access(
    engagement_notes_id     UUID        NOT NULL REFERENCES engagement_notes(id),
    group_id                UUID        NOT NULL REFERENCES groups(id),
    PRIMARY KEY(engagement_notes_id, group_id)
);

-- +goose StatementBegin
CREATE VIEW engagement_details AS
    WITH contact_json AS (
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
            engagement_id
    )
    SELECT
        id,
        created_by,
        topic,
        date,
        modified,
        contacts
    FROM
        engagements
    INNER JOIN
        contact_json
        ON
            contact_json.engagement_id = id;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP VIEW IF EXISTS engagement_details;
DROP TABLE IF EXISTS engagement_notes_access;
DROP TABLE IF EXISTS engagement_notes;
DROP TABLE IF EXISTS engagement_contacts;
DROP TABLE IF EXISTS engagements;
-- +goose StatementEnd

-- +goose Up
CREATE TABLE IF NOT EXISTS engagements(
    id          UUID            PRIMARY KEY NOT NULL,
	user_id     UUID 	        NOT NULL REFERENCES users(id),
    topic       TEXT            NOT NULL,
    date        TIMESTAMPTZ     NOT NULL DEFAULT 'now()',
    notes       TEXT
);

CREATE TABLE IF NOT EXISTS engagement_contacts(
    engagement_id   UUID        NOT NULL REFERENCES engagements(id),
    contact_id      UUID        NOT NULL REFERENCES contacts(id),
    PRIMARY KEY(engagement_id, contact_id)
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
        topic,
        date,
        notes,
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
DROP TABLE IF EXISTS engagement_contacts;
DROP TABLE IF EXISTS engagements;
-- +goose StatementEnd

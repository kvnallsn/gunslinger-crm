-- +goose Up
CREATE TABLE IF NOT EXISTS topics(
    id          UUID            PRIMARY KEY NOT NULL,
    created_by  UUID            NOT NULL REFERENCES users(id),
    created     TIMESTAMPTZ     NOT NULL DEFAULT 'now()',
    topic       TEXT            NOT NULL
);

CREATE TABLE IF NOT EXISTS engagement_methods(
    id          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT            NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS engagements(
    id          UUID            PRIMARY KEY NOT NULL,
    method      UUID            NOT NULL REFERENCES engagement_methods(id),
    title       TEXT            NOT NULL,
    date        TIMESTAMPTZ     NOT NULL DEFAULT 'now()',
    summary     TEXT            NOT NULL,
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

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS engagement_note_permissions;
DROP TABLE IF EXISTS engagement_topics;
DROP TABLE IF EXISTS engagement_notes;
DROP TABLE IF EXISTS engagement_contacts;
DROP TABLE IF EXISTS engagements;
DROP TABLE IF EXISTS engagement_methods;
DROP TABLE IF EXISTs topics;
-- +goose StatementEnd

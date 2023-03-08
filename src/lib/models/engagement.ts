import { AddToQueue } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { Contact } from '.';
import { SqlClient } from '../db';
import { Topic } from './topic';
import User from './user';

interface EngagementContact {
    id: string;
    org_id: string;
    org: string;
    grade: string;
    lastName: string;
    firstName: string;
}

export interface EngagementTopic {
    id: string;
    topic: string;
}

export interface EngagementOrg {
    org_id: string;
    org_name: string;
}

export interface EngagementNote {
    id: string;
    engagement_id: string;
    created_by: string;
    username: string;
    public: boolean;
    note: string;
    groups: string[];
    group_names: string[];
}

interface NewEngagement {
    id?: string;
    user: User;
    date: Date;
    contacts: Contact[];
}

class Engagement {
    id: string;
    created_by: string;
    username: string;
    date: Date;
    created: Date;
    modified: Date;
    contacts: EngagementContact[];
    orgs: EngagementOrg[];
    topics: EngagementTopic[];

    constructor(e: NewEngagement) {
        this.id = e.id || uuidv4();
        this.created_by = e.user.id;
        this.username = e.user.username;
        this.date = e.date;
        this.created = new Date();
        this.modified = new Date();
        this.contacts = e.contacts.map(c => ({
            id: c.id,
            org_id: c.organization.id,
            org: c.organization.name,
            grade: c.grade.name,
            lastName: c.last_name,
            firstName: c.first_name,
        }));

        // dedup the orgs
        let orgs = e.contacts
            .map(c => ({ org_id: c.organization.id, org_name: c.organization.name }));
        this.orgs = orgs.filter((o, idx) => orgs.indexOf(o) !== idx);

        this.topics = [];
    }

    // db: open database connection
    // id: user's unique id
    static async fetchAll(db: SqlClient, id: string): Promise<Engagement[]> {
        const res = await db.query<Engagement>(`
            SELECT
                *
            FROM
                engagement_details
        `);
        return res.rows;
    }

    static async fetch(db: SqlClient, userId: string, id: string): Promise<Engagement> {
        const res = await db.query<Engagement>(`
            SELECT
                *
            FROM
                engagement_details
            WHERE
                id = $1
            LIMIT 1
        `, [id]);
        return res.rows[0];
    }

    static async fetchNotes(db: SqlClient, userId: string, id: string): Promise<EngagementNote[]> {
        const res = await db.query<EngagementNote>(`
            SELECT
                *
            FROM
                engagement_note_details
            WHERE
                engagement_id = $1
                AND
                (
                    groups && (SELECT memberof FROM user_groups WHERE user_id = $2)
                    OR
                    public = true
                )
        `,
            [id, userId]);

        return res.rows;
    }

    static async fetchTopics(db: SqlClient, engagementId: string): Promise<Topic[]> {
        const res = await db.query<Topic>(`
            SELECT
                topics.id,
                topics.created_by,
                topics.created,
                topics.topic
            FROM
                engagement_topics
            INNER JOIN
                topics
                ON
                topics.id = engagement_topics.topic_id
            WHERE
                engagement_id = $1
        `,
            [engagementId]
        );

        return res.rows;
    }

    toJSON() {
        return { ...this };
    }

    async save(tx: SqlClient) {
        await tx.query(`
            INSERT INTO engagements
                (id, created_by, date, created, modified)
            VALUES
                ($1, $2, $3, $4, $5)
            ON CONFLICT (id)
                DO UPDATE
            SET
                date=EXCLUDED.date,
                modified=now()
        `,
            [this.id, this.created_by, this.date, this.created, this.modified]);

        // next insert all contacts
        for (var contact of this.contacts) {
            await tx.query(`
                INSERT INTO engagement_contacts
                    (engagement_id, contact_id)
                VALUES
                    ($1, $2) 
                ON CONFLICT (engagement_id, contact_id)
                    DO NOTHING
            `,
                [this.id, contact.id]);
        }
    }

    async addNote(tx: SqlClient, note: EngagementNote) {
        const noteId = uuidv4();

        await tx.query(`
            INSERT INTO engagement_notes
                (id, engagement_id, public, note)
            VALUES
                ($1, $2, $3, $4)
            ON CONFLICT (id)
                DO UPDATE
                SET
                    public = excluded.public,
                    note = excluded.note
        `, [noteId, this.id, note.public, note.note]);

        for (var group of note.groups) {
            await tx.query(`
                INSERT INTO engagement_notes_permissions
                    (note_id, group_id)
                VALUES
                    ($1, $2)
                ON CONFLICT (note_id, group_id)
                    DO NOTHING
            `, [noteId, group]);
        }
    }
}

export default Engagement;
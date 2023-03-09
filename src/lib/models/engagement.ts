import { AddToQueue } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { Contact } from '.';
import { SqlClient } from '../db';
import { Topic } from './topic';
import User from './user';

export interface EngagementMethod {
    id: string;
    name: string;
}

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

export interface NewEngagementNote {
    created_by: User;
    text: string;
    public: boolean;
    groups?: string[];
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
    method: EngagementMethod,
    title: string;
    date: Date;
    summary: string;
    contacts: Contact[];
    topics: Topic[];
}

class Engagement {
    id: string;
    created_by: string;
    username: string;
    method: EngagementMethod;
    title: string;
    date: Date;
    summary: string;
    created: Date;
    modified: Date;
    contacts: EngagementContact[];
    orgs: EngagementOrg[];
    topics: EngagementTopic[];

    constructor(e: NewEngagement) {
        this.id = e.id || uuidv4();
        this.created_by = e.user.id;
        this.username = e.user.username;
        this.method = e.method;
        this.title = e.title;
        this.date = e.date;
        this.summary = e.summary;
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

        this.topics = e.topics.map((t: Topic) => ({ id: t.id, topic: t.topic }));
    }

    static async Methods(db: SqlClient): Promise<EngagementMethod[]> {
        const res = await db.query<EngagementMethod>('SELECT * FROM engagement_methods ORDER BY name ASC');
        return res.rows;
    }

    // db: open database connection
    // id: user's unique id
    static async fetchAll(db: SqlClient, id: string): Promise<Engagement[]> {
        const res = await db.query<Engagement>('SELECT * FROM engagement_details');
        return res.rows;
    }

    static async fetch(db: SqlClient, userId: string, id: string): Promise<Engagement> {
        const res = await db.query<Engagement>('SELECT * FROM engagement_details WHERE id = $1 LIMIT 1', [id]);
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
                (id, created_by, method, title, date, summary, created, modified)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (id)
                DO UPDATE
            SET
                date=EXCLUDED.date,
                modified=now()
        `,
            [this.id, this.created_by, this.method.id, this.title, this.date, this.summary, this.created, this.modified]);

        // next insert all contacts
        for (var contact of this.contacts) {
            await tx.query(`
                INSERT INTO engagement_contacts
                    (engagement_id, contact_id, org_id)
                VALUES
                    ($1, $2, $3) 
                ON CONFLICT (engagement_id, contact_id, org_id)
                    DO NOTHING
            `,
                [this.id, contact.id, contact.org_id]);
        }

        // now insert topic links
        for (const topic of this.topics) {
            await tx.query(`
                INSERT INTO engagement_topics
                    (engagement_id, topic_id)
                VALUES
                    ($1, $2)
                ON CONFLICT (engagement_id, topic_id)
                    DO NOTHING
            `,
                [this.id, topic.id]);
        }
    }

    async addNote(tx: SqlClient, note: NewEngagementNote) {
        const noteId = uuidv4();

        await tx.query(`
            INSERT INTO engagement_notes
                (id, engagement_id, created_by, public, note)
            VALUES
                ($1, $2, $3, $4, $5)
            ON CONFLICT (id)
                DO UPDATE
                SET
                    public = excluded.public,
                    note = excluded.note
        `, [noteId, this.id, note.created_by.id, note.public, note.text]);

        for (var group of note.groups ?? []) {
            await tx.query(`
                INSERT INTO engagement_note_permissions
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
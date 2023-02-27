import { AddToQueue } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { Contact } from '.';
import { SqlClient } from '../db';
import User from './user';

interface EngagementContact {
    id: string;
    grade: string;
    lastName: string;
    firstName: string;
}

interface EngagementNote {
    text: string;
    public: boolean;
    groups: string[];
}

interface NewEngagement {
    id?: string;
    user: User;
    topic: string;
    public: boolean;
    date: Date;
    contacts: Contact[];
}

class Engagement {
    id: string;
    created_by: string;
    topic: string;
    public: boolean;
    date: Date;
    modified: Date;
    contacts: EngagementContact[];

    constructor(e: NewEngagement) {
        this.id = e.id || uuidv4();
        this.created_by = e.user.id;
        this.topic = e.topic;
        this.public = e.public;
        this.date = e.date;
        this.modified = new Date();
        this.contacts = e.contacts.map(c => ({
            id: c.id,
            grade: c.grade.name,
            lastName: c.last_name,
            firstName: c.first_name,
        }));
    }

    // db: open database connection
    // id: user's unique id
    static async fetchAll(db: SqlClient, id: string): Promise<Engagement[]> {
        const res = await db.query<Engagement>(`
            SELECT
                *
            FROM
                engagement_details
            WHERE
                created_by = $1
                OR
                groups = ANY(SELECT memberof FROM user_groups WHERE user_id = $1)
                OR
                public = true
        `, [id]);
        return res.rows;
    }

    async save(tx: SqlClient) {
        await tx.query(`
            INSERT INTO engagements
                (id, created_by, topic, public, date, modified)
            VALUES
                ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id)
                DO UPDATE
            SET
                topic=EXCLUDED.topic,
                public=EXCLUDED.public,
                date=EXCLUDED.date,
                modified=now()
        `,
            [this.id, this.created_by, this.topic, this.public, this.date, this.modified]);

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
                (id, engagement_id, public, text)
            VALUES
                ($1, $2, $3, $4)
            ON CONFLICT (id)
                DO UPDATE
                SET
                    public = excluded.public,
                    text = excluded.text
        `, [noteId, this.id, note.public, note.text]);

        for (var group of note.groups) {
            await tx.query(`
                INSERT INTO engagement_notes_access
                    (engagement_notes_id, group_id)
                VALUES
                    ($1, $2)
                ON CONFLICT (engagement_notes_id, group_id)
                    DO NOTHING
            `, [noteId, group]);
        }
    }
}

export default Engagement;
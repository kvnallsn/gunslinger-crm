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

interface NewEngagement {
    id?: string;
    user: User;
    topic: string;
    date: Date;
    notes?: string;
    contacts: Contact[];
}

class Engagement {
    id: string;
    user_id: string;
    topic: string;
    date: Date;
    notes?: string;
    contacts: EngagementContact[];

    constructor(e: NewEngagement) {
        this.id = e.id || uuidv4();
        this.user_id = e.user.id;
        this.topic = e.topic;
        this.date = e.date;
        this.notes = e.notes;
        this.contacts = e.contacts.map(c => ({
            id: c.id,
            grade: c.grade.name,
            lastName: c.last_name,
            firstName: c.first_name,
        }));
    }

    static async fetchAll(db: SqlClient): Promise<Engagement[]> {
        const res = await db.query<Engagement>('SELECT * FROM engagement_details');
        return res.rows;
    }

    async save(db: SqlClient) {
        await db.query(`
            INSERT INTO engagements
                (id, user_id, topic, date, notes)
            VALUES
                ($1, $2, $3, $4, $5)
            ON CONFLICT (id)
                DO UPDATE
            SET
                topic=EXCLUDED.topic,
                user_id=EXCLUDED.user_id,
                date=EXCLUDED.date,
                notes=EXCLUDED.notes
        `,
            [this.id, this.user_id, this.topic, this.date, this.notes]);

        // next insert all contacts
        console.log('saving engagement contacts');
        for (var contact of this.contacts) {
            await db.query(`
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
}

export default Engagement;
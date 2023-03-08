import User from "./user";
import { v4 as uuidv4 } from 'uuid';
import { SqlClient } from "../db";

interface NewTopic {
    created_by: User;
    topic: string;
}

export interface ITopic {
    id: string;
    created_by: string;
    created: Date;
    topic: string;
}

export class Topic implements ITopic {
    id: string;
    created_by: string;
    created: Date;
    topic: string;

    private constructor(t: ITopic) {
        this.id = t.id;
        this.created_by = t.created_by;
        this.created = t.created;
        this.topic = t.topic;
    }

    static create(t: NewTopic) {
        return new Topic({
            id: uuidv4(),
            created_by: t.created_by.id,
            created: new Date(),
            topic: t.topic,
        });
    }

    static async fetchAll(db: SqlClient): Promise<Topic[]> {
        const res = await db.query<Topic>('SELECT * FROM topics');
        return res.rows;
    }
}
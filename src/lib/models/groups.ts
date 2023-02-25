import { object } from "yup";
import { v4 as uuidv4 } from 'uuid';
import { SqlClient } from "../db";

interface INewGroup {
    id?: string;
    name: string;
}

export default class Group {
    id: string;
    name: string;
    members: { id: string; username: string; level: string }[];

    constructor(group: INewGroup) {
        this.id = group.id ?? uuidv4();
        this.name = group.name;
        this.members = [];
    }

    static async fetchAll(db: SqlClient): Promise<Group[]> {
        const res = await db.query<Group>(`
            SELECT
                groups.id,
                groups.name,
                COALESCE(json_agg(json_build_object(
                    'id', group_members.user_id,
                    'username', users.username,
                    'level', group_members.level
                )) FILTER (WHERE group_members.group_id IS NOT NULL), '[]') AS members
            FROM
                groups
            LEFT JOIN
                group_members
                ON
                    group_members.group_id = groups.id
            INNER JOIN
                users
                ON
                    users.id = group_members.user_id
            GROUP BY
                groups.id
        `);
        return res.rows;
    }

    async save(tx: SqlClient) {
        await tx.query(`
            INSERT INTO groups
                (id, name)
            VALUES
                ($1, $2)
            ON CONFLICT (id)
                DO UPDATE
                SET
                    name = excluded.name
        `, [this.id, this.name])
    }

    async addMember(tx: SqlClient, userId: string, username: string, permission: string) {
        await tx.query(`
            INSERT INTO group_members
                (group_id, user_id, level)
            VALUES
                ($1, $2, $3)
            ON CONFLICT (group_id, user_id)
                DO UPDATE
                SET
                    level = EXCLUDED.level
        `, [this.id, userId, permission]);

        this.members.push({ id: userId, username: username, level: permission });
    }
}
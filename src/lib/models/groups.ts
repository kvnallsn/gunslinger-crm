import { object } from "yup";
import { v4 as uuidv4 } from 'uuid';
import { SqlClient } from "../db";

export interface GroupMember {
    // user id
    id: string;

    // user's username
    username: string;

    // user's membership level in the group
    level: string;
}
interface NewGroup {
    id?: string;
    name: string;
    members?: GroupMember[];
}

export default class Group {
    id: string;
    name: string;
    members: { id: string; username: string; level: string }[];

    constructor(group: NewGroup) {
        this.id = group.id ?? uuidv4();
        this.name = group.name;
        this.members = group.members ?? [];
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

        return res.rows.map(g => new Group(g));
    }

    static async fetch(db: SqlClient, group_id: string): Promise<Group> {
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
            WHERE
                groups.id = $1
            GROUP BY
                groups.id
        `, [group_id]);

        if (res.rows.length === 0) {
            throw new Error('group not found');
        }

        return new Group(res.rows[0]);
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

    async removeMember(tx: SqlClient, userId: string) {
        await tx.query(`
            DELETE FROM group_members
            WHERE
                group_id = $1
                AND
                user_id = $2
        `, [this.id, userId]);

        // TODO remove from internal list
    }
}
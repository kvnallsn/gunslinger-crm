import type { SqlClient } from './db';
import { boolean, date, InferType, object, string } from 'yup';
import CreateUserForm from '../forms/user';
import { v4 as uuidv4 } from 'uuid';

const UserSchema = object().shape({
    id: string()
        .required()
        .uuid(),

    email: string()
        .required()
        .email(),

    username: string()
        .required('A username is required')
        .min(2, "Must be at least 2 characters")
        .max(30, "Must be less than 30 characters"),

    created: date()
        .required(),

    active: boolean()
        .required()
        .default(false),

    admin: boolean()
        .required()
        .default(false)
});

interface IUser extends InferType<typeof UserSchema> { }

class User implements IUser {
    id: string;
    email: string;
    username: string;
    created: Date;
    active: boolean;
    admin: boolean;

    private constructor(user: IUser) {
        this.id = user.id;
        this.email = user.email;
        this.username = user.username;
        this.created = user.created;
        this.active = user.active;
        this.admin = user.admin;
    }

    static Create(form: CreateUserForm): User {
        return new User({
            id: uuidv4(),
            email: form.email,
            username: form.username,
            created: new Date(),
            active: form.active,
            admin: form.admin
        })
    }

    static async fetchUserByEmail(db: SqlClient, email: string): Promise<User> {
        const r = await db.query<User>('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
        if (r.rows.length == 0) {
            throw new Error(`user with email (${email}) not found`);
        }

        // ensure the schema is accurate
        const user: IUser = await UserSchema.validate(r.rows[0]);
        return new User(user);
    }

    /// Returns the hashed password string
    async fetchPassword(db: SqlClient): Promise<string> {
        const r = await db.query('SELECT password FROM auth_password WHERE user_id = $1 LIMIT 1', [this.id]);
        if (r.rows.length == 0) {
            throw new Error(`no password associated with user (${this.email})`)
        }

        return r.rows[0].password;
    }

    static async fetchAll(db: SqlClient): Promise<User[]> {
        const r = await db.query<User>('SELECT * FROM users');
        return r.rows;
    }

    toJSON() {
        return { ...this };
    }

    async save(tx: SqlClient) {
        await tx.query(`
            INSERT INTO users
                (id, email, username, created, active, admin)
            VALUES
                ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO UPDATE
            SET
                email = EXCLUDED.email,
                username = EXCLUDED.username,
                active = EXCLUDED.active,
                admin = EXCLUDED.admin
        `,
            [this.id, this.email, this.username, this.created, this.active, this.admin]
        );
    }

    async resetPassword(tx: SqlClient, password: string) {
        await tx.query(`
            INSERT INTO auth_password
                (user_id, password)
            VALUES
                ($1, $2)
            ON CONFLICT (user_id)
                DO UPDATE
            SET
                password = EXCLUDED.password
        `,
            [this.id, password]
        );
    }
}

export default User;
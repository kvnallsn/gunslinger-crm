import type { SqlClient } from './db';
import { boolean, date, InferType, object, string } from 'yup';

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
});

interface IUser extends InferType<typeof UserSchema> { }

class User implements IUser {
    id: string;
    email: string;
    username: string;
    created: Date;
    active: boolean;

    private constructor(user: IUser) {
        this.id = user.id;
        this.email = user.email;
        this.username = user.username;
        this.created = user.created;
        this.active = user.active;
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

    toJSON() {
        return { ...this };
    }
}

export default User;
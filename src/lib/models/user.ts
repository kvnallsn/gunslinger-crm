import type { SqlClient } from './db';
import { boolean, date, InferType, object, string } from 'yup';

const UserSchema = object().shape({
    id: string()
        .required()
        .uuid(),

    email: string()
        .required()
        .email(),

    created: date()
        .required(),

    active: boolean()
        .required()
});

interface IUser extends InferType<typeof UserSchema> { }

class User {
    id: string;
    email: string;
    created: Date;
    active: boolean;

    private constructor(user: IUser) {
        this.id = user.id;
        this.email = user.email;
        this.created = user.created;
        this.active = user.active;
    }

    static async fetchUserByEmail(db: SqlClient, email: string): Promise<User> {
        const r = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (r.rows.length == 0) {
            throw new Error(`user with email (${email}) not found`);
        } else if (r.rows.length > 1) {
            throw new Error(`too many rows for email (${email}): non-unique id?`);
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
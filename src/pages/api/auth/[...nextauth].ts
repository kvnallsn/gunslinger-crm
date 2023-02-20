import { getDatabaseConn } from "@/lib/db";
import User from "@/lib/models/user";
import { User as NextUser } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import * as argon2 from '@node-rs/argon2';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email" },
                password: { label: "Password" },
            },
            async authorize(credentials, req): Promise<NextUser | null> {
                let user: NextUser | null = null;
                const db = await getDatabaseConn();

                try {
                    if (!credentials) {
                        throw new Error("missing credential fields");
                    }

                    const sysUser = await User.fetchUserByEmail(db, credentials.email);
                    const hashed = await sysUser.fetchPassword(db);
                    const success = await argon2.verify(hashed, credentials.password);

                    if (success) {
                        user = { id: sysUser.id, name: 'Deltron Zero', email: sysUser.email, image: '' };
                    }
                } catch (error: any) {
                    console.error(error);
                } finally {
                    db.release();
                }

                return user;
            }
        })
    ],
    pages: {
        signIn: '/auth/signin'
    }
};

export default NextAuth(authOptions);
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

                    if (success && sysUser.active) {
                        user = { id: sysUser.id, username: 'Deltron Zero', email: sysUser.email, admin: sysUser.admin };
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
    callbacks: {
        async signIn({ user, account, profile, email, credentials }: any) {
            return true;
        },
        async redirect({ url, baseUrl }: any) {
            return baseUrl;
        },
        async jwt({ token, user, account, profile, isNewUser }: any) {
            if (account) {
                token.admin = user.admin;
            }
            return token;
        },
        async session({ session, token, user }: any) {
            session.user.admin = token.admin;
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin'
    }
};

export default NextAuth(authOptions);
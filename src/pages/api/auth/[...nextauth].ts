import { User } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email" },
                password: { label: "Password" },
            },
            async authorize(credentials, req): Promise<User | null> {
                const user = { id: "1", name: "Deltron Zero", email: "deltron@3030.com", image: '' };
                return user ? user : null;
            }
        })
    ],
    pages: {
        signIn: '/auth/signin'
    }
};

export default NextAuth(authOptions);
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${API_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            return null;
          }
          return {
            id: data.data.id,
            username: data.data.username,
            email: data.data.email,
            mobile: data.data.mobile,
            status: data.data.status,
            accessToken: data.token.accesstoken,
            refreshToken: data.token.refreshtoken,
            permission: data.permission,
            employee: data.employee,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as any;
        token.username = user.username;
        token.email = user.email;
        token.mobile = user.mobile;
        token.status = user.status;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.permission = user.permission;
        token.employee = user.employee;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        username: token.username,
        email: token.email,
        mobile: token.mobile,
        status: token.status,
        permission: token.permission,
        employee: token.employee,
      } as any;

      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },

  pages: {
    signIn: `${API_URL}`,
    signOut: `${API_URL}`,
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },

  jwt: {
    secret: process.env.SECRET_KEY,
  },
};

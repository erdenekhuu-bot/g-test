import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User;
    accessToken: string;
    refreshToken: string;
  }

  interface User extends DefaultUser {
    id: number;
    username: string;
    email: string;
    mobile: string;
    status: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    username: string;
    email: string;
    mobile: string;
    status: string;
    accessToken: string;
    refreshToken: string;
  }
}

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: { label: "username", type: "text" },
//         password: { label: "password", type: "password" },
//       },
//       async authorize(credentials) {
//         try {
//           const res = await fetch(`http://localhost:3000/api/login`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               username: credentials?.username,
//               password: credentials?.password,
//             }),
//           });

//           const data = await res.json();

//           if (res.ok && data.success) {
//             return {
//               id: data.data.id,
//               username: data.data.username,
//               email: data.data.email,
//               mobile: data.data.mobile,
//               status: data.data.status,
//               accessToken: data.token.accesstoken,
//               refreshToken: data.token.refreshtoken,
//             };
//           }
//           console.log(data);
//           return null;
//         } catch (error) {
//           console.log(error);
//           return null;
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id as any;
//         token.username = user.username;
//         token.email = user.email;
//         token.mobile = user.mobile;
//         token.status = user.status;
//         token.accessToken = user.accessToken;
//         token.refreshToken = user.refreshToken;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user = {
//         id: token.id,
//         username: token.username,
//         email: token.email,
//         mobile: token.mobile,
//         status: token.status,
//       } as any;
//       session.accessToken = token.accessToken;
//       session.refreshToken = token.refreshToken;
//       return session;
//     },
//   },

//   pages: {
//     signIn: "/login",
//   },
// });

// export { handler as GET, handler as POST };

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`http://localhost:3000/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
          });

          const data = await res.json();

          if (res.ok && data.success) {
            return {
              id: data.data.id,
              username: data.data.username,
              email: data.data.email,
              mobile: data.data.mobile,
              status: data.data.status,
              accessToken: data.token.accesstoken,
              refreshToken: data.token.refreshtoken,
            };
          }
          console.log(data);
          return null;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id as any;
        token.username = user.username;
        token.email = user.email;
        token.mobile = user.mobile;
        token.status = user.status;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user = {
        id: token.id,
        username: token.username,
        email: token.email,
        mobile: token.mobile,
        status: token.status,
      } as any;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

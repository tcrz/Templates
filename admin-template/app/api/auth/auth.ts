import {
  UserDetails,
  LoginData,
} from "@/lib/types";
import NextAuth, {
  getServerSession,
  NextAuthOptions,
  User,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createApiClient } from "@/lib/apiClient";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Login failed: Email and password are required");
          return null;
        }

        // Dev bypass: accept any credentials without a backend
        if (process.env.NODE_ENV === "development") {
          const userDetails: UserDetails = {
            email: credentials.email,
            token: "dev-token",
            role: "Admin",
            fullName: "Dev User",
          };
          return userDetails as User;
        }

        try {
          const response = await createApiClient<LoginData>("/Auth/login", {
            method: "POST",
            data: {
              email: credentials.email,
              password: credentials.password,
            },
          });

          if (!response.success || !response.data) {
            console.error("Login failed:", response.message);
            return null;
          }

          const loginData = response.data;

          const userDetails: UserDetails = {
            email: loginData.email,
            token: loginData.token,
            role: loginData.role,
            fullName: loginData.fullName,
          };

          return userDetails as User;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60, // 12 hours
  },

  callbacks: {
    async jwt({ user, token, trigger, session }) {
      if (user) {
        const userData = user as UserDetails;
        token.data = userData;
        return token;
      }

      // Handle session updates
      if (trigger === "update") {
        const data = token.data as UserDetails;
        token.data = {
          ...data,
          ...session,
        } as UserDetails;
        return token;
      }

      return token;
    },
    async session({ session, token }) {
      if (!token?.data) {
        console.error("Invalid session token:", token);
        return session;
      }

      // Assign token data to session.user
      session.user = token.data as UserDetails;
      return session;
    },
  },
};

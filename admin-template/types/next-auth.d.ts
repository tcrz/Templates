import { UserDetails } from "@/lib/types";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: UserDetails;
  }

  interface User extends UserDetails {}
}

declare module "next-auth/jwt" {
  interface JWT {
    data?: UserDetails;
  }
}

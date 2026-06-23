import { redirect } from "next/navigation";
import { ROUTES } from "@/constants";

export default function Home() {
  // Middleware redirects authenticated users hitting "/" to the dashboard;
  // this is a fallback for any direct render.
  redirect(ROUTES.DASHBOARD);
}

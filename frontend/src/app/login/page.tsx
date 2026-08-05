import { redirect } from "next/navigation";

/** Canonical login is `/` (app-style). */
export default function LoginPage() {
  redirect("/");
}

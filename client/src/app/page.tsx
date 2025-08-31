import { redirect } from "next/navigation";

export default function Home() {
  redirect("/");
  return null;
}

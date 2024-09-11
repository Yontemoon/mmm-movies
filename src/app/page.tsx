import "./page.module.scss";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Popular from "./Popular";
import Button from "@/components/button/Button";
import StarIcon from "@/components/icons/Star";

export default async function Home() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <>
      <section>
        <h1>Welcome to mmm... movies,</h1>
        <h2>A Website dedicated to tracking your movie</h2>
      </section>
      <Popular />
    </>
  );
}

import "./page.module.scss";

import Button from "@/components/button/Button";
import Card from "@/components/card/Card";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Popular from "./Popular";
import Poster from "@/components/poster/Poster";

export default async function Home() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  return (
    <main>
      <Popular />
    </main>
  );
}

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
    <main>
      <Popular />
      <div>
        <Button type="icon">
          <StarIcon />
        </Button>
      </div>
    </main>
  );
}

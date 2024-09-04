import Button from "@/components/button/Button";
import Card from "@/components/card/Card";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  console.log(data);
  if (error || !data?.user) {
    redirect("/login");
  }
  return (
    <main>
      <p>This is a test</p>
      <Button>testing123</Button>

      <Card>
        <p>This is a card components.</p>
      </Card>
    </main>
  );
}

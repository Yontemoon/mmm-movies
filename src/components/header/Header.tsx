import "./Header.scss";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

const Header = async () => {
  const supabase = createClient();

  const { data: user } = await supabase.auth.getUser();

  return (
    <header className="header-wrapper">
      <Link href="/">
        <div>MMM...movies!</div>
      </Link>
      <div>{user.user?.email || "Login"}</div>
    </header>
  );
};

export default Header;

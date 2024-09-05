import "./Header.scss";
import { createClient } from "@/utils/supabase/server";

const Header = async () => {
  const supabase = createClient();

  const { data: user } = await supabase.auth.getUser();
  console.log(user);

  return (
    <header className="header-wrapper">
      <div>MMM...movies!</div>
      <div>{user.user?.email || "Login"}</div>
    </header>
  );
};

export default Header;

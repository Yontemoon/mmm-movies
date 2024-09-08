import { supabase } from "@/utils/supabase/client";

const getFavorite = async () => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (user.user && user.user.id) {
      const { data: favorite, error: favError } = await supabase.from(
        "favorites",
      ).select("*").eq(
        "user_id",
        user.user.id,
      );

      if (favError) {
        throw Error(favError.message);
      }

      return favorite;
    }
  } catch (error) {
    console.error(error);
    return;
  }
};

export default getFavorite;

import { supabase } from "@/utils/supabase/client";

const getWatchlist = async () => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (user.user && user.user.id) {
      const { data: watchlist, error: watchlistError } = await supabase.from(
        "watchlist",
      ).select("*").eq(
        "user_id",
        user.user.id,
      );

      if (watchlistError) {
        throw new Error(watchlistError.message);
      }

      return watchlist;
    }
  } catch (error) {
    console.error(error);
    return;
  }
};

export default getWatchlist;

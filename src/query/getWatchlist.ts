import { supabase } from "@/utils/supabase/client";

const getWatchlist = async () => {
  try {
    const { data: userId } = await supabase.auth.getUser();
    console.log(userId.user);
    const { data: watchlist, error: watchlistError } = await supabase.from(
      "watchlist",
    ).select("*").eq(
      "user_id",
      userId.user.id,
    );

    if (watchlistError) {
      throw new Error(watchlistError.message);
    }

    return watchlist;
  } catch (error) {
    console.error(error);
    return;
  }
};

export default getWatchlist;

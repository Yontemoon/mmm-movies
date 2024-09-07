import { TMovie } from "@/types/tmdb.types";
import { supabase } from "@/utils/supabase/client";
import insertMovie from "./insertMovie";

const updateWatchlist = async (movieInfo: TMovie) => {
  const userId = await supabase.auth
    .getUser()
    .then((response) => response.data.user?.id);
  const movieId = movieInfo.id;
  if (userId) {
    const checkMovieIsPresent = await insertMovie(movieInfo);
    if (checkMovieIsPresent) {
      const { data: isInWatchlist, error } = await supabase
        .from("watchlist")
        .select()
        .eq("user_id", userId)
        .eq("movie_id", movieId);

      if (isInWatchlist && isInWatchlist.length === 0) {
        const { data } = await supabase.from("watchlist").insert({
          user_id: userId,
          movie_id: movieId,
        });
      } else {
        const { data } = await supabase
          .from("watchlist")
          .delete()
          .eq("user_id", userId)
          .eq("movie_id", movieId);
      }
      if (error) throw new Error(error.message);
      return isInWatchlist;
    }
  } else {
    // TODO -- WHEN USER IS NOT AUTH
  }
};

export default updateWatchlist;

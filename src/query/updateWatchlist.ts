import { TMovie } from "@/types/tmdb.types";
import { supabase } from "@/utils/supabase/client";
import insertMovie from "./insertMovie";

const updateWatchlist = async (movieInfo: TMovie) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw Error(authError.message);

    const userId = authData.user?.id;
    if (!userId) {
      // Handle the case where the user is not authenticated
      // TODO: Handle when user is not authenticated
      return;
    }

    // Check if the movie is already present
    const isMoviePresent = await insertMovie(movieInfo);
    if (!isMoviePresent) return;

    const movieId = movieInfo.id;

    // Check if the movie is already in the user's watchlist
    const { data: isInWatchlist, error: selectError } = await supabase
      .from("watchlist")
      .select()
      .eq("user_id", userId)
      .eq("movie_id", movieId);

    if (selectError) throw Error(selectError.message);

    if (isInWatchlist?.length === 0) {
      const { error: insertError } = await supabase.from("watchlist").insert({
        user_id: userId,
        movie_id: movieId,
      });
      if (insertError) throw Error(insertError.message);
    } else {
      const { error: deleteError } = await supabase
        .from("watchlist")
        .delete()
        .eq("user_id", userId)
        .eq("movie_id", movieId);
      if (deleteError) throw Error(deleteError.message);
    }

    return isInWatchlist;
  } catch (error) {
    console.error("Error updating watchlist:", error);
    throw error;
  }
};

export default updateWatchlist;

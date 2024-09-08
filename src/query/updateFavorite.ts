import { TMovie } from "@/types/tmdb.types";
import { supabase } from "@/utils/supabase/client";
import insertMovie from "./insertMovie";

const updateFavorite = async (movieInfo: TMovie) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw Error(authError.message);

    const userId = authData.user.id;
    if (userId) {
      const movieId = movieInfo.id;
      const isMoviePresent = await insertMovie(movieInfo);
      if (!isMoviePresent) return;

      const { data: isFavorite, error: favError } = await supabase.from(
        "favorites",
      ).select().eq("movie_id", movieId).eq(
        "user_id",
        userId,
      );
      if (favError) {
        throw Error(favError.message);
      }
      if (isFavorite.length === 0) {
        const { error: insertError } = await supabase.from("favorites").insert({
          movie_id: movieId,
          user_id: userId,
        });

        if (insertError) throw Error(insertError.message);
      } else {
        const { error: insertError } = await supabase.from("favorites").delete()
          .eq("movie_id", movieId).eq(
            "user_id",
            userId,
          );
        if (insertError) throw Error(insertError.message);
      }
      return isMoviePresent;
    }
  } catch (error) {
    console.error("error updating favorite", error);
    throw error;
  }
};

export default updateFavorite;

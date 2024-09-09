import { TMovie } from "@/types/tmdb.types";
import { supabase } from "@/utils/supabase/client";
import insertMovie from "./insertMovie";
import { roundToWhole, toTimestamptz } from "@/utils/helper";
import { equal } from "assert";

type PropTypes = {
  movie: TMovie;
  rating: number;
};

const updateRating = async ({ movie, rating }: PropTypes) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw Error(authError.message);

    const userId = authData.user?.id;
    if (!userId) {
      // Handle the case where the user is not authenticated
      // TODO: Handle when user is not authenticated
      return;
    }

    const isMoviePresent = await insertMovie(movie);
    if (!isMoviePresent) return;

    const movieId = movie.id;

    const { data: ratingInfo, error: insertError } = await supabase.from(
      "ratings",
    ).upsert({
      user_id: userId,
      movie_id: movieId,
      rating_number: roundToWhole(rating * 2),
      created_at: toTimestamptz(new Date()),
    }, {
      onConflict: "user_id, movie_id",
    })
      .select();
    if (insertError) throw Error(insertError.message);
    return ratingInfo;
  } catch (error) {
    console.error("Error updating rating:", error);
    throw error;
  }
};

export default updateRating;

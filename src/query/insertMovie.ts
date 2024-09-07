import { TMovie } from "@/types/tmdb.types";
import { supabase } from "@/utils/supabase/client";

const insertMovie = async (movieInformation: TMovie): Promise<boolean> => {
  try {
    // Check if the movie is already present
    const { data: moviePresent, error: movieError } = await supabase
      .from("movies")
      .select("movie_id")
      .eq("movie_id", movieInformation.id);

    if (movieError) {
      throw new Error(`Error checking movie presence: ${movieError.message}`);
    }
    if (moviePresent?.length) return true;

    const { error: insertError } = await supabase.from("movies").insert({
      movie_id: movieInformation.id,
      backdrop_path: movieInformation.backdrop_path,
      genre_ids: movieInformation.genre_ids,
      original_language: movieInformation.original_language,
      overview: movieInformation.overview,
      popularity: movieInformation.popularity,
      poster_path: movieInformation.poster_path,
      release_date: movieInformation.release_date,
      title: movieInformation.title,
      video: movieInformation.video,
      vote_average: movieInformation.vote_average,
      vote_count: movieInformation.vote_count,
    });

    if (insertError) {
      throw new Error(`Error inserting movie: ${insertError.message}`);
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default insertMovie;

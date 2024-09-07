import { Tables } from "@/types/supabase.types";

export const checkIsInWatchlist = (
  moviesList: Tables<"watchlist">[],
  movieId: number,
) => {
  if (Array.isArray(moviesList)) {
    const isInList = moviesList.some((m) => m.movie_id === movieId);
    if (isInList) return true;
    return false;
  }
};

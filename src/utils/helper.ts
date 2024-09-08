import { TSFavorites, TSRating, TSWatchlist } from "@/types/supabase.types";

export const checkIsInWatchlist = (
  moviesList: TSWatchlist[],
  movieId: number,
) => {
  if (Array.isArray(moviesList)) {
    const isInList = moviesList.some((m) => m.movie_id === movieId);
    if (isInList) return true;
    return false;
  }
};

export function isInList(
  list: TSWatchlist[] | TSFavorites[] | TSRating[],
  movieId: number,
) {
  if (Array.isArray(list)) {
    const isInList = list.some((m) => m.movie_id === movieId);
    if (isInList) {
      return true;
    }
    return false;
  }
  return false;
}

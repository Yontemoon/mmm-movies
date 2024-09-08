import { Tables } from "./supabaseSchema.types";

export type TSWatchlist = Tables<"watchlist">;
export type TSFavorites = Tables<"favorites">;
export type TSMovies = Tables<"movies">;
export type TSRating = Tables<"ratings">;

export type TSUsersList = {
  watchlist: TSWatchlist[] | undefined;
  favorites: TSFavorites[] | undefined;
  rating: TSRating[] | undefined;
};

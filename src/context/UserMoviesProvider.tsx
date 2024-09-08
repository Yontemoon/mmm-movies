"use client";

import { useContext, createContext, useMemo } from "react";
import {
  useUserWatchlist,
  useUserFavorite,
  useUserRating,
} from "@/hooks/useUserLists";
import { TSUsersList } from "@/types/supabase.types";

const MovieContext = createContext<TSUsersList | null>(null);

export const useUserMovies = () => {
  return useContext(MovieContext);
};

type PropTypes = {
  children: React.ReactNode;
};

const UserMoviesProvider = ({ children }: PropTypes) => {
  const { data: watchlist } = useUserWatchlist();
  const { data: favorites } = useUserFavorite();
  const { data: rating } = useUserRating();

  const contextValue = useMemo(
    () => ({
      watchlist,
      favorites,
      rating,
    }),
    [watchlist, favorites, rating]
  );

  return (
    <MovieContext.Provider value={contextValue}>
      {children}
    </MovieContext.Provider>
  );
};

export default UserMoviesProvider;

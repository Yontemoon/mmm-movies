"use client";

import { useContext, useState, createContext, useMemo } from "react";

const MovieContext = createContext([]);

export const useUserMovies = () => {
  return useContext(MovieContext);
};

type PropTypes = {
  children: React.ReactNode;
};

const UserMoviesProvider = ({ children }: PropTypes) => {
  const [watchlist, setWatchlist] = useState(null);
  const [favorites, setFavorites] = useState(null);
  const [rated, setRated] = useState(null);

  const contextValue = useMemo(
    () => ({
      watchlist,
      setWatchlist,
      favorites,
      setFavorites,
      rated,
      setRated,
    }),
    [watchlist, setWatchlist, favorites, setFavorites, rated, setRated]
  );

  return (
    <MovieContext.Provider value={contextValue}>
      {children}
    </MovieContext.Provider>
  );
};

export default UserMoviesProvider;

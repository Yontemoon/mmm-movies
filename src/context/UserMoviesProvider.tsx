"use client";

import { useContext, createContext, useMemo } from "react";
import useUserList from "@/hooks/useUserLists";
import { TMovie } from "@/types/tmdb.types";
import { Database } from "@/types/supabase.types";
import { TWatchlist } from "@/types/supabase.types";

const MovieContext = createContext<TWatchlist[] | null>(null);

export const useUserMovies = () => {
  return useContext(MovieContext);
};

type PropTypes = {
  children: React.ReactNode;
};

const UserMoviesProvider = ({ children }: PropTypes) => {
  const { data: movieLists, isLoading, isError } = useUserList();

  // Logging for debugging; this will log undefined until data is fetched successfully.

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(() => movieLists || null, [movieLists]);

  // Optionally handle loading or error states
  // if (isLoading) return <div>Loading...</div>;
  // if (isError) return <div>Error loading movies.</div>;

  return (
    <MovieContext.Provider value={contextValue}>
      {children}
    </MovieContext.Provider>
  );
};

export default UserMoviesProvider;

import "./Poster.scss";
import Image from "next/image";
import { useState } from "react";
import Button from "../button/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TMovie } from "@/types/tmdb.types";
import { useUserMovies } from "@/context/UserMoviesProvider";
import { TSFavorites, TSWatchlist } from "@/types/supabase.types";
import updateWatchlist from "@/query/updateWatchlist";
import { checkIsInWatchlist } from "@/utils/helper";
import updateFavorite from "@/query/updateFavorite";

type PropTypes = {
  movie: TMovie;
};

const Poster = ({ movie }: PropTypes) => {
  const [hovered, setHovered] = useState(false);

  const toggleHover = () => setHovered(!hovered);
  const queryClient = useQueryClient();
  const movies = useUserMovies();
  console.log(movies);
  const watchlistMutation = useMutation({
    mutationFn: updateWatchlist,
    onMutate: async (movie) => {
      await queryClient.cancelQueries({ queryKey: ["watchlist"] });
      const prevWatchlist = queryClient.getQueryData(["watchlist"]);
      const movieId = movie.id;
      queryClient.setQueryData(["watchlist"], (oldWatchlist: TSWatchlist[]) => {
        const isMovieInWatchlist = oldWatchlist.some(
          (m) => m.movie_id === movieId
        );
        if (isMovieInWatchlist) {
          return oldWatchlist.filter((m) => m.movie_id !== movieId);
        } else {
          return [...oldWatchlist, { ...movie, movie_id: movieId }];
        }
      });
      return { prevWatchlist, movieId };
    },
    onError: (error, movieId, context) => {
      if (error) {
        throw Error(error.message);
      }
      queryClient.setQueryData(["watchlist"], context?.prevWatchlist);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: updateFavorite,
    onMutate: async (movie) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      const prevFavorite = queryClient.getQueryData(["favorites"]);
      const movieId = movie.id;
      queryClient.setQueryData(["favorites"], (oldFavorite: TSFavorites[]) => {
        const isMovieInFavorite = oldFavorite.some(
          (m) => m.movie_id === movieId
        );
        if (isMovieInFavorite) {
          return oldFavorite.filter((m) => m.movie_id !== movieId);
        } else {
          return [...oldFavorite, { ...movie, movie_id: movieId }];
        }
      });
      return { prevFavorite, movieId };
    },
    onError: (error, movieId, context) => {
      if (error) {
        throw Error(error.message);
      }
      queryClient.setQueryData(["watchlist"], context?.prevFavorite);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite"] });
    },
    // onMutate: (movie) => {},
    // onError: (error, movie, context) => {
    //   if (error) throw Error(error.message);
    // },
    // onSettled: () => {},
  });

  return (
    <>
      <div
        className="poster-wrapper"
        onMouseEnter={toggleHover}
        onMouseLeave={toggleHover}
      >
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          width={200}
          height={300}
        />
        {hovered && (
          <div className="hover-info">
            <Button onClick={() => watchlistMutation.mutate(movie)}>
              {watchlistMutation.isPending
                ? "Processing..."
                : movies?.watchlist &&
                  checkIsInWatchlist(movies?.watchlist, movie.id)
                ? "Remove to watchlist"
                : "Add to watchlist"}
            </Button>
            {/* TODO -- FAVORITES CHANGES */}
            <Button onClick={() => favoriteMutation.mutate(movie)}>
              Favorites
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Poster;

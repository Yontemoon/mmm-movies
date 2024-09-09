import "./Poster.scss";
import Image from "next/image";
import { useState } from "react";
import Button from "../button/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TMovie } from "@/types/tmdb.types";
import { useUserMovies } from "@/context/UserMoviesProvider";
import { TSFavorites, TSWatchlist } from "@/types/supabase.types";
import updateWatchlist from "@/query/updateWatchlist";
import { isInList } from "@/utils/helper";
import updateFavorite from "@/query/updateFavorite";
import StarRating from "../star_rating/StarRating";

type PropTypes = {
  movie: TMovie;
};

const Poster = ({ movie }: PropTypes) => {
  const [hovered, setHovered] = useState(false);
  const [showStars, setShowStar] = useState<boolean>(false);

  const toggleHover = () => {
    setHovered(!hovered);
    if (showStars) {
      setShowStar(false);
    }
  };
  const queryClient = useQueryClient();
  const movies = useUserMovies();
  const currRating = movies?.rating?.find(
    (m) => m.movie_id === movie.id
  )?.rating_number;

  // console.log(currRating);

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
    onError: (error, _movieId, context) => {
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
      await queryClient.cancelQueries({ queryKey: ["favorite"] });
      const prevFavorite = queryClient.getQueryData(["favorite"]);
      const movieId = movie.id;
      queryClient.setQueryData(["favorite"], (oldFavorite: TSFavorites[]) => {
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
    onError: (error, _movieId, context) => {
      if (error) {
        throw Error(error.message);
      }
      queryClient.setQueryData(["favorite"], context?.prevFavorite);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite"] });
    },
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
                : movies?.watchlist && isInList(movies?.watchlist, movie.id)
                ? "Remove to watchlist"
                : "Add to watchlist"}
            </Button>
            {/* TODO -- FAVORITES CHANGES */}
            <Button onClick={() => favoriteMutation.mutate(movie)}>
              {favoriteMutation.isPending
                ? "Processing..."
                : movies?.favorites && isInList(movies.favorites, movie.id)
                ? "Remove from Favs"
                : "Add to Favs"}
            </Button>
            <Button onClick={() => setShowStar(!showStars)}>Rate me!</Button>
            {showStars && (
              <StarRating startRating={currRating || 0} movie={movie} />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Poster;

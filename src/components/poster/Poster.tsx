import "./Poster.scss";
import Image from "next/image";
import { useState } from "react";
import Button from "../button/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TMovie } from "@/types/tmdb.types";
import { useUserMovies } from "@/context/UserMoviesProvider";
import { Tables } from "@/types/supabase.types";
import updateWatchlist from "@/query/updateWatchlist";
import { checkIsInWatchlist } from "@/utils/helper";

type PropTypes = {
  movie: TMovie;
};

const Poster = ({ movie }: PropTypes) => {
  const [hovered, setHovered] = useState(false);

  const toggleHover = () => setHovered(!hovered);
  const queryClient = useQueryClient();
  const movies = useUserMovies();

  // const isInWatchlist = () => {
  //   if (Array.isArray(movies)) {
  //     const isIn = movies.some((m) => m.movie_id === movie.id);
  //     if (isIn) return true;
  //     return false;
  //   }
  // };

  const mutation = useMutation({
    mutationFn: updateWatchlist,
    onMutate: async (movie) => {
      await queryClient.cancelQueries({ queryKey: ["watchlist"] });
      const prevWatchlist = queryClient.getQueryData(["watchlist"]);
      const movieId = movie.id;
      queryClient.setQueryData(
        ["watchlist"],
        (oldWatchlist: Tables<"watchlist">[]) => {
          const isMovieInWatchlist = oldWatchlist.some(
            (m) => m.movie_id === movieId
          );
          if (isMovieInWatchlist) {
            return oldWatchlist.filter((m) => m.movie_id !== movieId);
          } else {
            return [...oldWatchlist, { ...movie, movie_id: movieId }];
          }
        }
      );
      return { prevWatchlist, movieId };
    },
    onError: (error, movieId, context) => {
      if (error) {
        throw new Error(error.message);
      }
      queryClient.setQueryData(["watchlist"], context?.prevWatchlist);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
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
          <div className="poster-info">
            <Button onClick={() => mutation.mutate(movie)}>
              {mutation.isPending
                ? "Processing..."
                : movies && checkIsInWatchlist(movies, movie.id)
                ? "Remove to watchlist"
                : "Add to watchlist"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Poster;

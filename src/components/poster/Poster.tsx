import "./Poster.scss";
import Image from "next/image";
import { useRef, useState } from "react";
import Button from "../button/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TMovie } from "@/types/tmdb.types";
import { supabase } from "@/utils/supabase/client";
import insertMovie from "@/query/insertMovie";
import { useUserMovies } from "@/context/UserMoviesProvider";

type PropTypes = {
  movie: TMovie;
};

const Poster = ({ movie }: PropTypes) => {
  const [hovered, setHovered] = useState(false);
  const toggleHover = () => setHovered(!hovered);
  const queryClient = useQueryClient();
  const movies = useUserMovies();
  const addToWatchlist = async (movieId: number) => {
    const userId = await supabase.auth
      .getUser()
      .then((response) => response.data.user?.id);
    if (userId) {
      // CHCKEC AND CREATE A MOVIE ROW IF NOT PRESENT:

      const checkMovieIsPresent = await insertMovie(movie);
      if (checkMovieIsPresent) {
        const { data: isInWatchlist, error } = await supabase
          .from("watchlist")
          .select()
          .eq("user_id", userId)
          .eq("movie_id", movieId);

        if (isInWatchlist && isInWatchlist.length === 0) {
          const { data } = await supabase.from("watchlist").insert({
            user_id: userId,
            movie_id: movieId,
          });
        } else {
          const { data } = await supabase
            .from("watchlist")
            .delete()
            .eq("user_id", userId)
            .eq("movie_id", movieId);
        }
        if (error) throw new Error(error.message);
        return isInWatchlist;
      } else {
      }
    }
  };

  const mutation = useMutation({
    mutationFn: async (movieId: number) => await addToWatchlist(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });

  const handleAddToWatchlist = () => {
    mutation.mutate(movie.id);
  };

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
            <Button onClick={handleAddToWatchlist}>
              {mutation.isPending
                ? "Adding to Watchlist..."
                : "Add to watchlist"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Poster;

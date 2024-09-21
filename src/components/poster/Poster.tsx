import "./Poster.scss";
import Image from "next/image";
import { useState, useRef } from "react";
import Button from "../button/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TMovie } from "@/types/tmdb.types";
import { useUserMovies } from "@/context/UserMoviesProvider";
import { TSFavorites, TSWatchlist } from "@/types/supabase.types";
import updateWatchlist from "@/query/updateWatchlist";
import { isInList } from "@/utils/helper";
import updateFavorite from "@/query/updateFavorite";
import StarRating from "../star_rating/StarRating";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import StarIcon from "../icons/Star";
import HeartIcon from "../icons/Heart";
import EyeIcon from "../icons/Eye";
import clsx from "clsx";
import Link from "next/link";
import RatingModal from "../rating_modal/RatingModal";

type PropTypes = {
  movie: TMovie;
};

const Poster = ({ movie }: PropTypes) => {
  const [hovered, setHovered] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => {
    if (!showModal) setHovered(false);
  };

  const wrapperRef = useRef(null);
  const queryClient = useQueryClient();
  const movies = useUserMovies();
  const isInWatchlist =
    movies?.watchlist && isInList(movies?.watchlist, movie.id);
  const isInFavorite =
    movies?.favorites && isInList(movies?.favorites, movie.id);
  const isInRated = movies?.rating && isInList(movies.rating, movie.id);

  const currRating = movies?.rating?.find(
    (m) => m.movie_id === movie.id
  )?.rating_number;

  useOnClickOutside(wrapperRef, () => {
    if (showModal && hovered) {
      setHovered(false);
      setShowModal(false);
    }
  });

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
        className={clsx(
          "poster-wrapper",
          isInFavorite && "poster-favorite",
          isInRated && "poster-rated",
          isInWatchlist && "poster-watchlist"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={wrapperRef}
      >
        <Link href={`/movie/${movie.id}`}>
          <div>
            <Image
              unselectable="on"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={200}
              height={300}
            />
          </div>
        </Link>

        {(hovered || showModal) && (
          <div className="hover-info">
            <div>
              <Button
                size="icon"
                purpose="watchlist"
                onClick={() => watchlistMutation.mutate(movie)}
              >
                {watchlistMutation.isPending ? (
                  "Processing..."
                ) : isInWatchlist ? (
                  <EyeIcon />
                ) : (
                  <EyeIcon />
                )}
              </Button>
              <Button
                size="icon"
                purpose="favorite"
                onClick={() => favoriteMutation.mutate(movie)}
              >
                {favoriteMutation.isPending ? (
                  "Processing..."
                ) : isInFavorite ? (
                  <HeartIcon />
                ) : (
                  <HeartIcon />
                )}
              </Button>
              <Button
                size="icon"
                onClick={() => setShowModal(!showModal)}
                purpose="rating"
              >
                <StarIcon />
              </Button>
              {showModal && (
                // <StarRating startRating={currRating || 0} movie={movie} />
                <RatingModal
                  currentRating={currRating || 0}
                  userMovieInfo={
                    movies?.rating?.find((m) => m.movie_id === movie.id) || null
                  }
                  openModal={showModal}
                  closeModal={() => setShowModal(false)}
                  movie={movie}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Poster;

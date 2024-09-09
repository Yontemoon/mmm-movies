"use client";

import "./StarRating";

import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateRating from "@/query/updateRating";
import { TSRating } from "@/types/supabase.types";
import { TMovie } from "@/types/tmdb.types";
import { roundToWhole, toOneDecimal, toTimestamptz } from "@/utils/helper";

type PropTypes = {
  movie: TMovie;
  startRating: number;
};

const StarRating = ({ startRating, movie }: PropTypes) => {
  const queryClient = useQueryClient();

  const ratingMutation = useMutation({
    mutationFn: updateRating,
    onMutate: async ({ movie, rating }) => {
      await queryClient.cancelQueries({ queryKey: ["rating"] });
      const prevRating = queryClient.getQueryData(["rating"]);
      const movieId = movie.id;
      queryClient.setQueryData(["rating"], (oldRating) => {
        console.log(oldRating);
        if (Array.isArray(oldRating)) {
          const isMovieInRating = oldRating?.some(
            (m) => m.movie_id === movieId
          );

          if (isMovieInRating) {
            return oldRating?.map((m: TSRating) =>
              m.movie_id === movieId
                ? {
                    ...m,
                    rating_number: roundToWhole(rating * 2),
                    created_at: toTimestamptz(new Date()),
                  }
                : m
            );
          } else {
            return [
              ...oldRating,
              {
                movie_id: movieId,
                rating_number: roundToWhole(rating * 2),
                created_at: toTimestamptz(new Date()),
              },
            ];
          }
        }
      });
      return { prevRating, movieId };
    },
    onError: (error, _variables, context) => {
      if (error) {
        throw Error(error.message);
      }
      queryClient.setQueryData(["rating"], context?.prevRating);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["rating"] });
    },
  });

  return (
    <div className="">
      <Rating
        onClick={(rate) => ratingMutation.mutate({ movie, rating: rate })}
        allowFraction={true}
        size={30}
        initialValue={toOneDecimal(startRating / 2)}
        /* Available Props */
      />
    </div>
  );
};

export default StarRating;

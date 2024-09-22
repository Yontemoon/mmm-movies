import "./RatingModal.scss";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import Button from "../button/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TMovie } from "@/types/tmdb.types";
import { Rating } from "react-simple-star-rating";
import {
  roundToWhole,
  toOneDecimal,
  toTimestamptz,
  getTodaysDate,
} from "@/utils/helper";
import updateRating from "@/query/updateRating";
import { TSRating } from "@/types/supabase.types";
import DateInput from "../date_input/DateInput";
import StarRating from "../star_rating/StarRating";

type Proptypes = {
  openModal: boolean;
  closeModal: () => void;
  movie: TMovie;
  userMovieInfo: TSRating | null;
};

type FormData = {
  rating: number;
  review: string | null;
  date_watched: string;
};

const RatingModal = ({
  openModal,
  closeModal,
  movie,
  userMovieInfo,
}: Proptypes) => {
  const ref = useRef<HTMLDialogElement>(null);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  const [rating, setRating] = useState(
    userMovieInfo?.rating_number &&
      toOneDecimal(userMovieInfo.rating_number / 2)
  );
  const [date, setDate] = useState(
    userMovieInfo?.date_watched || getTodaysDate()
  );
  const defaultReview = userMovieInfo?.review || null;

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  const ratingMutation = useMutation({
    mutationFn: updateRating,
    onMutate: async ({ movie, rating, review, dateWatched }) => {
      await queryClient.cancelQueries({ queryKey: ["rating"] });
      const prevRating = queryClient.getQueryData(["rating"]);
      const movieId = movie.id;
      queryClient.setQueryData(["rating"], (oldRating) => {
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
                    review: review,
                    date_watched: dateWatched,
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
                review: review,
                date_watched: dateWatched,
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
      closeModal();
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    const movieRating = data.rating;
    const dateWatched = data.date_watched;
    const movieReview = data.review;
    ratingMutation.mutate({
      movie,
      rating: movieRating,
      review: movieReview,
      dateWatched: dateWatched,
    });
  };

  const handleDateChange = (date: string) => {
    setValue("date_watched", date);
    setDate(date);
  };

  const handleRatingChange = (rating: number) => {
    setValue("rating", rating);
    setRating(rating);
  };

  return (
    <dialog ref={ref} onClose={closeModal} className="modal-container">
      <h1>{movie.title}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <div className="modal-form-details">
          <StarRating onChange={handleRatingChange} initialRating={rating} />
          <DateInput date={date} onChange={handleDateChange} />
        </div>
        <textarea
          {...register("review")}
          defaultValue={defaultReview || undefined}
          rows={8}
        />
        <div className="modal-buttons">
          <Button type="submit" disabled={ratingMutation.isPending}>
            {!ratingMutation.isPending
              ? ratingMutation.isSuccess
                ? "Success!"
                : "Submit"
              : "Submitting..."}
          </Button>
          <Button onClick={closeModal}>Close</Button>
        </div>
      </form>
    </dialog>
  );
};

export default RatingModal;

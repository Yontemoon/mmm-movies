import "./RatingModal.scss";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Button from "../button/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TMovie } from "@/types/tmdb.types";
import {
  roundToWhole,
  toOneDecimal,
  toTimestamptz,
  getTodaysDate,
} from "@/utils/helper";
import updateRating from "@/query/updateRating";
import { TSRating } from "@/types/supabase.types";
import DateInput from "../date_input/DateInput";
import { Rating } from "react-simple-star-rating";

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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const queryClient = useQueryClient();
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      rating: 0,
      review: "",
      date_watched: getTodaysDate(),
    },
  });

  useEffect(() => {
    if (userMovieInfo) {
      reset({
        rating: userMovieInfo?.rating_number
          ? toOneDecimal(userMovieInfo.rating_number / 2)
          : 0,
        review: userMovieInfo?.review || "",
        date_watched: userMovieInfo?.date_watched || getTodaysDate(),
      });
    }
  }, [userMovieInfo, reset]);

  useEffect(() => {
    if (openModal) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
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

  return (
    <dialog ref={dialogRef} onClose={closeModal} className="modal-container">
      <h1>{movie.title}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <div className="modal-form-details">
          <div className="star-rating-container">
            {/* <label className="star-rating-label">Star Rating</label> */}
            <Controller
              name="rating"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Rating
                  initialValue={value}
                  onClick={(rating) => onChange(rating)} // Updating the form state
                  size={35}
                  transition
                  fillColor="#00afb5"
                  emptyColor="#cccccc"
                  className="star-rating"
                  allowFraction={true}
                />
              )}
            />
          </div>
          <Controller
            name="date_watched"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DateInput date={value} onChange={onChange} />
            )}
          />
        </div>
        <textarea
          {...register("review")}
          defaultValue={watch("review") || ""}
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

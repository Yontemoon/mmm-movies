import "./RatingModal.scss";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
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
  } = useForm<FormData>({
    defaultValues: {
      rating:
        (userMovieInfo?.rating_number &&
          toOneDecimal(userMovieInfo.rating_number / 2)) ||
        0,
      review: userMovieInfo?.review || "",
      date_watched: userMovieInfo?.date_watched || getTodaysDate(),
    },
  });

  // const [rating, setRating] = useState(
  //   userMovieInfo?.rating_number &&
  //     toOneDecimal(userMovieInfo.rating_number / 2 || 0)
  // );
  // const [date, setDate] = useState(
  //   userMovieInfo?.date_watched || getTodaysDate()
  // );
  // console.log(date);
  // const defaultReview = userMovieInfo?.review || null;

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
    // setDate(date);
  };

  const handleRatingChange = (rating: number) => {
    setValue("rating", rating);
    // setRating(rating);
  };

  // const handleCloseModal = () => {
  //   const previousRating =
  //     (userMovieInfo?.rating_number &&
  //       toOneDecimal(userMovieInfo?.rating_number / 2)) ||
  //     0;

  //   const previousDateWatched = userMovieInfo?.date_watched || getTodaysDate();
  //   console.log(previousDateWatched);

  //   if (previousRating !== rating) {
  //     setRating(previousRating);
  //   }

  //   if (previousDateWatched !== date) {
  //     setDate(previousDateWatched);
  //   }
  //   closeModal();
  // };

  return (
    <dialog ref={ref} onClose={closeModal} className="modal-container">
      <h1>{movie.title}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <div className="modal-form-details">
          <StarRating
            {...register("rating", { required: true })}
            onChange={(rating) => setValue("rating", rating)}
            initialRating={watch("rating")}
          />
          <DateInput
            {...register("date_watched")}
            date={watch("date_watched")}
            onChange={(date) => setValue("date_watched", date)}
            label="Date Watched"
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

import "./RatingModal.scss";
import { useEffect, useRef, useState, forwardRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import StarRating from "../star_rating/StarRating";
import Button from "../button/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TMovie } from "@/types/tmdb.types";
import { Rating } from "react-simple-star-rating";
import { roundToWhole, toOneDecimal, toTimestamptz } from "@/utils/helper";
import updateRating from "@/query/updateRating";
import { TSRating } from "@/types/supabase.types";

type Proptypes = {
  openModal: boolean;
  closeModal: (value: boolean) => void;
  currentRating: number;
  movie: TMovie;
  userMovieInfo: TSRating | null;
};

type FormData = {
  rating: number;
  review: string | null;
};

const RatingModal = ({
  openModal,
  closeModal,
  currentRating,
  movie,
  userMovieInfo,
}: Proptypes) => {
  const ref = useRef<HTMLDialogElement>(null);

  const queryClient = useQueryClient();

  const ratingMutation = useMutation({
    mutationFn: updateRating,
    onMutate: async ({ movie, rating, review }) => {
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
                    review: review,
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
      handleClose();
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  const [rating, setRating] = useState(currentRating);
  console.log(userMovieInfo);
  const defaultReview = userMovieInfo?.review || null;
  console.log(defaultReview);
  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  const handleClose = () => {
    closeModal(false);
  };

  const onSubmit = (data: FormData) => {
    const movieRating = data.rating;
    const movieReview = data.review;
    ratingMutation.mutate({ movie, rating: movieRating, review: movieReview });
  };

  return (
    <dialog ref={ref} onClose={handleClose} className="modal-container">
      <h1>{currentRating}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Rating
          allowFraction={true}
          size={30}
          onClick={(rate) => {
            const displayedRating = toOneDecimal(rating / 2);

            setRating(displayedRating);
            setValue("rating", rate);
          }}
          initialValue={toOneDecimal(rating / 2)}
        />

        <textarea
          {...register("review")}
          defaultValue={defaultReview || undefined}
        />
        <div>
          <Button type="submit" disabled={ratingMutation.isPending}>
            {!ratingMutation.isPending
              ? ratingMutation.isSuccess
                ? "Success!"
                : "Submit"
              : "Submitting..."}
          </Button>
          <Button onClick={handleClose}>Close</Button>
        </div>
      </form>
    </dialog>
  );
};

export default RatingModal;

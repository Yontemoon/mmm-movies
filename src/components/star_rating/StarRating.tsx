import { useState } from "react";
import { Rating } from "react-simple-star-rating";
import "./StarRating.scss";
import { toOneDecimal } from "@/utils/helper";

type PropTypes = {
  label?: string;
  initialRating?: number;
  onChange: (rating: number) => void;
};

const StarRating = ({
  label = "Star Rating",
  initialRating,
  onChange,
}: PropTypes) => {
  return (
    <div className="star-rating-container">
      {label && <label className="star-rating-label">{label}</label>}
      <Rating
        onClick={(number) => onChange(number)}
        initialValue={initialRating}
        size={35}
        transition
        fillColor="#00afb5"
        emptyColor="#cccccc"
        className="star-rating"
        allowFraction={true}
      />
    </div>
  );
};

export default StarRating;

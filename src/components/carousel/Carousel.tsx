import Poster from "../poster/Poster";
import { TMovie } from "@/types/tmdb.types";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Card from "../card/Card";

type PropTypes = {
  movies: TMovie[] | undefined;
};

const responsive = {
  xl: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  l: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  m: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
  },
  s: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
  },
};

const CarouselComp = ({ movies }: PropTypes) => {
  return (
    <Card>
      <Carousel responsive={responsive}>
        {movies &&
          movies.map((movie) => (
            <div key={movie.id}>
              <Poster movie={movie} />
            </div>
          ))}
      </Carousel>
    </Card>
  );
};

export default CarouselComp;

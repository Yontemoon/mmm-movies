import "./Poster.scss";
import Image from "next/image";
import { useRef, useState } from "react";

type PropTypes = {
  posterId: string;
  movieTitle: string;
};

const Poster = ({ posterId, movieTitle }: PropTypes) => {
  const [hovered, setHovered] = useState(false);
  const toggleHover = () => setHovered(!hovered);
  return (
    <>
      <div
        className="poster-wrapper"
        onMouseEnter={toggleHover}
        onMouseLeave={toggleHover}
      >
        <Image
          src={`https://image.tmdb.org/t/p/w500${posterId}`}
          alt={movieTitle}
          width={200}
          height={300}
        />
        {hovered && <div className="poster-info">This is a hover</div>}
      </div>
    </>
  );
};

export default Poster;

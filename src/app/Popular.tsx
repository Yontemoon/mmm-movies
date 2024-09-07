"use client";
import { TMovie } from "@/types/tmdb.types";
import styles from "./page.module.scss";
import { useQuery } from "@tanstack/react-query";
import { fetchTMDBData } from "./fetch/popularMovies";
import Poster from "@/components/poster/Poster";

const Popular = () => {
  const {
    data: movies,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["popularMovies"],
    queryFn: () =>
      fetchTMDBData("/movie/popular?language=en-US&page=1&region=US").then(
        (response) => response.results as TMovie[]
      ),
  });
  if (isLoading) {
    return <div>Loading....</div>;
  }

  return (
    <div className={styles.popular_wrapper}>
      {movies &&
        movies.map((movie) => (
          <div key={movie.id}>
            <Poster movie={movie}/>
            <h2>{movie.title}</h2>
          </div>
        ))}
    </div>
  );
};

export default Popular;

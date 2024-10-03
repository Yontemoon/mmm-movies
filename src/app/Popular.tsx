"use client";

import { TMovie } from "@/types/tmdb.types";
import styles from "./page.module.scss";
import { useQueries } from "@tanstack/react-query";
import { fetchTMDBData } from "../fetch/popularMovies";
import CarouselComp from "@/components/carousel/Carousel";
import Loader from "@/components/loader/Loader";
import { useToast } from "@/context/toast/ToastProvider";

const movieQueries = [
  { key: "popularMovies", endpoint: "/movie/popular" },
  { key: "upcomingMovies", endpoint: "/movie/upcoming" },
  { key: "topRatedMovies", endpoint: "/movie/top_rated" },
];

const Popular = () => {
  const { addToast } = useToast();
  const results = useQueries({
    queries: movieQueries.map(({ key, endpoint }) => ({
      queryKey: [key],
      queryFn: async () => {
        const response = await fetchTMDBData(endpoint);
        return response.results as TMovie[];
      },
    })),
  });

  const [popular, upcoming, topRated] = results;
  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);

  // if (isLoading) return <Loader />;
  if (isError) return <div>Error loading data.</div>;

  const handleToast = () => {
    addToast("Hello world");
  };

  return (
    <section className={styles.popular_wrapper}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <button onClick={handleToast}>click me</button>
          <h1>Popular</h1>
          <CarouselComp movies={popular.data} />
          <h1>Upcoming</h1>
          <CarouselComp movies={upcoming.data} />
          <h1>Top Rated</h1>
          <CarouselComp movies={topRated.data} />
        </>
      )}
    </section>
  );
};

export default Popular;

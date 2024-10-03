"use client";
import "./page.modules.scss";
import { TMovie } from "@/types/tmdb.types";
import styles from "./page.modules.scss";
import { useQueries } from "@tanstack/react-query";
import { fetchTMDBData } from "../fetch/popularMovies";
import CarouselComp from "@/components/carousel/Carousel";
import Loader from "@/components/loader/Loader";
import { useToast } from "@/context/toast/ToastProvider";
import Poster from "@/components/poster/Poster";
import Card from "@/components/card/Card";

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
          <Card>
            <div className="popular-wrapper">
              {popular.data &&
                popular.data.map((movie) => (
                  <div key={movie.id}>
                    <Poster movie={movie} />
                  </div>
                ))}
            </div>
          </Card>

          <h1>Upcoming</h1>
          <Card>
            <div className="popular-wrapper">
              {upcoming.data &&
                upcoming.data.map((movie) => (
                  <div key={movie.id}>
                    <Poster movie={movie} />
                  </div>
                ))}
            </div>
          </Card>
          <h1>Top Rated</h1>
          <Card>
            <div className="popular-wrapper">
              {topRated.data &&
                topRated.data.map((movie) => (
                  <div key={movie.id}>
                    <Poster movie={movie} />
                  </div>
                ))}
            </div>
          </Card>
        </>
      )}
    </section>
  );
};

export default Popular;

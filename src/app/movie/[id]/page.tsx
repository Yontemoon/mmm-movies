"use client";

import { fetchTMDBData } from "@/fetch/popularMovies";
import "./page.module.scss";
import { useQueries } from "@tanstack/react-query";
import Loader from "@/components/loader/Loader";

const MoviePage = ({ params }: { params: { id: string } }) => {
  const movieId = params.id;

  const queries = [
    { key: ["movie", Number(movieId)], endpoint: `/movie/${movieId}` },
    {
      key: ["movie-recommendations", movieId],
      endpoint: `/movie/${movieId}/recommendations`,
    },
  ];

  const results = useQueries({
    queries: queries.map(({ key, endpoint }) => ({
      queryKey: key,
      queryFn: async () => {
        const response = await fetchTMDBData(endpoint);
        if (response.results) {
          return response.results;
        }
        return response;
      },
    })),
  });
  console.log(results);

  const [movieDetails, movieRecommendations] = results;
  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);

  if (isLoading) return <Loader />;
  if (isError) return <div>Error loading data.</div>;
  return <>{JSON.stringify(movieRecommendations)}</>;
};

export default MoviePage;

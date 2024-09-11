import { fetchTMDBData } from "@/fetch/popularMovies";
import { TMovie } from "@/types/tmdb.types";
import { useQuery } from "@tanstack/react-query";

const useFetchMovies = (queryKey: string, endpoint: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const response = await fetchTMDBData(endpoint);
      return response.results as TMovie[];
    },
  });
};

export default useFetchMovies;

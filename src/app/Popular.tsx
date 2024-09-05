"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTMDBData } from "./fetch/popularMovies";

const Popular = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["popularMovies"],
    queryFn: () =>
      fetchTMDBData("/movie/popular?language=en-US&page=1&region=US"),
  });
  console.log(data);
  return <div></div>;
};

export default Popular;

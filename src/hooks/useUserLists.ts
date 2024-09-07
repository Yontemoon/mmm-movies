import { useQuery } from "@tanstack/react-query";
import getWatchlist from "@/query/getWatchlist";

const useUserList = () => {
  const userList = useQuery({
    queryKey: ["watchlist", "rating", "favorites"],
    queryFn: () => getWatchlist(),
  });

  return userList;
};

export default useUserList;

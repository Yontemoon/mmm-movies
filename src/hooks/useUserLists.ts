import { useQuery } from "@tanstack/react-query";
import getWatchlist from "@/query/getWatchlist";
import getFavorite from "@/query/getFavorite";
import getRating from "@/query/getRating";

//TODO FIGURE OUT THE WAY TO DO MULI. QUERIES.
const useUserWatchlist = () => {
  const userList = useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const watchlist = await getWatchlist();
      return watchlist;
    },
  });

  return userList;
};

const useUserFavorite = () => {
  const userList = useQuery({
    queryKey: ["favorite"],
    queryFn: async () => {
      const favorite = await getFavorite();
      return favorite;
    },
  });
  return userList;
};

const useUserRating = () => {
  const userList = useQuery({
    queryKey: ["rating"],
    queryFn: async () => {
      const rating = await getRating();
      return rating;
    },
  });
  return userList;
};

export { useUserFavorite, useUserRating, useUserWatchlist };

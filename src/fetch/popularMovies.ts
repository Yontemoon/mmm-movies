export const fetchTMDBData = async (endpoint: string) => {
  const response = await fetch(`https://api.themoviedb.org/3${endpoint}`, {
    headers: {
      Authorization: process.env.NEXT_PUBLIC_AUTHORIZATION!,
      "Content-Type": "application/json",
    },
    // cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch TMDB Data at ${endpoint}`);
  }

  return response.json();
};

import { TSFavorites, TSRating, TSWatchlist } from "@/types/supabase.types";

export function isInList(
  list: TSWatchlist[] | TSFavorites[] | TSRating[],
  movieId: number,
) {
  if (Array.isArray(list)) {
    const isInList = list.some((m) => m.movie_id === movieId);
    if (isInList) {
      return true;
    }
    return false;
  }
  return false;
}

export function roundToWhole(number: number) {
  return Math.round(number);
}

export function toOneDecimal(number: number) {
  return Math.round(number * 10) / 10;
}

export function toTimestamptz(date: Date) {
  // Pad a number to two digits
  const padTo2Digits = (num: number) => String(num).padStart(2, "0");

  // Pad microseconds to six digits
  const padTo6Digits = (num: number) => String(num).padStart(6, "0");

  // Extract date components
  const year = date.getUTCFullYear();
  const month = padTo2Digits(date.getUTCMonth() + 1); // Months are zero-indexed
  const day = padTo2Digits(date.getUTCDate());

  // Extract time components
  const hours = padTo2Digits(date.getUTCHours());
  const minutes = padTo2Digits(date.getUTCMinutes());
  const seconds = padTo2Digits(date.getUTCSeconds());

  // Extract milliseconds and convert to microseconds (string slice to 6 digits)
  const microseconds = padTo6Digits(date.getUTCMilliseconds() * 1000).slice(
    0,
    6,
  );

  // Combine into the desired format
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds}+00`;
}

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
  const padTo2Digits = (num: number) => String(num).padStart(2, "0");
  const padTo6Digits = (num: number) => String(num).padStart(6, "0");
  const year = date.getUTCFullYear();
  const month = padTo2Digits(date.getUTCMonth() + 1);
  const day = padTo2Digits(date.getUTCDate());

  const hours = padTo2Digits(date.getUTCHours());
  const minutes = padTo2Digits(date.getUTCMinutes());
  const seconds = padTo2Digits(date.getUTCSeconds());

  const microseconds = padTo6Digits(date.getUTCMilliseconds() * 1000).slice(
    0,
    6,
  );

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds}+00`;
}

export function getTodaysDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

import { supabase } from "@/utils/supabase/client";

const getRating = async () => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (user.user && user.user.id) {
      const { data: rating, error: ratingError } = await supabase.from(
        "ratings",
      ).select("*").eq(
        "user_id",
        user.user.id,
      );

      if (ratingError) {
        throw Error(ratingError.message);
      }

      return rating;
    }
  } catch (error) {
    console.error(error);
    return;
  }
};

export default getRating;

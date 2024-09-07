import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase/client";

const useUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export default useUser;

import { createClient } from "@supabase/supabase-js";
import { cultureSpot } from "../pages/types";

const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
export const getCulturSpots = async (): Promise<cultureSpot[]> => {
    const response = await await client
        .from("culture_spots")
        .select("*")
        .limit(20);

    const { data, error } = response;
    if (error) {
        throw new Error(error.message);
    }
    return data;
};

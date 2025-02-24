import { createClient } from "@supabase/supabase-js";
import { cultureSpot } from "../pages/types";

const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
export const getCulturSpots = async (
    lan: number,
    lat: number,
): Promise<cultureSpot[]> => {
    const response = await client.rpc("get_nearby_culture_spots", {
        lng: lan,
        lat: lat,
        radius: "20000",
    });

    const { data, error } = response;
    if (error) {
        throw new Error(error.message);
    }
    return data;
};

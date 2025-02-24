import { createClient } from "@supabase/supabase-js";
import { TouristInfoCenter } from "../pages/types";

const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
export const getTouristInfoSpots = async (
    lan: number,
    lat: number,
): Promise<TouristInfoCenter[]> => {
    // Your API call logic here

    const response = await client.rpc("get_nearby_tourist_info_centers", {
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

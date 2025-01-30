import { createClient } from "@supabase/supabase-js";
import { TouristInfoCenter } from "../pages/types";

const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
export const getTouristInfoSpots = async (): Promise<TouristInfoCenter[]> => {
    // Correct query with proper PostGIS syntax
    //       const { data, error } = await client
    //         .from("tourist_info_centers")
    //         .select(
    //           `*,
    //   ST_Distance(
    //     geom,
    //     ST_SetSRID(ST_MakePoint(${position.coords.longitude}, ${position.coords.latitude}), 4326)::geography
    //   ) AS distance_meters
    // `
    //         )
    //         // .filter(
    //         //   "ST_DWithin(geom, ST_SetSRID(ST_MakePoint(${position.coords.longitude}, ${position.coords.latitude}), 4326)::geography, 10000)",
    //         //   "eq",
    //         //   true
    //         // )
    //         .order("distance_meters", { ascending: true });

    // Your API call logic here

    const response = await await client
        .from("tourist_info_centers")
        .select("*")
        .limit(10);

    const { data, error } = response;
    if (error) {
        throw new Error(error.message);
    }
    return data;
};

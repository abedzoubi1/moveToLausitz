import { createClient } from "@supabase/supabase-js";
import { foodEstablishment } from "../pages/types";

const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
export const getFoodEstablishments = async (): Promise<foodEstablishment[]> => {
    const response = await client.rpc("get_nearby_food_establishments", {
        lng: "14.060565",
        lat: "51.673550",
        radius: "20000",
    });

    const { data, error } = response;
    if (error) {
        throw new Error(error.message);
    }
    return data;
};

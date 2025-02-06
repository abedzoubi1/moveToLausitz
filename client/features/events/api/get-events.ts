import { createClient } from "@supabase/supabase-js";
import { Event } from "../pages/types";

const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
export const getEvents = async (): Promise<Event[]> => {
    // const response = await await client
    //     .from("events")
    //     .select("*")
    //     .limit(20);

    const response = await client.rpc("get_nearby_events", {
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

import { createClient } from "@supabase/supabase-js";
import { Trails } from "../pages/types";

const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
export const getTrails = async (): Promise<Trails[]> => {
    const response = await client
        .from("trails")
        .select(
            "*, start_location->>latitude , start_location->>longitude ",
        )
        .limit(20);

    const { data, error } = response;
    if (error) {
        throw new Error(error.message);
    }
    return data;
};

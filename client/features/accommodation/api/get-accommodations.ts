import { createClient } from "@supabase/supabase-js";
import { lodgingBusiness } from "../pages/types";

const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
export const getAccommodation = async (): Promise<lodgingBusiness[]> => {
    const response = await await client
        .from("lodging_business")
        .select("*")
        .limit(20);

    const { data, error } = response;
    if (error) {
        throw new Error(error.message);
    }
    return data;
};

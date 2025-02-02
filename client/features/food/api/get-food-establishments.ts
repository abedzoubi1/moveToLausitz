import { createClient } from "@supabase/supabase-js";
import { foodEstablishment } from "../pages/types";

const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
export const getFoodEstablishments = async (): Promise<foodEstablishment[]> => {
    const response = await await client
        .from("food_establishments")
        .select("*")
        .limit(20);

    const { data, error } = response;
    if (error) {
        throw new Error(error.message);
    }
    return data;
};

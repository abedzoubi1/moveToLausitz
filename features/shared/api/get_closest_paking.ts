import { createClient } from "@supabase/supabase-js";

interface Parking {
    name: string;
    latitude: number | null;
    longitude: number | null;
    free_spots: number | null;
}

const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const getClosestParking = async (
    lat: number,
    lng: number,
): Promise<Parking[]> => {
    const response = await client.rpc("get_closest_parking", {
        lng: lng,
        lat: lat,
    });

    const { data, error } = response;
    if (error) {
        throw new Error(error.message);
    }
    const parkings: Parking[] = data || [];
    // Assuming the results are ordered by distance,
    // return only the closest three.
    return parkings;
};

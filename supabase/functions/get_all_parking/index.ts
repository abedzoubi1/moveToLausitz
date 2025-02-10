import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js";

// Break down the area into smaller chunks
const GRID_SIZE = 4;
const CENTER_LAT = 51.631644;
const CENTER_LON = 14.000000;
const RADIUS_KM = 48;
const KM_PER_LAT = 111.32;
const KM_PER_LON = 85.39;

Deno.serve({}, async (req) => {
  try {
    const url = new URL(req.url);
    const chunkId = parseInt(url.searchParams.get("chunk") || "0");

    if (chunkId >= GRID_SIZE * GRID_SIZE) {
      return new Response(JSON.stringify({ error: "Invalid chunk ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await process_parking_chunk(chunkId);
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

function calculateChunkBounds(chunkId: number) {
  const chunkSize = RADIUS_KM * 2 / GRID_SIZE;
  const row = Math.floor(chunkId / GRID_SIZE);
  const col = chunkId % GRID_SIZE;

  const startLat = CENTER_LAT - RADIUS_KM / KM_PER_LAT +
    (row * chunkSize / KM_PER_LAT);
  const startLon = CENTER_LON - RADIUS_KM / KM_PER_LON +
    (col * chunkSize / KM_PER_LON);

  return {
    lat: startLat + (chunkSize / KM_PER_LAT / 2),
    lon: startLon + (chunkSize / KM_PER_LON / 2),
    radius: Math.ceil(chunkSize * 1000 / 2),
  };
}

async function process_parking_chunk(chunkId: number) {
  const supabaseURL = "https://nwnppjevoiqqnwegsmvr.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53bnBwamV2b2lxcW53ZWdzbXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNDg1MTYsImV4cCI6MjA1MDgyNDUxNn0.xmqYac_6EZPXOdCLrZJOhrdpHaqDaJkTGGD7zWcBGf0";
  const supabase = createClient(supabaseURL, supabaseKey);
  const URL = "https://overpass-api.de/api/interpreter";

  const bounds = calculateChunkBounds(chunkId);

  const query = `
    [out:json][timeout:25];
    (
      way["amenity"="parking"](around:${bounds.radius},${bounds.lat},${bounds.lon});
      node["amenity"="parking"](around:${bounds.radius},${bounds.lat},${bounds.lon});
      relation["amenity"="parking"](around:${bounds.radius},${bounds.lat},${bounds.lon});
    );
    out body;
    >;
    out skel qt;
  `;

  const response = await fetch(URL, {
    method: "POST",
    body: query,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  if (!response.ok) {
    throw new Error(`Overpass API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.elements || data.elements.length === 0) {
    return {
      message: `No parking data found in chunk ${chunkId}`,
      chunk: chunkId,
      bounds,
      stats: { successful_items: 0, failed_items: 0 },
    };
  }

  // First, let's check if the parking_lots table exists and has the right structure
  const { error: checkError } = await supabase
    .from("parking_lots")
    .select("id")
    .limit(1);

  if (checkError) {
    // If table doesn't exist or we don't have access, create it
    const { error: createError } = await supabase.rpc(
      "create_parking_lots_if_not_exists",
    );
    if (createError) {
      throw new Error(`Failed to ensure table exists: ${createError.message}`);
    }
  }

  const parkingData = data.elements
    .filter((element: { lat: any; lon: any; center: any }) =>
      (element.lat && element.lon) || element.center
    )
    .map((
      element: {
        id: { toString: () => any };
        tags: { name: any };
        lat: any;
        center: { lat: any; lon: any };
        lon: any;
      },
    ) => ({
      external_id: element.id.toString(), // Ensure it's a string
      name: element.tags?.name || "Unnamed Parking",
      latitude: element.lat || element.center?.lat,
      longitude: element.lon || element.center?.lon,
      free_spots: -1,
    }));

  if (parkingData.length > 0) {
    // Insert without upsert first to catch any new records
    const { error: insertError } = await supabase
      .from("parking_lots")
      .insert(parkingData)
      .select();

    // If there's a duplicate error, do individual upserts
    if (insertError && insertError.code === "23505") { // Unique violation
      for (const parking of parkingData) {
        const { error: upsertError } = await supabase
          .from("parking_lots")
          .update({
            name: parking.name,
            latitude: parking.latitude,
            longitude: parking.longitude,
            free_spots: parking.free_spots,
          })
          .eq("external_id", parking.external_id);

        if (upsertError) {
          console.error(
            `Error upserting parking lot ${parking.external_id}:`,
            upsertError,
          );
        }
      }
    } else if (insertError) {
      throw new Error(`Database error: ${insertError.message}`);
    }

    return {
      message: `Processed chunk ${chunkId} successfully`,
      chunk: chunkId,
      bounds,
      stats: {
        successful_items: parkingData.length,
        failed_items: 0,
      },
    };
  }

  return {
    message: `No valid parking data in chunk ${chunkId}`,
    chunk: chunkId,
    bounds,
    stats: { successful_items: 0, failed_items: 0 },
  };
}

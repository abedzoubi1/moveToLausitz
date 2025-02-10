// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js";

console.log("Hello from Functions!");

Deno.serve(async (req) => {
  try {
    const tokenData = await process_parking_lots();
    return new Response(
      JSON.stringify({ token: tokenData }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "ss" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/retrive_update_parking_lots' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

async function process_parking_lots() {
  const supabaseURL = Deno.env.get("SP_URL");
  const supabaseKey = Deno.env.get("SP_ANON_KEY");
  if (!supabaseURL || !supabaseKey) {
    throw new Error("Missing Supabase URL or Key");
  }
  const supabase = createClient(supabaseURL, supabaseKey);
  const parkingLots = await get_parking_lots();
  // Insert or update the parking lots in the database
  await supabase.from("parking_lots").upsert(parkingLots, {
    onConflict: "external_id",
  });
  return parkingLots;
}
async function get_parking_lots() {
  const requestURL = Deno.env.get("MTL_URL");
  const key = await get_token();

  if (!requestURL) {
    throw new Error("Missing URL");
  }

  // Fetch data from the API
  const response = await fetch(requestURL, {
    headers: {
      "Authorization": key,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch parking lots: ${response.statusText}`);
  }

  const data = await response.json();

  // Extract parking lots from the response
  const parkingLots = data.result.map((lot: any) => {
    const latestHit = lot.latest_hit.hits.hits[0]._source;
    const id = lot.latest_hit.hits.hits[0]._id;
    return {
      external_id: id, // Use the `id` field from the source
      name: latestHit.name,
      latitude: latestHit.lat,
      longitude: latestHit.lon,
      free_spots: latestHit.free,
    };
  });

  return parkingLots;
}
async function get_token() {
  const oAuth = Deno.env.get("OAUTH_URL");
  const clientId = Deno.env.get("CLIENT_ID");
  const clientSecret = Deno.env.get("CLIENT_SECRET");
  const grant_type = Deno.env.get("GRANT_TYPE");

  if (!oAuth || !clientId || !clientSecret || !grant_type) {
    throw new Error("Missing OAuth URL, Client ID, or Client Secret");
  }
  const response = await fetch(oAuth, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      "client_id": clientId,
      "client_secret": clientSecret,
      "grant_type": grant_type,
    }),
  });
  const data = await response.json();
  return "Bearer " + data.access_token;
}

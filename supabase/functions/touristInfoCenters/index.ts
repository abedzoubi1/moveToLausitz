// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js";

const supabaseUrl = Deno.env.get("SB_URL") || "";
const supabaseKey = Deno.env.get("SB_KEY") || "";
const openDataKey = Deno.env.get("OPEN_DATA_KEY") || "";
const openDataUrl = Deno.env.get("OPEN_DATA_API_URL") || "";

const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async () => {
  try {
    const resp = new Response();
    const data = await fetchTouristInfoCenters();
    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/touristInfoCenters' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \

*/

export const fetchTouristInfoCenters = async () => {
  const entityIds: string[] = (await fetchEntityIds()).flat(); // List of IDs to process
  interface TouristInfoCenter {
    external_id: string;
    type: string;
    name: string | null;
    address: string | null;
    locality: string | null;
    postal_code: string | null;
    country: string | null;
    description: string | null;
    latitude: number | null;
    longitude: number | null;
    telephone: string | null;
    url: string | null;
    license: string | null;
    email: string | null;
    images: string[] | null;
    opening_hours: { [key: string]: string[] } | null;
    keywords: string | null;
    publisher: string | null;
    is_accessible_for_free: boolean | null;
  }

  const results: TouristInfoCenter[] = [];

  for (const id of entityIds) {
    const url = openDataUrl + "/" + id;
    const headers = {
      "Content-Type": "application/ld+json",
      "x-api-key": openDataKey,
      "x-hop": "3",
    };

    try {
      const response = await fetch(url, { headers });
      const data1: any = await response.json();
      const data = data1[0];

      // Extract and structure data
      const item: TouristInfoCenter = {
        external_id: id,
        type: data["@type"]?.join(", "),
        name:
          data["https://schema.org/name"]?.find(
            (name: any) => name["@language"] === "de"
          )?.["@value"] || null,
        address:
          data["https://schema.org/address"]?.[
            "https://schema.org/streetAddress"
          ] || null,
        locality:
          data["https://schema.org/address"]?.[
            "https://schema.org/addressLocality"
          ] || null,
        postal_code:
          data["https://schema.org/address"]?.[
            "https://schema.org/postalCode"
          ] || null,
        country:
          data["https://schema.org/address"]?.[
            "https://schema.org/addressCountry"
          ] || null,
        description:
          data["https://schema.org/description"]?.find(
            (desc: any) => desc["@language"] === "de"
          )?.["@value"] || null,
        latitude:
          data["https://schema.org/geo"]?.["https://schema.org/latitude"]?.[
            "@value"
          ] || null,
        longitude:
          data["https://schema.org/geo"]?.["https://schema.org/longitude"]?.[
            "@value"
          ] || null,
        telephone: data["https://schema.org/telephone"] || null,
        url: data["https://schema.org/url"]?.["@value"] || null,
        license:
          data["https://schema.org/sdLicense"]?.[
            "https://schema.org/license"
          ]?.["@value"] || null,
        email: data["https://schema.org/email"] || null,
        images: extractImages(data["https://schema.org/image"]) || null,
        opening_hours: extractOpeningHoursByDay(
          data["https://schema.org/openingHoursSpecification"]
        ),
        keywords: extractGermanKeywords(data["https://schema.org/keywords"]),
        publisher:
          data["https://schema.org/sdPublisher"]?.["https://schema.org/name"] ||
          null,
        is_accessible_for_free:
          data["https://schema.org/isAccessibleForFree"]?.["@value"] || null,
      };
      await supabase
        .from("tourist_info_centers")
        .upsert([item], { onConflict: "external_id" });
      results.push(item);
    } catch (error) {
      console.error("Error fetching data for ID:", id, error);
    }
  }
  return results;
};

const extractGermanKeywords = (keywords?: any[]) => {
  if (!Array.isArray(keywords)) return null;
  return keywords
    .filter(
      (keyword: { "@language": string; "@value": string }) =>
        keyword["@language"] === "de"
    )
    .map((keyword) => keyword["@value"] || "")
    .filter(Boolean)
    .join(", ");
};

const extractImages = (images?: any[]) => {
  if (!images) {
    return [];
  }

  if (!Array.isArray(images)) {
    return [images["https://schema.org/contentUrl"]?.["@value"]].filter(
      Boolean
    );
  }

  return images
    .map((image: any) => image["https://schema.org/contentUrl"]?.["@value"])
    .filter(Boolean);
};

const extractOpeningHoursByDay = (
  specifications?: any[],
  currentDate: Date = new Date()
) => {
  if (!Array.isArray(specifications)) return null;
  const openingHoursByDay: { [key: string]: string[] } = {};

  specifications.forEach((spec: any) => {
    const validFrom = new Date(
      spec["https://schema.org/validFrom"]?.["@value"]
    );
    const validThrough = new Date(
      spec["https://schema.org/validThrough"]?.["@value"]
    );

    if (currentDate >= validFrom && currentDate <= validThrough) {
      const days = Array.isArray(spec["https://schema.org/dayOfWeek"])
        ? spec["https://schema.org/dayOfWeek"].map((day: any) =>
            day["@id"]?.split("/").pop()
          )
        : [spec["https://schema.org/dayOfWeek"]?.["@id"]?.split("/").pop()];
      const opens = spec["https://schema.org/opens"]?.["@value"];
      const closes = spec["https://schema.org/closes"]?.["@value"];
      if (days && opens && closes) {
        const hours = `${opens} - ${closes}`;
        days.forEach((day) => {
          if (day) {
            if (!openingHoursByDay[day]) {
              openingHoursByDay[day] = [];
            }
            openingHoursByDay[day].push(hours);
          }
        });
      }
    }
  });

  return openingHoursByDay;
};

const API_HEADERS = {
  "Content-Type": "application/ld+json",
  "x-api-key": openDataKey,
};
const QUERY_PAYLOAD = {
  "@context": {
    ds: "https://vocab.sti2.at/ds/",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    schema: "https://schema.org/",
    sh: "http://www.w3.org/ns/shacl#",
    xsd: "http://www.w3.org/2001/XMLSchema#",
    odta: "https://odta.io/voc/",
    sq: "http://www.onlim.com/shapequery/",
    "@vocab": "http://www.onlim.com/shapequery/",
  },
  "sq:query": [
    {
      "@type": "https://schema.org/TouristInformationCenter",
      "schema:geo": {
        "@type": "schema:GeoCoordinates",
        "sq:nearby": {
          "sq:latitude": "51.631644",
          "sq:longitude": "14.000000",
          "sq:distance": "48",
        },
      },
    },
  ],
};

// Define the expected API response structure
interface ApiResponse {
  data: Array<{
    "@id": string;
    [key: string]: any;
  }>;
  metaData: {
    total: number;
    [key: string]: any;
  };
}

export async function fetchEntityIds() {
  let currentPage = 1;
  const pageSize = 50;
  let allIds: string[] = [];

  while (true) {
    try {
      const response = await fetch(openDataUrl + "?sortSeed=1", {
        method: "POST",
        headers: {
          ...API_HEADERS,
          "page-size": pageSize.toString(),
          page: currentPage.toString(),
        },
        body: JSON.stringify(QUERY_PAYLOAD),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Type assert the response as ApiResponse
      const data = (await response.json()) as ApiResponse;

      // Map IDs and filter out undefined values
      const ids = data.data
        .map((item) => item["@id"].split("/entity/").pop())
        .filter((id): id is string => id !== undefined);

      allIds = allIds.concat(ids);

      const total = data.metaData.total;
      if (currentPage * pageSize >= total) {
        break;
      }
      currentPage++;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching data:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
      break;
    }
  }
  return allIds;
}

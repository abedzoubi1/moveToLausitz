import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js";

const supabaseUrl = Deno.env.get("SB_URL")?.toString() || "";
const supabaseKey = Deno.env.get("SB_KEY")?.toString() || "";
const openDataKey = Deno.env.get("OPEN_DATA_KEY") || "";
const openDataUrl = Deno.env.get("OPEN_DATA_API_URL") || "";

const supabase = createClient(supabaseUrl, supabaseKey);

interface EventData {
  external_id: string;
  type: string;
  name: string;
  address: string;
  locality: string;
  postal_code: string;
  country: string;
  description: string;
  latitude: number;
  longitude: number;
  telephone: string;
  url: string;
  license: string;
  images: string[] | null;
  start_date: string;
  end_date: string;
  schedule: string;
  keywords: string;
  publisher: string | null;
  is_accessible_for_free: boolean | null;
}

Deno.serve(async () => {
  try {
    const data = await fetchEvents();
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/events' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \

*/

const fetchEvents = async () => {
  // Fetch entity IDs
  const entityIds = await fetchEntityIds();
  //  List of IDs to process
  const results: EventData[] = [];

  for (const id of entityIds) {
    const url = `${openDataUrl}${id}`;
    const headers = {
      "Content-Type": "application/ld+json",
      "x-api-key": "ed541d4ad8f0acee0c592209e8fa2d26",
      "x-hop": "3",
    };

    try {
      const response = await fetch(url, { headers });
      const data = await response.json();
      // Extract and structure data
      const event: EventData = {
        external_id: id,
        type: data[0]["@type"]?.join(", "),
        name:
          data[0]["https://schema.org/name"]?.find(
            (name: any) => name["@language"] === "de"
          )?.["@value"] || null,
        address:
          data[0]["https://schema.org/location"]?.[
            "https://schema.org/address"
          ]?.["https://schema.org/streetAddress"] || null,
        locality:
          data[0]["https://schema.org/location"]?.[
            "https://schema.org/address"
          ]?.["https://schema.org/addressLocality"] || null,
        postal_code:
          data[0]["https://schema.org/location"]?.[
            "https://schema.org/address"
          ]?.["https://schema.org/postalCode"] || null,
        country:
          data[0]["https://schema.org/location"]?.[
            "https://schema.org/address"
          ]?.["https://schema.org/addressCountry"] || null,
        description:
          data[0]["https://schema.org/description"]?.find(
            (desc: any) => desc["@language"] === "de"
          )?.["@value"] || null,
        latitude:
          data[0]["https://schema.org/location"]?.["https://schema.org/geo"]?.[
            "https://schema.org/latitude"
          ]?.["@value"] || null,
        longitude:
          data[0]["https://schema.org/location"]?.["https://schema.org/geo"]?.[
            "https://schema.org/longitude"
          ]?.["@value"] || null,
        telephone: data[0]["https://schema.org/telephone"] || null,
        url: data[0]["https://schema.org/url"]?.["@value"] || null,
        license:
          data[0]["https://schema.org/sdLicense"]?.[
            "https://schema.org/license"
          ]?.["@value"] || null,
        images: extractImages(data[0]["https://schema.org/image"]) || null,
        start_date: data[0]["https://schema.org/startDate"]?.["@value"] || null,
        end_date: data[0]["https://schema.org/endDate"]?.["@value"] || null,
        schedule: data[0]["https://schema.org/eventSchedule"]
          ? JSON.stringify(
              formatSchedulesArray(data[0]["https://schema.org/eventSchedule"])
            )
          : "",
        keywords:
          extractGermanKeywords(data[0]["https://schema.org/keywords"]) || "",
        publisher:
          data[0]["https://schema.org/sdPublisher"]?.[
            "https://schema.org/name"
          ] || null,
        is_accessible_for_free:
          data[0]["https://schema.org/isAccessibleForFree"]?.["@value"] || null,
      };
      await supabase.from("events").upsert(
        {
          external_id: event.external_id,
          type: event.type,
          name: event.name,
          address: event.address,
          locality: event.locality,
          postal_code: event.postal_code,
          country: event.country,
          description: event.description,
          latitude: event.latitude,
          longitude: event.longitude,
          telephone: event.telephone,
          url: event.url,
          license: event.license,
          images: event.images,
          start_date: event.start_date,
          end_date: event.end_date,
          schedule: event.schedule,
          keywords: event.keywords,
          publisher: event.publisher,
          is_accessible_for_free: event.is_accessible_for_free,
        },
        { onConflict: "external_id" }
      );
      results.push(event);
    } catch (error) {
      console.error("Error fetching data for ID:", id, error);
    }
  }
  return results;
};

interface Schedule {
  "https://schema.org/startTime": { "@value": string };
  "https://schema.org/endTime": { "@value": string };
}

interface DaySchedule {
  day: string;
  date: string;
  month: string;
  year: string;
  time: {
    start: string;
    end: string;
  };
  isoDate: string;
}

function formatSchedulesArray(
  scheduleData: Schedule | Schedule[]
): DaySchedule[] {
  // Convert single schedule to array if needed
  const schedules = Array.isArray(scheduleData) ? scheduleData : [scheduleData];

  return schedules
    .map((schedule) => {
      const startDateTime = new Date(
        schedule["https://schema.org/startTime"]["@value"]
      );
      const endDateTime = new Date(
        schedule["https://schema.org/endTime"]["@value"]
      );

      return {
        day: startDateTime.toLocaleDateString("de-DE", { weekday: "long" }),
        date: startDateTime.getDate().toString(),
        month: startDateTime.toLocaleDateString("de-DE", { month: "long" }),
        year: startDateTime.getFullYear().toString(),
        time: {
          start: startDateTime.toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          end: endDateTime.toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        },
        isoDate: startDateTime.toISOString(),
      };
    })
    .sort(
      (a, b) => new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime()
    );
}

//Extracts German Keywords
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

//extracts Images
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
      "@type": "schema:Event",
      "schema:location": {
        "@type": "schema:Place",
        "schema:geo": {
          "@type": "schema:GeoCoordinates",
          "sq:nearby": {
            "sq:latitude": "51.631644",
            "sq:longitude": "14.000000",
            "sq:distance": "48",
          },
        },
      },
      "schema:startDate": {
        "sq:value": "2025-02-01T00:00:00",
        "sq:datatype": "dateTime",
        "sq:op": ">=",
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
// Fetches entity IDs from the Open Data API
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

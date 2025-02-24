import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js";

const supabaseUrl = Deno.env.get("SB_URL")?.toString() || "";
const supabaseKey = Deno.env.get("SB_KEY")?.toString() || "";
const openDataKey = Deno.env.get("OPEN_DATA_KEY") || "";
const openDataUrl = Deno.env.get("OPEN_DATA_API_URL") || "";

const supabase = createClient(supabaseUrl, supabaseKey);

interface cultureSpot {
  external_id: string;
  type: string;
  name: string;
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
  images: string[] | null;
  opening_hours: string;
  keywords: string;
  publisher: string | null;
  is_accessible_for_free: boolean | null;
}

Deno.serve(async () => {
  try {
    const data = await fetchEvents();
    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/culture' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

const fetchEvents = async () => {
  // Fetch entity IDs
  const entityIds = await fetchEntityIds();
  //  List of IDs to process
  const results: cultureSpot[] = [];

  for (const id of entityIds) {
    const url = `${openDataUrl}${id}`;
    const headers = {
      "Content-Type": "application/ld+json",
      "x-api-key": openDataKey,
      "x-hop": "3",
    };

    try {
      const response = await fetch(url, { headers });
      const data = await response.json();
      // Extract and structure data
      const cultureSpot: cultureSpot = {
        external_id: id,
        type: data[0]["@type"]?.join(", "),
        name: data[0]["https://schema.org/name"]?.find(
          (name: any) => name["@language"] === "de",
        )?.["@value"] || null,
        address: data[0]["https://schema.org/address"]?.[
          "https://schema.org/streetAddress"
        ] || null,
        locality: data[0]["https://schema.org/address"]?.[
          "https://schema.org/addressLocality"
        ] || null,
        postal_code: data[0]["https://schema.org/address"]?.[
          "https://schema.org/postalCode"
        ] || null,
        country: data[0]["https://schema.org/address"]?.[
          "https://schema.org/addressCountry"
        ] || null,
        description: data[0]["https://schema.org/description"]?.find(
          (desc: any) => desc["@language"] === "de",
        )?.["@value"] || null,
        latitude:
          data[0]["https://schema.org/geo"]?.["https://schema.org/latitude"]?.[
            "@value"
          ] || null,
        longitude:
          data[0]["https://schema.org/geo"]?.["https://schema.org/longitude"]?.[
            "@value"
          ] || null,
        telephone: data[0]["https://schema.org/telephone"] || null,
        url: data[0]["https://schema.org/url"]?.["@value"] || null,
        license: data[0]["https://schema.org/sdLicense"]?.[
          "https://schema.org/license"
        ]?.["@value"] || null,
        images: extractImages(data[0]["https://schema.org/image"]) || null,
        opening_hours: JSON.stringify(
          extractOpeningHours(
            data[0]["https://schema.org/openingHoursSpecification"],
          ),
        ),
        keywords:
          extractGermanKeywords(data[0]["https://schema.org/keywords"]) || "",
        publisher: data[0]["https://schema.org/sdPublisher"]?.[
          "https://schema.org/name"
        ] || null,
        is_accessible_for_free:
          data[0]["https://schema.org/isAccessibleForFree"]?.["@value"] || null,
      };
      await supabase.from("culture_spots").upsert(
        {
          external_id: cultureSpot.external_id,
          type: cultureSpot.type,
          name: cultureSpot.name,
          address: cultureSpot.address,
          locality: cultureSpot.locality,
          postal_code: cultureSpot.postal_code,
          country: cultureSpot.country,
          description: cultureSpot.description,
          latitude: cultureSpot.latitude,
          longitude: cultureSpot.longitude,
          telephone: cultureSpot.telephone,
          url: cultureSpot.url,
          license: cultureSpot.license,
          images: cultureSpot.images,
          opening_hours: cultureSpot.opening_hours,
          keywords: cultureSpot.keywords,
          publisher: cultureSpot.publisher,
          is_accessible_for_free: cultureSpot.is_accessible_for_free,
        },
        {
          onConflict: "external_id",
        },
      );
      results.push(cultureSpot);
    } catch (error) {
      console.error("Error fetching data for ID:", id, error);
    }
  }
  return results;
};

interface OpeningHoursSpec {
  "@type": string;
  "https://schema.org/closes": { "@value": string };
  "https://schema.org/opens": { "@value": string };
  "https://schema.org/dayOfWeek": Array<{ "@id": string }>;
  "https://schema.org/validFrom": { "@value": string };
  "https://schema.org/validThrough": { "@value": string };
}

function extractOpeningHours(
  specifications: OpeningHoursSpec[] | undefined,
): string {
  if (!specifications || !Array.isArray(specifications)) return "{}";

  const now = new Date();

  // Sort by validFrom date, most recent first
  const sortedSpecs = [...specifications].sort((a, b) => {
    const dateA = new Date(a["https://schema.org/validFrom"]["@value"]);
    const dateB = new Date(b["https://schema.org/validFrom"]["@value"]);
    return dateB.getTime() - dateA.getTime();
  });

  // Get most recent valid or future specification
  const currentSpec = sortedSpecs.find((spec) => {
    const validFrom = new Date(
      spec["https://schema.org/validFrom"]["@value"],
    );
    const validThrough = new Date(
      spec["https://schema.org/validThrough"]["@value"],
    );
    return validThrough >= now;
  }) || sortedSpecs[0];

  if (!currentSpec) return "{}";

  // Format single schedule
  const schedule: Record<string, string> = {};
  const opens = currentSpec["https://schema.org/opens"]["@value"].substring(
    0,
    5,
  );
  const closes = currentSpec["https://schema.org/closes"]["@value"].substring(
    0,
    5,
  );

  currentSpec["https://schema.org/dayOfWeek"].forEach((day) => {
    const dayName = day["@id"].split("/").pop() || "";
    schedule[dayName] = `${opens}-${closes}`;
  });

  return JSON.stringify(schedule);
}

//Extracts German Keywords
const extractGermanKeywords = (keywords?: any[]) => {
  if (!Array.isArray(keywords)) return null;
  return keywords
    .filter(
      (keyword: { "@language": string; "@value": string }) =>
        keyword["@language"] === "de",
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
      Boolean,
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
      "sq:or": [
        {
          "@type": "schema:Church",
        },
        {
          "@type": "schema:TouristAttraction",
        },
        {
          "@type": "schema:Museum",
        },
        {
          "@type": "schema:ArtGallery",
        },
        {
          "@type": "schema:LandmarksOrHistoricalBuildings",
        },
      ],
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

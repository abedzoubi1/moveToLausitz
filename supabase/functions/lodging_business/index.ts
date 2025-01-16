import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js";

const supabaseUrl = Deno.env.get("SB_URL")?.toString() || "";
const supabaseKey = Deno.env.get("SB_KEY")?.toString() || "";
const openDataKey = Deno.env.get("OPEN_DATA_KEY") || "";
const openDataUrl = Deno.env.get("OPEN_DATA_API_URL") || "";

const supabase = createClient(supabaseUrl, supabaseKey);

interface lodgingBusiness {
  external_id: string;
  type: string;
  name: string;
  description: string | null;
  address: string | null;
  locality: string | null;
  postal_code: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  telephone: string | null;
  url: string | null;
  fax: string | null;
  license: string | null;
  images: string[] | null;
  keywords: string;
  publisher: string | null;
  email: string | null;
  pets_allowed: boolean;
}

Deno.serve(async () => {
  try {
    const data = await fetchLodgingBusiness();
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/lodging_business' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

const fetchLodgingBusiness = async () => {
  // Fetch entity IDs
  const entityIds = await fetchEntityIds();

  //  List of IDs to process
  const results: lodgingBusiness[] = [];

  for (const id of entityIds) {
    const url = `${openDataUrl}+"/"+${id}`;
    const headers = {
      "Content-Type": "application/ld+json",
      "x-api-key": openDataKey,
      "x-hop": "3",
    };

    try {
      const response = await fetch(url, { headers });
      const data = await response.json();
      // Extract and structure data
      const lodging_business: lodgingBusiness = {
        external_id: id,
        type: formatType(data[0]["@type"]) || "",
        name:
          data[0]["https://schema.org/name"]?.find(
            (name: any) => name["@language"] === "de"
          )?.["@value"] || null,
        address:
          data[0]["https://schema.org/address"]?.[
            "https://schema.org/streetAddress"
          ] || null,
        locality:
          data[0]["https://schema.org/address"]?.[
            "https://schema.org/addressLocality"
          ] || null,
        postal_code:
          data[0]["https://schema.org/address"]?.[
            "https://schema.org/postalCode"
          ] || null,
        country:
          data[0]["https://schema.org/address"]?.[
            "https://schema.org/addressCountry"
          ] || null,
        description:
          data[0]["https://schema.org/description"]?.find(
            (desc: any) => desc["@language"] === "de"
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
        license:
          data[0]["https://schema.org/sdLicense"]?.[
            "https://schema.org/license"
          ]?.["@value"] || null,
        images: extractImages(data[0]["https://schema.org/image"]) || null,
        pets_allowed:
          data[0]["https://schema.org/petsAllowed"]?.["value"] || false,
        fax: data[0]["https://schema.org/faxNumber"] || null,
        keywords:
          extractGermanKeywords(data[0]["https://schema.org/keywords"]) || "",
        publisher:
          data[0]["https://schema.org/sdPublisher"]?.[
            "https://schema.org/name"
          ] || null,
        email: data[0]["https://schema.org/email"] || null,
      };
      await supabase.from("lodging_business").upsert(
        {
          external_id: lodging_business.external_id,
          type: lodging_business.type,
          name: lodging_business.name,
          address: lodging_business.address,
          locality: lodging_business.locality,
          postal_code: lodging_business.postal_code,
          country: lodging_business.country,
          description: lodging_business.description,
          latitude: lodging_business.latitude,
          longitude: lodging_business.longitude,
          telephone: lodging_business.telephone,
          url: lodging_business.url,
          license: lodging_business.license,
          images: lodging_business.images,
          keywords: lodging_business.keywords,
          publisher: lodging_business.publisher,
          email: lodging_business.email,
          fax: lodging_business.fax,
          pets_allowed: lodging_business.pets_allowed,
        },
        { onConflict: "external_id" }
      );
      results.push(lodging_business);
    } catch (error) {
      console.error("Error fetching data for ID:", id, error);
    }
  }
  return results;
};

function formatType(type: string | string[] | undefined): string {
  if (!type) return "";

  if (Array.isArray(type)) {
    return type.join(", ");
  }

  return type.toString();
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
      "@type": "schema:LodgingBusiness",
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

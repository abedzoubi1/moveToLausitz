export interface cultureSpot {
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

export interface Event {
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

export interface Trails {
    external_id: string;
    type: string;
    name: string;
    description: string;
    start_location: location;
    end_location: location;
    geo_line: string;
    url: string;
    license: string;
    images: string[];
    keywords: string;
    publisher: string;
    type_of_trail: string;
    distance: number;
}

export interface location {
    address: string;
    locality: string;
    postal_code: string;
    country: string;
    region: string;
    latitude: number;
    longitude: number;
}

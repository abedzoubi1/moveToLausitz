export interface lodgingBusiness {
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

export const convertImageUrlsString = (
    imageUrlsString: string | null,
): string[] => {
    if (!imageUrlsString) return [];

    try {
        // Parse the JSON string into an array
        const imageUrls = JSON.parse(imageUrlsString);

        // Ensure it's an array and all elements are strings
        if (Array.isArray(imageUrls)) {
            return imageUrls.filter(
                (url): url is string =>
                    typeof url === "string" && url.length > 0,
            );
        }

        return [];
    } catch (error) {
        console.error("Error parsing image URLs:", error);
        return [];
    }
};

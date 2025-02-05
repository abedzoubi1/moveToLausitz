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

export const parseSchedule = (schedule: any) => {
    if (typeof schedule === "string") {
        try {
            schedule = JSON.parse(schedule);
        } catch (error) {
            console.error("Error parsing schedule JSON:", error);
            return ["Invalid schedule format"];
        }
    }

    if (!Array.isArray(schedule)) {
        console.error("Invalid schedule format:", schedule);
        return ["Invalid schedule format"];
    }

    return schedule.map((entry) => {
        const { day, date, month, year, time } = entry;
        return `${day}, ${date} ${month} ${year}: ${time.start} - ${time.end} Uhr`;
    });
};

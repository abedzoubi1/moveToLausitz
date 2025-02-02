import { Box, Typography } from "@mui/material";

const dayTranslations: { [key: string]: string } = {
  Monday: "Montag",
  Tuesday: "Dienstag",
  Wednesday: "Mittwoch",
  Thursday: "Donnerstag",
  Friday: "Freitag",
  Saturday: "Samstag",
  Sunday: "Sonntag",
};

const germanDayOrder = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
];

interface OpeningHoursProps {
  opening_hours: { [key: string]: string | string[] } | null | string;
}

export const OpeningHours = ({ opening_hours }: OpeningHoursProps) => {
  // Handle different input formats
  const parseOpeningHours = () => {
    if (!opening_hours) return null;

    try {
      const parsed =
        typeof opening_hours === "string"
          ? JSON.parse(opening_hours)
          : opening_hours;

      // Convert all values to arrays
      const normalized = Object.entries(parsed).reduce(
        (acc, [key, value]) => {
          acc[key] = Array.isArray(value) ? value : [value];
          return acc;
        },
        {} as Record<string, string[]>
      );

      return Object.keys(normalized).length > 0 ? normalized : null;
    } catch {
      return null;
    }
  };

  const hours = parseOpeningHours();

  if (!hours) {
    return (
      <Typography variant="body2" color="text.secondary">
        Keine Öffnungszeiten verfügbar
      </Typography>
    );
  }

  // Format time from "09:00:00 - 16:30:00" to "09:00 - 16:30 Uhr"
  const formatTimeRange = (timeStr: string) => {
    const [start, end] = timeStr.split(" - ");
    const format = (t: string) => t.slice(0, 5); // Get HH:mm from HH:mm:ss
    return `${format(start)} - ${format(end)} Uhr`;
  };

  // Create translated hours with all German days initialized
  const translatedHours = germanDayOrder.reduce(
    (acc, day) => {
      acc[day] = [];
      return acc;
    },
    {} as Record<string, string[]>
  );

  // Populate with actual data
  Object.entries(hours).forEach(([englishDay, times]) => {
    const germanDay = dayTranslations[englishDay];
    if (germanDay) {
      translatedHours[germanDay] = (Array.isArray(times) ? times : [times])
        .map(formatTimeRange)
        .sort((a, b) => a.localeCompare(b));
    }
  });

  return (
    <Box sx={{ width: "100%" }}>
      {germanDayOrder.map((day) => (
        <Box
          key={day}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 0.75,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "text.primary", minWidth: "100px" }}
          >
            {day}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {translatedHours[day].length > 0
              ? translatedHours[day].join(", ")
              : "Geschlossen"}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

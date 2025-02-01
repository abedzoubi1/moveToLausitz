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
  opening_hours: { [key: string]: string[] } | null | string;
}

export const OpeningHours = ({ opening_hours }: OpeningHoursProps) => {
  if (!opening_hours) {
    return (
      <Typography variant="body2" color="text.secondary">
        Keine Öffnungszeiten verfügbar
      </Typography>
    );
  }
  // Parse opening hours if it's a string
  const hours =
    typeof opening_hours === "string"
      ? JSON.parse(opening_hours)
      : opening_hours;

  const formatTimeRange = (timeStr: string) => {
    const [start, end] = timeStr.split(" - ");
    const formatTime = (time: string) => time.replace(":00", "");
    return `${formatTime(start)} - ${formatTime(end)} Uhr`;
  };

  const translatedHours = Object.entries(hours).reduce(
    (acc, [day, times]) => {
      const germanDay = dayTranslations[day];
      if (germanDay && Array.isArray(times)) {
        // Sort time ranges
        const sortedTimes = [...times].sort((a, b) => {
          const timeA = a.split(" - ")[0];
          const timeB = b.split(" - ")[0];
          return timeA.localeCompare(timeB);
        });
        acc[germanDay] = sortedTimes;
      }
      return acc;
    },
    {} as Record<string, string[]>
  );

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
            {translatedHours[day] && translatedHours[day].length > 0
              ? translatedHours[day].map(formatTimeRange).join(", ")
              : "Geschlossen"}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

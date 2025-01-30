import { Box, Typography, Divider } from "@mui/material";

interface OpeningHoursProps {
  opening_hours: { [key: string]: string[] } | null;
}

const dayTranslation: { [key: string]: string } = {
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

const formatTime = (timeString: string) => {
  // Convert "10:00:00 - 12:00:00" to "10:00 - 12:00 Uhr"
  return (
    timeString
      .split(" - ")
      .map((t) => t.slice(0, 5)) // Take only HH:MM
      .join(" - ") + " Uhr"
  );
};

export const OpeningHours = ({ opening_hours }: OpeningHoursProps) => {
  console.log(opening_hours);
  // Handle null or empty input
  if (!opening_hours || Object.keys(opening_hours).length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Keine aktuellen Öffnungszeiten verfügbar,
        <br />
        bitte auf der Website nachschauen.
      </Typography>
    );
  }

  // Convert English keys to German and format times
  const translatedHours = Object.entries(opening_hours).reduce(
    (acc, [key, value]) => {
      const germanDay = dayTranslation[key];
      if (germanDay) {
        acc[germanDay] = value.map(formatTime);
      }
      return acc;
    },
    {} as { [key: string]: string[] }
  );

  return (
    <Box sx={{ width: "100%" }}>
      {/* Status Bar */}
      <Box
        sx={{
          bgcolor: "grey.100",
          p: 1.5,
          borderRadius: 1,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          GESCHLOSSEN
        </Typography>
        <Typography variant="body2" color="text.secondary">
          (Öffnet um 08:00 Uhr)
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Opening Hours List in German order */}
      {germanDayOrder.map((germanDay) => (
        <Box
          key={germanDay}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          <Typography variant="body2" sx={{ minWidth: 100 }}>
            {germanDay}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {translatedHours[germanDay]?.join(", ") || "Geschlossen"}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

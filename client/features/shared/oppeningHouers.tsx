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
  opening_hours: string | null;
}

export const OpeningHours = ({ opening_hours }: OpeningHoursProps) => {
  if (!opening_hours) {
    return (
      <Typography variant="body2" color="text.secondary">
        Keine Öffnungszeiten verfügbar
      </Typography>
    );
  }

  // Parse the JSON string
  let parsedHours;
  try {
    parsedHours = JSON.parse(opening_hours);
  } catch (error) {
    console.error("Error parsing opening hours:", error);
    return (
      <Typography variant="body2" color="text.secondary">
        Keine Öffnungszeiten verfügbar
      </Typography>
    );
  }

  const formatTimeRange = (timeStr: string) => {
    const [start, end] = timeStr.split("-");
    return `${start} - ${end} Uhr`;
  };

  // Transform to German days and format times
  const translatedHours = Object.entries(parsedHours).reduce(
    (acc, [day, time]) => {
      const germanDay = dayTranslations[day];
      if (germanDay && typeof time === "string") {
        acc[germanDay] = time;
      }
      return acc;
    },
    {} as Record<string, string>
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
          <Typography variant="body2" sx={{ minWidth: 100 }}>
            {day}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {translatedHours[day]
              ? formatTimeRange(translatedHours[day])
              : "Geschlossen"}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

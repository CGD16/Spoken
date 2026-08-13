// utils/formatDate.ts
import { DateFormat, TimeFormat } from "@/context/SettingsContext";

export function formatDateTime(
  dateInput: string | Date,
  dateFormat: DateFormat = "DD.MM.YYYY",
  timeFormat: TimeFormat = "24h"
): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  let formattedDate = "";
  switch (dateFormat) {
    case "YYYY-MM-DD":
      formattedDate = `${year}-${month}-${day}`;
      break;
    case "MM/DD/YYYY":
      formattedDate = `${month}/${day}/${year}`;
      break;
    case "DD.MM.YYYY":
    default:
      formattedDate = `${day}.${month}.${year}`;
      break;
  }

  let hoursNum = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  let formattedTime = "";
  if (timeFormat === "12h") {
    const period = hoursNum >= 12 ? "PM" : "AM";
    hoursNum = hoursNum % 12 || 12;
    formattedTime = `${hoursNum}:${minutes} ${period}`;
  } else {
    formattedTime = `${String(hoursNum).padStart(2, "0")}:${minutes}`;
  }

  return `${formattedDate}, ${formattedTime}`;
}
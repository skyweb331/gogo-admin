import dayjs from "dayjs";

export const fDate = (value?: string | Date | null) => (value ? dayjs(value).format("MMM D, YYYY") : "—");

export const fDateTime = (value?: string | Date | null) => (value ? dayjs(value).format("MMM D, YYYY h:mm A") : "—");

export const fRelative = (value?: string | Date | null) => (value ? dayjs(value).fromNow() : "—");

/** "2026-11" -> "November 2026" */
export const fPeriod = (periodKey?: string | null) => (periodKey ? dayjs(`${periodKey}-01`).format("MMMM YYYY") : "—");

/** "2026-11" -> "November 1, 2026" */
export const fPeriodStart = (periodKey?: string | null) =>
  periodKey ? dayjs(`${periodKey}-01`).format("MMMM D, YYYY") : "—";

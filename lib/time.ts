// Dates are "YYYY-MM-DD" and times "HH:MM", always in the user's own time zone.

export function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export function localDate(timeZone: string, at = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(at);
}

export function localTime(timeZone: string, at = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(at);
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function prettyDate(date: string, style: "long" | "short" = "long"): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "UTC",
    weekday: style === "long" ? "long" : "short",
    day: "numeric",
    month: style === "long" ? "long" : "short",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function weekdayName(date: string): string {
  return new Intl.DateTimeFormat("en-IN", { timeZone: "UTC", weekday: "long" }).format(new Date(`${date}T00:00:00Z`));
}

/** "07:00:00" -> "07:00" */
export function hhmm(time: string): string {
  return time.slice(0, 5);
}

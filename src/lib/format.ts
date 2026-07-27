export function formatHours(hours: number) {
  const normalized = Number.isInteger(hours)
    ? hours.toFixed(0)
    : hours.toFixed(1).replace(".", ",");
  return `${normalized} год`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}


const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export { WEEKDAY_LABELS, MONTH_LABELS };

export type CalendarDay = {
  date: Date;
  inCurrentMonth: boolean;
};

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isBefore(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

export function isAfter(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() > startOfDay(b).getTime();
}

export function diffInDays(a: Date, b: Date): number {
  return Math.round(
    (startOfDay(a).getTime() - startOfDay(b).getTime()) / 86400000
  );
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

// Monday-first weekday index (0 = Monday ... 6 = Sunday)
function mondayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

export function buildMonthGrid(year: number, month: number): CalendarDay[] {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leading = mondayIndex(first);

  const days: CalendarDay[] = [];

  for (let i = leading; i > 0; i--) {
    const date = new Date(year, month, 1 - i);
    days.push({ date, inCurrentMonth: false });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ date: new Date(year, month, d), inCurrentMonth: true });
  }

  while (days.length % 7 !== 0) {
    const last = days[days.length - 1].date;
    const date = new Date(
      last.getFullYear(),
      last.getMonth(),
      last.getDate() + 1
    );
    days.push({ date, inCurrentMonth: false });
  }

  return days;
}

export function formatShortDate(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// Local-date (no timezone shift) YYYY-MM-DD serialization, used to carry
// selected dates through URL query params between the homepage search and
// the properties/booking-widget pages.
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function fromISODate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return Number.isNaN(date.getTime()) ? null : date;
}

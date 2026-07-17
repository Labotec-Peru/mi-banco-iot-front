import { useMemo } from "react";
import { CalendarDate } from "@internationalized/date";

export function useTodayDate() {
  const today = useMemo(() => {
    const now = new Date();
    return new CalendarDate(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate()
    );
  }, []);

  return today;
}
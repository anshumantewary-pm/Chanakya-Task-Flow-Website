"use client";

import { useEffect } from "react";
import { recordVisit } from "../actions";

/** Records "app opened" at most once per day per device (for the 7-day return rate). */
export function VisitTracker() {
  useEffect(() => {
    const today = new Date().toLocaleDateString("en-CA");
    try {
      if (localStorage.getItem("chanakya:last-visit") === today) return;
      localStorage.setItem("chanakya:last-visit", today);
    } catch {
      // Storage blocked (private mode): record anyway.
    }
    recordVisit().catch(() => {});
  }, []);
  return null;
}

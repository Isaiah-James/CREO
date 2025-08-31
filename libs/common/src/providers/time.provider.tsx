/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { createContext, useEffect, useMemo, useState } from "react";

type TimeZoneLabel = {
  id: string;
  label: string;
};

export type TimeContextType = {
  now: Date;
  timeZone: string;
  setTimeZone: (tz: string) => void;
  timeZones: TimeZoneLabel[];

  // Raw getters
  getHours: () => number;
  getMinutes: () => number;
  getSeconds: () => number;
  getDate: () => number;
  getDay: () => number;
  getMonth: () => number;
  getYear: () => number;

  // Fixed formatting
  formatTime: () => string;
  formatDate: () => string;
  formatDateTime: () => string;

  // Locale-aware (default provider TZ)
  formatLocaleTime: (options?: Intl.DateTimeFormatOptions, locale?: string) => string;
  formatLocaleDate: (options?: Intl.DateTimeFormatOptions, locale?: string) => string;
  formatLocaleDateTime: (options?: Intl.DateTimeFormatOptions, locale?: string) => string;

  // Explicit time zone formatting
  formatWithTimeZone: (
    timeZone: string,
    options?: Intl.DateTimeFormatOptions,
    locale?: string
  ) => string;

  // Relative time utilities
  fromNow: (date: Date, locale?: string) => string;
  timeAgo: (date: Date, locale?: string) => string; // alias for fromNow
  diffInSeconds: (date: Date) => number;
  diffInMinutes: (date: Date) => number;
  diffInHours: (date: Date) => number;
  diffInDays: (date: Date) => number;
};

export const TimeContext = createContext<TimeContextType | undefined>(undefined);

const pad = (num: number) => String(num).padStart(2, "0");

const buildTimeZoneLabel = (tz: string, now: Date): string => {
  try {
    const offset = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value;

    const city = tz.split("/").pop()?.replace("_", " ") ?? tz;
    return `${city} (${offset})`;
  } catch {
    return tz;
  }
};

export const TimeProvider = ({
  children,
  defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
}: {
  children: React.ReactNode;
  defaultTimeZone?: string;
}) => {
  const [now, setNow] = useState(new Date());
  const [timeZone, setTimeZone] = useState(defaultTimeZone);

  const rawZones: string[] =
    (Intl as any).supportedValuesOf?.("timeZone") ?? [
      "UTC",
      "America/New_York",
      "Europe/London",
      "Asia/Tokyo",
      "Australia/Sydney",
    ];

  const timeZones: TimeZoneLabel[] = useMemo(
    () => rawZones.map((tz) => ({ id: tz, label: buildTimeZoneLabel(tz, now) })),
    [rawZones, now]
  );

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const value: TimeContextType = {
    now,
    timeZone,
    setTimeZone,
    timeZones,

    // Raw getters
    getHours: () => now.getHours(),
    getMinutes: () => now.getMinutes(),
    getSeconds: () => now.getSeconds(),
    getDate: () => now.getDate(),
    getDay: () => now.getDay(),
    getMonth: () => now.getMonth() + 1,
    getYear: () => now.getFullYear(),

    // Fixed formatting
    formatTime: () =>
      `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
    formatDate: () =>
      `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    formatDateTime: () =>
      `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
      `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,

    // Locale-aware
    formatLocaleTime: (options = { timeStyle: "medium" }, locale) =>
      new Intl.DateTimeFormat(locale, { ...options, timeZone }).format(now),
    formatLocaleDate: (options = { dateStyle: "medium" }, locale) =>
      new Intl.DateTimeFormat(locale, { ...options, timeZone }).format(now),
    formatLocaleDateTime: (options = { dateStyle: "medium", timeStyle: "short" }, locale) =>
      new Intl.DateTimeFormat(locale, { ...options, timeZone }).format(now),

    // Explicit TZ
    formatWithTimeZone: (
      tz,
      options = { dateStyle: "medium", timeStyle: "short" },
      locale
    ) => new Intl.DateTimeFormat(locale, { ...options, timeZone: tz }).format(now),

    // Relative time utilities
    fromNow: (date: Date, locale = "en") => {
      const diffMs = date.getTime() - now.getTime();
      const diffSec = Math.round(diffMs / 1000);
      const absSec = Math.abs(diffSec);

      let value: number;
      let unit: Intl.RelativeTimeFormatUnit;

      if (absSec < 60) {
        value = diffSec;
        unit = "second";
      } else if (absSec < 3600) {
        value = Math.round(diffSec / 60);
        unit = "minute";
      } else if (absSec < 86400) {
        value = Math.round(diffSec / 3600);
        unit = "hour";
      } else {
        value = Math.round(diffSec / 86400);
        unit = "day";
      }

      return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
        value,
        unit
      );
    },

    timeAgo: (date: Date, locale = "en") => {
      return value.fromNow(date, locale);
    },

    diffInSeconds: (date: Date) =>
      Math.round((now.getTime() - date.getTime()) / 1000),
    diffInMinutes: (date: Date) =>
      Math.round((now.getTime() - date.getTime()) / 60000),
    diffInHours: (date: Date) =>
      Math.round((now.getTime() - date.getTime()) / 3600000),
    diffInDays: (date: Date) =>
      Math.round((now.getTime() - date.getTime()) / 86400000),
  };

  return <TimeContext.Provider value={value}>{children}</TimeContext.Provider>;
};


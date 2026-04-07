"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  Clock,
  MapPin,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { InvitationStatus } from "@/generated/prisma/enums";

interface EventDate {
  id: string;
  startTime: Date | string;
  endTime: Date | string;
}

interface EventAssignment {
  id: string;
  userId: string;
  role: string;
  status: InvitationStatus
  assignedBy: {
    firstName: string
  }
}

interface ServiceType {
  id: string;
  name: string;
  color: string;
}

interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  dates: EventDate[];
  assignments: EventAssignment[];
  serviceTypeId: string;
}

// ─── Role config ────────────────────────────────────────────────

const roleEmojis: Record<string, string> = {
  GUITARIST: "🎸",
  PIANIST: "🎹",
  AUX_KEYS: "🎹",
  DRUMMER: "🥁",
  LEAD_VOCALIST: "🎤",
  BGVS: "🎤",
  BASSIST: "🎸",
  SOUND_TECH: "🎛️",
  USHER: "🚪",
  GREETER: "👋",
};

const roleNames: Record<string, string> = {
  GUITARIST: "Guitarist",
  PIANIST: "Pianist",
  AUX_KEYS: "Aux Keys",
  DRUMMER: "Drummer",
  LEAD_VOCALIST: "Lead Vocalist",
  BGVS: "BGVs",
  BASSIST: "Bassist",
  SOUND_TECH: "Sound Tech",
  USHER: "Usher",
  GREETER: "Greeter",
};

// ─── Color config ───────────────────────────────────────────────

const colorClasses: Record<
  string,
  { dot: string; border: string; badge: string; badgeText: string }
> = {
  indigo: {
    dot: "bg-indigo-500",
    border: "border-l-indigo-500",
    badge: "bg-indigo-500/10",
    badgeText: "text-indigo-600",
  },
  amber: {
    dot: "bg-amber-500",
    border: "border-l-amber-500",
    badge: "bg-amber-500/10",
    badgeText: "text-amber-600",
  },
  emerald: {
    dot: "bg-emerald-500",
    border: "border-l-emerald-500",
    badge: "bg-emerald-500/10",
    badgeText: "text-emerald-600",
  },
  pink: {
    dot: "bg-pink-500",
    border: "border-l-pink-500",
    badge: "bg-pink-500/10",
    badgeText: "text-pink-600",
  },
  violet: {
    dot: "bg-violet-500",
    border: "border-l-violet-500",
    badge: "bg-violet-500/10",
    badgeText: "text-violet-600",
  },
  red: {
    dot: "bg-red-500",
    border: "border-l-red-500",
    badge: "bg-red-500/10",
    badgeText: "text-red-600",
  },
  blue: {
    dot: "bg-blue-500",
    border: "border-l-blue-500",
    badge: "bg-blue-500/10",
    badgeText: "text-blue-600",
  },
  cyan: {
    dot: "bg-cyan-500",
    border: "border-l-cyan-500",
    badge: "bg-cyan-500/10",
    badgeText: "text-cyan-600",
  },
};

const getColorClasses = (color: string) =>
  colorClasses[color] || colorClasses.indigo;

// ─── Date helpers (pure functions — accept `today` as parameter) ─

function createToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/** Earliest startTime across all EventDates */
function getEarliestDate(dates: EventDate[]): Date {
  return new Date(
    Math.min(...dates.map((d) => new Date(d.startTime).getTime()))
  );
}

/** Latest endTime across all EventDates */
function getLatestDate(dates: EventDate[]): Date {
  return new Date(
    Math.max(...dates.map((d) => new Date(d.endTime).getTime()))
  );
}

/** Whether the event spans more than one calendar day */
function isMultiDay(dates: EventDate[]): boolean {
  if (dates.length > 1) return true;
  if (dates.length === 0) return false;
  const start = new Date(dates[0].startTime);
  const end = new Date(dates[0].endTime);
  return start.toDateString() !== end.toDateString();
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** Display-friendly date range: single day or "Mar 27 – 29" / "Mar 31 – Apr 2" */
function formatDateRange(dates: EventDate[]): string {
  if (dates.length === 0) return "";
  const earliest = getEarliestDate(dates);
  const latest = getLatestDate(dates);

  if (!isMultiDay(dates)) {
    return formatShortDate(earliest);
  }

  if (earliest.getMonth() === latest.getMonth()) {
    return `${earliest.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${latest.getDate()}`;
  }

  return `${earliest.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${latest.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

/** Time range for the earliest EventDate (for card display) */
function formatTimeRange(dates: EventDate[]): string {
  if (dates.length === 0) return "";
  const sorted = [...dates].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
  return `${formatTime(new Date(sorted[0].startTime))} – ${formatTime(new Date(sorted[0].endTime))}`;
}

function getMonthYear(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/**
 * Check if ANY of an event's dates overlap with the given time scope.
 * Pure function — all dependencies passed as parameters.
 */
function isEventInTimeScope(
  dates: EventDate[],
  scope: TimeScope,
  currentMonth: Date,
  today: Date
): boolean {
  if (dates.length === 0) return false;

  switch (scope) {
    case "week": {
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() + 7);
      return dates.some((d) => {
        const start = new Date(d.startTime);
        const end = new Date(d.endTime);
        return start <= weekEnd && end >= today;
      });
    }
    case "month": {
      const monthStart = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
      );
      const monthEnd = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0,
        23,
        59,
        59
      );
      return dates.some((d) => {
        const start = new Date(d.startTime);
        const end = new Date(d.endTime);
        return start <= monthEnd && end >= monthStart;
      });
    }
    case "upcoming": {
      return dates.some((d) => new Date(d.endTime) >= today);
    }
    case "past": {
      const monthStart = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
      );
      const monthEnd = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0,
        23,
        59,
        59
      );
      return (
        dates.every((d) => new Date(d.endTime) < today) &&
        dates.some((d) => {
          const start = new Date(d.startTime);
          const end = new Date(d.endTime);
          return start <= monthEnd && end >= monthStart;
        })
      );
    }
  }
}

/** True only if every EventDate's endTime is before today */
function isEventPast(dates: EventDate[], today: Date): boolean {
  return dates.length > 0 && dates.every((d) => new Date(d.endTime) < today);
}

/**
 * For grouping: find the earliest startTime that falls within the current scope.
 * Falls back to the absolute earliest date if none qualify.
 */
function getAnchorDateInScope(
  dates: EventDate[],
  scope: TimeScope,
  currentMonth: Date,
  today: Date
): Date {
  const datesInScope = dates.filter((d) => {
    const start = new Date(d.startTime);
    const end = new Date(d.endTime);

    switch (scope) {
      case "week": {
        const weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() + 7);
        return start <= weekEnd && end >= today;
      }
      case "month": {
        const monthStart = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          1
        );
        const monthEnd = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
          0,
          23,
          59,
          59
        );
        return start <= monthEnd && end >= monthStart;
      }
      case "upcoming":
        return end >= today;
      case "past":
        return end < today;
    }
  });

  if (datesInScope.length > 0) {
    return getEarliestDate(datesInScope);
  }
  return getEarliestDate(dates);
}

// ─── Component types ────────────────────────────────────────────

type TimeScope = "week" | "month" | "upcoming" | "past";
type TabType = "pending" | "schedule";

interface MemberEventsDashboardProps {
  events: Event[];
  serviceTypes: ServiceType[];
  organizationId: string;
  canManage: boolean;
}

// ─── Component ──────────────────────────────────────────────────

export function MemberEventsDashboard({
  events,
  serviceTypes,
  organizationId,
  canManage,
}: MemberEventsDashboardProps) {
  
  const [activeTab, setActiveTab] = useState<TabType>(() =>
    events.some((e) =>
      e.assignments.some((a) => a.status === InvitationStatus.PENDING)
    )
      ? "pending"
      : "schedule"
  );
  const [timeScope, setTimeScope] = useState<TimeScope>("week");
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(
    null
  );
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Compute today once per render, pass to all helpers
  const today = createToday();

  // ── Memoized lookups ────────────────────────────────────────

  const serviceTypeMap = useMemo(() => {
    return new Map(serviceTypes.map((s) => [s.id, s]));
  }, [serviceTypes]);

  const getServiceType = (id: string) => serviceTypeMap.get(id);

  // ── Derived data ────────────────────────────────────────────

  const pendingEvents = useMemo(() => {
    return events.filter((e) =>
      e.assignments.some((a) => a.status === InvitationStatus.PENDING)
    );
  }, [events]);

  const acceptedEvents = useMemo(() => {
    return events.filter((e) =>
      e.assignments.some((a) => a.status === InvitationStatus.ACCEPTED)
    );
  }, [events]);

  const filteredPendingEvents = useMemo(() => {
    return pendingEvents.filter((event) => {
      const inScope = isEventInTimeScope(
        event.dates,
        timeScope,
        currentMonth,
        today
      );
      const matchesService =
        !selectedServiceType || event.serviceTypeId === selectedServiceType;
      return inScope && matchesService;
    });
  }, [pendingEvents, timeScope, currentMonth, selectedServiceType, today]);

  const filteredAcceptedEvents = useMemo(() => {
    return acceptedEvents
      .filter((event) => {
        const inScope = isEventInTimeScope(
          event.dates,
          timeScope,
          currentMonth,
          today
        );
        const matchesService =
          !selectedServiceType || event.serviceTypeId === selectedServiceType;
        return inScope && matchesService;
      })
      .sort(
        (a, b) =>
          getEarliestDate(a.dates).getTime() -
          getEarliestDate(b.dates).getTime()
      );
  }, [acceptedEvents, timeScope, currentMonth, selectedServiceType, today]);

  const groupedAcceptedEvents = useMemo(() => {
    const groups: Record<string, Event[]> = {};

    filteredAcceptedEvents.forEach((event) => {
      const anchorDate = getAnchorDateInScope(
        event.dates,
        timeScope,
        currentMonth,
        today
      );
      const key = anchorDate.toDateString();

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(event);
    });

    return Object.entries(groups).sort(
      ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
    );
  }, [filteredAcceptedEvents, timeScope, currentMonth, today]);

  // ── Helpers ─────────────────────────────────────────────────

  const getUserRole = (event: Event): string | null => {
    return event.assignments[0]?.role ?? null;
  };

  const pendingCount = pendingEvents.length;
  const scheduleCount = acceptedEvents.length;

  const nextUpcomingDate = groupedAcceptedEvents.find(
    ([dateStr]) => new Date(dateStr) >= today
  )?.[0];

  // ── JSX ─────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative"
      >
        <div className="flex gap-8 border-b border-border">
          <button
            onClick={() => setActiveTab("pending")}
            className={`relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "pending"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Pending
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {pendingCount}
            </span>
            {activeTab === "pending" && (
              <motion.div
                layoutId="events-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "schedule"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            My Schedule
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {scheduleCount}
            </span>
            {activeTab === "schedule" && (
              <motion.div
                layoutId="events-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        </div>
      </motion.div>

      {/* Time Scope */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center gap-2"
      >
        <div className="flex rounded-lg border border-border bg-background p-1">
          {(["week", "month", "upcoming", "past"] as TimeScope[]).map(
            (scope) => (
              <button
                key={scope}
                onClick={() => setTimeScope(scope)}
                className={`relative rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  timeScope === scope
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {scope === "week" && "This Week"}
                {scope === "month" && "This Month"}
                {scope === "upcoming" && "Upcoming"}
                {scope === "past" && "Past"}
              </button>
            )
          )}
        </div>

        <AnimatePresence>
          {(timeScope === "month" || timeScope === "past") && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-1 text-sm"
            >
              <button
                onClick={() =>
                  setCurrentMonth((prev) => {
                    const newDate = new Date(prev);
                    newDate.setMonth(newDate.getMonth() - 1);
                    return newDate;
                  })
                }
                className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="min-w-30 text-center font-medium">
                {getMonthYear(currentMonth)}
              </span>
              <button
                onClick={() =>
                  setCurrentMonth((prev) => {
                    const newDate = new Date(prev);
                    newDate.setMonth(newDate.getMonth() + 1);
                    return newDate;
                  })
                }
                className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Service Type Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setSelectedServiceType(null)}
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
            !selectedServiceType
              ? "bg-foreground text-background"
              : "border border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground"
          }`}
        >
          All
        </motion.button>
        {serviceTypes.map((service) => {
          const colors = getColorClasses(service.color);
          return (
            <motion.button
              key={service.id}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                setSelectedServiceType(
                  service.id === selectedServiceType ? null : service.id
                )
              }
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                selectedServiceType === service.id
                  ? "bg-foreground text-background"
                  : "border border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
              {service.name}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === "pending" ? (
          <motion.div
            key="pending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filteredPendingEvents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-16"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  You&apos;re all caught up!
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  No pending invitations
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {filteredPendingEvents.map((event, index) => {
                  const service = getServiceType(event.serviceTypeId);
                  const isPast = isEventPast(event.dates, today);
                  const role = getUserRole(event);
                  const colors = getColorClasses(service?.color || "indigo");
                  const assignedBy = event.assignments[0]?.assignedBy.firstName;

                  return (
                    <motion.div
                      key={event.id}
                      initial={isMounted ? { opacity: 0, y: 20 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: isMounted ? index * 0.05 : 0 }}
                      whileHover={{ scale: 1.01 }}
                      className={`group overflow-hidden rounded-lg border border-border border-l-[3px] bg-card transition-shadow duration-200 hover:shadow-md ${colors.border} ${
                        isPast ? "opacity-60" : ""
                      }`}
                    >
                      <Link
                        href={`/dashboard/organizations/${organizationId}/events/${event.id}`}
                        className="block p-4"
                      >
                        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-medium ${colors.badge} ${colors.badgeText}`}
                          >
                            {service?.name || "Event"}
                          </span>
                          <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                            {role && roleEmojis[role]}{" "}
                            {role && roleNames[role]}
                          </span>
                        </div>

                        <h3 className="mb-2 text-base font-semibold text-foreground">
                          {event.name}
                        </h3>

                        <div className="mb-2 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-1">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            {formatDateRange(event.dates)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 shrink-0" />
                            {formatTimeRange(event.dates)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {assignedBy}
                        </p>
                      </Link>

                      {!isPast && (
                        <>
                          <div className="border-t border-border" />
                          <div className="flex gap-2 p-3 sm:gap-3">
                            <motion.div
                              whileTap={{ scale: 0.97 }}
                              className="flex-1"
                            >
                              <Button
                                className="h-10 w-full bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer sm:h-11"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Check className="mr-1.5 h-4 w-4 sm:mr-2" />
                                <span>Accept</span>
                              </Button>
                            </motion.div>
                            <motion.div
                              whileTap={{ scale: 0.97 }}
                              className="flex-1"
                            >
                              <Button
                                variant="outline"
                                className="h-10 w-full border-destructive text-destructive hover:bg-destructive/10 cursor-pointer sm:h-11"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <X className="mr-1.5 h-4 w-4 sm:mr-2" />
                                <span>Decline</span>
                              </Button>
                            </motion.div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="schedule"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {groupedAcceptedEvents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-16"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  No scheduled events
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {timeScope === "past"
                    ? "No past events found"
                    : "Check back later for new assignments"}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {groupedAcceptedEvents.map(
                  ([dateStr, dateEvents], groupIndex) => {
                    const groupDate = new Date(dateStr);
                    const allPast = dateEvents.every((e) =>
                      isEventPast(e.dates, today)
                    );
                    const isNextUpcoming = dateStr === nextUpcomingDate;

                    return (
                      <motion.div
                        key={dateStr}
                        initial={isMounted ? { opacity: 0, y: 20 } : false}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: isMounted ? groupIndex * 0.05 : 0,
                        }}
                        className={allPast ? "opacity-60" : ""}
                      >
                        <div className="mb-3 flex items-center gap-3">
                          <h3 className="text-sm font-semibold text-foreground">
                            {formatShortDate(groupDate)}
                          </h3>
                          {isNextUpcoming && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                              Upcoming
                            </span>
                          )}
                          {allPast && (
                            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                              Past
                            </span>
                          )}
                          <div className="h-px flex-1 bg-border" />
                        </div>

                        <div className="space-y-2">
                          {dateEvents.map((event, eventIndex) => {
                            const service = getServiceType(
                              event.serviceTypeId
                            );
                            const role = getUserRole(event);
                            const colors = getColorClasses(
                              service?.color || "indigo"
                            );
                            const multiDay = isMultiDay(event.dates);

                            return (
                              <Link
                                key={event.id}
                                href={`/dashboard/organizations/${organizationId}/events/${event.id}`}
                              >
                                <motion.div
                                  initial={
                                    isMounted
                                      ? { opacity: 0, x: -10 }
                                      : false
                                  }
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    delay: isMounted
                                      ? groupIndex * 0.05 +
                                        eventIndex * 0.03
                                      : 0,
                                  }}
                                  whileHover={{ scale: 1.01 }}
                                  className={`group cursor-pointer rounded-lg border border-border border-l-[3px] bg-card p-3 transition-all duration-200 hover:shadow-md ${colors.border}`}
                                >
                                  {/* Desktop layout */}
                                  <div className="hidden items-center gap-3 sm:flex">
                                    <span className="min-w-17.5 text-sm font-medium text-foreground">
                                      {formatTimeRange(event.dates)}
                                    </span>
                                    <span
                                      className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${colors.badge} ${colors.badgeText}`}
                                    >
                                      {service?.name || "Event"}
                                    </span>
                                    <span className="flex-1 truncate text-sm text-foreground">
                                      {event.name}
                                      {multiDay && (
                                        <span className="ml-2 text-xs text-muted-foreground">
                                          ({formatDateRange(event.dates)})
                                        </span>
                                      )}
                                    </span>
                                    <span className="shrink-0 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                                      {role && roleEmojis[role]}{" "}
                                      {role && roleNames[role]}
                                    </span>
                                  </div>
                                  {/* Mobile layout */}
                                  <div className="flex flex-col gap-2 sm:hidden">
                                    <div className="flex items-center justify-between gap-2">
                                      <span
                                        className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${colors.badge} ${colors.badgeText}`}
                                      >
                                        {service?.name || "Event"}
                                      </span>
                                      <span className="shrink-0 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                                        {role && roleEmojis[role]}{" "}
                                        {role && roleNames[role]}
                                      </span>
                                    </div>
                                    <p className="text-sm font-medium text-foreground">
                                      {event.name}
                                    </p>
                                    <span className="text-xs text-muted-foreground">
                                      {multiDay
                                        ? `${formatDateRange(event.dates)} · ${formatTimeRange(event.dates)}`
                                        : formatTimeRange(event.dates)}
                                    </span>
                                  </div>
                                </motion.div>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  }
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
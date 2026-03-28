"use client";

import type React from "react";
import {
  useState,
  useMemo,
  useCallback,
  useTransition,
  useOptimistic,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { format, eachDayOfInterval, isBefore, startOfDay } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarPlus,
  Loader2,
  Check,
  MapPin,
  Clock,
  ArrowLeft,
  ArrowRight,
  Users,
  Send,
  Calendar,
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VolunteerRole } from "@/generated/prisma/enums";
import { volunteerRoleConfig } from "@/lib/config/roles";
import {
  createEventSchema,
  type CreateEventFormData,
} from "@/lib/validations/event";

import { checkMemberAvailability } from "@/lib/actions/event";
import { createServiceType } from "@/lib/actions/service-type";
import { createEvent } from "@/lib/actions/event";

const colorClasses: Record<
  string,
  { dot: string; badge: string; badgeText: string }
> = {
  indigo: {
    dot: "bg-indigo-500",
    badge: "bg-indigo-500/10",
    badgeText: "text-indigo-600",
  },
  amber: {
    dot: "bg-amber-500",
    badge: "bg-amber-500/10",
    badgeText: "text-amber-600",
  },
  emerald: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-500/10",
    badgeText: "text-emerald-600",
  },
  pink: {
    dot: "bg-pink-500",
    badge: "bg-pink-500/10",
    badgeText: "text-pink-600",
  },
  violet: {
    dot: "bg-violet-500",
    badge: "bg-violet-500/10",
    badgeText: "text-violet-600",
  },
  red: {
    dot: "bg-red-500",
    badge: "bg-red-500/10",
    badgeText: "text-red-600",
  },
  blue: {
    dot: "bg-blue-500",
    badge: "bg-blue-500/10",
    badgeText: "text-blue-600",
  },
  cyan: {
    dot: "bg-cyan-500",
    badge: "bg-cyan-500/10",
    badgeText: "text-cyan-600",
  },
};

const getColorClasses = (color: string) =>
  colorClasses[color] || colorClasses.indigo;
const newTypeColorOptions = [
  "indigo",
  "amber",
  "emerald",
  "pink",
  "violet",
  "red",
  "blue",
  "cyan",
];

const volunteerRoleEntries = Object.entries(volunteerRoleConfig) as [
  VolunteerRole,
  { label: string; icon: string },
][];

/** Get all dates in a range (or single date) as an array */
const getSelectedDates = (range: DateRange | undefined): Date[] => {
  if (!range?.from) return [];
  if (!range.to || range.from.getTime() === range.to.getTime())
    return [range.from];
  return eachDayOfInterval({ start: range.from, end: range.to });
};

export type Member = {
  id: string;
  userId: string;
  volunteerRoles: VolunteerRole[];
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
};

export type ServiceType = {
  id: string;
  name: string;
  color: string;
};

export type MemberConflict = {
  eventName: string;
  startTime: string;
  endTime: string;
};

interface CreateEventPageContentProps {
  organizationId: string;
  organizationName: string;
  members: Member[];
  serviceTypes: ServiceType[];
}

export function CreateEventPageContent({
  organizationId,
  organizationName,
  members,
  serviceTypes,
}: CreateEventPageContentProps) {
  const router = useRouter();

  const [optimisticServiceTypes, addOptimisticServiceType] = useOptimistic(
    serviceTypes,
    (current, newType: ServiceType) => [...current, newType],
  );

  const [step, setStep] = useState<1 | 2>(1);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCreatingNewType, setIsCreatingNewType] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeColor, setNewTypeColor] = useState("indigo");

  const [roleAssignments, setRoleAssignments] = useState<
    Record<VolunteerRole, string[]>
  >({} as Record<VolunteerRole, string[]>);

  const [memberConflicts, setMemberConflicts] = useState<
    Record<string, MemberConflict>
  >({});

  // Warning modal state for assigning a conflicting member
  const [conflictWarning, setConflictWarning] = useState<{
    role: VolunteerRole;
    memberId: string;
    memberName: string;
    conflict: MemberConflict;
  } | null>(null);

  // React Hook Form
  const form = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      serviceTypeId: "",
      name: "",
      description: "",
      dateRange: { from: undefined, to: undefined },
      dayTimes: {},
      location: "",
      rolesNeeded: [],
    },
  });

  const {
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = form;

  // Watch form values for rendering
  const watchedServiceTypeId = watch("serviceTypeId");
  const watchedName = watch("name");
  const watchedDescription = watch("description");
  const watchedDateRange = watch("dateRange");
  const watchedDayTimes = watch("dayTimes");
  const watchedLocation = watch("location");
  const watchedRolesNeeded = watch("rolesNeeded");

  const selectedServiceType = optimisticServiceTypes.find(
    (t) => t.id === watchedServiceTypeId,
  );
  const serviceColors = selectedServiceType
    ? getColorClasses(selectedServiceType.color)
    : null;

  const selectedDates = useMemo(
    () => getSelectedDates(watchedDateRange as DateRange | undefined),
    [watchedDateRange],
  );

  const membersByRole = useMemo(() => {
    const map: Record<string, Member[]> = {};
    for (const role of Object.keys(volunteerRoleConfig)) {
      map[role] = members.filter((m) =>
        m.volunteerRoles?.includes(role as VolunteerRole),
      );
    }
    return map;
  }, [members]);

  const formatName = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  const [isPending, startTransition] = useTransition();
  const [isCreating, startCreateTransition] = useTransition();

  const handleDateRangeChange = useCallback(
    (range: DateRange | undefined) => {
      setValue(
        "dateRange",
        {
          from: range?.from ?? undefined,
          to: range?.to ?? undefined,
        } as CreateEventFormData["dateRange"],
        { shouldValidate: false },
      );

      // Initialize blank time slots for newly selected dates
      if (range?.from) {
        const dates = getSelectedDates(range);
        const currentTimes = form.getValues("dayTimes");
        const updated: Record<string, { startTime: string; endTime: string }> =
          {};

        for (const date of dates) {
          const key = format(date, "yyyy-MM-dd");
          updated[key] = currentTimes[key] || { startTime: "", endTime: "" };
        }

        setValue("dayTimes", updated);
      } else {
        setValue("dayTimes", {});
      }
    },
    [setValue, form],
  );

  const handleDayStartTimeChange = (dateKey: string, time: string) => {
    const current = form.getValues(`dayTimes.${dateKey}`);
    setValue(`dayTimes.${dateKey}`, {
      startTime: time,
      endTime: current?.endTime || "",
    });
  };

  const handleDayEndTimeChange = (dateKey: string, time: string) => {
    const current = form.getValues(`dayTimes.${dateKey}`);
    setValue(`dayTimes.${dateKey}`, {
      startTime: current?.startTime || "",
      endTime: time,
    });
  };

  const handleCreateNewType = () => {
    if (!newTypeName.trim()) return;

    startTransition(async () => {
      const result = await createServiceType(
        newTypeName,
        newTypeColor,
        organizationId,
      );

      if (result.success) {
        addOptimisticServiceType(result.serviceType);
        setValue("serviceTypeId", result.serviceType.id);
        setIsCreatingNewType(false);
        setNewTypeName("");
        setNewTypeColor("indigo");
      } else {
        setError(result.error);
      }
    });
  };

  const handleClose = () => {
    reset();
    setStep(1);
    setError(null);
    setIsSuccess(false);
    setRoleAssignments({} as Record<VolunteerRole, string[]>);
    setMemberConflicts({});
    router.replace(`/dashboard/organizations/${organizationId}`);
  };

  const handleRoleToggle = (role: VolunteerRole) => {
    const current = form.getValues("rolesNeeded");
    const updated = current.includes(role)
      ? current.filter((r) => r !== role)
      : [...current, role];
    setValue("rolesNeeded", updated, { shouldValidate: true });
  };

  const handleAssignMember = (
    role: VolunteerRole,
    memberId: string,
    checked: boolean,
  ) => {
    // If checking a conflicting member, show the warning modal instead of assigning directly
    if (checked && memberConflicts[memberId]) {
      const member = members.find((m) => m.userId === memberId);
      if (member) {
        setConflictWarning({
          role,
          memberId,
          memberName: `${formatName(member.user.firstName)} ${formatName(member.user.lastName)}`,
          conflict: memberConflicts[memberId],
        });
      }
      return;
    }

    setRoleAssignments((prev) => {
      const current = prev[role] || [];
      if (checked) {
        return { ...prev, [role]: [...current, memberId] };
      }
      return { ...prev, [role]: current.filter((id) => id !== memberId) };
    });
  };

  const handleConfirmConflictAssignment = () => {
    if (!conflictWarning) return;
    const { role, memberId } = conflictWarning;
    setRoleAssignments((prev) => {
      const current = prev[role] || [];
      return { ...prev, [role]: [...current, memberId] };
    });
    setConflictWarning(null);
  };

  const handleNext = async () => {
    // Validate step 1 fields only
    const valid = await trigger([
      "serviceTypeId",
      "name",
      "dateRange",
      "dayTimes",
      "location",
      "rolesNeeded",
    ]);

    if (!valid) return;

    setIsCheckingAvailability(true);
    setError(null);

    try {
      const conflicts = await checkMemberAvailability({
        organizationId,
        dates: selectedDates.map((d) => ({
          date: format(d, "yyyy-MM-dd"),
          startTime: watchedDayTimes[format(d, "yyyy-MM-dd")]?.startTime,
          endTime: watchedDayTimes[format(d, "yyyy-MM-dd")]?.endTime,
        })),
      });
      setMemberConflicts(conflicts);

      setStep(2);
    } catch (err) {
      setError("Failed to check member availability. Please try again.");
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const onSubmit = async (data: CreateEventFormData) => {
    setError(null);

    startCreateTransition(async () => {
      try {
        const result = await createEvent(
          { ...data, roleAssignments },
          organizationId,
        );

        if (!result.success) {
          setError(result.error);
          return;
        }

        setIsSuccess(true);
        setTimeout(() => handleClose(), 2000);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      handleNext();
      return;
    }
    // Step 2 — run full form validation + submit
    form.handleSubmit(onSubmit)(e);
  };

  // Check if all day times are filled for the "Next" button
  const allTimesSet =
    selectedDates.length > 0 &&
    selectedDates.every((d) => {
      const key = format(d, "yyyy-MM-dd");
      const times = watchedDayTimes[key];
      return times?.startTime && times?.endTime;
    });

  const canProceedToStep2 =
    watchedName &&
    selectedDates.length > 0 &&
    allTimesSet &&
    watchedLocation &&
    watchedRolesNeeded.length > 0;

  const assignedCount = Object.values(roleAssignments).flat().length;

  // Success state
  if (isSuccess) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <div className="flex flex-1 items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="mb-2 text-2xl font-bold">Event Created</h1>
            <p className="text-muted-foreground">
              {watchedName} has been created for {organizationName}.
              {assignedCount > 0 &&
                ` Invites sent to ${assignedCount} volunteer${assignedCount > 1 ? "s" : ""}.`}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">Redirecting...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col bg-background overflow-hidden">
      {/* Conflict Warning Modal */}
      <Dialog
        open={!!conflictWarning}
        onOpenChange={() => setConflictWarning(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TriangleAlert className="h-5 w-5 text-amber-500" />
              Scheduling Conflict
            </DialogTitle>
            <DialogDescription>
              {conflictWarning && (
                <>
                  <span className="font-medium text-foreground">
                    {conflictWarning.memberName}
                  </span>{" "}
                  is already assigned to{" "}
                  <span className="font-medium text-foreground">
                    {conflictWarning.conflict.eventName}
                  </span>{" "}
                  from {conflictWarning.conflict.startTime} –{" "}
                  {conflictWarning.conflict.endTime} on this day. Assigning them
                  may cause a time overlap.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button className="mr-2" variant="outline" onClick={() => setConflictWarning(null)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleConfirmConflictAssignment}>
              Assign Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-card"
      >
        <div className="container max-w-5xl px-4 py-6">
          <div className="flex items-center gap-4">
            <Button onClick={handleClose}variant="ghost" size="icon" asChild className="shrink-0">
              <Link href={`/dashboard/organizations/${organizationId}`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <CalendarPlus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Create Event</h1>
                  <p className="text-sm text-muted-foreground">
                    {organizationName}
                  </p>
                </div>
              </div>
            </div>
            {/* Step indicator */}
            <div className="hidden items-center gap-2 sm:flex">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  step === 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-emerald-500 text-white",
                )}
              >
                {step === 1 ? "1" : <Check className="h-4 w-4" />}
              </div>
              <span
                className={cn(
                  "text-sm",
                  step === 1
                    ? "text-foreground font-medium"
                    : "text-muted-foreground",
                )}
              >
                Event Details
              </span>
              <div className="h-px w-8 bg-border" />
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  step === 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                2
              </div>
              <span
                className={cn(
                  "text-sm",
                  step === 2
                    ? "text-foreground font-medium"
                    : "text-muted-foreground",
                )}
              >
                Invite Volunteers
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="container max-w-5xl h-full px-4 py-6 flex flex-col mx-auto">
          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>{error}</p>
              <button
                type="button"
                onClick={() => setError(null)}
                className="ml-auto shrink-0 rounded-md p-1 hover:bg-red-100 dark:hover:bg-red-500/20"
              >
                <span className="sr-only">Dismiss</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </motion.div>
          )}

          <form
            onSubmit={handleFormSubmit}
            className="flex-1 flex flex-col min-h-0"
          >
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  <div className="flex-1 grid gap-6 lg:grid-cols-2 min-h-0 overflow-hidden">
                    {/* Left Column - Basic Info */}
                    <div className="space-y-6 overflow-y-auto pr-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            Basic Information
                          </CardTitle>
                          <CardDescription>
                            Enter the event details
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Service Type */}
                          <div className="space-y-2">
                            <Label>Service Type</Label>
                            {!isCreatingNewType ? (
                              <div className="flex gap-2">
                                <Select
                                  value={watchedServiceTypeId}
                                  onValueChange={(val) =>
                                    setValue("serviceTypeId", val, {
                                      shouldValidate: true,
                                    })
                                  }
                                >
                                  <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Select a service type..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {optimisticServiceTypes.map((type) => {
                                      const colors = getColorClasses(
                                        type.color,
                                      );
                                      return (
                                        <SelectItem
                                          key={type.id}
                                          value={type.id}
                                        >
                                          <div className="flex items-center gap-2">
                                            <div
                                              className={cn(
                                                "h-2 w-2 rounded-full",
                                                colors.dot,
                                              )}
                                            />
                                            {type.name}
                                          </div>
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setIsCreatingNewType(true)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-3 rounded-lg border p-3">
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="New service type name..."
                                    value={newTypeName}
                                    onChange={(e) =>
                                      setNewTypeName(e.target.value)
                                    }
                                    autoFocus
                                  />
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={handleCreateNewType}
                                    disabled={isPending}
                                  >
                                    {isPending ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      "Add"
                                    )}
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setIsCreatingNewType(false);
                                      setNewTypeName("");
                                      setNewTypeColor("indigo");
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">
                                    Color:
                                  </span>
                                  <div className="flex gap-1.5">
                                    {newTypeColorOptions.map((color) => {
                                      const colors = getColorClasses(color);
                                      return (
                                        <button
                                          key={color}
                                          type="button"
                                          onClick={() => setNewTypeColor(color)}
                                          className={cn(
                                            "h-5 w-5 rounded-full transition-all",
                                            colors.dot,
                                            newTypeColor === color
                                              ? "ring-2 ring-offset-1 ring-primary"
                                              : "hover:scale-110",
                                          )}
                                        />
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            )}
                            {errors.serviceTypeId && (
                              <p className="text-xs text-red-500">
                                {errors.serviceTypeId.message}
                              </p>
                            )}
                          </div>

                          {/* Event Name */}
                          <div className="space-y-2">
                            <Label htmlFor="name">Event Name *</Label>
                            <Input
                              id="name"
                              placeholder="e.g., Sunday Morning Worship"
                              value={watchedName}
                              onChange={(e) =>
                                setValue("name", e.target.value, {
                                  shouldValidate: true,
                                })
                              }
                            />
                            {errors.name && (
                              <p className="text-xs text-red-500">
                                {errors.name.message}
                              </p>
                            )}
                          </div>

                          {/* Description */}
                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              placeholder="Add details about this event..."
                              value={watchedDescription}
                              onChange={(e) =>
                                setValue("description", e.target.value)
                              }
                              rows={3}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Date & Time Card */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            Date & Time
                          </CardTitle>
                          <CardDescription>
                            Select a date or date range for your event
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Date Range Picker */}
                          <div className="space-y-2">
                            <Label>Event Date(s) *</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !watchedDateRange?.from &&
                                      "text-muted-foreground",
                                  )}
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {watchedDateRange?.from ? (
                                    watchedDateRange.to &&
                                    watchedDateRange.from.getTime() !==
                                      watchedDateRange.to.getTime() ? (
                                      <>
                                        {format(
                                          watchedDateRange.from,
                                          "EEE, MMM d",
                                        )}{" "}
                                        –{" "}
                                        {format(
                                          watchedDateRange.to,
                                          "EEE, MMM d, yyyy",
                                        )}
                                      </>
                                    ) : (
                                      format(
                                        watchedDateRange.from,
                                        "EEEE, MMMM d, yyyy",
                                      )
                                    )
                                  ) : (
                                    <span>Pick a date or date range</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <CalendarComponent
                                  mode="range"
                                  selected={watchedDateRange as DateRange}
                                  onSelect={handleDateRangeChange}
                                  numberOfMonths={2}
                                  disabled={(date) =>
                                    isBefore(date, startOfDay(new Date()))
                                  }
                                />
                              </PopoverContent>
                            </Popover>
                            {errors.dateRange?.from && (
                              <p className="text-xs text-red-500">
                                {errors.dateRange.from.message}
                              </p>
                            )}
                          </div>

                          {/* Per-day start/end time inputs */}
                          {selectedDates.length > 0 && (
                            <div className="space-y-3">
                              <Label>Start & End Times *</Label>
                              <div className="space-y-2">
                                {selectedDates.map((date) => {
                                  const key = format(date, "yyyy-MM-dd");
                                  const dayLabel = format(date, "EEEE, MMM d");
                                  const times = watchedDayTimes[key];
                                  const dayErrors = errors.dayTimes?.[
                                    key as keyof typeof errors.dayTimes
                                  ] as
                                    | {
                                        startTime?: { message?: string };
                                        endTime?: { message?: string };
                                      }
                                    | undefined;

                                  return (
                                    <div
                                      key={key}
                                      className="rounded-lg border p-3 space-y-2"
                                    >
                                      <p className="text-sm font-medium">
                                        {dayLabel}
                                      </p>
                                      <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5 flex-1">
                                          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                                          <Input
                                            type="time"
                                            value={times?.startTime || ""}
                                            onChange={(e) =>
                                              handleDayStartTimeChange(
                                                key,
                                                e.target.value,
                                              )
                                            }
                                            className="w-full"
                                          />
                                        </div>
                                        <span className="text-sm text-muted-foreground shrink-0">
                                          to
                                        </span>
                                        <div className="flex-1">
                                          <Input
                                            type="time"
                                            value={times?.endTime || ""}
                                            onChange={(e) =>
                                              handleDayEndTimeChange(
                                                key,
                                                e.target.value,
                                              )
                                            }
                                            className="w-full"
                                          />
                                        </div>
                                      </div>
                                      {(dayErrors?.startTime ||
                                        dayErrors?.endTime) && (
                                        <p className="text-xs text-red-500">
                                          {dayErrors?.startTime?.message ||
                                            dayErrors?.endTime?.message}
                                        </p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Location */}
                          <div className="space-y-2">
                            <Label htmlFor="location">Location *</Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                id="location"
                                className="pl-10"
                                placeholder="e.g., Main Sanctuary"
                                value={watchedLocation}
                                onChange={(e) =>
                                  setValue("location", e.target.value, {
                                    shouldValidate: true,
                                  })
                                }
                              />
                            </div>
                            {errors.location && (
                              <p className="text-xs text-red-500">
                                {errors.location.message}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Right Column - Roles */}
                    <Card className="flex flex-col min-h-0 overflow-hidden">
                      <CardHeader className="shrink-0">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Users className="h-5 w-5 text-muted-foreground" />
                          Volunteer Roles Needed
                        </CardTitle>
                        <CardDescription>
                          Select the roles required for this event
                        </CardDescription>
                        {errors.rolesNeeded && (
                          <p className="text-xs text-red-500">
                            {errors.rolesNeeded.message}
                          </p>
                        )}
                      </CardHeader>
                      <CardContent className="flex-1 overflow-y-auto min-h-0">
                        <div className="grid gap-2">
                          {volunteerRoleEntries.map(([role, config]) => {
                            const isSelected =
                              watchedRolesNeeded.includes(role);
                            const availableCount =
                              membersByRole[role]?.length || 0;
                            return (
                              <button
                                key={role}
                                type="button"
                                onClick={() => handleRoleToggle(role)}
                                className={cn(
                                  "flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
                                  isSelected
                                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                                    : "border-border hover:border-primary/50 hover:bg-muted/50",
                                )}
                              >
                                <span className="text-xl">{config.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">
                                    {config.label}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {availableCount}
                                  </p>
                                </div>
                                <div
                                  className={cn(
                                    "flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                                    isSelected
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-muted-foreground/30",
                                  )}
                                >
                                  {isSelected && <Check className="h-3 w-3" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Footer - Fixed at bottom */}
                  <div className="shrink-0 flex justify-end gap-3 pt-4 mt-4 border-t bg-background">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!canProceedToStep2 || isCheckingAvailability}
                    >
                      {isCheckingAvailability ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        </>
                      ) : (
                        <>
                          Next: Invite Volunteers
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  {/* Event Summary */}
                  <Card className="shrink-0">
                    <CardContent className="p-4">
                      <div className="flex flex-wrap items-center gap-4">
                        {serviceColors && (
                          <Badge
                            className={cn(
                              "gap-1.5",
                              serviceColors.badge,
                              serviceColors.badgeText,
                            )}
                          >
                            <span
                              className={cn(
                                "h-2 w-2 rounded-full",
                                serviceColors.dot,
                              )}
                            />
                            {selectedServiceType?.name}
                          </Badge>
                        )}
                        <h2 className="text-lg font-semibold">{watchedName}</h2>
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {watchedLocation}
                        </span>
                      </div>

                      {/* Per-day schedule summary */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedDates.map((date) => {
                          const key = format(date, "yyyy-MM-dd");
                          const times = watchedDayTimes[key];
                          return (
                            <div
                              key={key}
                              className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-1.5 text-sm"
                            >
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="font-medium">
                                {format(date, "EEE, MMM d")}
                              </span>
                              {times?.startTime && times?.endTime && (
                                <>
                                  <span className="text-muted-foreground">
                                    ·
                                  </span>
                                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span className="text-muted-foreground">
                                    {times.startTime} - {times.endTime}
                                  </span>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Role Assignments */}
                  <div className="flex-1 grid gap-4 lg:grid-cols-2 mt-4 overflow-y-auto min-h-0 content-start">
                    {watchedRolesNeeded.map((role) => {
                      const config = volunteerRoleConfig[role];
                      const availableMembers = membersByRole[role] || [];
                      const assignedToRole = roleAssignments[role] || [];

                      return (
                        <Card key={role}>
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                              <span className="text-lg">{config.icon}</span>
                              {config.label}
                              {assignedToRole.length > 0 && (
                                <Badge variant="secondary" className="ml-auto">
                                  {assignedToRole.length} assigned
                                </Badge>
                              )}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-0">
                            {availableMembers.length > 0 ? (
                              <div className="max-h-64 overflow-y-auto p-4">
                                <div className="space-y-2">
                                  {availableMembers.map((member) => {
                                    const isAssigned = assignedToRole.includes(
                                      member.userId,
                                    );
                                    const conflict =
                                      memberConflicts[member.userId];

                                    return (
                                      <label
                                        key={member.id}
                                        className={cn(
                                          "flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all",
                                          isAssigned
                                            ? "border-primary bg-primary/5"
                                            : conflict
                                              ? "border-amber-200 bg-amber-50/50 dark:border-amber-500/20 dark:bg-amber-500/5"
                                              : "border-border hover:bg-muted/50",
                                        )}
                                      >
                                        <Checkbox
                                          checked={isAssigned}
                                          onCheckedChange={(checked) =>
                                            handleAssignMember(
                                              role,
                                              member.userId,
                                              checked as boolean,
                                            )
                                          }
                                        />
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary shrink-0">
                                            {member.user.firstName.charAt(0)}
                                          </div>
                                          <div className="min-w-0">
                                            <p className="font-medium truncate">
                                              {member.user.firstName}{" "}
                                              {formatName(member.user.lastName)}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                              {member.user.email}
                                            </p>
                                            {conflict && (
                                              <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-0.5">
                                                <TriangleAlert className="h-3 w-3 shrink-0" />
                                                {conflict.eventName} ·{" "}
                                                {conflict.startTime} -{" "}
                                                {conflict.endTime}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground py-4 text-center">
                                No members available for this role
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Footer - Fixed at bottom */}
                  <div className="shrink-0 flex justify-between gap-3 pt-4 mt-4 border-t bg-background">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Create & Send Invites
                          {assignedCount > 0 && ` (${assignedCount})`}
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client"

import { useState, useTransition } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Check, Send } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { emailAcceptedVolunteers } from "@/lib/actions/event";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventEmailInput, eventEmailSchema } from "@/lib/validations/event-email";

import { toast } from "sonner";

interface EmailTeamDialogProps {
  organizationId: string;
  eventId: string;
  eventName: string;
  recipientCount: number;
}

export function EmailTeamDialog({
  organizationId,
  eventId,
  eventName,
  recipientCount,
}: EmailTeamDialogProps) {

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [sentCount, setSentCount] = useState<number | null>(null);

  const form = useForm<EventEmailInput>({
    resolver: zodResolver(eventEmailSchema),
    defaultValues: {
      subject: "",
      body: "",
    },
  });

  const { isValid } = form.formState;

  const handleSubmit = async (values: EventEmailInput) => {
    startTransition(async () => {
      const result = await emailAcceptedVolunteers(organizationId, eventId, values);

      if (result.success) {
        setSentCount(result.sentCount);
      } else {
        toast.error(result.error, { position: "top-center" });
      };
    });
  };

  const handleClose = () => {
    if (!isPending) {
      setOpen(false);
      form.reset();
      setSentCount(null);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-7 gap-1.5 px-2.5 text-xs cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Mail className="h-3.5 w-3.5" />
        Email Team
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-120">
          {sentCount !== null ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <DialogTitle className="mb-2 text-xl">Message Sent!</DialogTitle>
              <DialogDescription className="text-center">
                Your message was emailed to {sentCount} volunteer
                {sentCount === 1 ? "" : "s"} on {eventName}.
              </DialogDescription>
            </div>
          ) : (
            <>
              <DialogHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <DialogTitle className="text-center text-xl">Email Team</DialogTitle>
                <DialogDescription className="text-center">
                  Send an email to the {recipientCount} volunteer
                  {recipientCount === 1 ? "" : "s"} who accepted {eventName}.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Practice time has changed"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="body"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Hey team, ..."
                            className="min-h-32"
                            disabled={isPending}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Replies will go straight to your email address.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter className="pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={isPending}
                      className="cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isPending || !isValid} className="cursor-pointer">
                      {isPending ? (
                        <>
                          <Spinner data-icon="inline-start" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Email
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

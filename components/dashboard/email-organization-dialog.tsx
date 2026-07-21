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
import { Megaphone, Check, Send } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { emailEntireOrganization } from "@/lib/actions/organizations";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OrganizationEmailInput,
  organizationEmailSchema,
} from "@/lib/validations/organization-email";

import { toast } from "sonner";

interface EmailOrganizationDialogProps {
  organizationId: string;
  organizationName: string;
  recipientCount: number;
}

export function EmailOrganizationDialog({
  organizationId,
  organizationName,
  recipientCount,
}: EmailOrganizationDialogProps) {

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [sentCount, setSentCount] = useState<number | null>(null);

  const form = useForm<OrganizationEmailInput>({
    resolver: zodResolver(organizationEmailSchema),
    defaultValues: {
      subject: "",
      body: "",
    },
  });

  const { isValid } = form.formState;

  const handleSubmit = async (values: OrganizationEmailInput) => {
    startTransition(async () => {
      const result = await emailEntireOrganization(organizationId, values);

      if (result.success) {
        setSentCount(result.sentCount);
      } else {
        toast.error(result.error, { position: "top-center" });
      }
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
        <Megaphone className="h-3.5 w-3.5" />
        Message All
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
                Your message was emailed to all {sentCount} member
                {sentCount === 1 ? "" : "s"} of {organizationName}, including
                you.
              </DialogDescription>
            </div>
          ) : (
            <>
              <DialogHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Megaphone className="h-6 w-6 text-primary" />
                </div>
                <DialogTitle className="text-center text-xl">
                  Message Everyone
                </DialogTitle>
                <DialogDescription className="text-center">
                  Send an email to all {recipientCount} member
                  {recipientCount === 1 ? "" : "s"} of {organizationName},
                  regardless of role. You&apos;ll get a copy too.
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
                            placeholder="Service this Sunday is moved"
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
                            placeholder="Hi everyone, ..."
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

"use client"

import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Loader2, Check } from "lucide-react";
import { VolunteerRole } from "@/generated/prisma/enums";
import { volunteerRoleConfig } from "@/lib/config/roles";

interface InvitePersonModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  organizationId?: string
  organizationName?: string
};

export function InvitePersonModal({
  open,
  onOpenChange,
  organizationId,
  organizationName,
}: InvitePersonModalProps) {

  const [isLoading, setIsLoading] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    volunteerRoles: [] as VolunteerRole[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsSuccess(true)
    
    // Reset after showing success
    setTimeout(() => {
      setIsSuccess(false)
      setFormData({ email: "", volunteerRoles: [] })
      onOpenChange(false)
    }, 2000)
  }

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ email: "", volunteerRoles: [] })
      setIsSuccess(false)
      onOpenChange(false)
    }
  }

  const toggleRole = (role: VolunteerRole) => {
  setFormData((prev) => ({
    ...prev,
    volunteerRoles: prev.volunteerRoles.includes(role)
      ? prev.volunteerRoles.filter((r) => r !== role)
      : [...prev.volunteerRoles, role],
  }))
}

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-120">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="mb-2 text-xl">Invitation Sent!</DialogTitle>
            <DialogDescription className="text-center">
              An invitation has been sent to {formData.email}
              {organizationName && ` to join ${organizationName}`}.
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">Invite Person</DialogTitle>
          <DialogDescription className="text-center">
            {organizationName
              ? `Send an invitation to join ${organizationName}`
              : "Send an invitation to join your organization"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email Address</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="volunteer@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">
              They'll receive an invitation link to join your organization.
            </p>
          </div>
          <div className="space-y-3">
            <Label>Volunteer Roles</Label>
            <div className="max-h-60 space-y-2 overflow-y-auto rounded-lg border border-border/50 bg-muted/30 p-3">
              {Object.values(VolunteerRole).map((role) => {
                const config = volunteerRoleConfig[role];
                return (
                <label
                  key={role}
                  className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-muted/75"
                >
                  <Checkbox
                    checked={formData.volunteerRoles.includes(role)}
                    onCheckedChange={() => toggleRole(role)}
                  />
                  <span className="text-lg">{config.icon}</span>
                  <span className="text-sm font-medium">{config.label}</span>
                </label>
                )
})}
            </div>
            <p className="text-xs text-muted-foreground">
              Select one or more volunteer roles for this person.
            </p>
          </div>
          {formData.volunteerRoles.length > 0 && (
            <div className="rounded-lg border border-border/50 bg-muted/50 p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Selected Roles ({formData.volunteerRoles.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {formData.volunteerRoles.map((r) => {
                  const role = volunteerRoleConfig[r];
                  return (
                    <Badge key={r} variant="outline" className="gap-1">
                      <span>{role.icon}</span>
                      <span>{role.label}</span>
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.email || formData.volunteerRoles.length === 0}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Send Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

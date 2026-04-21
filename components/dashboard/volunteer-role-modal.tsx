"use client"

import { volunteerRoleChangeSchema, volunteerRoleChangeInput } from "@/lib/validations/roles";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter } from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { VolunteerRole } from "@/generated/prisma/enums";
import { UserPlus } from "lucide-react";

interface VolunteerRoleModalProps {
    userId: string
    organizationId: string
    currentvolunteerRoles: VolunteerRole[]
};

export const VolunteerRoleModal = ({ userId, organizationId, currentvolunteerRoles }: VolunteerRoleModalProps) => {


    const form = useForm<volunteerRoleChangeInput>({
        resolver: zodResolver(volunteerRoleChangeSchema),
        defaultValues: {
            volunteerRoles: currentvolunteerRoles
        },
    });

    const { isValid } = form.formState;
    
      const volunteerRoles = form.watch("volunteerRoles");
    
      const toggleRole = (role: VolunteerRole) => {
        const current = form.getValues("volunteerRoles");
        const updated = current.includes(role)
          ? current.filter((r) => r !== role)
          : [...current, role];
        form.setValue("volunteerRoles", updated, { shouldValidate: true });
      };


    return (
        <div>
            testing
        </div>

    //     <Dialog open={open} onOpenChange={handleClose}>
    //   <DialogContent className="sm:max-w-120">
    //     <DialogHeader>
    //       <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
    //         <UserPlus className="h-6 w-6 text-primary" />
    //       </div>
    //       <DialogTitle className="text-center text-xl">Edit Roles</DialogTitle>
    //       <DialogDescription className="text-center">
    //         {/* {organizationName
    //           ? `Send an invitation to join ${organizationName}`
    //           : "Send an invitation to join your organization"} */}
    //       </DialogDescription>
    //     </DialogHeader>
    //     <Form {...form}>
    //       <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
    //         <FormField
    //           control={form.control}
    //           name="volunteerRoles"
    //           render={() => (
    //             <FormItem>
    //               <FormLabel>Volunteer Roles</FormLabel>
    //               <div className="max-h-60 space-y-2 overflow-y-auto rounded-lg border border-border/50 bg-muted/30 p-3">
    //                 {Object.values(VolunteerRole).map((role) => {
    //                   const config = volunteerRoleConfig[role];
    //                   return (
    //                     <label
    //                       key={role}
    //                       className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-muted/75"
    //                     >
    //                       <Checkbox
    //                         checked={volunteerRoles.includes(role)}
    //                         onCheckedChange={() => toggleRole(role)}
    //                         disabled={isPending}
    //                       />
    //                       <span className="text-lg">{config.icon}</span>
    //                       <span className="text-sm font-medium">{config.label}</span>
    //                     </label>
    //                   )
    //                 })}
    //               </div>
    //               <p className="text-xs text-muted-foreground">
    //                 Select one or more volunteer roles for this person.
    //               </p>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />

    //         {volunteerRoles.length > 0 && (
    //           <div className="rounded-lg border border-border/50 bg-muted/50 p-3">
    //             <p className="mb-2 text-xs font-medium text-muted-foreground">
    //               Selected Roles ({volunteerRoles.length}):
    //             </p>
    //             <div className="flex flex-wrap gap-2">
    //               {volunteerRoles.map((r) => {
    //                 const role = volunteerRoleConfig[r];
    //                 return (
    //                   <Badge key={r} variant="outline" className="gap-1">
    //                     <span>{role.icon}</span>
    //                     <span>{role.label}</span>
    //                   </Badge>
    //                 )
    //               })}
    //             </div>
    //           </div>
    //         )}

    //         <DialogFooter className="pt-4">
    //           <Button type="button" variant="outline" onClick={handleClose} disabled={isPending} className="cursor-pointer">
    //             Cancel
    //           </Button>
    //           <Button type="submit" disabled={isPending || !isValid} className="cursor-pointer">
    //             {isPending ? (
    //               <>
    //                 <Spinner data-icon="inline-start" />
    //                 Saving...
    //               </>
    //             ) : (
    //               <>
    //                 <UserPlus className="mr-2 h-4 w-4" />
    //                 Save
    //               </>
    //             )}
    //           </Button>
    //         </DialogFooter>
    //       </form>
    //     </Form>
    //   </DialogContent>
    // </Dialog>
    )
}
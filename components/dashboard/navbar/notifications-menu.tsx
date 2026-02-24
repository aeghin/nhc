// "use client"

// import { Bell, Building2, Calendar, Settings, User } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import type { Notification } from "@/lib/types"
// import { cn } from "@/lib/utils"

// interface NotificationsMenuProps {
//   notifications: Notification[]
// }

// // Define outside component - static, not recreated on each render
// const NOTIFICATION_ICONS = {
//   invitation: Bell,
//   member: User,
//   organization: Building2,
//   system: Settings,
//   event: Calendar,
// } as const

// const NOTIFICATION_COLORS = {
//   invitation: "bg-primary/15 text-primary",
//   member: "bg-chart-2/15 text-chart-2",
//   organization: "bg-chart-4/15 text-chart-4",
//   event: "bg-chart-1/15 text-chart-1",
//   system: "bg-muted text-muted-foreground",
// } as const

// export function NotificationsMenu({ notifications }: NotificationsMenuProps) {
//   const unreadCount = notifications.filter((n) => n.unread).length

//   const handleMarkAllRead = () => {
//     // TODO: Server Action needed
//     // Call markAllNotificationsRead() server action here
//     console.log("TODO: Implement markAllNotificationsRead server action")
//   }

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" size="icon" className="relative h-9 w-9 cursor-pointer rounded-lg transition-all duration-200 hover:bg-muted/80 hover:scale-105">
//           <Bell className="h-4.5 w-4.5" />
//           {unreadCount > 0 && (
//             <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground ring-2 ring-background">
//               {unreadCount}
//             </span>
//           )}
//           <span className="sr-only">Notifications</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-80 p-0">
//         <DropdownMenuLabel className="flex items-center justify-between px-4 py-3">
//           <span className="text-sm font-semibold">Notifications</span>
//           {unreadCount > 0 && (
//             <Button
//               variant="ghost"
//               size="sm"
//               className="h-auto cursor-pointer p-0 text-xs font-medium text-primary hover:text-primary/80 hover:bg-transparent"
//               onClick={handleMarkAllRead}
//             >
//               Mark all read
//             </Button>
//           )}
//         </DropdownMenuLabel>
//         <DropdownMenuSeparator className="m-0" />
//         {notifications.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-10 text-center">
//             <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 mb-3">
//               <Bell className="h-5 w-5 text-muted-foreground" />
//             </div>
//             <p className="text-sm font-medium text-muted-foreground">No notifications</p>
//             <p className="text-xs text-muted-foreground/70 mt-1">You're all caught up!</p>
//           </div>
//         ) : (
//           <div className="max-h-100 overflow-y-auto">
//             {notifications.map((notification) => {
//               const Icon = NOTIFICATION_ICONS[notification.type] || Bell
//               const colorClass = NOTIFICATION_COLORS[notification.type] || NOTIFICATION_COLORS.system

//               return (
//                 <DropdownMenuItem
//                   key={notification.id}
//                   className="flex cursor-pointer items-start gap-3 px-4 py-3 focus:bg-muted/50"
//                 >
//                   <div
//                     className={cn(
//                       "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform",
//                       colorClass,
//                     )}
//                   >
//                     <Icon className="h-4 w-4" />
//                   </div>
//                   <div className="flex-1 space-y-1">
//                     <div className="flex items-center justify-between gap-2">
//                       <span className="text-sm font-medium leading-tight">{notification.title}</span>
//                       {notification.unread && (
//                         <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
//                       )}
//                     </div>
//                     <p className="text-xs text-muted-foreground leading-relaxed">{notification.message}</p>
//                     <p className="text-[11px] text-muted-foreground/60">{notification.time}</p>
//                   </div>
//                 </DropdownMenuItem>
//               )
//             })}
//           </div>
//         )}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }

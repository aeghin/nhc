'use client'

import { useState } from 'react'
import { Bell, Calendar, Mail, User, LogOut, Settings } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { UserButton } from '@clerk/nextjs'

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState("invites")
    const [notifications, setNotifications] = useState([
        { id: 1, message: "New invite from John Doe" },
        { id: 2, message: "Reminder: Team meeting at 3 PM" },
        { id: 3, message: "Your event 'Project Review' starts in 1 hour" },
    ])

    const invites = [
        { id: 1, from: "Alice Smith", event: "Team Lunch", date: "2023-06-15" },
        { id: 2, from: "Bob Johnson", event: "Project Kickoff", date: "2023-06-18" },
    ]

    const events = [
        { id: 1, name: "Weekly Standup", date: "2023-06-14" },
        { id: 2, name: "Client Presentation", date: "2023-06-16" },
        { id: 3, name: "Team Building", date: "2023-06-20" },
    ]

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Card className="w-full max-w-4xl mx-auto">
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">User Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="icon" className="relative">
                                        <Bell className="h-4 w-4" />
                                        {notifications.length > 0 && (
                                            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="space-y-4">
                                        <h2 className="font-semibold">Notifications</h2>
                                        {notifications.map((notification, index) => (
                                            <div key={notification.id}>
                                                {index > 0 && <Separator className="my-2" />}
                                                <div className="text-sm">{notification.message}</div>
                                            </div>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <UserButton />
                        </div>
                    </div>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="invites" className="flex items-center">
                                <Mail className="mr-2 h-4 w-4" />
                                Invites
                            </TabsTrigger>
                            <TabsTrigger value="events" className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4" />
                                Events
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="invites">
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Pending Invites</h2>
                                {invites.map((invite) => (
                                    <Card key={invite.id}>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium">{invite.event}</p>
                                                    <p className="text-sm text-muted-foreground">From: {invite.from}</p>
                                                    <p className="text-sm text-muted-foreground">Date: {invite.date}</p>
                                                </div>
                                                <div className="space-x-2">
                                                    <Button size="sm" variant="outline">Decline</Button>
                                                    <Button size="sm">Accept</Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="events">
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Upcoming Events</h2>
                                {events.map((event) => (
                                    <Card key={event.id}>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium">{event.name}</p>
                                                    <p className="text-sm text-muted-foreground">Date: {event.date}</p>
                                                </div>
                                                <Button size="sm" variant="outline">View Details</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
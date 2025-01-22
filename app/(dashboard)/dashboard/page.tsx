'use client'

import { useState, useEffect } from 'react'
import { Bell, User, LogOut, Settings, PlusCircle, UserPlus, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from '@/components/ui/separator'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import axios from 'axios';

import { TabsPage } from '@/components/tabs'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { UserButton } from '@clerk/nextjs';

export default function Component() {
    const [notifications, setNotifications] = useState([
        { id: 1, message: "Welcome to OrganizeMe!" },
        { id: 2, message: "Create your first organization to get started." },
    ])
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false)
    const [orgName, setOrgName] = useState("")
    const [inviteCode, setInviteCode] = useState("")
    const [organizations, setOrganizations] = useState([{}]);

    const handleCreateOrg = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Creating organization:", orgName)
        setIsCreateDialogOpen(false)
        setOrgName("")
        // Here you would typically make an API call to create the organization
    }

    const handleJoinOrg = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Joining organization with code:", inviteCode)
        setIsJoinDialogOpen(false)
        setInviteCode("")
        // Here you would typically make an API call to join the organization
    }

    // useEffect(() => {
    //     const fetchOrgs = async () => {
    //         try {
    //             const { data } = await axios.get('/api/getOrg');
    //             setOrganizations(data);
    //         } catch (err) {
    //             console.log(err)
    //         };
    //     }
    //     fetchOrgs();
    // }, []);

    console.log(organizations);



    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                    {/* Left Section - Title */}
                    <h1 className="text-2xl font-semibold text-gray-900">NHC</h1>

                    {/* Right Section - Notifications and UserButton */}
                    <div className="ml-auto flex items-center space-x-4">
                        {/* Notification Bell */}
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

                        {/* User Button */}
                        <UserButton />
                    </div>
                </div>
            </header>
            {organizations.length === 0 ?
                <>
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <Card className="w-full max-w-md mx-auto">
                            <CardHeader>
                                <CardTitle>NHC</CardTitle>
                                <CardDescription>Get started by creating or joining an organization</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button
                                    className="w-full justify-between"
                                    onClick={() => setIsCreateDialogOpen(true)}
                                >
                                    Create a new organization
                                    <PlusCircle className="ml-2 h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between"
                                    onClick={() => setIsJoinDialogOpen(true)}
                                >
                                    Join an existing organization
                                    <UserPlus className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </main>

                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create a New Organization</DialogTitle>
                                <DialogDescription>
                                    Enter a name for your new organization. You can invite team members later.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateOrg}>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="org-name">Organization Name</Label>
                                        <Input
                                            id="org-name"
                                            placeholder="Enter organization name"
                                            value={orgName}
                                            onChange={(e) => setOrgName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={!orgName.trim()}>
                                        Create Organization
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Join an Organization</DialogTitle>
                                <DialogDescription>
                                    Enter the invite code provided by your organization admin.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleJoinOrg}>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="invite-code">Invite Code</Label>
                                        <Input
                                            id="invite-code"
                                            placeholder="Enter invite code"
                                            value={inviteCode}
                                            onChange={(e) => setInviteCode(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={!inviteCode.trim()}>
                                        Join Organization
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </>
                :
                <TabsPage />
            }
        </div>
    )

}

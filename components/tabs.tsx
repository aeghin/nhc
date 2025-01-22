import {
Tabs,
TabsList,
TabsTrigger,
TabsContent
} from '@/components/ui/tabs';
import { useState } from 'react';

import Link from 'next/link'

import { Card, CardContent } from './ui/card';
import { Mail, Calendar } from 'lucide-react';
import { Button } from './ui/button';

export const TabsPage = () => {
    const [activeTab, setActiveTab] = useState("invites");

    const invites = [
        { id: 1, from: "Alice Smith", event: "Team Lunch", date: "2023-06-15" },
        { id: 2, from: "Bob Johnson", event: "Project Kickoff", date: "2023-06-18" },
      ];

      const events = [
        { id: 1, name: "Weekly Jam Session", date: "2023-06-14" },
        { id: 2, name: "Acoustic Night", date: "2023-06-16" },
      ];

    return (
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
                        <Link href={`/event/${event.id}`} passHref>
                          <Button size="sm" variant="outline" as="a">View Details</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
    )
}
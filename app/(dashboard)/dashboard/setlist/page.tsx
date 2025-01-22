'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Music, Calendar, Clock, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

// This would typically come from an API call
const events = [
  {
    id: 1,
    name: "Weekly Jam Session",
    date: "2023-06-14",
    time: "7:00 PM - 10:00 PM",
    description: "Join us for our weekly jam session where we'll be playing a mix of classic rock and blues. Whether you're a seasoned musician or just starting out, this is the perfect opportunity to collaborate with fellow music enthusiasts and showcase your skills.",
    location: "Music Studio A, 123 Melody Lane",
    image: "/placeholder.svg?height=400&width=800",
    songs: [
      { id: 1, title: "Stairway to Heaven", link: "https://example.com/stairway-to-heaven" },
      { id: 2, title: "Sweet Child O' Mine", link: "https://example.com/sweet-child-o-mine" },
      { id: 3, title: "Bohemian Rhapsody", link: "https://example.com/bohemian-rhapsody" },
      { id: 4, title: "Hotel California", link: "https://example.com/hotel-california" },
    ],
    musicians: [
      { name: "John Doe", instrument: "Guitar", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Jane Smith", instrument: "Drums", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Mike Johnson", instrument: "Bass", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Sarah Williams", instrument: "Vocals", avatar: "/placeholder.svg?height=40&width=40" },
    ],
  },
  {
    id: 2,
    name: "Acoustic Night",
    date: "2023-06-16",
    time: "8:00 PM - 11:00 PM",
    description: "An intimate evening of acoustic performances featuring local singer-songwriters. Experience the raw talent and emotion of unplugged music in a cozy, welcoming atmosphere.",
    location: "The Cozy Corner Cafe, 456 Harmony Street",
    image: "/placeholder.svg?height=400&width=800",
    songs: [
      { id: 5, title: "Wonderwall", link: "https://example.com/wonderwall" },
      { id: 6, title: "Hallelujah", link: "https://example.com/hallelujah" },
      { id: 7, title: "The Sound of Silence", link: "https://example.com/sound-of-silence" },
      { id: 8, title: "Imagine", link: "https://example.com/imagine" },
    ],
    musicians: [
      { name: "Emily Brown", instrument: "Acoustic Guitar", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "David Lee", instrument: "Cajon", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Lisa Chen", instrument: "Violin", avatar: "/placeholder.svg?height=40&width=40" },
    ],
  },
]

export default function Component() {
  const router = useRouter()
  const params = useParams()
  const [event, setEvent] = useState(events[0])

  useEffect(() => {
    const eventId = parseInt(params.id, 10)
    const foundEvent = events.find(e => e.id === eventId)
    if (foundEvent) {
      setEvent(foundEvent)
    }
  }, [params.id])

  if (!event) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="relative p-0">
          <Image src={event.image} alt={event.name} width={800} height={400} className="w-full h-48 object-cover rounded-t-lg" />
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
            <Button
              variant="ghost"
              className="text-white hover:text-white hover:bg-white/20"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {event.date}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {event.time}
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  {event.location}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-2">About the Event</h2>
              <p className="text-muted-foreground">{event.description}</p>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-4">Setlist</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.songs.map((song) => (
                  <Card key={song.id}>
                    <CardContent className="p-4 flex items-center">
                      <Music className="mr-3 h-5 w-5 text-primary" />
                      <a href={song.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {song.title}
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-4">Featured Musicians</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {event.musicians.map((musician, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={musician.avatar} alt={musician.name} />
                        <AvatarFallback>{musician.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{musician.name}</p>
                        <p className="text-sm text-muted-foreground">{musician.instrument}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
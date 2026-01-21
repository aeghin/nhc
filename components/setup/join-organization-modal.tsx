"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Loader2, Search, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface CreateOrganizationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const mockSearchResults = [
  { id: "1", name: "Grace Community Church", memberCount: 24, description: "Sunday worship services" },
  { id: "2", name: "Harmony Music Ministry", memberCount: 12, description: "Youth and adult worship band" },
  { id: "3", name: "City Outreach Center", memberCount: 45, description: "Community service coordination" },
]

export function JoinOrganizationModal({ open, onOpenChange }: CreateOrganizationModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null)
  const [requestSent, setRequestSent] = useState(false)

  const filteredResults =
    searchQuery.length >= 2
      ? mockSearchResults.filter((org) => org.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : []

  const handleRequestToJoin = async () => {
    if (!selectedOrg) return
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setRequestSent(true)
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset state after modal closes
    setTimeout(() => {
      setSearchQuery("")
      setSelectedOrg(null)
      setRequestSent(false)
    }, 200)
  }

  if (requestSent) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-120">
          <div className="flex flex-col items-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Request Sent!</h3>
            <p className="mb-6 text-muted-foreground">
              Your request to join has been sent to the organization admin. You'll be notified once it's approved.
            </p>
            <Button onClick={handleClose}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-130">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">Join Organization</DialogTitle>
          <DialogDescription className="text-center">
            Search for an organization to request membership.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="search-org">Search Organizations</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search-org"
                placeholder="Type at least 2 characters to search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredResults.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Results</Label>
              <div className="max-h-60 space-y-2 overflow-y-auto">
                {filteredResults.map((org) => (
                  <Card
                    key={org.id}
                    className={`cursor-pointer transition-all hover:border-primary/50 ${
                      selectedOrg === org.id ? "border-primary bg-primary/5 ring-1 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedOrg(org.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{org.name}</h4>
                          <p className="text-sm text-muted-foreground">{org.description}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{org.memberCount} members</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {searchQuery.length >= 2 && filteredResults.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              <p>No organizations found matching "{searchQuery}"</p>
            </div>
          )}

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-xs text-muted-foreground">or</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invite-code">Have an Invite Code?</Label>
            <Input id="invite-code" placeholder="Enter your invite code" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleRequestToJoin} disabled={isLoading || !selectedOrg}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Request...
              </>
            ) : (
              "Request to Join"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

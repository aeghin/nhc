"use client"

import { useState } from "react"
import { Building2, Users, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { CreateOrganizationModal } from "@/components/setup/create-organization-modal"
import { JoinOrganizationModal } from "@/components/setup/join-organization-modal"

import { useRouter } from "next/navigation";


import Link from "next/link"

export default function SetupPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary/70 shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow text-primary-foreground font-bold text-sm">
              N
            </div>
            <span className="text-lg font-semibold">NHW</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Welcome Section */}
          <div className="mb-10 text-center">
            <h1 className="mb-3 text-3xl font-bold tracking-tight">Welcome to NHW</h1>
            <p className="text-lg text-muted-foreground">
              Get started by creating a new organization or joining an existing one.
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Create Organization Card */}
            <Card
              className="group relative cursor-pointer overflow-hidden border-2 transition-all hover:border-primary hover:shadow-lg"
              onClick={() => setCreateModalOpen(true)}
            >
              <CardContent className="p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <Building2 className="h-7 w-7" />
                </div>
                <h2 className="mb-2 text-xl font-semibold">Create Organization</h2>
                <p className="mb-6 text-muted-foreground">
                  Start fresh and invite members to join your new organization.
                </p>
                <div className="flex items-center text-sm font-medium text-primary">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>

            {/* Join Organization Card */}
            <Card
              className="group relative cursor-pointer overflow-hidden border-2 transition-all hover:border-primary hover:shadow-lg"
              onClick={() => setJoinModalOpen(true)}
            >
              <CardContent className="p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <Users className="h-7 w-7" />
                </div>
                <h2 className="mb-2 text-xl font-semibold">Join Organization</h2>
                <p className="mb-6 text-muted-foreground">Search for an existing organization or use an invite code.</p>
                <div className="flex items-center text-sm font-medium text-primary">
                  Find Organization
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Help Text */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Need help getting started?{" "}
            <Link href="#" className="font-medium text-primary hover:underline">
              View our guide
            </Link>
          </p>
        </div>
      </main>

      {/* Modals */}
      <CreateOrganizationModal open={createModalOpen} onOpenChange={setCreateModalOpen} onSuccess={() => router.push('/dashboard')}/>
      <JoinOrganizationModal open={joinModalOpen} onOpenChange={setJoinModalOpen} />
    </div>
  )
}

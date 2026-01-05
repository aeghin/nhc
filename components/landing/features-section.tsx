import { Calendar, Users, Music, Bell, Shield, Zap, BarChart3, Clock } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Multi-Organization Support",
    description: "Manage multiple churches or teams from a single dashboard with distinct roles and permissions.",
  },
  {
    icon: Calendar,
    title: "Smart Event Scheduling",
    description:
      "Create recurring events, set role requirements, and let volunteers self-assign based on availability.",
  },
  {
    icon: Music,
    title: "Instrument & Role Tracking",
    description: "Define roles like guitarist, pianist, drummer, vocalist and match volunteers to their strengths.",
  },
  {
    icon: Bell,
    title: "Real-Time Notifications",
    description: "Automated reminders, schedule changes, and instant updates keep everyone on the same page.",
  },
  {
    icon: Shield,
    title: "Role-Based Permissions",
    description: "Admins get full control. Leaders manage their teams. Volunteers see what matters to them.",
  },
  {
    icon: Clock,
    title: "Availability Management",
    description: "Volunteers set their availability, making scheduling conflicts a thing of the past.",
  },
  {
    icon: BarChart3,
    title: "Insights & Reports",
    description: "Track volunteer engagement, event attendance, and team health with beautiful dashboards.",
  },
  {
    icon: Zap,
    title: "Quick Actions",
    description: "Accept events, swap shifts, and update availability in just a few taps.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-28 md:py-36 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-20">
          <p className="text-sm font-semibold text-primary mb-4 tracking-wide uppercase">Features</p>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">Everything your team needs</h2>
          <p className="mt-6 text-lg text-muted-foreground text-pretty">
            Powerful tools designed specifically for worship teams, churches, and community organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

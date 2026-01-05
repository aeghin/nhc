import { CheckCircle2 } from "lucide-react"

const steps = [
  {
    step: "01",
    title: "Create your organization",
    description:
      "Set up your church or community organization in minutes. Define your team structure and invite members.",
    highlights: ["Quick 2-minute setup", "Invite unlimited members", "Custom role definitions"],
  },
  {
    step: "02",
    title: "Schedule events & assign roles",
    description: "Create services, rehearsals, or special events. Specify which roles are needed for each.",
    highlights: ["Recurring event support", "Role requirements", "Conflict detection"],
  },
  {
    step: "03",
    title: "Volunteers accept & prepare",
    description: "Team members receive invitations, see their assigned roles, and confirm their availability.",
    highlights: ["Mobile-friendly interface", "One-tap acceptance", "Automatic reminders"],
  },
  {
    step: "04",
    title: "Stay in sync, always",
    description: "Real-time updates and notifications ensure your entire team is coordinated and ready.",
    highlights: ["Live schedule updates", "Team notifications", "Performance insights"],
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-20">
          <p className="text-sm font-semibold text-primary mb-4 tracking-wide uppercase">How it works</p>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">Get started in 4 simple steps</h2>
        </div>

        <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-8">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-border to-transparent -translate-x-4 z-0" />
              )}

              <div className="relative bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                <ul className="space-y-2">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

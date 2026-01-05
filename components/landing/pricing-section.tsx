import { Button } from "@/components/ui/button"
import { Check, Sparkles } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "Perfect for small teams getting started",
    features: [
      "1 organization",
      "Up to 15 volunteers",
      "Basic event scheduling",
      "Email notifications",
      "Mobile access",
    ],
    cta: "Get started free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For growing churches and organizations",
    features: [
      "Unlimited organizations",
      "Unlimited volunteers",
      "Advanced scheduling & recurring events",
      "Role management & permissions",
      "SMS & push notifications",
      "Analytics dashboard",
      "Priority support",
    ],
    cta: "Start 14-day free trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with custom needs",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated account manager",
      "On-premise deployment option",
      "SLA guarantee",
      "Training & onboarding",
      "API access",
    ],
    cta: "Contact sales",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-20">
          <p className="text-sm font-semibold text-primary mb-4 tracking-wide uppercase">Pricing</p>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">Simple, transparent pricing</h2>
          <p className="mt-6 text-lg text-muted-foreground">Start free and scale as your team grows. No hidden fees.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border bg-card p-8 flex flex-col ${
                plan.popular ? "border-primary shadow-xl shadow-primary/10 scale-105 lg:scale-110" : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground shadow-lg">
                    <Sparkles className="h-3.5 w-3.5" />
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/dashboard">
                <Button
                  className={`w-full h-12 ${plan.popular ? "shadow-lg shadow-primary/25" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

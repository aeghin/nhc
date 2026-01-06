import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "NHW completely transformed how we manage our worship team. We went from chaotic group chats to a seamless scheduling system. Our volunteers actually know when they're serving now!",
    author: "Sarah Mitchell",
    role: "Worship Director",
    org: "Grace Community Church",
    initials: "SM",
  },
  {
    quote:
      "As a drummer serving at multiple churches, I love being able to see all my upcoming events and roles in one place. The notification system means I never miss a service.",
    author: "Marcus Johnson",
    role: "Drummer & Volunteer",
    org: "New Life Fellowship",
    initials: "MJ",
  },
  {
    quote:
      "The admin dashboard gives me complete visibility. I can see who's available, track engagement, and make sure we're never short-staffed. It's been a game-changer.",
    author: "Rachel Chen",
    role: "Operations Manager",
    org: "Hillside Church",
    initials: "RC",
  },
  {
    quote:
      "We tried three other platforms before NHW. Nothing else understood the unique needs of worship teams. The role-based system for musicians is exactly what we needed.",
    author: "David Park",
    role: "Senior Pastor",
    org: "Restoration Church",
    initials: "DP",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-28 md:py-36 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-20">
          <p className="text-sm font-semibold text-primary mb-4 tracking-wide uppercase">Testimonials</p>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
            Loved by worship teams everywhere
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Join thousands of churches and organizations who trust NHW.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="relative rounded-2xl border border-border bg-card p-8 hover:border-primary/30 transition-colors"
            >
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground leading-relaxed mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.org}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

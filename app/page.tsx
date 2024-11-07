'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, CheckCircle, Menu, X, ChevronDown } from "lucide-react"
import { SignUpButton } from "@clerk/nextjs";
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className={`py-4 px-4 sm:px-6 lg:px-8 fixed w-full z-10 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md shadow-md' : ''}`}>
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/placeholder.svg" alt="Logo" width={32} height={32} className="rounded-full" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">ModernBrand</span>
          </Link>
          <nav className="hidden md:flex space-x-8">
            {['Features', 'Pricing', 'Contact'].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium hover:text-primary transition-colors">
                {item}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex space-x-4">
            <Button variant="ghost">Log in</Button>
            <SignUpButton />
          </div>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-md">
          <nav className="flex flex-col items-center justify-center h-full space-y-8">
            {['Features', 'Pricing', 'Contact'].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-2xl font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <Button variant="ghost" className="w-32" onClick={() => setIsMenuOpen(false)}>
              Log in
            </Button>
            <Button className="w-32" onClick={() => setIsMenuOpen(false)}>
              Sign up
            </Button>
          </nav>
        </div>
      )}

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              Revolutionize Your Workflow
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
              Experience the future of productivity with our cutting-edge platform. Streamline your tasks, collaborate seamlessly, and achieve more.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
            <div className="mt-16 relative">
              <Image
                src="/placeholder.svg"
                alt="Product screenshot"
                width={1200}
                height={600}
                className="rounded-xl shadow-2xl transition-all duration-300 hover:shadow-primary/25"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent rounded-xl"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                "AI-Powered Insights",
                "Real-time Collaboration",
                "Customizable Workflows",
                "Advanced Analytics",
                "Seamless Integrations",
                "24/7 Priority Support",
              ].map((feature, index) => (
                <div key={index} className="bg-card p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CheckCircle className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold text-xl mb-2">{feature}</h3>
                  <p className="text-muted-foreground">
                    Enhance your productivity with our state-of-the-art {feature.toLowerCase()} feature, designed to streamline your workflow.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Work?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied professionals and experience the difference today.
            </p>
            <Button size="lg" variant="secondary" className="group">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Flexible Pricing Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Starter", price: "$9", period: "month" },
                { name: "Pro", price: "$29", period: "month" },
                { name: "Enterprise", price: "Custom", period: "year" },
              ].map((plan, index) => (
                <div key={index} className="bg-card p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <h3 className="font-semibold text-xl mb-2">{plan.name}</h3>
                  <p className="text-3xl font-bold mb-4">
                    {plan.price}
                    <span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>
                  </p>
                  <ul className="mb-6 space-y-2">
                    {["Feature 1", "Feature 2", "Feature 3"].map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-primary mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full">Choose Plan</Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="container mx-auto max-w-md">
            <h2 className="text-3xl font-bold text-center mb-8">Get in Touch</h2>
            <form className="space-y-4">
              <Input type="text" placeholder="Your Name" />
              <Input type="email" placeholder="Your Email" />
              <textarea
                className="w-full px-3 py-2 text-foreground bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
                placeholder="Your Message"
              ></textarea>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <Image src="/placeholder.svg" alt="Logo" width={32} height={32} className="inline-block mr-2 rounded-full" />
            <span className="text-xl font-semibold">ModernBrand</span>
            <p className="text-sm text-muted-foreground mt-2">© 2023 ModernBrand. All rights reserved.</p>
          </div>
          <nav className="flex flex-wrap justify-center md:justify-end gap-4">
            {["Privacy Policy", "Terms of Service", "Contact Us"].map((item) => (
              <Link key={item} href="#" className="text-sm hover:text-primary transition-colors">
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  )
}

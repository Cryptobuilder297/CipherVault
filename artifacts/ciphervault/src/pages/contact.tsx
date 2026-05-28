import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Globe, Clock, CheckCircle } from "lucide-react";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    desc: "Get a response within 2 hours",
    value: "support@ciphervault.io",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    desc: "Available 24/7 for instant help",
    value: "Start live chat →",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: Globe,
    title: "Help Center",
    desc: "Browse our knowledge base",
    value: "help.ciphervault.io",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: Clock,
    title: "Response Time",
    desc: "Typical response time",
    value: "< 2 hours",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative py-24 border-b border-border grid-bg">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-primary/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
            Get In Touch
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
            We're here to <span className="gradient-text">help</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Have a question, issue, or just want to learn more? Our team is ready to assist you 24/7.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 border-b border-border bg-card/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method) => (
              <div key={method.title} className={`p-6 rounded-2xl border ${method.bg} text-center`}>
                <div className="w-12 h-12 rounded-xl bg-background/50 border border-border flex items-center justify-center mx-auto mb-3">
                  <method.icon className={`w-6 h-6 ${method.color}`} />
                </div>
                <h3 className="font-semibold mb-1">{method.title}</h3>
                <p className="text-xs text-muted-foreground mb-2">{method.desc}</p>
                <p className={`text-sm font-medium ${method.color}`}>{method.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Send us a message</h2>
            <p className="text-muted-foreground">Fill out the form below and we'll get back to you within 2 hours.</p>
          </div>

          {submitted ? (
            <div className="text-center py-16 border border-border rounded-2xl bg-card/50">
              <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
              <p className="text-muted-foreground mb-6">We've received your message and will respond within 2 hours.</p>
              <Button variant="outline" onClick={() => setSubmitted(false)}>Send Another</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 p-8 border border-border rounded-2xl bg-card/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Smith"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="How can we help you?"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue or question in detail..."
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  className="resize-none"
                />
              </div>
              <Button type="submit" size="lg" className="w-full">Send Message</Button>
              <p className="text-xs text-center text-muted-foreground">
                By submitting, you agree to our Privacy Policy and Terms of Service.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Office Info */}
      <section className="py-16 bg-card/20 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h4 className="font-semibold mb-2">Headquarters</h4>
            <p className="text-sm text-muted-foreground">CipherVault Technologies Ltd<br />71-75 Shelton Street, London<br />WC2H 9JQ, United Kingdom</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Operations Center</h4>
            <p className="text-sm text-muted-foreground">Suite 400, 1 World Trade Center<br />New York, NY 10007<br />United States</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Support Hours</h4>
            <p className="text-sm text-muted-foreground">24/7 Live Chat & Email<br />Phone: Mon–Fri 9AM–6PM GMT<br />Emergency: Always available</p>
          </div>
        </div>
      </section>
    </div>
  );
}

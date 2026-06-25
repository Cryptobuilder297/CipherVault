import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Globe, Clock, CheckCircle } from "lucide-react";

const contactMethods = [
  { icon: Mail, title: "Email Support", desc: "Get a response within 2 hours", value: "support@ciphervault.io" },
  { icon: MessageSquare, title: "Live Chat", desc: "Available 24/7 for instant help", value: "Start live chat" },
  { icon: Globe, title: "Help Center", desc: "Browse our knowledge base", value: "help.ciphervault.io" },
  { icon: Clock, title: "Response Time", desc: "Typical response time", value: "< 2 hours" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative py-24 border-b border-border grid-bg">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <p className="text-[12px] uppercase tracking-widest text-muted-foreground mb-5">Get In Touch</p>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-5 text-white tracking-tight">
            We're here to help
          </h1>
          <p className="text-[16px] text-muted-foreground max-w-xl mx-auto">
            Have a question, issue, or just want to learn more? Our team is ready to assist you 24/7.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-14 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactMethods.map((method) => (
              <div key={method.title} className="p-6 rounded-xl border border-border bg-card text-center">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-border flex items-center justify-center mx-auto mb-3">
                  <method.icon className="w-5 h-5 text-foreground/60" />
                </div>
                <h3 className="font-semibold text-white mb-1 text-[14px]">{method.title}</h3>
                <p className="text-[12px] text-muted-foreground mb-2">{method.desc}</p>
                <p className="text-[13px] text-foreground font-medium">{method.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-white tracking-tight mb-3">Send us a message</h2>
            <p className="text-muted-foreground text-[15px]">We'll get back to you within 2 hours.</p>
          </div>

          {submitted ? (
            <div className="text-center py-16 border border-border rounded-xl bg-card">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-border flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-foreground/60" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Message Sent</h3>
              <p className="text-muted-foreground text-[14px] mb-6">We'll respond within 2 hours.</p>
              <Button variant="outline" onClick={() => setSubmitted(false)}>Send Another</Button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5 p-8 border border-border rounded-xl bg-card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[13px]">Full Name</Label>
                  <Input id="name" placeholder="John Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[13px]">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-[13px]">Subject</Label>
                <Input id="subject" placeholder="How can we help?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-[13px]">Message</Label>
                <Textarea id="message" placeholder="Describe your issue or question..." rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required className="resize-none" />
              </div>
              <Button type="submit" size="lg" className="w-full">Send Message</Button>
              <p className="text-[12px] text-center text-muted-foreground">
                By submitting, you agree to our Privacy Policy and Terms of Service.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Office Info */}
      <section className="py-14 bg-card/20 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h4 className="font-semibold text-white mb-2 text-[14px]">Headquarters</h4>
            <p className="text-[13px] text-muted-foreground">CipherVault Technologies Ltd<br />71-75 Shelton Street, London<br />WC2H 9JQ, United Kingdom</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2 text-[14px]">Operations</h4>
            <p className="text-[13px] text-muted-foreground">Suite 400, 1 World Trade Center<br />New York, NY 10007<br />United States</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2 text-[14px]">Support Hours</h4>
            <p className="text-[13px] text-muted-foreground">24/7 Live Chat & Email<br />Phone: Mon–Fri 9AM–6PM GMT<br />Emergency: Always available</p>
          </div>
        </div>
      </section>
    </div>
  );
}

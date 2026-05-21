import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Zap,
  BarChart3,
  Shield,
  CheckCircle,
  ArrowRight,
  Users,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Bulk CV Upload",
    description:
      "Upload dozens of PDF resumes at once. No reformatting required.",
  },
  {
    icon: Zap,
    title: "AI-Powered Matching",
    description:
      "Our AI reads every CV in seconds and ranks them against your job description.",
  },
  {
    icon: BarChart3,
    title: "Scored Results",
    description:
      "Every candidate gets a match score with detailed strengths and weaknesses.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your files are encrypted and never used to train AI models.",
  },
  {
    icon: Clock,
    title: "Save Hours",
    description:
      "What takes a recruiter days now takes minutes. Focus on people, not paperwork.",
  },
  {
    icon: Users,
    title: "Team Ready",
    description:
      "Share results and collaborate with your hiring team in one place.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileText className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold tracking-tight">BetterForms</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#features" className="text-muted-foreground transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground transition-colors hover:text-foreground">
              How it works
            </a>
            <a href="#pricing" className="text-muted-foreground transition-colors hover:text-foreground">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }))}>
              Sign in
            </Link>
            <Link href="/signup" className={cn(buttonVariants())}>
              Get started free
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="container mx-auto max-w-6xl px-4 text-center">
            <Badge variant="secondary" className="mb-6">
              AI-Powered Hiring Tool
            </Badge>
            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Find the{" "}
              <span className="text-primary">best candidates</span>{" "}
              in minutes, not days
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Upload your CVs and job description. BetterForms instantly ranks every
              candidate with AI-generated match scores and actionable explanations.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
                Start matching for free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className={cn(buttonVariants({ size: "lg", variant: "outline" }))}>
                Sign in to dashboard
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required &middot; Free to start
            </p>
          </div>
        </section>

        <Separator />

        {/* Features */}
        <section id="features" className="py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center">
              <Badge variant="outline" className="mb-4">Features</Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Everything you need to hire smarter
              </h2>
              <p className="mt-4 text-muted-foreground">
                Built for recruiters and hiring managers who value speed and accuracy.
              </p>
            </div>
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="border-border/50">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="mb-2 font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* How it works */}
        <section id="how-it-works" className="bg-muted/30 py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center">
              <Badge variant="outline" className="mb-4">How it works</Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Three steps to better hiring
              </h2>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Upload CVs",
                  desc: "Drag and drop your PDF resumes — upload as many as you need.",
                },
                {
                  step: "02",
                  title: "Describe the role",
                  desc: "Paste your job description or upload it as a document.",
                },
                {
                  step: "03",
                  title: "Get ranked results",
                  desc: "Receive scored, ranked candidates with AI explanations instantly.",
                },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* CTA */}
        <section className="py-24">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Ready to hire smarter?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join hiring teams already saving hours every week with BetterForms.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["Free to start", "No credit card", "Cancel anytime"].map((item) => (
                <li key={item} className="flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
                <FileText className="h-3 w-3" />
              </div>
              <span className="text-sm font-medium">BetterForms</span>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} BetterForms. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

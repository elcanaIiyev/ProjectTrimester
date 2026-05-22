import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Zap,
  BarChart3,
  Shield,
  CheckCircle,
  ArrowRight,
  Users,
  Clock,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Bulk CV Upload",
    description: "Upload dozens of PDF resumes at once. No reformatting required.",
  },
  {
    icon: Zap,
    title: "AI-Powered Matching",
    description: "Our AI reads every CV in seconds and ranks them against your job description.",
  },
  {
    icon: BarChart3,
    title: "Scored Results",
    description: "Every candidate gets a match score with detailed strengths and weaknesses.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your files are encrypted and never used to train AI models.",
  },
  {
    icon: Clock,
    title: "Save Hours",
    description: "What takes a recruiter days now takes minutes. Focus on people, not paperwork.",
  },
  {
    icon: Users,
    title: "Team Ready",
    description: "Share results and collaborate with your hiring team in one place.",
  },
];

const steps = [
  { step: "01", title: "Upload CVs", desc: "Drag and drop your PDF resumes — upload as many as you need." },
  { step: "02", title: "Describe the role", desc: "Paste your job description. Plain text is fine." },
  { step: "03", title: "Get ranked results", desc: "Receive scored, ranked candidates with AI explanations instantly." },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#07070f]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_12px_color-mix(in_oklch,var(--primary)_50%,transparent)]">
              <FileText className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">BetterForms</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            {[["#features","Features"],["#how-it-works","How it works"]].map(([href, label]) => (
              <a key={href} href={href} className="text-white/60 transition-colors hover:text-white">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-white/80 hover:text-white hover:bg-white/10")}>
              Sign in
            </Link>
            <Link href="/signup" className={cn(buttonVariants({ size: "sm" }), "btn-glow")}>
              Get started free
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07070f] pt-16">

          {/* Grid overlay */}
          <div className="pointer-events-none absolute inset-0 hero-grid" />

          {/* Glow orbs */}
          <div className="pointer-events-none absolute -top-32 left-1/4 h-[600px] w-[600px] rounded-full bg-primary/20 blur-[120px] animate-float" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-violet-500/15 blur-[100px] animate-float-alt" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-blue-600/10 blur-[80px] animate-glow-pulse" />

          <div className="relative z-10 container mx-auto max-w-5xl px-4 text-center">

            {/* Pill badge */}
            <div className="animate-fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              AI-powered CV screening — free to start
            </div>

            {/* Headline */}
            <h1 className="gradient-text animate-fade-up mx-auto max-w-4xl text-5xl font-extrabold tracking-tight [animation-delay:120ms] md:text-7xl lg:text-8xl">
              Find the best candidates in minutes, not days
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-up mx-auto mt-7 max-w-2xl text-lg text-white/50 [animation-delay:240ms] md:text-xl">
              Upload your CVs and job description. BetterForms instantly ranks every
              candidate with AI-generated match scores and actionable explanations.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-4 [animation-delay:360ms] sm:flex-row">
              <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "gap-2 btn-glow text-base px-8")}>
                Start matching for free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white text-base px-8")}>
                Sign in to dashboard
              </Link>
            </div>

            <p className="animate-fade-up mt-5 text-sm text-white/30 [animation-delay:480ms]">
              No credit card required &middot; Free to start
            </p>

            {/* Stats row */}
            <div className="animate-fade-up mt-16 grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm [animation-delay:600ms]">
              {[
                { value: "10×", label: "Faster screening" },
                { value: "100%", label: "PDF compatible" },
                { value: "Free", label: "No credit card" },
              ].map(({ value, label }) => (
                <div key={label} className="px-6 py-5 text-center">
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="mt-0.5 text-xs text-white/40">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom fade into background */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* ── Features ─────────────────────────────────────────────────────── */}
        <section id="features" className="py-28">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center">
              <span className="inline-block rounded-full border border-primary/30 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
                Features
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                Everything you need to hire smarter
              </h2>
              <p className="mt-4 text-muted-foreground">
                Built for recruiters and hiring managers who value speed and accuracy.
              </p>
            </div>

            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <Card
                  key={feature.title}
                  className="card-glow group border-border/50 bg-card/60 backdrop-blur-sm"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary/20 group-hover:ring-primary/40 group-hover:shadow-[0_0_16px_color-mix(in_oklch,var(--primary)_25%,transparent)]">
                      <feature.icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <h3 className="mb-1.5 font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────────── */}
        <section id="how-it-works" className="relative overflow-hidden py-28">
          {/* Subtle background tint */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

          <div className="container relative mx-auto max-w-6xl px-4">
            <div className="text-center">
              <span className="inline-block rounded-full border border-primary/30 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
                How it works
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                Three steps to better hiring
              </h2>
            </div>

            <div className="mt-16 grid gap-10 md:grid-cols-3">
              {steps.map((item, i) => (
                <div key={item.step} className="group flex flex-col items-center text-center">
                  {/* Glowing step circle */}
                  <div className="relative mb-6 flex h-16 w-16 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl transition-all duration-500 group-hover:bg-primary/40 group-hover:blur-2xl animate-glow-pulse" style={{ animationDelay: `${i * 600}ms` }} />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-xl font-bold text-primary shadow-[0_0_24px_color-mix(in_oklch,var(--primary)_30%,transparent)] transition-all duration-300 group-hover:border-primary/70 group-hover:bg-primary/20 group-hover:shadow-[0_0_40px_color-mix(in_oklch,var(--primary)_50%,transparent)]">
                      {item.step}
                    </div>
                  </div>
                  {/* Connector line between steps */}
                  {i < 2 && (
                    <div className="absolute left-1/2 hidden h-0.5 w-full translate-y-8 bg-gradient-to-r from-primary/40 to-primary/10 md:block" />
                  )}
                  <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[#07070f] py-32">
          {/* Glow orbs */}
          <div className="pointer-events-none absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-primary/25 blur-[100px] animate-float" />
          <div className="pointer-events-none absolute right-1/4 bottom-0 h-[300px] w-[300px] rounded-full bg-violet-500/20 blur-[80px] animate-float-alt" />

          <div className="relative z-10 container mx-auto max-w-3xl px-4 text-center">
            <h2 className="gradient-text text-3xl font-extrabold tracking-tight md:text-5xl">
              Ready to hire smarter?
            </h2>
            <p className="mt-5 text-white/50">
              Join hiring teams already saving hours every week with BetterForms.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "gap-2 btn-glow text-base px-8")}>
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-white/40">
              {["Free to start", "No credit card", "Cancel anytime"].map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 bg-[#07070f] py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground shadow-[0_0_8px_color-mix(in_oklch,var(--primary)_50%,transparent)]">
                <FileText className="h-3 w-3" />
              </div>
              <span className="text-sm font-medium text-white">BetterForms</span>
            </div>
            <p className="text-xs text-white/30">
              &copy; {new Date().getFullYear()} BetterForms. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

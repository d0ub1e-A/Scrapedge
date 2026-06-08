import Navbar from '#/components/navbar'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Globe,
  Zap,
  FileText,
  Search,
  Layers,
  Cpu,
  Users,
  Lightbulb,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-52">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20"
          style={{ background: 'var(--color-brand-primary)' }}
        />
        <div
          className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] rounded-full blur-[120px] opacity-20"
          style={{ background: 'var(--color-brand-primary)' }}
        />
      </div>

      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="flex flex-col items-center"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
          >
            <Zap className="size-4" />
            <span>The Future of Web Intelligence</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/70"
          >
            Turn the Web into <br />
            <span
              className="text-primary brightness-150 tracking-wide"
              style={{ fontFamily: 'SundayShine, sans-serif' }}
            >
              Knowledge
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Scrapedge distills the noise of the internet. Extract clean,
            structured content from any URL or search query and transform it
            into actionable insights with AI.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 mb-20"
          >
            <Link
              to="/signup"
              className="group relative px-8 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
              style={{ background: 'var(--gradient-brand-glow)' }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get Started Free{' '}
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            <Button
              variant="outline"
              className="px-8 py-6 rounded-full border-primary/20 hover:bg-primary/5 transition-all duration-300"
            >
              Watch Demo
            </Button>
          </motion.div>

          {/* Interactive Visual */}
          <motion.div
            variants={fadeInUp}
            className="relative w-full max-w-5xl mx-auto"
          >
            <div className="absolute -inset-1 bg-linear-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-2xl opacity-50" />
            <div className="relative bg-card border border-border rounded-3xl shadow-2xl overflow-hidden p-2 md:p-4">
              <div className="bg-background rounded-2xl border border-border overflow-hidden shadow-inner">
                {/* Browser Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
                  <div className="flex gap-1.5">
                    <div className="size-3 rounded-full bg-destructive/50" />
                    <div className="size-3 rounded-full bg-yellow-500/50" />
                    <div className="size-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="mx-auto flex-1 max-w-md h-6 rounded-md bg-background border border-border px-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Globe className="size-3" />
                    <span>scrapedge.ai/extract?url=https://...</span>
                  </div>
                </div>

                {/* Mock Interaction Area */}
                <div className="p-6 md:p-12 min-h-[400px] flex flex-col items-center justify-center text-center">
                  <MockWorkflow />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function MockWorkflow() {
  return (
    <div className="w-full max-w-2xl space-y-8">
      <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-md h-12 rounded-xl border border-border bg-muted/20 flex items-center px-4 gap-3 animate-pulse">
          <Search className="size-4 text-muted-foreground" />
          <div className="h-3 w-full bg-muted rounded-full" />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground animate-bounce">
          <Zap className="size-4 text-primary" />
          <span>Scraping clean content...</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-primary/10 bg-primary/5 text-left animate-in fade-in slide-in-from-left duration-700">
          <div className="flex items-center gap-2 mb-2 text-primary font-medium text-sm">
            <FileText className="size-4" />
            <span>Raw Content Extracted</span>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-full bg-primary/10 rounded-full" />
            <div className="h-2 w-5/6 bg-primary/10 rounded-full" />
            <div className="h-2 w-4/6 bg-primary/10 rounded-full" />
          </div>
        </div>
        <div className="p-4 rounded-xl border border-primary/30 bg-primary/10 text-left animate-in fade-in slide-in-from-right duration-1000">
          <div className="flex items-center gap-2 mb-2 text-primary font-bold text-sm">
            <Cpu className="size-4" />
            <span>AI Summary Generated</span>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-full bg-primary/30 rounded-full" />
            <div className="h-2 w-full bg-primary/30 rounded-full" />
            <div className="h-2 w-3/4 bg-primary/30 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

function FlowSection() {
  const steps = [
    {
      icon: Globe,
      title: 'Input Sources',
      desc: 'Paste a single URL, multiple links, or a search query.',
    },
    {
      icon: Zap,
      title: 'Firecrawl Engine',
      desc: 'Our high-performance engine strips the noise, leaving only pure content.',
    },
    {
      icon: Lightbulb,
      title: 'AI Distillation',
      desc: 'Turn massive amounts of data into a concise, structured summary.',
    },
  ]

  return (
    <section className="py-24 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            From Chaos to Clarity
          </h2>
          <p className="text-muted-foreground text-lg">
            The most efficient pipeline for web-to-knowledge transformation.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="relative p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <step.icon className="size-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
              {i < 2 && (
                <div className="hidden md:block absolute -right-9 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="size-6 text-muted-foreground/30" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BentoFeatures() {
  const features = [
    {
      title: 'Bulk Extraction',
      desc: "Don't waste time with one-by-one. Process hundreds of URLs in a single batch.",
      icon: Layers,
      color: 'var(--color-tint-sky)',
      className: 'md:col-span-2',
    },
    {
      title: 'AI Summaries',
      desc: 'Get the gist in seconds. Powered by state-of-the-art LLMs.',
      icon: Cpu,
      color: 'var(--color-tint-lavender)',
    },
    {
      title: 'Intent-Based Search',
      desc: 'Find exactly what you need without browsing pages of results.',
      icon: Search,
      color: 'var(--color-tint-mint)',
    },
    {
      title: 'Structured Output',
      desc: 'Clean data ready for your database or documentation.',
      icon: FileText,
      color: 'var(--color-tint-peach)',
      className: 'md:col-span-2',
    },
  ]

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Powerfully Simple
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to master web data.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className={`p-8 rounded-3xl border border-border flex flex-col justify-between ${f.className || ''}`}
              style={{ backgroundColor: f.color }}
            >
              <div>
                <div className="size-10 rounded-lg bg-background/50 text-foreground flex items-center justify-center mb-6 shadow-sm">
                  <f.icon className="size-5" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {f.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function UseCases() {
  const cases = [
    {
      role: 'Researchers',
      desc: 'Quickly map out entire domains and synthesize multiple papers into a single summary.',
      icon: Search,
    },
    {
      role: 'Content Creators',
      desc: 'Turn long-form articles into bite-sized social media posts or newsletters in seconds.',
      icon: Lightbulb,
    },
    {
      role: 'Market Analysts',
      desc: 'Monitor competitors and industry trends by distilling their latest updates automatically.',
      icon: Users,
    },
  ]

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Built for the Curious
          </h2>
          <p className="text-muted-foreground text-lg">
            Empowering different workflows with one powerful tool.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((c, i) => (
            <div
              key={i}
              className="group p-8 rounded-3xl border border-border bg-card hover:bg-primary/5 transition-all duration-300"
            >
              <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                <c.icon className="size-6 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-3">{c.role}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {c.desc}
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-primary cursor-pointer group-hover:gap-3 transition-all">
                Learn more <ArrowRight className="size-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div
          className="relative overflow-hidden rounded-[3rem] p-12 md:p-24 text-center text-white shadow-2xl"
          style={{ background: 'var(--gradient-brand-glow)' }}
        >
          {/* Abstract Shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Ready to edge out the noise?
            </h2>
            <p className="text-white/80 text-lg md:text-xl mb-10 leading-relaxed">
              Join hundreds of researchers and creators who are turning the web
              into their personal knowledge base.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="px-8 py-4 rounded-full bg-white text-primary font-bold text-lg hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                Get Started Free
              </Link>
              <Button
                variant="ghost"
                className="px-8 py-6 rounded-full text-white hover:bg-white/10 text-lg"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <Navbar />
      <Hero />
      <FlowSection />
      <BentoFeatures />
      <UseCases />
      <FinalCTA />
      <footer className="py-12 border-t border-border text-center text-muted-foreground text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src="/favicon.ico" alt="Scrapedge Logo" className="size-5" />
          <span
            className="font-medium"
            style={{ fontFamily: 'SundayShine, sans-serif' }}
          >
            Scrapedge
          </span>
        </div>
        <p>
          © {new Date().getFullYear()} Scrapedge. Built for the future of
          knowledge.
        </p>
      </footer>
    </div>
  )
}

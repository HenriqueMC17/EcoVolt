import { Navbar } from "@/widgets/Layout/Navbar";
import { Footer } from "@/widgets/Layout/Footer";
import dynamic from "next/dynamic";

// Critical Above-the-fold features
import { Hero } from "@/features/hero/Hero";

// Lazy-loaded features for performance (Core Web Vitals)
const LoadingPlaceholder = () => <div className="w-full h-screen bg-slate-950/20 animate-pulse border-y border-white/5" />;

const Problem = dynamic(() => import("@/features/discovery/Problem").then(mod => mod.Problem), { loading: LoadingPlaceholder });
const Benefits = dynamic(() => import("@/features/discovery/Benefits").then(mod => mod.Benefits), { loading: LoadingPlaceholder });
const PlatformShowcase = dynamic(() => import("@/features/discovery/PlatformShowcase").then(mod => mod.PlatformShowcase), { loading: LoadingPlaceholder });
const Comparison = dynamic(() => import("@/features/discovery/Comparison").then(mod => mod.Comparison), { loading: LoadingPlaceholder });
const HowItWorks = dynamic(() => import("@/features/discovery/HowItWorks").then(mod => mod.HowItWorks), { loading: LoadingPlaceholder });
const ValueProposition = dynamic(() => import("@/features/discovery/ValueProposition").then(mod => mod.ValueProposition), { loading: LoadingPlaceholder });
const Differentials = dynamic(() => import("@/features/discovery/Differentials").then(mod => mod.Differentials), { loading: LoadingPlaceholder });
const Credibility = dynamic(() => import("@/features/discovery/Credibility").then(mod => mod.Credibility), { loading: LoadingPlaceholder });
const Pricing = dynamic(() => import("@/features/discovery/Pricing").then(mod => mod.Pricing), { loading: LoadingPlaceholder });
const PersonaSection = dynamic(() => import("@/features/conversion/Persona").then(mod => mod.PersonaSection), { loading: LoadingPlaceholder });
const MultiAudience = dynamic(() => import("@/features/conversion/MultiAudience").then(mod => mod.MultiAudience), { loading: LoadingPlaceholder });
const FAQ = dynamic(() => import("@/features/support/FAQ").then(mod => mod.FAQ), { loading: LoadingPlaceholder });
const ContactForm = dynamic(() => import("@/features/conversion/ContactForm").then(mod => mod.ContactForm), { loading: LoadingPlaceholder });

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Problem />
      <Benefits />
      <PlatformShowcase />
      <Comparison />
      <HowItWorks />
      <ValueProposition />
      <Differentials />
      <Credibility />
      <Pricing />
      <PersonaSection />
      <MultiAudience />
      <FAQ />
      <ContactForm />
      <Footer />
    </main>
  );
}

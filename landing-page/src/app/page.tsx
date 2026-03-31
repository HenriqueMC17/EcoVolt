import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import dynamic from "next/dynamic";

// Critical Above-the-fold features
import { Hero } from "@/features/hero/Hero";

// Lazy-loaded features for performance (Core Web Vitals)
const Problem = dynamic(() => import("@/features/discovery/Problem").then(mod => mod.Problem));
const Benefits = dynamic(() => import("@/features/discovery/Benefits").then(mod => mod.Benefits));
const PlatformShowcase = dynamic(() => import("@/features/discovery/PlatformShowcase").then(mod => mod.PlatformShowcase));
const Comparison = dynamic(() => import("@/features/discovery/Comparison").then(mod => mod.Comparison));
const HowItWorks = dynamic(() => import("@/features/discovery/HowItWorks").then(mod => mod.HowItWorks));
const ValueProposition = dynamic(() => import("@/features/discovery/ValueProposition").then(mod => mod.ValueProposition));
const Differentials = dynamic(() => import("@/features/discovery/Differentials").then(mod => mod.Differentials));
const Credibility = dynamic(() => import("@/features/discovery/Credibility").then(mod => mod.Credibility));
const Pricing = dynamic(() => import("@/features/discovery/Pricing").then(mod => mod.Pricing));
const PersonaSection = dynamic(() => import("@/features/conversion/Persona").then(mod => mod.PersonaSection));
const MultiAudience = dynamic(() => import("@/features/conversion/MultiAudience").then(mod => mod.MultiAudience));
const FAQ = dynamic(() => import("@/features/support/FAQ").then(mod => mod.FAQ));
const ContactForm = dynamic(() => import("@/features/conversion/ContactForm").then(mod => mod.ContactForm));

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

import dynamic from "next/dynamic";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Footer } from "@/components/landing/footer";

const WhyUs = dynamic(() => import("@/components/landing/why-us").then(m => m.WhyUs));
const About = dynamic(() => import("@/components/landing/about").then(m => m.About));
const ProductPreview = dynamic(() => import("@/components/landing/product-preview").then(m => m.ProductPreview));
const HowItWorks = dynamic(() => import("@/components/landing/how-it-works").then(m => m.HowItWorks));
const Features = dynamic(() => import("@/components/landing/features").then(m => m.Features));
const Pricing = dynamic(() => import("@/components/landing/pricing").then(m => m.Pricing));
const Trust = dynamic(() => import("@/components/landing/trust").then(m => m.Trust));
const FAQ = dynamic(() => import("@/components/landing/faq").then(m => m.FAQ));
const Contact = dynamic(() => import("@/components/landing/contact").then(m => m.Contact));

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)] selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <WhyUs />
        <About />
        <ProductPreview />
        <HowItWorks />
        <Features />
        <Pricing />
        <Trust />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

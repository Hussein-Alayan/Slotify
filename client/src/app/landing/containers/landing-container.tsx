import { LandingHeader } from "../components/landing-header"
import { HeroSection } from "../components/hero-section"
import { FeaturesSection } from "../components/features-section"
import { CTASection } from "../components/cta-section"
import { Footer } from "../components/footer"

export function LandingContainer() {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  )
}

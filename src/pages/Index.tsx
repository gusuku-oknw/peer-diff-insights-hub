
import Navigation from "@/components/common/Navigation";
import HeroSection from "@/components/common/HeroSection";
import FeaturesSection from "@/components/common/FeaturesSection";
import PricingSection from "@/components/common/PricingSection";
import Footer from "@/components/common/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Index;

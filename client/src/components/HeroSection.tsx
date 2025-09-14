import { ArrowRight, Droplets, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface HeroSectionProps {
  onSelectPath: (path: 'rainwater' | 'recharge') => void;
}

export default function HeroSection({ onSelectPath }: HeroSectionProps) {
  const handlePathSelect = (path: 'rainwater' | 'recharge') => {
    console.log(`Selected path: ${path}`);
    onSelectPath(path);
  };

  return (
    <section className="relative">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-chart-1/5 to-chart-2/10 -z-10" />
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-6xl font-semibold mb-6 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Rainwater Harvesting &amp; Artificial Recharge Assistant
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Calculate your rainwater harvesting potential, design storage systems, and get cost estimates with our comprehensive assistant.
          </p>
        </div>

        {/* Path Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-8 hover-elevate cursor-pointer group transition-all duration-300" onClick={() => handlePathSelect('rainwater')} data-testid="card-rainwater">
            <div className="text-center">
              <div className="w-16 h-16 bg-chart-1 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Droplets className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Rainwater Harvesting</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Calculate rainwater collection potential, storage tank sizing, and cost analysis for your rooftop area.
              </p>
              <Button className="w-full group-hover:bg-chart-1" size="lg" data-testid="button-rainwater">
                Start Rainwater Analysis
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>

          <Card className="p-8 hover-elevate cursor-pointer group transition-all duration-300" onClick={() => handlePathSelect('recharge')} data-testid="card-recharge">
            <div className="text-center">
              <div className="w-16 h-16 bg-chart-2 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Artificial Recharge</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Design groundwater recharge systems with pit dimensions, infiltration rates, and feasibility analysis.
              </p>
              <Button className="w-full group-hover:bg-chart-2" size="lg" data-testid="button-recharge">
                Start Recharge Analysis
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-12 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-4">Calculations based on CGWB guidelines and Indian rainfall data</p>
          <div className="flex justify-center items-center gap-8 text-xs text-muted-foreground">
            <span>✓ Government compliant</span>
            <span>✓ Scientific methodology</span>
            <span>✓ Location-specific data</span>
          </div>
        </div>
      </div>
    </section>
  );
}
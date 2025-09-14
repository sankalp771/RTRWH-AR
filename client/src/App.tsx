import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import Header from "@/components/Header";
import LandingPage from "@/components/LandingPage";
import UserInputForm from "@/components/UserInputForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import jsPDF from 'jspdf';

type AppState = 'landing' | 'form' | 'results';
type CalculationType = 'rainwater' | 'recharge' | null;

function App() {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [calculationType, setCalculationType] = useState<CalculationType>(null);
  const [formData, setFormData] = useState<any>(null);
  const [calculationResults, setCalculationResults] = useState<any>(null);

  const handleSelectPath = (path: 'rainwater' | 'recharge') => {
    console.log(`Selected calculation type: ${path}`);
    setCalculationType(path);
    setCurrentState('form');
  };

  const handleFormSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
    setFormData(data);
    
    // TODO: replace with actual backend calculation call
    // Generate mock results based on form data
    const mockResults = generateMockResults(data, calculationType!);
    setCalculationResults(mockResults);
    setCurrentState('results');
  };

  const handleBackToLanding = () => {
    console.log('Navigating back to landing');
    setCurrentState('landing');
    setCalculationType(null);
    setFormData(null);
    setCalculationResults(null);
  };

  const handleBackToForm = () => {
    console.log('Navigating back to form');
    setCurrentState('form');
    setCalculationResults(null);
  };

  const handleDownloadPDF = () => {
    console.log('Generating PDF report...');
    // TODO: integrate with proper PDF generation using real data
    generatePDFReport(formData, calculationResults, calculationType!);
  };

  // TODO: remove mock functionality - replace with actual backend integration
  const generateMockResults = (data: any, type: 'rainwater' | 'recharge') => {
    const runoffCoefficients = {
      'RCC': 0.85,
      'GI': 0.90,
      'Asbestos': 0.80,
      'Tiles': 0.75
    };
    
    // Mock rainfall data (mm per month) - Chennai example
    const monthlyRainfall = [24, 8, 15, 28, 42, 85, 120, 115, 68, 32, 18, 14];
    const annualRainfall = monthlyRainfall.reduce((sum, month) => sum + month, 0);
    
    const runoffCoeff = runoffCoefficients[data.roofType as keyof typeof runoffCoefficients] || 0.8;
    const rainwaterPotential = Math.round(data.roofArea * annualRainfall * runoffCoeff);
    const monthlyPotential = monthlyRainfall.map(rain => Math.round(data.roofArea * rain * runoffCoeff));
    
    const householdDemand = data.dwellers * 135 * 365; // 135L per person per day
    const coveragePercentage = Math.min(100, Math.round((rainwaterPotential / householdDemand) * 100));
    
    const tankCapacity = Math.round(rainwaterPotential * 0.2); // 20% of annual potential
    const tankVolume = tankCapacity / 1000; // cubic meters
    const tankDiameter = Math.sqrt((tankVolume * 4) / (Math.PI * 2)); // assuming 2m height
    
    const baseCost = data.roofArea * 300; // ₹300 per sq meter base cost
    const budgetMultiplier = data.budget === 'Low' ? 0.7 : data.budget === 'High' ? 1.5 : 1.0;
    
    const systemCost = {
      low: Math.round(baseCost * 0.7),
      medium: Math.round(baseCost * budgetMultiplier),
      high: Math.round(baseCost * 1.5)
    };
    
    const annualSavings = Math.round(rainwaterPotential * 0.04); // ₹0.04 per liter saved
    const paybackPeriod = Math.round(systemCost.medium / annualSavings);
    
    let feasibilityScore = 70;
    if (data.roofType === 'RCC' || data.roofType === 'GI') feasibilityScore += 10;
    if (data.soilType === 'Sandy') feasibilityScore += 15;
    else if (data.soilType === 'Loamy') feasibilityScore += 10;
    if (data.groundwaterDepth > 3 && data.groundwaterDepth < 20) feasibilityScore += 10;
    if (annualRainfall > 600) feasibilityScore += 15;
    
    const feasibilityLevel = feasibilityScore >= 80 ? 'High' : feasibilityScore >= 60 ? 'Medium' : 'Low';
    
    const recommendations = [
      'Install first flush diverter to improve water quality',
      `Use ${data.roofType} roof runoff coefficient of ${runoffCoeff} for calculations`,
      data.purpose === 'Domestic' ? 'Consider UV sterilization for drinking water use' : 'Regular filtration recommended',
      data.hasOpenSpace ? 'Install overflow system connected to recharge pit' : 'Consider connecting overflow to stormwater system'
    ];
    
    const warnings = [];
    if (data.birdNesting) warnings.push('Bird nesting area detected - regular cleaning required');
    if (annualRainfall < 400) warnings.push('Low rainfall area - consider supplementary water sources');
    if (monthlyRainfall.slice(5, 9).reduce((sum, month) => sum + month, 0) / annualRainfall > 0.7) {
      warnings.push('Monsoon dependency - 70% collection in 4 months');
    }
    
    const results = {
      rainwaterPotential,
      monthlyPotential,
      householdDemand,
      coveragePercentage,
      firstFlush: Math.round(data.roofArea * 2), // 2mm first flush
      tankCapacity,
      tankDimensions: {
        diameter: Number(tankDiameter.toFixed(1)),
        height: 2.0
      },
      systemCost,
      annualSavings,
      paybackPeriod,
      feasibilityScore,
      feasibilityLevel,
      recommendations,
      warnings
    };
    
    if (type === 'recharge') {
      const infiltrationRates = { 'Sandy': 100, 'Loamy': 25, 'Clayey': 5 }; // mm/hr
      const infiltrationRate = infiltrationRates[data.soilType as keyof typeof infiltrationRates];
      const rechargeVolume = Math.round((rainwaterPotential / 1000) * 0.8); // 80% infiltration efficiency
      
      const pitArea = Math.max(9, rechargeVolume / 2); // minimum 3x3m pit
      const pitLength = Math.ceil(Math.sqrt(pitArea));
      
      (results as any).rechargeVolume = rechargeVolume;
      (results as any).pitDimensions = {
        length: pitLength,
        width: pitLength,
        depth: Math.max(2, Math.min(4, data.groundwaterDepth * 0.3)) // 30% of groundwater depth, max 4m
      };
    }
    
    return results;
  };

  // TODO: integrate with proper PDF library and real data
  const generatePDFReport = (userData: any, results: any, type: string) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('RTRWH/AR Analysis Report', 20, 30);
    
    doc.setFontSize(12);
    doc.text(`${type === 'rainwater' ? 'Rainwater Harvesting' : 'Artificial Recharge'} Analysis`, 20, 45);
    doc.text(`Generated for: ${userData?.name}`, 20, 55);
    doc.text(`Location: ${userData?.location}`, 20, 65);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 20, 75);
    
    // Key Results
    doc.setFontSize(16);
    doc.text('Key Results:', 20, 95);
    
    doc.setFontSize(10);
    const resultText = [
      `Annual Rainwater Potential: ${results?.rainwaterPotential?.toLocaleString('en-IN')} L`,
      `Household Demand: ${results?.householdDemand?.toLocaleString('en-IN')} L`,
      `Coverage: ${results?.coveragePercentage}%`,
      `Recommended Tank Capacity: ${results?.tankCapacity?.toLocaleString('en-IN')} L`,
      `System Cost (Medium): ₹${results?.systemCost?.medium?.toLocaleString('en-IN')}`,
      `Annual Savings: ₹${results?.annualSavings?.toLocaleString('en-IN')}`,
      `Payback Period: ${results?.paybackPeriod} years`,
      `Feasibility: ${results?.feasibilityLevel} (${results?.feasibilityScore}/100)`
    ];
    
    resultText.forEach((text, index) => {
      doc.text(text, 20, 110 + (index * 10));
    });
    
    // Recommendations
    doc.setFontSize(16);
    doc.text('Recommendations:', 20, 200);
    
    doc.setFontSize(10);
    results?.recommendations?.forEach((rec: string, index: number) => {
      const wrappedText = doc.splitTextToSize(`• ${rec}`, 170);
      doc.text(wrappedText, 20, 215 + (index * 15));
    });
    
    // Save the PDF
    doc.save(`${type}-analysis-report-${userData?.name?.replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Header />
          
          <main>
            {currentState === 'landing' && (
              <LandingPage onSelectPath={handleSelectPath} />
            )}
            
            {currentState === 'form' && calculationType && (
              <UserInputForm
                type={calculationType}
                onSubmit={handleFormSubmit}
                onBack={handleBackToLanding}
              />
            )}
            
            {currentState === 'results' && calculationType && calculationResults && formData && (
              <ResultsDisplay
                type={calculationType}
                results={calculationResults}
                userInputs={formData}
                onBack={handleBackToForm}
                onDownloadPDF={handleDownloadPDF}
              />
            )}
          </main>
          
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

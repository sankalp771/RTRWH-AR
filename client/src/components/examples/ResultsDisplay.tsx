import ResultsDisplay from '../ResultsDisplay';

export default function ResultsDisplayExample() {
  // TODO: remove mock data when integrating with real calculations
  const mockResults = {
    rainwaterPotential: 45000,
    monthlyPotential: [1200, 800, 1500, 2800, 4200, 8500, 12000, 11500, 6800, 3200, 1800, 1400],
    householdDemand: 54750,
    coveragePercentage: 82,
    firstFlush: 200,
    tankCapacity: 10000,
    tankDimensions: { diameter: 2.5, height: 2.0 },
    rechargeVolume: 35,
    pitDimensions: { length: 3, width: 3, depth: 2 },
    systemCost: {
      low: 45000,
      medium: 75000,
      high: 120000
    },
    annualSavings: 18000,
    paybackPeriod: 4,
    feasibilityScore: 87,
    feasibilityLevel: 'High' as const,
    recommendations: [
      'Install first flush diverter to improve water quality',
      'Use RCC roof runoff coefficient of 0.85 for calculations',
      'Consider UV sterilization for drinking water use',
      'Install overflow system connected to recharge pit'
    ],
    warnings: [
      'Bird nesting area detected - regular cleaning required',
      'Monsoon dependency - 80% collection in 4 months'
    ]
  };

  const mockUserInputs = {
    name: 'Rajesh Kumar',
    location: 'Chennai, Tamil Nadu',
    dwellers: 4,
    roofArea: 150,
    soilType: 'Loamy'
  };

  return (
    <ResultsDisplay
      type="rainwater"
      results={mockResults}
      userInputs={mockUserInputs}
      onBack={() => console.log('Back clicked')}
      onDownloadPDF={() => console.log('Download PDF clicked')}
    />
  );
}
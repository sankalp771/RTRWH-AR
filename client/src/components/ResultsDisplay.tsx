import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Droplets, 
  Home, 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Download,
  ArrowLeft
} from "lucide-react";

interface CalculationResults {
  // Rainwater Harvesting Calculations
  rainwaterPotential: number; // liters per year
  monthlyPotential: number[]; // 12 months
  householdDemand: number; // liters per year
  coveragePercentage: number; // %
  firstFlush: number; // liters
  
  // Storage & System
  tankCapacity: number; // liters
  tankDimensions: {
    diameter: number; // meters
    height: number; // meters
  };
  
  // Recharge Calculations
  rechargeVolume?: number; // cubic meters per year
  pitDimensions?: {
    length: number;
    width: number;
    depth: number;
  };
  
  // Cost Analysis
  systemCost: {
    low: number;
    medium: number;
    high: number;
  };
  annualSavings: number; // rupees
  paybackPeriod: number; // years
  
  // Feasibility
  feasibilityScore: number; // 0-100
  feasibilityLevel: 'High' | 'Medium' | 'Low';
  recommendations: string[];
  warnings: string[];
}

interface ResultsDisplayProps {
  type: 'rainwater' | 'recharge';
  results: CalculationResults;
  userInputs: any;
  onBack: () => void;
  onDownloadPDF: () => void;
}

export default function ResultsDisplay({ type, results, userInputs, onBack, onDownloadPDF }: ResultsDisplayProps) {
  const getFeasibilityColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getFeasibilityTextColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-green-600 dark:text-green-400';
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'Low': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={onBack} className="mb-4" data-testid="button-back">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Form
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-2">
              {type === 'rainwater' ? 'Rainwater Harvesting' : 'Artificial Recharge'} Analysis Results
            </h1>
            <p className="text-muted-foreground">
              Analysis for {userInputs?.location} - {userInputs?.name}
            </p>
          </div>
          <Button onClick={onDownloadPDF} size="lg" data-testid="button-download-pdf">
            <Download className="w-4 h-4 mr-2" />
            Download PDF Report
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Results Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Key Calculations
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {type === 'rainwater' ? (
                <>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Annual Rainwater Potential</p>
                    <p className="text-2xl font-semibold text-chart-1" data-testid="text-rainwater-potential">
                      {results.rainwaterPotential.toLocaleString('en-IN')} L
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(results.rainwaterPotential / 1000).toFixed(1)} cubic meters per year
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Household Demand</p>
                    <p className="text-2xl font-semibold" data-testid="text-household-demand">
                      {results.householdDemand.toLocaleString('en-IN')} L
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Based on {userInputs?.dwellers} dwellers
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Coverage Percentage</p>
                    <div className="space-y-2">
                      <p className="text-2xl font-semibold text-chart-2" data-testid="text-coverage-percentage">
                        {results.coveragePercentage}%
                      </p>
                      <Progress value={results.coveragePercentage} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Recommended Tank Capacity</p>
                    <p className="text-2xl font-semibold" data-testid="text-tank-capacity">
                      {results.tankCapacity.toLocaleString('en-IN')} L
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {results.tankDimensions.diameter}m × {results.tankDimensions.height}m tank
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Annual Recharge Volume</p>
                    <p className="text-2xl font-semibold text-chart-1" data-testid="text-recharge-volume">
                      {results.rechargeVolume?.toLocaleString('en-IN')} m³
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Per year groundwater recharge
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Recharge Pit Dimensions</p>
                    <p className="text-lg font-semibold" data-testid="text-pit-dimensions">
                      {results.pitDimensions?.length}×{results.pitDimensions?.width}×{results.pitDimensions?.depth}m
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Length × Width × Depth
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Rainwater Collection</p>
                    <p className="text-2xl font-semibold text-chart-2" data-testid="text-collection-potential">
                      {results.rainwaterPotential.toLocaleString('en-IN')} L
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Annual collection from {userInputs?.roofArea}m² roof
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Infiltration Rate</p>
                    <p className="text-lg font-semibold" data-testid="text-infiltration-rate">
                      {userInputs?.soilType === 'Sandy' ? 'High' : userInputs?.soilType === 'Loamy' ? 'Medium' : 'Low'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {userInputs?.soilType} soil infiltration
                    </p>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Cost Analysis */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Cost Analysis & Returns
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Low Budget</p>
                <p className="text-xl font-semibold text-green-600" data-testid="text-cost-low">
                  ₹{results.systemCost.low.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-muted-foreground">Basic system</p>
              </div>
              <div className="text-center p-4 border rounded-lg bg-primary/5">
                <p className="text-sm text-muted-foreground mb-1">Medium Budget</p>
                <p className="text-xl font-semibold text-primary" data-testid="text-cost-medium">
                  ₹{results.systemCost.medium.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-muted-foreground">Recommended</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">High Budget</p>
                <p className="text-xl font-semibold text-chart-3" data-testid="text-cost-high">
                  ₹{results.systemCost.high.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-muted-foreground">Premium system</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Annual Water Bill Savings</p>
                <p className="text-2xl font-semibold text-green-600" data-testid="text-annual-savings">
                  ₹{results.annualSavings.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-muted-foreground">
                  Based on municipal water rates
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Payback Period</p>
                <p className="text-2xl font-semibold" data-testid="text-payback-period">
                  {results.paybackPeriod} years
                </p>
                <p className="text-xs text-muted-foreground">
                  Time to recover investment
                </p>
              </div>
            </div>
          </Card>

          {/* Monthly Breakdown */}
          {type === 'rainwater' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-primary" />
                Monthly Rainwater Collection
              </h2>
              
              <div className="grid grid-cols-12 gap-2">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                  <div key={month} className="text-center">
                    <div 
                      className="bg-chart-1 rounded mb-2" 
                      style={{ 
                        height: `${Math.max(20, (results.monthlyPotential[index] / Math.max(...results.monthlyPotential)) * 60)}px` 
                      }}
                      data-testid={`bar-month-${index}`}
                    />
                    <p className="text-xs font-medium">{month}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(results.monthlyPotential[index] / 1000)}K
                    </p>
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Monthly collection in thousands of liters (monsoon season shows peak collection)
              </p>
            </Card>
          )}
        </div>

        {/* Sidebar - Feasibility & Recommendations */}
        <div className="space-y-6">
          {/* Feasibility Score */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Feasibility Analysis
            </h3>
            
            <div className="text-center mb-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 ${getFeasibilityColor(results.feasibilityLevel)}`}>
                <span className="text-2xl font-bold text-white" data-testid="text-feasibility-score">
                  {results.feasibilityScore}
                </span>
              </div>
              <Badge variant="secondary" className={getFeasibilityTextColor(results.feasibilityLevel)}>
                {results.feasibilityLevel} Feasibility
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Roof suitability</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Soil conditions</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Groundwater depth</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Cost effectiveness</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-primary" />
              Recommendations
            </h3>
            
            <div className="space-y-3">
              {results.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span data-testid={`text-recommendation-${index}`}>{rec}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Warnings */}
          {results.warnings.length > 0 && (
            <Card className="p-6 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <AlertTriangle className="w-5 h-5" />
                Important Considerations
              </h3>
              
              <div className="space-y-3">
                {results.warnings.map((warning, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span data-testid={`text-warning-${index}`}>{warning}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
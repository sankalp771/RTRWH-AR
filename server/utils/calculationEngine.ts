import { UserInput, CalculationResults, CityData, Coefficients } from '@shared/schema';
import citiesData from '../data/cities.json';
import coefficientsData from '../data/coefficients.json';
import fs from 'fs';
import path from 'path';

// Load static data
const cities: CityData[] = citiesData as CityData[];
const coefficients: Coefficients = coefficientsData as Coefficients;

/**
 * Scientific Rainwater Harvesting Calculation Engine
 * Based on CGWB (Central Ground Water Board) guidelines
 */
export class CalculationEngine {
  /**
   * Find city data by pincode or city name
   */
  private findCityData(location: string, pincode: string): CityData | null {
    // First try to find by pincode (more accurate)
    let cityData = cities.find(city => city.pincode.startsWith(pincode.substring(0, 3)));
    
    // If not found by pincode, try by city name (fuzzy match)
    if (!cityData) {
      const locationLower = location.toLowerCase();
      cityData = cities.find(city => 
        city.city.toLowerCase().includes(locationLower) ||
        locationLower.includes(city.city.toLowerCase()) ||
        city.state.toLowerCase().includes(locationLower)
      );
    }
    
    // Default to Delhi if no match found
    return cityData || cities.find(city => city.city === 'Delhi') || cities[0];
  }

  /**
   * Calculate Rainwater Harvesting Potential
   * Formula: RHP = Rainfall (mm) × Roof Area (m²) × Runoff Coefficient
   */
  private calculateRainwaterPotential(userInput: UserInput, cityData: CityData): {
    annual: number;
    monthly: number[];
  } {
    const runoffCoeff = coefficients.runoffCoefficients[userInput.roofType];
    
    const monthlyPotential = cityData.monthlyRainfall.map(rainfall => 
      Math.round(userInput.roofArea * rainfall * runoffCoeff)
    );
    
    const annualPotential = monthlyPotential.reduce((sum, month) => sum + month, 0);
    
    return {
      annual: annualPotential,
      monthly: monthlyPotential
    };
  }

  /**
   * Calculate Household Water Demand
   * Formula: Demand = Number of people × Daily consumption × 365 days
   */
  private calculateHouseholdDemand(userInput: UserInput): number {
    const dailyConsumption = coefficients.waterRates.domesticConsumption;
    
    // Adjust consumption based on purpose
    let adjustmentFactor = 1.0;
    if (userInput.purpose === 'Irrigation') adjustmentFactor = 1.5;
    if (userInput.purpose === 'Industrial') adjustmentFactor = 2.0;
    
    return Math.round(userInput.dwellers * dailyConsumption * 365 * adjustmentFactor);
  }

  /**
   * Calculate Storage Tank Sizing
   * Based on monsoon collection pattern and household demand
   */
  private calculateStorageTank(rainwaterPotential: number, monthlyPotential: number[], householdDemand: number): {
    capacity: number;
    dimensions: { diameter: number; height: number };
  } {
    // Tank capacity = 30-45 days of household demand OR 20% of annual potential (whichever is smaller)
    const demandBasedCapacity = Math.round((householdDemand / 365) * 35); // 35 days
    const potentialBasedCapacity = Math.round(rainwaterPotential * 0.2); // 20% of annual
    
    const tankCapacity = Math.min(demandBasedCapacity, potentialBasedCapacity, 15000); // Max 15,000L
    
    // Calculate cylindrical tank dimensions (assuming height = 2m)
    const tankHeight = 2.0; // meters
    const tankVolume = tankCapacity / 1000; // cubic meters
    const tankDiameter = Math.sqrt((tankVolume * 4) / (Math.PI * tankHeight));
    
    return {
      capacity: Math.max(tankCapacity, 2000), // Minimum 2000L
      dimensions: {
        diameter: Number(tankDiameter.toFixed(1)),
        height: tankHeight
      }
    };
  }

  /**
   * Calculate Recharge System (for artificial recharge)
   */
  private calculateRechargeSystem(userInput: UserInput, rainwaterPotential: number, cityData: CityData): {
    rechargeVolume: number;
    pitDimensions: { length: number; width: number; depth: number };
  } {
    const infiltrationRate = coefficients.infiltrationRates[userInput.soilType]; // mm/hr
    
    // Recharge volume = 70-90% of rainwater potential (depending on soil type)
    let rechargeFactor = 0.7; // Default for clayey soil
    if (userInput.soilType === 'Sandy') rechargeFactor = 0.9;
    if (userInput.soilType === 'Loamy') rechargeFactor = 0.8;
    
    const rechargeVolume = Math.round((rainwaterPotential / 1000) * rechargeFactor);
    
    // Calculate pit dimensions based on infiltration rate and recharge volume
    // Formula: Required pit area = Daily inflow / (Infiltration rate * Operating hours)
    const dailyInflowRate = rainwaterPotential / 120; // Assuming 120 rainy days per year (L/day)
    const operatingHours = 8; // Hours per day for infiltration
    const infiltrationRateMs = infiltrationRate / 1000; // Convert mm/hr to m/hr
    
    // Calculate minimum pit area based on infiltration capacity
    const minPitArea = Math.max(9, dailyInflowRate / (infiltrationRateMs * operatingHours * 1000)); // m²
    
    // Pit depth based on groundwater depth and soil type
    const maxDepth = Math.min(4, Math.max(2, userInput.groundwaterDepth * 0.3));
    
    // Adjust pit area if storage volume requires more space
    const storageBasedArea = (rechargeVolume * 1.2) / maxDepth; // 20% extra for temporary storage
    const requiredArea = Math.max(minPitArea, storageBasedArea);
    
    const pitSide = Math.ceil(Math.sqrt(requiredArea));
    
    return {
      rechargeVolume,
      pitDimensions: {
        length: Math.max(pitSide, 3), // Minimum 3m
        width: Math.max(pitSide, 3),
        depth: maxDepth
      }
    };
  }

  /**
   * Calculate System Costs
   */
  private calculateCosts(userInput: UserInput, tankCapacity: number, hasRecharge: boolean): {
    systemCost: { low: number; medium: number; high: number };
    annualSavings: number;
    paybackPeriod: number;
  } {
    const baseCost = userInput.roofArea * coefficients.costFactors.baseCostPerSqm;
    const tankCost = tankCapacity * 0.8; // ₹0.8 per liter capacity
    const rechargeCost = hasRecharge ? userInput.roofArea * 150 : 0;
    
    const totalBaseCost = baseCost + tankCost + rechargeCost;
    
    const systemCost = {
      low: Math.round(totalBaseCost * coefficients.costFactors.budgetMultipliers.Low),
      medium: Math.round(totalBaseCost * coefficients.costFactors.budgetMultipliers.Medium),
      high: Math.round(totalBaseCost * coefficients.costFactors.budgetMultipliers.High)
    };
    
    // Calculate savings based on water bill reduction
    const householdDemand = this.calculateHouseholdDemand(userInput);
    const municipalRate = coefficients.waterRates.municipalRate;
    const maxSavableWater = Math.min(householdDemand, tankCapacity * 10); // Assume 10 refills per year
    const annualSavings = Math.round(maxSavableWater * municipalRate);
    
    const paybackPeriod = Math.round(systemCost.medium / Math.max(annualSavings, 1));
    
    return {
      systemCost,
      annualSavings,
      paybackPeriod: Math.min(paybackPeriod, 20) // Cap at 20 years
    };
  }

  /**
   * Calculate Feasibility Score and Generate Recommendations
   */
  private calculateFeasibility(userInput: UserInput, cityData: CityData, rainwaterPotential: number, householdDemand: number): {
    feasibilityScore: number;
    feasibilityLevel: 'High' | 'Medium' | 'Low';
    recommendations: string[];
    warnings: string[];
  } {
    let score = 50; // Base score
    const recommendations: string[] = [];
    const warnings: string[] = [];
    
    // Rainfall adequacy (0-25 points)
    if (cityData.annualRainfall > 1000) {
      score += 25;
      recommendations.push('Excellent rainfall - consider larger storage capacity');
    } else if (cityData.annualRainfall > 600) {
      score += 15;
      recommendations.push('Good rainfall - standard system recommended');
    } else {
      score += 5;
      warnings.push('Low rainfall area - consider supplementary water sources');
    }
    
    // Roof suitability (0-20 points)
    if (userInput.roofType === 'RCC' || userInput.roofType === 'GI') {
      score += 20;
      recommendations.push(`${userInput.roofType} roof is excellent for rainwater harvesting`);
    } else if (userInput.roofType === 'Tiles') {
      score += 15;
      recommendations.push('Clay/concrete tiles are suitable with proper first flush diverter');
    } else {
      score += 10;
      warnings.push('Asbestos roofs require regular cleaning and filtration');
    }
    
    // Soil conditions (0-15 points)
    if (userInput.soilType === 'Sandy') {
      score += 15;
      recommendations.push('Sandy soil is ideal for groundwater recharge');
    } else if (userInput.soilType === 'Loamy') {
      score += 10;
      recommendations.push('Loamy soil provides good infiltration for recharge');
    } else {
      score += 5;
      recommendations.push('Clayey soil requires larger recharge structures');
    }
    
    // Groundwater depth (0-15 points)
    if (userInput.groundwaterDepth > 3 && userInput.groundwaterDepth < 30) {
      score += 15;
      recommendations.push('Optimal groundwater depth for recharge systems');
    } else if (userInput.groundwaterDepth <= 3) {
      score += 5;
      warnings.push('Shallow groundwater - ensure proper drainage to prevent waterlogging');
    } else {
      score += 10;
      warnings.push('Deep groundwater - recharge benefits may take longer to realize');
    }
    
    // Coverage analysis (0-10 points)
    const coverage = (rainwaterPotential / householdDemand) * 100;
    if (coverage > 80) {
      score += 10;
      recommendations.push('Excellent coverage - consider selling excess water or larger recharge');
    } else if (coverage > 50) {
      score += 7;
      recommendations.push('Good coverage - system will significantly reduce water bills');
    } else {
      score += 3;
      recommendations.push('Partial coverage - combine with water conservation measures');
    }
    
    // Environmental factors
    if (userInput.birdNesting) {
      warnings.push('Bird nesting detected - install mesh covers and regular cleaning required');
    }
    
    if (userInput.environment === 'Industrial') {
      warnings.push('Industrial area - test water quality regularly and use appropriate filtration');
    }
    
    // Monsoon dependency check
    const monsoonMonths = cityData.monthlyRainfall.slice(5, 9); // June to September
    const monsoonRainfall = monsoonMonths.reduce((sum, month) => sum + month, 0);
    if (monsoonRainfall / cityData.annualRainfall > 0.7) {
      warnings.push('High monsoon dependency - 70%+ rainfall in 4 months');
    }
    
    // Standard recommendations
    recommendations.push('Install first flush diverter to improve water quality');
    if (userInput.purpose === 'Domestic') {
      recommendations.push('Consider UV/RO purification for drinking water use');
    }
    if (userInput.hasOpenSpace) {
      recommendations.push('Connect overflow to recharge pit for maximum benefit');
    }
    
    const feasibilityLevel = score >= 80 ? 'High' : score >= 60 ? 'Medium' : 'Low';
    
    return {
      feasibilityScore: Math.min(100, score),
      feasibilityLevel,
      recommendations,
      warnings
    };
  }

  /**
   * Main calculation function
   */
  public calculate(userInput: UserInput, calculationType: 'rainwater' | 'recharge'): CalculationResults {
    // Find city data
    const cityData = this.findCityData(userInput.location, userInput.pincode);
    if (!cityData) {
      throw new Error(`City data not found for ${userInput.location}, ${userInput.pincode}`);
    }

    // Core calculations
    const { annual: rainwaterPotential, monthly: monthlyPotential } = this.calculateRainwaterPotential(userInput, cityData);
    const householdDemand = this.calculateHouseholdDemand(userInput);
    const coveragePercentage = Math.min(100, Math.round((rainwaterPotential / householdDemand) * 100));
    const firstFlush = Math.round(userInput.roofArea * 2); // 2mm first flush
    
    // Storage system
    const { capacity: tankCapacity, dimensions: tankDimensions } = this.calculateStorageTank(
      rainwaterPotential, monthlyPotential, householdDemand
    );
    
    // Cost analysis
    const { systemCost, annualSavings, paybackPeriod } = this.calculateCosts(
      userInput, tankCapacity, calculationType === 'recharge'
    );
    
    // Feasibility analysis
    const { feasibilityScore, feasibilityLevel, recommendations, warnings } = this.calculateFeasibility(
      userInput, cityData, rainwaterPotential, householdDemand
    );
    
    // Base results
    const results: CalculationResults = {
      rainwaterPotential,
      monthlyPotential,
      householdDemand,
      coveragePercentage,
      firstFlush,
      tankCapacity,
      tankDimensions,
      systemCost,
      annualSavings,
      paybackPeriod,
      feasibilityScore,
      feasibilityLevel,
      recommendations,
      warnings
    };
    
    // Add recharge calculations if needed
    if (calculationType === 'recharge') {
      const { rechargeVolume, pitDimensions } = this.calculateRechargeSystem(
        userInput, rainwaterPotential, cityData
      );
      results.rechargeVolume = rechargeVolume;
      results.pitDimensions = pitDimensions;
    }
    
    return results;
  }
}

export const calculationEngine = new CalculationEngine();
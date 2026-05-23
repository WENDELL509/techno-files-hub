// @ts-nocheck
/**
 * GEPI Tariff Pricing Engine for Surveying Apps
 */
export {};

// 1. DYNAMIC CONFIGURATION SCHEMA (Matches your Spreadsheet Layout)
const CONFIG = {
  SURVEY_TARIFFS: {
    RELOCATION_SURVEY: {
      tiers: [
        { maxArea: 0.5, baseFee: 25000 },
        { maxArea: 1.0, baseFee: 30000 },
        { maxArea: 2.0, baseFee: 40000 },
        { maxArea: 3.0, baseFee: 50000 },
        { maxArea: 4.0, baseFee: 60000 },
        { maxArea: 5.0, baseFee: 70000 },
        { maxArea: 6.0, baseFee: 80000 },
        { maxArea: 7.0, baseFee: 90000 },
        { maxArea: 8.0, baseFee: 100000 },
        { maxArea: 9.0, baseFee: 110000 },
        { maxArea: 10.0, baseFee: 120000 },
        { maxArea: 20.0, baseFee: 212000 },
        { maxArea: 30.0, baseFee: 282000 },
        { maxArea: 40.0, baseFee: 344500 },
        { maxArea: 50.0, baseFee: 403000 },
        { maxArea: 60.0, baseFee: 466500 },
        { maxArea: 70.0, baseFee: 511500 },
      ],
      excessRatePerHa: 5000,
    },
    ORIGINAL_SURVEY: {
      tiers: [
        { maxArea: 0.5, baseFee: 45000 },
        { maxArea: 1.0, baseFee: 60000 },
        { maxArea: 2.0, baseFee: 80000 },
        { maxArea: 3.0, baseFee: 100000 },
        { maxArea: 4.0, baseFee: 120000 },
        { maxArea: 5.0, baseFee: 140000 },
        { maxArea: 6.0, baseFee: 160000 },
        { maxArea: 7.0, baseFee: 180000 },
        { maxArea: 8.0, baseFee: 200000 },
        { maxArea: 9.0, baseFee: 220000 },
        { maxArea: 10.0, baseFee: 240000 },
        { maxArea: 20.0, baseFee: 424000 },
        { maxArea: 30.0, baseFee: 564000 },
        { maxArea: 40.0, baseFee: 689000 },
        { maxArea: 50.0, baseFee: 806000 },
        { maxArea: 60.0, baseFee: 933000 },
        { maxArea: 70.0, baseFee: 1023000 },
      ],
      excessRatePerHa: 10000,
    },
    VERIFICATION_SURVEY: {
      tiers: [
        { maxArea: 0.5, baseFee: 55000 },
        { maxArea: 1.0, baseFee: 75000 },
        { maxArea: 2.0, baseFee: 100000 },
        { maxArea: 3.0, baseFee: 125000 },
        { maxArea: 4.0, baseFee: 150000 },
        { maxArea: 5.0, baseFee: 175000 },
        { maxArea: 6.0, baseFee: 200000 },
        { maxArea: 7.0, baseFee: 225000 },
        { maxArea: 8.0, baseFee: 250000 },
        { maxArea: 9.0, baseFee: 275000 },
        { maxArea: 10.0, baseFee: 300000 },
        { maxArea: 20.0, baseFee: 530000 },
        { maxArea: 30.0, baseFee: 705000 },
        { maxArea: 40.0, baseFee: 861250 },
        { maxArea: 50.0, baseFee: 1007500 },
        { maxArea: 60.0, baseFee: 1166250 },
        { maxArea: 70.0, baseFee: 1278750 },
      ],
      excessRatePerHa: 8000,
    }
  },
  LAND_USE_FACTORS: {
    RESIDENTIAL: 0.50,
    COMMERCIAL: 1.50,
    INDUSTRIAL: 1.20,
    MIXED_USE: 1.50,
    FORESHORE: 0.50,
    FORESTLAND: 0.50,
    PROTECTED_AREA: 0.50,
    AGRICULTURAL: 0.00,
    INSTITUTIONAL: 0.00
  },
  HOURLY_RATES: {
    PROJECT_DIRECTOR: 1918,
    SENIOR_PM: 1567,
    PARTY_CHIEF: 1144,
    CAD_OPERATOR: 196,
    INSTRUMENT_MAN: 196,
    SURVEY_AIDE: 129,
    FIELD_DRIVER: 101
  }
};

export class SurveyPricingEngine {
  
  /**
   * Calculates the Base Isolation Survey Cost using exact tiered logic limits
   */
  static calculateBaseSurveyFee(type, areaInHectares) {
    const surveyConfig = CONFIG.SURVEY_TARIFFS[type.toUpperCase()];
    if (!surveyConfig) throw new Error(`Invalid Survey Type: ${type}`);

    let baseFee = 0;
    const sortedTiers = [...surveyConfig.tiers].sort((a, b) => a.maxArea - b.maxArea);
    
    // Find matching tier bracket
    const matchedTier = sortedTiers.find(tier => areaInHectares <= tier.maxArea);

    if (matchedTier) {
      baseFee = matchedTier.baseFee;
    } else {
      // Exceeds maximum 70-hectare structured tier ceiling
      const ceilingTier = sortedTiers[sortedTiers.length - 1];
      const excessArea = areaInHectares - ceilingTier.maxArea;
      baseFee = ceilingTier.baseFee + (excessArea * surveyConfig.excessRatePerHa);
    }

    return baseFee;
  }

  /**
   * Calculates specialized topographic contour fees based on cumulative step downs
   */
  static calculateTopographicFee(interval, areaInHectares, slopeDegrees = 0) {
    let rateConfig;
    switch (interval) {
      case 0.5: rateConfig = { first: 50000, tier2: 30000, tier3: 20000, floor: 15000 }; break;
      case 1.0: rateConfig = { first: 45000, tier2: 25000, tier3: 15000, floor: 10000 }; break;
      case 2.0: rateConfig = { first: 40000, tier2: 20000, tier3: 10000, floor: 8000 }; break;
      case 5.0: rateConfig = { first: 35000, tier2: 15000, tier3: 8000, floor: 6000 }; break;
      default: throw new Error("Invalid Contour Density Interval. Use 0.5, 1.0, 2.0, or 5.0");
    }

    let remainingArea = areaInHectares;
    let totalTopoCost = 0;

    // First 1 Hectare flat
    if (remainingArea > 0) {
      const allocation = Math.min(remainingArea, 1);
      totalTopoCost += allocation * rateConfig.first;
      remainingArea -= allocation;
    }
    // Next 2 to 10 Hectares (Scope cap length = 9)
    if (remainingArea > 0) {
      const allocation = Math.min(remainingArea, 9);
      totalTopoCost += allocation * rateConfig.tier2;
      remainingArea -= allocation;
    }
    // Next 11 to 20 Hectares (Scope cap length = 10)
    if (remainingArea > 0) {
      const allocation = Math.min(remainingArea, 10);
      totalTopoCost += allocation * rateConfig.tier3;
      remainingArea -= allocation;
    }
    // Final Excess remaining
    if (remainingArea > 0) {
      totalTopoCost += remainingArea * rateConfig.floor;
    }

    // Complexity Slope Penalty Check
    if (slopeDegrees > 18) {
      totalTopoCost *= 1.50; // Apply 50% penalty multiplier
    }

    return totalTopoCost;
  }

  /**
   * Main Standard Project Quote Engine Builder
   */
  static generateProjectQuote(params) {
    const {
      surveyType,        // 'RELOCATION_SURVEY' | 'ORIGINAL_SURVEY' | 'VERIFICATION_SURVEY'
      areaInHectares,    // float
      landUseType,       // 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' etc.
      topoInterval = null,// Optional contour analysis
      slopeDegrees = 0,
      additionalFixedCosts = 0, // Mobilization, asset collection additions
      disbursements = 0,  // Raw processing fees advanced to DENR/LRA
      isHighRiskZone = false
    } = params;

    // Step 1: Base Calculation & Zoning Shifts
    const baseSurveyFee = this.calculateBaseSurveyFee(surveyType, areaInHectares);
    const zoningModifier = CONFIG.LAND_USE_FACTORS[landUseType.toUpperCase()] || 0.00;
    const adjustedSurveyCost = baseSurveyFee * (1 + zoningModifier);

    // Step 2: Incorporate Optional Topo Runs
    const topographicCost = topoInterval ? this.calculateTopographicFee(topoInterval, areaInHectares, slopeDegrees) : 0;

    // Step 3: Compute Direct Project Operating Costs
    const thirdPartyDisbursementsWithMarkup = disbursements * 1.20; // 20% Administrative operational overhead markup
    const internalProjectCosts = adjustedSurveyCost + topographicCost + additionalFixedCosts;
    
    // Step 4: Establishment Fees Baseline Validation Rule
    const calculatedEstablishmentFee = Math.max(1000, internalProjectCosts * 0.01);
    const totalProjectOperatingCost = internalProjectCosts + calculatedEstablishmentFee + thirdPartyDisbursementsWithMarkup;

    // Step 5: High Risk Conflict Hazard Adjustments
    let hazardPayCost = 0;
    if (isHighRiskZone) {
      hazardPayCost = totalProjectOperatingCost * 0.10; // +10% of Project Cost
    }

    // Step 6: Contract Formulation Blocks (Contingency, Profits, VAT)
    const cumulativeBaseBeforeMargins = totalProjectOperatingCost + hazardPayCost;
    const contingencyBuffer = cumulativeBaseBeforeMargins * 0.05; // 5% buffer
    const flatProfitMargin = cumulativeBaseBeforeMargins * 0.20;  // 20% firm target profit

    let preTaxSubTotal = cumulativeBaseBeforeMargins + contingencyBuffer + flatProfitMargin;

    // Security add-on calculation check against subtotal
    if (isHighRiskZone) {
      const securityPayCost = preTaxSubTotal * 0.10; // +10% of final Contract Target
      preTaxSubTotal += securityPayCost;
    }

    const valueAddedTax = preTaxSubTotal * 0.12; // 12% Government VAT Tax line
    const finalContractPrice = preTaxSubTotal + valueAddedTax;

    return {
      breakdown: {
        baseSurveyFee,
        zoningAdjustment: adjustedSurveyCost - baseSurveyFee,
        adjustedSurveyCost,
        topographicCost,
        establishmentFee: calculatedEstablishmentFee,
        disbursementsOverhead: thirdPartyDisbursementsWithMarkup,
        hazardPay: hazardPayCost,
        contingencyBuffer,
        firmProfit: flatProfitMargin,
        statutoryVat: valueAddedTax
      },
      totalContractPrice: Math.round(finalContractPrice * 100) / 100
    };
  }

  /**
   * Alternative Time & Materials (T&M) Calculation Track
   */
  static calculateTimeAndMaterials(timeLogs) {
    let totalLaborCost = 0;

    timeLogs.forEach(log => {
      const baselineHourlyRate = CONFIG.HOURLY_RATES[log.staffRole.toUpperCase()];
      if (!baselineHourlyRate) throw new Error(`Role mapping missing for: ${log.staffRole}`);

      let runningHourlyRate = baselineHourlyRate;
      
      if (log.isHolidayOrSunday) {
        runningHourlyRate *= 2.00; // Holiday Premium multiplier (+100%)
      } else if (log.isOvertime) {
        runningHourlyRate *= 1.30; // Standard Overtime multiplier (+30%)
      }

      totalLaborCost += runningHourlyRate * log.hoursLogged;
    });

    const profit = totalLaborCost * 0.20;
    const vat = (totalLaborCost + profit) * 1.12;

    return {
      rawLaborCost: totalLaborCost,
      estimatedInvoiceTotal: Math.round((totalLaborCost + profit + vat) * 100) / 100
    };
  }
}


// ======================================
// FRONT-END DISPLAY TEST
// ======================================

function formatPHP(value) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(value || 0);
}

function displayQuote(quote) {

  console.log("\n========== BILLING BREAKDOWN ==========\n");

  console.log("Boundary Survey Fee:",
    formatPHP(quote.breakdown.baseSurveyFee));

  console.log("Zoning Adjustment Modifier:",
    formatPHP(quote.breakdown.zoningAdjustment));

  console.log("Contour Mapping:",
    formatPHP(quote.breakdown.topographicCost));

  console.log("Terrain Complexity Penalty:",
    formatPHP(quote.breakdown.hazardPay));

  console.log("Document Filing Disbursements:",
    formatPHP(quote.breakdown.disbursementsOverhead));

  console.log("System Establishment Fee:",
    formatPHP(quote.breakdown.establishmentFee));

  console.log("Project Contingency Buffer:",
    formatPHP(quote.breakdown.contingencyBuffer));

  console.log("Corporate Profit Margin:",
    formatPHP(quote.breakdown.firmProfit));

  console.log("VAT:",
    formatPHP(quote.breakdown.statutoryVat));

  console.log("\nTOTAL PROJECT COST:",
    formatPHP(quote.totalContractPrice));

  console.log("\n=======================================\n");
}


export { formatPHP };
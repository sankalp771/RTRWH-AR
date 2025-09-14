import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { calculationEngine } from "./utils/calculationEngine";
import { userInputSchema, type UserInput, type CalculationResults } from "@shared/schema";
import jsPDF from 'jspdf';

export async function registerRoutes(app: Express): Promise<Server> {
  // Calculation endpoint
  app.post("/api/calculate", async (req, res) => {
    try {
      const { userInputs, calculationType } = req.body;
      
      // Validate input data
      const validatedInputs = userInputSchema.parse(userInputs);
      
      if (!['rainwater', 'recharge'].includes(calculationType)) {
        return res.status(400).json({ error: 'Invalid calculation type' });
      }
      
      // Perform calculations
      const results = calculationEngine.calculate(validatedInputs, calculationType);
      
      // Save to storage for history (optional)
      const savedSubmission = await storage.saveSubmission(
        validatedInputs, 
        calculationType, 
        results
      );
      
      res.json({
        success: true,
        submissionId: savedSubmission.id,
        results
      });
      
    } catch (error: any) {
      console.error('Calculation error:', error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'Invalid input data',
          details: error.errors
        });
      }
      
      res.status(500).json({
        error: 'Internal server error during calculation',
        message: error.message
      });
    }
  });

  // Get calculation history
  app.get("/api/history", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const submissions = await storage.getRecentSubmissions(limit);
      
      res.json({
        success: true,
        submissions: submissions.map(sub => {
          const userInputs = sub.userInputs as UserInput;
          const results = sub.results as CalculationResults;
          return {
            id: sub.id,
            calculationType: sub.calculationType,
            location: userInputs.location,
            name: userInputs.name,
            createdAt: sub.createdAt,
            feasibilityLevel: results.feasibilityLevel,
            coveragePercentage: results.coveragePercentage
          };
        })
      });
    } catch (error: any) {
      console.error('History retrieval error:', error);
      res.status(500).json({
        error: 'Failed to retrieve calculation history'
      });
    }
  });

  // Get specific submission
  app.get("/api/submission/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const submission = await storage.getSubmission(id);
      
      if (!submission) {
        return res.status(404).json({
          error: 'Submission not found'
        });
      }
      
      res.json({
        success: true,
        submission
      });
    } catch (error: any) {
      console.error('Submission retrieval error:', error);
      res.status(500).json({
        error: 'Failed to retrieve submission'
      });
    }
  });

  // Generate PDF report
  app.post("/api/generate-pdf", async (req, res) => {
    try {
      const { submissionId } = req.body;
      
      const submission = await storage.getSubmission(submissionId);
      if (!submission) {
        return res.status(404).json({
          error: 'Submission not found'
        });
      }
      
      // Type cast the stored data
      const userData = submission.userInputs as UserInput;
      const results = submission.results as CalculationResults;
      const type = submission.calculationType;
      
      // Generate PDF using jsPDF
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.text('RTRWH/AR Analysis Report', 20, 30);
      
      doc.setFontSize(12);
      doc.text(`${type === 'rainwater' ? 'Rainwater Harvesting' : 'Artificial Recharge'} Analysis`, 20, 45);
      doc.text(`Generated for: ${userData.name}`, 20, 55);
      doc.text(`Location: ${userData.location}, ${userData.pincode}`, 20, 65);
      doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 20, 75);
      
      // Key Results
      doc.setFontSize(16);
      doc.text('Key Results:', 20, 95);
      
      doc.setFontSize(10);
      const resultText = [
        `Roof Area: ${userData.roofArea} m² (${userData.roofType})`,
        `Annual Rainwater Potential: ${results.rainwaterPotential.toLocaleString('en-IN')} L`,
        `Household Demand: ${results.householdDemand.toLocaleString('en-IN')} L`,
        `Coverage: ${results.coveragePercentage}%`,
        `Recommended Tank Capacity: ${results.tankCapacity.toLocaleString('en-IN')} L`,
        `Tank Dimensions: ${results.tankDimensions.diameter}m × ${results.tankDimensions.height}m`,
        `System Cost (Medium): ₹${results.systemCost.medium.toLocaleString('en-IN')}`,
        `Annual Savings: ₹${results.annualSavings.toLocaleString('en-IN')}`,
        `Payback Period: ${results.paybackPeriod} years`,
        `Feasibility: ${results.feasibilityLevel} (${results.feasibilityScore}/100)`
      ];
      
      if (type === 'recharge' && results.rechargeVolume && results.pitDimensions) {
        resultText.push(
          `Annual Recharge Volume: ${results.rechargeVolume} m³`,
          `Pit Dimensions: ${results.pitDimensions.length}×${results.pitDimensions.width}×${results.pitDimensions.depth}m`
        );
      }
      
      resultText.forEach((text, index) => {
        doc.text(text, 20, 110 + (index * 10));
      });
      
      // Recommendations
      doc.setFontSize(16);
      doc.text('Recommendations:', 20, 200);
      
      doc.setFontSize(10);
      results.recommendations.forEach((rec: string, index: number) => {
        const wrappedText = doc.splitTextToSize(`• ${rec}`, 170);
        doc.text(wrappedText, 20, 215 + (index * 15));
      });
      
      // Warnings if any
      if (results.warnings.length > 0) {
        doc.addPage();
        doc.setFontSize(16);
        doc.text('Important Considerations:', 20, 30);
        
        doc.setFontSize(10);
        results.warnings.forEach((warning: string, index: number) => {
          const wrappedText = doc.splitTextToSize(`⚠ ${warning}`, 170);
          doc.text(wrappedText, 20, 45 + (index * 15));
        });
      }
      
      // Generate PDF buffer
      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      
      // Set headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition', 
        `attachment; filename="${type}-analysis-report-${userData.name.replace(/\s+/g, '-')}.pdf"`
      );
      res.setHeader('Content-Length', pdfBuffer.length);
      
      res.send(pdfBuffer);
      
    } catch (error: any) {
      console.error('PDF generation error:', error);
      res.status(500).json({
        error: 'Failed to generate PDF report',
        message: error.message
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      service: "RTRWH/AR Calculation API"
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
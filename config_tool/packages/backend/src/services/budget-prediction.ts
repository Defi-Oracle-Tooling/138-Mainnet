import { PythonShell } from 'python-shell';
import { Budget } from '../types';

interface PredictionResult {
  predictedSpend: number;
  confidence: number;
  factors: Array<{
    name: string;
    impact: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }>;
  recommendations: Array<{
    action: string;
    potentialSavings: number;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export class BudgetPredictionService {
  async predictSpending(budgetId: string, timeframe: number): Promise<PredictionResult> {
    try {
      const result = await new Promise((resolve, reject) => {
        PythonShell.run(
          '../ai_engine/predict_spending.py',
          {
            args: [budgetId, timeframe.toString()],
            pythonPath: 'python3'
          },
          (err, results) => {
            if (err) reject(err);
            resolve(JSON.parse(results?.[0] || '{}'));
          }
        );
      });

      return result as PredictionResult;
    } catch (error) {
      console.error('Budget prediction failed:', error);
      throw error;
    }
  }

  async analyzeTrends(budgetId: string): Promise<{
    seasonality: Record<string, number>;
    anomalies: Array<{ date: string; amount: number; reason: string }>;
  }> {
    // Implementation for trend analysis
    return { seasonality: {}, anomalies: [] };
  }
}

import { PythonShell } from 'python-shell';
import { ConfigurationState } from '../types';

interface AIResponse {
  costs: {
    compute: number;
    storage: number;
    network: number;
    total: number;
  };
  risks: {
    score: number;
    items: string[];
  };
  recommendations: Array<{
    type: string;
    suggestion: string;
    impact: string;
  }>;
}

export async function analyzeConfiguration(config: ConfigurationState['config']): Promise<AIResponse> {
  try {
    const result = await new Promise((resolve, reject) => {
      PythonShell.run(
        '../ai_engine/analyze.py',
        {
          args: [JSON.stringify(config)],
          pythonPath: 'python3',
        },
        (err, results) => {
          if (err) reject(err);
          resolve(JSON.parse(results?.[0] || '{}'));
        }
      );
    });

    return result as AIResponse;
  } catch (error) {
    console.error('AI Analysis Error:', error);
    throw new Error('Failed to analyze configuration');
  }
}

export async function validateConfiguration(config: ConfigurationState['config']) {
  try {
    const validation = await new Promise((resolve, reject) => {
      PythonShell.run(
        '../ai_engine/validate.py',
        {
          args: [JSON.stringify(config)],
          pythonPath: 'python3',
        },
        (err, results) => {
          if (err) reject(err);
          resolve(JSON.parse(results?.[0] || '{}'));
        }
      );
    });

    return validation;
  } catch (error) {
    console.error('Validation Error:', error);
    throw new Error('Failed to validate configuration');
  }
}

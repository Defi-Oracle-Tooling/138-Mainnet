import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ConfigurationState } from '../index';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

interface AnalysisResult {
  costs: {
    total: number;
    breakdown: Record<string, number>;
  };
  security: {
    score: number;
    risks: string[];
  };
  recommendations: Array<{
    type: string;
    suggestion: string;
    impact: string;
  }>;
}

export function ConfigurationManager({ config }: { config: ConfigurationState['config'] }) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<string | null>(null);

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:3000');
    
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'DEPLOYMENT_UPDATE') {
        setDeploymentStatus(`Deployment progress: ${Math.round(data.progress)}%`);
      }
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  const analyzeConfiguration = async () => {
    setLoading(true);
    setError(null);
    try {
      const [costResponse, securityResponse] = await Promise.all([
        axios.post('/api/analysis/estimate-costs', config),
        axios.post('/api/analysis/security-audit', config)
      ]);

      setAnalysis({
        costs: costResponse.data,
        security: securityResponse.data,
        recommendations: [
          ...costResponse.data.recommendations,
          ...securityResponse.data.recommendations
        ]
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = async () => {
    try {
      const response = await axios.post('/api/config/deploy', { config });
      if (response.data.success) {
        wsRef.current?.send(JSON.stringify({
          type: 'SUBSCRIBE_DEPLOYMENT',
          deploymentId: response.data.deploymentId
        }));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Button onClick={analyzeConfiguration} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Configuration'}
        </Button>
        <Button onClick={handleDeploy} disabled={loading || !analysis}>
          Deploy Infrastructure
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <span>{error}</span>
        </Alert>
      )}

      {analysis && (
        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="font-semibold">Estimated Costs</h3>
            <p className="text-2xl">${analysis.costs.total}/month</p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="font-semibold">Security Score</h3>
            <p className="text-2xl">{analysis.security.score}/100</p>
          </div>

          {analysis.recommendations.length > 0 && (
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="font-semibold">Recommendations</h3>
              <ul className="list-disc pl-5 mt-2">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm">
                    {rec.suggestion} <span className="text-gray-500">({rec.impact} impact)</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {deploymentStatus && (
        <div className="rounded-lg bg-blue-50 p-4">
          <h3 className="font-semibold">Deployment Status</h3>
          <p>{deploymentStatus}</p>
        </div>
      )}
    </div>
  );
}

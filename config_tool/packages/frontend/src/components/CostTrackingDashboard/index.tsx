import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useWebSocket } from '@/hooks/useWebSocket';

interface CostData {
  timestamp: string;
  costs: {
    compute: number;
    storage: number;
    network: number;
    total: number;
  };
}

export function CostTrackingDashboard({ deploymentId }: { deploymentId: string }) {
  const [costHistory, setCostHistory] = useState<CostData[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const ws = useWebSocket();

  useEffect(() => {
    if (ws) {
      ws.send(JSON.stringify({
        type: 'SUBSCRIBE_COSTS',
        deploymentId
      }));

      ws.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'COST_UPDATE') {
          setCostHistory(prev => [...prev, data]);
          checkCostAlerts(data.costs);
        }
      });
    }
  }, [ws, deploymentId]);

  const checkCostAlerts = (costs: CostData['costs']) => {
    if (costs.total > 1000) {
      setAlerts(prev => [...prev, `High cost alert: $${costs.total.toFixed(2)}`]);
    }
  };

  const chartData = {
    labels: costHistory.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Total Cost ($)',
        data: costHistory.map(d => d.costs.total),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Cost Tracking</h2>
        <div className="h-64">
          <Line data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      </Card>

      <div className="grid grid-cols-4 gap-4">
        {Object.entries(costHistory[costHistory.length - 1]?.costs || {}).map(([key, value]) => (
          <Card key={key} className="p-4">
            <h3 className="font-medium capitalize">{key}</h3>
            <p className="text-2xl">${value.toFixed(2)}</p>
          </Card>
        ))}
      </div>

      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, idx) => (
            <Alert key={idx} variant="warning">
              {alert}
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
}

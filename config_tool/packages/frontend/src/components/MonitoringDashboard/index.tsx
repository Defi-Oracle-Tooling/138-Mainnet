import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface MetricsData {
  timestamp: string;
  metrics: {
    cpu: number;
    memory: number;
    network: number;
  };
}

export function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<MetricsData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:3000');
    
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'METRICS_UPDATE') {
        setMetrics(prev => [...prev.slice(-30), data]);
      }
    };

    wsRef.current.onopen = () => {
      wsRef.current?.send(JSON.stringify({ type: 'SUBSCRIBE_METRICS' }));
    };

    return () => wsRef.current?.close();
  }, []);

  const chartData = {
    labels: metrics.map(m => new Date(m.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: metrics.map(m => m.metrics.cpu),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Memory Usage (%)',
        data: metrics.map(m => m.metrics.memory),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Resource Metrics</h2>
        <div className="h-64">
          <Line data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        {Object.entries(metrics[metrics.length - 1]?.metrics || {}).map(([key, value]) => (
          <Card key={key} className="p-4">
            <h3 className="font-medium capitalize">{key}</h3>
            <p className="text-2xl">{Math.round(value * 100) / 100}</p>
          </Card>
        ))}
      </div>

      {error && (
        <Alert variant="destructive">
          <span>{error}</span>
        </Alert>
      )}
    </div>
  );
}

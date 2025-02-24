import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Radar } from 'react-chartjs-2';
import axios from 'axios';

interface DeploymentCosts {
  id: string;
  name: string;
  costs: {
    compute: number;
    storage: number;
    network: number;
    other: number;
  };
  metrics: {
    efficiency: number;
    utilization: number;
    performance: number;
  };
}

export function CostComparison() {
  const [deployments, setDeployments] = useState<DeploymentCosts[]>([]);
  const [selectedDeployments, setSelectedDeployments] = useState<string[]>([]);

  const radarData = {
    labels: ['Compute Efficiency', 'Storage Optimization', 'Network Usage', 'Resource Utilization'],
    datasets: selectedDeployments.map(id => {
      const deployment = deployments.find(d => d.id === id);
      return {
        label: deployment?.name || '',
        data: [
          deployment?.metrics.efficiency || 0,
          deployment?.metrics.utilization || 0,
          deployment?.metrics.performance || 0,
        ],
        backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
      };
    }),
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Deployment Cost Comparison</h2>
        <Select
          multiple
          value={selectedDeployments}
          onChange={(e) => setSelectedDeployments(Array.from(e.target.selectedOptions, opt => opt.value))}
          options={deployments.map(d => ({ value: d.id, label: d.name }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="h-80">
          <Radar data={radarData} options={{ maintainAspectRatio: false }} />
        </div>
        
        <div className="space-y-4">
          {selectedDeployments.map(id => {
            const deployment = deployments.find(d => d.id === id);
            return (
              <Card key={id} className="p-4">
                <h3 className="font-medium">{deployment?.name}</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {Object.entries(deployment?.costs || {}).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-sm text-gray-500 capitalize">{key}</span>
                      <p className="text-lg">${value.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

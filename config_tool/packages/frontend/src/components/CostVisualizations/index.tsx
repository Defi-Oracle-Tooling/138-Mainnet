import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { TreeMap, Sankey, PieChart } from 'react-chartjs-2';
import { useTheme } from '@/hooks/useTheme';

interface CostVisualizationProps {
  data: {
    services: Record<string, number>;
    regions: Record<string, number>;
    tags: Record<string, number>;
    trends: Array<{ date: string; amount: number }>;
  };
}

export function CostVisualizations({ data }: CostVisualizationProps) {
  const [visualType, setVisualType] = useState<'treemap' | 'sankey' | 'pie'>('treemap');
  const { theme } = useTheme();

  const getVisualization = () => {
    switch (visualType) {
      case 'treemap':
        return (
          <TreeMap
            data={{
              datasets: [{
                tree: Object.entries(data.services).map(([name, value]) => ({
                  name,
                  value,
                })),
                backgroundColor: theme.colors.chart,
                spacing: 2,
              }],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                title: { display: true, text: 'Service Cost Distribution' }
              }
            }}
          />
        );

      case 'sankey':
        return (
          <Sankey
            data={{
              datasets: [{
                data: Object.entries(data.regions).map(([region, cost]) => ({
                  from: 'Total Cost',
                  to: region,
                  flow: cost
                })),
                colorMode: 'gradient',
              }],
            }}
            options={{
              maintainAspectRatio: false,
            }}
          />
        );

      case 'pie':
        return (
          <PieChart
            data={{
              labels: Object.keys(data.tags),
              datasets: [{
                data: Object.values(data.tags),
                backgroundColor: theme.colors.chart,
              }],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'right' }
              }
            }}
          />
        );
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Cost Distribution</h2>
        <Select
          value={visualType}
          onChange={(e) => setVisualType(e.target.value as any)}
          options={[
            { label: 'TreeMap', value: 'treemap' },
            { label: 'Sankey Diagram', value: 'sankey' },
            { label: 'Pie Chart', value: 'pie' }
          ]}
        />
      </div>
      <div className="h-96">
        {getVisualization()}
      </div>
    </Card>
  );
}

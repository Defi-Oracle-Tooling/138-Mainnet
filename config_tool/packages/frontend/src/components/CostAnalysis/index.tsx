import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

interface CostBreakdown {
  period: string;
  compute: number;
  storage: number;
  network: number;
  total: number;
}

export function CostAnalysis() {
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    new Date()
  ]);
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');
  const [costData, setCostData] = useState<CostBreakdown[]>([]);

  useEffect(() => {
    const fetchHistoricalCosts = async () => {
      try {
        const response = await axios.get('/api/costs/historical', {
          params: {
            start: dateRange[0].toISOString(),
            end: dateRange[1].toISOString(),
            groupBy
          }
        });
        setCostData(response.data);
      } catch (error) {
        console.error('Failed to fetch historical costs:', error);
      }
    };

    fetchHistoricalCosts();
  }, [dateRange, groupBy]);

  const chartData = {
    labels: costData.map(d => d.period),
    datasets: [
      {
        label: 'Compute',
        data: costData.map(d => d.compute),
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      },
      {
        label: 'Storage',
        data: costData.map(d => d.storage),
        backgroundColor: 'rgba(255, 159, 64, 0.6)'
      },
      {
        label: 'Network',
        data: costData.map(d => d.network),
        backgroundColor: 'rgba(153, 102, 255, 0.6)'
      }
    ]
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Historical Cost Analysis</h2>
          <div className="flex gap-4">
            <DateRangePicker value={dateRange} onChange={setDateRange} />
            <Select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as 'day' | 'week' | 'month')}
              options={[
                { label: 'Daily', value: 'day' },
                { label: 'Weekly', value: 'week' },
                { label: 'Monthly', value: 'month' }
              ]}
            />
          </div>
        </div>
        
        <div className="h-96">
          <Bar
            data={chartData}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Cost ($)'
                  }
                }
              }
            }}
          />
        </div>
      </Card>
    </div>
  );
}

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Checkbox } from '@/components/ui/checkbox';
import axios from 'axios';

interface ExportOptions {
  format: 'xlsx' | 'csv' | 'pdf';
  timeRange: [Date, Date];
  groupBy: 'day' | 'week' | 'month';
  includeMetrics: boolean;
}

export function CostReportExport({ deploymentId }: { deploymentId: string }) {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'xlsx',
    timeRange: [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()],
    groupBy: 'day',
    includeMetrics: true
  });

  const handleExport = async () => {
    try {
      const response = await axios.post('/api/costs/export', {
        deploymentId,
        options
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `cost-report-${deploymentId}.${options.format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Export Cost Report</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Format</label>
            <Select
              value={options.format}
              onChange={(e) => setOptions(prev => ({ ...prev, format: e.target.value as 'xlsx' | 'csv' | 'pdf' }))}
              options={[
                { label: 'Excel (XLSX)', value: 'xlsx' },
                { label: 'CSV', value: 'csv' },
                { label: 'PDF', value: 'pdf' }
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Group By</label>
            <Select
              value={options.groupBy}
              onChange={(e) => setOptions(prev => ({ ...prev, groupBy: e.target.value as 'day' | 'week' | 'month' }))}
              options={[
                { label: 'Daily', value: 'day' },
                { label: 'Weekly', value: 'week' },
                { label: 'Monthly', value: 'month' }
              ]}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Time Range</label>
          <DateRangePicker
            value={options.timeRange}
            onChange={(range) => setOptions(prev => ({ ...prev, timeRange: range }))}
          />
        </div>

        <div className="flex items-center">
          <Checkbox
            id="metrics"
            checked={options.includeMetrics}
            onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeMetrics: checked as boolean }))}
          />
          <label htmlFor="metrics" className="ml-2 text-sm">
            Include performance metrics
          </label>
        </div>

        <Button onClick={handleExport} className="w-full">
          Export Report
        </Button>
      </div>
    </Card>
  );
}

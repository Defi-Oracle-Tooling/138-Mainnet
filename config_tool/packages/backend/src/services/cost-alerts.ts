import { WebSocket } from 'ws';
import { EventEmitter } from 'events';

interface CostAlert {
  type: 'warning' | 'critical';
  message: string;
  threshold: number;
  actual: number;
  timestamp: string;
}

export class CostAlertService extends EventEmitter {
  private thresholds: Map<string, number> = new Map();
  private alerts: CostAlert[] = [];

  constructor() {
    super();
    this.setDefaultThresholds();
  }

  private setDefaultThresholds() {
    this.thresholds.set('hourly', 10);
    this.thresholds.set('daily', 200);
    this.thresholds.set('monthly', 5000);
  }

  public setThreshold(period: string, amount: number) {
    this.thresholds.set(period, amount);
  }

  public checkCosts(costs: Record<string, number>) {
    const total = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
    
    for (const [period, threshold] of this.thresholds.entries()) {
      if (total > threshold) {
        const alert: CostAlert = {
          type: total > threshold * 1.5 ? 'critical' : 'warning',
          message: `Cost exceeds ${period} threshold: $${total.toFixed(2)} (Threshold: $${threshold})`,
          threshold,
          actual: total,
          timestamp: new Date().toISOString()
        };
        
        this.alerts.push(alert);
        this.emit('alert', alert);
      }
    }
  }

  public getAlerts(since?: Date): CostAlert[] {
    if (!since) return this.alerts;
    return this.alerts.filter(alert => new Date(alert.timestamp) > since);
  }

  public clearAlerts(): void {
    this.alerts = [];
  }
}

export const costAlertService = new CostAlertService();

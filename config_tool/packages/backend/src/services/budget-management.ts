import { EventEmitter } from 'events';
import { WebSocket } from 'ws';
import { costTrackingService } from './cost-tracking';

interface Budget {
  id: string;
  name: string;
  amount: number;
  period: 'monthly' | 'quarterly' | 'annual';
  tags?: string[];
  alerts: {
    threshold: number;
    type: 'percentage' | 'absolute';
    notifyEmail: string[];
  }[];
}

export class BudgetManagementService extends EventEmitter {
  private budgets: Map<string, Budget> = new Map();
  private spendingTrackers: Map<string, number> = new Map();

  constructor() {
    super();
    this.initializeListeners();
  }

  private initializeListeners(): void {
    costTrackingService.on('cost-update', ({ budgetId, amount }) => {
      this.updateSpending(budgetId, amount);
    });
  }

  public createBudget(budget: Omit<Budget, 'id'>): string {
    const id = crypto.randomUUID();
    this.budgets.set(id, { ...budget, id });
    this.spendingTrackers.set(id, 0);
    return id;
  }

  public updateBudget(id: string, updates: Partial<Budget>): void {
    const budget = this.budgets.get(id);
    if (budget) {
      this.budgets.set(id, { ...budget, ...updates });
    }
  }

  public deleteBudget(id: string): void {
    this.budgets.delete(id);
    this.spendingTrackers.delete(id);
  }

  private updateSpending(budgetId: string, amount: number): void {
    const currentSpending = this.spendingTrackers.get(budgetId) || 0;
    const newSpending = currentSpending + amount;
    this.spendingTrackers.set(budgetId, newSpending);

    const budget = this.budgets.get(budgetId);
    if (budget) {
      this.checkBudgetAlerts(budget, newSpending);
    }
  }

  private checkBudgetAlerts(budget: Budget, spending: number): void {
    for (const alert of budget.alerts) {
      const threshold = alert.type === 'percentage' 
        ? budget.amount * (alert.threshold / 100)
        : alert.threshold;

      if (spending >= threshold) {
        this.emit('budget-alert', {
          budgetId: budget.id,
          budgetName: budget.name,
          threshold: alert.threshold,
          spending,
          recipients: alert.notifyEmail
        });
      }
    }
  }

  public getBudgetStatus(id: string): {
    budget: Budget;
    spending: number;
    remaining: number;
    percentage: number;
  } | null {
    const budget = this.budgets.get(id);
    if (!budget) return null;

    const spending = this.spendingTrackers.get(id) || 0;
    return {
      budget,
      spending,
      remaining: budget.amount - spending,
      percentage: (spending / budget.amount) * 100
    };
  }
}

export const budgetManagementService = new BudgetManagementService();

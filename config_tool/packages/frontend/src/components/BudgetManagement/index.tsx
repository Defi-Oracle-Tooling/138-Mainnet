import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { createBudget, updateBudget } from '@/services/api';
import { Budget } from '@/types';

export function BudgetManagement() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [newBudget, setNewBudget] = useState({
    name: '',
    amount: 0,
    period: 'monthly' as const,
    alerts: []
  });

  const handleBudgetCreate = async () => {
    const created = await createBudget(newBudget);
    setBudgets(prev => [...prev, created]);
    setCreateDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Budget Management</h2>
        <Button onClick={() => setCreateDialogOpen(true)}>
          Create Budget
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map(budget => (
          <BudgetCard key={budget.id} budget={budget} />
        ))}
      </div>

      <Dialog 
        open={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
        title="Create New Budget"
      >
        <div className="space-y-4">
          <Input
            label="Budget Name"
            value={newBudget.name}
            onChange={e => setNewBudget(prev => ({ ...prev, name: e.target.value }))}
          />
          <Input
            type="number"
            label="Amount"
            value={newBudget.amount}
            onChange={e => setNewBudget(prev => ({ ...prev, amount: Number(e.target.value) }))}
          />
          <Button onClick={handleBudgetCreate}>Create</Button>
        </div>
      </Dialog>
    </div>
  );
}

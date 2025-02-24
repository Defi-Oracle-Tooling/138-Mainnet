import { EventEmitter } from 'events';
import { Budget } from '../types';

interface ApprovalStep {
  id: string;
  role: string;
  threshold: number;
  approvers: string[];
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
}

interface ApprovalWorkflow {
  id: string;
  budgetId: string;
  steps: ApprovalStep[];
  currentStep: number;
  status: 'in_progress' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export class BudgetApprovalService extends EventEmitter {
  private workflows: Map<string, ApprovalWorkflow> = new Map();
  private approvalPolicies: Map<string, ApprovalStep[]> = new Map();

  public createWorkflow(budget: Budget): string {
    const id = crypto.randomUUID();
    const steps = this.generateApprovalSteps(budget);
    
    const workflow: ApprovalWorkflow = {
      id,
      budgetId: budget.id,
      steps,
      currentStep: 0,
      status: 'in_progress',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.workflows.set(id, workflow);
    this.emit('workflow-created', workflow);
    return id;
  }

  public async approveStep(workflowId: string, approverId: string, comments?: string): Promise<void> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error('Workflow not found');

    const currentStep = workflow.steps[workflow.currentStep];
    if (!currentStep.approvers.includes(approverId)) {
      throw new Error('Unauthorized approver');
    }

    currentStep.status = 'approved';
    currentStep.comments = comments;
    workflow.currentStep++;
    workflow.updatedAt = new Date();

    if (workflow.currentStep >= workflow.steps.length) {
      workflow.status = 'approved';
      this.emit('workflow-completed', workflow);
    }

    this.workflows.set(workflowId, workflow);
    this.emit('step-approved', { workflow, step: currentStep });
  }

  private generateApprovalSteps(budget: Budget): ApprovalStep[] {
    const policy = this.approvalPolicies.get(budget.period);
    if (!policy) return [];

    return policy.map(step => ({
      ...step,
      status: 'pending'
    }));
  }
}

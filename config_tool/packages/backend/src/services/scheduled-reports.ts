import { CronJob } from 'cron';
import nodemailer from 'nodemailer';
import { CostExportService } from './cost-export';
import { format } from 'date-fns';

interface ReportSchedule {
  id: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  format: 'xlsx' | 'csv' | 'pdf';
  includeMetrics: boolean;
  deploymentId: string;
}

export class ScheduledReportService {
  private jobs: Map<string, CronJob> = new Map();
  private costExportService: CostExportService;
  private emailTransport: nodemailer.Transporter;

  constructor() {
    this.costExportService = new CostExportService();
    this.setupEmailTransport();
  }

  private setupEmailTransport() {
    this.emailTransport = nodemailer.createTransport({
      // Configure email transport settings
    });
  }

  public scheduleReport(schedule: ReportSchedule): void {
    const cronPattern = this.getCronPattern(schedule.frequency);
    
    const job = new CronJob(cronPattern, () => {
      this.generateAndSendReport(schedule);
    });

    this.jobs.set(schedule.id, job);
    job.start();
  }

  public cancelSchedule(scheduleId: string): void {
    const job = this.jobs.get(scheduleId);
    if (job) {
      job.stop();
      this.jobs.delete(scheduleId);
    }
  }

  private async generateAndSendReport(schedule: ReportSchedule): Promise<void> {
    try {
      const report = await this.costExportService.generateReport(
        schedule.deploymentId,
        {
          format: schedule.format,
          timeRange: this.getTimeRange(schedule.frequency),
          groupBy: schedule.frequency === 'daily' ? 'hour' : 'day',
          includeMetrics: schedule.includeMetrics
        }
      );

      await this.emailReport(schedule.recipients, report, schedule.format);
    } catch (error) {
      console.error('Failed to generate scheduled report:', error);
    }
  }

  private getCronPattern(frequency: string): string {
    switch (frequency) {
      case 'daily': return '0 0 * * *';
      case 'weekly': return '0 0 * * 0';
      case 'monthly': return '0 0 1 * *';
      default: throw new Error(`Invalid frequency: ${frequency}`);
    }
  }

  private getTimeRange(frequency: string): { start: Date; end: Date } {
    const end = new Date();
    const start = new Date();
    
    switch (frequency) {
      case 'daily':
        start.setDate(start.getDate() - 1);
        break;
      case 'weekly':
        start.setDate(start.getDate() - 7);
        break;
      case 'monthly':
        start.setMonth(start.getMonth() - 1);
        break;
    }
    
    return { start, end };
  }

  private async emailReport(
    recipients: string[],
    report: Buffer,
    format: string
  ): Promise<void> {
    const date = format(new Date(), 'yyyy-MM-dd');
    
    await this.emailTransport.sendMail({
      from: 'cost-reports@example.com',
      to: recipients.join(', '),
      subject: `Cost Report - ${date}`,
      text: 'Please find attached your scheduled cost report.',
      attachments: [{
        filename: `cost-report-${date}.${format}`,
        content: report
      }]
    });
  }
}

export const scheduledReportService = new ScheduledReportService();

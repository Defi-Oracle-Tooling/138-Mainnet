import { Resource, Tag } from '../types';

interface TagRule {
  id: string;
  name: string;
  pattern: RegExp;
  tags: Tag[];
  priority: number;
}

export class CostTaggingService {
  private tagRules: TagRule[] = [];

  public addTagRule(rule: Omit<TagRule, 'id'>): string {
    const id = crypto.randomUUID();
    this.tagRules.push({ ...rule, id });
    this.tagRules.sort((a, b) => b.priority - a.priority);
    return id;
  }

  public removeTagRule(id: string): void {
    this.tagRules = this.tagRules.filter(rule => rule.id !== id);
  }

  public applyTags(resource: Resource): Tag[] {
    const appliedTags: Tag[] = [];
    
    for (const rule of this.tagRules) {
      if (rule.pattern.test(resource.name)) {
        appliedTags.push(...rule.tags);
      }
    }

    return appliedTags;
  }

  public async tagResources(resources: Resource[]): Promise<void> {
    for (const resource of resources) {
      const tags = this.applyTags(resource);
      await this.updateResourceTags(resource.id, tags);
    }
  }

  private async updateResourceTags(resourceId: string, tags: Tag[]): Promise<void> {
    // Implementation to update resource tags in the cloud provider
    // This would integrate with AWS, GCP, Azure APIs
  }
}

export const costTaggingService = new CostTaggingService();

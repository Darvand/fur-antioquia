import { Injectable } from '@nestjs/common';
import { ElectionsRepository } from './elections.repository';

@Injectable()
export class ElectionsService {
  constructor(private readonly electionsRepository: ElectionsRepository) {}

  async getHTMLResults() {
    const elections = await this.electionsRepository.getAll();
    const results = elections.reduce(
      (acc, vote) => {
        if (!acc[vote.admin_name]) {
          acc[vote.admin_name] = new Set();
        }
        acc[vote.admin_name].add(vote.member_id);
        return acc;
      },
      {} as Record<string, Set<number>>,
    );
    return Object.entries(results)
      .map(([admin, votes]) => `${admin}: <code>${votes.size}</code>`)
      .join('\n');
  }
}

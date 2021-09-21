import axios, { AxiosInstance } from 'axios';
import { toQueryString } from './utils';
import { ProposalParamChangeRequest } from './types';
import { getConfig } from '../bootstrap';
import BlockchainModule from './base';

export class GovernanceModule extends BlockchainModule {
  async submitProposal(proposal: object): Promise<object> {
    const res = await this.client.post(`/gov/proposals`, proposal);
    return res.data;
  }

  async queryProposals(
    params: {
      voter?: string;
      depositor?: string;
      status?: string;
    } = {}
  ): Promise<object> {
    const qs = toQueryString(params);
    const res = await this.client.get(`/gov/proposals?${qs}`);
    return res.data;
  }

  async changeProposalParameter(
    body: ProposalParamChangeRequest
  ): Promise<object> {
    const res = await this.client.post(`/gov/proposals/param_change`, body);
    return res.data;
  }

  async getProposalVotes(id: string): Promise<object> {
    const res = await this.client.get(`/gov/proposals/${id}/votes`);
    return res.data;
  }

  async voteProposal(id: string, vote: object): Promise<object> {
    const res = await this.client.post(`/gov/proposals/${id}/votes`, vote);
    return res.data;
  }
}

// Add governance module.
let governanceModule: GovernanceModule;

export function useGovernance() {
  const config = getConfig();
  if (!config) throw new Error('No client available');
  if (!governanceModule) {
    governanceModule = new GovernanceModule(config.restUrl);
  }
  return governanceModule;
}

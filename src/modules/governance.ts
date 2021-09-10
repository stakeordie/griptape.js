import axios, { AxiosInstance } from 'axios';
import { toQueryString } from './utils';
import { ProposalParamChangeRequest } from './types';

export class GovernanceModule {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({ baseURL });
  }

  submitProposal(proposal: object): Promise<object> {
    return this.client.post(`/gov/proposals`, proposal);
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

  changeProposalParameter(body: ProposalParamChangeRequest): Promise<object> {
    return this.client.post(`/gov/proposals/param_change`, body);
  }

  getProposalVotes(id: string): Promise<object> {
    return this.client.get(`/gov/proposals/${id}/votes`);
  }

  voteProposal(id: string, vote: object): Promise<object> {
    return this.client.post(`/gov/proposals/${id}/votes`, vote);
  }
}

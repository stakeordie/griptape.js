import { toQueryString } from './utils';
import {
  Amount,
  ModuleBaseResponse,
  BaseReq,
  Deposit,
  Fee,
  ModuleErrorResponse,
  ProposalParamChangeRequest,
  Signature,
} from './types';
import { getConfig } from '../bootstrap';
import BlockchainModule from './base';

export interface DepositTokensBodyReq {
  base_req: BaseReq;
  Depositor: string;
  amount: Deposit[];
}

export interface SubmitProposalBodyReq {
  base_req: BaseReq;
  title: string;
  description: string;
  proposal_type: string;
  proposer: string;
  initial_Deposit: Deposit[];
}

export interface PostProposalResponse {
  type: string;
  value: ProposalSubmitValue;
}

export interface ProposalSubmitValue {
  msg: Msg[];
  fee: Fee;
  signatures: Signature;
  memo: string;
}

export interface Msg {
  type: string;
  value: {
    content: {
      type: string;
      value: ProposalContent;
    };
    initial_Deposit: Deposit[];
    proposer: string;
  };
}

export interface VoteProposalBodyReq {
  base_req: BaseReq;
  voter: string;
  option: string;
}

export interface GetProposalsResponse extends ModuleBaseResponse {
  result: ProposalValue[];
}

export interface ProposalValue {
  proposal_id: number;
  title: string;
  description: string;
  proposal_type: string;
  proposal_status: string;
  final_tally_result: FinalTallyResult;
  submit_time: string;
  total_Deposit: Deposit[];
  voting_start_time: string;
}

export interface FinalTallyResult {
  yes: string;
  abstain: string;
  no: string;
  no_with_veto: string;
}

export interface GetProposalAtResponse extends ModuleBaseResponse {
  result: {
    content: ProposalContent;
    id: string;
    proposal_status: string;
    final_tally_result: FinalTallyResult;
    submit_time: Date;
    Deposit_end_time: Date;
    total_Deposit: Deposit[];
    voting_start_time: Date;
    voting_end_time: Date;
  };
}

export interface ProposalContent {
  type: string;
  value: {
    title: string;
    description: string;
  };
}

export interface ProposalProposerResponse extends ModuleBaseResponse {
  result: {
    proposal_id: string;
    proposer: string;
  };
}

export interface GetDepositResponse {
  result: DespositResult[];
}
export interface DespositResult {
  amount: Amount[];
  proposal_id: string;
  depositor: string;
}

export interface ProposalVotesResponse extends ModuleBaseResponse {
  result: {
    voter: string;
    proposal_id: string;
    option: string;
  };
}

export interface ProposalTallyResponse extends ModuleBaseResponse {
  result: DespositResult;
}

export interface DepositParametersResponse extends ModuleBaseResponse {
  result: {
    min_deposit: Amount[];
    max_deposit_period: string;
  };
}

export interface TallyParametersResponse extends ModuleBaseResponse {
  result: {
    quorum: string;
    threshold: string;
    veto: string;
  };
}

export interface VotingParametersResponse extends ModuleBaseResponse {
  result: {
    voting_period: string;
  };
}

export class GovernanceModule extends BlockchainModule {
  /**
   * submits a proposal
   * @param proposal the body of the request SubmitProposalBodyReq
   * @returns a PostProposalResponse object with resultant data or ModuleErrorResponse
   */
  async submitProposal(
    proposal: SubmitProposalBodyReq
  ): Promise<PostProposalResponse | ModuleErrorResponse> {
    const res = await this.client.post(`/gov/proposals`, proposal);
    return res.data;
  }

  /**
   * Get all proposals
   * @param params an object with all parameters available "voter","Depositor","status"
   * @returns a GetProposalsResponse or ModuleErrorResponse
   */
  async getProposals(params: {
    voter?: string;
    Depositor?: string;
    status?: string;
  }): Promise<GetProposalsResponse | ModuleErrorResponse> {
    const qs = toQueryString(params);
    const res = await this.client.get(`/gov/proposals?${qs}`);
    return res.data;
  }

  /**
   * Generate a parameter change proposal transaction
   * @param body ProposalParamChangeRequest the body of the POST request
   * @returns a ProposalSubmitValue or ModuleErrorResponse
   */
  async changeProposalParameter(
    body: ProposalParamChangeRequest
  ): Promise<ProposalSubmitValue | ModuleErrorResponse> {
    const res = await this.client.post(`/gov/proposals/param_change`, body);
    return res.data;
  }

  /**
   * Get a proposal by id
   * @param id id of the proposal querier
   * @returns a GetProposalAtResponse or ModuleErrorResponse object
   */
  async getProposal(
    id: string
  ): Promise<GetProposalAtResponse | ModuleErrorResponse> {
    const res = await this.client.get(`/gov/proposals/${id}`);
    return res.data;
  }

  /**
   * Get proposer of a proposal by id
   * @param id id of proposal querier
   * @returns a ProposalProposerResponse or ModuleErrorResponse object
   */
  async getProposalProposer(
    id: string
  ): Promise<ProposalProposerResponse | ModuleErrorResponse> {
    const res = await this.client.get(`/gov/proposals/${id}/proposer`);
    return res.data;
  }

  /**
   * Get all deposits of a proposal
   * @param id id of proposal querier
   * @returns GetDepositResponse or ModuleErrorResponse object
   */
  async getProposalDeposits(
    id: string
  ): Promise<GetDepositResponse | ModuleErrorResponse> {
    const res = await this.client.get(`/gov/proposals/${id}/deposits`);
    return res.data;
  }

  /**
   * Deposit tokens to a proposal
   * @param id id of proposal querier
   * @param body PostProposalResponse or ModuleErrorResponse object
   * @returns
   */
  async depositTokensProposal(
    id: string,
    body: DepositTokensBodyReq
  ): Promise<PostProposalResponse | ModuleErrorResponse> {
    const res = await this.client.post(`/gov/proposals/${id}/deposits`, body);
    return res.data;
  }

  /**
   * Get deposits of an specific proposal and depositor
   * @param id id of proposal querier
   * @param depositorAddr address of depositor
   * @returns a DespositResult or ModuleErrorResponse object
   */
  async getDepositAt(
    id: string,
    depositorAddr: string
  ): Promise<DespositResult | ModuleErrorResponse> {
    const res = await this.client.get(
      `/gov/proposals/${id}/deposits/${depositorAddr}`
    );
    return res.data;
  }

  /**
   * Get votes of a proposal
   * @param id id of proposal querier
   * @returns a ProposalVotesResponse or ModuleErrorResponse object
   */
  async getProposalVotes(
    id: string
  ): Promise<ProposalVotesResponse | ModuleErrorResponse> {
    const res = await this.client.get(`/gov/proposals/${id}/votes`);
    return res.data;
  }

  /**
   * Vote on a proposal
   * @param id id of proposal to vote
   * @param vote VoteProposalBodyReq object with vote information
   * @returns a PostProposalResponse or ModuleErrorResponse object
   */
  async voteProposal(
    id: string,
    vote: VoteProposalBodyReq
  ): Promise<PostProposalResponse | ModuleErrorResponse> {
    const res = await this.client.post(`/gov/proposals/${id}/votes`, vote);
    return res.data;
  }

  /**
   * Get proposal vote of voter address
   * @param id id of proposal querier
   * @param voterAddr address whom voted
   * @returns a ProposalVotesResponse or ModuleErrorResponse object
   */
  async getProposalVote(
    id: string,
    voterAddr: string
  ): Promise<ProposalVotesResponse | ModuleErrorResponse> {
    const res = await this.client.get(
      `/gov/proposals/${id}/votes/${voterAddr}`
    );
    return res.data;
  }

  /**
   * Get tally results of proposal
   * @param id id of proposal querier
   * @returns a ProposalTallyResponse or ModuleErrorResponse object
   */
  async getProposalTallyResult(
    id: string
  ): Promise<ProposalTallyResponse | ModuleErrorResponse> {
    const res = await this.client.get(`/gov/proposals/${id}/tally`);
    return res.data;
  }

  /**
   * Query governance deposit parameters
   * @returns DepositParametersResponse object
   */
  async getDepositParameters(): Promise<DepositParametersResponse> {
    const res = await this.client.get(`/gov/parameters/deposit`);
    return res.data;
  }

  /**
   * Query governance tally parameters
   * @returns TallyParametersResponse object
   */
  async getTallyParameters(): Promise<TallyParametersResponse> {
    const res = await this.client.get(`/gov/parameters/tallying`);
    return res.data;
  }

  /**
   * Query governance voting parameters
   * @returns VotingParametersResponse object
   */
  async getVotingParameters(): Promise<VotingParametersResponse> {
    const res = await this.client.get(`/gov/parameters/voting`);
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

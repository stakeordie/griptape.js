import { toQueryString } from './utils';
import {
  Amount,
  BaseReq,
  Deposit,
  Fee,
  ProposalParamChangeRequest,
  Signature,
} from './types';
import { getConfig } from '../bootstrap';
import BlockchainModule from './base';
export interface GovernanceBaseResponse {
  height: string;
}
export interface GovernanceError {
  error: string;
}
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
export interface VoteProposalBodyReq {
  base_req: BaseReq;
  voter: string;
  option: string;
}

export interface Msg {
  type: string;
  value: MsgValue;
}

export interface MsgValue {
  content: Content;
  initial_Deposit: Deposit[];
  proposer: string;
}

export interface Content {
  type: string;
  value: ContentValue;
}

export interface ContentValue {
  title: string;
  description: string;
}

export interface GetProposalsResponse extends GovernanceBaseResponse {
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

export interface GetProposalAtResponse extends GovernanceBaseResponse {
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
  value: ProposalContentValue;
}

export interface ProposalContentValue {
  title: string;
  description: string;
}
export interface ProposalProposerResponse extends GovernanceBaseResponse {
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

export interface ProposalVotesResponse extends GovernanceBaseResponse {
  result: {
    voter: string;
    proposal_id: string;
    option: string;
  };
}

export interface ProposalTallyResponse extends GovernanceBaseResponse {
  result: {
    proposal_id: string;
    depositor: string;
    amount: Amount[];
  };
}

export interface DepositParametersResponse extends GovernanceBaseResponse {
  result: {
    min_deposit: Amount[];
    max_deposit_period: string;
  };
}

export interface TallyParametersResponse extends GovernanceBaseResponse {
  result: {
    quorum: string;
    threshold: string;
    veto: string;
  };
}

export interface VotingParametersResponse extends GovernanceBaseResponse {
  result: {
    voting_period: string;
  };
}

export class GovernanceModule extends BlockchainModule {
  /**
   * submits a proposal
   * @param proposal the body of the request SubmitProposalBodyReq
   * @returns a PostProposalResponse object with resultant data or GovernanceError
   */
  async submitProposal(
    proposal: SubmitProposalBodyReq
  ): Promise<PostProposalResponse | GovernanceError> {
    const res = await this.client.post(`/gov/proposals`, proposal);
    return res.data;
  }

  /**
   * Get all proposals
   * @param params an object with all parameters available "voter","Depositor","status"
   * @returns a GetProposalsResponse or GovernanceError
   */
  async getProposals(params: {
    voter?: string;
    Depositor?: string;
    status?: string;
  }): Promise<GetProposalsResponse | GovernanceError> {
    const qs = toQueryString(params);
    const res = await this.client.get(`/gov/proposals?${qs}`);
    return res.data;
  }

  /**
   * Generate a parameter change proposal transaction
   * @param body ProposalParamChangeRequest the body of the POST request
   * @returns a ProposalSubmitValue or GovernanceError
   */
  async changeProposalParameter(
    body: ProposalParamChangeRequest
  ): Promise<ProposalSubmitValue | GovernanceError> {
    const res = await this.client.post(`/gov/proposals/param_change`, body);
    return res.data;
  }

  /**
   * Get a proposal by id
   * @param id id of the proposal querier
   * @returns a GetProposalAtResponse or GovernanceError object
   */
  async getProposal(
    id: string
  ): Promise<GetProposalAtResponse | GovernanceError> {
    const res = await this.client.get(`/gov/proposals/${id}`);
    return res.data;
  }

  /**
   * Get proposer of a proposal by id
   * @param id id of proposal querier
   * @returns a ProposalProposerResponse or GovernanceError object
   */
  async getProposalProposer(
    id: string
  ): Promise<ProposalProposerResponse | GovernanceError> {
    const res = await this.client.get(`/gov/proposals/${id}/proposer`);
    return res.data;
  }

  /**
   * Get all deposits of a proposal
   * @param id id of proposal querier
   * @returns GetDepositResponse or GovernanceError object
   */
  async getProposalDeposits(
    id: string
  ): Promise<GetDepositResponse | GovernanceError> {
    const res = await this.client.get(`/gov/proposals/${id}/deposits`);
    return res.data;
  }

  /**
   * Deposit tokens to a proposal
   * @param id id of proposal querier
   * @param body PostProposalResponse or GovernanceError object
   * @returns
   */
  async depositTokensProposal(
    id: string,
    body: DepositTokensBodyReq
  ): Promise<PostProposalResponse | GovernanceError> {
    const res = await this.client.post(`/gov/proposals/${id}/deposits`, body);
    return res.data;
  }

  /**
   * Get deposits of an specific proposal and depositor
   * @param id id of proposal querier
   * @param depositorAddr address of depositor
   * @returns a DespositResult or GovernanceError object
   */
  async getDepositAt(
    id: string,
    depositorAddr: string
  ): Promise<DespositResult | GovernanceError> {
    const res = await this.client.get(
      `/gov/proposals/${id}/deposits/${depositorAddr}`
    );
    return res.data;
  }

  /**
   * Get votes of a proposal
   * @param id id of proposal querier
   * @returns a ProposalVotesResponse or GovernanceError object
   */
  async getProposalVotes(
    id: string
  ): Promise<ProposalVotesResponse | GovernanceError> {
    const res = await this.client.get(`/gov/proposals/${id}/votes`);
    return res.data;
  }

  /**
   * Vote on a proposal
   * @param id id of proposal to vote
   * @param vote VoteProposalBodyReq object with vote information
   * @returns a PostProposalResponse or GovernanceError object
   */
  async voteProposal(
    id: string,
    vote: VoteProposalBodyReq
  ): Promise<PostProposalResponse | GovernanceError> {
    const res = await this.client.post(`/gov/proposals/${id}/votes`, vote);
    return res.data;
  }

  /**
   * Get proposal vote of voter address
   * @param id id of proposal querier
   * @param voterAddr address whom voted
   * @returns a ProposalVotesResponse or GovernanceError object
   */
  async getProposalVote(
    id: string,
    voterAddr: string
  ): Promise<ProposalVotesResponse | GovernanceError> {
    const res = await this.client.get(
      `/gov/proposals/${id}/votes/${voterAddr}`
    );
    return res.data;
  }

  /**
   * Get tally results of proposal
   * @param id id of proposal querier
   * @returns a ProposalTallyResponse or GovernanceError object
   */
  async getProposalTallyResult(
    id: string
  ): Promise<ProposalTallyResponse | GovernanceError> {
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

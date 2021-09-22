import BlockchainModule from './base';
import { getConfig } from '../bootstrap';

//Base Initial Response For Almost Queries
export interface BaseDistributionResponse {
  height: string;
}

//TotalRewards: Response
export interface TotalRewardsResponse {
  rewards: Reward[];
  total: Total[];
}

export interface Reward {
  validator_address: string;
  reward: Total[];
}

export interface Total {
  denom: string;
  amount: string;
}

//WithdraWithDrawAllRewards : Request
export interface WithDrawAllRewardsRequest {
  base_req: BaseReq;
}
export interface BaseReq {
  from: string;
  memo: string;
  chain_id: string;
  account_number: string;
  sequence: string;
  gas: string;
  gas_adjustment: string;
  fees: Fee[];
  simulate: boolean;
}
export interface Fee {
  denom: string;
  amount: string;
}

//WithDrawAllRewards : Response
export interface WithDrawAllRewardsResponse {
  msg: string[];
  fee: FeeWithdraw;
  memo: string;
  signatures: Signature[];
}

export interface FeeWithdraw {
  gas: string;
  amount: Amount[];
}

export interface Amount {
  denom: string;
  amount: string;
}

export interface Signature {
  signature: string;
  pub_key: PubKey;
  account_number: string;
  sequence: string;
}

export interface PubKey {
  type: string;
  value: string;
}

//QueryDelegation: Response
export interface QueryDelegationRewardResponse {
  denom: string;
  amount: string;
}

//WithdrawDelegationReward: Request
export interface WithdrawDelegationRewardRequest {
  base_req: BaseReq;
}

export interface BaseReq {
  from: string;
  memo: string;
  chain_id: string;
  account_number: string;
  sequence: string;
  gas: string;
  gas_adjustment: string;
  fees: Fee[];
  simulate: boolean;
}

export interface Fee {
  denom: string;
  amount: string;
}

//WithdrawDelegationReward: Response
export interface WithdrawDelegationRewardResponse {
  msg: string[];
  fee: FeeWithdraw;
  memo: string;
  signatures: Signature[];
}
export interface Signature {
  signature: string;
  pub_key: PubKey;
  account_number: string;
  sequence: string;
}

export interface PubKey {
  type: string;
  value: string;
}

//GetRewardsWithdrawalAddress: Response
export interface GetRewardsWithdrawalAddressResponse {
  res: string;
}

//ReplaceRewardsWithdrawalAddress : Request
export interface ReplaceRewardsWithdrawalAddressRequest {
  base_req: BaseReq;
  withdraw_address: string;
}

export interface BaseReq {
  from: string;
  memo: string;
  chain_id: string;
  account_number: string;
  sequence: string;
  gas: string;
  gas_adjustment: string;
  fees: Fee[];
  simulate: boolean;
}

export interface Fee {
  denom: string;
  amount: string;
}

//ReplaceRewardsWithdrawal: Response
export interface ReplaceRewardsWithdrawalAddressResponse {
  msg: string[];
  fee: FeeWithdraw;
  memo: string;
  signatures: Signature[];
}
export interface Amount {
  denom: string;
  amount: string;
}

export interface Signature {
  signature: string;
  pub_key: PubKey;
  account_number: string;
  sequence: string;
}

export interface PubKey {
  type: string;
  value: string;
}

//GetValidatorDistributionInfo: Response
export interface getValidatorDistributionInfoResponse {
  operator_address: string;
  self_bond_rewards: SelfBondReward[];
  val_commission: SelfBondReward[];
}

export interface SelfBondReward {
  denom: string;
  amount: string;
}

//GetFeeDistributionOustandingRewards : Response
export interface GetFeeDistributionOustandingRewardsResponse {
  denom: string;
  amount: string;
}

//QueryCommissionSelfDelegation: Response
export interface QueryCommissionSelfDelegationRewardsResponse {
  denom: string;
  amount: string;
}

//withdrawValidatorsRewards: Request
export interface WithdrawValidatorsRewardsRequest {
  base_req: BaseReq;
}
export interface BaseReq {
  from: string;
  memo: string;
  chain_id: string;
  account_number: string;
  sequence: string;
  gas: string;
  gas_adjustment: string;
  fees: Fee[];
  simulate: boolean;
}
export interface Fee {
  denom: string;
  amount: string;
}

//withdrawValidatorsRewards: Response
export interface WithdrawValidatorsRewardsResponse {
  msg: string[];
  fee: FeeWithdraw;
  memo: string;
  signatures: Signature[];
}
export interface Amount {
  denom: string;
  amount: string;
}
export interface Signature {
  signature: string;
  pub_key: PubKey;
  account_number: string;
  sequence: string;
}

export interface PubKey {
  type: string;
  value: string;
}

//GetCommunnityPoolParameters : Result
export interface GetCommunnityPoolParametersResult {
  denom: string;
  amount: string;
}

//GetCommunnityPoolParameters : Response
export interface GetCommunnityPoolParametersResponse
  extends BaseDistributionResponse {
  result: GetCommunnityPoolParametersResult[];
}

//GetFeeDistributionParameters: Result
export interface GetFeeDistributionParametersResult {
  community_tax: string;
  base_proposer_reward: string;
  bonus_proposer_reward: string;
  withdraw_addr_enabled: boolean;
  secret_foundation_tax: string;
  secret_foundation_address: string;
}
//GetFeeDistributionParameters: Response
export interface GetFeeDistributionParametersResponse
  extends BaseDistributionResponse {
  result: GetFeeDistributionParametersResult[];
}

//ErrorDistribution Interface
export interface ErrorDistribution {
  error: string;
}

export class DistributionModule extends BlockchainModule {
  async getTotalRewards(delegatorAddr: string): Promise<TotalRewardsResponse> {
    const res = await this.client.get(
      `/distribution/delegators/${delegatorAddr}/rewards`
    );
    return res.data;
  }

  async withDrawAllRewards(
    delegatorAddr: string,
    body: WithDrawAllRewardsRequest
  ): Promise<WithDrawAllRewardsResponse | ErrorDistribution> {
    const res = await this.client.post(
      `/distribution/delegators/${delegatorAddr}/rewards`,
      body
    );
    return res.data;
  }

  async queryDelegationReward(
    delegatorAddr: string,
    validatorAddr: string
  ): Promise<QueryDelegationRewardResponse | ErrorDistribution> {
    const res = await this.client.get(
      `/distribution/delegators/${delegatorAddr}/rewards/${validatorAddr}`
    );
    return res.data;
  }

  async withdrawDelegationReward(
    delegatorAddr: string,
    validatorAddr: string,
    body: WithdrawDelegationRewardRequest
  ): Promise<WithdrawDelegationRewardResponse | ErrorDistribution> {
    const res = await this.client.post(
      `/distribution/delegators/${delegatorAddr}/rewards/${validatorAddr}`,
      body
    );
    return res.data;
  }

  async getRewardsWithdrawalAddress(
    delegatorAddr: string
  ): Promise<GetRewardsWithdrawalAddressResponse | ErrorDistribution> {
    const res = await this.client.get(
      `/distribution/delegators/${delegatorAddr}/withdraw_address`
    );
    return res.data;
  }

  async replaceRewardsWithdrawalAddress(
    delegatorAddr: string,
    body: ReplaceRewardsWithdrawalAddressRequest
  ): Promise<ReplaceRewardsWithdrawalAddressResponse | ErrorDistribution> {
    const res = await this.client.post(
      `/distribution/delegators/${delegatorAddr}/withdraw_address`,
      body
    );
    return res.data;
  }

  async getValidatorDistributionInfo(
    validatorAddr: string
  ): Promise<getValidatorDistributionInfoResponse | ErrorDistribution> {
    const res = await this.client.get(
      `/distribution/validators/${validatorAddr}`
    );
    return res.data;
  }

  async getFeeDistributionOustandingRewards(
    validatorAddr: string
  ): Promise<GetFeeDistributionOustandingRewardsResponse | ErrorDistribution> {
    const res = await this.client.get(
      `distribution/validators/${validatorAddr}/outstanding_rewards`
    );
    return res.data;
  }

  async queryCommissionSelfDelegationRewards(
    validatorAddr: string
  ): Promise<QueryCommissionSelfDelegationRewardsResponse | ErrorDistribution> {
    const res = await this.client.get(
      `/distribution/validators/${validatorAddr}/rewards`
    );
    return res.data;
  }

  async withdrawValidatorsRewards(
    validatorAddr: string,
    body: WithdrawValidatorsRewardsRequest
  ): Promise<WithdrawValidatorsRewardsResponse | ErrorDistribution> {
    const res = await this.client.post(
      `/distribution/validators/${validatorAddr}/rewards`,
      body
    );
    return res.data;
  }

  async getCommunnityPoolParameters(): Promise<GetCommunnityPoolParametersResponse> {
    const res = await this.client.get(`/distribution/community_pool`);
    return res.data;
  }

  async getFeeDistributionParameters(): Promise<GetFeeDistributionParametersResponse> {
    const res = await this.client.get(`/distribution/parameters`);
    return res.data;
  }
}

//Add distribution module.
let distributionModule: DistributionModule;

export function useDistribution() {
  const config = getConfig();
  if (!config) throw new Error('Not Client available');
  if (!distributionModule) {
    distributionModule = new DistributionModule(config.restUrl);
  }
  return distributionModule;
}

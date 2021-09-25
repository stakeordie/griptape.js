import BlockchainModule from './base';
import { getConfig } from '../bootstrap';
import {
  Amount,
  ModuleBaseResponse,
  ModuleBodyRequest,
  ModuleErrorResponse,
  ModulePostResponse,
  ModuleSimpleResponse,
} from './types';

export interface TotalRewardsRequest {
  rewards: DistributionReward[];
  total: Amount[];
}

export interface DistributionReward {
  validator_address: string;
  reward: Amount[];
}

export interface TotalRewardsResponse extends ModuleBaseResponse {
  result: TotalRewardsRequest;
}

export interface ReplaceRewardsWithdrawalAddressRequest
  extends ModuleBodyRequest {
  withdraw_address: string;
}

export interface GetValidatorDistributionInfoResult {
  operator_address: string;
  self_bond_rewards: Amount[];
  val_commission: Amount[];
}

export interface GetValidatorDistributionInfoResponse
  extends ModuleBaseResponse {
  result: GetValidatorDistributionInfoResult;
}

export interface GetDistributionBaseResponse extends ModuleBaseResponse {
  result: Amount[];
}

export interface GetFeeDistributionParametersResult {
  community_tax: string;
  base_proposer_reward: string;
  bonus_proposer_reward: string;
  withdraw_addr_enabled: boolean;
  secret_foundation_tax: string;
  secret_foundation_address: string;
}

export interface GetFeeDistributionParametersResponse
  extends ModuleBaseResponse {
  result: GetFeeDistributionParametersResult;
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
    body: ModuleBodyRequest
  ): Promise<ModulePostResponse | ModuleErrorResponse> {
    const res = await this.client.post(
      `/distribution/delegators/${delegatorAddr}/rewards`,
      body
    );
    return res.data;
  }

  async queryDelegationReward(
    delegatorAddr: string,
    validatorAddr: string
  ): Promise<GetDistributionBaseResponse> {
    const res = await this.client.get(
      `/distribution/delegators/${delegatorAddr}/rewards/${validatorAddr}`
    );
    return res.data;
  }

  async withdrawDelegationReward(
    delegatorAddr: string,
    validatorAddr: string,
    body: ModuleBodyRequest
  ): Promise<ModulePostResponse | ModuleErrorResponse> {
    const res = await this.client.post(
      `/distribution/delegators/${delegatorAddr}/rewards/${validatorAddr}`,
      body
    );
    return res.data;
  }

  async getRewardsWithdrawalAddress(
    delegatorAddr: string
  ): Promise<ModuleSimpleResponse> {
    const res = await this.client.get(
      `/distribution/delegators/${delegatorAddr}/withdraw_address`
    );
    return res.data;
  }

  async replaceRewardsWithdrawalAddress(
    delegatorAddr: string,
    body: ReplaceRewardsWithdrawalAddressRequest
  ): Promise<ModulePostResponse | ModuleErrorResponse> {
    const res = await this.client.post(
      `/distribution/delegators/${delegatorAddr}/withdraw_address`,
      body
    );
    return res.data;
  }

  async getValidatorDistributionInfo(
    validatorAddr: string
  ): Promise<GetValidatorDistributionInfoResponse> {
    const res = await this.client.get(
      `/distribution/validators/${validatorAddr}`
    );
    return res.data;
  }

  async getFeeDistributionOustandingRewards(
    validatorAddr: string
  ): Promise<GetDistributionBaseResponse> {
    const res = await this.client.get(
      `distribution/validators/${validatorAddr}/outstanding_rewards`
    );
    return res.data;
  }

  async queryCommissionSelfDelegationRewards(
    validatorAddr: string
  ): Promise<GetDistributionBaseResponse> {
    const res = await this.client.get(
      `/distribution/validators/${validatorAddr}/rewards`
    );
    return res.data;
  }

  async withdrawValidatorsRewards(
    validatorAddr: string,
    body: ModuleBodyRequest
  ): Promise<ModulePostResponse> {
    const res = await this.client.post(
      `/distribution/validators/${validatorAddr}/rewards`,
      body
    );
    return res.data;
  }

  async getCommunnityPoolParameters(): Promise<GetDistributionBaseResponse> {
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

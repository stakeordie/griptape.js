import BlockchainModule from './base';
import { getConfig } from '../bootstrap';
import {
  Amount,
  ModuleBaseResponse,
  ModuleBodyRequest,
  ModulePostResponse,
} from './types';

export interface StakingBaseResult {
  delegator_address: string;
  validator_address: string;
  shares: string;
  balance: Amount;
}

export interface StakingBaseResponse extends ModuleBaseResponse {
  result: StakingBaseResult[];
}

export interface UnbondingDelegationsByDelegatorResponse
  extends ModuleBaseResponse {
  result: Array<{
    delegator_address: string;
    validator_address: string;
    initial_balance: string;
    balance: string;
    creation_height: number;
    min_time: number;
  }>;
}

export interface UbondingDelegationsDelegatorValidatorResponse
  extends ModuleBaseResponse {
  result: {
    delegator_address: string;
    validator_address: string;
    entries: Array<{
      initial_balance: string;
      balance: string;
      creation_height: string;
      min_time: string;
    }>;
  };
}

export interface StakingValidatorsResult {
  operator_address: string;
  consensus_pubkey: string;
  jailed: boolean;
  status: number;
  tokens: string;
  delegator_shares: string;
  description: {
    moniker: string;
    identity: string;
    website: string;
    security_contact: string;
    details: string;
  };
  bond_height: string;
  bond_intra_tx_counter: number;
  unbonding_height: string;
  unbonding_time: Date;
  commission: {
    rate: string;
    max_rate: string;
    max_change_rate: string;
    update_time: Date;
  };
}

export interface StakingValidatorsResponse extends ModuleBaseResponse {
  result: StakingValidatorsResult[];
}

export interface ValidatorInfoResponse extends ModuleBaseResponse {
  result: StakingValidatorsResult;
}

export interface CurrentStateOfStakingPoolResponse extends ModuleBaseResponse {
  result: {
    bonded_tokens: string;
    not_bonded_tokens: string;
  };
}

export interface CurrentStakingParameterValuesResponse
  extends ModuleBaseResponse {
  result: {
    bond_denom: string;
    historical_entries: number;
    max_entries: number;
    max_validators: number;
    unbonding_time: string;
  };
}
export interface submitDelegationRequest extends ModuleBodyRequest {
  delegator_address: string;
  validator_address: string;
  delegation: Amount;
}

export interface SubmitUnbondingDelegationRequest extends ModuleBodyRequest {
  delegator_address: string;
  validator_address: string;
  shares: string;
}

export interface SubmitRedelegationRequest extends ModuleBodyRequest {
  delegator_address: string;
  validator_src_addressess: string;
  validator_dst_address: string;
  shares: string;
}

export class StakingModule extends BlockchainModule {
  /**
   * Get all delegations from a delegator
   * @param {string} delegatorAddr - Bech32 AccAddress of Delegator
   * @returns StakingBaseResponse
   * */
  async getAllDelegationsByDelegator(
    delegatorAddr: string
  ): Promise<StakingBaseResponse> {
    const res = await this.client.get(
      `/staking/delegators/${delegatorAddr}/delegations`
    );
    return res.data;
  }

  /**
   * Query the current delegation between a delegator and a validator
   * @param {string} delegatorAddr - Bech32 AccAddress of Delegator
   * @param {string} validatorAddr - Bech32 OperatorAddress of validator
   * @returns StakingBaseResponse
   * */
  async queryCurrentDelegationBetweenDelegatorValidator(
    delegatorAddr: string,
    validatorAddr: string
  ): Promise<StakingBaseResponse> {
    const res = await this.client.get(
      `/staking/delegators/${delegatorAddr}/delegations/${validatorAddr}`
    );
    return res.data;
  }

  /**
   * Get all unbonding delegations from a delegator
   * @param {string} delegatorAddr - Bech32 AccAddress of Delegator
   * @returns UnbondingDelegationsByDelegatorResponse
   */
  async getAllUnbondingDelegationsByDelegator(
    delegatorAddr: string
  ): Promise<UnbondingDelegationsByDelegatorResponse> {
    const res = await this.client.get(
      `/staking/delegators/${delegatorAddr}/unbonding_delegations`
    );
    return res.data;
  }

  /**
   * Query all unbonding delegations between a delegator and a validator
   * @param {string} delegatorAddr - Bech32 AccAddress of Delegator
   * @param {string} validatorAddr - Bech32 OperatorAddress of validator
   * @returns UbondingDelegationsDelegatorValidatorResponse
   */
  async queryAllUbondingDelegationsBetweenDelegatorAndValidator(
    delegatorAddr: string,
    validatorAddr: string
  ): Promise<UbondingDelegationsDelegatorValidatorResponse> {
    const res = await this.client(
      `/staking/delegators/${delegatorAddr}/unbonding_delegations/${validatorAddr}`
    );
    return res.data;
  }

  /**
   * Query all validators that a delegator is bonded to
   * @param {string} delegatorAddr - Bech32 AccAddress of Delegator
   * @returns StakingValidatorsResponse
   */
  async queryAllValidatorsThatDelegatorIsBondedTo(
    delegatorAddr: string
  ): Promise<StakingValidatorsResponse> {
    const res = await this.client.get(
      `/staking/delegators/${delegatorAddr}/validators`
    );
    return res.data;
  }

  /**
   * Query a validator that a delegator is bonded to
   * @param {string} delegatorAddr - Bech32 AccAddress of Delegator
   * @param {string} validatorAddr - Bech32 OperatorAddress of validator
   * @returns ValidatorInfoResponse
   */
  async queryValidatorThatDelegatorIsBondedTo(
    delegatorAddr: string,
    validatorAddr: string
  ): Promise<ValidatorInfoResponse> {
    const res = await this.client(
      `/staking/delegators/${delegatorAddr}/validators/${validatorAddr}`
    );
    return res.data;
  }

  /**
   * Get all validator candidates. By default it returns only the bonded validators.
   * @returns StakingValidatorsResponse
   * */
  async stakingValidators(): Promise<StakingValidatorsResponse> {
    const res = await this.client(`/staking/validators`);
    return res.data;
  }

  /**
   * Query the information from a single validator
   * @param {string} validatorAddr - Bech32 OperatorAddress of validator
   * @returns ValidatorInfoResponse
   */
  async queryValidatorInfo(
    validatorAddr: string
  ): Promise<ValidatorInfoResponse> {
    const res = await this.client(`/staking/validators/${validatorAddr}`);
    return res.data;
  }

  /**
   * Get all delegations from a validator
   * @param {string} validatorAddr - Bech32 OperatorAddress of validator
   * @returns StakingBaseResponse
   */
  async gettAllDelegationsByValidator(
    validatorAddr: string
  ): Promise<StakingBaseResponse> {
    const res = await this.client(
      `/staking/validators/${validatorAddr}/delegations`
    );
    return res.data;
  }

  /**
   * Get the current state of the staking pool
   * @returns CurrentStateOfStakingPoolResponse
   * */
  async getCurrentStateOfStakingPool(): Promise<CurrentStateOfStakingPoolResponse> {
    const res = await this.client(`/staking/pool`);
    return res.data;
  }

  /**
   * Get the current staking parameter values
   * @returns CurrentStakingParameterValuesResponse
   * */
  async getCurrentStakingParameterValues(): Promise<CurrentStakingParameterValuesResponse> {
    const res = await this.client(`/staking/parameters`);
    return res.data;
  }

  async submitDelegation(
    delegatorAddr: string,
    body_request: submitDelegationRequest
  ): Promise<ModulePostResponse> {
    const res = await this.client.post(
      `/staking/delegators/${delegatorAddr}/delegations`,
      body_request
    );
    return res.data;
  }

  async submitUnbondingDelegation(
    delegatorAddr: string,
    body_request: SubmitUnbondingDelegationRequest
  ): Promise<ModulePostResponse> {
    const res = await this.client.post(
      `/staking/delegators/${delegatorAddr}/unbonding_delegations`,
      body_request
    );
    return res.data;
  }

  async submitRedelegation(
    delegatorAddr: string,
    body_request: SubmitRedelegationRequest
  ): Promise<ModulePostResponse> {
    const res = await this.client.post(
      `/staking/delegators/${delegatorAddr}/redelegations`,
      body_request
    );
    return res.data;
  }
}

//Add Staking module.
let stakingModule: StakingModule;

export function useStaking() {
  const config = getConfig();
  if (!config) throw new Error('Not Client available');
  if (!stakingModule) {
    stakingModule = new StakingModule(config.restUrl);
  }
  return stakingModule;
}

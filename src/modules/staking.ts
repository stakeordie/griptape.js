import BlockchainModule from './base';
import { getConfig } from '../bootstrap';

//Base Staking Response
export interface StakingBaseResponse {
  height: string;
}

//#region getAllDelegationsByDelegator
export interface GetAllDelegationsByDelegatorResult {
  delegator_address: string;
  validator_address: string;
  shares: string;
  balance: Balance;
}

export interface Balance {
  denom: string;
  amount: string;
}

export interface GetAllDelegationsByDelegatorResponse
  extends StakingBaseResponse {
  result: GetAllDelegationsByDelegatorResult[];
}

//#endregion

//#region queryCurrentDelegation BetweenDelegatorValidator
export interface QueryCurrentDelegationBetweenDelegatorValidatorResult {
  delegator_address: string;
  validator_address: string;
  shares: string;
  balance: Balance;
}

export interface Balance {
  denom: string;
  amount: string;
}

export interface QueryCurrentDelegationBetweenDelegatorValidatorResponse
  extends StakingBaseResponse {
  result: QueryCurrentDelegationBetweenDelegatorValidatorResult;
}

//#endregion

//#region getAllUnbondingDelegationsByDelegator

export interface GetAllUnbondingDelegationsByDelegatorResult {
  delegator_address: string;
  validator_address: string;
  initial_balance: string;
  balance: string;
  creation_height: number;
  min_time: number;
}

export interface GetAllUnbondingDelegationsByDelegatorResponse
  extends StakingBaseResponse {
  result: GetAllUnbondingDelegationsByDelegatorResult[];
}

//#endregion

//#region queryAllUbondingDelegationsBetweenDelegatorAndValidator
export interface QueryAllUbondingDelegationsBetweenDelegatorAndValidatorResult {
  delegator_address: string;
  validator_address: string;
  entries: Entry[];
}
export interface Entry {
  initial_balance: string;
  balance: string;
  creation_height: string;
  min_time: string;
}

export interface QueryAllUbondingDelegationsBetweenDelegatorAndValidatorResponse
  extends StakingBaseResponse {
  result: QueryAllUbondingDelegationsBetweenDelegatorAndValidatorResult;
}

//#endregion

//#region  queryAllValidatorsThatDelegatorIsBondedTo
export interface QueryAllValidatorsThatDelegatorIsBondedToResult {
  operator_address: string;
  consensus_pubkey: string;
  jailed: boolean;
  status: number;
  tokens: string;
  delegator_shares: string;
  description: Description;
  bond_height: string;
  bond_intra_tx_counter: number;
  unbonding_height: string;
  unbonding_time: Date;
  commission: Commission;
}

export interface Commission {
  rate: string;
  max_rate: string;
  max_change_rate: string;
  update_time: Date;
}

export interface Description {
  moniker: string;
  identity: string;
  website: string;
  security_contact: string;
  details: string;
}

export interface QueryAllValidatorsThatDelegatorIsBondedToResponse
  extends StakingBaseResponse {
  result: QueryAllValidatorsThatDelegatorIsBondedToResult[];
}

//#endregion

//#region queryValidatorThatDelegatorIsBondedTo
export interface QueryValidatorThatDelegatorIsBondedToResult {
  operator_address: string;
  consensus_pubkey: string;
  jailed: boolean;
  status: number;
  tokens: string;
  delegator_shares: string;
  description: Description;
  bond_height: string;
  bond_intra_tx_counter: number;
  unbonding_height: string;
  unbonding_time: Date;
  commission: Commission;
}

export interface Commission {
  rate: string;
  max_rate: string;
  max_change_rate: string;
  update_time: Date;
}

export interface Description {
  moniker: string;
  identity: string;
  website: string;
  security_contact: string;
  details: string;
}

export interface QueryValidatorThatDelegatorIsBondedToResponse
  extends StakingBaseResponse {
  result: QueryValidatorThatDelegatorIsBondedToResult;
}
//#endregion

//#region stakingValidators
export interface StakingValidatorsResult {
  operator_address: string;
  consensus_pubkey: string;
  jailed: boolean;
  status: number;
  tokens: string;
  delegator_shares: string;
  description: Description;
  bond_height: string;
  bond_intra_tx_counter: number;
  unbonding_height: string;
  unbonding_time: Date;
  commission: Commission;
}

export interface Commission {
  rate: string;
  max_rate: string;
  max_change_rate: string;
  update_time: Date;
}

export interface Description {
  moniker: string;
  identity: string;
  website: string;
  security_contact: string;
  details: string;
}

export interface StakingValidatorsResponse extends StakingBaseResponse {
  result: StakingValidatorsResult[];
}

//#endregion

//#region queryValidatorInfo
export interface QueryValidatorInfoResult {
  operator_address: string;
  consensus_pubkey: string;
  jailed: boolean;
  status: number;
  tokens: string;
  delegator_shares: string;
  description: Description;
  bond_height: string;
  bond_intra_tx_counter: number;
  unbonding_height: string;
  unbonding_time: Date;
  commission: Commission;
}

export interface Commission {
  rate: string;
  max_rate: string;
  max_change_rate: string;
  update_time: Date;
}

export interface Description {
  moniker: string;
  identity: string;
  website: string;
  security_contact: string;
  details: string;
}

export interface QueryValidatorInfoResponse extends StakingBaseResponse {
  result: QueryValidatorInfoResult;
}

//#endregion

//#region gettAllDelegationsByValidator
export interface GettAllDelegationsByValidatorResult {
  delegator_address: string;
  validator_address: string;
  shares: string;
  balance: Balance;
}

export interface Balance {
  denom: string;
  amount: string;
}

export interface GettAllDelegationsByValidatorResponse
  extends StakingBaseResponse {
  result: GettAllDelegationsByValidatorResult[];
}

//#endregion

//#region getCurrentStateOfStakingPool
export interface GetCurrentStateOfStakingPoolResult {
  bonded_tokens: string;
  not_bonded_tokens: string;
}

export interface GetCurrentStateOfStakingPoolResponse
  extends StakingBaseResponse {
  result: GetCurrentStateOfStakingPoolResult;
}
//#endregion

//#region getCurrentStakingParameterValues
export interface GetCurrentStakingParameterValuesResult {
  bond_denom: string;
  historical_entries: number;
  max_entries: number;
  max_validators: number;
  unbonding_time: string;
}

export interface GetCurrentStakingParameterValuesResponse
  extends StakingBaseResponse {
  result: GetCurrentStakingParameterValuesResult;
}

//#endregion

//#region submitDelegation

//Request
export interface SubmitDelegationRequest {
  msg: string[];
  fee: Fee;
  memo: string;
  signatures: Signature[];
}

export interface Fee {
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

//Response
export interface SubmitDelegationResponse {
  msg: string[];
  fee: Fee;
  memo: string;
  signatures: Signature[];
}

export interface Fee {
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
//#endregion

//#region submitUnbondingDelegation

//Request
export interface SubmitUnbondingDelegationRequest {
  base_req: BaseReq;
  delegator_address: string;
  validator_address: string;
  shares: string;
}

export interface BaseReq {
  from: string;
  memo: string;
  chain_id: string;
  account_number: string;
  sequence: string;
  gas: string;
  gas_adjustment: string;
  fees: FeeRequest[];
  simulate: boolean;
}

export interface FeeRequest {
  denom: string;
  amount: string;
}

//Response
export interface SubmitUnbondingDelegationResponse {
  base_req: BaseReq;
  delegator_address: string;
  validator_address: string;
  shares: string;
}

export interface BaseReq {
  from: string;
  memo: string;
  chain_id: string;
  account_number: string;
  sequence: string;
  gas: string;
  gas_adjustment: string;
  fees: FeeRequest[];
  simulate: boolean;
}

//#endregion

//#region submitRedelegation

//Request
export interface SubmitRedelegationRequest {
  base_req: BaseReq;
  delegator_address: string;
  validator_src_addressess: string;
  validator_dst_address: string;
  shares: string;
}

export interface BaseReq {
  from: string;
  memo: string;
  chain_id: string;
  account_number: string;
  sequence: string;
  gas: string;
  gas_adjustment: string;
  fees: FeeRequest[];
  simulate: boolean;
}

//Response
export interface SubmitRedelegationResponse {
  msg: string[];
  fee: Fee;
  memo: string;
  signatures: Signature[];
}

export interface Fee {
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
//#endregion

//StakingError
export interface StakingError {
  error: string;
}

export class StakingModule extends BlockchainModule {
  async getAllDelegationsByDelegator(
    delegatorAddr: string
    /**
     * @param {string} delegatorAddr - Bech32 AccAddress of Delegator
     */
  ): Promise<GetAllDelegationsByDelegatorResponse> {
    const res = await this.client.get(
      `/staking/delegators/${delegatorAddr}/delegations`
    );
    return res.data;
    /**
     * Get all delegations from a delegator
     * @returns getAllDelegationsByDelegatorResponse
     * */
  }

  async queryCurrentDelegationBetweenDelegatorValidator(
    delegatorAddr: string,
    validatorAddr: string
    /**
     * @param {string} delegatorAddr - Bech32 AccAddress of Delegator
     * @param {string} validatorAddr - Bech32 OperatorAddress of validator
     */
  ): Promise<QueryCurrentDelegationBetweenDelegatorValidatorResponse> {
    const res = await this.client.get(
      `/staking/delegators/${delegatorAddr}/delegations/${validatorAddr}`
    );
    return res.data;
    /**
     * Query the current delegation between a delegator and a validator
     * @returns QueryCurrentDelegationBetweenDelegatorValidatorResponse
     * */
  }

  async getAllUnbondingDelegationsByDelegator(
    delegatorAddr: string
    /**
     * @param {string} delegatorAddr - Bech32 AccAddress of Delegator
     */
  ): Promise<GetAllUnbondingDelegationsByDelegatorResponse> {
    const res = await this.client.get(
      `/staking/delegators/${delegatorAddr}/unbonding_delegations`
    );
    return res.data;
    /**
     * Get all unbonding delegations from a delegator
     * @returns GetAllUnbondingDelegationsByDelegatorResponse
     * */
  }

  async queryAllUbondingDelegationsBetweenDelegatorAndValidator(
    delegatorAddr: string,
    validatorAddr: string
    /**
     * @param {string} delegatorAddr - Bech32 AccAddress of Delegator
     * @param {string} validatorAddr - Bech32 OperatorAddress of validator
     */
  ): Promise<QueryAllUbondingDelegationsBetweenDelegatorAndValidatorResponse> {
    const res = await this.client(
      `/staking/delegators/${delegatorAddr}/unbonding_delegations/${validatorAddr}`
    );
    return res.data;
    /**
     * Query all unbonding delegations between a delegator and a validator
     * @returns QueryAllUbondingDelegationsBetweenDelegatorAndValidatorResponse
     * */
  }

  async queryAllValidatorsThatDelegatorIsBondedTo(
    delegatorAddr: string
    /**
     * @param {string} delegatorAddr - Bech32 AccAddress of Delegator
     */
  ): Promise<QueryAllValidatorsThatDelegatorIsBondedToResponse> {
    const res = await this.client.get(
      `/staking/delegators/${delegatorAddr}/validators`
    );
    return res.data;
    /**
     * Query all validators that a delegator is bonded to
     * @returns QueryAllValidatorsThatDelegatorIsBondedToResponse
     * */
  }

  async queryValidatorThatDelegatorIsBondedTo(
    delegatorAddr: string,
    validatorAddr: string
    /**
     * @param {string} delegatorAddr - Bech32 AccAddress of Delegator
     * @param {string} validatorAddr - Bech32 OperatorAddress of validator
     */
  ): Promise<QueryValidatorThatDelegatorIsBondedToResponse> {
    const res = await this.client(
      `/staking/delegators/${delegatorAddr}/validators/${validatorAddr}`
    );
    return res.data;
    /**
     * Query a validator that a delegator is bonded to
     * @returns QueryValidatorThatDelegatorIsBondedToResponse
     * */
  }

  async stakingValidators(): Promise<StakingValidatorsResponse> {
    const res = await this.client(`/staking/validators`);
    return res.data;
    /**
     * Get all validator candidates. By default it returns only the bonded validators.
     * @returns StakingValidatorsResponse
     * */
  }

  async queryValidatorInfo(
    validatorAddr: string
    /**
     * @param {string} validatorAddr - Bech32 OperatorAddress of validator
     */
  ): Promise<QueryValidatorInfoResponse> {
    const res = await this.client(`/staking/validators/${validatorAddr}`);
    return res.data;
    /**
     * Query the information from a single validator
     * @returns QueryValidatorInfoResponse
     * */
  }

  async gettAllDelegationsByValidator(
    validatorAddr: string
    /**
     * @param {string} validatorAddr - Bech32 OperatorAddress of validator
     */
  ): Promise<GettAllDelegationsByValidatorResponse> {
    const res = await this.client(
      `/staking/validators/${validatorAddr}/delegations`
    );
    return res.data;
    /**
     * Get all delegations from a validator
     * @returns GettAllDelegationsByValidatorResponse
     * */
  }

  async getCurrentStateOfStakingPool(): Promise<GetCurrentStateOfStakingPoolResponse> {
    const res = await this.client(`/staking/pool`);
    return res.data;
    /**
     * Get the current state of the staking pool
     * @returns GetCurrentStateOfStakingPoolResponse
     * */
  }

  async getCurrentStakingParameterValues(): Promise<GetCurrentStakingParameterValuesResponse> {
    const res = await this.client(`/staking/parameters`);
    return res.data;
    /**
     * Get the current staking parameter values
     * @returns GetCurrentStakingParameterValuesResponse
     * */
  }

  async submitDelegation(
    delegatorAddr: string,
    body_request: SubmitDelegationRequest
  ): Promise<SubmitDelegationResponse> {
    const res = await this.client.post(
      `/staking/delegators/${delegatorAddr}/delegations`,
      body_request
    );
    return res.data;
    /**
     * Submit delegation
     * @returns SubmitDelegationResponse
     * */
  }

  async submitUnbondingDelegation(
    delegatorAddr: string,
    body_request: SubmitUnbondingDelegationRequest
  ): Promise<SubmitUnbondingDelegationResponse> {
    const res = await this.client.post(
      `/staking/delegators/${delegatorAddr}/unbonding_delegations`,
      body_request
    );
    return res.data;
  }

  async submitRedelegation(
    delegatorAddr: string,
    body_request: SubmitRedelegationRequest
  ): Promise<SubmitRedelegationResponse> {
    const res = await this.client.post(
      `/staking/delegators/${delegatorAddr}/unbonding_delegations`,
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

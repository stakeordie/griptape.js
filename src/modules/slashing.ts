import { getConfig } from '../bootstrap';
import BlockchainModule from './base';
import { Fee, Signature } from './types';

/**
 * @member {string} height indicates the current block in the chain
 */
export interface SlashingBaseResponse {
  /** indicates the current block in the chain */
  height: string;
}

/**
 * @member {string} height indicates the current block in the chain
 * @member { ParametersResult } result is an array of SlashingResult
 */
export interface SlashingSigningInfoResponse extends SlashingBaseResponse {
  /**is an array of SlashingResult objects */
  result: SlashingSigninInfoResult[];
}

/**
 * @member {string} height indicates the current block in the chain
 * @member {string} result is a SlashingParametersResult object
 */
export interface SlashingParametersResponse extends SlashingBaseResponse {
  /** is a string representation of the result  */
  result: SlashingParametersResult;
}

/**Object definition for a element in 'signing_infos' response */
export interface SlashingSigninInfoResult {
  address: string;
  start_height: string;
  index_offset: string;
  jailed_until: Date;
  tombstoned: boolean;
  missed_blocks_counter: string;
}

/**Object definiton for 'parameters' reponse */
export interface SlashingParametersResult {
  signed_blocks_window: string;
  min_signed_per_window: string;
  downtime_jail_duration: string;
  slash_fraction_double_sign: string;
  slash_fraction_downtime: string;
}

export interface UnJailValidatorRequest {
  base_req: SlashingBaseReq;
}

export interface SlashingBaseReq {
  from: string;
  chain_id: string;
  msg: string[];
  fee: Fee;
  memo: string;
  signatures: Signature[];
}

export interface UnJailedValidatorResponse {
  msg: string[];
  fee: Fee;
  memo: string;
  signatures: Signature[];
}

export interface SlashingError {
  error: string;
}

export class SlashingModule extends BlockchainModule {
  /**
   * Get sign info of given all validators
   *
   * @returns a SlashingSigningInfoResponse object
   */
  async getSigningInfo(
    page: number = 1,
    limit: number = 5
  ): Promise<SlashingSigningInfoResponse> {
    const res = await this.client.get(
      `/slashing/signing_infos?page=${page}&limit=${limit}`
    );
    return res.data;
  }

  /**
   * Get the current slashing parameters
   *
   * @returns a SlashingParametersResponse object
   */
  async getParameters(): Promise<SlashingParametersResponse> {
    const res = await this.client.get('/slashing/parameters');
    return res.data;
  }

  /**
   * UnJail a jailed validator
   *
   * @returns returns a UnJailedValidatorResponse or SlashingError object
   */
  async unJailValidator(
    validatorAddr: string,
    base_req: UnJailValidatorRequest
  ): Promise<UnJailedValidatorResponse | SlashingError> {
    const res = await this.client.post(
      `/slashing/validators/${validatorAddr}/unjail`,
      base_req
    );
    return res.data;
  }
}

// Add supply module.
let slashingModule: SlashingModule;

export function useSlashing() {
  const config = getConfig();
  if (!config) throw new Error('No client available');
  if (!slashingModule) {
    slashingModule = new SlashingModule(config.restUrl);
  }
  return slashingModule;
}

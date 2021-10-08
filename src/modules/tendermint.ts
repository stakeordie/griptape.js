import { getConfig } from '../bootstrap';
import BlockchainModule from './base';
import { ModuleBaseResponse, Validator } from './types';

//Syncing
export interface SyncingResponse {
  syncing: boolean;
}

//#region getLatestBlock
//getLatestBlock
export interface GetLatestBlockResponse {
  block_id: BlockID;
  block: Block;
}
//#endregion

//#region getBlockByHeight
export interface GetBlockByHeightResponse {
  block_id: BlockID;
  block: Block;
}

export interface BlockID {
  hash: string;
  parts: Parts;
}

export interface Parts {
  total: string;
  hash: string;
}
export interface Block {
  header: Header;
  data: Data;
  evidence: Evidence;
  last_commit: LastCommit;
}

export interface Data {
  txs: string;
}

export interface Evidence {
  evidence: string;
}

export interface Header {
  version: Version;
  chain_id: string;
  height: string;
  time: Date;
  last_block_id: BlockID;
  last_commit_hash: string;
  data_hash: string;
  validators_hash: string;
  next_validators_hash: string;
  consensus_hash: string;
  app_hash: string;
  last_results_hash: string;
  evidence_hash: string;
  proposer_address: string;
}
export interface Version {
  block: string;
  app: string;
}

export interface LastCommit {
  height: string;
  round: string;
  block_id: BlockID;
  signatures: Signature[];
}

export interface Signature {
  block_id_flag: number;
  validator_address: string;
  timestamp: Date;
  signature: string;
}

//#endregion

//#region getLatestValidatorSet
export interface GetLatestValidatorSetResult {
  block_height: string;
  validators: Validator[];
}

export interface GetLatestValidatorSetResponse extends ModuleBaseResponse {
  result: GetLatestValidatorSetResult;
}

//#endregion

//#region getValidatorSetCertainHeight
export interface GetValidatorSetCertainHeightRequest {
  block_height: string;
  validators: Validator[];
}
export interface GetValidatorSetCertainHeightResponse
  extends ModuleBaseResponse {
  result: GetValidatorSetCertainHeightRequest;
}
//#endregion

export class TendermintModule extends BlockchainModule {
  /**
   * Syncing state of node: Get if the node is currently syning with other nodes
   * @returns TendermintResponse
   * */
  async syncing(): Promise<SyncingResponse> {
    const res = await this.client(`/syncing`);
    return res.data;
  }

  /**
   * Get the latest block
   * @returns GetLatestBlockResponse
   * */
  async getLatestBlock(): Promise<GetLatestBlockResponse> {
    const res = await this.client(`blocks/latest`);
    return res.data;
  }

  /**
   *Get a block at a certain height
   * @param {number} height -indicates the current block in the chain
   * @returns GetLatestBlockResponse
   * */
  async getBlockByHeight(height: number): Promise<GetBlockByHeightResponse> {
    const res = await this.client(`blocks/${height}`);
    return res.data;
  }

  /**
   *Get the latest validator set
   * @returns GetLatestValidatorSetResponse
   * */
  async getLatestValidatorSet(): Promise<GetLatestValidatorSetResponse> {
    const res = await this.client(`/validatorsets/latest`);
    return res.data;
  }

  /**
   *Get a validator set a certain height
   * @param {number} height - indicates the current block in the chain
   * @returns GetValidatorSetCertainHeightResponse
   * */
  async getValidatorSetCertainHeight(
    height: number
  ): Promise<GetValidatorSetCertainHeightResponse> {
    const res = await this.client(`validatorsets/${height}`);
    return res.data;
  }
}

//Add tenermint module

let tendermintModule: TendermintModule;

export function useTendermint() {
  const config = getConfig();
  if (!config) throw new Error('No Client Available');
  if (!tendermintModule) {
    tendermintModule = new TendermintModule(config.restUrl);
  }
  return tendermintModule;
}

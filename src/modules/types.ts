export interface ProposalParamChangeRequest {
  base_req: BaseReq;
  title: string;
  description: string;
  proposer: string;
  deposit: Deposit[];
  changes: Change[];
}

export interface BaseReq {
  from: string;
  memo: string;
  chain_id: string;
  account_number: string;
  sequence: string;
  gas: string;
  gas_adjustment: string;
  fees: Deposit[];
  simulate: boolean;
}

export interface Deposit {
  denom: string;
  amount: string;
}

export interface Change {
  subspace: string;
  key: string;
  subkey: string;
  value: Value;
}

export interface Value {}

export interface ProposalParamChangeResponse {
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

export interface Validator {
  address: string;
  pub_key: string;
  voting_power: string;
  proposer_priority: string;
}

//Common module types

export interface ModuleBaseResponse {
  /** Current block in the chain */
  height: string;
}

export interface ModuleSimpleResponse extends ModuleBaseResponse {
  result: string;
}

export interface ModuleErrorResponse {
  error: string;
}

export interface ModulePostResponse {
  msg: string[];
  fee: Fee;
  memo: string;
  signatures: Signature[];
}
export interface ModuleBodyRequest {
  base_req: BaseReq;
}

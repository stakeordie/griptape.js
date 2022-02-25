export interface Key {
  id: string;
  contractAddress: string;
  value: string;
}

export interface Permit {
  id: string;
  contractAddress: string;
  permit: object;
}

export interface PermitForm {
  id: string;
  contractAddress: string;
  permit: object;
}

export interface Account {
  address: string;
  keys: Array<Key>;
  permits: Array<Permit>;
}

export interface KeyForm {
  id: string;
  contractAddress: string;
  key: string;
}

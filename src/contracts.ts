import { assert } from './utils/assertions'
import {
  Griptape,
  ContractDefinition,
  ContractBaseDefinition
} from './types'
import { ScrtClient, generateEntropyString } from './scrt'

async function createViewingKey(): Promise<string> {
  const entropy = generateEntropyString(27)
  const handleMsg = { 'create_viewing_key': { entropy } }
  const response =
    await this.scrtClient.executeContract(this.contractAddress, handleMsg)
  const { 'create_viewing_key': { key } } = response
  return key
}

async function getBalance(address: string, key: string): Promise<void> {
  const queryMsg = { balance: { address, key } }
  try {
    const response =
      await this.scrtClient.queryContract(this.contractAddress, queryMsg)
    const { balance: { amount } } = response
    this.balance = amount
  } catch (e) {
    this.balance = '0'
  }
}

export function defineContract(
  contractAddress: string,
  contractBaseDef: ContractBaseDefinition
): ContractDefinition {
  return {
    spec: 'base',
    contractAddress,
    ...contractBaseDef
  }
}

export function defineSnip20Contract(
  contractAddress: string,
  contractBaseDef?: ContractBaseDefinition): ContractDefinition {

  // Base state
  const state = {
    balance: '0'
  }

  // Base messages
  const messages = {
    createViewingKey
  }

  // Base queries
  const queries = {
    getBalance
  }

  const contractDef: ContractDefinition = {
    spec: 'snip-20',
    contractAddress,
    state,
    messages,
    queries
  }

  if (contractBaseDef) {

    const {
      state: newState,
      messages: newMessages,
      queries: newQueries
    } = contractBaseDef

    contractDef.state = {
      ...state,
      ...newState
    }

    contractDef.messages = {
      ...messages,
      ...newMessages
    }

    contractDef.queries = {
      ...queries,
      ...newQueries
    }
  }

  return contractDef
}

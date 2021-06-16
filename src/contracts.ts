import { assert } from './utils/assertions'
import {
  Griptape,
  ContractDefinition,
  ContractBaseDefinition
} from './types'
import { ScrtClient, generateEntropyString } from './wsecretjs'

async function createViewingKey(): Promise<object> {
  const entropy = generateEntropyString(27)
  const handleMsg = { 'create_viewing_key': { entropy } }
  const response =
    await this.scrtClient.executeContract(this.contractAddress, handleMsg)
  return response
}

async function getBalance(address: string, key: string): Promise<void> {
  const queryMsg = { balance: { address, key } }
  try {
    const response =
      await this.scrtClient.queryContract(this.contractAddress, queryMsg)
    const { balance: { amount } } = response
    this.balance = amount
  } catch (e) {
    this.balance = ''
  }
}

export function defineContract(
  contractAddress: string,
  contractBaseDef: ContractBaseDefinition
): ContractDefinition {
  const messages = {
    ...contractBaseDef.messages,
    createViewingKey
  }
  contractBaseDef.messages = messages
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
    balance: ''
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

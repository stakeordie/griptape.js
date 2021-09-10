import { BaseContractProps, ContractError } from './types';

const { KeplrRejected, OutOfGas } = ContractError;

const errorHandlers: Record<string, Record<ContractError, () => void>> = {};

export function onContractError(
  contract: BaseContractProps,
  error: ContractError | string,
  callback: () => void
) {
  const handler: any = {};
  handler[error] = callback;
  errorHandlers[contract.id] = handler;
}

export function handleError(
  contract: BaseContractProps,
  e: any
): (() => void) | undefined {
  let result;

  const handler = errorHandlers[contract.id];
  const msg = e.toString();
  if (msg.match(/Error: Request rejected/gi)) {
    result = handler[KeplrRejected];
  } else if (msg.match(/insufficient fee/gi)) {
    result = handler[OutOfGas];
  }

  return result;
}

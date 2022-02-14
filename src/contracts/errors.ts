import { BaseContractProps, ErrorHandler } from './types';

export class OutOfGasErrorHandler extends ErrorHandler {
  constructor(handler: () => void) {
    super(e => e.toString().match(/insufficient fee/g), handler);
  }
}

export class DefaultErrorHandler extends ErrorHandler {
  constructor(handler: () => void) {
    super(e => true, handler);
  }
}
export class BaseError {
  readonly message: string;

  cause: string | undefined;

  constructor(msg: string, opt?: { cause: string }) {
    this.message = msg;
    this.cause = opt?.cause;
  }

  toString() {
    return this.message;
  }
}
const errorHandlers: Record<string, ErrorHandler[]> = {};

export function onContractError(
  contract: BaseContractProps,
  handler: ErrorHandler
) {
  const { id: contractId } = contract;
  const currentContracts = Object.keys(errorHandlers);
  if (!currentContracts.includes(contractId)) {
    errorHandlers[contractId] = [];
  }
  const handlers = errorHandlers[contractId];
  const hasHandler = handlers.find(
    it => it.constructor.name === handler.constructor.name
  );
  if (!hasHandler) {
    errorHandlers[contractId].push(handler);
  }
}

export function getErrorHandler(id: string, e: any): ErrorHandler | undefined {
  return errorHandlers[id]?.find(it => it.test(e));
}

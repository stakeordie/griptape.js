import {
  SigningCosmWasmClient,
  CosmWasmClient,
  Secp256k1Pen,
  pubkeyToAddress,
  encodeSecp256k1Pubkey,
  makeSignBytes,
} from "secretjs";

import { Bip39, Random } from "@iov/crypto";

// Default fees to be used when no fees are specified for the transaction
const defaultFees = {
  init: {
    amount: [{ amount: '300000', denom: 'uscrt' }],
    gas: '300000',
  },
  exec: {
    amount: [{ amount: '200000', denom: 'uscrt' }],
    gas: '1000000',
  },
};

export default class SecretJsClient {

  constructor(secretRestUrl, wallet) {
    this.secretRestUrl = secretRestUrl;
    this.wallet = wallet;
    this.client = new CosmWasmClient(this.secretRestUrl);
  }

  async getAccount(address) {
    // If address is undefined it retrieves the balance of
    // the selected account in the wallet
    if (address === undefined) {
      address = this.wallet.address;
    }

    return await this.client.getAccount(address);
  }

  async queryContract(address, query) {
    return await this.client.queryContractSmart(address, query);
  }

  async decryptTxHash(txHash) {
    const query = { id: txHash };
    return await this.client.searchTx(query);
    //secretcli q tx ${txHash}
  }

  async decryptTxResponse(response) {
    return await this.client.restClient.decryptTxsResponse(response);
  }

  async sendTokens(payment) {
    if (payment.type == "SCRT") {
      const chainId = await this.getChainId();
      const fees = defaultFees
      try {
        await window.keplr.enable(chainId);

        this.signingClient = new SigningCosmWasmClient(
          this.secretRestUrl,
          this.wallet.address,
          this.wallet.getSigner(),
          this.wallet.getSeed(),
          fees
        );

        const response = await this.signingClient.sendTokens(payment.recipient, [{ amount: payment.amount, denom: "uscrt" }], payment.memo);
        const query = { id: response.transactionHash }
        const tx = await this.client.searchTx(query)
      } catch (error) {
      }
    } else {
      const msg = {
        "send": {
          "recipient": payment.recipient,
          "amount": payment.amount
        }
      };
      const response = await this.executeContract(payment.tokenAddress, msg);
      return JSON.parse(new TextDecoder("utf-8").decode(response.data));
    }
  }

  async mintTokens(mint) {
    //secretcli tx compute execute secret16v7a5lhuglkp5szdkfdxwhgkg3g2t2hmmy92h4 '{"mint": { "recipient": "secret1u64kcphxpt9lmeppz9xgk9tkjpxcrt60hylgzm", "amount": "500", "address": "secret10uc40qc5rjkh6zhu8dyqheetejyevukzkkecvs"}}' --from testwalleta
    const msg = {
      "mint": {
        "recipient": mint.recipient,
        "address": mint.recipient,
        "amount": mint.amount.toString()
      }
    };
    return await this.executeContract(mint.tokenAddress, msg);
  }

  async executeContract(address, handleMsg, fees = defaultFees) {
    const chainId = await this.getChainId();
    try {
      await window.keplr.enable(chainId);


      this.signingClient = new SigningCosmWasmClient(
        this.secretRestUrl,
        this.wallet.address,
        this.wallet.getSigner(),
        this.wallet.getSeed(),
        fees
      );
      const response = await this.signingClient.execute(address, handleMsg);
      return this.handleResponse(response); //THIS SHOULD BE REFACTORED EVENTUALLY
    } catch (err) {
      return this.handleResponse(err); //THIS SHOULD BE REFACTORED EVENTUALLY
      //throw err;
    }
  }

  async getContract(address) {
    const contract = await this.client.getContract(address);
    return contract;
  }

  async getContractHash(address) {
    return await this.client.restClient.getCodeHashByContractAddr(address);
  }

  async listContracts(codeId) {
    return await this.client.getContracts(codeId);
  }

  // General chain section

  async getChainId() {
    return await this.client.getChainId();
  }

  async getHeight() {
    return await this.client.getHeight();
  }

  async getNodeInfo() {
    return await this.client.restClient.nodeInfo();
  }

  async getLatestBlocks() {
    return await this.client.restClient.blocksLatest();
  }

  async getBlock(number) {
    return await this.client.restClient.blocks(number);
  }



  // Utilities section

  getRandomMnemonic() {
    return Bip39.encode(Random.getBytes(16)).toString();
  }

  decodedResponse(response) {
    try {
      return JSON.parse(new TextDecoder("utf-8").decode(response.data));
    } catch (e) {
      return "Decode Error"
    }
  }

  handleResponse(response) {
    let result;
    try {
      result = JSON.parse(response.logs[0].events.find(event => event.type === "wasm").attributes.find(attribute => attribute.key.indexOf("response") > -1).value.replace(/\\/g, ""));
      if (response.logs[0].events.find(event => event.type === "wasm").attributes.find(attribute => attribute.key.indexOf("auction_address") > -1)) {
        result.auctionAddress = response.logs[0].events.find(event => event.type === "wasm").attributes.find(attribute => attribute.key.indexOf("auction_address") > -1).value.replace(/\s/g, "")
      }
      for (const prop in result) {
        if (result[prop].status == "Failure") {
          response = {};
          response.message = result[prop].message;
          throw new SyntaxError("");
        }
      }
      // if(logKey) {
      //   result[logKey] = JSON.parse(response.logs[0].events.find(event => event.type === "wasm").attributes.find(attribute => attribute.key.indexOf(logKey) > -1).value.replace(/\\/g, ""));
      // }
    } catch (e) {
      try {
        result = JSON.parse(new TextDecoder("utf-8").decode(response.data));
      } catch (e) {
        let errorMessage = "";
        switch (true) {
          case /unknown variant/.test(response.message):
            errorMessage = "Bad tx send to chain";
            break;
          case /Auction has ended. Bid tokens have been returned/.test(response.message):
            errorMessage = "Auction has ended. Bid tokens have been returned";
            break;
          case /insufficient funds to pay for fees;/.test(response.message):
            errorMessage = "Not enough SCRT to pay for fees.";
            break;
          case /insufficient funds:/.test(response.message):
            errorMessage = "Insufficient Funds.";
            break;
          case /contract account already exists:/.test(response.message):
            errorMessage = "Auction has already been created";
            break;
          case /uatom required:/.test(response.message):
            errorMessage = "Keplr tried to pay gas in uatom instead of uscrt. Sometimes this can happen when you select gas-price too fast. Take it a little slower :)"
            break;
          case /Sell contract and bid contract must be different/.test(response.message):
            errorMessage = "You cannot have an auction in which you sell and ask for the same token. Please make them different and try again."
            break;
          case /New bid is the same as previous bid/.test(response.message):
            errorMessage = "You already have a bid for this amount."
            break;
          case /Could not establish connection. Receiving end does not exist./.test(response.message):
          case /Request failed with status code 502/.test(response.message):
            errorMessage = "Connection Error. Please refresh the page and try again."
          default:
            errorMessage = response.message;
        }
        return { "error": errorMessage };
      }
    }
    //check if error
    return result;
  }


}

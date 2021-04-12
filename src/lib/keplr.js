const KEPLR_ADDRESS_REFRESH_RATE = 1000;

// Keplr is the first implementation of an offline wallet compatible with
// Stake or Die! javascript stack
//
// This class describes the wallet specification and this would be adjusted
// when other wallets are integrated, i.e. Metamask
// 
// Wallet's functions are: 
// - constructor(chainId, chainName, restUrl, rpcUrl, loadListener)
// - async enable
// - async checkAddressUpdates()
// - async getSelectedKey()         <--- should this be renamed?
// -       getSigner()
// -       getSeed()
// - async suggestExperimental()
//
export default class Keplr {

  constructor(chainId, chainName, restUrl, rpcUrl, loadListener) {
    this.chainId = chainId;
    this.chainName = chainName;
    this.restUrl = restUrl;
    this.rpcUrl = rpcUrl;

    this.address = null;

    if (process.isClient) {
      window.onload = (async () => {
        if (typeof loadListener === 'function') {
          await loadListener();
        }
        await this.checkAddressUpdates();
        if (this.address) {
          this.checkInterval = setInterval(() => {
            this.checkAddressUpdates();
          }, KEPLR_ADDRESS_REFRESH_RATE);
        }
      });
    }
  }

  // Prompts the user to enable the wallet
  // access to their accounts in the specified network.
  async enable() {
    return await this.command(async () => {
      try {
        await window.keplr.enable(this.chainId);
      } catch {
        throw "Keplr rejected the connection";
      }
    });
    if (!this.checkInterval) {
      this.checkInterval = setInterval(() => {
        this.checkAddressUpdates();
      }, KEPLR_ADDRESS_REFRESH_RATE);
    }
  }

  async checkAddressUpdates() {
    return await this.command(async () => {
      try {
        const newAddress = (await this.getSigner().getAccounts())[0].address;
        if (this.address != newAddress && typeof this.onAddressChanged === 'function') {
          this.address = newAddress;
          this.onAddressChanged(this.address);
        }
      } catch (err) {
        this.address = null;
      }
    });
  }

  // Returns the selected key using Keplr's getKey() method
  // Otherwise it returns null
  async getSelectedKey() {
    return await this.command(async () => {
      try {
        return await window.keplr.getKey(this.chainId);
      } catch (err) {
        throw err;
      }
    });
  }

  async suggestToken(contractAddress) {
    return await this.command(async () => {
      try {
        return await window.keplr.suggestToken(this.chainId, contractAddress);
      } catch (err) {
        throw err;
      }
    })
  }

  async getSecret20ViewingKey(contractAddress) {
    return await this.command(async () => {
      try {
        return await window.keplr.getSecret20ViewingKey(this.chainId, contractAddress);
      } catch (err) {
        throw err;
      }
    })
  }

  getSigner() {
    return window.getOfflineSigner(this.chainId);
  }

  getSeed() {
    return window.getEnigmaUtils(this.chainId);
  }

  async suggestExperimental(experimentalChain) {
    return await this.command(async () => {
      if (window.keplr.experimentalSuggestChain) {
        return await window.keplr.experimentalSuggestChain(experimentalChain);
      } else {
        throw "Unexpected: Experimental chains are not supported by your Keplr wallet";
      }
    });
  }

  // This Kelpr wallet specific method allows to call for the 
  // window.keplr functions while always properly waiting for
  // the window to load and checking that the Keplr extension
  // is installed
  async command(command) {
    try {
      if (!window.getOfflineSigner || !window.keplr) {
        throw "Keplr extension is not installed";
      }
      return await command();
    } catch (err) {
      throw err;
    }
  }

}

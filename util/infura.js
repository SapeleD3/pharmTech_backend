const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');

export default class InfuraHelper {
  constructor() {
    this.mnemonic = process.env.MNEMONIC;
    this.infuraKey = process.env.INFURA_KEY;
  }

  get_web3_instance() {
    const resource_url = `https://ropsten.infura.io/v3/${this.infuraKey}`;
    const web3 = new Web3(new HDWalletProvider(this.mnemonic, resource_url));
    return web3;
  }
}

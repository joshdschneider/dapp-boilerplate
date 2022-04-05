import Web3 from 'web3'
import EventEmitter from 'events'
import detectEthereumProvider from '@metamask/detect-provider'

export class MetaMaskConnector extends EventEmitter {
  account: String | null
  chainId: Number | null
  blockNumber: Number | null
  provider: any

  constructor() {
    super()
    this.account = null
    this.chainId = null
    this.blockNumber = null
    this.provider = null
  }

  private handleAccountsChanged(accounts: Array<String>) {
    if (!!accounts && accounts.length > 0) {
      this.account = accounts[0]
      this.emit('accountChanged', this.account)
    } else {
      this.handleDisconnect()
    }
  }

  private handleChainChanged(chain: any) {
    const web3 = new Web3()
    this.chainId = web3.utils.hexToNumber(chain)
    this.emit('chainChanged', this.chainId)
  }

  private handleDisconnect() {
    this.account = null
    this.chainId = null
    this.blockNumber = null
    this.provider = null
    this.emit('disconnect')
  }

  public active() {
    if (!!this.provider && !!this.account) return true
    return false
  }

  public async activate() {
    const detectedProvider: any = await detectEthereumProvider()
    if (!detectedProvider) throw new Error('No provider found.')
    const web3 = new Web3(detectedProvider)
    const accounts = await web3.eth.requestAccounts()
    if (!accounts || accounts.length <= 0) throw new Error('No account found.')
    this.provider = detectedProvider
    this.provider.on('accountsChanged', (a: Array<String>) => this.handleAccountsChanged(a))
    this.provider.on('chainChanged', (c: String) => this.handleChainChanged(c))
    this.account = accounts[0]
    this.chainId = await web3.eth.getChainId()
    this.blockNumber = await web3.eth.getBlockNumber()
    return this
  }

  public async deactivate() {
    this.handleDisconnect()
  }
}

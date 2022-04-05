import Web3 from 'web3'
import EventEmitter from 'events'
import Fortmatic from 'fortmatic'
import { fortmaticUrl } from '../utils/constants'

export class FortmaticConnector extends EventEmitter {
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

  public active() {
    if (!!this.provider && !!this.account) return true
    return false
  }

  public async activate() {
    const fortmaticProvider: any = new Fortmatic(fortmaticUrl)
    const web3 = new Web3(fortmaticProvider.getProvider())
    const accounts = await web3.eth.getAccounts()
    if (!accounts || accounts.length <= 0) throw new Error('No account found.')
    this.provider = fortmaticProvider
    this.account = accounts[0]
    this.chainId = await web3.eth.getChainId()
    this.blockNumber = await web3.eth.getBlockNumber()
    return this
  }

  public async deactivate() {
    if (!!this.provider) {
      let active = await this.provider.user.isLoggedIn()
      if (active) this.provider.user.logout()
    }

    this.account = null
    this.chainId = null
    this.blockNumber = null
    this.provider = null
    this.emit('disconnect')
  }
}

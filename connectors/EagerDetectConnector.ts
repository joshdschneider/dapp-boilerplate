import { useContext, useEffect } from 'react'
import { ConnectorContext } from '../context/ConnectorContext'
import { CoinbaseWalletConnector } from './CoinbaseWalletConnector'
import { FortmaticConnector } from './FortmaticConnector'
import { MetaMaskConnector } from './MetaMaskConnector'
import { WalletConnectConnector } from './WalletConnectConnector'

export const EagerDetectConnector = () => {
  const { setConnector } = useContext(ConnectorContext)

  useEffect(() => {
    let method = localStorage.getItem('dcmethod')
    if (!!method) detectMethod()

    async function detectMethod() {
      try {
        switch (method) {
          case 'MetaMask':
            let metaMaskConnector = new MetaMaskConnector()
            await metaMaskConnector.activate()
            setConnector(metaMaskConnector)
            return

          case 'WalletConnect':
            let walletConnectConnector = new WalletConnectConnector()
            await walletConnectConnector.activate()
            setConnector(walletConnectConnector)
            return

          case 'CoinbaseWallet':
            let coinbaseWalletConnector = new CoinbaseWalletConnector()
            await coinbaseWalletConnector.activate()
            setConnector(coinbaseWalletConnector)
            return

          case 'Fortmatic':
            let fortmaticConnector = new FortmaticConnector()
            await fortmaticConnector.activate()
            setConnector(fortmaticConnector)
            return

          default:
            localStorage.removeItem('dcmethod')
            return
        }
      } catch (e) {
        localStorage.removeItem('dcmethod')
        console.error(e)
      }
    }
  }, [setConnector])

  return null
}

import { useContext, useEffect, useState } from 'react'
import { ConnectorContext } from '../context/ConnectorContext'

const useWallet = () => {
  const { connector } = useContext(ConnectorContext)
  const active = !!connector ? connector.active() : false
  const activate = () => connector.activate()
  const deactivate = () => connector.deactivate()
  const [account, setAccount] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [blockNumber, setBlockNumber] = useState(null)

  useEffect(() => {
    if (!!connector) {
      setAccount(connector.account)
      setChainId(connector.chainId)
      setBlockNumber(connector.blockNumber)
    }
  }, [connector])

  useEffect(() => {
    if (!!connector && !!connector.on) {
      connector.on('accountChanged', (account: any) => setAccount(account))
      connector.on('chainChanged', (chainId: any) => setChainId(chainId))
      connector.on('disconnect', () => disconnect())
    }

    function disconnect() {
      setAccount(null)
      setChainId(null)
      setBlockNumber(null)
      localStorage.removeItem('m721_method')
    }
  }, [connector])

  return {
    active,
    activate,
    deactivate,
    account,
    chainId,
    blockNumber,
  }
}

export default useWallet

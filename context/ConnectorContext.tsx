import { createContext, useState } from 'react'

export const ConnectorContext = createContext<any>({
  connector: null,
  setConnector: () => {},
})

export const ConnectorContextProvider = (props: any) => {
  const setConnector = (connector: any) => {
    setState({ ...state, connector: connector })
  }

  const initState = {
    connector: null,
    setConnector: setConnector,
  }

  const [state, setState] = useState(initState)

  return <ConnectorContext.Provider value={state}>{props.children}</ConnectorContext.Provider>
}

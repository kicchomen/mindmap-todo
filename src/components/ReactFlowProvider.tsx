import { ReactNode } from 'react'
import { ReactFlowProvider as OriginalReactFlowProvider } from 'reactflow'

interface ReactFlowProviderProps {
  children: ReactNode
}

export default function ReactFlowProviderWrapper({ children }: ReactFlowProviderProps) {
  return (
    <OriginalReactFlowProvider>
      {children}
    </OriginalReactFlowProvider>
  )
}
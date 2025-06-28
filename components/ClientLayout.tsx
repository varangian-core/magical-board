'use client'

import { useState, createContext, useContext } from 'react'
import NavigationSidebar from './NavigationSidebar'

const NavigationContext = createContext<{
  isExpanded: boolean
  setIsExpanded: (value: boolean) => void
}>({
  isExpanded: true,
  setIsExpanded: () => {}
})

export const useNavigation = () => useContext(NavigationContext)

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <NavigationContext.Provider value={{ isExpanded, setIsExpanded }}>
      <NavigationSidebar />
      <main className={`
        min-h-screen transition-all duration-300
        ${isExpanded ? 'md:ml-64' : 'ml-0'}
      `}>
        {children}
      </main>
    </NavigationContext.Provider>
  )
}